"use client";

import React, { useState, useEffect } from "react";
import { HistoryService } from "@/services/historyService";
import { InterpretationService } from "@/services/interpretationService";
import { 
  Search, User, ExternalLink, ChevronLeft, ChevronRight, 
  CheckCircle2, Clock, Loader2, XCircle, Filter, Calendar 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";



const STATUS_FILTERS = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ thanh toán", value: "WAITING_PAYMENT" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã từ chối", value: "CANCELED" },
  { label: "Đang xử lý", value: "PROCESSING" },
];

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  // --- LOGIC TRANSFORM DATA TỪ SOURCE CŨ ---
  const transformHistoryItem = (item: any) => {
    // Xử lý tên khách hàng từ note nếu tên mặc định là ẩn danh (giữ đúng logic cũ của ông)
    let querentName = item.customer?.fullName || item.fullName || "Khách ẩn danh";
    if (item.note && (querentName === "Khách ẩn danh" || querentName === "customer")) {
      if (item.note.includes("KH:")) {
        querentName = item.note.split("KH:")[1].split("-")[0].trim();
      }
    }

    // Xử lý ngày sinh (giữ đúng logic format cũ)
    let birthDateDisplay = "N/A";
    const rawDob = item.customer?.birthDate || item.birthDate;
    if (rawDob) {
      try {
        if (Array.isArray(rawDob)) {
          birthDateDisplay = `${rawDob[2]}/${rawDob[1]}/${rawDob[0]}`;
        } else {
          const d = new Date(rawDob);
          birthDateDisplay = !isNaN(d.getTime()) ? d.toLocaleDateString('vi-VN') : String(rawDob);
        }
      } catch { birthDateDisplay = String(rawDob); }
    }

    return {
      ...item,
      displayId: item.id,
      querentName,
      birthDate: birthDateDisplay,
      dateFormatted: new Date(item.createdAt || item.timestamp).toLocaleString('vi-VN'),
      amount: item.amount || 50000
    };
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response: any = await HistoryService.getMyHistories();
      const dataList = Array.isArray(response) ? response : (response.content || []);
      setHistory(dataList.map(transformHistoryItem));
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử:", error);
      toast.error("Không thể tải dữ liệu lịch sử");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  const handleConfirmPayment = async (sessionId: string | number) => {
    setProcessingId(sessionId);
    try {
      await InterpretationService.confirmPayment(sessionId);
      toast.success("Đã xác nhận thanh toán!");
      await fetchHistory(); // Reload lại danh sách
    } catch (error: any) {
      toast.error(error.message || "Xác nhận thất bại.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleClickDetail = (sessionId: string | number) => {
    // Xử lý khi người dùng nhấn vào nút chi tiết (nếu cần)
    router.push(`/readerdashboard/workspace/${sessionId}`);
    console.log("Chi tiết lịch sử ID:", sessionId);
  }

  const filteredHistory = history.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.querentName.toLowerCase().includes(searchLower) || 
      item.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const currentItems = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  console.log(currentItems)

  const renderStatus = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]"><CheckCircle2 className="w-3 h-3"/> HOÀN THÀNH</span>;
      case 'WAITING_PAYMENT':
        return <span className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-400/20 animate-pulse"><Clock className="w-3 h-3"/> CHỜ THANH TOÁN</span>;
      case 'CANCELED':
      case 'REJECTED':
        return <span className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-400/20"><XCircle className="w-3 h-3"/> ĐÃ TỪ CHỐI</span>;
      default:
        return <span className="text-slate-400 bg-white/5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/10 uppercase font-mono">{status}</span>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-6 py-8 relative z-10">
      <header className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Lịch sử <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-black">QUẢN LÝ</span></h2>
            <p className="text-slate-400 text-sm mt-1 font-medium italic opacity-80">Tra cứu thông tin khách hàng và trạng thái tài chính.</p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" placeholder="Tìm ID hoặc tên khách hàng..." 
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 w-full text-sm text-white focus:border-amber-500/50 outline-none transition-all shadow-2xl backdrop-blur-sm"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#1a1025]/60 border border-white/5 rounded-[1.25rem] w-fit backdrop-blur-md">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-5 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all ${
                statusFilter === f.value 
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-900/20 scale-105" 
                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-[#130823]/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03] text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-white/5">
              <tr>
                <th className="px-8 py-6">Thông tin Phiên</th>
                <th className="px-8 py-6">Khách hàng</th>
                <th className="px-8 py-6 text-center">Trạng thái</th>
                <th className="px-8 py-6 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr><td colSpan={4} className="py-32 text-center text-slate-500 font-mono text-xs tracking-widest animate-pulse italic">Kết nối dữ liệu tâm linh...</td></tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={item.id} 
                      className="group hover:bg-white/[0.03] transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="font-mono text-sm text-amber-500 font-black mb-1">#{item.request.id}</div>
                        <div className="text-slate-500 text-[10px] flex items-center gap-1 font-medium"><Calendar className="w-3 h-3"/> {item.dateFormatted}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 text-slate-300 group-hover:border-amber-500/30 transition-colors shadow-inner">
                            <User className="w-5 h-5"/>
                          </div>
                          <div>
                            <div className="text-sm text-slate-100 font-bold group-hover:text-amber-200 transition-colors">{item.querentName}</div>
                            <div className="text-[10px] text-slate-500 font-medium">NS: {item.birthDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">{renderStatus(item.status)}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 items-center">
                          {item.status === 'WAITING_PAYMENT' && (
                            <button 
                              onClick={() => handleConfirmPayment(item.request.id)}
                              disabled={processingId === item.id}
                              className="group/btn flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-[11px] font-black rounded-xl transition-all shadow-xl hover:shadow-green-900/30 active:scale-95 disabled:opacity-50"
                            >
                              {processingId === item.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <CheckCircle2 className="w-3 h-3 group-hover/btn:scale-125 transition-transform"/>}
                              XÁC NHẬN TIỀN
                            </button>
                          )}
                          <div className="text-right mr-2 hidden md:block">
                            <div className="text-xs font-black text-slate-200">{(item.request.amount || 0).toLocaleString()}đ</div>
                          </div>
                          <button onClick={() => handleClickDetail(item.request.id)} className="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 border border-white/5 transition-all active:scale-90">
                            <ExternalLink className="w-4 h-4"/>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center opacity-20">
                        <Filter className="w-16 h-16 mb-4 text-slate-400" />
                        <p className="text-slate-300 text-lg font-bold tracking-widest uppercase">Không tìm thấy lịch sử trải bài nào</p>
                        <p className="text-slate-500 text-sm mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <div className="px-8 py-6 bg-black/20 border-t border-white/5 flex items-center justify-between backdrop-blur-md">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Bản ghi {currentPage} &mdash; {totalPages}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-5 hover:bg-white/10 hover:text-white transition-all active:scale-90"
              >
                <ChevronLeft className="w-5 h-5"/>
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages} 
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-5 hover:bg-white/10 hover:text-white transition-all active:scale-90"
              >
                <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}