// "use client";

// import React, { useState, useEffect } from "react";
// import { HistoryService } from "@/services/historyService";
// import { InterpretationService } from "@/services/interpretationService";
// import { Search, User, ExternalLink, Hash, ChevronLeft, ChevronRight, CheckCircle2, Clock, Loader2, XCircle, Filter } from "lucide-react";
// import { motion } from "framer-motion";
// import { toast } from "react-hot-toast";

// // Cập nhật danh sách filter theo yêu cầu mới
// const STATUS_FILTERS = [
//   { label: "Tất cả", value: "ALL" },
//   { label: "Chờ thanh toán", value: "WAITING_PAYMENT" },
//   { label: "Hoàn thành", value: "COMPLETED" },
//   { label: "Đã từ chối", value: "CANCELED" }, // Giả định backend dùng CANCELED cho đã từ chối
// ];

// export default function HistoryPage() {
//   const [history, setHistory] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState<string | number | null>(null);
  
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const fetchHistory = async () => {
//     setLoading(true);
//     try {
//       const data = await HistoryService.getMyHistories();
//       setHistory(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Lỗi khi lấy lịch sử:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchHistory(); }, []);

//   useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

//   const handleConfirmPayment = async (sessionId: string | number) => {
//     setProcessingId(sessionId);
//     try {
//       await InterpretationService.confirmPayment(sessionId);
//       toast.success("Đã xác nhận thanh toán!");
//       await fetchHistory();
//     } catch (error) {
//       toast.error("Xác nhận thất bại.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const filteredHistory = history.filter(item => {
//     const matchesSearch = 
//       item.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       item.id.toString().includes(searchTerm);
    
//     const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
//   const currentItems = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const renderStatus = (status: string) => {
//     switch (status) {
//       case 'COMPLETED':
//         return <span className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-400/20"><CheckCircle2 className="w-3 h-3"/> HOÀN THÀNH</span>;
//       case 'WAITING_PAYMENT':
//         return <span className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-400/20"><Clock className="w-3 h-3"/> CHỜ THANH TOÁN</span>;
//       case 'CANCELED':
//       case 'REJECTED':
//         return <span className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-400/20"><XCircle className="w-3 h-3"/> ĐÃ TỪ CHỐI</span>;
//       default:
//         return <span className="text-slate-400 bg-white/5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/10 uppercase">{status}</span>;
//     }
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-6 py-8 relative z-10">
//       <header className="flex flex-col gap-6 mb-10">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h2 className="text-3xl font-bold text-white tracking-tight">Lịch sử <span className="text-amber-500">Giao dịch</span></h2>
//             <p className="text-slate-400 text-sm mt-1">Tra cứu và phê duyệt thanh toán từ khách hàng.</p>
//           </div>
//           <div className="relative w-full md:w-72">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
//             <input 
//               type="text" placeholder="Tìm ID hoặc tên khách..." 
//               className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 w-full text-sm text-white focus:border-amber-500/50 outline-none transition-all shadow-inner"
//               value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* BỘ LỌC TRẠNG THÁI MỚI */}
//         <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
//           {STATUS_FILTERS.map((f) => (
//             <button
//               key={f.value}
//               onClick={() => setStatusFilter(f.value)}
//               className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
//                 statusFilter === f.value 
//                 ? "bg-amber-600 text-white shadow-lg shadow-amber-900/40" 
//                 : "text-slate-400 hover:text-white hover:bg-white/5"
//               }`}
//             >
//               {f.label}
//             </button>
//           ))}
//         </div>
//       </header>

//       <div className="bg-[#130823]/60 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl relative">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-white/5 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-white/5">
//               <tr>
//                 <th className="px-8 py-5">Mã Phiên</th>
//                 <th className="px-8 py-5">Khách hàng</th>
//                 <th className="px-8 py-5 text-center">Trạng thái</th>
//                 <th className="px-8 py-5 text-right">Thao tác</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {loading ? (
//                 <tr><td colSpan={4} className="py-20 text-center text-slate-500 animate-pulse">Đang tải lịch sử...</td></tr>
//               ) : currentItems.length > 0 ? (
//                 currentItems.map((item) => (
//                   <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
//                     <td className="px-8 py-5 font-mono text-xs text-amber-500 font-bold tracking-tighter">#{item.id}</td>
//                     <td className="px-8 py-5">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400"><User className="w-4 h-4"/></div>
//                         <span className="text-sm text-slate-200 font-medium">{item.customer?.fullName || "Khách ẩn danh"}</span>
//                       </div>
//                     </td>
//                     <td className="px-8 py-5 text-center">{renderStatus(item.status)}</td>
//                     <td className="px-8 py-5 text-right">
//                       <div className="flex justify-end gap-3">
//                         {item.status === 'WAITING_PAYMENT' && (
//                           <button 
//                             onClick={() => handleConfirmPayment(item.id)}
//                             disabled={processingId === item.id}
//                             className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-50"
//                           >
//                             {processingId === item.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <CheckCircle2 className="w-3 h-3"/>}
//                             XÁC NHẬN
//                           </button>
//                         )}
//                         <button className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all"><ExternalLink className="w-4 h-4"/></button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} className="py-24 text-center">
//                     <div className="flex flex-col items-center opacity-30">
//                       <Filter className="w-10 h-10 mb-4" />
//                       <p className="text-slate-300 text-sm">Không có dữ liệu phù hợp</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Phân trang */}
//         {!loading && totalPages > 1 && (
//           <div className="px-8 py-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
//             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Trang {currentPage} / {totalPages}</span>
//             <div className="flex gap-1.5">
//               <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-10 hover:bg-white/10 transition-all"><ChevronLeft className="w-4 h-4"/></button>
//               <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-10 hover:bg-white/10 transition-all"><ChevronRight className="w-4 h-4"/></button>
//             </div>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// }