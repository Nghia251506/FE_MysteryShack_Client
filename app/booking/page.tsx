"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useTarotSession } from "@/context/TarotContext";
// Import Service - Đảm bảo đường dẫn đúng với project của bạn
import { ReadingSessionService } from "@/services/readingSessionService";

import { 
  User, Calendar, Sparkles, Zap, Heart, Briefcase, Wallet, Search,
  ArrowRight, Star, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK DATA ---
const TOPICS = [
  { 
    id: "love", 
    dbId: 1, 
    icon: <Heart className="w-6 h-6" />, 
    label: "Tình Yêu", 
    desc: "Crush, người cũ, hôn nhân",
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-500/10 border-pink-500/20"
  },
  { 
    id: "career", 
    dbId: 2, 
    icon: <Briefcase className="w-6 h-6" />, 
    label: "Sự Nghiệp", 
    desc: "Công việc, thăng tiến, định hướng",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-500/10 border-blue-500/20"
  },
  { 
    id: "finance", 
    dbId: 3, 
    icon: <Wallet className="w-6 h-6" />, 
    label: "Tài Chính", 
    desc: "Tiền bạc, đầu tư, vận may",
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-500/10 border-emerald-500/20"
  }
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

const MATCHED_READER = {
  id: "reader-99",
  dbId: 99, 
  name: "Master Tuệ Minh",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  rating: 4.98,
  reviews: "2.4k",
  tags: ["Tarot", "Chiêm Tinh", "Reiki"],
  matchScore: 99,
  status: "Vừa online",
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
  
  // State quản lý luồng
  const [step, setStep] = useState<1|2|3|4>(1); 
  const [scanStatus, setScanStatus] = useState("Đang kết nối vệ tinh tâm linh...");
  const [progress, setProgress] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: session.userName || "",
    dob: session.birthDate || "",
    topic: session.topic || "",
    question: session.question || ""
  });

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
    
    if (step === 2) {
      updateSession({ 
        userName: formData.name, 
        birthDate: formData.dob, 
        topic: formData.topic, 
        question: formData.question 
      });
      setStep(3); 
    } else if (step < 4) {
      setStep(prev => (prev + 1) as 1 | 2 | 3 | 4);
    }
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

  // --- HÀM GỌI API FIX LỖI "null into int" ---
  const handleCreateBooking = async () => {
    setIsSubmitting(true);
    
    // Tìm ID Topic dựa trên topic text (mock)
    // Map: love -> 1, career -> 2, finance -> 3
    const topicIdMap: Record<string, number> = { "love": 1, "career": 2, "finance": 3 };
    const currentTopicId = topicIdMap[formData.topic] || 1;
    
    const questionIdToSend = QUESTION_DB_MAP[formData.question] || 1;

    // PAYLOAD "BẤT TỬ": Gửi đầy đủ trường INT để tránh Java crash
    const payload: any = {
        // 1. Customer: Users có cột elo_score (int)
        customer: { 
            id: 1,
            isVerified: true, 
            eloScore: 0,         // <-- QUAN TRỌNG: Fix lỗi int
            role: "CUSTOMER"
        }, 
        userId: 1, 
        
        // 2. Reader: Users có cột elo_score (int)
        readerId: 99,
        reader: {
            id: 99,
            isVerified: true, 
            eloScore: 1000,      // <-- QUAN TRỌNG: Fix lỗi int
            role: "READER"
        },

        // 3. Question: TopicQuestion có cột topic_id (int)
        question: { 
            id: questionIdToSend,
            isPopular: true,
            topicId: currentTopicId, // <-- QUAN TRỌNG: Fix lỗi int
            // Gửi kèm object Topic cho chắc ăn
            topic: {
                id: currentTopicId,
                name: "Topic Name"
            }
        },

        // 4. Các trường int/boolean khác phòng hờ
        isPaid: false,
        active: true,
        confirmed: false,
        amount: 0, 
        duration: 30, // int duration?

        // 5. Thông tin chính
        status: "PENDING",
        note: `KH: ${formData.name} (${formData.dob}) - Chủ đề: ${formData.topic} - Hỏi: ${formData.question}`,
        createdAt: new Date().toISOString()
    };

    try {
        console.log("Đang gửi payload:", payload);
        const result = await ReadingSessionService.create(payload);
        
        console.log("Kết quả trả về:", result);
        alert(`Gửi thành công! Mã phiên: ${result.id || 'Mới'}`);
        router.push("/"); 
        
    } catch (error: any) {
        console.error("Lỗi API:", error);
        // Lấy thông báo lỗi chi tiết nhất có thể
        const serverMsg = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
        alert(`Thất bại: ${serverMsg}\n(Check F12 > Network để xem chi tiết)`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative selection:bg-amber-500/30 flex items-center justify-center p-4">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        
        {/* Progress Bar */}
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

          {/* === STEP 1: CHỌN CHỦ ĐỀ === */}
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

          {/* === STEP 2: THÔNG TIN KHÁCH HÀNG === */}
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
                       <h2 className="text-3xl font-bold text-white mb-2">Thông tin của bạn</h2>
                       
                       <div className="space-y-6 mt-6">
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

          {/* === STEP 3: SCANNING === */}
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

          {/* === STEP 4: KẾT QUẢ & NÚT GỬI === */}
          {step === 4 && (
             <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto"
             >
                <div className="bg-[#1a0f2e]/90 border border-amber-500/30 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
                   <div className="absolute top-6 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-l-full">99% MATCH</div>
                   
                   <img src={MATCHED_READER.avatar} className="w-32 h-32 mx-auto rounded-full border-4 border-[#130823] object-cover mb-4" alt="Reader" />
                   
                   <h2 className="text-3xl font-bold text-white mb-2">{MATCHED_READER.name}</h2>
                   <p className="text-slate-400 text-sm mb-6 px-4">"{MATCHED_READER.bio}"</p>
                   
                   <div className="pt-4 border-t border-white/5 mb-6">
                      <p className="text-[10px] text-slate-500 uppercase">Reader sẽ giải đáp về:</p>
                      <p className="text-xs text-amber-500 italic mt-1">"{formData.question}"</p>
                   </div>

                   {/* --- ACTION BUTTONS --- */}
                   <div className="flex gap-3 justify-center">
                      <button onClick={() => {setStep(3); setProgress(0)}} className="px-4 py-3 bg-white/5 rounded-xl text-slate-300 text-sm hover:bg-white/10">
                         Đổi người khác
                      </button>
                      
                      {/* NÚT GỬI ĐÃ TÍCH HỢP HÀM FIX LỖI */}
                      <button 
                         onClick={handleCreateBooking}
                         disabled={isSubmitting}
                         className={`flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                      >
                         {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                              Đang gửi...
                            </>
                         ) : (
                            <>Gửi câu hỏi <ArrowRight className="w-4 h-4"/></>
                         )}
                      </button>
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}