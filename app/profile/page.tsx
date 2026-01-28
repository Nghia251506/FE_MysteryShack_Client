"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Calendar, Mail, LogOut, Sparkles, 
  Clock, CheckCircle2, XCircle, ChevronRight, 
  Loader2, History, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/features/authSlice";
import { LogoutModal } from "@/components/LogoutModal";
import { ReadingSessionService } from "@/services/readingSessionService";

// --- HELPER: ZODIAC ---
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
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- FETCH DATA THẬT ---
  useEffect(() => {
    if (user) {
        fetchRecentSessions();
    }
  }, [user]);

  const fetchRecentSessions = async () => {
      try {
          const response: any = await ReadingSessionService.getAll();
          const dataList = Array.isArray(response) ? response : (response.content || []);
          
          // Lọc session của User hiện tại & Lấy 3 cái mới nhất
          const mySessions = dataList
              .filter((s: any) => 
                  Number(s.customerId) === Number(user?.id) || 
                  Number(s.customer?.id) === Number(user?.id)
              )
              .sort((a: any, b: any) => {
                  const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                  const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                  return dateB - dateA;
              })
              .slice(0, 3); // Chỉ lấy 3 cái hiển thị ở Profile

          setRecentSessions(mySessions);
      } catch (error) {
          console.error("Lỗi lấy dữ liệu profile:", error);
      } finally {
          setLoading(false);
      }
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  
  const handleConfirmLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!isMounted) return null;
  if (!user) { router.push("/login"); return null; }

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'COMPLETED': return <span className="px-2.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Xong</span>;
          case 'PENDING': 
          case 'MATCHED': return <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Đợi</span>;
          case 'REJECTED': return <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> Hủy</span>;
          default: return <span className="px-2.5 py-0.5 bg-slate-700 text-slate-300 border border-slate-600 rounded-full text-[10px] font-bold">{status}</span>;
      }
  };

  const displayDob = user.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : "Chưa cập nhật";

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
                <div onClick={() => router.push('/')} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    <span className="font-bold text-xl text-white">MysteryShack<span className="text-amber-500">Tarot</span></span>
                </div>
                <button onClick={() => router.push('/tarot-draw')} className="px-5 py-2 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/20 hover:scale-105 transition-all text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Đặt câu hỏi mới
                </button>
            </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- CỘT TRÁI: THÔNG TIN USER --- */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#130823]/60 border border-white/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
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
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div className="overflow-hidden">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Email</p>
                                    <p className="text-sm text-slate-200 truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Ngày sinh</p>
                                    <p className="text-sm text-slate-200 font-medium">{displayDob}</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleLogoutClick} className="w-full mt-8 py-3 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 rounded-xl border border-red-500/20 transition-colors font-bold text-sm">
                            <LogOut className="w-4 h-4" /> Đăng xuất
                        </button>
                    </motion.div>
                </div>
                
                {/* --- CỘT PHẢI: HOẠT ĐỘNG GẦN ĐÂY --- */}
                <div className="lg:col-span-8">
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white">Tổng quan <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">Năng Lượng</span></h2>
                            <p className="text-slate-400 text-sm mt-1">Các phiên trải bài gần đây nhất của bạn.</p>
                        </div>
                        
                        {/* NÚT LINK SANG TRANG HISTORY */}
                        <button onClick={() => router.push('/history')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all group">
                            <History className="w-4 h-4 text-amber-500" /> Xem toàn bộ lịch sử <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-20 text-slate-500"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2"/>Đang đồng bộ dữ liệu...</div>
                        ) : recentSessions.length === 0 ? (
                            <div className="text-center py-16 bg-[#130823]/40 rounded-3xl border border-slate-800 border-dashed">
                                <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
                                <p className="text-slate-400 mb-4">Bạn chưa thực hiện phiên xem bài nào.</p>
                                <button onClick={() => router.push('/tarot-draw')} className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all text-sm">Bắt đầu ngay</button>
                            </div>
                        ) : (
                            <>
                                {recentSessions.map((session, index) => (
                                    <motion.div 
                                        key={session.id} 
                                        initial={{ opacity: 0, x: 20 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => router.push('/history')} // Bấm vào thì sang History xem chi tiết
                                        className="bg-[#1a1025]/80 border border-white/5 rounded-2xl p-5 hover:border-amber-500/30 hover:bg-[#1a1025] transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">#{session.id}</span>
                                                {getStatusBadge(session.status)}
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">{session.createdAt ? new Date(session.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-3">
                                            <div>
                                                <h4 className="text-white font-bold text-lg group-hover:text-amber-400 transition-colors line-clamp-1">
                                                    {session.topicId === 1 ? "Tổng Quan" : session.topicId === 2 ? "Tình Yêu" : "Sự Nghiệp"}
                                                </h4>
                                                <p className="text-slate-400 text-sm line-clamp-1 italic">
                                                    "{session.question?.content || session.questionName || "..."}"
                                                </p>
                                            </div>
                                            <div className="bg-white/5 p-2 rounded-full group-hover:bg-amber-500/20 transition-colors">
                                                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-500" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        {/* --- LOGOUT POP-UP --- */}
        <LogoutModal 
            isOpen={showLogoutModal} 
            onClose={() => setShowLogoutModal(false)} 
            onConfirm={handleConfirmLogout} 
        />
    </div>
  );
}