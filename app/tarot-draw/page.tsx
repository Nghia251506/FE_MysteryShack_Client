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
import { TopicService } from "@/services/topicService";
import { QuestionService } from "@/services/questionService";
import { Topic } from "@/types/topic";
import { Question } from "@/types/topicQuestion";
import { shuffleDeck } from "@/services/tarotService";
import { AuthService } from "@/services/authService";

// --- 1. ĐỊNH NGHĨA TYPE ---
interface LocalTarotCard {
  id: number;
  cardNumber?: number;
  nameVi: string;
  imageUrl: string;
  shortMsg: string;
  isReversed?: boolean;
}

// --- BỔ SUNG HÀM GETQUOTE ĐỂ FIX LỖI REFERENCE ERROR ---
const getQuote = (topicName: string) => {
  const quotes: Record<string, string> = {
    "Tình yêu": "Trái tim có lý lẽ riêng của nó.",
    "Sự nghiệp": "Thành công là một hành trình, không phải điểm đến.",
    "Tài chính": "Gieo hạt hôm nay, hái quả mai sau.",
  };
  return quotes[topicName] || "Hãy lắng nghe thông điệp từ vũ trụ.";
};

// --- 2. CẤU HÌNH GIAO DIỆN ---
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

// --- GUEST MODAL COMPONENT ---
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
          <button
            onClick={() => router.push("/login?callbackUrl=/booking")}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <LogIn className="w-4 h-4" /> Đăng Nhập
          </button>

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

  const [isMounted, setIsMounted] = useState(false);
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

  useEffect(() => {
    setIsMounted(true);
    dispatch(resetSession());
  }, [dispatch]);

  useEffect(() => {
    if (!isMounted) return;
    const fetchTopics = async () => {
      try {
        const data = await TopicService.getAllTopics();
        setApiTopics(data);
      } catch (error) { console.error(error); }
    };
    fetchTopics();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !selectedTopicId) return;
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const data = await QuestionService.getQuestionsByTopic(selectedTopicId);
        setApiQuestions(data);
      } catch (error) { console.error(error); } finally { setLoadingQuestions(false); }
    };
    fetchQuestions();
  }, [selectedTopicId, isMounted]);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleConfirmLogout = async () => {
    try {
      // 1. Gọi API để Server xóa session/cookie
      await AuthService.logout();
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
    } finally {
      // 2. Luôn xóa state ở Redux và chuyển hướng dù API có lỗi hay không
      dispatch(logout());
      setShowLogoutModal(false);
      router.push('/login');
      // 3. Xóa các dữ liệu rác khác nếu cần
      localStorage.removeItem('token');
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

  if (!isMounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden relative selection:bg-amber-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

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

            {step === "topic" && (
              <motion.div
                key="topic"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#130823]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl mx-auto w-full relative overflow-hidden"
              >
                <div className="text-center mb-10 relative z-10">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight ">
                    Những điều thầm kín và khúc mắc <br className="hidden md:block" />
                    mà bạn đang <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400 font-extrabold uppercase drop-shadow-sm">QUAN TÂM</span>
                  </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[450px]">
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
                        <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${selectedTopicId === t.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-black/30 text-slate-400 group-hover:text-white'}`}>
                          {getTopicIcon(t.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-bold text-base mb-0.5 flex justify-between items-center ${selectedTopicId === t.id ? 'text-amber-400' : 'text-slate-200'}`}>
                            {t.name}
                          </div>
                          <p className={`text-xs italic truncate ${selectedTopicId === t.id ? 'text-slate-300' : 'text-slate-500'}`}>
                            "{getQuote(t.name)}"
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="lg:col-span-7 bg-black/20 rounded-[2rem] border border-white/5 p-6 relative overflow-hidden flex flex-col min-h-[400px]">
                    {!selectedTopicId ? (
                      <div className="h-full flex items-center justify-center opacity-60">
                        <Sparkles className="w-12 h-12 text-amber-400/80 animate-pulse" />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
                          <Hand className="w-3 h-3 text-amber-500" /> Chọn Câu Hỏi Cụ Thể
                        </h3>
                        <div className="flex-grow overflow-y-auto pr-2">
                          {loadingQuestions ? <div className="text-center py-10">Đang tải...</div> : (
                            <div className="grid grid-cols-1 gap-2.5 pb-20">
                              {apiQuestions.map((q) => (
                                <label key={q.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedQuestionId === q.id ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedQuestionId === q.id ? 'border-amber-500 bg-amber-500' : 'border-slate-600'}`}>
                                    {selectedQuestionId === q.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </div>
                                  <input type="radio" className="hidden" checked={selectedQuestionId === q.id} onChange={() => { setSelectedQuestion(q.questionText); setSelectedQuestionId(q.id); }} />
                                  <span className={`text-sm ${selectedQuestionId === q.id ? 'text-white font-medium' : 'text-slate-300'}`}>{q.questionText}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#150a1f] to-transparent pt-10 flex justify-end">
                          <button onClick={handleStartDraw} disabled={!selectedQuestionId} className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 text-sm">
                            <Sparkles className="w-4 h-4" /> Bắt Đầu Trải Bài
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CÁC STEP CÒN LẠI GIỮ NGUYÊN */}
            {step === "shuffling" && (
              <motion.div key="shuffle" className="flex flex-col items-center justify-center h-[60vh] relative">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div key={i} className="absolute w-20 h-32 md:w-24 md:h-40 rounded-xl" animate={{ rotate: 360, y: [0, -60, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.2 }}>
                      <CardBackDesign />
                    </motion.div>
                  ))}
                </div>
                <div className="mt-16 text-center">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-200 animate-pulse">Hãy tập trung và kết nối năng lượng với những lá bài</h2>
                </div>
              </motion.div>
            )}

            {(step === "picking" || step === "revealing") && (
              <motion.div key="picking" className="flex flex-col items-center min-h-[85vh] justify-center pb-24">
                {/* ... UI Chọn bài của bạn ... */}
                <div className="flex flex-wrap justify-center gap-1.5 max-w-[1400px]">
                  {shuffledDeck.map((card, idx) => (
                    <div key={idx} onClick={() => step === "picking" && handleToggleCard(idx)} className="relative w-12 h-20 md:w-16 md:h-28 cursor-pointer">
                      <motion.div className="w-full h-full" animate={{ rotateY: shouldFlipToFace && selectedIndices.includes(idx) ? 0 : 180 }} transition={{ duration: 0.8 }} style={{ transformStyle: "preserve-3d" }}>
                        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                          <img src={card.imageUrl} className={`w-full h-full object-cover rounded ${card.isReversed ? 'rotate-180' : ''}`} />
                        </div>
                        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                          <CardBackDesign />
                          {selectedIndices.includes(idx) && <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1"><Check className="w-3 h-3 text-black" /></div>}
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
                {step === "picking" && selectedIndices.length === 3 && (
                  <button onClick={handleConfirmSelection} className="fixed bottom-8 px-10 py-4 bg-green-500 text-white font-bold rounded-full animate-bounce">Lật Bài <Eye className="w-5 h-5 ml-2 inline" /></button>
                )}
              </motion.div>
            )}

            {step === "result" && (
              <motion.div key="result" className="space-y-10 max-w-4xl mx-auto pb-10">
                <div className="text-center"><h2 className="text-3xl font-bold">Kết Quả Trải Bài</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {selectedIndices.map(idx => shuffledDeck[idx]).map((card, i) => (
                    <div key={i} className="bg-[#130823]/80 border border-white/10 rounded-3xl p-6 text-center shadow-xl">
                      <img src={card.imageUrl} className={`w-full aspect-[2/3] object-cover rounded-2xl mb-5 ${card.isReversed ? 'rotate-180' : ''}`} />
                      <h3 className="text-xl font-bold">{card.nameVi}</h3>
                      <p className="text-amber-500 text-sm">{card.isReversed ? "Lá bài ngược" : "Lá bài xuôi"}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4">
                  <button onClick={handleRedraw} className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10">Rút lại bài khác</button>
                  <button onClick={handleSubmitCards} className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl">Kết Nối Reader</button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout} // Hàm này giờ đã có logic async
      />
      <GuestPromptModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} />
    </div>
  );
}