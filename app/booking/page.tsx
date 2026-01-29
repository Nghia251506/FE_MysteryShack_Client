"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// Đảm bảo đường dẫn import đúng
import { RootState } from "@/store/store";
import { UserService } from '@/services/userService';
import { setMatchedReader } from '@/store/slices/userSlice';

import {
  User, Calendar, Sparkles, Zap, Heart, Briefcase, Wallet, Search,
  ArrowRight, Star, CheckCircle2, AlertTriangle, Loader2, X, Award, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- CÁC HÀM BỔ TRỢ (HELPER FUNCTIONS) ---

const formatDateForInput = (dateVal: any) => {
  if (!dateVal) return "";
  if (Array.isArray(dateVal)) {
    const [y, m, d] = dateVal;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  try {
    const date = new Date(dateVal);
    if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
  } catch (e) { return ""; }
  return "";
};

const formatReaderDate = (dateVal: any) => {
    if (!dateVal) return "Chưa cập nhật";
    try {
        if (Array.isArray(dateVal)) {
            return `${dateVal[2]}/${dateVal[1]}/${dateVal[0]}`;
        }
        return new Date(dateVal).toLocaleDateString('vi-VN');
    } catch { return "N/A"; }
};

const TOPICS = [
  { id: "love", icon: <Heart className="w-6 h-6" />, label: "Tình Yêu", color: "from-pink-500 to-rose-600", bg: "bg-pink-500/10 border-pink-500/20" },
  { id: "career", icon: <Briefcase className="w-6 h-6" />, label: "Sự Nghiệp", color: "from-blue-500 to-cyan-600", bg: "bg-blue-500/10 border-blue-500/20" },
  { id: "finance", icon: <Wallet className="w-6 h-6" />, label: "Tài Chính", color: "from-emerald-500 to-green-600", bg: "bg-emerald-500/10 border-emerald-500/20" }
];

const QUESTION_DB_MAP: Record<string, number> = {
  "Người ấy nghĩ gì về tôi?": 1, "Tương lai mối quan hệ này?": 1, "Khi nào tôi có người yêu?": 1, "Người cũ có quay lại không?": 1,
  "Tôi có nên nhảy việc lúc này?": 1, "Cơ hội thăng tiến sắp tới?": 1, "Tôi hợp với nghề nào?": 1, "Đồng nghiệp nghĩ gì về tôi?": 1,
  "Tình hình tài chính tháng tới?": 1, "Cơ hội đầu tư sinh lời?": 1, "Vận may tiền bạc sắp tới?": 1, "Tôi có nên mua tài sản lớn?": 1
};

const QUESTIONS: Record<string, string[]> = {
  love: ["Người ấy nghĩ gì về tôi?", "Tương lai mối quan hệ này?", "Khi nào tôi có người yêu?", "Người cũ có quay lại không?"],
  career: ["Tôi có nên nhảy việc lúc này?", "Cơ hội thăng tiến sắp tới?", "Tôi hợp với nghề nào?", "Đồng nghiệp nghĩ gì về tôi?"],
  finance: ["Tình hình tài chính tháng tới?", "Cơ hội đầu tư sinh lời?", "Vận may tiền bạc sắp tới?", "Tôi có nên mua tài sản lớn?"]
};

// --- COMPONENT: MODAL THÔNG BÁO ---
const NotificationModal = ({ isOpen, type, message, onClose, onConfirm, confirmText }: any) => {
    if (!isOpen) return null;
    
    const isSuccess = type === 'success';
    const Icon = isSuccess ? CheckCircle2 : AlertTriangle;
    const colorClass = isSuccess ? "text-green-500" : "text-amber-500";
    const bgClass = isSuccess ? "bg-green-500/10 border-green-500/50" : "bg-amber-500/10 border-amber-500/50";
    const buttonClass = isSuccess ? "bg-green-600 hover:bg-green-500" : "bg-amber-600 hover:bg-amber-500";

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-sm w-full bg-[#1a1025] border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl relative">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 ${bgClass} ${colorClass}`}>
                    <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{isSuccess ? "Thành Công!" : "Thông Báo"}</h3>
                <p className="text-slate-400 text-sm mb-8">{message}</p>
                <button onClick={onConfirm || onClose} className={`w-full py-3.5 ${buttonClass} text-white font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02]`}>
                    {confirmText || "Đóng"}
                </button>
            </motion.div>
        </motion.div>
    );
};

// --- TRANG CHÍNH (MAIN PAGE) ---
export default function BookingRequestPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { drawnCards, topic, question } = useSelector((state: any) => state.tarot);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { matchedReader } = useSelector((state: any) => state.user);
  
  const session = { drawnCards, topic, question };

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [scanStatus, setScanStatus] = useState("Đang kết nối vệ tinh tâm linh...");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'info', message: '', onConfirm: null as any });

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    topic: "",
    question: ""
  });

  // --- 1. KHỞI TẠO ---
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || prev.name,
        dob: formatDateForInput(user.birthDate) || prev.dob
      }));
    }
  }, [user]);

  useEffect(() => {
    if (step === 1 && session.drawnCards.length > 0) {
      setFormData(prev => ({ ...prev, topic: session.topic || prev.topic, question: session.question || prev.question }));
      setStep(2);
    }
  }, [session.drawnCards.length, session.topic, session.question, step]);

  // --- 2. HÀM XỬ LÝ ---
  const showAlert = (message: string) => {
      setModalConfig({
          isOpen: true,
          type: 'warning',
          message: message,
          onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
      });
  };

  const handleNextStep = () => {
    if (step === 1 && (!formData.topic || !formData.question)) return showAlert("Vui lòng chọn chủ đề và câu hỏi.");
    if (step === 2 && !formData.name) return showAlert("Vui lòng nhập họ tên.");
    if (step === 2) {
      handleMatchReader();
    }
    else if (step < 4) setStep(prev => (prev + 1) as 1 | 2 | 3 | 4);
  };

  const handleMatchReader = async () => {
    setStep(3);
    setProgress(0);
    setScanStatus("Đang kết nối vệ tinh tâm linh...");

    const timer = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 2));
    }, 50);

    try {
      const reader = await UserService.getRandomTopReader(matchedReader?.id);
      setTimeout(() => {
        clearInterval(timer);
        setProgress(100);
        dispatch(setMatchedReader(reader));
        setStep(4);
      }, 1500);
    } catch (err) {
      console.error("Lỗi tìm Reader:", err);
      setScanStatus("Không tìm thấy Reader phù hợp, vui lòng thử lại.");
      clearInterval(timer);
    }
  };

  const handleCreateBooking = async () => {
    if (!user || !token) {
      const confirmLogin = confirm("Bạn cần đăng nhập để gửi câu hỏi. Đi đến trang đăng nhập?");
      if (confirmLogin) {
          router.push("/login?callbackUrl=/booking"); 
      }
      return;
    }

    setIsSubmitting(true);

    const topicIdMap: Record<string, number> = { "love": 1, "career": 2, "finance": 3 };
    const currentTopicId = topicIdMap[formData.topic] || 1;
    const questionIdToSend = QUESTION_DB_MAP[formData.question] || 1;

    const cardsPayload = session.drawnCards.map((c: any, index: number) => ({
      cardId: Number(c.id || c.dbId || 0),
      nameVi: c.name || c.nameVi,
      imageUrl: c.imageUrl,
      cardNumber: index + 1,
      reversed: c.reversed || false
    }));

    const payload = {
      customerId: user.id,
      readerId: matchedReader.id,
      question: questionIdToSend, 
      topic: currentTopicId,
      selectedCards: cardsPayload,
      status: "PENDING",
      amount: 50000,
      note: `KH: ${formData.name} - Hỏi: ${formData.question}`,
      createdAt: new Date().toISOString()
    };

    try {
      await axios.post(
        'http://localhost:8080/api/v1/sessions',
        payload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setModalConfig({
          isOpen: true,
          type: 'success',
          message: 'Yêu cầu của bạn đã được gửi thành công! Đang chuyển hướng đến hồ sơ...',
          onConfirm: () => router.push("/profile"), 
          confirmText: "Đến trang Hồ sơ ngay"
      });

      setTimeout(() => {
          router.push("/profile");
      }, 1500);

    } catch (error: any) {
      console.error("Lỗi Booking:", error);
      const msg = error.response?.data?.message || "Lỗi kết nối server";
      showAlert(`Gửi thất bại: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative selection:bg-amber-500/30 flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
                <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider"><Sparkles className="w-3 h-3" /> Bước 1</div>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">Bạn đang <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">trăn trở</span> về điều gì?</h1>
              </div>
              <div className="lg:col-span-8 space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {TOPICS.map(t => (
                       <button key={t.id} onClick={() => setFormData(prev => ({ ...prev, topic: t.id, question: "" }))} className={`relative group p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${formData.topic === t.id ? `bg-gradient-to-b ${t.color} border-transparent shadow-lg transform -translate-y-1` : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                          <div className={`mb-3 p-3 rounded-xl w-fit ${formData.topic === t.id ? 'bg-black/20 text-white' : `${t.bg} text-slate-300`}`}>{t.icon}</div>
                          <h3 className={`font-bold text-lg mb-1 ${formData.topic === t.id ? 'text-white' : 'text-slate-200'}`}>{t.label}</h3>
                       </button>
                    ))}
                 </div>
                 <AnimatePresence>
                   {formData.topic && (
                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-[#130823]/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {QUESTIONS[formData.topic]?.map((q, i) => (
                              <label key={i} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.question === q ? 'bg-purple-600/20 border-purple-500' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}>
                                 <input type="radio" className="hidden" checked={formData.question === q} onChange={() => setFormData(prev => ({...prev, question: q}))} />
                                 <span className={`text-sm ${formData.question === q ? 'text-white font-medium' : 'text-slate-400'}`}>{q}</span>
                              </label>
                           ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={handleNextStep} disabled={!formData.question} className="px-8 py-3 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all">Tiếp theo <ArrowRight className="w-4 h-4 ml-2" /></button>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
             <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className={`mx-auto ${session.drawnCards.length > 0 ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'max-w-2xl'}`}>
                {session.drawnCards.length > 0 && (
                   <div className="lg:col-span-5 order-2 lg:order-1">
                      <div className="bg-[#1a1025]/60 p-6 rounded-[2rem] border border-white/10">
                          <h3 className="text-white font-bold mb-4">Trải bài đã chọn</h3>
                          <div className="grid grid-cols-3 gap-2">
                             {session.drawnCards.map((c: any, i: number) => (
                               <div key={i} className="aspect-[2/3] bg-black/50 rounded border border-white/10 overflow-hidden relative">
                                  <img src={c.img || c.imageUrl} className={`w-full h-full object-cover ${c.reversed ? 'rotate-180' : ''}`} alt="card"/>
                                  {c.reversed && <div className="absolute top-1 right-1 text-[8px] bg-red-600 text-white px-1 rounded">REV</div>}
                               </div>
                             ))}
                          </div>
                      </div>
                   </div>
                )}
                <div className={`${session.drawnCards.length > 0 ? 'lg:col-span-7 order-1 lg:order-2' : 'w-full'}`}>
                    <div className="bg-[#130823]/80 border border-white/10 rounded-[2.5rem] p-8 relative">
                       <button onClick={() => setStep(1)} className="text-xs text-slate-500 mb-6 font-bold hover:text-white transition-colors">← Quay lại</button>
                       <h2 className="text-3xl font-bold text-white mb-6">Thông tin của bạn</h2>
                       <div className="space-y-6">
                          <div><label className="text-xs font-bold text-slate-400 uppercase">Họ và tên</label><div className="relative group mt-2"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" /><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none"/></div></div>
                          <div><label className="text-xs font-bold text-slate-400 uppercase">Ngày sinh</label><div className="relative group mt-2"><Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" /><input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none"/></div></div>
                       </div>
                       <div className="mt-8">
                           <button onClick={handleNextStep} className="w-full py-4 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2"><Sparkles className="w-5 h-5" /> Tìm Reader Ngay</button>
                       </div>
                    </div>
                </div>
             </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
             <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-[60vh]">
                <div className="relative w-64 h-64 flex items-center justify-center mb-10">
                    <div className="absolute inset-0 border border-amber-500/20 rounded-full"></div>
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_deg,transparent_270deg,rgba(245,158,11,0.3)_360deg)] animate-[spin_3s_linear_infinite]"></div>
                    <div className="relative z-10 w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-pulse"><Zap className="w-8 h-8 text-amber-400" /></div>
                </div>
                <h2 className="text-2xl font-bold text-amber-200 animate-pulse text-center mb-2">{scanStatus}</h2>
                <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-700"><motion.div className="h-full bg-gradient-to-r from-amber-500 to-purple-500" style={{ width: `${progress}%` }} /></div>
             </motion.div>
          )}

          {/* STEP 4: FOUND READER */}
          {step === 4 && (
             <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto bg-[#1a0f2e]/90 border border-amber-500/30 rounded-[2.5rem] p-8 text-center shadow-2xl">
                  <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-br from-amber-400 via-purple-500 to-amber-400 mb-6 relative">
                      <img src={matchedReader?.profilePicture || "/default-avatar.png"} className="w-full h-full rounded-full border-4 border-[#130823] object-cover" alt="Reader" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2">{matchedReader?.fullName}</h2>
                  <div className="flex justify-center gap-3 mb-6">
                      <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current"/> 
                          {matchedReader?.rating ? matchedReader.rating.toFixed(1) : "5.0"}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">{matchedReader?.matchScore || 98}% Tương thích</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-6 mb-8 text-left max-w-xl mx-auto border border-slate-700/50">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-2">Câu hỏi:</p>
                      <p className="text-white italic text-lg">"{session.question}"</p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <button onClick={() => setShowProfile(true)} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-2xl font-medium transition-all">Xem hồ sơ</button>
                     <button onClick={() => { setStep(3); setProgress(0); }} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-2xl font-medium transition-all flex items-center justify-center gap-2"><Search className="w-4 h-4" /> Đổi Reader</button>
                     <button onClick={handleCreateBooking} disabled={isSubmitting} className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70">
                        {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang gửi...</> : <>Gửi câu hỏi <ArrowRight className="w-5 h-5" /></>}
                     </button>
                  </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODAL HỒ SƠ READER --- */}
        <AnimatePresence>
          {showProfile && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
               <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-[#130823] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                 <div className="h-32 bg-gradient-to-r from-purple-900 to-amber-900 relative">
                    <button onClick={() => setShowProfile(false)} className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"><X className="w-5 h-5"/></button>
                 </div>
                 <div className="px-8 pb-8 -mt-12 relative">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row gap-6 items-end mb-6">
                        <img src={matchedReader?.profilePicture || "/default-avatar.png"} className="w-32 h-32 rounded-3xl border-4 border-[#130823] shadow-xl object-cover" alt="Avatar" />
                        <div className="flex-1 pb-2">
                            <h3 className="text-3xl font-bold text-white mb-1">{matchedReader?.fullName}</h3>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">VERIFIED</span>
                                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/30">ONLINE</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                            <p className="text-xs text-slate-400 mb-1">Kinh nghiệm</p>
                            <p className="font-bold text-white flex items-center justify-center gap-1">
                                <Award className="w-3 h-3 text-purple-400"/> 
                                {matchedReader?.experienceYears ? `${matchedReader.experienceYears} Năm` : "Mới"}
                            </p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                            <p className="text-xs text-slate-400 mb-1">Đánh giá</p>
                            <div className="flex flex-col items-center">
                                {/* Chỉ hiện điểm sao */}
                                <p className="font-bold text-amber-400 flex items-center justify-center gap-1">
                                    {matchedReader?.rating ? matchedReader.rating.toFixed(1) : "0.0"} <Star className="w-3 h-3 fill-current"/>
                                </p>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <MessageSquare className="w-3 h-3"/> {matchedReader?.feedbackCount || matchedReader?.totalFeedbacks || 0} lượt
                                </span>
                            </div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                            <p className="text-xs text-slate-400 mb-1">Ngày sinh</p>
                            <p className="font-bold text-white text-sm">{formatReaderDate(matchedReader?.birthDate)}</p>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                        <h4 className="text-sm font-bold text-slate-300 mb-2 uppercase flex items-center gap-2"><User className="w-4 h-4"/> Giới thiệu</h4>
                        <p className="text-sm text-slate-400 leading-relaxed italic">
                            "{matchedReader?.bio || "Reader này là một chuyên gia Tarot với trực giác nhạy bén, chuyên giải quyết các vấn đề về tình cảm và định hướng sự nghiệp."}"
                        </p>
                    </div>

                    {/* --- PHẦN REVIEWS (ĐÁNH GIÁ CỦA USER) --- */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Đánh giá từ khách hàng</h4>
                        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                            {matchedReader?.reviews && matchedReader.reviews.length > 0 ? (
                                matchedReader.reviews.map((review: any, idx: number) => (
                                    <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-white">{review.customerName || "Khách ẩn danh"}</span>
                                            <div className="flex text-amber-500 text-[10px] gap-0.5">
                                                {/* Hiển thị số sao của từng comment */}
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-2 h-2 ${i < (review.rating || 5) ? "fill-current" : "text-slate-700"}`} />
                                                ))}
                                            </div>
                                        </div>
                                        {/* Nội dung đánh giá bằng chữ */}
                                        <p className="text-xs text-slate-400 italic">"{review.comment || review.content || "Không có nội dung"}"</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                    <p className="text-xs text-slate-500">Chưa có đánh giá nào.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button onClick={() => { setShowProfile(false); handleCreateBooking(); }} className="w-full py-4 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
                        Kết nối ngay với {matchedReader?.fullName}
                    </button>
                 </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODAL THÔNG BÁO --- */}
        <NotificationModal 
            isOpen={modalConfig.isOpen} 
            type={modalConfig.type} 
            message={modalConfig.message} 
            onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            onConfirm={modalConfig.onConfirm}
            confirmText={modalConfig.isOpen && modalConfig.type === 'success' ? "Đến Hồ Sơ Ngay" : "Đóng"}
        />
      </div>
    </div>
  );
}