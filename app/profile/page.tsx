"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Calendar, Mail, LogOut, Sparkles, 
  Clock, CheckCircle2, XCircle, ChevronRight, 
  Loader2, Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/features/authSlice";
import { LogoutModal } from "@/components/LogoutModal"; // Đảm bảo bạn đã tạo file này trong components

// --- MOCK DATA ---
const MOCK_SESSIONS = [
  { id: 101, topic: "Tình Yêu", question: "Người ấy nghĩ gì về tôi?", reader: "Grand Master Giang", date: "2024-01-26T14:30:00", status: "COMPLETED", price: "500.000đ", result: "Lá bài The Lovers..." },
  { id: 102, topic: "Sự Nghiệp", question: "Có nên nhảy việc lúc này?", reader: "Tarot Reader Linh", date: "2024-01-27T09:00:00", status: "PENDING", price: "300.000đ", result: null },
];

const getZodiac = (dateString: string | undefined) => {
    if(!dateString) return "Bí ẩn";
    const date = new Date(dateString);
    if(isNaN(date.getTime())) return "Bí ẩn";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    if((month == 1 && day <= 19) || (month == 12 && day >=22)) return "Ma Kết";
    if((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Bảo Bình";
    if((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Song Ngư";
    if((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Bạch Dương";
    if((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Kim Ngưu";
    if((month == 5 && day >= 21) || (month == 6 && day <= 21)) return "Song Tử";
    if((month == 6 && day >= 22) || (month == 7 && day <= 22)) return "Cự Giải";
    if((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Sư Tử";
    if((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Xử Nữ";
    if((month == 9 && day >= 23) || (month == 10 && day <= 23)) return "Thiên Bình";
    if((month == 10 && day >= 24) || (month == 11 && day <= 21)) return "Bọ Cạp";
    return "Nhân Mã";
};

export default function UserProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isMounted, setIsMounted] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // State cho Logout Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setTimeout(() => {
        setSessions(MOCK_SESSIONS);
        setLoading(false);
    }, 1000);
  }, []);

  // Mở Modal thay vì dùng confirm()
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Logic thực hiện đăng xuất thật sự
  const handleConfirmLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!isMounted) return null;

  if (!user) {
      router.push("/login");
      return null;
  }

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'COMPLETED': return <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Hoàn thành</span>;
          case 'PENDING': return <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Đang chờ</span>;
          default: return <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> Đã hủy</span>;
      }
  };

  const filteredSessions = activeTab === 'ALL' ? sessions : sessions.filter(s => s.status === activeTab);

  const displayDob = user.birthDate 
    ? new Date(user.birthDate).toLocaleDateString('vi-VN') 
    : "Chưa cập nhật";

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans relative selection:bg-amber-500/30">
        
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
             <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
             <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-amber-900/10 rounded-full blur-[100px]" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div onClick={() => router.push('/')} className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    <span className="font-bold text-xl text-white">Mystic<span className="text-amber-500">Tarot</span></span>
                </div>
                <button onClick={() => router.push('/tarot-draw')} className="px-5 py-2 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all text-sm">
                    + Đặt câu hỏi mới
                </button>
            </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- CỘT TRÁI: THÔNG TIN USER --- */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#130823]/60 border border-white/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden backdrop-blur-xl">
                        <div className="relative">
                            <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-br from-amber-400 to-purple-600 mb-4">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} className="w-full h-full rounded-full border-4 border-[#130823] bg-white object-cover" alt="Avatar" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user.fullName}</h2>
                            <p className="text-amber-500 text-sm font-medium flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3"/> Cung {getZodiac(user.birthDate)}
                            </p>
                        </div>

                        <div className="mt-8 space-y-4 text-left">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div className="overflow-hidden">
                                    <p className="text-xs text-slate-500 uppercase">Email</p>
                                    <p className="text-sm text-slate-200 truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Ngày sinh</p>
                                    <p className="text-sm text-slate-200 font-medium">{displayDob}</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleLogoutClick} className="w-full mt-8 py-3 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 rounded-xl border border-red-500/20 transition-colors font-bold">
                            <LogOut className="w-4 h-4" /> Đăng xuất
                        </button>
                    </motion.div>
                </div>
                
                {/* --- CỘT PHẢI: LỊCH SỬ XEM BÓI --- */}
                <div className="lg:col-span-8">
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-3xl font-bold text-white">Lịch sử <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">Tâm Linh</span></h2>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            {['ALL', 'PENDING', 'COMPLETED'].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                                    {tab === 'ALL' ? 'Tất cả' : (tab === 'PENDING' ? 'Đang chờ' : 'Hoàn thành')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-20 text-slate-500"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2"/>Đang tải dữ liệu vũ trụ...</div>
                        ) : filteredSessions.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                                <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
                                <p className="text-slate-400">Chưa có phiên xem bài nào.</p>
                                <button onClick={() => router.push('/tarot-draw')} className="mt-4 text-amber-500 hover:underline">Đặt câu hỏi ngay</button>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {filteredSessions.map((session, index) => (
                                    <motion.div key={session.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-[#1a1025]/80 border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all group relative overflow-hidden">
                                        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {getStatusBadge(session.status)}
                                                    <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(session.date).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{session.topic}</h3>
                                                <p className="text-slate-400 italic text-sm mb-3">"{session.question}"</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <User className="w-3 h-3" /> Reader: <span className="text-slate-300 font-medium">{session.reader}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center items-end gap-3 min-w-[120px]">
                                                <div className="text-right">
                                                    <p className="text-white font-bold text-lg">{session.price}</p>
                                                </div>
                                                {session.status === 'COMPLETED' ? (
                                                    <button onClick={() => setSelectedSession(session)} className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
                                                        Xem kết quả <ChevronRight className="w-4 h-4"/>
                                                    </button>
                                                ) : (
                                                    <button disabled className="px-5 py-2 bg-transparent text-slate-600 text-sm font-medium cursor-not-allowed">
                                                        Đang xử lý...
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        {/* --- MODAL CHI TIẾT --- */}
        <AnimatePresence>
            {selectedSession && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#130823] w-full max-w-2xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-amber-900/20 flex justify-between items-center sticky top-0 z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white">Chi tiết luận giải</h3>
                                <p className="text-xs text-slate-400">Mã phiên: #{selectedSession.id}</p>
                            </div>
                            <button onClick={() => setSelectedSession(null)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">✕</button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Câu hỏi của bạn</p>
                                <p className="text-white italic text-lg">"{selectedSession.question}"</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-amber-500 font-bold flex items-center gap-2"><Sparkles className="w-4 h-4"/> Thông điệp từ Reader {selectedSession.reader}</h4>
                                <div className="text-slate-300 leading-relaxed text-sm whitespace-pre-line p-4 bg-white/5 rounded-xl border border-white/5">
                                    {selectedSession.result || "Đang cập nhật nội dung chi tiết..."}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- LOGOUT POP-UP --- */}
        <LogoutModal 
            isOpen={showLogoutModal} 
            onClose={() => setShowLogoutModal(false)} 
            onConfirm={handleConfirmLogout} 
        />
    </div>
  );
}