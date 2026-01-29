"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Inbox, Clock, User, Calendar, MessageSquare, 
  ChevronRight, Timer, Filter, Search, Loader2,
  ChevronLeft, ArrowUpRight
} from "lucide-react";
import { ReadingSessionService } from "@/services/readingSessionService";
import { toast } from "react-hot-toast";

export default function ReaderDashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ignoredIds, setIgnoredIds] = useState<number[]>([]);

  // --- PHÂN TRANG FE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- TRANSFORM DATA (GIỮ LOGIC TÊN KHÁCH TỪ SOURCE CŨ) ---
  const transformData = useCallback((item: any) => {
    let rawCreatedAt = item.createdAt || item.created_at || item.timestamp || new Date().toISOString();
    
    // Lấy tên khách từ note (KH:...) hoặc mặc định
    let querentName = item.customer?.fullName || "Khách ẩn danh";
    if (item.note && (querentName === "Khách ẩn danh" || querentName === "customer")) {
      if (item.note.includes("KH:")) {
        querentName = item.note.split("KH:")[1].split("-")[0].trim();
      }
    }

    return {
      ...item,
      querentName,
      question: item.question?.content || item.question || "Yêu cầu xem Tarot tổng quan",
      birthDate: item.customer?.birthDate ? new Date(item.customer.birthDate).toLocaleDateString('vi-VN') : "N/A",
      timestamp: new Date(rawCreatedAt).toLocaleString('vi-VN'),
      rawCreatedAt
    };
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      const response: any = await ReadingSessionService.getAll();
      const dataList = Array.isArray(response) ? response : (response.content || []);
      
      // Lọc: Chỉ lấy PENDING/MATCHED và không nằm trong danh sách ẩn (ignoredIds)
      const pending = dataList
        .filter((i: any) => 
          (i.status === 'PENDING' || i.status === 'MATCHED') && 
          !ignoredIds.includes(i.id)
        )
        .map(transformData);
      
      setRequests(pending);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  }, [ignoredIds, transformData]);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // Tự động refresh mỗi 10s
    return () => clearInterval(interval);
  }, [fetchRequests]);

  // --- LOGIC TỪ CHỐI (IGNORE) ---
  const handleIgnore = (id: number) => {
    setIgnoredIds(prev => [...prev, id]);
    toast.success("Đã ẩn yêu cầu này");
  };

  // --- FILTER & PAGINATION ---
  const filteredRequests = requests.filter(r => 
    r.querentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentItems = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- COMPONENT TIMER 5 PHÚT (BÊ TỪ SOURCE CŨ) ---
  const RequestTimer = ({ rawCreatedAt, onExpire }: { rawCreatedAt: string, onExpire: () => void }) => {
    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(() => {
      const calculate = () => {
        const start = new Date(rawCreatedAt).getTime();
        const diff = Math.floor((start + 300000 - Date.now()) / 1000);
        if (diff <= 0) {
          onExpire();
        } else {
          setTimeLeft(diff);
        }
      };
      calculate();
      const timer = setInterval(calculate, 1000);
      return () => clearInterval(timer);
    }, [rawCreatedAt, onExpire]);

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return (
      <div className={`flex items-center gap-1.5 font-mono font-black ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-amber-500'}`}>
        <Timer className="w-3.5 h-3.5" />
        {mins}:{secs.toString().padStart(2, '0')}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <Inbox className="w-5 h-5 text-amber-500" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Yêu cầu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Mới</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium italic">Bạn đang có {requests.length} linh hồn đang chờ đợi lời giải đáp...</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm khách hàng..." 
            className="w-full bg-[#130823]/60 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-amber-500/50 outline-none transition-all backdrop-blur-xl shadow-2xl placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Đang tải yêu cầu...</span>
        </div>
      ) : currentItems.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {currentItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  key={item.id}
                  className="bg-[#130823]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 hover:border-amber-500/30 transition-all group relative overflow-hidden shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10 text-slate-400 group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all shadow-inner font-black uppercase">
                        {item.querentName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-black text-lg group-hover:text-amber-200 transition-colors">{item.querentName}</h3>
                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                          <Calendar className="w-3 h-3"/> {item.birthDate}
                        </p>
                      </div>
                    </div>
                    <RequestTimer rawCreatedAt={item.rawCreatedAt} onExpire={() => handleIgnore(item.id)} />
                  </div>

                  <div className="bg-black/30 rounded-2xl p-4 mb-6 border border-white/5 relative group-hover:bg-black/50 transition-colors">
                    <div className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3"/> Câu hỏi của khách
                    </div>
                    <p className="text-slate-300 text-sm italic leading-relaxed line-clamp-2">
                      "{item.question}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => router.push(`/readerdashboard/workspace/${item.id}`)}
                      className="flex-grow bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white py-3.5 rounded-xl font-black text-[11px] tracking-[0.15em] uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      Bắt đầu luận giải <ArrowUpRight className="w-4 h-4"/>
                    </button>
                    <button 
                      onClick={() => handleIgnore(item.id)}
                      className="p-3.5 bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-xl transition-all"
                    >
                      <Filter className="w-4 h-4"/>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Phân trang (Mới thêm) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-5 hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5"/>
              </button>
              <div className="flex gap-2">
                {Array.from({length: totalPages}).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-5 hover:bg-white/10 transition-all"
              >
                <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 opacity-20">
            <Clock className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Chưa có yêu cầu nào mới</p>
          <p className="text-slate-600 text-[10px] mt-2 italic font-medium">Hệ thống sẽ tự động cập nhật khi có tín hiệu tâm linh...</p>
        </div>
      )}
    </div>
  );
}