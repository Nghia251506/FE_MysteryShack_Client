"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Check, Sparkles, Hand } from "lucide-react";
import { Topic } from "@/types/topic";
import { Question } from "@/types/topicQuestion";

interface TopicStepProps {
  apiTopics: Topic[];
  apiQuestions: Question[];
  selectedTopicId: number | null;
  selectedQuestionId: number | null;
  loadingQuestions: boolean;
  onSelectTopic: (topic: Topic) => void;
  onSelectQuestion: (question: Question) => void;
  onStart: () => void;
  getTopicIcon: (name: string) => React.ReactNode;
  getQuote: (name: string) => string;
}

export const TopicStep = ({
  apiTopics,
  apiQuestions,
  selectedTopicId,
  selectedQuestionId,
  loadingQuestions,
  onSelectTopic,
  onSelectQuestion,
  onStart,
  getTopicIcon,
  getQuote,
}: TopicStepProps) => {

  // Tự động cuộn đến câu hỏi đã chọn (Hữu ích khi khôi phục data)
  useEffect(() => {
    if (selectedQuestionId && !loadingQuestions) {
      const activeElement = document.getElementById(`question-${selectedQuestionId}`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedQuestionId, loadingQuestions]);

  return (
    <motion.div
      key="topic"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      // FIX: Thêm overflow-visible để page cha xử lý cuộn, bỏ min-h gò bó
      className="bg-[#130823]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-10 shadow-2xl mx-auto w-full relative mb-10"
    >
      {/* Background Decor */}
      <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header Text */}
      <div className="text-center mb-6 md:mb-10 relative z-10">
        <h1 className="text-xl md:text-5xl font-bold text-white mb-2 leading-tight tracking-tight">
          Sứ Giả <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400 font-extrabold uppercase">TAROT</span>
        </h1>
        <p className="text-slate-400 text-xs md:text-lg max-w-2xl mx-auto font-light">
          Chọn lĩnh vực và câu hỏi bạn đang trăn trở
        </p>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        
        {/* CỘT TRÁI: CHỌN LĨNH VỰC */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
            <Moon className="w-3 h-3 text-amber-500" /> 1. Lĩnh Vực
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {apiTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTopic(t)}
                className={`w-full flex items-center gap-3 p-3 md:p-4 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden ${
                  selectedTopicId === t.id
                    ? "bg-gradient-to-r from-purple-900/40 to-amber-900/40 border-amber-500/50 shadow-md"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${selectedTopicId === t.id ? "bg-amber-500 text-black" : "bg-black/30 text-slate-400"}`}>
                  {getTopicIcon(t.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm md:text-base ${selectedTopicId === t.id ? "text-amber-400" : "text-slate-200"}`}>
                    {t.name}
                  </div>
                </div>
                {selectedTopicId === t.id && <Check className="w-4 h-4 text-amber-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: CHỌN CÂU HỎI */}
        <div className="lg:col-span-7 bg-black/20 rounded-[2rem] border border-white/5 p-4 md:p-6 relative flex flex-col min-h-[300px]">
          {!selectedTopicId ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-60 py-10">
              <Sparkles className="w-10 h-10 text-amber-400/80 animate-pulse mb-3" />
              <p className="text-slate-500 text-sm italic">Chọn lĩnh vực phía trên trước</p>
            </div>
          ) : (
            <>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                <Hand className="w-3 h-3 text-amber-500" /> 2. Câu Hỏi Cụ Thể
              </h3>

              <div className="space-y-2 mb-20 md:mb-20"> {/* Tạo khoảng trống cho nút Submit */}
                {loadingQuestions ? (
                  <div className="py-10 flex justify-center text-amber-500 animate-pulse">Đang tải câu hỏi...</div>
                ) : (
                  apiQuestions.map((q) => (
                    <label
                      id={`question-${q.id}`}
                      key={q.id}
                      onClick={() => onSelectQuestion(q)}
                      className={`relative flex items-center gap-3 p-3 md:p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedQuestionId === q.id
                          ? "bg-amber-500/10 border-amber-500/50"
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedQuestionId === q.id ? "border-amber-500 bg-amber-500" : "border-slate-600"}`}>
                        {selectedQuestionId === q.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className={`text-xs md:text-sm font-medium ${selectedQuestionId === q.id ? "text-white" : "text-slate-300"}`}>
                        {q.questionText}
                      </span>
                    </label>
                  ))
                )}
              </div>

              {/* FIX: Nút Bắt đầu - Luôn ở cuối block câu hỏi nhưng không đè nội dung */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <button
                  onClick={onStart}
                  disabled={!selectedQuestionId}
                  className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 uppercase tracking-widest text-xs"
                >
                  <Sparkles className="w-4 h-4" /> Bắt Đầu Trải Bài
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};