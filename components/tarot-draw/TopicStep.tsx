"use client";

import React from "react";
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
  return (
    <motion.div
      key="topic"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      // Bỏ overflow-hidden để mobile có thể cuộn trang tự nhiên
      className="bg-[#130823]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-10 shadow-2xl mx-auto w-full relative"
    >
      {/* Background Decor */}
      <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header Text */}
      <div className="text-center mb-8 md:mb-12 relative z-10">
        <h1 className="text-2xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
          Những điều thầm kín <br className="hidden md:block" />
          mà bạn đang{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400 font-extrabold uppercase">
            QUAN TÂM
          </span>
        </h1>
        <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
          Hãy để các reader chuyên nghiệp khám phá những thông điệp mà các lá bài
          tarot nhắn gửi tới bạn.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:min-h-[500px]">
        {/* CỘT TRÁI: CHỌN LĨNH VỰC */}
        <div className="lg:col-span-5 space-y-3 flex flex-col">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-2 flex items-center gap-2">
            <Moon className="w-3 h-3 text-amber-500" /> Chọn Lĩnh Vực
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {apiTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTopic(t)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden ${
                  selectedTopicId === t.id
                    ? "bg-gradient-to-r from-purple-900/40 to-amber-900/40 border-amber-500/50 shadow-md scale-[1.01]"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                {selectedTopicId === t.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                )}
                <div
                  className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    selectedTopicId === t.id
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                      : "bg-black/30 text-slate-400 group-hover:text-white"
                  }`}
                >
                  {getTopicIcon(t.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-bold text-base mb-0.5 flex justify-between items-center ${
                      selectedTopicId === t.id ? "text-amber-400" : "text-slate-200"
                    }`}
                  >
                    {t.name}
                    {selectedTopicId === t.id && (
                      <Check className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </div>
                  <p
                    className={`text-xs italic truncate ${
                      selectedTopicId === t.id ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    "{getQuote(t.name)}"
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: CHỌN CÂU HỎI */}
        <div className="lg:col-span-7 bg-black/20 rounded-[2rem] border border-white/5 p-5 md:p-6 relative flex flex-col min-h-[350px] md:min-h-full">
          {!selectedTopicId ? (
            <div className="h-full flex flex-col items-center justify-center opacity-60 py-10">
              <div className="relative w-32 h-48 md:w-40 md:h-56 mb-4">
                <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-blue-600/90 rounded-xl shadow-2xl border border-white/10"
                ></motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute inset-0 bg-[#1a0b2e] border border-amber-500/30 rounded-xl flex items-center justify-center translate-x-3 translate-y-3"
                >
                  <Sparkles className="w-10 h-10 text-amber-400/80 animate-pulse" />
                </motion.div>
              </div>
              <p className="text-slate-500 text-sm italic">Chọn một lĩnh vực để xem câu hỏi</p>
            </div>
          ) : (
            <>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
                <Hand className="w-3 h-3 text-amber-500" /> Chọn Câu Hỏi Cụ Thể
              </h3>

              <div className="flex-grow overflow-y-visible md:overflow-y-auto custom-scrollbar md:max-h-[380px] pr-1">
                {loadingQuestions ? (
                  <div className="h-32 flex items-center justify-center space-x-2 text-amber-500">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 pb-28 md:pb-2">
                    {apiQuestions.map((q) => (
                      <label
                        key={q.id}
                        onClick={() => onSelectQuestion(q)}
                        className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${
                          selectedQuestionId === q.id
                            ? "bg-amber-500/10 border-amber-500/50 shadow-lg"
                            : "bg-white/5 border-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            selectedQuestionId === q.id
                              ? "border-amber-500 bg-amber-500"
                              : "border-slate-600"
                          }`}
                        >
                          {selectedQuestionId === q.id && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium leading-snug ${
                            selectedQuestionId === q.id ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {q.questionText}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Nút Bắt đầu - Cố định ở đáy container trên mobile */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1b0d2d] via-[#1b0d2d]/95 to-transparent pt-10 flex justify-center md:justify-end z-20 rounded-b-[2rem]">
                <button
                  onClick={onStart}
                  disabled={!selectedQuestionId}
                  className="w-full md:w-auto px-10 py-4 md:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(234,88,12,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
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