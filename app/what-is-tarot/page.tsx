"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Crimson+Pro:italic,wght@0,300;0,400;1,300&family=Cinzel:wght@400;700&display=swap";

// NỘI DUNG CHI TIẾT ĐÃ ĐƯỢC NÂNG CẤP
const chapters = [
  {
    image: "https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c807858c4156635311d5b65f47f0baf6bd6dbf1fd0d4162223ffc64fe8306b2c4c4d39a74f6b1bfe70b3203772c7979020cefa/tarot-1-9889.jpg",
    title: "Nguồn Gốc",
    subtitle: "The Genesis",
    text: "Hành trình của Tarot không bắt đầu từ những phòng bói toán tối tăm, mà từ những cung điện lộng lẫy tại Ý vào giữa thế kỷ 15 dưới cái tên 'Tarocchini'. Ban đầu, nó là một thú vui xa xỉ của giới thượng lưu để thể hiện địa vị xã hội. Tuy nhiên, các nhà huyền học tin rằng Tarot thực chất là một 'Thư viện tri thức' được mã hóa dưới dạng hình ảnh để vượt qua sự kiểm duyệt khắc nghiệt của tôn giáo thời bấy giờ. Mỗi lá bài là một mảnh ghép của bộ môn Giả kim thuật (Alchemy) và Kabbalah, giúp người tầm đạo tìm thấy mối liên hệ giữa con người (Microcosm) và vũ trụ bao la (Macrocosm). Qua nhiều thế kỷ, Tarot đã tiến hóa từ một trò chơi giải trí thành một hệ thống bản đồ tâm linh hoàn chỉnh, dẫn dắt nhân loại đi tìm ý nghĩa của sự tồn tại.",
    rune: "☽",
  },
  {
    image: "https://image.made-in-china.com/365f3j00LhbcQUFGqpqY/In-n-t-y-ch-nh-b-n-bu-n-b-b-i-Tarot-Oracle-b-i-to-n-huy-n-b-nh-m-nh-tr-ch-i-th-tr-ch-i-b-i-in-n-tr-ch-i-b-ng-ch-t-l-ng-cao.webp",
    title: "Bộ Đại Bí Ẩn",
    subtitle: "Major Arcana",
    text: "Gồm 22 lá bài đánh số từ 0 đến 21, Bộ Đại Bí Ẩn chính là linh hồn của Tarot, mô tả những bước ngoặt vĩ đại và những bài học mang tính định mệnh. Nó bắt đầu với The Fool - hiện thân của một linh hồn thuần khiết bước vào thế gian với sự ngây thơ, và kết thúc với The World - biểu tượng của sự giác ngộ viên mãn. Giữa hành trình đó, chúng ta gặp gỡ những nguyên mẫu tâm lý học như The High Priestess đại diện cho trực giác bí ẩn, The Hierophant cho những giá trị truyền thống, hay The Tower cho những đổ vỡ cần thiết để tái sinh. Khi một lá bài thuộc Bộ Đại Bí Ẩn xuất hiện, đó không chỉ là một sự kiện bình thường, mà là một thông điệp từ vũ trụ nhắc nhở bạn về một giai đoạn quan trọng trong tiến trình trưởng thành của tâm hồn.",
    rune: "✦",
  },
  {
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtahZzoYBoDws1TbP7Bzxlalg47eQ4On80V50Ucovct-aqb3BTpfSl33YR3KnDJHqW25wVrKpxhSvJ_2AW0YfM3h6oJtkpXDc1jvXQ71Pxmt44giex7gL8T-Lh5Fw9DChpNYKW_eIv/s1600/les4elements-jpg3.jpeg",
    title: "Bốn Nguyên Tố",
    subtitle: "Minor Arcana",
    text: "56 lá Bộ Ẩn Phụ tập trung vào các khía cạnh cụ thể, hữu hình trong cuộc sống hằng ngày. Chúng được chia làm 4 nhóm tương ứng với 4 nguyên tố nền tảng: Gậy (Wands - Lửa) thổi bùng đam mê và khát vọng sáng tạo, Cốc (Cups - Nước) phản chiếu thế giới nội tâm và cảm xúc; Kiếm (Swords - Khí) đại diện cho sức mạnh lý trí và những cuộc đấu tranh tư tưởng; và Tiền (Pentacles - Đất) kết nối chúng ta với giá trị vật chất và sự ổn định. Sự kết hợp giữa các lá bài này tạo ra một bức tranh chi tiết về cách chúng ta phản ứng với thế giới xung quanh, từ những niềm vui nhỏ bé đến những khó khăn thường nhật, giúp chúng ta làm chủ vận mệnh từ những điều giản đơn nhất.",
    rune: "⊕",
  },
  {
    image: "https://media.istockphoto.com/id/1187328374/vi/anh/ph%C3%B9-th%E1%BB%A7y-s%E1%BB%AD-d%E1%BB%A5ng-m%E1%BB%99t-qu%E1%BA%A3-c%E1%BA%A7u-pha-l%C3%AA-%C4%91%E1%BB%83-d%E1%BB%B1-%C4%91o%C3%A1n-t%C6%B0%C6%A1ng-lai.jpg?s=170667a&w=0&k=20&c=n-HzL1pJ4APw70wmPu31eIfdS94XQEKg4_G1f2nSqq0=",
    title: "Giá Trị Thực",
    subtitle: "The Modern Mirror",
    text: "Trong thời đại của khoa học và logic, Tarot trở thành một công cụ hỗ trợ tâm lý mạnh mẽ. Theo khái niệm 'Đồng hiện' (Synchronicity) của Carl Jung, việc rút một lá bài không phải là ngẫu nhiên, mà là sự phản ánh tình trạng hiện tại của tiềm thức. Tarot hoạt động như một cầu nối giúp chúng ta đối thoại với phần 'vô thức' của chính mình, bóc tách những nỗi sợ vô hình và khai phóng những tiềm năng đang ngủ yên. Nó không quyết định tương lai thay bạn, mà trang bị cho bạn sự thấu suốt để tự mình lựa chọn con đường đúng đắn nhất. Cuối cùng, Tarot là một lời nhắc nhở rằng: Mọi câu trả lời bạn tìm kiếm thực chất đều đã nằm sẵn bên trong bạn, lá bài chỉ đơn giản là chiếc chìa khóa mở ra cánh cửa dẫn đến sự thật đó.",
    rune: "◈",
  },
];

