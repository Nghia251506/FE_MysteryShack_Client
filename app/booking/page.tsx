"use client";

import React, { useState, useEffect } from "react";
import { useTarotSession } from "@/context/TarotContext";
import { 
  User, Calendar, Search, Sparkles, Zap, 
  ShieldCheck, ArrowRight, Star, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK READER ---
const MATCHED_READER = {
  id: "reader-99",
  name: "Grand Master Giang",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  rating: 5.0,
  reviews: "2.5k+",
  tags: ["Tarot", "Chiêm Tinh", "Reiki"],
  matchScore: 98,
  status: "Vừa online 1 phút trước"
};

export default function ProfessionalMatchingPage() {
  const { session, updateSession } = useTarotSession();
  const [showProfile, setShowProfile] = useState(false);

  // Dữ liệu đánh giá giả lập
  const REVIEWS = [
    { id: 1, user: "Minh Anh", comment: "Reader giải bài rất tận tâm, nói đúng trọng tâm vấn đề mình đang gặp phải.", stars: 5 },
    { id: 2, user: "Hoàng Nam", comment: "Năng lượng rất tích cực, mình cảm thấy nhẹ lòng hơn sau buổi trải bài.", stars: 5 },
    { id: 3, user: "Thùy Chi", comment: "Cách giải thích dễ hiểu, logic và có chiều sâu kiến thức.", stars: 4 },
  ];
  const [step, setStep] = useState<"form" | "scanning" | "matched">("form");
  const [scanStatus, setScanStatus] = useState("Khởi tạo kết nối...");
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: session.userName || "",
    dob: session.birthDate || "",
  });

  const handleStartScan = () => {
    if (!formData.name || !formData.dob) {
      alert("Vui lòng nhập tên và ngày sinh!");
      return;
    }
    updateSession({ userName: formData.name, birthDate: formData.dob });
    setStep("scanning");
  };

  // Logic giả lập quét với câu từ huyền bí hơn
  useEffect(() => {
    if (step === "scanning") {
      const stages = [
        { pct: 10, msg: "Đang giải mã năng lượng từ câu hỏi..." },
        { pct: 35, msg: "Đối chiếu bản đồ sao & ngày sinh..." },
        { pct: 65, msg: "Đang cảm nhận tần số rung động..." },
        { pct: 85, msg: "Đã tìm thấy Reader có duyên với bạn..." },
        { pct: 100, msg: "Kết nối hoàn tất!" }
      ];
      let currentStage = 0;
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("matched"), 800); // Chờ xíu cho mượt
            return 100;
          }
          if (currentStage < stages.length && prev >= stages[currentStage].pct) {
            setScanStatus(stages[currentStage].msg);
            currentStage++;
          }
          return prev + 1;
        });
      }, 50); // Chậm hơn xíu cho hồi hộp
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative">
      {/* Background Stardust */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-purple-900/10 via-transparent to-amber-900/10"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">

            {/* === STEP 1: XÁC NHẬN THÔNG TIN === */}
            {step === "form" && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left: Intro */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                  <h1 className="text-4xl font-bold text-white">Kết Nối Reader</h1>
                  <p className="text-slate-400">Vũ trụ đã nhận được 3 lá bài của bạn. Hãy cung cấp thông tin định danh để tìm người giải bài có tần số năng lượng phù hợp nhất.</p>
                  
                  {session.drawnCards.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-[10px] text-amber-500 font-bold uppercase mb-3 tracking-widest">Năng lượng bài rút:</p>
                      <div className="flex gap-3 overflow-hidden">
                        {session.drawnCards.map((c, i) => (
                          <div key={i} className="w-16 aspect-[2/3] relative rounded overflow-hidden border border-white/20">
                             <img src={c.img} className="w-full h-full object-cover" alt={c.name} />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-3 italic border-t border-white/10 pt-2">
                        "{session.question}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: Form */}
                <div className="lg:col-span-7 bg-[#130823]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px]"></div>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Họ tên khai sinh</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                        <input 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder-slate-700"
                          placeholder="Nhập tên của bạn..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ngày tháng năm sinh</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                        <input 
                          type="date"
                          value={formData.dob}
                          onChange={e => setFormData({...formData, dob: e.target.value})}
                          className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleStartScan}
                      className="w-full py-4 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                    >
                      <Sparkles className="w-5 h-5" /> Tìm Reader Phù Hợp
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* === STEP 2: MYSTICAL SCANNING (HIỆU ỨNG MỚI) === */}
            {step === "scanning" && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                {/* CONTAINER VÒNG TRÒN MA THUẬT */}
                <div className="relative w-80 h-80 flex items-center justify-center mb-12">
                   
                   {/* Lớp 1: Vòng sáng nền mờ ảo */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>

                   {/* Lớp 2: Vòng tròn rune (Quay chậm) */}
                   <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border border-white/5 rounded-full border-dashed"
                   ></motion.div>

                   {/* Lớp 3: Vòng tròn quỹ đạo (Quay ngược chiều) */}
                   <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-8 border border-amber-500/20 rounded-full"
                      style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
                   ></motion.div>

                   {/* Lớp 4: Vòng tròn trung tâm co giãn */}
                   <motion.div 
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-20 border-2 border-purple-500/30 rounded-full flex items-center justify-center"
                   >
                      <div className="w-full h-full bg-purple-500/5 rounded-full blur-md"></div>
                   </motion.div>

                   {/* CORE: Tâm điểm năng lượng */}
                   <div className="relative z-10 w-24 h-24 bg-[#0a0410] rounded-full border border-amber-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                      <Sparkles className="w-10 h-10 text-amber-400 animate-spin-slow" />
                   </div>

                   {/* Các hạt năng lượng bay xung quanh (Particles) */}
                   <div className="absolute top-0 w-2 h-2 bg-amber-400 rounded-full blur-[1px] animate-ping" style={{top: '10%', left: '50%'}}></div>
                   <div className="absolute bottom-0 w-1.5 h-1.5 bg-purple-400 rounded-full blur-[1px] animate-ping" style={{bottom: '20%', right: '20%', animationDelay: '0.5s'}}></div>
                </div>

                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-200 mb-3 text-center">
                  {scanStatus}
                </h2>
                
                <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden mt-4 relative">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Hiệu ứng ánh sáng chạy qua thanh loading */}
                  <motion.div 
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 w-20 bg-white/30 blur-md"
                  />
                </div>
              </motion.div>
            )}

            {/* === STEP 3: MATCHED READER (Success) === */}
            {step === "matched" && (
              <motion.div 
                key="matched"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto bg-[#1a0f2e]/90 backdrop-blur-3xl border border-amber-500/30 rounded-[2.5rem] p-8 text-center shadow-[0_0_100px_rgba(168,85,247,0.15)]"
              >
                 <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-br from-amber-400 via-purple-500 to-amber-400 mb-6 relative animate-border-spin">
                    <img src={MATCHED_READER.avatar} className="w-full h-full rounded-full border-4 border-[#130823] object-cover" alt="Reader" />
                    <div className="absolute bottom-2 right-2 bg-green-500 border-4 border-[#130823] w-7 h-7 rounded-full flex items-center justify-center">
                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                 </div>
                 
                 <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-4xl font-bold text-white mb-2">{MATCHED_READER.name}</h2>
                    <div className="flex items-center justify-center gap-2 mb-6">
                       <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> 5.0
                       </span>
                       <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/30">
                          {MATCHED_READER.matchScore}% Tương thích
                       </span>
                    </div>
                 </motion.div>
                 
                 <div className="bg-slate-900/50 rounded-xl p-6 mb-8 text-left max-w-xl mx-auto border border-slate-700/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-purple-600"></div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wider flex items-center gap-2">
                       <Zap className="w-3 h-3 text-amber-500" /> Reader đã nhận được câu hỏi:
                    </p>
                    <p className="text-white italic text-lg font-serif">"{session.question}"</p>
                 </div>

                 <div className="flex justify-center gap-4">
                    <button onClick={() => setShowProfile(true)} className="px-8 py-4 text-slate-400 hover:text-white font-medium transition-colors">
                       Xem hồ sơ
                    </button>
                    {/* NÚT ĐỔI READER MỚI THÊM VÀO */}
                    <button 
                      onClick={() => {
                        setStep("scanning"); // Quay lại bước quét để tìm người mới
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
            )}

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
    </div>
  );
}