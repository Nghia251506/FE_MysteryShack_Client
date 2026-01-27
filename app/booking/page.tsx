"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import axios from "axios"; 
import { useDispatch, useSelector } from "react-redux";
import { setTopicAndQuestion } from "@/store/slices/tarotSlice";

import { 
  User, Calendar, Sparkles, Zap, Heart, Briefcase, Wallet, Search,
  ArrowRight, Star, ShieldCheck, Radar, CheckCircle2, Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- HELPERS ---
const getCardFallback = (id: number) => {
    const safeId = Number(id);
    return { 
        name: `Lá bài #${safeId}`, 
        img: `https://www.sacred-texts.com/tarot/pkt/img/ar${String(safeId).padStart(2, '0')}.jpg` 
    };
};

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

const TOPICS = [
  { id: "love", dbId: 1, icon: <Heart className="w-6 h-6" />, label: "Tình Yêu", desc: "Crush, người cũ, hôn nhân", color: "from-pink-500 to-rose-600", bg: "bg-pink-500/10 border-pink-500/20" },
  { id: "career", dbId: 2, icon: <Briefcase className="w-6 h-6" />, label: "Sự Nghiệp", desc: "Công việc, thăng tiến, định hướng", color: "from-blue-500 to-cyan-600", bg: "bg-blue-500/10 border-blue-500/20" },
  { id: "finance", dbId: 3, icon: <Wallet className="w-6 h-6" />, label: "Tài Chính", desc: "Tiền bạc, đầu tư, vận may", color: "from-emerald-500 to-green-600", bg: "bg-emerald-500/10 border-emerald-500/20" }
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

const MATCHED_READER = {
  id: "reader-99", dbId: 99, name: "Grand Master Giang",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  rating: 5.0, reviews: "2.5k+", tags: ["Tarot", "Chiêm Tinh", "Reiki"],
  matchScore: 98, status: "Vừa online 1 phút trước",
  bio: "Chuyên gia chữa lành với 7 năm kinh nghiệm. Dẫn lối bạn bằng ánh sáng của sự thật."
};

const REVIEWS = [
    { id: 1, user: "Minh Anh", comment: "Reader giải bài rất tận tâm.", stars: 5 },
    { id: 2, user: "Hoàng Nam", comment: "Năng lượng rất tích cực!", stars: 5 },
    { id: 3, user: "Thùy Chi", comment: "Rất đúng với hoàn cảnh của mình.", stars: 4 }
];

export default function BookingRequestPage() {
  const router = useRouter(); 
  const dispatch = useDispatch<any>();
  const { drawnCards, topic, question } = useSelector((state: any) => state.tarot);
  const { user, token } = useSelector((state: any) => state.auth);

  const session = { drawnCards, topic, question, userName: user?.fullName, birthDate: user?.birthDate };
  
  const [step, setStep] = useState<1|2|3|4>(1); 
  const [scanStatus, setScanStatus] = useState("Đang kết nối vệ tinh tâm linh...");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfile, setShowProfile] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Pop-up thành công
  const { topicId, questionId } = useSelector((state: any) => state.tarot);

  console.log("Đây là questionId lấy từ tarot-draw",questionId)

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    topic: 0,
    question: 0
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

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

  const handleNextStep = () => {
    if (step === 1 && (!formData.topic || !formData.question)) return alert("Vui lòng chọn chủ đề và câu hỏi");
    if (step === 2 && (!formData.name || !formData.dob)) return alert("Vui lòng nhập họ tên và ngày sinh");
    if (step === 2) { 
        setStep(3); 
    } 
    else if (step < 4) setStep(prev => (prev + 1) as 1 | 2 | 3 | 4);
  };

  useEffect(() => {
    if (step === 3) {
      const stages = ["Đang phân tích...", "Kết nối vũ trụ...", "Tìm kiếm Reader...", "Đã tìm thấy!"];
      let currentStage = 0;
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setTimeout(() => setStep(4), 800); return 100; }
          if (prev > 25 && currentStage === 0) { setScanStatus(stages[1]); currentStage++; }
          if (prev > 50 && currentStage === 1) { setScanStatus(stages[2]); currentStage++; }
          if (prev > 85 && currentStage === 2) { setScanStatus(stages[3]); currentStage++; }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

 const handleCreateBooking = async () => {
    if (!user || !token) {
        if (confirm("Phiên đăng nhập hết hạn. Đi đến trang đăng nhập?")) router.push("/login");
        return;
    }

    setIsSubmitting(true);
    
    // Chuẩn bị payload (giữ nguyên logic cũ của bạn)
    const topicIdMap: Record<string, number> = { "love": 1, "career": 2, "finance": 3 };
    const currentTopicId = topicIdMap[formData.topic] || 1;
    const questionIdToSend = QUESTION_DB_MAP[formData.question] || 1;

    const cardsPayload = session.drawnCards.map((c: any, index: number) => ({
        cardId: Number(c.id || c.dbId || 0),
        nameVi: c.name || c.nameVi,
        imageUrl: c.img || c.image || c.imageUrl,
        cardNumber: index + 1,
        isReversed: c.isReversed || false
    }));

    const payload = {
        customerId: user.id,
        readerId: 99,
        question: questionId,
        topic: currentTopicId,
        selectedCards: cardsPayload,
        status: "PENDING",
        amount: 50000,
        note: `KH: ${formData.name} - Hỏi: ${formData.question}`,
        createdAt: new Date().toISOString()
    };

    try {
        const response = await axios.post(
            'http://localhost:8080/api/v1/sessions', 
            payload,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        // LẤY ID TỪ BACKEND VÀ REDIRECT
        const newSessionId = response.data.id; 
        if (newSessionId) {
            router.push(`/booking/result?sessionId=${newSessionId}`);
        } else {
            setShowSuccessModal(true);
        }
    } catch (error: any) {
        alert(`Thất bại: ${error.response?.data?.message || "Lỗi kết nối server"}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative selection:bg-amber-500/30 flex items-center justify-center p-4">
      {/* Background & Main Content */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" />
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
                <p className="text-slate-400">Chọn một khía cạnh cuộc sống để Reader kết nối năng lượng chính xác nhất.</p>
              </div>
              <div className="lg:col-span-8 space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {TOPICS.map(t => (
                       <button key={t.id} onClick={() => setFormData(prev => ({ ...prev, topic: topicId, question: questionId }))} className={`relative group p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${formData.topic === topicId ? `bg-gradient-to-b ${t.color} border-transparent shadow-lg transform -translate-y-1` : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                          {formData.topic !== topicId && <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-10 transition-opacity`} />}
                          <div className={`mb-3 p-3 rounded-xl w-fit ${formData.topic === topicId ? 'bg-black/20 text-white' : `${t.bg} text-slate-300`}`}>{t.icon}</div>
                          <h3 className={`font-bold text-lg mb-1 ${formData.topic === topicId ? 'text-white' : 'text-slate-200'}`}>{t.label}</h3>
                          <p className={`text-xs ${formData.topic === topicId ? 'text-white/80' : 'text-slate-500'}`}>{t.desc}</p>
                       </button>
                    ))}
                 </div>
                 <AnimatePresence>
                   {formData.topic && (
                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-[#130823]/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Câu hỏi cụ thể</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {QUESTIONS[formData.topic]?.map((q, i) => (
                              <label key={i} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.question === questionId ? 'bg-purple-600/20 border-purple-500' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}>
                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.question === questionId ? 'border-purple-500' : 'border-slate-600'}`}>{formData.question === questionId && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />}</div>
                                 <input type="radio" className="hidden" checked={formData.question === questionId} onChange={() => setFormData(prev => ({...prev, question: questionId}))} />
                                 <span className={`text-sm ${formData.question === questionId ? 'text-white font-medium' : 'text-slate-400'}`}>{q}</span>
                              </label>
                           ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={handleNextStep} 
                                disabled={!formData.question} 
                                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                Tiếp theo <ArrowRight className="w-4 h-4" />
                            </button>
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
                   <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
                      <div className="bg-[#1a1025]/60 p-6 rounded-[2rem] border border-white/10">
                          <h3 className="text-white font-bold mb-4">Trải bài đã chọn</h3>
                          <div className="grid grid-cols-3 gap-2">
                             {session.drawnCards.map((c: any, i: number) => (
                               <div key={i} className="aspect-[2/3] bg-black/50 rounded border border-white/10 overflow-hidden"><img src={c.img} className="w-full h-full object-cover" alt="card"/></div>
                             ))}
                          </div>
                      </div>
                   </div>
                )}
                <div className={`${session.drawnCards.length > 0 ? 'lg:col-span-7 order-1 lg:order-2' : 'w-full'}`}>
                    <div className="bg-[#130823]/80 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                       <button onClick={() => setStep(1)} className="text-xs text-slate-500 mb-6 font-bold">← Quay lại</button>
                       <h2 className="text-3xl font-bold text-white mb-6">Thông tin của bạn</h2>
                       <div className="space-y-6">
                          <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Họ và tên</label>
                              <div className="relative group mt-2">
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-amber-500 transition-colors" placeholder="VD: Nguyễn Văn A"/>
                              </div>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Ngày sinh</label>
                              <div className="relative group mt-2">
                                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                  <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-amber-500 transition-colors" />
                              </div>
                          </div>
                       </div>
                       <div className="mt-8">
                           <button 
                                onClick={handleNextStep} 
                                className="w-full py-4 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-[1.02] transition-all"
                            >
                                <Sparkles className="w-5 h-5" /> Tìm Reader Ngay
                           </button>
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
                    <div className="absolute inset-4 border border-amber-500/10 rounded-full"></div>
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_deg,transparent_270deg,rgba(245,158,11,0.3)_360deg)] animate-[spin_3s_linear_infinite]"></div>
                    <div className="relative z-10 w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-pulse">
                        <Zap className="w-8 h-8 text-amber-400" />
                    </div>
                    <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                </div>
                <h2 className="text-2xl font-bold text-amber-200 animate-pulse text-center mb-2">{scanStatus}</h2>
                <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-700">
                    <motion.div className="h-full bg-gradient-to-r from-amber-500 to-purple-500" style={{ width: `${progress}%` }} />
                </div>
             </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
             <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto bg-[#1a0f2e]/90 border border-amber-500/30 rounded-[2.5rem] p-8 text-center shadow-[0_0_100px_rgba(168,85,247,0.15)]">
                  <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-br from-amber-400 via-purple-500 to-amber-400 mb-6 relative">
                      <img src={MATCHED_READER.avatar} className="w-full h-full rounded-full border-4 border-[#130823] object-cover" alt="Reader" />
                      <div className="absolute bottom-2 right-2 bg-green-500 border-4 border-[#130823] w-7 h-7 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2">{MATCHED_READER.name}</h2>
                  <div className="flex justify-center gap-3 mb-6">
                      <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-current"/> {MATCHED_READER.rating}</div>
                      <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">{MATCHED_READER.matchScore}% Tương thích</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-6 mb-8 text-left max-w-xl mx-auto border border-slate-700/50">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-2">Câu hỏi:</p>
                      <p className="text-white italic text-lg">"{session.question}"</p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <button onClick={() => setShowProfile(true)} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-2xl font-medium transition-all backdrop-blur-sm">Xem hồ sơ</button>
                     <button onClick={() => { setStep(3); setProgress(0); }} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 text-slate-300 hover:text-amber-400 rounded-2xl font-medium transition-all flex items-center justify-center gap-2"><Search className="w-4 h-4" /> Đổi Reader</button>
                     <button onClick={handleCreateBooking} disabled={isSubmitting} className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:transform-none">{isSubmitting ? "Đang gửi..." : "Gửi câu hỏi"} <ArrowRight className="w-5 h-5" /></button>
                  </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* PROFILE MODAL */}
        <AnimatePresence>
          {showProfile && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
               <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-[#130823] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                 <div className="h-32 bg-gradient-to-r from-purple-900 to-amber-900 relative"><button onClick={() => setShowProfile(false)} className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors">✕</button></div>
                 <div className="px-8 pb-8 -mt-12 relative">
                    <div className="flex flex-col md:flex-row gap-6 items-end mb-8"><img src={MATCHED_READER.avatar} className="w-32 h-32 rounded-3xl border-4 border-[#130823] shadow-xl object-cover" alt="Avatar" /><div className="flex-1 pb-2"><h3 className="text-3xl font-bold text-white">{MATCHED_READER.name}</h3><div className="flex gap-2 mt-2">{MATCHED_READER.tags.map(tag => (<span key={tag} className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-400">{tag}</span>))}</div></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center"><p className="text-amber-400 font-bold text-xl">{MATCHED_READER.rating}</p><p className="text-[10px] text-slate-500 uppercase">Sao đánh giá</p></div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center"><p className="text-purple-400 font-bold text-xl">{MATCHED_READER.reviews}</p><p className="text-[10px] text-slate-500 uppercase">Lượt xem</p></div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center"><p className="text-green-400 font-bold text-xl">Online</p><p className="text-[10px] text-slate-500 uppercase">Trạng thái</p></div>
                    </div>
                    <div className="space-y-4"><h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Đánh giá từ khách hàng</h4><div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">{REVIEWS.map(rev => (<div key={rev.id} className="bg-white/5 p-4 rounded-xl border border-white/5"><div className="flex justify-between items-center mb-1"><span className="text-sm font-bold text-slate-200">{rev.user}</span><div className="flex gap-0.5">{[...Array(rev.stars)].map((_, i) => (<Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />))}</div></div><p className="text-sm text-slate-400 italic">"{rev.comment}"</p></div>))}</div></div>
                    <button onClick={() => { setShowProfile(false); handleCreateBooking(); }} className="w-full mt-8 py-4 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity">Kết nối ngay với {MATCHED_READER.name}</button>
                 </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- POP-UP THÀNH CÔNG CHUYÊN NGHIỆP --- */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            >
              <motion.div 
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-sm w-full bg-gradient-to-b from-[#1a1025] to-[#0a0510] border border-amber-500/30 rounded-[2.5rem] p-10 text-center shadow-[0_0_50px_rgba(245,158,11,0.2)]"
              >
                {/* Icon Circle */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Thành Công!</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Yêu cầu của bạn đã được gửi đến vũ trụ. Reader sẽ sớm phản hồi câu hỏi của bạn.
                </p>

                <div className="space-y-3">
                  <button 
                    onClick={() => router.push("/profile")}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  >
                    Xem lịch sử <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={() => router.push("/")}
                    className="w-full py-4 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-2xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" /> Về trang chủ
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 opacity-10"><Sparkles className="w-6 h-6 text-amber-500" /></div>
                <div className="absolute bottom-4 right-4 opacity-10"><Sparkles className="w-6 h-6 text-purple-500" /></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}