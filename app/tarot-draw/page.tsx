"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, ArrowRight, Lock,
  Eye, Heart, Briefcase, Wallet, ChevronRight, Hand, RotateCcw, LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- REDUX INTEGRATION ---
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setTopicAndQuestion, addCard, resetSession } from "@/store/slices/tarotSlice";
import { logout } from "@/store/features/authSlice"; // Đảm bảo import đúng đường dẫn logout của bạn
import { LogoutModal } from "@/components/LogoutModal"; // Đảm bảo import đúng đường dẫn LogoutModal
// --- IMPORT SERVICES ---
import { TopicService } from "@/services/topicService"; // Cập nhật đường dẫn đúng của bạn
import { QuestionService } from "@/services/questionService"; // Cập nhật đường dẫn đúng của bạn
import { Topic } from "@/types/topic";
import { Question } from "@/types/topicQuestion";

// Thêm vào phần import ở đầu file
import { shuffleDeck } from "@/services/tarotService";
// Lưu ý: Import đúng kiểu dữ liệu TarotCard từ DB của bạn
import { TarotCard } from "@/types/tarot";

// --- 1. CẤU HÌNH GIAO DIỆN & DỮ LIỆU ---

interface LocalTarotCard {
  id: number;
  cardNumber?: number;
  nameVi: string;
  imageUrl: string;
  shortMsg: string;
  reversed?: boolean;
}

const CardBackDesign = () => (
  <div className="w-full h-full bg-[#1a0b2e] relative overflow-hidden rounded-lg shadow-inner flex items-center justify-center border border-slate-900">
    <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    <div className="absolute inset-1 border border-amber-500/40 rounded-sm"></div>
    <div className="absolute inset-2.5 border border-amber-400/20 rounded-sm"></div>
    <div className="w-10 h-10 md:w-16 md:h-16 border border-amber-500/30 rounded-full flex items-center justify-center relative animate-pulse-slow">
      <div className="w-6 h-6 md:w-10 md:h-10 border border-amber-500/50 rounded-full rotate-45 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
      </div>
    </div>
  </div>
);

const getCardImg = (prefix: string, number: number) => {
  const padded = number.toString().padStart(2, '0');
  return `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${padded}.jpg`;
};

const generateFullDeck = (): LocalTarotCard[] => {
  const deck: LocalTarotCard[] = [];
  let idCounter = 1;
  const majors = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
  ];
  majors.forEach((nameVi, i) => {
    deck.push({ id: idCounter++, nameVi, imageUrl: getCardImg("ar", i), shortMsg: "Thông điệp lớn." });
  });
  const suits = [{ code: "wa", name: "Wands" }, { code: "cu", name: "Cups" }, { code: "sw", name: "Swords" }, { code: "pe", name: "Pentacles" }];
  const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
  suits.forEach(suit => {
    ranks.forEach((rank, i) => {
      deck.push({ id: idCounter++, nameVi: `${rank} of ${suit.name}`, imageUrl: getCardImg(suit.code, i + 1), shortMsg: "Chi tiết nhỏ." });
    });
  });
  return deck;
};

const TOPICS = [
  { id: "love", icon: <Heart className="w-5 h-5" />, label: "Tình Yêu", color: "from-pink-500 to-rose-500" },
  { id: "career", icon: <Briefcase className="w-5 h-5" />, label: "Sự Nghiệp", color: "from-blue-500 to-cyan-500" },
  { id: "finance", icon: <Wallet className="w-5 h-5" />, label: "Tài Chính", color: "from-emerald-500 to-green-500" },
];

const QUESTIONS: Record<string, string[]> = {
  love: ["Người ấy nghĩ gì về tôi?", "Tương lai mối quan hệ này?", "Khi nào tôi có người yêu?"],
  career: ["Tôi có nên nhảy việc lúc này?", "Cơ hội thăng tiến sắp tới?", "Tôi hợp với nghề nào?"],
  finance: ["Tình hình tài chính tháng tới?", "Cơ hội đầu tư sinh lời?", "Vận may tiền bạc sắp tới?"],
};

// --- MAIN COMPONENT ---

