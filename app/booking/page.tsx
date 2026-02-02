"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserService } from "@/services/userService";
import { setMatchedReader, fetchRandomReader } from "@/store/slices/userSlice";

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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReadingSessionService } from "@/services/readingSessionService";

// --- HELPER FUNCTIONS ---
const formatDateForInput = (dateVal: any) => {
  if (!dateVal) return "";
  if (Array.isArray(dateVal)) {
    const [y, m, d] = dateVal;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  try {
    const date = new Date(dateVal);
    if (!isNaN(date.getTime())) return date.toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
  return "";
};

const formatReaderDate = (dateVal: any) => {
  if (!dateVal) return "Chưa cập nhật";
  try {
    if (Array.isArray(dateVal)) {
      return `${dateVal[2]}/${dateVal[1]}/${dateVal[0]}`;
    }
    return new Date(dateVal).toLocaleDateString("vi-VN");
  } catch {
    return "N/A";
  }
};

const TOPICS = [
  {
    id: "love",
    icon: <Heart className="w-6 h-6" />,
    label: "Tình Yêu",
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-500/10 border-pink-500/20",
  },
  {
    id: "career",
    icon: <Briefcase className="w-6 h-6" />,
    label: "Sự Nghiệp",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "finance",
    icon: <Wallet className="w-6 h-6" />,
    label: "Tài Chính",
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const QUESTION_DB_MAP: Record<string, number> = {
  "Người ấy nghĩ gì về tôi?": 1,
  "Tương lai mối quan hệ này?": 1,
  "Khi nào tôi có người yêu?": 1,
  "Người cũ có quay lại không?": 1,
  "Tôi có nên nhảy việc lúc này?": 1,
  "Cơ hội thăng tiến sắp tới?": 1,
  "Tôi hợp với nghề nào?": 1,
  "Đồng nghiệp nghĩ gì về tôi?": 1,
  "Tình hình tài chính tháng tới?": 1,
  "Cơ hội đầu tư sinh lời?": 1,
  "Vận may tiền bạc sắp tới?": 1,
  "Tôi có nên mua tài sản lớn?": 1,
};

const QUESTIONS: Record<string, string[]> = {
  love: [
    "Người ấy nghĩ gì về tôi?",
    "Tương lai mối quan hệ này?",
    "Khi nào tôi có người yêu?",
    "Người cũ có quay lại không?",
  ],
  career: [
    "Tôi có nên nhảy việc lúc này?",
    "Cơ hội thăng tiến sắp tới?",
    "Tôi hợp với nghề nào?",
    "Đồng nghiệp nghĩ gì về tôi?",
  ],
  finance: [
    "Tình hình tài chính tháng tới?",
    "Cơ hội đầu tư sinh lời?",
    "Vận may tiền bạc sắp tới?",
    "Tôi có nên mua tài sản lớn?",
  ],
};

// --- COMPONENT: MODAL THÔNG BÁO ---
const NotificationModal = ({
  isOpen,
  type,
  message,
  onClose,
  onConfirm,
  confirmText,
}: any) => {
  if (!isOpen) return null;
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertTriangle;
  const colorClass = isSuccess ? "text-green-500" : "text-amber-500";
  const bgClass = isSuccess
    ? "bg-green-500/10 border-green-500/50"
    : "bg-amber-500/10 border-amber-500/50";
  const buttonClass = isSuccess
    ? "bg-green-600 hover:bg-green-500"
    : "bg-amber-600 hover:bg-amber-500";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-sm w-full bg-[#1a1025] border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl relative"
      >
        <div
          className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 ${bgClass} ${colorClass}`}
        >
          <Icon className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {isSuccess ? "Thành Công!" : "Thông Báo"}
        </h3>
        <p className="text-slate-400 text-sm mb-8">{message}</p>
        <button
          onClick={onConfirm || onClose}
          className={`w-full py-3.5 ${buttonClass} text-white font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02]`}
        >
          {confirmText || "Đóng"}
        </button>
      </motion.div>
    </motion.div>
  );
};

// --- COMPONENT: MODAL CẬP NHẬT THÔNG TIN (FIXED: PATCH & NO V1) ---
const UserInfoUpdateModal = ({
  isOpen,
  onClose,
  user,
  token,
  onUpdateSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  token: string | null;
  onUpdateSuccess: (data: any) => void;
}) => {
  const [name, setName] = useState(user?.fullName || "");
  const [dob, setDob] = useState(
    user?.birthDate ? formatDateForInput(user.birthDate) : "",
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name || !dob) {
      alert("Vui lòng nhập đầy đủ thông tin để tiếp tục!");
      return;
    }
    setIsLoading(true);
    try {
      // FIX CHUẨN: Dùng PATCH và URL không có /v1 (Dựa theo log 405 của bạn)
      await axios.patch(
        `https://bemystictarot-1040470993124.asia-southeast1.run.app/api/users/booking-info/${user.id}`,
        {
          fullName: name,
          birthDate: dob,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onUpdateSuccess({ fullName: name, birthDate: dob });
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error);
      if (error.response) {
        alert(
          `Lỗi Server (${error.response.status}): ${error.response.data?.message || "Không thể cập nhật"}`,
        );
      } else {
        // QUAN TRỌNG: Nếu lỗi này xuất hiện (Network Error/CORS), bạn cần cấu hình Backend cho phép method PATCH
        alert(
          "Lỗi kết nối hoặc CORS. Vui lòng kiểm tra lại Backend đã cho phép method PATCH chưa.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full bg-[#1a1025] border border-amber-500/30 rounded-[2rem] p-8 text-center shadow-2xl relative"
      >
        {/* Ẩn nút đóng để bắt buộc update nếu thiếu info */}
        {!user?.fullName && !user?.birthDate ? null : (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Bổ sung thông tin
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Vui lòng cập nhật thông tin để Reader có thể kết nối với bạn tốt nhất.
        </p>
        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block ml-1">
              Họ và tên
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-amber-500/50 outline-none transition-colors"
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block ml-1">
              Ngày sinh
            </label>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-amber-500/50 outline-none transition-colors [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full mt-8 py-3.5 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform text-sm flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4" /> Cập nhật & Tiếp tục
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

// --- TRANG CHÍNH ---
export default function BookingRequestPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux
  const { drawnCards, topic, question, questionText } = useSelector(
    (state: any) => state.tarot,
  );
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { matchedReader } = useSelector((state: any) => state.user);

  const session = { drawnCards, topic, question, questionText };
  const [step, setStep] = useState<1 | 3 | 4>(1); // BỎ STEP 2
  const [scanStatus, setScanStatus] = useState(
    "Đang kết nối vệ tinh tâm linh...",
  );
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "info",
    message: "",
    onConfirm: null as any,
    confirmText: "",
  });
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);

  // Form Data (Lưu tạm topic/question)
  const [formData, setFormData] = useState({
    topic: "",
    question: 0,
    questionText: "",
  });

  // --- 1. CORE LOGIC: MATCH READER ---
  const handleMatchReader = useCallback(async () => {
    if (!user?.id) return; // Đảm bảo có ID khách hàng mới tìm được

    setStep(3);
    setProgress(0);
    setScanStatus("Đang kết nối vệ tinh tâm linh...");

    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 2));
    }, 50);

    try {
      // GỌI ACTION TỪ SLICE THAY VÌ SERVICE TRỰC TIẾP
      // Redux sẽ tự xử lý việc nhét matchedReader vào store và update excludedIds
      await dispatch(fetchRandomReader(user.id) as any).unwrap();

      setTimeout(() => {
        clearInterval(timer);
        setProgress(100);
        setStep(4);
      }, 1500);
    } catch (err) {
      console.error("Match Reader Error:", err);
      setScanStatus("Không tìm thấy Reader phù hợp, vui lòng thử lại.");
      clearInterval(timer);
    }
  }, [dispatch, user?.id]);

  // --- 2. LOGIC INIT & AUTO SKIP (Quan trọng) ---
  useEffect(() => {
    if (user) {
      // Sync dữ liệu topic/question từ Redux
      setFormData((prev) => ({
        ...prev,
        topic: session.topic || prev.topic,
        question: session.question || prev.question,
      }));

      // Nếu đã có bài rút (từ trang Tarot Draw)
      if (session.drawnCards.length > 0) {
        const hasName = user.fullName && user.fullName.trim() !== "";
        const hasDob = !!user.birthDate;

        if (hasName && hasDob) {
          // Đủ thông tin -> Tìm Reader luôn
          if (step === 1) handleMatchReader();
        } else {
          // Thiếu thông tin -> Bật Modal ngay lập tức (KHÔNG HIỆN BƯỚC 2)
          if (step === 1) setShowUpdateInfoModal(true);
        }
      }
    }
  }, [user, session.drawnCards.length, handleMatchReader, step]);

  // --- 3. HANDLERS ---
  const showAlert = (message: string) => {
    setModalConfig({
      isOpen: true,
      type: "warning",
      message: message,
      onConfirm: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
      confirmText: "Đóng",
    });
  };

  const handleNextStep = () => {
    // Logic nút "Tiếp theo" ở Bước 1 (Chọn Topic)
    if (!formData.topic || !formData.question)
      return showAlert("Vui lòng chọn chủ đề và câu hỏi.");

    // Kiểm tra thông tin User trước khi qua bước tiếp theo
    if (user) {
      const hasName = user.fullName && user.fullName.trim() !== "";
      const hasDob = !!user.birthDate;

      if (hasName && hasDob) {
        handleMatchReader();
      } else {
        setShowUpdateInfoModal(true); // Bật Modal bắt nhập
      }
    } else {
      router.push("/login");
    }
  };

  const handleCreateBooking = async () => {
    if (!user || !token) {
      if (confirm("Phiên đăng nhập hết hạn. Đi đến trang đăng nhập?"))
        router.push("/login?callbackUrl=/booking");
      return;
    }
    // Check lại lần cuối
    if (!user.fullName || !user.birthDate) {
      setShowUpdateInfoModal(true);
      setShowProfile(false);
      return;
    }
    await submitBookingRequest();
  };

  // Callback sau khi Modal update thành công
  const handleUpdateSuccess = async (data: any) => {
    setShowUpdateInfoModal(false);

    // Nếu đang ở Bước 1 hoặc vừa vào trang -> Chuyển sang tìm Reader
    if (step === 1) {
      handleMatchReader();
    } else {
      // Nếu đang ở bước cuối (Step 4) mà bị bắt update -> Gửi lại booking
      await submitBookingRequest(data);
    }
  };

  const submitBookingRequest = async (updatedUserData?: any) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    const topicIdMap: Record<string, number> = {
      love: 1,
      career: 2,
      finance: 3,
    };
    const currentTopicId = topicIdMap[formData.topic] || 1;
    const questionIdToSend = formData.question || 1;

    const cardsPayload = session.drawnCards.map((c: any, index: number) => ({
      cardId: Number(c.id || c.dbId || 0),
      nameVi: c.name || c.nameVi,
      imageUrl: c.imageUrl,
      cardNumber: index + 1,
      reversed: c.reversed || false,
    }));

    const customerName = updatedUserData?.fullName || user.fullName;

    // Chuẩn bị payload khớp với ReadingSessionDTO
    const payload = {
      customerId: user.id,
      readerId: matchedReader.id,
      question: questionIdToSend,
      topic: currentTopicId,
      selectedCards: cardsPayload,
      status: "PENDING",
      amount: 50000,
      note: `KH: ${customerName} - Hỏi: ${formData.questionText}`,
      createdAt: new Date().toISOString(),
    };

    try {
      // DÙNG SERVICE Ở ĐÂY - KHÔNG DÙNG AXIOS TRỰC TIẾP
      // Lưu ý: Tôi truyền payload vào tham số 'data' của hàm create
      await ReadingSessionService.create(payload as any, token, payload as any);

      setModalConfig({
        isOpen: true,
        type: "success",
        message:
          "Yêu cầu của bạn đã được gửi thành công! Đang chuyển hướng đến hồ sơ...",
        onConfirm: () => router.push("/profile"),
        confirmText: "Đến trang Hồ sơ ngay",
      });

      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error: any) {
      console.error("Booking Error:", error);
      const msg = error.response?.data?.message || "Lỗi kết nối server";
      showAlert(`Gửi thất bại: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative selection:bg-amber-500/30 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 3: SCANNING */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[60vh]"
            >
              <div className="relative w-64 h-64 flex items-center justify-center mb-10">
                <div className="absolute inset-0 border border-amber-500/20 rounded-full"></div>
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_deg,transparent_270deg,rgba(245,158,11,0.3)_360deg)] animate-[spin_3s_linear_infinite]"></div>
                <div className="relative z-10 w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-pulse">
                  <Zap className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-amber-200 animate-pulse text-center mb-2">
                {scanStatus}
              </h2>
              <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-700">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-purple-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4: FOUND READER */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto bg-[#1a0f2e]/90 border border-amber-500/30 rounded-[2.5rem] p-8 text-center shadow-2xl"
            >
              <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-br from-amber-400 via-purple-500 to-amber-400 mb-6 relative">
                <img
                  src={
                    matchedReader?.avatarUrl ||
                    matchedReader?.profilePicture ||
                    "/default-avatar.png"
                  }
                  className="w-full h-full rounded-full border-4 border-[#130823] object-cover"
                  alt="Reader"
                />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">
                {matchedReader?.fullName || "Reader"}
              </h2>
              <div className="flex justify-center gap-3 mb-6">
                <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {matchedReader?.rating
                    ? matchedReader.rating.toFixed(1)
                    : "5.0"}
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  {matchedReader?.eloScore || 98} Điểm tín nhiệm
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6 mb-8 text-left max-w-xl mx-auto border border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase font-bold mb-2">
                  Câu hỏi:
                </p>
                <p className="text-white italic text-lg">
                  "{session.questionText || formData.questionText}"
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setShowProfile(true)}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-2xl font-medium transition-all"
                >
                  Xem hồ sơ
                </button>
                <button
                  onClick={() => handleMatchReader()}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-2xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" /> Đổi Reader
                </button>
                <button
                  onClick={handleCreateBooking}
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Đang gửi...
                    </>
                  ) : (
                    <>
                      Gửi câu hỏi <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODAL HỒ SƠ READER --- */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-[#130823] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                <div className="h-32 bg-gradient-to-r from-purple-900 to-amber-900 relative">
                  <button
                    onClick={() => setShowProfile(false)}
                    className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-8 pb-8 -mt-12 relative">
                  {/* Header: Avatar & Tên */}
                  <div className="flex flex-col md:flex-row gap-6 items-end mb-6">
                    <img
                      src={
                        matchedReader?.avatarUrl ||
                        matchedReader?.profilePicture ||
                        "/default-avatar.png"
                      }
                      className="w-32 h-32 rounded-3xl border-4 border-[#130823] shadow-xl object-cover"
                      alt="Avatar"
                    />
                    <div className="flex-1 pb-2">
                      <h3 className="text-3xl font-bold text-white mb-1">
                        {matchedReader?.fullName || "Chưa cập nhật tên"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                          VERIFIED
                        </span>
                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/30">
                          ONLINE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                      <p className="text-xs text-slate-400 mb-1">Kinh nghiệm</p>
                      <p className="font-bold text-white flex items-center justify-center gap-1">
                        <Award className="w-3 h-3 text-purple-400" />
                        {matchedReader?.experienceYears
                          ? `${matchedReader.experienceYears} Năm`
                          : "Mới"}
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                      <p className="text-xs text-slate-400 mb-1">Đánh giá</p>
                      <div className="flex flex-col items-center">
                        <p className="font-bold text-amber-400 flex items-center justify-center gap-1">
                          {matchedReader?.rating
                            ? matchedReader.rating.toFixed(1)
                            : "0.0"}{" "}
                          <Star className="w-3 h-3 fill-current" />
                        </p>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MessageSquare className="w-3 h-3" />{" "}
                          {matchedReader?.reviews?.length || 0} lượt
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                      <p className="text-xs text-slate-400 mb-1">Ngày sinh</p>
                      <p className="font-bold text-white text-sm">
                        {formatReaderDate(matchedReader?.birthDate)}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                    <h4 className="text-sm font-bold text-slate-300 mb-2 uppercase flex items-center gap-2">
                      <User className="w-4 h-4" /> Giới thiệu
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed italic">
                      "
                      {matchedReader?.bio ||
                        "Reader này là một chuyên gia Tarot với trực giác nhạy bén, chuyên giải quyết các vấn đề về tình cảm và định hướng sự nghiệp."}
                      "
                    </p>
                  </div>

                  {/* REVIEWS SECTION */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Đánh giá từ khách
                      hàng
                    </h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      {matchedReader?.reviews &&
                      matchedReader.reviews.length > 0 ? (
                        matchedReader.reviews.map(
                          (review: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-white/5 p-3 rounded-xl border border-white/5"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-white">
                                  {review.customerName || "Khách ẩn danh"}
                                </span>
                                <div className="flex text-amber-500 text-[10px] gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-2 h-2 ${i < (review.rating || 5) ? "fill-current" : "text-slate-700"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-slate-400 italic">
                                "
                                {review.review ||
                                  review.comment ||
                                  "Không có nội dung"}
                                "
                              </p>
                            </div>
                          ),
                        )
                      ) : (
                        <div className="text-center py-4 bg-white/5 rounded-xl border border-white/5 border-dashed">
                          <p className="text-xs text-slate-500">
                            Chưa có đánh giá nào.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfile(false);
                      handleCreateBooking();
                    }}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
                  >
                    Kết nối ngay với {matchedReader?.fullName || "Reader"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODAL UPDATE INFO (KHI THIẾU THÔNG TIN) --- */}
        <UserInfoUpdateModal
          isOpen={showUpdateInfoModal}
          onClose={() => setShowUpdateInfoModal(false)}
          user={user}
          token={token}
          onUpdateSuccess={handleUpdateSuccess}
        />

        {/* --- MODAL THÔNG BÁO --- */}
        <NotificationModal
          isOpen={modalConfig.isOpen}
          type={modalConfig.type}
          message={modalConfig.message}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          onConfirm={modalConfig.onConfirm}
          confirmText={
            modalConfig.isOpen && modalConfig.type === "success"
              ? "Đến Hồ Sơ Ngay"
              : "Đóng"
          }
        />
      </div>
    </div>
  );
}
