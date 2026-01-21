"use client";

import React, { useState, useEffect } from "react";
import { useTarotSession } from "@/context/TarotContext";
import { 
  User, Calendar, Sparkles, Zap, Heart, Briefcase, Wallet, Search,
  ArrowRight, Star, ShieldCheck, RotateCcw, Quote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK DATA ---
const TOPICS = [
  { 
    id: "love", 
    icon: <Heart className="w-6 h-6" />, 
    label: "Tình Yêu", 
    desc: "Crush, người cũ, hôn nhân",
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-500/10 border-pink-500/20"
  },
  { 
    id: "career", 
    icon: <Briefcase className="w-6 h-6" />, 
    label: "Sự Nghiệp", 
    desc: "Công việc, thăng tiến, định hướng",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-500/10 border-blue-500/20"
  },
  { 
    id: "finance", 
    icon: <Wallet className="w-6 h-6" />, 
    label: "Tài Chính", 
    desc: "Tiền bạc, đầu tư, vận may",
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-500/10 border-emerald-500/20"
  }
];

const QUESTIONS = {
  love: ["Người ấy nghĩ gì về tôi?", "Tương lai mối quan hệ này?", "Khi nào tôi có người yêu?", "Người cũ có quay lại không?"],
  career: ["Tôi có nên nhảy việc lúc này?", "Cơ hội thăng tiến sắp tới?", "Tôi hợp với nghề nào?", "Đồng nghiệp nghĩ gì về tôi?"],
  finance: ["Tình hình tài chính tháng tới?", "Cơ hội đầu tư sinh lời?", "Vận may tiền bạc sắp tới?", "Tôi có nên mua tài sản lớn?"]
};

const MATCHED_READER = {
  id: "reader-99",
  name: "Master Tuệ Minh",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  rating: 4.98,
  reviews: "2.4k",
  tags: ["Tarot", "Chiêm Tinh", "Reiki"],
  matchScore: 99,
  status: "Vừa online",
  bio: "Chuyên gia chữa lành với 7 năm kinh nghiệm. Dẫn lối bạn bằng ánh sáng của sự thật và lòng trắc ẩn."
};

export default function BookingRequestPage() {
  const { session, updateSession } = useTarotSession();
  
  // State quản lý luồng
  const [step, setStep] = useState<1|2|3|4>(1); 
  const [scanStatus, setScanStatus] = useState("Đang kết nối vệ tinh tâm linh...");

  const [showProfile, setShowProfile] = useState(false);

  // Dữ liệu đánh giá giả lập
  const REVIEWS = [
    { id: 1, user: "Minh Anh", comment: "Reader giải bài rất tận tâm, nói đúng trọng tâm vấn đề mình đang gặp phải.", stars: 5 },
    { id: 2, user: "Hoàng Nam", comment: "Năng lượng rất tích cực, mình cảm thấy nhẹ lòng hơn sau buổi trải bài.", stars: 5 },
    { id: 3, user: "Thùy Chi", comment: "Cách giải thích dễ hiểu, logic và có chiều sâu kiến thức.", stars: 4 },
  ];
  // const [step1, setStep1] = useState<"form" | "scanning" | "matched">("form");
  // const [scanStatus, setScanStatus] = useState("Khởi tạo kết nối...");

  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: session.userName || "",
    dob: session.birthDate || "",
    topic: session.topic || "",
    question: session.question || ""
  });

  // Tự động nhảy bước nếu có bài
  useEffect(() => {
    // Nếu trong session đã có bài rút -> Nhảy thẳng sang bước 2 (Điền thông tin)
    if (session.drawnCards.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        topic: session.topic, 
        question: session.question 
      }));
      setStep(2); 
    }
  }, [session]);

  const handleNextStep = () => {
    if (step === 1 && (!formData.topic || !formData.question)) return alert("Vui lòng chọn chủ đề và câu hỏi");
    if (step === 2 && (!formData.name || !formData.dob)) return alert("Vui lòng nhập họ tên và ngày sinh");
    if (step === 2) {
      updateSession({ 
        userName: formData.name, 
        birthDate: formData.dob, 
        topic: formData.topic, 
        question: formData.question 
      });
      setStep(3); // Start Scanning
    } else {
      setStep(prev => (prev + 1) as any);
    }
  };

  // Logic Scanning Animation
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
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(4), 500);
            return 100;
          }
          if (currentStage < stages.length && prev >= stages[currentStage].pct) {
            setScanStatus(stages[currentStage].msg);
            currentStage++;
          }
          return prev + 1;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative selection:bg-amber-500/30 flex items-center justify-center p-4">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        
        {/* PROGRESS BAR (Top) */}
        {step < 4 && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
               {[1, 2, 3].map(i => (
                 <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${step >= i ? "bg-amber-500 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-white/20"}`} />
               ))}
               <span className="ml-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                 {step === 1 ? "Chủ đề" : step === 2 ? "Xác nhận & Thông tin" : "Kết nối"}
               </span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* === STEP 1: CHỌN CHỦ ĐỀ & CÂU HỎI (Chỉ hiện khi chưa có bài) === */}
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
                 {/* Topic List */}
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

                 {/* Questions */}
                 <AnimatePresence>
                   {formData.topic && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="bg-[#130823]/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden"
                     >
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Câu hỏi cụ thể</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {QUESTIONS[formData.topic as keyof typeof QUESTIONS]?.map((q, i) => (
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

          {/* === STEP 2: THÔNG TIN ĐỊNH DANH + HIỂN THỊ BÀI (QUAN TRỌNG) === */}
          {step === 2 && (
             <motion.div 
               key="step2"
               initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
               // Nếu có bài thì chia Grid, không có bài thì max-width nhỏ
               className={`mx-auto ${session.drawnCards.length > 0 ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'max-w-2xl'}`}
             >
                {/* CỘT TRÁI: HIỂN THỊ 3 LÁ BÀI (Chỉ hiện nếu có bài) */}
                {session.drawnCards.length > 0 && (
                   <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
                      <div className="bg-[#1a1025]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
                          <div className="flex items-center gap-2 mb-4">
                             <Sparkles className="w-5 h-5 text-amber-500" />
                             <h3 className="text-xl font-bold text-white">Trải Bài Của Bạn</h3>
                          </div>
                          <p className="text-sm text-slate-400 mb-6 italic border-l-2 border-purple-500 pl-3">
                             "{session.question}"
                          </p>

                          {/* Grid 3 lá bài */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                             {session.drawnCards.map((card, idx) => (
                                <motion.div 
                                   key={idx} 
                                   initial={{ y: 20, opacity: 0 }} 
                                   animate={{ y: 0, opacity: 1 }} 
                                   transition={{ delay: idx * 0.2 }}
                                   className="relative group"
                                >
                                   <div className={`relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg border border-white/10 bg-[#0f0518]`}>
                                      {/* Trạng thái ngược */}
                                      {card.isReversed && (
                                         <div className="absolute top-1 right-1 z-10 bg-red-600/90 text-white text-[8px] px-1 rounded font-bold">REV</div>
                                      )}
                                      
                                      <img 
                                        src={card.img} 
                                        alt={card.name} 
                                        className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`} 
                                      />
                                   </div>
                                   <p className="text-[10px] text-center text-slate-300 mt-2 font-medium truncate">{card.name}</p>
                                   <p className="text-[9px] text-center text-slate-500 uppercase">{card.isReversed ? 'Ngược' : 'Xuôi'}</p>
                                </motion.div>
                             ))}
                          </div>

                          <div className="text-xs text-center text-slate-500 mt-2">
                             *Reader sẽ dựa vào 3 lá bài này để luận giải
                          </div>
                      </div>
                   </div>
                )}

                {/* CỘT PHẢI: FORM NHẬP LIỆU */}
                <div className={`${session.drawnCards.length > 0 ? 'lg:col-span-7 order-1 lg:order-2' : 'w-full'}`}>
                    <div className="bg-[#130823]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-[60px]" />
                       
                       <div className="relative z-10">
                          {/* Nút quay lại chỉ hiện nếu không có bài (vì nếu có bài thì đây là bước đầu tiên) */}
                          {session.drawnCards.length === 0 && (
                             <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white mb-6 uppercase tracking-wider font-bold">← Quay lại</button>
                          )}
                          
                          <h2 className="text-3xl font-bold text-white mb-2">Thông tin định danh</h2>
                          <p className="text-slate-400 mb-8">Giúp Reader kết nối với bản đồ sao và năng lượng của riêng bạn.</p>

                          <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Họ và tên</label>
                                <div className="relative group">
                                   <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                                   <input 
                                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-700"
                                      placeholder="VD: Nguyễn Văn A"
                                   />
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Ngày tháng năm sinh</label>
                                <div className="relative group">
                                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                                   <input 
                                      type="date"
                                      value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})}
                                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all appearance-none"
                                   />
                                </div>
                             </div>
                          </div>

                          <div className="mt-8">
                             <button 
                               onClick={handleNextStep}
                               className="w-full py-4 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95"
                             >
                                <Sparkles className="w-5 h-5" /> Tìm Reader Ngay
                             </button>
                             <p className="text-center text-[10px] text-slate-500 mt-4 flex items-center justify-center gap-1.5">
                                <ShieldCheck className="w-3 h-3" /> Thông tin bảo mật 100%
                             </p>
                          </div>
                       </div>
                    </div>
                </div>
             </motion.div>
          )}

          {/* === STEP 3: SCANNING (Giữ nguyên giao diện Scan đẹp) === */}
          {step === 3 && (
             <motion.div 
               key="step3"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center h-[60vh]"
             >
                <div className="relative w-80 h-80 flex items-center justify-center mb-10">
                   {[1, 2, 3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                        transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                        className={`absolute border rounded-full ${i === 3 ? 'border-dashed border-white/10' : 'border-white/5'}`}
                        style={{ width: `${i * 30 + 40}%`, height: `${i * 30 + 40}%` }}
                      >
                         <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                      </motion.div>
                   ))}
                   <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute w-full h-full rounded-full bg-gradient-to-t from-transparent via-transparent to-amber-500/10"
                      style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }}
                   />
                   <div className="relative z-10 w-24 h-24 bg-[#0a0410] rounded-full border border-amber-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                      <Zap className="w-10 h-10 text-amber-400 animate-pulse" />
                   </div>
                </div>

                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-200 animate-pulse">
                   {scanStatus}
                </h2>
                
                <div className="w-64 h-1 bg-slate-800 rounded-full mt-6 relative overflow-hidden">
                   <motion.div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-purple-600"
                      style={{ width: `${progress}%` }}
                   />
                </div>
             </motion.div>
          )}

          {/* === STEP 4: MATCHED PROFILE === */}
          {step === 4 && (
             <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto"
             >
                <div className="bg-[#1a0f2e]/90 backdrop-blur-3xl border border-amber-500/30 rounded-[2.5rem] p-1 shadow-[0_0_80px_rgba(168,85,247,0.3)] relative group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-purple-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                   <div className="bg-[#130823] rounded-[2.3rem] p-8 text-center relative overflow-hidden z-10">
                      <div className="absolute top-6 right-0 bg-gradient-to-l from-green-500 to-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-l-full shadow-lg">
                         99% PHÙ HỢP
                      </div>

                      <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-br from-amber-400 via-purple-500 to-amber-400 mb-5 relative">
                          <img src={MATCHED_READER.avatar} className="w-full h-full rounded-full border-4 border-[#130823] object-cover" alt="Reader" />
                          <div className="absolute bottom-2 right-2 bg-green-500 border-4 border-[#130823] w-7 h-7 rounded-full flex items-center justify-center">
                             <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-white mb-2">{MATCHED_READER.name}</h2>
                      <p className="text-slate-400 text-sm mb-6 px-4 leading-relaxed line-clamp-2">
                         "{MATCHED_READER.bio}"
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-8">
                         <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
                             <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Đánh giá</span>
                             <div className="flex items-center gap-1 text-amber-400 font-bold text-lg">
                                 {MATCHED_READER.rating} <Star className="w-3 h-3 fill-current" />
                             </div>
                         </div>
                         <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
                             <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Lượt xem</span>
                             <div className="flex items-center gap-1 text-purple-400 font-bold text-lg">
                                 {MATCHED_READER.reviews}
                             </div>
                         </div>
                      </div>

                      <div className="space-y-3">
                          <button onClick={() => alert("Chuyển đến trang thanh toán/chat")} className="w-full py-4 bg-gradient-to-r from-white to-slate-200 text-black font-bold rounded-2xl shadow-lg hover:shadow-white/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                             <span className="relative flex h-3 w-3 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                             </span>
                             Kết Nối Ngay
                          </button>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5">
                         <p className="text-[10px] text-slate-500 uppercase">Reader sẽ giải đáp về:</p>
                         <p className="text-xs text-amber-500 italic mt-1 truncate">"{formData.question}"</p>
                      </div>
                   </div>
                </div>
             </motion.div>
          )}

          </AnimatePresence>
          <AnimatePresence>
            <motion.div>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowProfile(true)} className="px-8 py-4 text-slate-400 hover:text-white font-medium transition-colors">
                    Xem hồ sơ
                </button>
                {/* NÚT ĐỔI READER MỚI THÊM VÀO */}
                <button 
                  onClick={() => {
                    setStep(3); // Quay lại bước quét để tìm người mới
                    setProgress(0);      // Reset tiến trình
                  }} 
                  className="px-6 py-4 border border-white/10 hover:border-amber-500/50 hover:bg-white/5 text-slate-300 rounded-2xl font-medium transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" /> Đổi Reader
                </button>
                <button onClick={() => alert("Vào phòng chat!")} className="group px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-green-500/40 transition-all flex items-center gap-3 transform hover:-translate-y-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    Gửi câu hỏi <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4" /> Bảo mật & Riêng tư tuyệt đối
              </div>
            </motion.div>
          </AnimatePresence>
          {/* === MODAL HỒ SƠ READER === */}
          <AnimatePresence>
            {showProfile && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Overlay làm mờ nền */}
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowProfile(false)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />
                
                {/* Nội dung Modal */}
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-2xl bg-[#130823] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                >
                  {/* Header Hồ Sơ */}
                  <div className="h-32 bg-gradient-to-r from-purple-900 to-amber-900 relative">
                    <button 
                      onClick={() => setShowProfile(false)}
                      className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="px-8 pb-8 -mt-12 relative">
                    <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
                      <img 
                        src={MATCHED_READER.avatar} 
                        className="w-32 h-32 rounded-3xl border-4 border-[#130823] shadow-xl object-cover" 
                        alt="Avatar"
                      />
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

                    {/* Phần Đánh Giá của người dùng */}
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
                      onClick={() => { setShowProfile(false); alert("Vào phòng chat!"); }}
                      className="w-full mt-8 py-4 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                    >
                      Kết nối ngay với {MATCHED_READER.name}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
}