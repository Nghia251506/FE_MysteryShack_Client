"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, User, Calendar, Sparkles, Send, 
  Wand2, CheckCircle2, DollarSign, ArrowLeft, Loader2,
  Banknote, ShieldCheck, Hourglass, AlertCircle, Save
} from "lucide-react";
import { ReadingSessionService } from "@/services/readingSessionService";
import { InterpretationService } from "@/services/interpretationService";
import { toast } from "react-hot-toast";
import { EditorToolbar } from "@/components/EditorToolbar";

// --- HELPERS CARD DETAIL ---
const getCardDetail = (id: number) => {
  const safeId = Number(id);
  const getImg = (prefix: string, num: number) => `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${num.toString().padStart(2, '0')}.jpg`;
  if (safeId <= 22) {
    const majors = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"];
    return { name: majors[safeId - 1] || `Major #${safeId}`, img: getImg("ar", safeId - 1) };
  }
  const suits = [{ name: "Wands", code: "wa" }, { name: "Cups", code: "cu" }, { name: "Swords", code: "sw" }, { name: "Pentacles", code: "pe" }];
  const minorIndex = safeId - 23; 
  const suitIndex = Math.floor(minorIndex / 14); 
  const rankIndex = minorIndex % 14;
  const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
  if (suitIndex < 4) return { name: `${ranks[rankIndex]} of ${suits[suitIndex].name}`, img: getImg(suits[suitIndex].code, rankIndex + 1) };
  return { name: `Card #${safeId}`, img: "https://placehold.co/150x250?text=?" };
};

