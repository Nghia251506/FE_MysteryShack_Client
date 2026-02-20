// components/tarot-draw/ShufflingStep.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

export const CardBackDesign = () => (
  <div className="w-full h-full bg-[#1a0b2e] relative overflow-hidden rounded-lg shadow-2xl border border-amber-500/30">
     {/* Hoa văn mặt sau lá bài giống ảnh mẫu */}
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    <div className="absolute inset-1 border border-amber-500/20 rounded-sm"></div>
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-12 h-12 border border-amber-500/40 rounded-full flex items-center justify-center rotate-45">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,1)]"></div>
        </div>
    </div>
  </div>
);

export const ShufflingStep = () => {
  // Tạo 20 lá bài giả để chạy hiệu ứng chẻ bài
  const cards = Array.from({ length: 10 });

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[70vh] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-80 h-96 flex items-center justify-center">
        {cards.map((_, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={i}
              className="absolute w-24 h-40 md:w-28 md:h-44"
              initial={{ 
                x: isLeft ? -300 : 300, 
                y: isLeft ? -100 : 100, 
                rotate: isLeft ? -45 : 45,
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
                duration: 0.8,
                delay: i * 0.05,
                ease: "circOut",
                repeatDelay: 0.5
              }}
            >
              <CardBackDesign />
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="mt-12 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-2xl font-medium text-amber-200 animate-pulse">
          Đang xào bài...
        </h2>
        <p className="text-slate-500 text-sm mt-2">Năng lượng đang được tập hợp</p>
      </motion.div>
    </motion.div>
  );
};