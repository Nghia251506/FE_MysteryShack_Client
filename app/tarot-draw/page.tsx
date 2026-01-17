"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTarotSession, TarotCard } from "@/context/TarotContext";
import { 
  Sparkles, ArrowRight, RefreshCw, Lock, 
  Eye, Heart, Briefcase, Wallet, ChevronRight, Hand, RotateCcw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. CẤU HÌNH GIAO DIỆN & DỮ LIỆU ---

// COMPONENT: LƯNG BÀI CAO CẤP (CSS-ONLY)
// Thiết kế họa tiết Hoàng gia, không phụ thuộc ảnh ngoài, load siêu nhanh
const CardBackDesign = () => (
  <div className="w-full h-full bg-[#1a0b2e] relative overflow-hidden rounded-lg shadow-inner flex items-center justify-center border border-slate-900">
    {/* Texture nền bụi sao */}
    <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    
    {/* Viền vàng đôi sang trọng */}
    <div className="absolute inset-1 border border-amber-500/40 rounded-sm"></div>
    <div className="absolute inset-2.5 border border-amber-400/20 rounded-sm"></div>
    
    {/* Họa tiết trung tâm: Mắt thần & Mặt trời */}
    <div className="w-10 h-10 md:w-16 md:h-16 border border-amber-500/30 rounded-full flex items-center justify-center relative animate-pulse-slow">
       <div className="w-6 h-6 md:w-10 md:h-10 border border-amber-500/50 rounded-full rotate-45 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
       </div>
    </div>

    {/* Góc trang trí */}
    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber-500/60"></div>
    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber-500/60"></div>
    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-amber-500/60"></div>
    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber-500/60"></div>
  </div>
);

// HÀM SINH BỘ BÀI 78 LÁ (NGUỒN SACRED-TEXTS)
const getCardImg = (prefix: string, number: number) => {
  const padded = number.toString().padStart(2, '0');
  return `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${padded}.jpg`;
};

const generateFullDeck = () => {
  const deck: TarotCard[] = [];
  let idCounter = 0;

  // 1. Major Arcana (22 lá)
  const majors = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", 
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", 
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", 
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun", 
    "Judgement", "The World"
  ];
  majors.forEach((name, i) => {
    deck.push({ id: idCounter++, name, img: getCardImg("ar", i), keywords: ["Ẩn chính"], shortMsg: "Thông điệp lớn từ vũ trụ." });
  });

  // 2. Minor Arcana (56 lá)
  const suits = [
    { code: "wa", name: "Wands" }, { code: "cu", name: "Cups" },
    { code: "sw", name: "Swords" }, { code: "pe", name: "Pentacles" }
  ];
  const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

  suits.forEach(suit => {
    ranks.forEach((rank, i) => {
      deck.push({ 
        id: idCounter++, 
        name: `${rank} of ${suit.name}`, 
        img: getCardImg(suit.code, i + 1), 
        keywords: [suit.name], 
        shortMsg: "Chi tiết nhỏ ảnh hưởng đến kết quả." 
      });
    });
  });

  return deck;
};

// DỮ LIỆU CHỦ ĐỀ
const TOPICS = [
  { id: "love", icon: <Heart className="w-5 h-5" />, label: "Tình Yêu", color: "from-pink-500 to-rose-500" },
  { id: "career", icon: <Briefcase className="w-5 h-5" />, label: "Sự Nghiệp", color: "from-blue-500 to-cyan-500" },
  { id: "finance", icon: <Wallet className="w-5 h-5" />, label: "Tài Chính", color: "from-emerald-500 to-green-500" },
];

const QUESTIONS: Record<string, string[]> = {
  love: ["Người ấy nghĩ gì về tôi?", "Tương lai mối quan hệ này?", "Bao giờ tôi có người yêu?"],
  career: ["Tôi có nên nhảy việc?", "Cơ hội thăng tiến sắp tới?", "Định hướng nghề nghiệp phù hợp?"],
  finance: ["Tình hình tài chính tháng tới?", "Cơ hội đầu tư sinh lời?", "Vận may tiền bạc?"],
};

