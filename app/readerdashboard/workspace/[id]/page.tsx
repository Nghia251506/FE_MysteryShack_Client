"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, User, Calendar, Sparkles, QrCode, Send, 
  Bold, Italic, Wand2, CheckCircle2, DollarSign, Timer, ArrowLeft, Loader2 
} from "lucide-react";
import { ReadingSessionService } from "@/services/readingSessionService";
import { InterpretationService } from "@/services/interpretationService";
import { toast } from "react-hot-toast";

// --- HELPERS TỪ SOURCE CŨ ---
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

const getVietQR = (amount: number, content: string) => 
  `https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`;

const EditorToolbar = () => (
  <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-white/5 text-slate-400 rounded-t-xl select-none">
    <button className="p-1.5 hover:bg-white/10 rounded hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
    <button className="p-1.5 hover:bg-white/10 rounded hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
    <div className="w-px h-4 bg-white/10 mx-2"></div>
    <button className="flex items-center gap-1 text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-md border border-purple-500/30 hover:bg-purple-500/30 transition-colors ml-auto">
      <Wand2 className="w-3 h-3" /> AI Gợi ý
    </button>
  </div>
);

export default function WorkspacePage() {
  const { id } = useParams();
  const router = useRouter();

  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  // --- LOGIC TRANSFORM DATA (ĐÃ FIX LỖI RENDER OBJECT) ---
  const transformData = (item: any) => {
    let rawCreatedAt = item.createdAt || item.created_at || item.timestamp || new Date().toISOString();
    
    let querentName = item.customer?.fullName || item.fullName || "Khách ẩn danh";
    if (item.note && (querentName === "Khách ẩn danh" || querentName === "customer")) {
      if (item.note.includes("KH:")) {
        querentName = item.note.split("KH:")[1].split("-")[0].trim();
      }
    }

    // FIX: Bóc tách text từ object question để tránh lỗi React child
    let questionText = "Không có câu hỏi cụ thể";
    if (typeof item.question === 'string') {
      questionText = item.question;
    } else if (typeof item.question === 'object' && item.question !== null) {
      questionText = item.question.questionText || item.question.content || "Yêu cầu xem Tarot";
    } else if (item.questionName) {
      questionText = item.questionName;
    }

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
    } catch (e) { console.error("Transform cards error", e); }

    return {
      id: item.id,
      querentName,
      topic: item.topic || "Luận giải Tarot",
      question: questionText, // Bây giờ luôn là string
      birthDate: item.customer?.birthDate ? new Date(item.customer.birthDate).toLocaleDateString('vi-VN') : "N/A",
      timestamp: new Date(rawCreatedAt).toLocaleString('vi-VN'),
      cards,
      amount: item.amount || 50000,
      rawCreatedAt
    };
  };

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const response: any = await ReadingSessionService.getById(id as string);
        if (response) {
          const transformed = transformData(response);
          setActiveRequest(transformed);
          if (response.status === 'WAITING_PAYMENT' || response.status === 'COMPLETED') {
            setIsSent(true);
          }
        }
      } catch (err) {
        toast.error("Không tìm thấy phiên làm việc này");
        router.push("/readerdashboard");
      }
    };
    if (id) loadDetail();
  }, [id, router]);

  useEffect(() => {
    if (!activeRequest || isSent) return;
    const tick = () => {
      const startTime = new Date(activeRequest.rawCreatedAt).getTime();
      const limitTime = startTime + (60 * 60 * 1000); 
      const remaining = Math.max(0, Math.floor((limitTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) toast.error("Đã hết thời gian luận giải!");
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeRequest, isSent]);

  const handleSubmit = async () => {
    if (!activeRequest) return;
    if (Object.keys(cardInputs).length < activeRequest.cards.length || !summary) {
      toast.error("Vui lòng nhập đủ luận giải cho các lá bài và lời khuyên!");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        interpretation1: cardInputs[activeRequest.cards[0]?.id] || "",
        interpretation2: cardInputs[activeRequest.cards[1]?.id] || "",
        interpretation3: cardInputs[activeRequest.cards[2]?.id] || "",
        advice: summary,
        qrPayment: getVietQR(activeRequest.amount, `Thanh toan don ${activeRequest.id}`)
      };
      await InterpretationService.submit(activeRequest.id, payload);
      toast.success("Gửi kết quả thành công!");
      setIsSent(true);
    } catch (e) {
      toast.error("Gửi kết quả thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    setConfirmingPayment(true);
    try {
      await InterpretationService.confirmPayment(activeRequest.id);
      toast.success("Xác nhận thành công!");
      router.push("/readerdashboard/history");
    } catch (e) {
      toast.error("Xác nhận thất bại.");
    } finally {
      setConfirmingPayment(false);
    }
  };

  if (!activeRequest) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#050505] space-y-4">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      <div className="text-slate-400 font-mono tracking-widest text-xs uppercase">Kết nối tín hiệu...</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-32 relative z-10">
      <AnimatePresence mode="wait">
        {!isSent ? (
          <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            {/* Header */}
            <div className="bg-[#130823]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
              <div className="flex-1">
                <button onClick={() => router.push("/readerdashboard")} className="flex items-center gap-2 text-slate-500 hover:text-amber-500 text-xs mb-4 transition-all group">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform"/> Quay về Dashboard
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 tracking-tighter uppercase">Phiên: #{activeRequest.id}</span>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-widest"><Clock className="w-3 h-3"/> {activeRequest.timestamp}</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{activeRequest.topic}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400 font-medium">
                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5"><User className="w-4 h-4 text-purple-400"/> {activeRequest.querentName}</span>
                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5"><Calendar className="w-4 h-4 text-blue-400"/> {activeRequest.birthDate}</span>
                </div>
                <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl italic text-slate-300 text-sm">
                   "{activeRequest.question}"
                </div>
              </div>
              <div className="flex flex-col items-center px-8 py-5 bg-gradient-to-b from-white/5 to-transparent rounded-[2rem] border border-white/10 min-w-[160px]">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Thời gian còn lại</span>
                <div className={`text-3xl font-mono font-black ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-amber-500'}`}>
                  {Math.floor(timeLeft/60).toString().padStart(2,'0')}:{(timeLeft%60).toString().padStart(2,'0')}
                </div>
              </div>
            </div>

            {/* Main Editor */}
            <div className="bg-[#130823]/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 space-y-12 shadow-2xl">
              {activeRequest.cards.map((card: any, index: number) => (
                <div key={card.id} className="flex flex-col lg:flex-row gap-10 pb-12 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="w-full lg:w-56 shrink-0 flex flex-col items-center">
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-b from-amber-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img 
                        src={card.img} 
                        className={`w-44 h-72 object-cover rounded-xl border-2 border-white/10 shadow-2xl relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:border-amber-500/50 ${card.isReversed ? 'rotate-180' : ''}`} 
                        alt={card.name} 
                      />
                      {card.isReversed && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">LÁ NGƯỢC</div>
                      )}
                    </div>
                    <div className="mt-6 text-center">
                      <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.2em]">Lá bài thứ {index + 1}</span>
                      <h3 className="text-white font-black text-lg mt-1 tracking-tight uppercase">{card.name}</h3>
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500"/> Nội dung luận giải
                    </label>
                    <div className="flex-grow flex flex-col bg-black/40 rounded-[1.5rem] border border-white/5 overflow-hidden focus-within:border-amber-500/30 transition-all shadow-inner">
                      <EditorToolbar />
                      <textarea 
                        value={cardInputs[card.id] || ""} 
                        onChange={(e) => setCardInputs({...cardInputs, [card.id]: e.target.value})} 
                        className="w-full h-48 bg-transparent border-none p-6 outline-none text-slate-200 text-base leading-relaxed resize-none placeholder:text-slate-700 placeholder:italic font-medium" 
                        placeholder={`Nhập thông điệp sâu sắc từ lá ${card.name}...`} 
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-10 border-t border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                    <Wand2 className="w-5 h-5 text-amber-400"/> Lời khuyên tổng quát
                  </h3>
                  <div className="bg-black/40 rounded-[1.5rem] border border-white/5 overflow-hidden focus-within:border-purple-500/30 transition-all shadow-inner">
                    <EditorToolbar />
                    <textarea 
                      value={summary} 
                      onChange={(e) => setSummary(e.target.value)} 
                      className="w-full h-48 bg-transparent border-none p-6 outline-none text-slate-200 text-base leading-relaxed resize-none placeholder:text-slate-700 font-medium" 
                      placeholder="Đúc kết thông điệp cuối cùng cho khách hàng..." 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                    <QrCode className="w-5 h-5 text-green-400"/> Thông tin thanh toán
                  </h3>
                  <div className="bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] p-8 border border-white/10 flex flex-col sm:flex-row gap-8 items-center shadow-2xl relative overflow-hidden group">
                    <div className="p-3 bg-white rounded-2xl shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <img src={getVietQR(activeRequest.amount, `Thanh toan don ${activeRequest.id}`)} alt="QR" className="w-32 h-32"/>
                    </div>
                    <div className="space-y-4 flex-1 relative z-10 text-center sm:text-left">
                      <div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Số tiền cần trả</span>
                        <div className="text-3xl font-black text-green-400 tracking-tighter">
                          {activeRequest.amount.toLocaleString()}<span className="text-lg ml-1 font-bold">đ</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">QR tự động cho {activeRequest.querentName}.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-8 left-0 lg:left-64 right-0 z-40 px-6 flex justify-center">
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-[#1a1025]/90 border border-white/10 p-3 pl-8 rounded-[2rem] flex items-center gap-8 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-3 h-3 rounded-full border border-black ${Object.keys(cardInputs).length >= i ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-800'}`}></div>
                    ))}
                  </div>
                  <span className="text-slate-300 text-xs font-black uppercase tracking-widest">
                    Tiến độ: {Object.keys(cardInputs).length}/{activeRequest.cards.length} LÁ
                  </span>
                </div>
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting} 
                  className="bg-gradient-to-r from-amber-600 to-orange-600 px-10 py-4 rounded-2xl text-white font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                  GỬI KẾT QUẢ
                </button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center min-h-[75vh]">
            <div className="bg-[#130823]/80 backdrop-blur-2xl border border-green-500/20 rounded-[4rem] p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 relative">
                <CheckCircle2 className="w-12 h-12 text-green-400 relative z-10" />
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase">Gửi Thành Công!</h2>
              <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto font-medium">Thông điệp đã được gửi. Hãy xác nhận sau khi nhận thanh toán.</p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleConfirmPayment} 
                  disabled={confirmingPayment} 
                  className="px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 text-white font-black rounded-[2rem] transition-all flex items-center gap-3 mx-auto shadow-2xl active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
                >
                  {confirmingPayment ? <Loader2 className="w-5 h-5 animate-spin"/> : <DollarSign className="w-5 h-5" />}
                  Xác Nhận Đã Nhận Tiền
                </button>
                <button onClick={() => router.push("/readerdashboard")} className="text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors mt-4">
                  Quay lại Dashboard sau
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}