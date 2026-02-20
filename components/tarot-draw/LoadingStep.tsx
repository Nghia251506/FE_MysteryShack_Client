"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Chèn font trực tiếp để đảm bảo hiển thị đúng chuẩn Tarot
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Crimson+Pro:italic,wght@0,300;0,400;1,300&family=Cinzel:wght@400;700&display=swap";

const storySlides = [
    {
        image: "https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c807858c4156635311d5b65f47f0baf6bd6dbf1fd0d4162223ffc64fe8306b2c4c4d39a74f6b1bfe70b3203772c7979020cefa/tarot-1-9889.jpg",
        chapterTitle: "Nguồn Gốc",
        text: "Từ thuở xa xưa, 78 lá bài Tarot được sinh ra như những mảnh vỡ của linh hồn vũ trụ — mỗi lá mang một bí ẩn chưa ai giải mã trọn vẹn.",
        rune: "☽",
    },
    {
        image: "https://image.made-in-china.com/365f3j00LhbcQUFGqpqY/In-n-t-y-ch-nh-b-n-bu-n-b-b-i-Tarot-Oracle-b-i-to-n-huy-n-b-nh-m-nh-tr-ch-i-th-tr-ch-i-b-i-in-n-tr-ch-i-b-ng-ch-t-l-ng-cao.webp",
        chapterTitle: "Bộ Đại Bí Ẩn",
        text: "22 lá Major Arcana — những nguyên mẫu của nhân loại. Từ The Fool bước đi trên bờ vực, đến The World viên mãn trong vòng xoay vũ trụ.",
        rune: "✦",
    },
    {
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtahZzoYBoDws1TbP7Bzxlalg47eQ4On80V50Ucovct-aqb3BTpfSl33YR3KnDJHqW25wVrKpxhSvJ_2AW0YfM3h6oJtkpXDc1jvXQ71Pxmt44giex7gL8T-Lh5Fw9DChpNYKW_eIv/s1600/les4elements-jpg3.jpeg",
        chapterTitle: "Bốn Nguyên Tố",
        text: "Gươm, Cốc, Quyền trượng, Đồng tiền — bốn chất bài phản chiếu Khí, Nước, Lửa và Đất. Chúng là ngôn ngữ của thực tại.",
        rune: "⊕",
    },
    {
        image: "https://media.istockphoto.com/id/1187328374/vi/anh/ph%C3%B9-th%E1%BB%A7y-s%E1%BB%AD-d%E1%BB%A5ng-m%E1%BB%99t-qu%E1%BA%A3-c%E1%BA%A7u-pha-l%C3%AA-%C4%91%E1%BB%83-d%E1%BB%B1-%C4%91o%C3%A1n-t%C6%B0%C6%A1ng-lai.jpg?s=170667a&w=0&k=20&c=n-HzL1pJ4APw70wmPu31eIfdS94XQEKg4_G1f2nSqq0=",
        chapterTitle: "Khoảnh Khắc Này",
        text: "Không có lá bài ngẫu nhiên. Vũ trụ đã sắp xếp để lá bài hôm nay xuất hiện đúng lúc bạn cần nghe điều đó nhất.",
        rune: "◈",
    },
];

const Particle = ({ delay, x }: { delay: number; x: number }) => (
    <motion.div
        className="absolute bottom-0 w-px bg-amber-400/30"
        style={{ left: `${x}%`, height: Math.random() * 60 + 20 }}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0, 0.4, 0], y: -150 }}
        transition={{ duration: 4 + Math.random() * 2, delay, repeat: Infinity, ease: "linear" }}
    />
);

export const LoadingStep = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    const isReturningUser = useMemo(() => {
        if (typeof window === "undefined") return false;
        return !!sessionStorage.getItem("tarot_draw_state_persist");
    }, []);

    const currentSlide = useMemo(() => {
        const index = Math.floor((progress / 100) * storySlides.length);
        return index >= storySlides.length ? storySlides.length - 1 : index;
    }, [progress]);

    const [particles] = useState(() =>
        Array.from({ length: 25 }, (_, i) => ({ id: i, delay: i * 0.3, x: Math.random() * 100 }))
    );

    useEffect(() => {
        // Tốc độ nhảy % (Theo yêu cầu của ông: khoảng 12s, khách cũ nhanh hơn ~1s)
        const speed = isReturningUser ? 100 : 120;
        const timer = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
        }, speed);
        return () => clearInterval(timer);
    }, [isReturningUser]);

    useEffect(() => {
        if (progress === 100) {
            const timeout = setTimeout(onComplete, 800);
            return () => clearTimeout(timeout);
        }
    }, [progress, onComplete]);

    const slide = storySlides[currentSlide];

    return (
        <div className="fixed inset-0 bg-[#0a0608] z-[100] flex flex-col overflow-hidden font-serif">
            {/* Import Font chuẩn Tarot */}
            <link href={FONT_LINK} rel="stylesheet" />

            {/* BACKGROUND IMAGE */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <img src={slide.image} className="w-full h-full object-cover" alt="" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0608] via-transparent to-[#0a0608]" />

            {/* RISING PARTICLES */}
            <div className="absolute inset-0 z-[2] pointer-events-none">
                {particles.map((p) => (
                    <Particle key={p.id} delay={p.delay} x={p.x} />
                ))}
            </div>

            {/* TOP HEADER */}
            <div className="relative z-10 flex items-center justify-between px-8 pt-10">
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
            </div>

            {/* CENTER RUNE */}
            <div className="relative z-10 flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`rune-${currentSlide}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 1.5 }}
                        className="text-amber-300 text-[150px] md:text-[220px] font-thin"
                    >
                        {slide.rune}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* STORY CONTENT */}
            <div className="relative z-20 px-8 md:px-16 pb-8 max-w-3xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span
                                className="text-amber-500/70 text-[11px] tracking-[0.4em] uppercase font-bold"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                {slide.chapterTitle}
                            </span>
                            <div className="flex-1 h-px bg-amber-500/20" />
                        </div>
                        <p
                            className="text-white/80 text-xl md:text-3xl font-light italic leading-[1.6] antialiased"
                            style={{
                                fontFamily: "'Crimson Pro', serif",
                                textShadow: "0 2px 15px rgba(0,0,0,0.5)"
                            }}
                        >
                            "{slide.text}"
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* SLIDE DOTS */}
            <div className="relative z-10 flex justify-center gap-3 pb-8">
                {storySlides.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? "w-8 bg-amber-500" : "w-1 bg-amber-900"
                            }`}
                    />
                ))}
            </div>

            {/* PROGRESS BAR */}
            <div className="relative z-10 w-full px-8 pb-12">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                        />
                        <span
                            className="text-[9px] text-amber-500/60 tracking-[0.3em] uppercase font-bold"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Giải mã thông điệp...
                        </span>
                    </div>
                    <span className="text-[10px] text-white/20 font-mono tracking-widest">{progress}%</span>
                </div>

                <div className="h-[1px] w-full bg-white/5 relative">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-900 via-amber-500 to-amber-200"
                        style={{ width: `${progress}%` }}
                    />
                    {/* Glow effect at the tip */}
                    <motion.div
                        className="absolute top-[-2px] w-4 h-1 bg-amber-300 blur-sm"
                        style={{ left: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};