// --- MAIN COMPONENT ---

export default function TarotTeaserPage() {
  const router = useRouter();
  const { updateSession } = useTarotSession();

  const [step, setStep] = useState<"topic" | "shuffling" | "picking" | "revealing" | "result">("topic");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [shouldFlipToFace, setShouldFlipToFace] = useState(false);

  // LOGIC TRÁO BÀI
  const handleStartDraw = () => {
    if (!selectedTopic || !selectedQuestion) return;
    setStep("shuffling");
    
    // Giả lập thời gian xào bài
    setTimeout(() => {
      const fullDeck = generateFullDeck();
      // Xào bài + Random chiều (50% Ngược)
      const shuffled = fullDeck
        .sort(() => 0.5 - Math.random())
        .map(card => ({
          ...card,
          isReversed: Math.random() < 0.5 
        }));
      
      setShuffledDeck(shuffled);
      setStep("picking");
      setShouldFlipToFace(false); // Vào chọn là phải ÚP bài
    }, 4000); // 4 giây cho hiệu ứng xoáy
  };

  // LOGIC CHỌN BÀI
  const handlePickCard = (index: number) => {
    if (selectedIndices.includes(index) || selectedIndices.length >= 3) return;
    setSelectedIndices([...selectedIndices, index]);

    // Nếu chọn đủ 3 lá -> Chuyển sang lật bài
    if (selectedIndices.length + 1 === 3) {
      setTimeout(() => setStep("revealing"), 500);
    }
  };

  // LOGIC LẬT BÀI
  useEffect(() => {
    if (step === "picking") setShouldFlipToFace(false);
    if (step === "revealing") {
      setTimeout(() => setShouldFlipToFace(true), 800); // Lật ngửa
      setTimeout(() => setStep("result"), 5000); // Chờ xem bài rồi sang kết quả
    }
  }, [step]);

  const handleConnectReader = () => {
    const finalCards = selectedIndices.map(idx => shuffledDeck[idx]);
    updateSession({
      topic: selectedTopic,
      question: selectedQuestion,
      drawnCards: finalCards,
    });
    router.push("/booking"); 
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative selection:bg-amber-500/30">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          <AnimatePresence mode="wait">

            {/* === STEP 1: CHỌN CHỦ ĐỀ === */}
            {step === "topic" && (
              <motion.div 
                key="topic"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                className="bg-[#130823]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl max-w-4xl mx-auto"
              >
                 <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold tracking-wider uppercase mb-4">
                      <Sparkles className="w-3 h-3" /> Trải bài 78 lá chuẩn quốc tế
                   </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Hỏi Vũ Trụ Về <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">Tương Lai</span></h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {TOPICS.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => { setSelectedTopic(t.id); setSelectedQuestion(""); }}
                      className={`relative group p-4 rounded-xl border text-left transition-all overflow-hidden ${selectedTopic === t.id ? 'bg-white/10 border-amber-500/50' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                    >
                       <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                       <div className={`mb-2 ${selectedTopic === t.id ? 'text-amber-400' : 'text-slate-400'}`}>{t.icon}</div>
                       <div className="font-bold text-white">{t.label}</div>
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {selectedTopic && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-4 overflow-hidden">
                      <div className="space-y-2">
                        {QUESTIONS[selectedTopic].map((q, idx) => (
                          <label key={idx} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedQuestion === q ? 'bg-purple-500/20 border-purple-500' : 'bg-black/20 border-white/5 hover:border-white/20'}`}>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selectedQuestion === q ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-600'}`}>
                              {selectedQuestion === q && <ArrowRight className="w-3 h-3" />}
                            </div>
                            <input type="radio" className="hidden" checked={selectedQuestion === q} onChange={() => setSelectedQuestion(q)} />
                            <span className={selectedQuestion === q ? 'text-white font-medium' : 'text-slate-400'}>{q}</span>
                          </label>
                        ))}
                      </div>
                      <button onClick={handleStartDraw} disabled={!selectedQuestion} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-lg rounded-xl mt-4 hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                         <Sparkles className="w-5 h-5" /> Trải Bài Ngay
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* === STEP 2: XÀO BÀI (VORTEX EFFECT - VÒNG XOÁY) === */}
            {step === "shuffling" && (
              <motion.div 
                key="shuffle" 
                className="flex flex-col items-center justify-center h-[60vh] relative"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                 {/* Nền năng lượng xoáy */}
                 <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-[80px] animate-pulse"></div>

                 <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Các lá bài bay theo vòng xoáy */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <motion.div 
                            key={i}
                            className="absolute w-20 h-32 md:w-24 md:h-40 rounded-xl shadow-2xl origin-bottom-center"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                                rotate: [0, 360], 
                                scale: [0.8, 1.2, 0.8],
                                y: [0, -60, 0],
                                opacity: [0.3, 1, 0.3]
                            }} 
                            transition={{ 
                                repeat: Infinity, 
                                duration: 2.5, 
                                ease: "linear", 
                                delay: i * 0.2
                            }}
                        >
                            <CardBackDesign />
                        </motion.div>
                    ))}
                    
                    {/* Tâm điểm ánh sáng */}
                    <div className="absolute w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_50px_rgba(251,191,36,1)] animate-ping z-10"></div>
                 </div>

                 <div className="mt-16 text-center relative z-10">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-200 animate-pulse">
                        Hòa Nhịp Năng Lượng...
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm font-light tracking-widest uppercase">
                        Vũ trụ đang sắp xếp định mệnh
                    </p>
                 </div>
              </motion.div>
            )}

            {/* === STEP 3 & 4: CHỌN BÀI 78 LÁ (GRID & 3D FLIP) === */}
            {(step === "picking" || step === "revealing") && (
              <motion.div 
                key="picking" 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center min-h-[85vh] justify-center pb-10"
              >
                 <div className="text-center mb-6 sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-md w-full py-4 border-b border-white/5">
                    <h2 className="text-2xl font-bold text-white mb-1">
                        {step === "picking" 
                            ? `Chọn ${3 - selectedIndices.length} lá từ bộ 78 lá` 
                            : "Vũ trụ đang hiển thị kết quả..."}
                    </h2>
                    <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                        {step === "picking" ? <><Hand className="w-4 h-4"/> Lướt và chọn theo trực giác</> : "Bao gồm cả Xuôi và Ngược"}
                    </p>
                 </div>

                 {/* SÀN BÀI 78 LÁ */}
                 <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 max-w-[1400px] px-2" style={{ perspective: "1000px" }}>
                    {shuffledDeck.map((card, idx) => {
                       const isSelected = selectedIndices.includes(idx);
                       const isHidden = step === "revealing" && !isSelected;
                       
                       return (
                          <motion.div
                             key={idx}
                             layout
                             initial={{ scale: 0, opacity: 0 }}
                             animate={{ 
                                scale: 1, 
                                opacity: isHidden ? 0.3 : 1, 
                                zIndex: isSelected ? 50 : 0, 
                             }}
                             transition={{ delay: idx * 0.005, duration: 0.3 }}
                             onClick={() => step === "picking" && handlePickCard(idx)}
                             className={`
                                relative w-12 h-20 md:w-16 md:h-28 rounded cursor-pointer transition-all duration-300
                                ${step === "picking" && !isSelected ? "hover:-translate-y-2 hover:z-10" : ""}
                             `}
                          >
                             {/* 3D FLIP CONTAINER */}
                             <motion.div
                                className="w-full h-full relative"
                                style={{ transformStyle: "preserve-3d" }}
                                animate={{ 
                                    rotateY: shouldFlipToFace ? 0 : 180, // Lật: Face (0) | Úp: Back (180)
                                }} 
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                             >
                                {/* --- MẶT TRƯỚC (FACE) --- */}
                                <div 
                                    className="absolute inset-0 w-full h-full bg-slate-900 rounded overflow-hidden border border-white/20 shadow-sm flex items-center justify-center"
                                    style={{ backfaceVisibility: "hidden" }} 
                                >
                                    <img 
                                        src={card.img} 
                                        alt="Face" 
                                        className={`w-full h-full object-cover transition-transform duration-700 ${card.isReversed ? 'rotate-180' : ''}`} 
                                    />
                                    {card.isReversed && step === "revealing" && (
                                        <div className="absolute top-0.5 right-0.5 bg-red-600/90 text-white text-[6px] md:text-[8px] px-1 rounded font-bold">REV</div>
                                    )}
                                </div>

                                {/* --- MẶT SAU (BACK) --- */}
                                <div 
                                    className="absolute inset-0 w-full h-full rounded"
                                    style={{ 
                                        backfaceVisibility: "hidden", 
                                        transform: "rotateY(180deg)", // Mặc định lưng quay về phía user khi container xoay 180
                                    }}
                                >
                                    <CardBackDesign />
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-[10px] shadow-lg border border-white z-20">
                                            {selectedIndices.indexOf(idx) + 1}
                                        </div>
                                    )}
                                </div>
                             </motion.div>
                          </motion.div>
                       );
                    })}
                 </div>
              </motion.div>
            )}

            {/* === STEP 5: KẾT QUẢ === */}
            {step === "result" && (
              <motion.div 
                 key="result"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="space-y-10 max-w-4xl mx-auto pb-10"
              >
                 <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Kết Quả Trải Bài</h2>
                    <p className="text-slate-400">3 lá bài định mệnh từ bộ 78 lá</p>
                 </div>

                 {/* GRID KẾT QUẢ */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                    {selectedIndices.map(idx => shuffledDeck[idx]).map((card, idx) => (
                       <motion.div 
                          key={idx}
                          initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: idx * 0.2}}
                          className="bg-[#130823]/80 border border-white/10 rounded-3xl p-6 text-center shadow-xl relative overflow-hidden"
                       >
                          <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded border ${card.isReversed ? 'bg-red-900/50 border-red-500 text-red-300' : 'bg-green-900/50 border-green-500 text-green-300'}`}>
                             {card.isReversed ? <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3"/> Ngược</span> : "Xuôi"}
                          </div>

                          <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden mb-5 shadow-2xl bg-[#1e1b2e]">
                             <img src={card.img} alt={card.name} className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`} />
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-1">{card.name}</h3>
                          <div className="flex flex-wrap justify-center gap-2 mb-4 mt-2">
                             {card.keywords?.map(k => <span key={k} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-white/5 rounded-lg text-amber-300 border border-amber-500/20">{k}</span>)}
                          </div>
                       </motion.div>
                    ))}
                 </div>

                 {/* LOCKED CONTENT */}
                 <div className="relative mt-8 text-center">
                    <div className="bg-[#1a1025]/50 border border-white/10 rounded-[2.5rem] p-8 filter blur-sm select-none opacity-50 relative z-0 mb-[-100px]">
                       <h3 className="text-3xl font-bold text-purple-400 mb-4">Phân Tích Chi Tiết</h3>
                       <div className="space-y-3">
                          <div className="h-4 bg-slate-500/30 rounded w-full"></div>
                          <div className="h-4 bg-slate-500/30 rounded w-3/4"></div>
                       </div>
                    </div>

                    <div className="relative z-10 pt-10">
                         <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-500/50 mb-4 shadow-[0_0_40px_rgba(245,158,11,0.3)] animate-bounce mx-auto">
                            <Lock className="w-8 h-8 text-amber-500 fill-amber-500/20" />
                         </div>
                         <button onClick={handleConnectReader} className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
                            Tìm Reader Để Giải Nghĩa <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                         </button>
                         <p className="text-sm text-slate-500 mt-4">Thông tin 3 lá bài (bao gồm chiều Xuôi/Ngược) sẽ được gửi tới Reader.</p>
                    </div>
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}