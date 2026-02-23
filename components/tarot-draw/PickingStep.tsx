"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Sparkles } from "lucide-react";
import { CardBackDesign } from "./ShufflingStep";

interface PickingStepProps {
  shuffledDeck: any[];
  selectedIndices: number[];
  step: string;
  shouldFlipToFace: boolean;
  onToggleCard: (index: number) => void;
  onConfirmSelection: () => void;
}

export const PickingStep = ({
  shuffledDeck,
  selectedIndices,
  step,
  shouldFlipToFace,
  onToggleCard,
  onConfirmSelection,
}: PickingStepProps) => {
  // Tinh chỉnh layout cho mobile hẹp (iPhone X, Galaxy A06)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const rowCount = isMobile ? 4 : 2; // Tăng số hàng trên mobile để mỗi hàng ngắn lại, dễ nhìn hơn
  const cardsPerRow = Math.ceil(shuffledDeck.length / rowCount);

  const renderCard = (card: any, globalIdx: number) => (
    <motion.div
      layoutId={`card-container-${globalIdx}`}
      onClick={() => step === "picking" && onToggleCard(globalIdx)}
      className="w-full h-full cursor-pointer relative"
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: shouldFlipToFace ? 0 : 180 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {/* MẶT TRƯỚC (Hình lá bài) */}
        <div 
          className="absolute inset-0 w-full h-full bg-[#1a1b26] rounded-md overflow-hidden border border-amber-500/50 shadow-xl" 
          style={{ backfaceVisibility: "hidden" }}
        >
          {card.imageUrl ? (
             <img 
              src={card.imageUrl} 
              className={`w-full h-full object-cover ${card.isReversed ? "rotate-180" : ""}`} 
              alt="tarot" 
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
               <Sparkles className="w-6 h-6 text-amber-500/20" />
            </div>
          )}
        </div>
        {/* MẶT SAU (Hoa văn) */}
        <div className="absolute inset-0 w-full h-full rounded-md shadow-lg" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <CardBackDesign />
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div className="flex flex-col items-center w-full min-h-[90vh] pt-6 md:pt-10 px-2 overflow-x-hidden">
      
      {/* 1. KHU VỰC 3 Ô CHỜ - Cố định kích thước để không bị nhảy */}
      <div className="flex justify-center gap-3 md:gap-8 mb-8 md:mb-12 min-h-[120px] md:min-h-[180px]">
        {[0, 1, 2].map((slotIdx) => {
          const cardIdx = selectedIndices[slotIdx];
          const hasCard = cardIdx !== undefined && shuffledDeck[cardIdx];

          return (
            <div key={slotIdx} className="w-16 h-28 md:w-28 md:h-44 relative bg-white/5 rounded-lg md:rounded-xl shadow-inner border border-white/5">
              <AnimatePresence mode="popLayout">
                {hasCard && (
                  <motion.div 
                    key={cardIdx} 
                    className="absolute inset-0 z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {renderCard(shuffledDeck[cardIdx], cardIdx)}
                  </motion.div>
                )}
              </AnimatePresence>
              {!hasCard && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 bg-amber-500/20 rounded-full animate-ping" />
                 </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. DẢI BÀI 78 LÁ - Fix lỗi tràn màn hình mobile */}
      <div className="flex flex-col gap-1 md:gap-2 w-full max-w-5xl items-center">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center items-center w-full pl-4">
            {shuffledDeck.slice(rowIndex * cardsPerRow, (rowIndex + 1) * cardsPerRow).map((card, cardIdx) => {
              const globalIdx = rowIndex * cardsPerRow + cardIdx;
              const isSelected = selectedIndices.includes(globalIdx);

              return (
                <div 
                  key={globalIdx} 
                  className={`relative transition-all duration-300 ${isMobile ? 'w-5 h-8 -ml-2' : 'w-16 h-24 -ml-8'} first:ml-0`}
                >
                  {!isSelected ? (
                    renderCard(card, globalIdx)
                  ) : (
                    <div className="w-full h-full bg-amber-500/5 rounded-sm border border-amber-500/10 border-dashed" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. NÚT LẬT BÀI */}
      {selectedIndices.length === 3 && step === "picking" && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 md:bottom-10 z-50 px-6 w-full max-w-xs"
        >
          <button
            onClick={onConfirmSelection}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span className="tracking-widest text-sm">LẬT BÀI NGAY</span>
            <Eye className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      <p className="mt-6 text-white/30 text-[9px] uppercase tracking-widest text-center">
        {selectedIndices.length < 3 ? `Chọn thêm ${3 - selectedIndices.length} lá để kết nối` : "Chạm vào lá bài để thay đổi"}
      </p>
    </motion.div>
  );
};