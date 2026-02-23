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
  // Lấy ra đúng 3 lá đã chọn từ bộ bài (Dù là bộ bài thật hay bộ bài giả lập 78 lá)
  const selectedCards = selectedIndices.map(idx => shuffledDeck[idx]).filter(Boolean);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full max-w-6xl mx-auto pb-20 px-2 md:px-4"
    >
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-5xl font-black text-white mb-1 tracking-tighter uppercase italic">
          Thông Điệp Vũ Trụ
        </h2>
        <p className="text-amber-400 text-[9px] md:text-sm font-medium tracking-[0.3em] uppercase opacity-80">
          Kết quả trải bài dành cho bạn
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-8 mb-12">
        {selectedCards.map((card, idx) => (
          <motion.div 
            key={card.id || idx} 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: idx * 0.15 }}
            className="relative"
          >
            {/* KHUNG NEON CHÍNH */}
            <div className="relative p-[1px] md:p-[3px] rounded-xl md:rounded-[2.5rem] bg-gradient-to-br from-amber-400 via-fuchsia-500 to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] overflow-hidden">
              
              {/* TAG RIBBON - FIX LỖI HIỂN THỊ MOBILE */}
              <div className="absolute top-0 right-0 w-10 h-10 md:w-24 md:h-24 z-50 overflow-hidden pointer-events-none">
                <div className={`absolute top-[10%] right-[-35%] w-[150%] py-0.5 transform rotate-45 text-center font-black text-[6px] md:text-[11px] uppercase tracking-tighter shadow-md border-b border-white/20
                  ${card.isReversed ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}
                >
                  {card.isReversed ? 'Ngược' : 'Xuôi'}
                </div>
              </div>

              <div className="bg-[#0b0416] rounded-[11px] md:rounded-[2.3rem] p-1 md:p-6 flex flex-col items-center">
                
                {/* ẢNH BÀI */}
                <div className="relative w-full aspect-[2/3] rounded-lg md:rounded-2xl overflow-hidden mb-2 md:mb-6 bg-black/60 border border-white/5">
                  {card.imageUrl ? (
                    <img 
                      src={card.imageUrl} 
                      alt={card.nameVi} 
                      className={`w-full h-full object-cover transition-transform duration-1000 ${card.isReversed ? 'rotate-180' : ''}`} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-500/30" />
                    </div>
                  )}
                </div>
                
                {/* TÊN BÀI */}
                <div className="text-center w-full px-1 mb-1">
                  <h3 className="text-[8px] md:text-xl font-bold text-white uppercase truncate leading-tight">
                    {card.nameVi || "Đang giải mã..."}
                  </h3>
                  <div className="h-[1px] md:h-[2px] w-4 md:w-10 bg-amber-500/60 mx-auto mt-1 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CỤM NÚT ĐIỀU HƯỚNG */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center px-4">
        {/* Nút rút lại ẩn bớt trên mobile nếu muốn tập trung vào nút chính */}
        
        <button 
          onClick={onSubmit} 
          className="w-full md:w-auto order-1 md:order-2 px-8 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white font-black text-xs md:text-lg rounded-xl shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" /> Kết nối Reader ngay
        </button>
      </div>

      <p className="text-center text-slate-500 text-[8px] md:text-[10px] mt-8 uppercase tracking-[0.2em]">
        Năng lượng đã sẵn sàng cho sự thấu thị
      </p>
    </motion.div>
  );
};