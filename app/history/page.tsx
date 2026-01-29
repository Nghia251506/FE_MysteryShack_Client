"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import axios from "axios";
import { 
  Clock, CheckCircle2, XCircle, Calendar, 
  MessageSquare, ChevronRight, Sparkles, 
  ArrowLeft, Eye, Inbox, ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- HELPERS (Giữ nguyên) ---
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

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'COMPLETED': return <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Hoàn thành</span>;
        case 'CANCELED': return <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 flex items-center gap-1"><XCircle className="w-3 h-3" /> Đã hủy</span>;
        case 'IN_PROGRESS': return <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Đang giải</span>;
        default: return <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1"><Clock className="w-3 h-3" /> Chờ xử lý</span>;
    }
};

export default function HistoryPage() {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); 
  const [selectedSession, setSelectedSession] = useState<any>(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && !user) router.push("/login");
    else if (token) fetchHistory();
  }, [user, token, isMounted]);

  useEffect(() => { setCurrentPage(1); }, [filter]);

  const fetchHistory = async () => {
    try {
        setLoading(true);
        const res = await axios.get('http://localhost:8080/api/v1/histories/my-history', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataList = Array.isArray(res.data) ? res.data : (res.data.content || []);
        const myHistory = dataList.map(transformHistoryData).sort((a: any, b: any) => b.rawDate - a.rawDate);
        setSessions(myHistory);
    } catch (error) { console.error("Lỗi tải lịch sử:", error); } finally { setLoading(false); }
  };

  const transformHistoryData = (item: any) => {
    const rawCards = item.request?.selectedCards || [];
    const cards = rawCards.map((c: any) => {
      const id = Number(c.cardId || 0);
      const localInfo = getCardDetail(id);
      return { id, name: c.nameVi || localInfo.name, img: c.imageUrl || localInfo.img, isReversed: c.reversed || false };
    });
    const form = item.interpretationForm;
    const resultText = form ? `${form.interpretation1 || ""}\n\n${form.interpretation2 || ""}\n\n${form.interpretation3 || ""}\n\nLời khuyên: ${form.advice || ""}` : "Reader chưa cập nhật kết quả chi tiết.";
    return {
      id: item.id, status: item.status, cards, 
      date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "N/A",
      rawDate: item.createdAt ? new Date(item.createdAt).getTime() : 0,
      question: item.question?.questionText || "Nội dung câu hỏi",
      topic: item.question?.topic?.name || "Chưa xác định",
      displayName: user?.role === "READER" ? (item.customer?.fullName || "Khách hàng") : (item.reader?.fullName || "Chờ Reader..."),
      displayAvatar: user?.role === "READER" ? (item.customer?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.customer?.id}`) : (item.reader?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.reader?.id}`),
      result: resultText, qrPayment: form?.qrPayment
    };
  };

  const filteredSessions = useMemo(() => sessions.filter(s => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return s.status === 'PENDING' || s.status === 'IN_PROGRESS';
    return s.status === filter;
  }), [sessions, filter]);

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const currentItems = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredSessions.slice(start, start + itemsPerPage);
  }, [filteredSessions, currentPage]);

  if (!isMounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header & Filter (Giữ nguyên UI của bạn) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-2 text-sm font-bold">
                  <ArrowLeft className="w-4 h-4"/> Quay lại trang chủ
                </Link>
                <h1 className="text-3xl font-bold text-white">Lịch sử trải bài</h1>
                <p className="text-slate-400 text-sm mt-1">Trang {currentPage}/{totalPages || 1}</p>
            </div>
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                {['ALL', 'PENDING', 'COMPLETED', 'CANCELED'].map((tab) => (
                    <button key={tab} onClick={() => setFilter(tab)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === tab ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>{tab === 'ALL' ? 'Tất cả' : tab === 'PENDING' ? 'Đang chờ' : tab === 'COMPLETED' ? 'Đã xong' : 'Đã hủy'}</button>
                ))}
            </div>
        </div>

        {/* List Content */}
        <div className="grid gap-4 min-h-[500px] content-start">
            <AnimatePresence mode="wait">
                <motion.div key={currentPage + filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4">
                    {currentItems.map((session) => (
                        <div key={session.id} className="bg-[#130823]/60 border border-slate-800/80 rounded-2xl p-6 hover:border-amber-500/30 transition-all group">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex -space-x-8 shrink-0">
                                    {session.cards?.slice(0, 3).map((c: any, i: number) => (
                                        <div key={i} className="w-12 h-20 rounded border border-slate-600 bg-slate-800 overflow-hidden relative shadow-md" style={{ zIndex: i }}>
                                            <img src={c.img} className="w-full h-full object-cover" alt="card" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <StatusBadge status={session.status} />
                                        <span className="text-slate-500 text-xs">ID: {session.id} • {session.date}</span>
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">{session.question}</h3>
                                </div>
                                <button onClick={() => setSelectedSession(session)} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-xl transition-all">
                                    <Eye className="w-4 h-4" /> Chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Pagination Controls (Giữ nguyên UI của bạn) */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-20"><ChevronLeft/></button>
                {/* Map số trang ở đây */}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-20"><ChevronRight/></button>
            </div>
        )}
      </div>

      {/* MODAL CHI TIẾT - PHẦN QUAN TRỌNG NHẤT BỊ THIẾU */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#1a1025] border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative">
              <button onClick={() => setSelectedSession(null)} className="absolute top-6 right-6 p-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-full z-10"><XCircle className="w-6 h-6"/></button>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <img src={selectedSession.displayAvatar} className="w-16 h-16 rounded-full border-2 border-amber-500/50 p-1" alt="Avatar" />
                  <div>
                    <div className="text-xs text-amber-500 font-bold uppercase tracking-widest">{user?.role === 'READER' ? 'Khách hàng' : 'Luận giải từ Reader'}</div>
                    <h2 className="text-2xl font-bold text-white">{selectedSession.displayName}</h2>
                    <p className="text-slate-400 text-sm">{selectedSession.date} • {selectedSession.topic}</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8">
                  <p className="text-white text-lg italic leading-relaxed">"{selectedSession.question}"</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10">
                  {selectedSession.cards?.map((card: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                        <img src={card.img} className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`} alt={card.name} />
                      </div>
                      <span className="text-slate-300 text-xs font-medium">{card.name}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/30 p-8 rounded-2xl border border-slate-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> Kết quả luận giải</h3>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed italic">{selectedSession.result}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}