export default function TarotDrawPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [step, setStep] = useState<"topic" | "shuffling" | "picking" | "revealing" | "result">("topic");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [shuffledDeck, setShuffledDeck] = useState<LocalTarotCard[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [shouldFlipToFace, setShouldFlipToFace] = useState(false);
  const [apiTopics, setApiTopics] = useState<Topic[]>([]);
  const [apiQuestions, setApiQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  // --- LOGOUT MODAL STATE ---
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await TopicService.getAllTopics();
        setApiTopics(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách chủ đề:", error);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedTopicId) {
        setLoadingQuestions(true);
        try {
          const data = await QuestionService.getQuestionsByTopic(selectedTopicId);
          setApiQuestions(data);
        } catch (error) {
          console.error("Lỗi lấy danh sách câu hỏi:", error);
        } finally {
          setLoadingQuestions(false);
        }
      }
    };
    fetchQuestions();
  }, [selectedTopic]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  // LOGIC TRÁO BÀI
  const handleStartDraw = async () => {
    if (!selectedTopic || !selectedQuestion) return;

    setStep("shuffling");

    try {
      // 1. Gọi API shuffle bài từ Backend
      // Truyền vào object đúng định dạng DrawTarotRequest
      const dbCards = await shuffleDeck({ topic: selectedTopic });

      // 2. Chuyển đổi dữ liệu từ Backend sang định dạng LocalTarotCard để hiển thị
      const mappedCards: LocalTarotCard[] = dbCards.map((card: any) => ({
        id: card.id,
        nameVi: card.nameVi || card.nameEn, // Ưu tiên tên tiếng Việt
        imageUrl: card.imageUrl || getCardImg("ar", 0), // Dùng link từ DB
        shortMsg: card.uprightMeaning?.substring(0, 50) + "...",
        isReversed: Math.random() < 0.5 // Random chiều bài tại Client hoặc Backend
      }));

      // 3. Đợi một chút để user thấy hiệu ứng shuffle (khoảng 3-4s)
      setTimeout(() => {
        setShuffledDeck(mappedCards);
        setStep("picking");
        setShouldFlipToFace(false);
      }, 3000);

    } catch (error) {
      console.error("Lỗi khi xáo bài:", error);
      alert("Không thể kết nối với vũ trụ, vui lòng thử lại sau.");
      setStep("topic"); // Quay lại bước chọn nếu lỗi
    }
  };

  const handlePickCard = (index: number) => {
    if (selectedIndices.includes(index) || selectedIndices.length >= 3) return;
    const newIndices = [...selectedIndices, index];
    setSelectedIndices(newIndices);
    if (newIndices.length === 3) {
      setTimeout(() => setStep("revealing"), 500);
    }
  };

  useEffect(() => {
    if (step === "picking") setShouldFlipToFace(false);
    if (step === "revealing") {
      setTimeout(() => setShouldFlipToFace(true), 800);
      setTimeout(() => setStep("result"), 5000);
    }
  }, [step]);

  const handleConnectReader = () => {
    const finalCards = selectedIndices.map(idx => shuffledDeck[idx]);
    dispatch(resetSession());
    dispatch(setTopicAndQuestion({
      topic: selectedTopic || "",
      question: selectedQuestion || "",
      questionId: selectedQuestionId || 0 // Đảm bảo slice của bạn nhận thêm id này nếu cần
      ,
      topicId: 0
    }));
    finalCards.forEach(card => {
      dispatch(addCard({
        id: card.id,
        cardNumber: card.cardNumber,
        nameVi: card.nameVi,
        imageUrl: card.imageUrl || "",
        reversed: card.reversed || false
      }));
    });
    router.push("/booking");
  };

  const getTopicIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("tình") || n.includes("love")) return <Heart className="w-5 h-5" />;
    if (n.includes("việc") || n.includes("nghiệp")) return <Briefcase className="w-5 h-5" />;
    if (n.includes("tiền") || n.includes("tài") || n.includes("finance")) return <Wallet className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative selection:bg-amber-500/30">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Logout Button - Updated to trigger modal */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-200 rounded-full transition-colors border border-red-500/30 backdrop-blur-sm shadow-lg font-bold"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Đăng xuất</span>
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          <AnimatePresence mode="wait">

            {/* STEP 1: CHỌN CHỦ ĐỀ */}
            {step === "topic" && (
              <motion.div key="topic" className="bg-[#130823]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">Hỏi Vũ Trụ Về <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">Tương Lai</span></h1>
                </div>

                {/* HIỂN THỊ TOPICS TỪ API */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {apiTopics.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTopicId(t.id);
                        setSelectedTopic(t.name);
                        setSelectedQuestion("");
                        setSelectedQuestionId(null);
                      }}
                      className={`relative group p-4 rounded-xl border text-left transition-all ${selectedTopicId === t.id ? 'bg-white/10 border-amber-500/50' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                    >
                      <div className={`mb-2 ${selectedTopicId === t.id ? 'text-amber-400' : 'text-slate-400'}`}>{getTopicIcon(t.name)}</div>
                      <div className="font-bold text-white">{t.name}</div>
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {selectedTopicId && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-4 overflow-hidden">
                      {loadingQuestions ? (
                        <div className="text-center py-4 text-slate-500 animate-pulse">Đang tải câu hỏi...</div>
                      ) : (
                        <div className="space-y-2">
                          {apiQuestions.map((q) => (
                            <label key={q.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedQuestionId === q.id ? 'bg-purple-500/20 border-purple-500' : 'bg-black/20 border-white/5 hover:border-white/20'}`}>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selectedQuestionId === q.id ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-600'}`}>
                                {selectedQuestionId === q.id && <ArrowRight className="w-3 h-3" />}
                              </div>
                              <input
                                type="radio"
                                className="hidden"
                                checked={selectedQuestionId === q.id}
                                onChange={() => {
                                  setSelectedQuestion(q.questionText);
                                  setSelectedQuestionId(q.id);
                                }}
                              />
                              <span className={selectedQuestionId === q.id ? 'text-white font-medium' : 'text-slate-400'}>{q.questionText}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={handleStartDraw}
                        disabled={!selectedQuestionId}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-lg rounded-xl mt-4 hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-5 h-5" /> Trải Bài Ngay
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* STEP 2: XÀO BÀI */}
            {step === "shuffling" && (
              <motion.div key="shuffle" className="flex flex-col items-center justify-center h-[60vh] relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-[80px] animate-pulse"></div>
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div key={i} className="absolute w-20 h-32 md:w-24 md:h-40 rounded-xl shadow-2xl origin-bottom-center" initial={{ scale: 0, opacity: 0 }} animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8], y: [0, -60, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: i * 0.2 }}>
                      <CardBackDesign />
                    </motion.div>
                  ))}
                  <div className="absolute w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_50px_rgba(251,191,36,1)] animate-ping z-10"></div>
                </div>
                <div className="mt-16 text-center relative z-10">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-200 animate-pulse">Hòa Nhịp Năng Lượng...</h2>
                </div>
              </motion.div>
            )}

            {/* STEP 3 & 4: CHỌN & LẬT BÀI */}
            {(step === "picking" || step === "revealing") && (
              <motion.div key="picking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center min-h-[85vh] justify-center pb-10">
                <div className="text-center mb-6 sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-md w-full py-4 border-b border-white/5">
                  <h2 className="text-2xl font-bold text-white mb-1">{step === "picking" ? `Chọn ${3 - selectedIndices.length} lá từ bộ 78 lá` : "Vũ trụ đang hiển thị kết quả..."}</h2>
                  <p className="text-slate-400 text-sm flex items-center justify-center gap-2">{step === "picking" ? <><Hand className="w-4 h-4" /> Lướt và chọn theo trực giác</> : "Bao gồm cả Xuôi và Ngược"}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 max-w-[1400px] px-2" style={{ perspective: "1000px" }}>
                  {shuffledDeck.map((card, idx) => {
                    const isSelected = selectedIndices.includes(idx);
                    const isHidden = step === "revealing" && !isSelected;
                    return (
                      <motion.div key={idx} layout initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: isHidden ? 0.3 : 1, zIndex: isSelected ? 50 : 0 }} transition={{ delay: idx * 0.005, duration: 0.3 }} onClick={() => step === "picking" && handlePickCard(idx)} className={`relative w-12 h-20 md:w-16 md:h-28 rounded cursor-pointer transition-all duration-300 ${step === "picking" && !isSelected ? "hover:-translate-y-2 hover:z-10" : ""}`}>
                        <motion.div className="w-full h-full relative" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: shouldFlipToFace ? 0 : 180 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
                          <div className="absolute inset-0 w-full h-full bg-slate-900 rounded overflow-hidden border border-white/20 shadow-sm flex items-center justify-center" style={{ backfaceVisibility: "hidden" }}>
                            <img src={card.imageUrl} alt="Face" className={`w-full h-full object-cover transition-transform duration-700 ${card.reversed ? 'rotate-180' : ''}`} />
                            {card.reversed && step === "revealing" && (<div className="absolute top-0.5 right-0.5 bg-red-600/90 text-white text-[6px] md:text-[8px] px-1 rounded font-bold">REV</div>)}
                          </div>
                          <div className="absolute inset-0 w-full h-full rounded" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                            <CardBackDesign />
                            {isSelected && (<div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-[10px] shadow-lg border border-white z-20">{selectedIndices.indexOf(idx) + 1}</div>)}
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 5: KẾT QUẢ */}
            {step === "result" && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 max-w-4xl mx-auto pb-10">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">Kết Quả Trải Bài</h2>
                  <p className="text-slate-400">3 lá bài định mệnh từ bộ 78 lá</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                  {selectedIndices.map(idx => shuffledDeck[idx]).map((card, idx) => (
                    <motion.div key={idx} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.2 }} className="bg-[#130823]/80 border border-white/10 rounded-3xl p-6 text-center shadow-xl relative overflow-hidden" >
                      <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded border ${card.reversed ? 'bg-red-900/50 border-red-500 text-red-300' : 'bg-green-900/50 border-green-500 text-green-300'}`}>
                        {card.reversed ? <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Ngược</span> : "Xuôi"}
                      </div>
                      <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden mb-5 shadow-2xl bg-[#1e1b2e]">
                        <img src={card.imageUrl} alt={card.nameVi} className={`w-full h-full object-cover ${card.reversed ? 'rotate-180' : ''}`} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{card.nameVi}</h3>
                    </motion.div>
                  ))}
                </div>
                <div className="relative mt-8 text-center">
                  <div className="relative z-10 pt-10">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-500/50 mb-4 shadow-[0_0_40px_rgba(245,158,11,0.3)] animate-bounce mx-auto">
                      <Lock className="w-8 h-8 text-amber-500 fill-amber-500/20" />
                    </div>
                    <button onClick={handleConnectReader} className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
                      Tìm Reader Để Giải Nghĩa <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-sm text-slate-500 mt-4">Thông tin 3 lá bài (kèm chiều Xuôi/Ngược) sẽ được gửi tới Reader.</p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* --- ADDED LOGOUT MODAL --- */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}