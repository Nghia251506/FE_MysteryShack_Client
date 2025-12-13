"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import {
  fetchShuffledDeck,
  submitForInterpretation,
  resetTarotSession,
} from "@/store/slices/tarotSlice";
import {
  Loader2,
  Sparkles,
  Calendar,
  ChevronLeft,
  Eye,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function TarotPage() {
  const dispatch = useAppDispatch();
  const { deck, selectedCards, aiInterpretation, loading, error } =
    useAppSelector((state) => state.tarot);

  const [step, setStep] = useState<
    "input" | "shuffling" | "selecting" | "loading" | "result"
  >("input");
  const [topic, setTopic] = useState("");
  const [birthday, setBirthday] = useState("");
  const [chosenCards, setChosenCards] = useState<
    { card: (typeof deck)[0]; isReversed: boolean }[]
  >([]);

  // Bắt đầu xáo bài
  const handleStartShuffle = () => {
    if (!topic.trim()) {
      alert("Vui lòng nhập chủ đề hỏi");
      return;
    }
    dispatch(
      fetchShuffledDeck({
        topic: topic.trim(),
        birthday: birthday || undefined,
      })
    );
    setStep("shuffling");
  };

  // Sau khi xáo xong → chuyển sang chọn lá
  useEffect(() => {
    if (step === "shuffling" && deck.length > 0 && !loading) {
      const timer = setTimeout(() => {
        setStep("selecting");
      }, 3500); // Animation xáo 3.5 giây

      return () => clearTimeout(timer);
    }
  }, [step, deck.length, loading]);

  // Khách chọn lá
  const handleCardClick = (card: (typeof deck)[0]) => {
    if (chosenCards.length >= 3) return;

    const isReversed = Math.random() < 0.5;
    setChosenCards([...chosenCards, { card, isReversed }]);
  };

  // Khi đủ 3 lá → gọi AI
  useEffect(() => {
    if (chosenCards.length === 3) {
      setStep("loading");

      const request = {
        topic,
        birthday: birthday || undefined,
        selectedCards: chosenCards.map(({ card, isReversed }) => ({
          cardId: card.id,
          isReversed,
        })),
      };

      dispatch(submitForInterpretation(request));
    }
  }, [chosenCards.length]);

  // Khi AI trả về → chuyển sang result
  useEffect(() => {
    if (selectedCards.length === 3 && aiInterpretation) {
      setStep("result");
    }
  }, [selectedCards.length, aiInterpretation]);

  const handleReset = () => {
    dispatch(resetTarotSession());
    setStep("input");
    setTopic("");
    setBirthday("");
    setChosenCards([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300"
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Quay lại trang chủ</span>
          </Link>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">
            Trải Bài Tarot
          </h1>
          <div className="w-32" />
        </div>

        {/* Bước 1: Input chủ đề + birthday */}
        {step === "input" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center space-y-8"
          >
            <Sparkles className="w-20 h-20 text-amber-500 mx-auto animate-pulse" />
            <h2 className="text-4xl font-bold text-amber-100">
              Bạn muốn hỏi về điều gì hôm nay?
            </h2>

            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ví dụ: Tình yêu của tôi sẽ ra sao trong năm nay?"
              className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />

            <div className="max-w-md mx-auto space-y-4">
              <label className="flex items-center justify-center gap-3 text-slate-300">
                <Calendar className="w-6 h-6 text-amber-500" />
                Ngày sinh (tùy chọn - để giải nghĩa chính xác hơn)
              </label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleStartShuffle}
              disabled={!topic.trim()}
              className="px-12 py-6 bg-gradient-to-r from-amber-600 to-purple-600 text-white text-2xl font-bold rounded-2xl hover:from-amber-500 hover:to-purple-500 disabled:opacity-50 shadow-2xl"
            >
              Bắt Đầu Xáo Bài
            </button>
          </motion.div>
        )}

        {/* Bước 2: Animation xáo bài */}
        {step === "shuffling" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 space-y-8"
          >
            <Sparkles className="w-24 h-24 text-amber-500 mx-auto animate-spin" />
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">
              Đang xáo bài cho câu hỏi của bạn...
            </h2>
            <p className="text-2xl text-slate-300">
              Hãy tập trung vào điều bạn muốn hỏi
            </p>

            {/* Animation xáo bài mượt – chỉ 6 lá, fixed position, không random trong animate */}
            <div className="relative h-96 w-full max-w-4xl mx-auto">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, rotate: 0 }}
                  animate={{
                    x: [0, i % 2 === 0 ? 300 : -300, 0],
                    y: [0, -200, 0],
                    rotate: [0, i % 2 === 0 ? 360 : -360, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  className="absolute top-1/2 left-1/2 w-32 h-48 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-full h-full bg-gradient-to-br from-purple-800 to-amber-900 rounded-xl shadow-2xl border-4 border-amber-900/50">
                    <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-amber-400 animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bước 3: Chọn 3 lá – lá nhỏ, chia 3 hàng, chồng chéo nhẹ, mượt */}
        {step === "selecting" && (
          <div className="space-y-12 py-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-amber-100 mb-4">
                Chọn 3 lá bài cảm thấy thu hút bạn nhất
              </h2>
              <p className="text-2xl text-slate-300">
                Đã chọn: {chosenCards.length}/3 lá
              </p>
            </div>

            {/* 3 lá đã chọn – bay lên giữa */}
            <div className="flex justify-center gap-8 md:gap-12 relative z-50 mb-16">
              <AnimatePresence>
                {chosenCards.map((chosen, index) => (
                  <motion.div
                    key={chosen.card.id}
                    layoutId={`card-${chosen.card.id}`}
                    initial={{ scale: 0.8, y: 300, opacity: 0 }}
                    animate={{ scale: 1.1, y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="relative"
                  >
                    <motion.div
                      initial={{ rotateY: 180 }}
                      animate={{ rotateY: chosen.isReversed ? 180 : 0 }}
                      transition={{ duration: 1 }}
                      className="relative w-40 h-60 md:w-48 h-72"
                    >
                      <img
                        src={chosen.card.imageUrl || "/placeholder-tarot.jpg"}
                        alt={chosen.card.nameEn}
                        className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-amber-900/60"
                      />
                      {chosen.isReversed && (
                        <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center">
                          <p className="text-3xl md:text-4xl font-bold text-red-500 rotate-180">
                            NGƯỢC
                          </p>
                        </div>
                      )}
                    </motion.div>
                    <p className="text-center mt-4 text-lg md:text-xl text-amber-100 font-medium">
                      {chosen.card.nameVi || chosen.card.nameEn}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bộ bài – 3 hàng, lá nhỏ, chồng chéo nhẹ */}
            <div className="max-w-6xl mx-auto px-4">
              {/* Hàng 1 */}
              <div className="flex justify-center -space-x-6 mb-[-60px]">
                {deck.slice(0, Math.ceil(deck.length / 3)).map((card, i) => {
                  const isChosen = chosenCards.some(
                    (c) => c.card.id === card.id
                  );
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: isChosen ? 0 : 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative cursor-pointer hover:z-50 hover:scale-110 transition-all duration-300"
                      onClick={() => !isChosen && handleCardClick(card)}
                    >
                      <div className="w-24 h-36 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-xl border-3 border-amber-900/40">
                        <div className="absolute inset-0 bg-black/10 rounded-lg" />
                        <div className="absolute inset-2 flex flex-col items-center justify-center space-y-1">
                          <div className="w-10 h-10 bg-amber-900/20 rounded-full flex items-center justify-center">
                            <Eye className="w-6 h-6 text-amber-700" />
                          </div>
                          <div className="flex gap-1">
                            <Moon className="w-3 h-3 text-amber-700" />
                            <Moon className="w-3 h-3 text-amber-700" />
                            <Moon className="w-3 h-3 text-amber-700" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Hàng 2 */}
              <div className="flex justify-center -space-x-6 mb-[-60px]">
                {deck
                  .slice(
                    Math.ceil(deck.length / 3),
                    Math.ceil((deck.length * 2) / 3)
                  )
                  .map((card, i) => {
                    const isChosen = chosenCards.some(
                      (c) => c.card.id === card.id
                    );
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: isChosen ? 0 : 1 }}
                        transition={{ delay: i * 0.05 + 0.2 }}
                        className="relative cursor-pointer hover:z-50 hover:scale-110 transition-all duration-300"
                        onClick={() => !isChosen && handleCardClick(card)}
                      >
                        <div className="w-24 h-36 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-xl border-3 border-amber-900/40">
                          <div className="absolute inset-0 bg-black/10 rounded-lg" />
                          <div className="absolute inset-2 flex flex-col items-center justify-center space-y-1">
                            <div className="w-10 h-10 bg-amber-900/20 rounded-full flex items-center justify-center">
                              <Eye className="w-6 h-6 text-amber-700" />
                            </div>
                            <div className="flex gap-1">
                              <Moon className="w-3 h-3 text-amber-700" />
                              <Moon className="w-3 h-3 text-amber-700" />
                              <Moon className="w-3 h-3 text-amber-700" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>

              {/* Hàng 3 */}
              <div className="flex justify-center -space-x-6">
                {deck.slice(Math.ceil((deck.length * 2) / 3)).map((card, i) => {
                  const isChosen = chosenCards.some(
                    (c) => c.card.id === card.id
                  );
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: isChosen ? 0 : 1 }}
                      transition={{ delay: i * 0.05 + 0.4 }}
                      className="relative cursor-pointer hover:z-50 hover:scale-110 transition-all duration-300"
                      onClick={() => !isChosen && handleCardClick(card)}
                    >
                      <div className="w-24 h-36 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-xl border-3 border-amber-900/40">
                        <div className="absolute inset-0 bg-black/10 rounded-lg" />
                        <div className="absolute inset-2 flex flex-col items-center justify-center space-y-1">
                          <div className="w-10 h-10 bg-amber-900/20 rounded-full flex items-center justify-center">
                            <Eye className="w-6 h-6 text-amber-700" />
                          </div>
                          <div className="flex gap-1">
                            <Moon className="w-3 h-3 text-amber-700" />
                            <Moon className="w-3 h-3 text-amber-700" />
                            <Moon className="w-3 h-3 text-amber-700" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bước 4: Loading AI */}
        {step === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 space-y-8"
          >
            <Loader2 className="w-24 h-24 text-amber-500 mx-auto animate-spin" />
            <h2 className="text-4xl font-bold text-amber-100">
              Vũ trụ đang suy ngẫm câu trả lời cho bạn...
            </h2>
            <div className="flex justify-center gap-8">
              {chosenCards.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="w-48 h-72 rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-900/50"
                >
                  <img
                    src={c.card.imageUrl}
                    alt={c.card.nameEn}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bước 5: Kết quả AI */}
        {step === "result" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-16"
          >
            <div className="text-center">
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400 mb-6">
                Kết Quả Trải Bài Của Bạn
              </h2>
              <p className="text-2xl text-slate-300">
                Chủ đề:{" "}
                <span className="text-amber-400 font-bold">{topic}</span>
                {birthday && ` | Ngày sinh: ${birthday}`}
              </p>
            </div>

            {/* 3 lá đã chọn */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {selectedCards.map((drawn, index) => (
                <motion.div
                  key={drawn.card.id}
                  initial={{ scale: 0, rotate: drawn.isReversed ? 180 : 0 }}
                  animate={{ scale: 1, rotate: drawn.isReversed ? 180 : 0 }}
                  className="text-center"
                >
                  <div className="relative inline-block mb-6">
                    <img
                      src={drawn.card.imageUrl || "/placeholder-tarot.jpg"}
                      alt={drawn.card.nameEn}
                      className="w-72 h-96 object-cover rounded-3xl shadow-2xl border-8 border-amber-900/60"
                    />
                    {drawn.isReversed && (
                      <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center">
                        <p className="text-4xl font-bold text-red-500 rotate-180">
                          NGƯỢC
                        </p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-amber-100 mb-3">
                    Lá {index + 1}: {drawn.card.nameEn}
                  </h3>
                  <p className="text-xl text-slate-300 max-w-md mx-auto">
                    {drawn.meaning}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Giải nghĩa AI */}
            <div className="bg-gradient-to-br from-slate-900/90 to-purple-950/90 backdrop-blur-xl border-4 border-amber-900/40 rounded-3xl p-12 shadow-2xl">
              <h3 className="text-4xl font-bold text-amber-100 mb-8 text-center flex items-center justify-center gap-4">
                <Sparkles className="w-12 h-12 text-amber-500" />
                Giải Nghĩa Từ Vũ Trụ
                <Sparkles className="w-12 h-12 text-amber-500" />
              </h3>
              <div className="prose prose-invert prose-2xl max-w-none text-slate-200 leading-relaxed text-justify">
                <p className="whitespace-pre-wrap">{aiInterpretation}</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-12 py-6 bg-gradient-to-r from-purple-600 to-amber-600 text-white text-2xl font-bold rounded-2xl hover:from-purple-500 hover:to-amber-500 shadow-2xl transition-all"
              >
                Trải Bài Mới
              </button>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-2xl mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="text-amber-400 hover:text-amber-300 text-xl"
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
