"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, ArrowRight, Lock, Eye, Heart, Briefcase, Wallet, 
  ChevronRight, Hand, RotateCcw, LogOut, LogIn, UserPlus, RefreshCw, Check, Star, 
  Moon, Sun, Cloud, Hexagon, Triangle, Circle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setTopicAndQuestion, addCard, resetSession } from "@/store/slices/tarotSlice";
import { logout } from "@/store/features/authSlice"; 
import { LogoutModal } from "@/components/LogoutModal"; 
// --- IMPORT SERVICES ---
import { TopicService } from "@/services/topicService"; 
import { QuestionService } from "@/services/questionService"; 
import { Topic } from "@/types/topic";
import { Question } from "@/types/topicQuestion";
import { shuffleDeck } from "@/services/tarotService";
import { AuthService } from "@/services/authService"; // Import AuthService

// --- 1. ĐỊNH NGHĨA TYPE ---
interface LocalTarotCard {
  id: number;
  cardNumber?: number;
  nameVi: string;
  imageUrl: string;
  shortMsg: string;
  isReversed?: boolean; 
}

// --- 2. CẤU HÌNH GIAO DIỆN ---

const TOPIC_QUOTES: Record<string, string> = {
  "tình yêu": "Yêu và được yêu là may mắn nhất trên đời.",
  "sự nghiệp": "Nơi nào có ý chí, nơi đó có con đường.",
  "tài chính": "Sự kiên nhẫn là chìa khóa của đầu tư thông minh.",
  "love": "Lắng nghe tiếng vọng của nhân duyên tiền định.",
  "career": "Vén màn bí mật phía sau những ngã rẽ.",
  "finance": "Khơi thông dòng chảy năng lượng thịnh vượng.",
};

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

// --- COMPONENT TRANG TRÍ 2 BÊN (SIDE DECOR) ---
const SideDecor = () => {
  return (
    <>
      {/* CỘT TRÁI */}
      <div className="fixed left-6 top-1/4 bottom-1/4 w-12 hidden 2xl:flex flex-col justify-between items-center z-0 pointer-events-none opacity-30">
        <motion.div animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
          <Sun className="w-10 h-10 text-amber-500" />
        </motion.div>
        <motion.div animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}>
          <Moon className="w-8 h-8 text-purple-400" />
        </motion.div>
        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}>
          <Star className="w-5 h-5 text-white" />
        </motion.div>
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 0.5 }}>
          <Cloud className="w-10 h-10 text-slate-500" />
        </motion.div>
      </div>

      {/* CỘT PHẢI */}
      <div className="fixed right-6 top-1/4 bottom-1/4 w-12 hidden 2xl:flex flex-col justify-between items-center z-0 pointer-events-none opacity-30">
        <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
          <Hexagon className="w-10 h-10 text-amber-600" />
        </motion.div>
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 45, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }}>
          <Sparkles className="w-8 h-8 text-purple-500" />
        </motion.div>
        <motion.div animate={{ scale: [1, 0.8, 1], rotate: [0, -180] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 0.5 }}>
          <Triangle className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
          <Circle className="w-3 h-3 text-slate-400 bg-slate-400 rounded-full" />
        </motion.div>
      </div>
    </>
  );
};

