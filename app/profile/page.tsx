"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Calendar, Mail, LogOut, Sparkles,
    Clock, CheckCircle2, XCircle, ChevronRight,
    Loader2, History as HistoryIcon, ArrowRight,
    ChevronLeft, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/features/authSlice";
import { LogoutModal } from "@/components/LogoutModal";
import { HistoryService } from "@/services/historyService";
import { AuthService } from "@/services/authService";

// --- GIỮ NGUYÊN HELPERS CỦA ÔNG ---
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

const getZodiac = (dateString: string | undefined) => {
    if (!dateString) return "Bí ẩn";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Bí ẩn";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return "Ma Kết";
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Bảo Bình";
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Song Ngư";
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Bạch Dương";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Kim Ngưu";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return "Song Tử";
    if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return "Cự Giải";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Sư Tử";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Xử Nữ";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 23)) return "Thiên Bình";
    if ((month == 10 && day >= 24) || (month == 11 && day <= 21)) return "Bọ Cạp";
    return "Nhân Mã";
};

export default function UserProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const [isMounted, setIsMounted] = useState(false);
    const [allRecentSessions, setAllRecentSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    // Bỏ state selectedSession vì không dùng modal nữa

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => { setIsMounted(true); }, []);

    // --- GIỮ NGUYÊN LOGIC BIẾN ĐỔI DỮ LIỆU CỦA ÔNG ---
    const transformData = (item: any) => {
        const rawCards = item.request?.selectedCards || [];
        const cards = rawCards.map((c: any) => {
            const id = Number(c.cardId || 0);
            const localInfo = getCardDetail(id);
            return {
                id,
                name: c.nameVi || localInfo.name,
                img: c.imageUrl || localInfo.img,
                isReversed: c.reversed || false
            };
        });

        const form = item.interpretationForm;
        const messageText = form
            ? `${form.interpretation1 || ""}\n\n${form.interpretation2 || ""}\n\n${form.interpretation3 || ""}\n\nLời khuyên: ${form.advice || ""}`.trim()
            : "Kết quả đang được Reader chuẩn bị...";

        return {
            ...item,
            cards,
            displayDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "N/A",
            displayName: user?.role === "READER"
                ? (item.customer?.fullName || "Khách hàng")
                : (item.reader?.fullName || "Hệ thống Tarot"),
            displayAvatar: user?.role === "READER"
                ? (item.customer?.profilePicture)
                : (item.reader?.profilePicture),
            finalResult: messageText,
            // Thêm ID để nhảy trang
            requestId: item.request?.id
        };
    };

    const fetchRecentSessions = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await HistoryService.getRecentHistory();
            const data = Array.isArray(response) ? response : [];
            setAllRecentSessions(data.map(item => transformData(item)));
        } catch (error) {
            console.error("Lỗi lấy dữ liệu profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isMounted && user) {
            fetchRecentSessions();
        }
    }, [user, isMounted]);

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return allRecentSessions.slice(start, start + itemsPerPage);
    }, [allRecentSessions, currentPage]);

    const totalPages = Math.ceil(allRecentSessions.length / itemsPerPage);
    
    const handleConfirmLogout = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("currentUser");
            dispatch(logout()); 
            router.push("/login");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <span className="px-2.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Hoàn thành</span>;
            case 'IN_PROGRESS': return <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold flex items-center gap-1"><Sparkles className="w-3 h-3" /> Đang giải</span>;
            case 'CANCELED': return <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Đã hủy</span>;
            default: return <span className="px-2.5 py-0.5 bg-slate-500/20 text-slate-400 border border-slate-500/30 rounded-full text-[10px] font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Chờ duyệt</span>;
        }
    };

    if (!isMounted) return null;
    if (!user) { router.push("/login"); return null; }

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans relative">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-amber-900/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

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
                    {/* CỘT TRÁI - GIỮ NGUYÊN UI */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#130823]/60 border border-white/10 rounded-[2.5rem] p-8 text-center backdrop-blur-xl shadow-2xl">
                            <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-br from-amber-400 to-purple-600 mb-4">
                                <img src={user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} className="w-full h-full rounded-full border-4 border-[#130823] bg-[#1a1025] object-cover" alt="Avatar" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user.fullName}</h2>
                            <p className="text-amber-500 text-sm font-medium flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" /> Cung {getZodiac(user.birthDate)}
                            </p>
                            <div className="mt-8 space-y-4 text-left">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                    <div className="overflow-hidden"><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Email</p><p className="text-sm text-slate-200 truncate">{user.email}</p></div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                    <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ngày sinh</p><p className="text-sm text-slate-200">{user.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : "N/A"}</p></div>
                                </div>
                            </div>
                            <button onClick={() => setShowLogoutModal(true)} className="w-full mt-8 py-3 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 rounded-xl border border-red-500/20 transition-all font-bold text-sm">
                                <LogOut className="w-4 h-4" /> Đăng xuất
                            </button>
                        </motion.div>
                    </div>

                    {/* CỘT PHẢI - GIỮ NGUYÊN UI */}
                    <div className="lg:col-span-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-3xl font-bold text-white tracking-tight">Tổng quan <span className="text-amber-400">Năng Lượng</span></h2>
                            <button onClick={() => router.push(user.role === 'READER' ? '/readerdashboard/history' : '/history')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all group">
                                <HistoryIcon className="w-4 h-4 text-amber-500" /> Lịch sử đầy đủ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="space-y-4 min-h-[400px]">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-500" /><p className="text-sm italic">Đang tải thông điệp vũ trụ...</p>
                                </div>
                            ) : currentItems.length === 0 ? (
                                <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/5 border-dashed"><p className="text-slate-500">Chưa có phiên luận giải nào gần đây.</p></div>
                            ) : (
                                <>
                                    <AnimatePresence mode="wait">
                                        <motion.div key={currentPage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                            {currentItems.map((session) => (
                                                <div
                                                    key={session.id}
                                                    // SỬA TẠI ĐÂY: Nhảy sang trang theo request.id
                                                    onClick={() => router.push(`/booking/result?sessionId=${session.requestId}`)}
                                                    className="bg-[#1a1025]/80 border border-white/5 rounded-2xl p-5 hover:border-amber-500/30 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98]"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded">#{session.requestId}</span>
                                                            {getStatusBadge(session.status)}
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 font-bold">{session.displayDate}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex-1 pr-4">
                                                            <h4 className="text-white font-bold text-lg group-hover:text-amber-400 transition-colors line-clamp-1">{session.request?.question?.topic?.name || "Luận giải Tarot"}</h4>
                                                            <p className="text-slate-400 text-sm line-clamp-1 italic">"{session.request?.question?.questionText || "..."}"</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-amber-500 opacity-0 group-hover:opacity-100 transition-all">
                                                            <span className="text-[10px] font-bold">CHI TIẾT</span>
                                                            <ChevronRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* PHÂN TRANG - GIỮ NGUYÊN */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-8">
                                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg bg-white/5 text-slate-400 disabled:opacity-20 hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></button>
                                            <div className="flex gap-1">
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>{i + 1}</button>
                                                ))}
                                            </div>
                                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg bg-white/5 text-slate-400 disabled:opacity-20 hover:text-white transition-all"><ChevronRight className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleConfirmLogout} />
        </div>
    );
}