const Page = React.forwardRef((props: any, ref: any) => (
  <div className="page" ref={ref} style={{ width: props.width, height: props.height }}>
    <div className="bg-[#120d0e] relative overflow-hidden h-full border-l border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10" />
      <div className="relative z-20 h-full w-full flex flex-col justify-center items-center px-10 md:px-16 py-10">
        {props.children}
      </div>
    </div>
  </div>
));
Page.displayName = "Page";

export default function WhatIsTarotPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const bookRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
    const updateScale = () => {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const baseW = winW < 768 ? 700 : 1400;
      const baseH = 900;
      const scaleX = (winW * 0.85) / baseW;
      const scaleY = (winH * 0.7) / baseH; // Giảm xuống 0.7 để dành chỗ cho nút bấm ở dưới
      let newScale = Math.min(scaleX, scaleY);
      if (winW >= 1920) newScale = Math.min(newScale, 1);
      setScale(newScale);
    };
    window.addEventListener("resize", updateScale);
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const onFlip = useCallback((e: any) => {
    const isMobile = window.innerWidth < 768;
    setCurrentStep(isMobile ? e.data : Math.floor(e.data / 2));
  }, []);

  if (!isMounted) return null;

  const isLastPage = currentStep === chapters.length - 1;

  return (
    <div className="fixed inset-0 bg-[#070405] text-slate-200 overflow-hidden select-none font-serif">
      <link href={FONT_LINK} rel="stylesheet" />

      {/* BACKGROUND LAYER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img src="https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover blur-md grayscale" alt="" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-screen flex flex-col">
        {/* TOP NAVIGATION */}
        <div className="flex items-center justify-between px-6 md:px-10 py-6">
          <Link href="/" className="group flex items-center gap-2 text-amber-500/40 hover:text-amber-400">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ fontFamily: "'Cinzel', serif" }}>Thư Viện</span>
          </Link>
          
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-600/30" />
                <div className="mx-6 text-center">
                    <div
                        className="text-amber-400/60 text-[10px] tracking-[0.6em] uppercase mb-1"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Mystic Tarot
                    </div>
                    <div className="text-amber-300/20 text-xs tracking-[0.5em]">✦ ✦ ✦</div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-600/30" />
            
          <div className="text-amber-500/40 text-[10px] tracking-[0.4em] font-bold uppercase">Chương {currentStep + 1} / {chapters.length}</div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
          
          <div className="relative flex items-center justify-center w-full">
            {/* Nút lật trang trái */}
            <button
              onClick={() => bookRef.current?.pageFlip().flipPrev()}
              className={`hidden md:block absolute left-4 lg:left-12 z-[60] p-4 text-amber-500/20 hover:text-amber-500 transition-all ${currentStep === 0 ? "invisible" : ""}`}
            >
              <ChevronLeft className="w-12 h-12 lg:w-20 lg:h-20 stroke-[1px]" />
            </button>

            {/* SÁCH */}
            <div 
              style={{ 
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
              className="flex items-center justify-center shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5"
            >
              {/* @ts-ignore */}
              <HTMLFlipBook
                width={700}
                height={900}
                size="fixed"
                showCover={false}
                onFlip={onFlip}
                ref={bookRef}
                useMouseEvents={true}
                usePortrait={typeof window !== 'undefined' && window.innerWidth < 768}
                flippingTime={1000}
                drawShadow={true}
                className="book-main"
              >
                {chapters.map((ch, index) => [
                  <Page key={`left-${index}`} width={700} height={900}>
                    <div className="w-full h-full flex flex-col items-center justify-center gap-12">
                      <div className="relative w-full h-[70%] rounded-sm overflow-hidden border border-white/10 shadow-2xl">
                        <img src={ch.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="text-amber-500/5 text-[180px] leading-none font-thin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        {ch.rune}
                      </div>
                    </div>
                  </Page>,
                  <Page key={`right-${index}`} width={700} height={900}>
                    <div className="w-full h-full flex flex-col justify-start pt-12 space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-[1px] w-12 bg-amber-600/40" />
                          <span className="text-amber-500/60 text-xs tracking-[0.6em] uppercase font-bold" style={{ fontFamily: "'Cinzel', serif" }}>{ch.subtitle}</span>
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>{ch.title}</h2>
                      </div>
                      <p className="text-white/70 text-[1.4rem] font-light italic leading-[1.8] text-justify" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        "{ch.text}"
                      </p>
                    </div>
                  </Page>
                ]).flat()}
              </HTMLFlipBook>
            </div>

            {/* Nút lật trang phải */}
            <button
              onClick={() => bookRef.current?.pageFlip().flipNext()}
              className={`hidden md:block absolute right-4 lg:right-12 z-[60] p-4 text-amber-500/20 hover:text-amber-500 transition-all ${isLastPage ? "invisible" : ""}`}
            >
              <ChevronRight className="w-12 h-12 lg:w-20 lg:h-20 stroke-[1px]" />
            </button>
          </div>

          {/* NÚT BẮT ĐẦU (RA NGOÀI SÁCH) */}
          <div className="h-24 mt-8 flex items-center justify-center w-full overflow-hidden">
            <AnimatePresence>
              {isLastPage && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <Link href="/tarot-draw" className="group relative inline-flex items-center gap-6 px-16 py-6 bg-amber-600/10 border border-amber-600/40 text-amber-500 rounded-full hover:bg-amber-600 hover:text-black hover:scale-110 transition-all duration-300">
                    <Sparkles className="w-6 h-6 animate-pulse" /> 
                    <span className="tracking-[0.3em] font-bold text-lg" style={{ fontFamily: "'Cinzel', serif" }}>BẮT ĐẦU TRẢI NGHIỆM</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* BOTTOM PROGRESS */}
        <div className="h-20 flex flex-col justify-center items-center gap-4 pb-4">
            <div className="flex gap-4">
            {chapters.map((_, i) => (
                <button
                  key={i}
                  onClick={() => bookRef.current?.pageFlip().turnToPage(window.innerWidth < 768 ? i : i * 2)}
                  className={`h-1 transition-all duration-500 ${i === currentStep ? "w-16 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]" : "w-4 bg-white/10 hover:bg-white/20"}`}
                />
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}