// --- GUEST MODAL COMPONENT (ĐÃ SỬA: THÊM CALLBACK URL) ---
const GuestPromptModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();
  if (!isOpen) return null;

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
        className="max-w-md w-full bg-[#1a1025] border border-amber-500/30 rounded-[2rem] p-8 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Lưu Trữ Kết Quả</h3>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Bạn đã chọn xong 3 lá bài. Để gửi chúng cho Reader luận giải chi tiết, bạn cần đăng nhập vào hệ thống.
        </p>
        <div className="space-y-3">
          {/* NÚT ĐĂNG NHẬP CÓ CALLBACK URL */}
          <button 
            onClick={() => router.push("/login?callbackUrl=/booking")} 
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <LogIn className="w-4 h-4" /> Đăng Nhập
          </button>
          
          {/* NÚT ĐĂNG KÝ CÓ CALLBACK URL */}
          <button 
            onClick={() => router.push("/register?callbackUrl=/booking")} 
            className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Đăng Ký Mới
          </button>
        </div>
        <button 
          onClick={onClose} 
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4"
        >
          Quay lại xem bài
        </button>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function TarotDrawPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

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

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  useEffect(() => { dispatch(resetSession()); }, [dispatch]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await TopicService.getAllTopics();
        setApiTopics(data);
      } catch (error) { console.error(error); }
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
        } catch (error) { console.error(error); } finally { setLoadingQuestions(false); }
      }
    };
    fetchQuestions();
  }, [selectedTopicId]);

  const handleLogoutClick = () => setShowLogoutModal(true);
  
  // --- TÍCH HỢP LOGOUT API ---
  const handleConfirmLogout = async () => { 
    try {
        await AuthService.logout();
    } catch (error) {
        console.error("Logout API error:", error);
    } finally {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        dispatch(logout()); 
        router.push('/login');
    }
  };

  const handleStartDraw = async () => {
    if (!selectedTopic || !selectedQuestion) return;
    setStep("shuffling");
    try {
      const dbCards = await shuffleDeck({ topic: selectedTopic });
      const mappedCards: LocalTarotCard[] = dbCards.map((card: any) => ({
        id: card.id,
        nameVi: card.nameVi || card.nameEn, 
        imageUrl: card.imageUrl || getCardImg("ar", 0), 
        shortMsg: card.uprightMeaning?.substring(0, 50) + "...",
        isReversed: Math.random() < 0.5 
      }));
      setTimeout(() => {
        setShuffledDeck(mappedCards);
        setStep("picking");
        setShouldFlipToFace(false);
        setSelectedIndices([]); 
      }, 3000);
    } catch (error) {
      alert("Lỗi kết nối vũ trụ."); setStep("topic"); 
    }
  };

  const handleToggleCard = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(prev => prev.filter(i => i !== index));
    } else {
      if (selectedIndices.length < 3) {
        setSelectedIndices(prev => [...prev, index]);
      }
    }
  };

  const handleConfirmSelection = () => {
    if (selectedIndices.length !== 3) return;
    setStep("revealing");
  };

  useEffect(() => {
    if (step === "picking") setShouldFlipToFace(false);
    if (step === "revealing") {
      setTimeout(() => setShouldFlipToFace(true), 800);
      setTimeout(() => setStep("result"), 2500);
    }
  }, [step]);

  const handleRedraw = () => {
    setSelectedIndices([]);
    setShouldFlipToFace(false);
    handleStartDraw(); 
  };

  const handleSubmitCards = () => {
    const finalCards = selectedIndices.map(idx => shuffledDeck[idx]);
    dispatch(resetSession());
    dispatch(setTopicAndQuestion({
      topic: selectedTopic || "",
      question: selectedQuestion || "",
      questionId: selectedQuestionId || 0,
      topicId: selectedTopicId || 0
    }));
    finalCards.forEach(card => {
      dispatch(addCard({
        id: card.id,
        cardNumber: card.cardNumber,
        nameVi: card.nameVi,
        imageUrl: card.imageUrl || "",
        reversed: card.isReversed || false
      }));
    });
    const sessionData = {
        topic: selectedTopic,
        question: selectedQuestion,
        cards: finalCards.map(c => ({
            id: c.id,
            name: c.nameVi,
            img: c.imageUrl,
            isReversed: c.isReversed || false
        }))
    };
    sessionStorage.setItem("guestTarotSession", JSON.stringify(sessionData));
    
    // Nếu chưa đăng nhập thì hiện Modal (với callbackUrl), nếu rồi thì chuyển trang luôn
    if (!user) { 
        setShowGuestModal(true); 
    } else { 
        router.push("/booking"); 
    }
  };

  const getTopicIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("tình") || n.includes("love")) return <Heart className="w-5 h-5" />;
    if (n.includes("việc") || n.includes("nghiệp")) return <Briefcase className="w-5 h-5" />;
    if (n.includes("tiền") || n.includes("tài") || n.includes("finance")) return <Wallet className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const getQuote = (topicName: string) => {
    const key = Object.keys(TOPIC_QUOTES).find(k => topicName.toLowerCase().includes(k));
    return key ? TOPIC_QUOTES[key] : "Khám phá thông điệp vũ trụ dành riêng cho bạn.";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative selection:bg-amber-500/30">
      
      {/* Background & Side Decor Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        {/* Đốm sáng ngẫu nhiên */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-ping opacity-20"></div>
        <div className="absolute bottom-40 right-20 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse opacity-30"></div>
      </div>

      {/* --- ADD SIDE DECOR --- */}
      <SideDecor />

      {user && (
        <div className="absolute top-4 right-4 z-50">
          <button onClick={handleLogoutClick} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-200 rounded-full transition-colors border border-red-500/30 backdrop-blur-sm shadow-lg font-bold">
            <LogOut className="w-4 h-4" /><span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          <AnimatePresence mode="wait">

            {/* BƯỚC 1: CHỌN CHỦ ĐỀ */}
            {step === "topic" && (
              <motion.div 
                key="topic" 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#130823]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl mx-auto w-full relative overflow-hidden"
              >
                {/* Decor nội bộ */}
                <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                {/* HEADER SECTION - THU NHỎ & CÂN ĐỐI */}
                <div className="text-center mb-10 relative z-10">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
                    Những điều thầm kín và khúc mắc <br className="hidden md:block" />
                    mà bạn đang <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400 font-extrabold uppercase drop-shadow-sm">QUAN TÂM</span>
                  </h1>
                  <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
                    Hãy để các reader chuyên nghiệp của chúng tôi khám phá những điều sâu thẳm bên trong thông qua những thông điệp mà các lá bài tarot nhắn gửi tới bạn.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[450px]">
                  
                  {/* CỘT TRÁI: MENU CHỦ ĐỀ */}
                  <div className="lg:col-span-5 space-y-3 flex flex-col justify-center">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-2 flex items-center gap-2">
                        <Moon className="w-3 h-3 text-amber-500" /> Chọn Lĩnh Vực
                    </h3>
                    
                    {apiTopics.map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => { setSelectedTopicId(t.id); setSelectedTopic(t.name); setSelectedQuestion(""); setSelectedQuestionId(null); }} 
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden ${selectedTopicId === t.id ? 'bg-gradient-to-r from-purple-900/40 to-amber-900/40 border-amber-500/50 shadow-md scale-[1.01]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                      >
                        {selectedTopicId === t.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>}
                        
                        <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${selectedTopicId === t.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-black/30 text-slate-400 group-hover:text-white'}`}>
                          {getTopicIcon(t.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-bold text-base mb-0.5 flex justify-between items-center ${selectedTopicId === t.id ? 'text-amber-400' : 'text-slate-200'}`}>
                              {t.name}
                              {selectedTopicId === t.id && <Check className="w-3.5 h-3.5 text-amber-500" />}
                          </div>
                          {/* Câu Quote hay hay */}
                          <p className={`text-xs italic truncate ${selectedTopicId === t.id ? 'text-slate-300' : 'text-slate-500'}`}>
                              "{getQuote(t.name)}"
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* CỘT PHẢI: DANH SÁCH CÂU HỎI HOẶC HIỆU ỨNG */}
                  <div className="lg:col-span-7 bg-black/20 rounded-[2rem] border border-white/5 p-6 relative overflow-hidden flex flex-col min-h-[400px]">
                    
                    {!selectedTopicId ? (
                      // --- HIỆU ỨNG LÁ BÀI BAY (DECOR) ---
                      <div className="h-full flex items-center justify-center opacity-60">
                        <div className="relative w-40 h-56">
                            {/* Card Background Bloom */}
                            <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
                            
                            {/* Card 1 - Floating */}
                            <motion.div 
                                animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }} 
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-blue-600/90 rounded-xl shadow-2xl border border-white/10"
                            ></motion.div>
                            
                            {/* Card 2 - Main */}
                            <motion.div 
                                animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }} 
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
                                className="absolute inset-0 bg-[#1a0b2e] border border-amber-500/30 rounded-xl flex items-center justify-center translate-x-3 translate-y-3 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                            >
                                <div className="p-4 border border-amber-500/20 rounded-lg">
                                    <Sparkles className="w-12 h-12 text-amber-400/80 animate-pulse" />
                                </div>
                            </motion.div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
                            <Hand className="w-3 h-3 text-amber-500" /> Chọn Câu Hỏi Cụ Thể
                        </h3>
                        
                        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 -mr-2">
                          {loadingQuestions ? (
                            <div className="h-full flex items-center justify-center space-x-2 text-amber-500">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-2.5 pb-20">
                              {apiQuestions.map((q) => (
                                <label 
                                  key={q.id} 
                                  className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 group hover:shadow-lg ${selectedQuestionId === q.id ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
                                >
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedQuestionId === q.id ? 'border-amber-500 bg-amber-500 text-black' : 'border-slate-600 text-transparent group-hover:border-slate-400'}`}>
                                    {selectedQuestionId === q.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </div>
                                  <input type="radio" className="hidden" checked={selectedQuestionId === q.id} onChange={() => { setSelectedQuestion(q.questionText); setSelectedQuestionId(q.id); }} />
                                  <span className={`text-sm font-medium ${selectedQuestionId === q.id ? 'text-white' : 'text-slate-300'}`}>{q.questionText}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* THANH ACTION */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#150a1f] via-[#150a1f]/95 to-transparent pt-10 flex justify-end">
                          <button 
                            onClick={handleStartDraw} 
                            disabled={!selectedQuestionId} 
                            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                          >
                            <Sparkles className="w-4 h-4" /> Bắt Đầu Trải Bài
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* BƯỚC 2: XÀO BÀI (SHUFFLING) */}
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
                {/* Đã đổi câu slogan mới cho bước xào bài */}
                <div className="mt-16 text-center relative z-10">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-200 animate-pulse">
                    Hãy tập trung và kết nối năng lượng với những lá bài
                  </h2>
                </div>
              </motion.div>
            )}

            {/* CÁC BƯỚC CÒN LẠI (PICKING, RESULT) */}
            {(step === "picking" || step === "revealing") && (
              <motion.div key="picking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center min-h-[85vh] justify-center pb-24">
                <div className="text-center mb-6 sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-md w-full py-4 border-b border-white/5">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {step === "picking" ? `Đã chọn ${selectedIndices.length}/3 lá` : "Vũ trụ đang hiển thị kết quả..."}
                  </h2>
                  <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                    {step === "picking" ? <><Hand className="w-4 h-4" /> Bấm để chọn hoặc bỏ chọn</> : "Bao gồm cả Xuôi và Ngược"}
                  </p>
                </div>
                
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
                            y: step === "picking" && isSelected ? -20 : 0, 
                            zIndex: isSelected ? 50 : 0 
                        }} 
                        transition={{ duration: 0.3 }} 
                        onClick={() => step === "picking" && handleToggleCard(idx)} 
                        className={`relative w-12 h-20 md:w-16 md:h-28 rounded cursor-pointer transition-all duration-300 ${step === "picking" ? "hover:-translate-y-2 hover:z-10" : ""}`}
                      >
                        <motion.div className="w-full h-full relative" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: shouldFlipToFace ? 0 : 180 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
                          <div className="absolute inset-0 w-full h-full bg-slate-900 rounded overflow-hidden border border-white/20 shadow-sm flex items-center justify-center" style={{ backfaceVisibility: "hidden" }}>
                            <img src={card.imageUrl} alt="Face" className={`w-full h-full object-cover transition-transform duration-700 ${card.isReversed ? 'rotate-180' : ''}`} />
                            {card.isReversed && step === "revealing" && (<div className="absolute top-0.5 right-0.5 bg-red-600/90 text-white text-[6px] md:text-[8px] px-1 rounded font-bold">REV</div>)}
                          </div>
                          <div className="absolute inset-0 w-full h-full rounded" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                            <CardBackDesign />
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-[10px] shadow-lg border border-white z-20">
                                    <Check className="w-3 h-3 md:w-4 md:h-4" />
                                </div>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {step === "picking" && selectedIndices.length === 3 && (
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-8 z-30">
                      <button 
                          onClick={handleConfirmSelection}
                          className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-transform flex items-center gap-2 animate-bounce"
                      >
                          Lật Bài <Eye className="w-5 h-5" />
                      </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === "result" && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 max-w-4xl mx-auto pb-10">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">Kết Quả Trải Bài</h2>
                  <p className="text-slate-400">3 lá bài định mệnh của bạn</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                  {selectedIndices.map(idx => shuffledDeck[idx]).map((card, idx) => (
                    <motion.div key={idx} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.2 }} className="bg-[#130823]/80 border border-white/10 rounded-3xl p-6 text-center shadow-xl relative overflow-hidden" >
                      <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded border ${card.isReversed ? 'bg-red-900/50 border-red-500 text-red-300' : 'bg-green-900/50 border-green-500 text-green-300'}`}>
                        {card.isReversed ? <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Ngược</span> : "Xuôi"}
                      </div>
                      <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden mb-5 shadow-2xl bg-[#1e1b2e]">
                        <img src={card.imageUrl} alt={card.nameVi} className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{card.nameVi}</h3>
                    </motion.div>
                  ))}
                </div>
                
                <div className="relative mt-8 text-center flex flex-col md:flex-row gap-4 justify-center items-center relative z-20">
                    <button onClick={handleRedraw} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-2xl transition-all flex items-center gap-2 hover:scale-105">
                      <RefreshCw className="w-5 h-5" /> Rút lại bài khác
                    </button>

                    <button onClick={handleSubmitCards} className="group relative px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-3">
                      <Lock className="w-5 h-5" /> Kết Nối Reader
                    </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleConfirmLogout} />
      <GuestPromptModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} />
    </div>
  );
}