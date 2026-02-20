"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { UserService } from "@/services/userService";
import { setMatchedReader, fetchRandomReader } from "@/store/slices/userSlice";
import { fetchReaderProfile } from "@/store/slices/readerProfileSlice";

import {
  User,
  Calendar,
  Sparkles,
  Zap,
  Heart,
  Briefcase,
  Wallet,
  Search,
  ArrowRight,
  Star,
  CheckCircle2,
  AlertTriangle,
  X,
  Award,
  MessageSquare,
  Loader2,
  Lock,
  RotateCcw,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReadingSessionService } from "@/services/readingSessionService";

// --- 1. ĐỊNH NGHĨA KEY CHO SESSION PERSIST ---
const TAROT_PERSIST_KEY = "tarot_booking_state_persist";

// --- 2. HELPER FUNCTIONS (GIỮ NGUYÊN GỐC) ---
const formatDateForInput = (dateVal: any) => {
  if (!dateVal) return "";
  if (Array.isArray(dateVal)) {
    const [y, m, d] = dateVal;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  try {
    const date = new Date(dateVal);
    if (!isNaN(date.getTime())) return date.toISOString().split("T")[0];
  } catch (e) { return ""; }
  return "";
};

const formatReaderDate = (dateVal: any) => {
  if (!dateVal) return "Chưa cập nhật";
  try {
    if (typeof dateVal === 'string' && dateVal.includes('/')) return dateVal;
    if (Array.isArray(dateVal)) return `${dateVal[2]}/${dateVal[1]}/${dateVal[0]}`;
    return new Date(dateVal).toLocaleDateString("vi-VN");
  } catch { return "N/A"; }
};

// --- COMPONENT: MODAL THÔNG BÁO ---
const NotificationModal = ({ isOpen, type, message, onClose, onConfirm, confirmText }: any) => {
  if (!isOpen) return null;
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertTriangle;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-sm w-full bg-[#1a1025] border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl relative">
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 ${isSuccess ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-amber-500/10 border-amber-500/50 text-amber-500"}`}>
          <Icon className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{isSuccess ? "Thành Công!" : "Thông Báo"}</h3>
        <p className="text-slate-400 text-sm mb-8">{message}</p>
        <button onClick={() => {
          if (onConfirm) onConfirm(); // Chạy logic redirect đã truyền vào
          else onClose();
        }} className={`w-full py-3.5 ${isSuccess ? "bg-green-600 hover:bg-green-500" : "bg-amber-600 hover:bg-amber-500"} text-white font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02]`}>
          {confirmText || "Đóng"}
        </button>
      </motion.div>
    </motion.div>
  );
};

// --- COMPONENT: MODAL CẬP NHẬT THÔNG TIN ---
const UserInfoUpdateModal = ({ isOpen, onClose, user, token, onUpdateSuccess }: any) => {
  const [name, setName] = useState(user?.fullName || "");
  const [dob, setDob] = useState(user?.birthDate ? formatDateForInput(user.birthDate) : "");
  const [isLoading, setIsLoading] = useState(false);
  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name || !dob) return alert("Vui lòng nhập đầy đủ thông tin!");
    setIsLoading(true);
    try {
      await axios.patch(`https://bemystictarot-1040470993124.asia-southeast1.run.app/api/users/booking-info/${user.id}`, { fullName: name, birthDate: dob }, { headers: { Authorization: `Bearer ${token}` } });
      onUpdateSuccess({ fullName: name, birthDate: dob });
    } catch (error) { alert("Lỗi cập nhật thông tin!"); } finally { setIsLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full bg-[#1a1025] border border-amber-500/30 rounded-[2rem] p-8 text-center shadow-2xl relative">
        <h3 className="text-2xl font-bold text-white mb-2">Bổ sung thông tin</h3>
        <div className="space-y-4 text-left mt-6">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500/50 outline-none" placeholder="Họ và tên" />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber-500/50 outline-none [color-scheme:dark]" />
        </div>
        <button onClick={handleSubmit} disabled={isLoading} className="w-full mt-8 py-3.5 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />} Cập nhật & Tiếp tục
        </button>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function BookingRequestPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const { drawnCards, topic, question, questionText } = useSelector((state: any) => state.tarot);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { matchedReader } = useSelector((state: any) => state.user);
  const { currentProfile, isLoading: isProfileLoading } = useSelector((state: RootState) => state.readerProfile);

  // States
  const [step, setStep] = useState<1 | 3 | 4>(matchedReader ? 4 : 1);
  const [scanStatus, setScanStatus] = useState("Đang kết nối vệ tinh tâm linh...");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "info", message: "", onConfirm: null as any, confirmText: "" });
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);

  // --- LOGIC: PERSISTENCE (F5 BẢO VỆ) ---
  useEffect(() => {
    setMounted(true);
    const saved = sessionStorage.getItem(TAROT_PERSIST_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setStep(parsed.step);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    sessionStorage.setItem(TAROT_PERSIST_KEY, JSON.stringify({ step }));
  }, [step, mounted]);

  // --- LOGIC: MATCH READER ---
  const handleMatchReader = useCallback(async () => {
    if (!user?.id || matchedReader) return; // Nếu đã có reader rồi thì thôi không tìm nữa

    setStep(3);
    if (!user?.id) return;

    // Reset trạng thái trước khi tìm
    setStep(3);
    setProgress(0);
    setScanStatus("Đang kết nối vệ tinh tâm linh...");

    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 2));
    }, 50);

    try {
      const result = await dispatch(fetchRandomReader(user.id)).unwrap();

      // Nếu kết quả trả về null hoặc rỗng (phòng hờ trường hợp unwrap không ném lỗi)
      if (!result) {
        throw new Error("NO_READER");
      }

      setTimeout(() => {
        clearInterval(timer);
        setProgress(100);
        setStep(4);
      }, 1000);

    } catch (err) {
      clearInterval(timer);
      console.error("Lỗi tìm Reader:", err);

      // HIỆN MODAL NGAY LẬP TỨC VÀ DỪNG MỌI THỨ
      setModalConfig({
        isOpen: true,
        type: "info",
        message: "Vũ trụ gửi lời cáo lỗi: Hiện tại các Reader đều đang bận thiền định. Vui lòng quay lại sau nhé!",
        confirmText: "Quay lại trang chủ",
        onConfirm: () => {
          sessionStorage.removeItem(TAROT_PERSIST_KEY);
          // Có thể dọn dẹp thêm các state rút bài ở đây
          window.location.href = "/"; // Dùng href để force reload trang chủ cho sạch
        }
      });

      // Đặt lại status để user không thấy chữ "Lỗi kết nối" quá lâu
      setScanStatus("Tín hiệu đã ngắt...");
    }
  }, [dispatch, user?.id,matchedReader]);

  useEffect(() => {
    if (user && drawnCards.length > 0) {
      if (matchedReader) {
        setStep(4);
        return;
      }
      if (user.fullName && user.birthDate) {
        if (step === 1) handleMatchReader();
      } else {
        if (step === 1) setShowUpdateInfoModal(true);
      }
    }
  }, [user, drawnCards.length, handleMatchReader, step, matchedReader]);

  const handleUpdateSuccess = (updatedData: any) => {
    setShowUpdateInfoModal(false);
    handleMatchReader();
  };

  const handleOpenProfile = async () => {
    if (matchedReader?.id) {
      await dispatch(fetchReaderProfile(matchedReader.id));
      setShowProfile(true);
    }
  };

  const submitBookingRequest = async () => {
    if (!user || !matchedReader) return;
    setIsSubmitting(true);
    const payload = {
      customerId: user.id,
      readerId: matchedReader.id,
      question: question || 1,
      topic: topic === 'love' ? 1 : topic === 'career' ? 2 : 3,
      selectedCards: drawnCards.map((c: any, i: number) => ({
        cardId: Number(c.id || 0),
        nameVi: c.nameVi,
        imageUrl: c.imageUrl,
        cardNumber: i + 1,
        reversed: c.reversed || false,
      })),
      status: "PENDING",
      note: `KH: ${user.fullName} - Hỏi: ${questionText}`,
      createdAt: new Date().toISOString(),
    };
    try {
      await ReadingSessionService.create(payload as any, token, payload);

      // XÓA DỮ LIỆU SESSION KHI KẾT NỐI THÀNH CÔNG
      sessionStorage.removeItem(TAROT_PERSIST_KEY);
      sessionStorage.removeItem("tarot_topic");
      sessionStorage.removeItem("tarot_question");
      sessionStorage.removeItem("tarot_drawn_cards");

      setModalConfig({
        isOpen: true,
        type: "success",
        message: "Yêu cầu đã gửi! Đang chuyển hướng...",
        onConfirm: () => router.push("/"),
        confirmText: "Đến trang chủ"
      });
      setTimeout(() => router.push("/"), 2000);
    } catch (error) { alert("Lỗi gửi yêu cầu!"); } finally { setIsSubmitting(false); }
  };

  if (!mounted) return null;

  const displayReader = currentProfile || matchedReader;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-[60vh]">
              <div className="relative w-64 h-64 flex items-center justify-center mb-10">
                <motion.div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/30" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}></motion.div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-amber-500/10 to-purple-500/10 backdrop-blur-3xl border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-bounce" />
                    <div className="text-3xl font-mono font-bold text-white">{progress}%</div>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-200 animate-pulse">{scanStatus}</h2>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-[#130823]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20"><Sparkles className="w-12 h-12 text-amber-400" /></div>

              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full"></div>
                <img src={matchedReader?.avatarUrl || matchedReader?.profilePicture || "/default-avatar.png"} className="w-40 h-40 mx-auto rounded-full border-4 border-amber-500/50 relative z-10 object-cover shadow-2xl" />
                <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full border-4 border-[#130823] z-20"><CheckCircle2 className="w-5 h-5 text-white" /></div>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Vũ Trụ Gọi Tên</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-amber-400 mb-6 uppercase tracking-tight">{matchedReader?.fullName}</h3>

              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-light">
                Dựa trên năng lượng từ 3 lá bài bạn đã chọn, <span className="text-white font-bold">{matchedReader?.fullName}</span> là Reader có tần số tương thích cao nhất để giải mã định mệnh cho bạn.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-20">
                <button onClick={handleOpenProfile} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 hover:scale-105">
                  {isProfileLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <User className="w-5 h-5" />} Xem Hồ Sơ Chi Tiết
                </button>
                <button onClick={handleMatchReader} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 hover:scale-105">
                  <RefreshCw className="w-5 h-5" /> Tìm Reader Khác
                </button>
                <button onClick={submitBookingRequest} disabled={isSubmitting} className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />} Kết Nối Ngay
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODAL HỒ SƠ CHI TIẾT (GIỮ 100% UI UX) --- */}
        <AnimatePresence>
          {showProfile && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-[#130823] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="h-32 bg-gradient-to-r from-purple-900/50 to-amber-900/50 relative">
                  <button onClick={() => setShowProfile(false)} className="absolute top-6 right-6 w-10 h-10 bg-black/40 hover:bg-red-500/40 rounded-full flex items-center justify-center text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="px-8 pb-8 -mt-12 relative">
                  <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
                    <img src={displayReader?.avatarUrl || displayReader?.profilePicture || "/default-avatar.png"} className="w-32 h-32 rounded-3xl border-4 border-[#130823] shadow-2xl object-cover" />
                    <div className="flex-1 pb-2">
                      <h3 className="text-3xl font-bold text-white mb-2">{displayReader?.fullName}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase">Expert Reader</span>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase ${displayReader?.status === 'BUSY' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          ● {displayReader?.status || 'ONLINE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Kinh nghiệm</p>
                      <p className="font-bold text-white flex items-center justify-center gap-1"><Award className="w-4 h-4 text-purple-400" /> {displayReader?.experienceYears || 1} Năm</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Đánh giá</p>
                      <p className="font-bold text-amber-400 flex items-center justify-center gap-1">{displayReader?.averageRating?.toFixed(1) || "5.0"} <Star className="w-4 h-4 fill-current" /></p>
                      <span className="text-[10px] text-slate-500">{displayReader?.totalReviews || 0} lượt</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tín nhiệm</p>
                      <p className="font-bold text-white flex items-center justify-center gap-1">{displayReader?.eloScore?.toFixed(0) || "500"}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest flex items-center gap-2"><User className="w-4 h-4 text-amber-500" /> Giới thiệu</h4>
                      <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-slate-300 text-sm leading-relaxed italic whitespace-pre-line">
                        "{displayReader?.bio || "Một Reader bí ẩn với khả năng kết nối tâm linh sâu sắc."}"
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" /> Đánh giá gần đây</h4>
                      <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {(displayReader?.recentReviews || displayReader?.reviews)?.map((review: any, idx: number) => (
                          <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-white flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">{review.customerName?.charAt(0)}</div>
                                {review.customerName}
                              </span>
                              <div className="flex text-amber-500 gap-0.5">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < (review.ratingValue || review.rating) ? "fill-current" : "text-slate-700"}`} />)}
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 italic font-light">"{review.comment || review.review}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button onClick={() => { setShowProfile(false); submitBookingRequest(); }} className="w-full mt-8 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-purple-600 text-white font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] transition-transform active:scale-95 uppercase tracking-tighter">
                    Chốt Kết Nối & Gửi Câu Hỏi
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <UserInfoUpdateModal isOpen={showUpdateInfoModal} onClose={() => setShowUpdateInfoModal(false)} user={user} token={token} onUpdateSuccess={handleUpdateSuccess} />
        <NotificationModal isOpen={modalConfig.isOpen} type={modalConfig.type} message={modalConfig.message} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} onConfirm={modalConfig.onConfirm} />
      </div>
    </div>
  );
}