"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Eye,
  Heart,
  Briefcase,
  Wallet,
  ChevronRight,
  Hand,
  RotateCcw,
  LogOut,
  LogIn,
  UserPlus,
  RefreshCw,
  Check,
  Star,
  Moon,
  Sun,
  Cloud,
  Hexagon,
  Triangle,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  setTopicAndQuestion,
  addCard,
  resetSession,
} from "@/store/slices/tarotSlice";
import { logout } from "@/store/features/authSlice";
import { LogoutModal } from "@/components/LogoutModal";
// --- IMPORT SERVICES ---
import { TopicService } from "@/services/topicService";
import { QuestionService } from "@/services/questionService";
import { Topic } from "@/types/topic";
import { Question } from "@/types/topicQuestion";
import { shuffleDeck } from "@/services/tarotService";
import { AuthService } from "@/services/authService"; // Import AuthService
import Link from "next/link";

import { TopicStep } from "@/components/tarot-draw/TopicStep";
import { ShufflingStep } from "@/components/tarot-draw/ShufflingStep";
import { PickingStep } from "@/components/tarot-draw/PickingStep";
import { ResultStep } from "@/components/tarot-draw/ResultStep";
import { LoadingStep } from "@/components/tarot-draw/LoadingStep";
// --- 1. ĐỊNH NGHĨA TYPE ---
interface LocalTarotCard {
  id: number;
  cardNumber?: number;
  nameVi: string;
  imageUrl: string;
  shortMsg: string;
  isReversed?: boolean;
}

// Key để lưu trữ session
const TAROT_PERSIST_KEY = "tarot_draw_state_persist";

// --- 2. CẤU HÌNH GIAO DIỆN (GIỮ NGUYÊN GỐC) ---

const TOPIC_QUOTES: Record<string, string> = {
  "tình yêu": "Yêu và được yêu là may mắn nhất trên đời.",
  "sự nghiệp": "Nơi nào có ý chí, nơi đó có con đường.",
  "tài chính": "Sự kiên nhẫn là chìa khóa của đầu tư thông minh.",
  love: "Lắng nghe tiếng vọng của nhân duyên tiền định.",
  career: "Vén màn bí mật phía sau những ngã rẽ.",
  finance: "Khơi thông dòng chảy năng lượng thịnh vượng.",
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
  const padded = number.toString().padStart(2, "0");
  return `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${padded}.jpg`;
};

// --- COMPONENT TRANG TRÍ 2 BÊN (SIDE DECOR - GIỮ NGUYÊN GỐC) ---
const SideDecor = () => {
  return (
    <>
      <div className="fixed left-6 top-1/4 bottom-1/4 w-12 hidden 2xl:flex flex-col justify-between items-center z-0 pointer-events-none opacity-30">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <Sun className="w-10 h-10 text-amber-500" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Moon className="w-8 h-8 text-purple-400" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Star className="w-5 h-5 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Cloud className="w-10 h-10 text-slate-500" />
        </motion.div>
      </div>

      <div className="fixed right-6 top-1/4 bottom-1/4 w-12 hidden 2xl:flex flex-col justify-between items-center z-0 pointer-events-none opacity-30">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <Hexagon className="w-10 h-10 text-amber-600" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 45, 0] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <Sparkles className="w-8 h-8 text-purple-500" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 0.8, 1], rotate: [0, -180] }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Triangle className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Circle className="w-3 h-3 text-slate-400 bg-slate-400 rounded-full" />
        </motion.div>
      </div>
    </>
  );
};

