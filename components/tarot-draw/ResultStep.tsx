"use client";
import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";

interface ResultStepProps {
  shuffledDeck: any[];
  selectedIndices: number[];
  onRedraw: () => void;
  onSubmit: () => void;
}

export const ResultStep = ({ shuffledDeck, selectedIndices, onRedraw, onSubmit }: ResultStepProps) => {
  const selectedCards = selectedIndices.map(idx => shuffledDeck[idx]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full max-w-6xl mx-auto pb-20 px-2"
    >
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-5xl font-black text-white mb-1 tracking-tighter uppercase italic">
          Kết Quả Trải Bài
        </h2>
        <p className="text-amber-400 text-[10px] md:text-sm font-medium tracking-[0.3em] uppercase opacity-80">Insight từ các lá bài</p>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-10 mb-12">
        {selectedCards.map((card, idx) => (
          <motion.div 
            key={idx} 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: idx * 0.15 }}
            className="relative"
          >
            {/* KHUNG NEON CHÍNH */}
            <div className="relative p-[1.5px] md:p-[3px] rounded-xl md:rounded-[2.5rem] bg-gradient-to-br from-amber-400 via-fuchsia-500 to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] overflow-hidden">
              
              {/* TAG RIBBON KIỂU PROMOTION - FIX LỖI BỊ CẮT */}
              <div className="absolute top-0 right-0 w-12 h-12 md:w-24 md:h-24 z-50 overflow-hidden pointer-events-none">
                <div className={`absolute top-[15%] right-[-30%] w-[140%] py-0.5 md:py-1 transform rotate-45 text-center font-black text-[7px] md:text-[11px] uppercase tracking-tighter shadow-md border-b border-white/20
                  ${card.isReversed ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}
                >
                  {card.isReversed ? 'Ngược' : 'Xuôi'}
                </div>
              </div>

              <div className="bg-[#0b0416] rounded-[10px] md:rounded-[2.3rem] p-1.5 md:p-6 flex flex-col items-center">
                
                {/* ẢNH BÀI - GIỮ OBJECT CONTAIN */}
                <div className="relative w-full aspect-[2/3] rounded-lg md:rounded-2xl overflow-hidden mb-2 md:mb-6 bg-black/40 border border-white/5">
                  <img 
                    src={card.imageUrl} 
                    alt={card.nameVi} 
                    className={`w-full h-full object-contain transition-transform duration-1000 ${card.isReversed ? 'rotate-180 scale-100' : 'scale-100'}`} 
                  />
                </div>
                
                {/* TÊN BÀI */}
                <div className="text-center w-full px-1">
                  <h3 className="text-[9px] md:text-xl font-black text-white uppercase truncate drop-shadow-sm">
                    {card.nameVi}
                  </h3>
                  <div className="h-[1.5px] w-6 md:w-10 bg-amber-500/60 mx-auto mt-1 md:mt-2 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center px-4">
        <button 
          onClick={onRedraw} 
          className="w-full md:w-auto order-2 md:order-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Rút lại bài
        </button>
        
        <button 
          onClick={onSubmit} 
          className="w-full md:w-auto order-1 md:order-2 px-10 py-4 bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white font-black text-sm md:text-xl rounded-xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Sparkles className="w-5 h-5" /> KẾT NỐI READER
        </button>
      </div>
    </motion.div>
  );
};