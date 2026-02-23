// components/tarot-draw/ShufflingStep.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

export const CardBackDesign = () => (
  <div className="w-full h-full bg-[#1a0b2e] relative overflow-hidden rounded-lg shadow-2xl border border-amber-500/30">
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    <div className="absolute inset-1 border border-amber-500/20 rounded-sm"></div>
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 md:w-12 md:h-12 border border-amber-500/40 rounded-full flex items-center justify-center rotate-45">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,1)]"></div>
        </div>
    </div>
  </div>
);

export const ShufflingStep = () => {
  // Tăng lên 10 lá cho hiệu ứng dày hơn một chút trên mobile
  const cards = Array.from({ length: 6 });

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[60vh] md:h-[70vh] relative px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full max-w-[280px] h-64 md:h-96 flex items-center justify-center">
        {cards.map((_, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={i}
              className="absolute w-20 h-32 md:w-28 md:h-44"
              initial={{ 
                x: isLeft ? -150 : 150, // Giảm biên độ x để không văng khỏi màn hình mobile
                y: isLeft ? -50 : 50, 
                rotate: isLeft ? -30 : 30,
                opacity: 0 
              }}
              animate={{ 
                x: 0, 
                y: 0, 
                rotate: 0,
                opacity: 1,
                zIndex: i
              }}
              transition={{
                repeat: Infinity,
                duration: 0.7,
                delay: i * 0.08,
                ease: "circOut",
                repeatDelay: 0.2
              }}
            >
              <CardBackDesign />
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="mt-8 md:mt-12 text-center relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Thiết lập kết nối</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Vũ trụ đang trả lời...
        </h2>
        <p className="text-slate-500 text-xs md:text-sm italic">
            "Sự tĩnh lặng là nơi bắt đầu của mọi câu trả lời"
        </p>
      </motion.div>
    </motion.div>
  );
};