// --- GUEST MODAL COMPONENT ---
const GuestPromptModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
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
          Bạn đã chọn xong 3 lá bài. Để gửi chúng cho Reader luận giải chi tiết,
          bạn cần đăng nhập vào hệ thống.
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

  const [step, setStep] = useState<
    "loading" | "topic" | "shuffling" | "picking" | "revealing" | "result"
  >("loading");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");

  const [shuffledDeck, setShuffledDeck] = useState<LocalTarotCard[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const [shouldFlipToFace, setShouldFlipToFace] = useState(false);
  const [apiTopics, setApiTopics] = useState<Topic[]>([]);
  const [apiQuestions, setApiQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  );

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [recoveredStep, setRecoveredStep] = useState<string | null>(null);

  // --- LOGIC: KHÔI PHỤC DỮ LIỆU KHI MOUNTED ---
  // --- LOGIC: KHÔI PHỤC DỮ LIỆU TỪ NHIỀU NGUỒN (SESSION + LOCAL) ---
  useEffect(() => {
    setMounted(true);

    // 1. Lấy dữ liệu từ 2 nguồn
    const savedPersist = sessionStorage.getItem(TAROT_PERSIST_KEY);
    const savedSession = localStorage.getItem("tarot-session");

    try {
      let finalData: any = {};

      // Ưu tiên lấy dữ liệu từ tarot-session (LocalStorage) vì nó chứa kết quả đã đăng nhập
      if (savedSession) {
        const sessionParsed = JSON.parse(savedSession);
        // Map lại format để tương thích với state hiện tại của page
        const realDrawnCards =
          sessionParsed.drawnCards?.map((c: any) => ({
            id: c.id,
            nameVi: c.nameVi,
            imageUrl: c.imageUrl,
            isReversed: c.reversed,
            shortMsg: "",
          })) || [];

        let fakeFullDeck = Array.from({ length: 78 }).map((_, i) => ({
          id: -1 - i, // ID âm để không trùng
          nameVi: "Lá bài bí ẩn",
          imageUrl: "", // Mặt sau sẽ che hết nên không lo
          shortMsg: "",
        }));

        if (realDrawnCards.length > 0) {
          fakeFullDeck[0] = realDrawnCards[0];
          fakeFullDeck[1] = realDrawnCards[1];
          fakeFullDeck[2] = realDrawnCards[2];
        }
        finalData = {
          selectedTopic: sessionParsed.topic,
          selectedTopicId: sessionParsed.topicId,
          selectedQuestion: sessionParsed.questionText,
          selectedQuestionId: sessionParsed.question,
          shuffledDeck: fakeFullDeck,
          // Logic quyết định STEP:
          // Nếu đã có bài (drawnCards) -> Nhảy tới picking (để người dùng xem/chọn lại nếu muốn)
          // Nếu chỉ có câu hỏi -> Nhảy tới shuffling
          step: sessionParsed.drawnCards?.length > 0 ? "result" : "shuffling",
          selectedIndices: [0, 1, 2], // Mặc định chọn 3 lá thật ở đầu
        };
      }
      // Nếu Local không có thì mới xét tới SessionStorage (Bản nháp của Guest)
      else if (savedPersist) {
        finalData = JSON.parse(savedPersist);
      }

      if (Object.keys(finalData).length > 0) {
        setRecoveredStep(finalData.step);
        setSelectedTopic(finalData.selectedTopic || "");
        setSelectedTopicId(finalData.selectedTopicId || null);
        setSelectedQuestion(finalData.selectedQuestion || "");
        setSelectedQuestionId(finalData.selectedQuestionId || null);
        setShuffledDeck(finalData.shuffledDeck || []);

        // Nếu nhảy thẳng tới picking từ drawnCards, ta mặc định chọn luôn 3 lá đó
        if (
          (finalData.step === "picking" || finalData.step === "result") &&
          finalData.shuffledDeck?.length > 0
        ) {
          setSelectedIndices([0, 1, 2]);
        } else {
          setSelectedIndices(finalData.selectedIndices || []);
        }

        if (finalData.step === "result" || finalData.step === "revealing") {
          setShouldFlipToFace(true);
        }
      }
    } catch (e) {
      console.error("Lỗi khôi phục linh hồn Tarot:", e);
    }
  }, []);

  // --- LOGIC: AUTO-SAVE KHI STATE THAY ĐỔI ---
  useEffect(() => {
    if (!mounted) return;
    const stateToSave = {
      step,
      selectedTopic,
      selectedTopicId,
      selectedQuestion,
      selectedQuestionId,
      shuffledDeck,
      selectedIndices,
    };
    sessionStorage.setItem(TAROT_PERSIST_KEY, JSON.stringify(stateToSave));
  }, [
    step,
    selectedTopic,
    selectedTopicId,
    selectedQuestion,
    selectedQuestionId,
    shuffledDeck,
    selectedIndices,
    mounted,
  ]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await TopicService.getAllTopics();
        setApiTopics(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedTopicId) {
        // Khi dữ liệu khôi phục set cái này, useEffect này phải chạy
        setLoadingQuestions(true);
        try {
          const data =
            await QuestionService.getQuestionsByTopic(selectedTopicId);
          setApiQuestions(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingQuestions(false);
        }
      }
    };
    fetchQuestions();
  }, [selectedTopicId]);

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleConfirmLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem(TAROT_PERSIST_KEY); // Xóa bản nháp khi logout
      dispatch(logout());
      router.push("/login");
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
        isReversed: Math.random() < 0.5,
      }));
      setTimeout(() => {
        setShuffledDeck(mappedCards);
        setStep("picking");
        setShouldFlipToFace(false);
        setSelectedIndices([]);
      }, 3000);
    } catch (error) {
      alert("Lỗi kết nối vũ trụ.");
      setStep("topic");
    }
  };

  const handleToggleCard = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices((prev) => prev.filter((i) => i !== index));
    } else {
      if (selectedIndices.length < 3) {
        setSelectedIndices((prev) => [...prev, index]);
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
    if (!selectedQuestionId) {
      alert("Vui lòng chọn câu hỏi cụ thể trước khi kết nối Reader!");
      return;
    }

    const finalCards = selectedIndices.map((idx) => shuffledDeck[idx]);
    dispatch(resetSession());

    dispatch(
      setTopicAndQuestion({
        topic: selectedTopic || "",
        questionText: selectedQuestion || "",
        question: selectedQuestionId,
        topicId: selectedTopicId || 0,
      }),
    );

    finalCards.forEach((card) => {
      dispatch(
        addCard({
          id: card.id,
          cardNumber: card.cardNumber,
          nameVi: card.nameVi,
          imageUrl: card.imageUrl || "",
          reversed: card.isReversed || false,
        }),
      );
    });

    const sessionData = {
      topicId: selectedTopicId,
      question: selectedQuestionId,
      questionText: selectedQuestion,
      topic: selectedTopic,
      cards: finalCards.map((c) => ({
        id: c.id,
        name: c.nameVi,
        img: c.imageUrl,
        isReversed: c.isReversed || false,
      })),
    };
    sessionStorage.setItem("guestTarotSession", JSON.stringify(sessionData));
    sessionStorage.removeItem(TAROT_PERSIST_KEY);

    if (!user) {
      setShowGuestModal(true);
    } else {
      router.push("/booking");
    }
  };

  const getTopicIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("tình") || n.includes("love"))
      return <Heart className="w-5 h-5" />;
    if (n.includes("việc") || n.includes("nghiệp"))
      return <Briefcase className="w-5 h-5" />;
    if (n.includes("tiền") || n.includes("tài") || n.includes("finance"))
      return <Wallet className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const getQuote = (topicName: string) => {
    const key = Object.keys(TOPIC_QUOTES).find((k) =>
      topicName.toLowerCase().includes(k),
    );
    return key
      ? TOPIC_QUOTES[key]
      : "Khám phá thông điệp vũ trụ dành riêng cho bạn.";
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans relative selection:bg-amber-500/30">
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Quầng sáng mờ */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />

        {/* Texture hạt bụi sao */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

        {/* HIỆU ỨNG SAO BĂNG - BAY TỪ DƯỚI TRÁI LÊN TRÊN PHẢI */}
        <style jsx>{`
          @keyframes shooting-star {
            0% {
              transform: translate(-100px, 100px) rotate(-45deg) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              scale: 1;
            }
            70% {
              opacity: 1;
            }
            100% {
              transform: translate(120vw, -120vh) rotate(-45deg) scale(1.5);
              opacity: 0;
            }
          }
          .star {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, white, transparent);
            border-radius: 999px;
            filter: drop-shadow(0 0 6px white);
            animation: shooting-star 4s linear infinite;
            opacity: 0;
          }
        `}</style>

        {/* Các ngôi sao băng với delay khác nhau để không bay cùng lúc */}
        <div
          className="star"
          style={{ bottom: "10%", left: "-5%", animationDelay: "0s" }}
        />
        <div
          className="star"
          style={{
            bottom: "30%",
            left: "-10%",
            animationDelay: "5s",
            width: "150px",
          }}
        />
        <div
          className="star"
          style={{
            bottom: "-5%",
            left: "20%",
            animationDelay: "12s",
            animationDuration: "6s",
          }}
        />

        {/* Các đốm sáng nhấp nháy cũ */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-ping opacity-20"></div>
        <div className="absolute bottom-40 right-20 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse opacity-30"></div>
      </div>

      <SideDecor />
      {step !== "loading" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 right-4 z-50"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-200 rounded-full transition-colors border border-red-500/30 backdrop-blur-sm shadow-lg font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Quay lại trang chủ</span>
          </Link>
        </motion.div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          <AnimatePresence mode="wait">
            {step === "loading" && (
              <LoadingStep
                onComplete={() => setStep((recoveredStep as any) || "topic")}
              />
            )}

            {step === "topic" && (
              <TopicStep
                apiTopics={apiTopics}
                apiQuestions={apiQuestions}
                selectedTopicId={selectedTopicId}
                selectedQuestionId={selectedQuestionId}
                loadingQuestions={loadingQuestions}
                getTopicIcon={getTopicIcon} // Dùng hàm có sẵn trong page.tsx của ông
                getQuote={getQuote} // Dùng hàm có sẵn trong page.tsx của ông
                onSelectTopic={(t) => {
                  setSelectedTopicId(t.id);
                  setSelectedTopic(t.name);
                  setSelectedQuestion("");
                  setSelectedQuestionId(null);
                }}
                onSelectQuestion={(q) => {
                  setSelectedQuestion(q.questionText);
                  setSelectedQuestionId(q.id);
                }}
                onStart={handleStartDraw}
              />
            )}

            {step === "shuffling" && <ShufflingStep />}

            {(step === "picking" || step === "revealing") && (
              <PickingStep
                shuffledDeck={shuffledDeck}
                selectedIndices={selectedIndices}
                step={step}
                shouldFlipToFace={shouldFlipToFace}
                onToggleCard={handleToggleCard}
                onConfirmSelection={handleConfirmSelection}
              />
            )}

            {step === "result" && (
              <ResultStep
                shuffledDeck={shuffledDeck}
                selectedIndices={selectedIndices}
                onRedraw={handleRedraw} // Giữ nguyên hàm cũ để reset game
                onSubmit={handleSubmitCards} // Giữ nguyên hàm cũ để sang bước Booking
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
      <GuestPromptModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
      />
    </div>
  );
}
