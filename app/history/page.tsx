"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import axios from "axios"; // Import axios để gọi trực tiếp API chuẩn
import { 
  Clock, CheckCircle2, XCircle, Search, Calendar, 
  User, MessageSquare, ChevronRight, Sparkles, AlertCircle, 
  ArrowLeft, Eye, Inbox 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- HELPERS ---
const getCardDetail = (id: number) => {
  const safeId = Number(id);
  const getImg = (prefix: string, num: number) => 
    `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${num.toString().padStart(2, '0')}.jpg`;

  if (safeId <= 22) {
    const majors = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"];
    return { name: majors[safeId - 1] || `Major #${safeId}`, img: getImg("ar", safeId - 1) };
  }
  const suits = [{ name: "Wands", code: "wa" }, { name: "Cups", code: "cu" }, { name: "Swords", code: "sw" }, { name: "Pentacles", code: "pe" }];
  const minorIndex = safeId - 23; const suitIndex = Math.floor(minorIndex / 14); const rankIndex = minorIndex % 14;
  const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
  
  if (suitIndex < 4) return { name: `${ranks[rankIndex]} of ${suits[suitIndex].name}`, img: getImg(suits[suitIndex].code, rankIndex + 1) };
  return { name: `Card #${safeId}`, img: "https://placehold.co/150x250?text=?" };
};

// --- COMPONENTS ---
const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'COMPLETED': return <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Đã hoàn thành</span>;
        case 'REJECTED': return <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 flex items-center gap-1"><XCircle className="w-3 h-3" /> Từ chối</span>;
        case 'MATCHED': return <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Reader đang giải</span>;
        default: return <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1"><Clock className="w-3 h-3" /> Chờ xử lý</span>;
    }
};

