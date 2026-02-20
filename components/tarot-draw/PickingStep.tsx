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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const rowCount = isMobile ? 3 : 2;
  const cardsPerRow = Math.ceil(shuffledDeck.length / rowCount);

  // Render lá bài - layoutId phải dựa trên globalIdx duy nhất của lá bài đó
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
        <div className="absolute inset-0 w-full h-full bg-[#1a1b26] rounded-md overflow-hidden border border-amber-500/50 shadow-xl" style={{ backfaceVisibility: "hidden" }}>
          <img src={card.imageUrl} className={`w-full h-full object-cover ${card.isReversed ? "rotate-180" : ""}`} alt="tarot" />
        </div>
        <div className="absolute inset-0 w-full h-full rounded-md shadow-lg" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <CardBackDesign />
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div className="flex flex-col items-center w-full min-h-[90vh] pt-10 px-2 overflow-hidden">
      
      {/* 1. KHU VỰC 3 Ô CHỜ CỐ ĐỊNH - GIẢI QUYẾT LỖI DỒN BÀI */}
      <div className="flex justify-center gap-4 md:gap-8 mb-12 min-h-[140px] md:min-h-[180px]">
        {[0, 1, 2].map((slotIdx) => {
          // Quan trọng: lấy cardIdx theo đúng vị trí trong mảng đã chọn
          const cardIdx = selectedIndices[slotIdx];
          const hasCard = cardIdx !== undefined;

          return (
            <div key={slotIdx} className="w-20 h-32 md:w-28 md:h-44 relative bg-white/5 rounded-xl shadow-inner border border-white/5">
              {/* Sử dụng AnimatePresence để xử lý việc bay đi bay về của từng ô độc lập */}
              <AnimatePresence mode="popLayout">
                {hasCard && (
                  <motion.div 
                    key={cardIdx} // Key phải là cardIdx để Framer Motion không bị nhầm khi xóa bài
                    className="absolute inset-0 z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {renderCard(shuffledDeck[cardIdx], cardIdx)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 2. DẢI BÀI 78 LÁ */}
      <div className="flex flex-col gap-2 w-full max-w-5xl">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center items-center w-full">
            {shuffledDeck.slice(rowIndex * cardsPerRow, (rowIndex + 1) * cardsPerRow).map((card, cardIdx) => {
              const globalIdx = rowIndex * cardsPerRow + cardIdx;
              const isSelected = selectedIndices.includes(globalIdx);

              return (
                <div key={globalIdx} className="relative w-8 h-12 md:w-16 md:h-24 -ml-4 md:-ml-8 first:ml-0">
                  {/* Nếu không chọn, lá bài nằm ở đây. Nếu chọn, để lại lỗ trống */}
                  {!isSelected ? (
                    renderCard(card, globalIdx)
                  ) : (
                    <div className="w-full h-full bg-black/40 rounded-sm border border-white/5" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. NÚT LẬT BÀI NHẢY TƯNG TƯNG */}
      {selectedIndices.length === 3 && step === "picking" && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: [0, -15, 0],
            opacity: 1 
          }}
          transition={{
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.3 }
          }}
          className="fixed bottom-10 z-50 px-6 w-full max-w-xs"
        >
          <button
            onClick={onConfirmSelection}
            className="group relative w-full py-4 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 bg-[length:200%_auto] hover:bg-right text-white font-black rounded-2xl shadow-[0_10px_40px_rgba(245,158,11,0.5)] flex items-center justify-center gap-3 active:scale-95 transition-all duration-500 border border-white/20"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="tracking-widest">LẬT BÀI NGAY</span>
            <Eye className="w-6 h-6" />
            <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-xl animate-pulse -z-10" />
          </button>
        </motion.div>
      )}

      <p className="mt-8 text-white/40 text-[10px] uppercase tracking-widest text-center">
        {selectedIndices.length < 3 ? `Hãy chọn thêm ${3 - selectedIndices.length} lá bài` : "Bấm vào lá bài ở trên để chọn lại"}
      </p>
    </motion.div>
  );
};