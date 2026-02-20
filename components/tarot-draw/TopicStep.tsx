"use client";

import React from "react";
import { motion } from "framer-motion";
import { Moon, Check, Sparkles, Hand, Heart, Briefcase, Wallet } from "lucide-react";
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
  getQuote
}: TopicStepProps) => {
  return (
    <motion.div
      key="topic"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#130823]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl mx-auto w-full relative overflow-hidden"
    >
      <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

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
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-center">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-2 flex items-center gap-2">
            <Moon className="w-3 h-3 text-amber-500" /> Chọn Lĩnh Vực
          </h3>

          {apiTopics.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTopic(t)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden ${
                selectedTopicId === t.id 
                ? 'bg-gradient-to-r from-purple-900/40 to-amber-900/40 border-amber-500/50 shadow-md scale-[1.01]' 
                : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              {selectedTopicId === t.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>}
              <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                selectedTopicId === t.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-black/30 text-slate-400 group-hover:text-white'
              }`}>
                {getTopicIcon(t.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-base mb-0.5 flex justify-between items-center ${
                  selectedTopicId === t.id ? 'text-amber-400' : 'text-slate-200'
                }`}>
                  {t.name}
                  {selectedTopicId === t.id && <Check className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <p className={`text-xs italic truncate ${
                  selectedTopicId === t.id ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  "{getQuote(t.name)}"
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 bg-black/20 rounded-[2rem] border border-white/5 p-6 relative overflow-hidden flex flex-col min-h-[400px]">
          {!selectedTopicId ? (
            <div className="h-full flex items-center justify-center opacity-60">
              <div className="relative w-40 h-56">
                <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
                <motion.div animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-blue-600/90 rounded-xl shadow-2xl border border-white/10"></motion.div>
                <motion.div animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }} className="absolute inset-0 bg-[#1a0b2e] border border-amber-500/30 rounded-xl flex items-center justify-center translate-x-3 translate-y-3 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <div className="p-4 border border-amber-500/20 rounded-lg"><Sparkles className="w-12 h-12 text-amber-400/80 animate-pulse" /></div>
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
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 pb-20">
                    {apiQuestions.map((q) => (
                      <label 
                        key={q.id} 
                        onClick={() => onSelectQuestion(q)} 
                        className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 group hover:shadow-lg ${
                          selectedQuestionId === q.id ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          selectedQuestionId === q.id ? 'border-amber-500 bg-amber-500 text-black' : 'border-slate-600 text-transparent group-hover:border-slate-400'
                        }`}>
                          {selectedQuestionId === q.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <input type="radio" className="hidden" checked={selectedQuestionId === q.id} readOnly />
                        <span className={`text-sm font-medium ${selectedQuestionId === q.id ? 'text-white' : 'text-slate-300'}`}>{q.questionText}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#150a1f] via-[#150a1f]/95 to-transparent pt-10 flex justify-end">
                <button 
                  onClick={onStart} 
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
  );
};