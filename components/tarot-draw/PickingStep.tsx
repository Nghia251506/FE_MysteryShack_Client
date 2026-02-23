"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Sparkles, Zap } from "lucide-react"; // Đổi icon sang Zap cho mặt sau
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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const rowCount = isMobile ? 4 : 2;
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
          className="absolute inset-0 w-full h-full bg-[#0b0416] rounded-md md:rounded-xl overflow-hidden border border-amber-500/50 shadow-xl" 
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
               <Sparkles className="w-4 h-4 text-amber-500/20" />
            </div>
          )}
        </div>

        {/* MẶT SAU (Hoa văn bí ẩn) */}
        <div className="absolute inset-0 w-full h-full rounded-md md:rounded-xl shadow-lg bg-[#12081d]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div className="w-full h-full flex items-center justify-center relative">
             {/* Icon mới: Zap cho cảm giác năng lượng mạnh hơn */}
             <Zap className="w-6 h-6 md:w-10 md:h-10 text-amber-500/40 animate-pulse z-10" />
             <CardBackDesign />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div className="flex flex-col items-center w-full min-h-[90vh] pt-6 md:pt-10 px-2 overflow-x-hidden">
      
      {/* 1. KHU VỰC 3 Ô CHỜ - KHUNG NEON STYLE RESULT */}
      <div className="flex justify-center gap-4 md:gap-10 mb-8 md:mb-12 min-h-[130px] md:min-h-[200px]">
        {[0, 1, 2].map((slotIdx) => {
          const cardIdx = selectedIndices[slotIdx];
          const hasCard = cardIdx !== undefined && shuffledDeck[cardIdx];

          return (
            <div 
              key={slotIdx} 
              className={`relative w-20 h-32 md:w-36 md:h-56 p-[1.5px] md:p-[2px] rounded-lg md:rounded-2xl transition-all duration-500
                ${hasCard 
                  ? 'bg-gradient-to-br from-amber-400 via-fuchsia-500 to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                  : 'bg-white/10'}`}
            >
              <div className="w-full h-full bg-[#0b0416] rounded-[7px] md:rounded-[14px] overflow-hidden relative">
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
                      <div className="w-1.5 h-1.5 bg-amber-500/20 rounded-full animate-ping" />
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. DẢI BÀI 78 LÁ */}
      <div className="flex flex-col gap-1 md:gap-2 w-full max-w-5xl items-center opacity-80">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center items-center w-full pl-4">
            {shuffledDeck.slice(rowIndex * cardsPerRow, (rowIndex + 1) * cardsPerRow).map((card, cardIdx) => {
              const globalIdx = rowIndex * cardsPerRow + cardIdx;
              const isSelected = selectedIndices.includes(globalIdx);

              return (
                <div 
                  key={globalIdx} 
                  className={`relative transition-all duration-300 ${isMobile ? 'w-5 h-8 -ml-1.5' : 'w-16 h-24 -ml-8'} first:ml-0 hover:z-50 hover:-translate-y-2`}
                >
                  {!isSelected ? (
                    renderCard(card, globalIdx)
                  ) : (
                    <div className="w-full h-full bg-amber-500/5 rounded-sm border border-amber-500/20 border-dashed" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. NÚT LẬT BÀI */}
      <AnimatePresence>
        {selectedIndices.length === 3 && step === "picking" && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 md:bottom-10 z-[60] px-6 w-full max-w-xs"
          >
            <button
              onClick={onConfirmSelection}
              className="w-full py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white font-black rounded-2xl shadow-[0_10px_40px_rgba(245,158,11,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <span className="tracking-widest text-sm uppercase">Khai Mở Vận Mệnh</span>
              <Eye className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-8 text-amber-500/40 text-[10px] font-medium uppercase tracking-[0.2em] text-center">
        {selectedIndices.length < 3 ? `Cần chọn ${3 - selectedIndices.length} lá để giải mã` : "Dòng chảy năng lượng đã sẵn sàng"}
      </p>
    </motion.div>
  );
};