export default function WorkspacePage() {
  const { id } = useParams();
  const router = useRouter();

  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [isTimeUp, setIsTimeUp] = useState(false);
  console.log("activeRequest:", activeRequest);
  const transformData = useCallback((item: any) => {
    const acceptedAt = item.acceptedAt || item.accepted_at;
    const querentName = item.customer?.fullName || item.fullName || "Khách ẩn danh";
    let questionText = item.question?.questionText || item.question?.content || "Yêu cầu xem Tarot";

    let cards: any[] = [];
    try {
      let raw = item.selectedCards;
      if (typeof raw === 'string') raw = JSON.parse(raw);
      if (Array.isArray(raw)) {
        cards = raw.map((c: any, index: number) => {
          const cardId = Number(c.cardId || c.id || 0);
          const localInfo = getCardDetail(cardId);
          return {
            id: cardId || (1000 + index),
            isReversed: c.isReversed || false,
            name: c.nameVi || c.name || localInfo.name,
            img: c.imageUrl || c.image || localInfo.img
          };
        });
      }
    } catch (e) { console.error(e); }

    return {
      id: item.id,
      querentName,
      topic: item.question?.topic?.name || "Luận giải Tarot",
      question: questionText,
      birthDate: item.customer?.birthDate ? new Date(item.customer.birthDate).toLocaleDateString('vi-VN') : "N/A",
      cards,
      status: item.status,
      acceptedAt: acceptedAt,
    };
  }, []);

  // --- LOGIC 1: LOAD DỮ LIỆU & NHÁP ---
  useEffect(() => {
    const initWorkspace = async () => {
      try {
        setLoading(true);
        const response: any = await ReadingSessionService.getById(id as string);
        const transformed = transformData(response);
        setActiveRequest(transformed);

        // Check thời hạn
        if (transformed.acceptedAt) {
          const startTime = new Date(transformed.acceptedAt).getTime();
          const endTime = startTime + (60 * 60 * 1000); 
          const diff = Math.floor((endTime - Date.now()) / 1000);
          if (diff <= 0) {
            setTimeLeft(0);
            setIsTimeUp(true);
            if (transformed.status !== 'COMPLETED') setIsReadOnly(true);
          } else {
            setTimeLeft(diff);
          }
        }

        // Tải dữ liệu thật từ DB trước
        try {
          const oldData = await InterpretationService.getView(id as string);
          if (oldData && (oldData.advice || oldData.interpretation1)) {
            const savedInputs: Record<number, string> = {};
            transformed.cards.forEach((card: any, idx: number) => {
              savedInputs[card.id] = oldData[`interpretation${idx + 1}`] || "";
            });
            setCardInputs(savedInputs);
            setSummary(oldData.advice || "");
            setAmount(oldData.amount || 0);
            setIsReadOnly(true);
          } else {
            // Nếu chưa có dữ liệu DB, mới tải từ Nháp LocalStorage
            const savedDraft = localStorage.getItem(`draft_session_${id}`);
            if (savedDraft) {
              const { cardInputs: dCard, summary: dSummary, amount: dAmount } = JSON.parse(savedDraft);
              setCardInputs(dCard || {});
              setSummary(dSummary || "");
              setAmount(dAmount || 0);
              toast("Đã khôi phục bản nháp chưa gửi!", { icon: '📝' });
            }
          }
        } catch (e) { console.log("New session workflow"); }

      } catch (err) {
        toast.error("Không tìm thấy phiên làm việc");
        router.push("/readerdashboard");
      } finally {
        setLoading(false);
      }
    };
    if (id) initWorkspace();
  }, [id, transformData, router]);

  // --- LOGIC 2: AUTO-SAVE NHÁP (DEBOUNCE 1s) ---
  useEffect(() => {
    if (!id || isReadOnly || isSubmitting || loading) return;

    const timer = setTimeout(() => {
      const draftData = { cardInputs, summary, amount };
      localStorage.setItem(`draft_session_${id}`, JSON.stringify(draftData));
    }, 1000);

    return () => clearTimeout(timer);
  }, [cardInputs, summary, amount, id, isReadOnly, isSubmitting, loading]);

  // COUNTDOWN TICKER
  useEffect(() => {
    if (isReadOnly || isTimeUp || !activeRequest?.acceptedAt || activeRequest.status === 'COMPLETED') return;

    const timer = setInterval(() => {
      const startTime = new Date(activeRequest.acceptedAt).getTime();
      const endTime = startTime + (60 * 60 * 1000);
      const diff = Math.floor((endTime - Date.now()) / 1000);

      if (diff <= 0) {
        setTimeLeft(0);
        setIsTimeUp(true);
        setIsReadOnly(true);
        clearInterval(timer);
      } else {
        setTimeLeft(diff);
        if (diff === 900) toast("Chỉ còn 15 phút!", { icon: '⏳' });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeRequest, isReadOnly, isTimeUp]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!activeRequest || isReadOnly) return;
    setIsSubmitting(true);
    try {
      const payload = {
        interpretation1: cardInputs[activeRequest.cards[0]?.id] || "",
        interpretation2: cardInputs[activeRequest.cards[1]?.id] || "",
        interpretation3: cardInputs[activeRequest.cards[2]?.id] || "",
        advice: summary,
        amount: amount,
      };
      await InterpretationService.submit(activeRequest.id, payload);
      
      // Xóa nháp khi gửi thành công
      localStorage.removeItem(`draft_session_${id}`);
      
      toast.success("Đã gửi kết quả!");
      setIsReadOnly(true);
      setActiveRequest((p:any) => ({...p, status: 'WAITING_PAYMENT'}));
    } catch (e) { toast.error("Lỗi gửi bài."); } finally { setIsSubmitting(false); }
  };

  const handleConfirmPayment = async () => {
    setConfirmingPayment(true);
    try {
      await InterpretationService.confirmPayment(activeRequest.id);
      toast.success("Thành công!");
      setActiveRequest((p:any) => ({...p, status: 'COMPLETED'}));
    } catch (e) { toast.error("Lỗi xác nhận."); } finally { setConfirmingPayment(false); }
  };

  if (loading) return <div className="h-screen bg-[#050505] flex items-center justify-center text-amber-500 animate-pulse font-black">LOADING...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-40 relative z-10">
      
      <AnimatePresence>
        {isTimeUp && activeRequest.status !== 'COMPLETED' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 text-center">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#1a0b2e] border border-red-500/30 p-12 rounded-[3rem] max-w-md w-full">
              <Hourglass className="w-12 h-12 text-red-500 mx-auto mb-6 animate-pulse" />
              <h3 className="text-3xl font-black text-white mb-4 uppercase">Hết thời gian!</h3>
              <p className="text-slate-400 mb-8 font-medium">Bạn đã quá giới hạn 1 tiếng để thực hiện luận giải.</p>
              <button onClick={() => router.push("/readerdashboard")} className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-xs">Quay về Dashboard</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        <div className="bg-[#130823]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex-1">
            <button onClick={() => router.push("/readerdashboard")} className="text-slate-500 text-xs mb-4 flex items-center gap-2 hover:text-amber-500 transition-colors"><ArrowLeft className="w-3 h-3"/> Quay về</button>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Chủ đề: {activeRequest.topic}</h2>
            <span className="text-l font-black text-amber-500 tracking-tighter uppercase italic">Câu hỏi: {activeRequest.question}</span>
            <div className="mt-2 flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>{activeRequest.querentName}</span>
                <span>•</span>
                <span>{activeRequest.birthDate}</span>
            </div>
          </div>
          
          {activeRequest.status !== 'COMPLETED' && !isReadOnly && (
            <div className="px-10 py-6 bg-white/5 rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden">
              <span className="text-[10px] text-slate-500 font-black uppercase mb-2 block">Thời hạn còn lại</span>
              <div className={`text-4xl font-mono font-black ${timeLeft < 600 ? 'text-red-500 animate-shake' : 'text-amber-500'}`}>
                {formatTime(timeLeft)}
              </div>
              {timeLeft < 600 && <div className="absolute inset-0 bg-red-600/5 animate-pulse" />}
            </div>
          )}
          {activeRequest.status === 'COMPLETED' && (
            <div className="px-10 py-6 bg-green-500/5 rounded-[2.5rem] border border-green-500/20 text-center">
               <ShieldCheck className="w-10 h-10 text-green-500 mx-auto mb-2" />
               <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">ĐÃ HOÀN TẤT</span>
            </div>
          )}
        </div>

        <div className="bg-[#130823]/60 backdrop-blur-xl border border-white/10 rounded-[3.5rem] p-12 space-y-16 shadow-2xl">
          {activeRequest.cards.map((card: any, index: number) => (
            <div key={card.id} className="flex flex-col lg:flex-row gap-12 pb-16 border-b border-white/5 last:border-0 last:pb-0">
              <div className="w-full lg:w-56 shrink-0 flex flex-col items-center">
                <img src={card.img} className={`w-48 h-72 object-cover rounded-2xl border-2 border-white/10 ${card.isReversed ? 'rotate-180' : ''}`} alt={card.name} />
                <h3 className="text-white font-black text-lg mt-6 uppercase text-center">{card.name}</h3>
              </div>
              <div className="flex-grow">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex gap-2 italic"><Sparkles className="w-3 h-3 text-amber-500"/> Giải mã quẻ bài</label>
                <div className={`bg-black/40 rounded-[2rem] border transition-all ${isReadOnly ? 'border-green-500/10' : 'border-white/5'} overflow-hidden`}>
                  {!isReadOnly && <EditorToolbar />}
                  <textarea value={cardInputs[card.id] || ""} readOnly={isReadOnly} onChange={(e) => setCardInputs({...cardInputs, [card.id]: e.target.value})} className="w-full h-48 bg-transparent p-8 outline-none text-slate-200 text-lg leading-relaxed font-medium" placeholder="Nhập luận giải..." />
                </div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-10 border-t border-white/10">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-2xl font-black text-white flex gap-3 uppercase italic"><Wand2 className="w-6 h-6 text-amber-400"/> Lời khuyên</h3>
              <div className={`bg-black/40 rounded-[2.5rem] border ${isReadOnly ? 'border-green-500/10' : 'border-white/5'} overflow-hidden`}>
                {!isReadOnly && <EditorToolbar />}
                <textarea value={summary} readOnly={isReadOnly} onChange={(e) => setSummary(e.target.value)} className="w-full h-48 bg-transparent p-8 outline-none text-slate-200 text-lg leading-relaxed font-medium" placeholder="Đúc kết thông điệp..." />
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-white flex gap-3 uppercase italic"><Banknote className="w-6 h-6 text-green-400"/> Chi phí</h3>
              <div className={`p-10 rounded-[3rem] border ${isReadOnly ? 'bg-green-500/5 border-green-500/20' : 'bg-black/40 border-white/5 focus-within:border-amber-500/50'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500"><DollarSign className="w-8 h-8" /></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Thanh toán (VNĐ)</p>
                    <input type="number" value={amount || ""} readOnly={isReadOnly} onChange={(e) => setAmount(Number(e.target.value))} className="bg-transparent border-none outline-none text-3xl font-black text-white w-full tracking-tighter" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 left-0 lg:left-64 right-0 z-40 px-6 flex justify-center">
        <AnimatePresence>
          {!isReadOnly && (
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-[#1a1025]/90 border border-white/10 p-4 px-10 rounded-[3rem] flex items-center gap-10 shadow-2xl backdrop-blur-3xl">
              <div className="flex flex-col items-start border-r border-white/10 pr-6">
                 <span className="text-[10px] text-green-500 font-black flex items-center gap-1 animate-pulse"><Save className="w-3 h-3"/> Tự động lưu</span>
                 <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{Object.keys(cardInputs).length}/{activeRequest.cards.length} LÁ XONG</span>
              </div>
              <button onClick={handleSubmit} disabled={isSubmitting} className="bg-amber-600 px-10 py-4 rounded-2xl text-white font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-900/20">{isSubmitting ? <Loader2 className="animate-spin"/> : "GỬI KẾT QUẢ"}</button>
            </motion.div>
          )}
          {isReadOnly && activeRequest.status !== 'COMPLETED' && (
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-[#0a1a12]/90 border border-green-500/20 p-4 px-12 rounded-[3rem] flex items-center gap-8 shadow-2xl backdrop-blur-3xl">
              <span className="text-white text-xs font-bold italic">Chờ nhận thanh toán...</span>
              <button onClick={handleConfirmPayment} disabled={confirmingPayment} className="bg-green-600 px-10 py-4 rounded-2xl text-white font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all">XÁC NHẬN TIỀN VỀ</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px) rotate(-1deg); }
          75% { transform: translateX(4px) rotate(1deg); }
        }
        .animate-shake { animation: shake 0.2s infinite; }
      `}</style>
    </div>
  );
}