export default function HistoryPage() {
  const router = useRouter();
  // Lấy cả user và token từ Redux
  const { user, token } = useSelector((state: RootState) => state.auth);
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); 
  const [selectedSession, setSelectedSession] = useState<any>(null); 

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchHistory();
  }, [user, token]);

  const fetchHistory = async () => {
    if (!token) return;
    try {
        setLoading(true);
        
        // --- SỬA LỖI TẠI ĐÂY: Gọi trực tiếp API /sessions thay vì /matched ---
        // API này trả về tất cả sessions, User thường được phép gọi
        const res = await axios.get('http://localhost:8080/api/v1/sessions', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const dataList = Array.isArray(res.data) ? res.data : (res.data.content || []);
        
        // Lọc phía Client: Chỉ lấy session của User đang đăng nhập
        const mySessions = dataList
            .filter((s: any) => 
                Number(s.customerId) === Number(user?.id) || 
                Number(s.customer?.id) === Number(user?.id)
            )
            .map(transformData)
            .sort((a: any, b: any) => b.rawDate - a.rawDate); // Mới nhất lên đầu

        setSessions(mySessions);
    } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
    } finally {
        setLoading(false);
    }
  };

  const transformData = (item: any) => {
      let cards: any[] = [];
      try {
          let raw = item.selectedCards;
          if (typeof raw === 'string') try { raw = JSON.parse(raw); } catch {}
          if(Array.isArray(raw)) {
              cards = raw.map((c: any, index: number) => {
                  const id = Number(c.cardId || c.id || 0);
                  const localInfo = getCardDetail(id);
                  return { 
                      id: id, 
                      name: c.nameVi || c.name || localInfo.name, 
                      img: c.imageUrl || c.image || localInfo.img,
                      isReversed: c.isReversed 
                  };
              });
          }
      } catch (e) {}

      // Lấy thông tin Reader
      const readerName = item.reader?.fullName || item.reader?.username || "Chưa có Reader";
      const readerAvatar = item.reader?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.readerId || 'reader'}`;

      // Format câu hỏi
      let question = item.question?.content || item.questionName || item.note || "Không có nội dung";
      if (question.includes("Hỏi:")) question = question.split("Hỏi:")[1].trim();

      return {
          id: item.id,
          status: item.status, 
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : "N/A",
          rawDate: item.createdAt ? new Date(item.createdAt).getTime() : 0,
          question: question,
          topic: "Tổng quan", 
          cards: cards,
          readerName,
          readerAvatar,
          // Lấy kết quả từ các trường interpretation
          result: item.interpretation1 
            ? `${item.interpretation1}\n\n${item.interpretation2 || ''}\n\n${item.interpretation3 || ''}\n\nLời khuyên: ${item.advice || ''}`
            : (item.result || "Reader chưa cập nhật kết quả chi tiết.")
      };
  };

  const filteredSessions = sessions.filter(s => {
      if (filter === 'ALL') return true;
      if (filter === 'PENDING') return s.status === 'PENDING' || s.status === 'MATCHED';
      return s.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans p-4 md:p-8 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-2 text-sm font-bold"><ArrowLeft className="w-4 h-4"/> Quay lại trang chủ</Link>
                <h1 className="text-3xl font-bold text-white">Lịch sử xem bài</h1>
                <p className="text-slate-400 text-sm mt-1">Theo dõi hành trình tâm linh và các câu trả lời từ vũ trụ.</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                {['ALL', 'PENDING', 'COMPLETED', 'REJECTED'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === tab ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {tab === 'ALL' ? 'Tất cả' : tab === 'PENDING' ? 'Đang xử lý' : tab === 'COMPLETED' ? 'Đã xong' : 'Từ chối'}
                    </button>
                ))}
            </div>
        </div>

        {/* Loading State */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 text-sm">Đang tải dữ liệu...</p>
            </div>
        ) : filteredSessions.length === 0 ? (
            <div className="text-center py-20 bg-[#130823]/40 rounded-3xl border border-slate-800">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <Inbox className="w-8 h-8"/>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Chưa có dữ liệu</h3>
                <p className="text-slate-400 text-sm mb-6">Bạn chưa thực hiện phiên xem bài nào.</p>
                <Link href="/tarot-draw" className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all">Rút bài ngay</Link>
            </div>
        ) : (
            <div className="grid gap-4">
                {filteredSessions.map((session) => (
                    <motion.div 
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#130823]/60 border border-slate-800/80 rounded-2xl p-6 hover:border-amber-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            
                            {/* Card Preview (Mini) */}
                            <div className="flex -space-x-8 md:mr-4 shrink-0">
                                {session.cards.slice(0, 3).map((c: any, i: number) => (
                                    <div key={i} className="w-12 h-20 rounded border border-slate-600 bg-slate-800 overflow-hidden relative shadow-md transform group-hover:-translate-y-1 transition-transform" style={{ zIndex: i }}>
                                        <img src={c.img} className="w-full h-full object-cover" alt="card" />
                                    </div>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">#{session.id}</span>
                                    <StatusBadge status={session.status} />
                                    <span className="text-slate-500 text-xs flex items-center gap-1 ml-auto md:ml-0"><Calendar className="w-3 h-3"/> {session.date}</span>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">{session.question}</h3>
                                
                                {session.status !== 'PENDING' && (
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
                                        <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-700"><img src={session.readerAvatar} alt="reader" /></div>
                                        <span>Reader: <span className="text-slate-300 font-bold">{session.readerName}</span></span>
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="ml-auto">
                                {session.status === 'COMPLETED' ? (
                                    <button onClick={() => setSelectedSession(session)} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-xl transition-all">
                                        <Eye className="w-4 h-4" /> Xem Chi Tiết
                                    </button>
                                ) : (
                                    <div className="px-5 py-2.5 opacity-50 text-sm font-bold text-slate-500 cursor-not-allowed flex items-center gap-2">
                                        Chi tiết <ChevronRight className="w-4 h-4"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
      </div>

      {/* --- DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedSession && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1a1025] border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative custom-scrollbar">
                    
                    {/* Close Button */}
                    <button onClick={() => setSelectedSession(null)} className="absolute top-6 right-6 p-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-full transition-colors z-10"><XCircle className="w-6 h-6"/></button>

                    {/* Modal Header */}
                    <div className="p-8 pb-0">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full border-2 border-amber-500/50 p-1">
                                <img src={selectedSession.readerAvatar} className="w-full h-full rounded-full object-cover" alt="Reader" />
                            </div>
                            <div>
                                <div className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-1">Kết quả luận giải</div>
                                <h2 className="text-2xl font-bold text-white">{selectedSession.readerName}</h2>
                                <p className="text-slate-400 text-sm">{selectedSession.date}</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8">
                            <div className="flex gap-2 text-slate-500 text-xs font-bold uppercase mb-2"><MessageSquare className="w-3 h-3"/> Câu hỏi của bạn</div>
                            <p className="text-white text-lg italic">"{selectedSession.question}"</p>
                        </div>
                    </div>

                    {/* Cards Display */}
                    <div className="px-8 mb-8">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400"/> Trải bài định mệnh</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {selectedSession.cards.map((card: any, idx: number) => (
                                <div key={idx} className="flex flex-col items-center gap-3">
                                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-slate-700 shadow-lg group">
                                        <img src={card.img} className="w-full h-full object-cover" alt={card.name} />
                                        {card.isReversed && <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Ngược</div>}
                                    </div>
                                    <span className="text-slate-300 text-sm font-medium text-center">{card.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interpretation Content */}
                    <div className="px-8 pb-8">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> Lời giải chi tiết</h3>
                        <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white max-w-none bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <p className="whitespace-pre-line leading-relaxed">{selectedSession.result}</p>
                        </div>
                        
                        {/* Rating CTA */}
                        <div className="mt-8 text-center pt-8 border-t border-slate-800">
                            <p className="text-slate-400 text-sm mb-4">Bạn hài lòng với kết quả này chứ?</p>
                            <div className="flex justify-center gap-4">
                                <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-sm font-bold transition-all">Gửi đánh giá</button>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}