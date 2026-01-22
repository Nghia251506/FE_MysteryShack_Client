"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useTarotSession } from "@/context/TarotContext";
// Giữ logic axios trực tiếp để fix lỗi backend
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";

import { 
  User, Calendar, Sparkles, Zap, Heart, Briefcase, Wallet, Search,
  ArrowRight, Star, ShieldCheck, X, Award, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK DATA ---
const TOPICS = [
  { id: "love", dbId: 1, icon: <Heart className="w-6 h-6" />, label: "Tình Yêu", desc: "Crush, người cũ, hôn nhân", color: "from-pink-500 to-rose-600", bg: "bg-pink-500/10 border-pink-500/20" },
  { id: "career", dbId: 2, icon: <Briefcase className="w-6 h-6" />, label: "Sự Nghiệp", desc: "Công việc, thăng tiến, định hướng", color: "from-blue-500 to-cyan-600", bg: "bg-blue-500/10 border-blue-500/20" },
  { id: "finance", dbId: 3, icon: <Wallet className="w-6 h-6" />, label: "Tài Chính", desc: "Tiền bạc, đầu tư, vận may", color: "from-emerald-500 to-green-600", bg: "bg-emerald-500/10 border-emerald-500/20" }
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
    "Tôi có nên mua tài sản lớn?": 1
};

const QUESTIONS: Record<string, string[]> = {
  love: ["Người ấy nghĩ gì về tôi?", "Tương lai mối quan hệ này?", "Khi nào tôi có người yêu?", "Người cũ có quay lại không?"],
  career: ["Tôi có nên nhảy việc lúc này?", "Cơ hội thăng tiến sắp tới?", "Tôi hợp với nghề nào?", "Đồng nghiệp nghĩ gì về tôi?"],
  finance: ["Tình hình tài chính tháng tới?", "Cơ hội đầu tư sinh lời?", "Vận may tiền bạc sắp tới?", "Tôi có nên mua tài sản lớn?"]
};

// --- DATA READER & REVIEWS THEO MẪU BẠN GỬI ---
const MATCHED_READER = {
  id: "reader-99",
  dbId: 99, 
  name: "Grand Master Giang",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  rating: 5.0,
  reviews: "2.5k+",
  tags: ["Tarot", "Chiêm Tinh", "Reiki"],
  matchScore: 98,
  status: "Vừa online 1 phút trước",
  bio: "Chuyên gia chữa lành với 7 năm kinh nghiệm. Dẫn lối bạn bằng ánh sáng của sự thật và lòng trắc ẩn."
};

const REVIEWS = [
  { id: 1, user: "Minh Anh", comment: "Reader giải bài rất tận tâm, nói đúng trọng tâm vấn đề mình đang gặp phải.", stars: 5 },
  { id: 2, user: "Hoàng Nam", comment: "Năng lượng rất tích cực, mình cảm thấy nhẹ lòng hơn sau buổi trải bài.", stars: 5 },
  { id: 3, user: "Thùy Chi", comment: "Cách giải thích dễ hiểu, logic và có chiều sâu kiến thức.", stars: 4 },
];

export default function BookingRequestPage() {
  const router = useRouter(); 
  const { session, updateSession } = useTarotSession();
  const { user } = useAuth();
  
  const [step, setStep] = useState<1|2|3|4>(1); 
  const [scanStatus, setScanStatus] = useState("Đang kết nối vệ tinh tâm linh...");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfile, setShowProfile] = useState(false); 

  const [formData, setFormData] = useState({
    name: session.userName || user?.fullName || "",
    dob: session.birthDate || "",
    topic: session.topic || "",
    question: session.question || ""
  });

  useEffect(() => {
    if (user?.fullName && !formData.name) {
      setFormData(prev => ({ ...prev, name: user.fullName }));
    }
  }, [user]);

  useEffect(() => {
    if (step === 1 && session.drawnCards.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        topic: session.topic, 
        question: session.question 
      }));
      setStep(2); 
    }
  }, [session.drawnCards.length]);

  const handleNextStep = () => {
    if (step === 1 && (!formData.topic || !formData.question)) return alert("Vui lòng chọn chủ đề và câu hỏi");
    if (step === 2 && (!formData.name || !formData.dob)) return alert("Vui lòng nhập họ tên và ngày sinh");
    if (step === 2) { updateSession({ userName: formData.name, birthDate: formData.dob, topic: formData.topic, question: formData.question }); setStep(3); } 
    else if (step < 4) setStep(prev => (prev + 1) as 1 | 2 | 3 | 4);
  };

  useEffect(() => {
    if (step === 3) {
      const stages = [
        { pct: 10, msg: "Đang phân tích năng lượng 3 lá bài..." },
        { pct: 30, msg: "Đối chiếu bản đồ sao ngày sinh..." },
        { pct: 60, msg: "Tìm kiếm Reader có tần số phù hợp..." },
        { pct: 85, msg: "Đã tìm thấy kết nối định mệnh..." },
        { pct: 100, msg: "Hoàn tất!" }
      ];
      let currentStage = 0;
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setTimeout(() => setStep(4), 500); return 100; }
          if (currentStage < stages.length && prev >= stages[currentStage].pct) { setScanStatus(stages[currentStage].msg); currentStage++; }
          return prev + 1;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step]);

  // --- LOGIC GỌI API (GIỮ NGUYÊN ĐỂ KHÔNG LỖI) ---
  const handleCreateBooking = async () => {
    const token = localStorage.getItem("accessToken");
    if (!user || !token) {
        if (confirm("Phiên đăng nhập hết hạn hoặc chưa đăng nhập. Đi đến trang đăng nhập?")) {
            router.push("/login");
        }
        return;
    }

    setIsSubmitting(true);
    
    const topicIdMap: Record<string, number> = { "love": 1, "career": 2, "finance": 3 };
    const currentTopicId = topicIdMap[formData.topic] || 1;
    const questionIdToSend = QUESTION_DB_MAP[formData.question] || 1;

    // Convert mảng bài sang số để tránh lỗi JSON backend
    const cardIds = session.drawnCards.map(c => Number(c.dbId || c.id || 0)).filter(id => id > 0);

    const payload: any = {
        customer: user.id,   
        customerId: user.id,
        reader: 99,
        readerId: 99,
        question: questionIdToSend, 
        questionId: questionIdToSend,
        topicId: currentTopicId,
        selectedCards: cardIds, 
        status: "PENDING",
        isPaid: false,
        active: true,
        confirmed: false,
        amount: 0, 
        note: `KH: ${formData.name} - Hỏi: ${formData.question}`,
        createdAt: new Date().toISOString()
    };

    try {
        console.log("Sending Payload:", payload);
        const response = await axios.post(
            'http://localhost:8080/api/v1/sessions', 
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Success:", response.data);
        alert(`Gửi thành công! Mã phiên: ${response.data.id || 'Mới'}.`);
        router.push("/"); 
    } catch (error: any) {
        console.error("API Error:", error);
        const serverMsg = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
        if (error.response?.status === 401 || error.response?.status === 403) {
             alert("Lỗi xác thực: Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.");
             router.push("/login");
        } else {
             alert(`Thất bại: ${serverMsg}`);
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative selection:bg-amber-500/30 flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: CHỌN CHỦ ĐỀ */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
                <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
                   <Sparkles className="w-3 h-3" /> Bước 1
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Bạn đang <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">trăn trở</span> về điều gì?
                </h1>
                <p className="text-slate-400">Chọn một khía cạnh cuộc sống để Reader kết nối năng lượng chính xác nhất.</p>
              </div>

              <div className="lg:col-span-8 space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {TOPICS.map(t => (
                       <button 
                         key={t.id}
                         onClick={() => setFormData(prev => ({ ...prev, topic: t.id, question: "" }))}
                         className={`relative group p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${formData.topic === t.id ? `bg-gradient-to-b ${t.color} border-transparent shadow-lg transform -translate-y-1` : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                       >
                          {formData.topic !== t.id && <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-10 transition-opacity`} />}
                          <div className={`mb-3 p-3 rounded-xl w-fit ${formData.topic === t.id ? 'bg-black/20 text-white' : `${t.bg} text-slate-300`}`}>{t.icon}</div>
                          <h3 className={`font-bold text-lg mb-1 ${formData.topic === t.id ? 'text-white' : 'text-slate-200'}`}>{t.label}</h3>
                          <p className={`text-xs ${formData.topic === t.id ? 'text-white/80' : 'text-slate-500'}`}>{t.desc}</p>
                       </button>
                    ))}
                 </div>

                 <AnimatePresence>
                   {formData.topic && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="bg-[#130823]/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden"
                     >
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Câu hỏi cụ thể</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {QUESTIONS[formData.topic]?.map((q, i) => (
                              <label key={i} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.question === q ? 'bg-purple-600/20 border-purple-500' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}>
                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.question === q ? 'border-purple-500' : 'border-slate-600'}`}>
                                    {formData.question === q && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />}
                                 </div>
                                 <input type="radio" className="hidden" checked={formData.question === q} onChange={() => setFormData(prev => ({...prev, question: q}))} />
                                 <span className={`text-sm ${formData.question === q ? 'text-white font-medium' : 'text-slate-400'}`}>{q}</span>
                              </label>
                           ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                           <button onClick={handleNextStep} disabled={!formData.question} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                              Tiếp theo <ArrowRight className="w-4 h-4" />
                           </button>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* STEP 2: THÔNG TIN KHÁCH HÀNG */}
          {step === 2 && (
             <motion.div 
               key="step2"
               initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
               className={`mx-auto ${session.drawnCards.length > 0 ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'max-w-2xl'}`}
             >
                {/* Phần hiển thị bài rút gọn */}
                {session.drawnCards.length > 0 && (
                   <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
                      <div className="bg-[#1a1025]/60 p-6 rounded-[2rem] border border-white/10">
                          <h3 className="text-white font-bold mb-4">Trải bài đã chọn</h3>
                          <div className="grid grid-cols-3 gap-2">
                             {session.drawnCards.map((c, i) => (
                               <div key={i} className="aspect-[2/3] bg-black/50 rounded border border-white/10 overflow-hidden">
                                  <img src={c.img} className="w-full h-full object-cover" alt="card"/>
                               </div>
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
                                <input 
                                   value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                   className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-amber-500"
                                   placeholder="VD: Nguyễn Văn A"
                                />
                             </div>
                          </div>
                          <div>
                             <label className="text-xs font-bold text-slate-400 uppercase">Ngày sinh</label>
                             <div className="relative group mt-2">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input 
                                   type="date"
                                   value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})}
                                   className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-amber-500"
                                />
                             </div>
                          </div>
                       </div>

                       <div className="mt-8">
                          <button onClick={handleNextStep} className="w-full py-4 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:opacity-90">
                             <Sparkles className="w-5 h-5" /> Tìm Reader Ngay
                          </button>
                       </div>
                    </div>
                </div>
             </motion.div>
          )}

          {/* STEP 3: SCANNING */}
          {step === 3 && (
             <motion.div 
               key="step3"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center h-[60vh]"
             >
                <div className="relative w-60 h-60 flex items-center justify-center mb-10">
                   <Zap className="w-16 h-16 text-amber-400 animate-pulse" />
                   {[1, 2, 3].map(i => (
                      <div key={i} className="absolute border border-white/10 rounded-full animate-ping" style={{width: i*100+'%', height: i*100+'%', animationDuration: '3s'}} />
                   ))}
                </div>
                <h2 className="text-2xl font-bold text-amber-200 animate-pulse">{scanStatus}</h2>
                <div className="w-64 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
                   <motion.div className="h-full bg-amber-500" style={{ width: `${progress}%` }} />
                </div>
             </motion.div>
          )}

          {/* STEP 4: KẾT QUẢ & NÚT GỬI (ĐÚNG GIAO DIỆN MẪU BẠN GỬI) */}
          {step === 4 && (
             <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto bg-[#1a0f2e]/90 backdrop-blur-3xl border border-amber-500/30 rounded-[2.5rem] p-8 text-center shadow-[0_0_100px_rgba(168,85,247,0.15)]"
             >
                  {/* Avatar Section */}
                  <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-br from-amber-400 via-purple-500 to-amber-400 mb-6 relative animate-border-spin">
                     <img src={MATCHED_READER.avatar} className="w-full h-full rounded-full border-4 border-[#130823] object-cover" alt="Reader" />
                     <div className="absolute bottom-2 right-2 bg-green-500 border-4 border-[#130823] w-7 h-7 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                     </div>
                  </div>
                  
                  {/* Name & Stats */}
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                     <h2 className="text-4xl font-bold text-white mb-2">{MATCHED_READER.name}</h2>
                     <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                           <Star className="w-3 h-3 fill-current" /> {MATCHED_READER.rating}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/30">
                           {MATCHED_READER.matchScore}% Tương thích
                        </span>
                     </div>
                  </motion.div>
                  
                  {/* Question Box */}
                  <div className="bg-slate-900/50 rounded-xl p-6 mb-8 text-left max-w-xl mx-auto border border-slate-700/50 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-purple-600"></div>
                     <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wider flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-500" /> Reader đã nhận được câu hỏi:
                     </p>
                     <p className="text-white italic text-lg font-serif">"{session.question}"</p>
                  </div>

                  {/* Buttons Action */}
                  <div className="flex justify-center gap-4">
                     <button 
                        onClick={() => setShowProfile(true)} 
                        className="px-8 py-4 text-slate-400 hover:text-white font-medium transition-colors"
                     >
                        Xem hồ sơ
                     </button>
                     
                     <button 
                       onClick={() => {
                         setStep(3);       // Quay lại bước quét
                         setProgress(0);   // Reset tiến trình
                       }} 
                       className="px-6 py-4 border border-white/10 hover:border-amber-500/50 hover:bg-white/5 text-slate-300 rounded-2xl font-medium transition-all flex items-center gap-2"
                     >
                       <Search className="w-4 h-4" /> Đổi Reader
                     </button>

                     <button 
                        onClick={handleCreateBooking}
                        disabled={isSubmitting}
                        className="group px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-green-500/40 transition-all flex items-center gap-3 transform hover:-translate-y-1"
                     >
                        {isSubmitting ? (
                             <>
                               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                               Đang gửi...
                             </>
                          ) : (
                             <>
                               <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                               </span>
                               Gửi câu hỏi <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                             </>
                          )}
                     </button>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
                     <ShieldCheck className="w-4 h-4" /> Bảo mật & Riêng tư tuyệt đối
                  </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODAL HỒ SƠ READER (CÓ REVIEWS) --- */}
        <AnimatePresence>
          {showProfile && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
               <motion.div 
                 initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                 className="relative w-full max-w-2xl bg-[#130823] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
               >
                 {/* Header Modal */}
                 <div className="h-32 bg-gradient-to-r from-purple-900 to-amber-900 relative">
                    <button onClick={() => setShowProfile(false)} className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors">
                       ✕
                    </button>
                 </div>

                 <div className="px-8 pb-8 -mt-12 relative">
                    <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
                       <img src={MATCHED_READER.avatar} className="w-32 h-32 rounded-3xl border-4 border-[#130823] shadow-xl object-cover" alt="Avatar" />
                       <div className="flex-1 pb-2">
                          <h3 className="text-3xl font-bold text-white">{MATCHED_READER.name}</h3>
                          <div className="flex gap-2 mt-2">
                             {MATCHED_READER.tags.map(tag => (
                                <span key={tag} className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-400">
                                   {tag}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                          <p className="text-amber-400 font-bold text-xl">{MATCHED_READER.rating}</p>
                          <p className="text-[10px] text-slate-500 uppercase">Sao đánh giá</p>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                          <p className="text-purple-400 font-bold text-xl">{MATCHED_READER.reviews}</p>
                          <p className="text-[10px] text-slate-500 uppercase">Lượt xem</p>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                          <p className="text-green-400 font-bold text-xl">Online</p>
                          <p className="text-[10px] text-slate-500 uppercase">Trạng thái</p>
                       </div>
                    </div>

                    {/* Danh sách Reviews */}
                    <div className="space-y-4">
                       <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Đánh giá từ khách hàng
                       </h4>
                       <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {REVIEWS.map(rev => (
                             <div key={rev.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-1">
                                   <span className="text-sm font-bold text-slate-200">{rev.user}</span>
                                   <div className="flex gap-0.5">
                                      {[...Array(rev.stars)].map((_, i) => (
                                         <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                                      ))}
                                   </div>
                                </div>
                                <p className="text-sm text-slate-400 italic">"{rev.comment}"</p>
                             </div>
                          ))}
                       </div>
                    </div>

                    <button 
                       onClick={() => { setShowProfile(false); handleCreateBooking(); }}
                       className="w-full mt-8 py-4 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                    >
                       Kết nối ngay với {MATCHED_READER.name}
                    </button>
                 </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}