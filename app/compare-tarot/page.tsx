"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Scale, Compass, Star, Binary, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CompareTarotPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden relative">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[70vw] h-[70vw] bg-indigo-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-rose-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-[40px] h-[40px] flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-75 group-hover:scale-105 transition-transform duration-700" />
                <Image src="/logo.png" alt="Mystic Tarot Logo" width={40} height={40} className="relative z-10 transition-transform duration-500 group-hover:rotate-3 rounded-full shadow-lg shadow-amber-500/20" />
            </div>
            <span className="font-bold text-lg text-white tracking-tighter">Mystic<span className="text-amber-500"> Tarot</span></span>
          </Link>
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Về trang chủ
          </Link>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-white mb-4">
              Tarot & Các Bộ Môn <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Huyền Học Khác</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-slate-400 max-w-2xl mx-auto">
              Mỗi bộ môn đều có thế mạnh riêng. Hiểu rõ sự khác biệt để lựa chọn phương pháp phù hợp nhất với vấn đề của bạn.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CARD 1: VS TỬ VI / HOÀNG ĐẠO */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#130823]/60 border border-white/10 rounded-[2rem] p-8 hover:border-blue-500/30 transition-all group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                    <Star className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">So với Cung Hoàng Đạo</h3>
                <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-wider">Astrology / Horoscope</p>
                
                <div className="space-y-4 text-sm text-slate-300">
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                        <strong className="text-blue-300 block mb-1">Cung Hoàng Đạo:</strong>
                        Thiên về tính cách bẩm sinh, xu hướng dài hạn và sự tương tác giữa các hành tinh. Mang tính cố định cao hơn.
                    </div>
                    <div className="p-4 bg-amber-900/10 rounded-xl border border-amber-500/20">
                        <strong className="text-amber-400 block mb-1">Tarot:</strong>
                        Tập trung vào <strong>năng lượng hiện tại</strong> và tình huống cụ thể. Tarot linh hoạt hơn và cho thấy kết quả có thể thay đổi dựa trên hành động của bạn.
                    </div>
                </div>
            </motion.div>

            {/* CARD 2: VS TỬ VI ĐÔNG PHƯƠNG */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-[#130823]/60 border border-white/10 rounded-[2rem] p-8 hover:border-red-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
                
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 text-red-400 group-hover:scale-110 transition-transform">
                    <Compass className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">So với Tử Vi</h3>
                <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-wider">Eastern Horoscope</p>
                
                <div className="space-y-4 text-sm text-slate-300">
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                        <strong className="text-red-300 block mb-1">Tử Vi:</strong>
                        Dựa trên giờ sinh tháng đẻ cố định. Vẽ ra bản đồ cuộc đời (Lá số) với các đại vận, tiểu hạn mang tính định mệnh cao.
                    </div>
                    <div className="p-4 bg-amber-900/10 rounded-xl border border-amber-500/20">
                        <strong className="text-amber-400 block mb-1">Tarot:</strong>
                        Là "tấm ảnh chụp nhanh" (snapshot) của thời điểm hiện tại. Tarot trả lời tốt nhất cho các câu hỏi ngắn hạn (3-6 tháng) và <strong>cách giải quyết vấn đề</strong>.
                    </div>
                </div>
            </motion.div>

            {/* CARD 3: VS THẦN SỐ HỌC */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-[#130823]/60 border border-white/10 rounded-[2rem] p-8 hover:border-green-500/30 transition-all group">
                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                    <Binary className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">So với Thần Số Học</h3>
                <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-wider">Numerology</p>
                
                <div className="space-y-4 text-sm text-slate-300">
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                        <strong className="text-green-300 block mb-1">Thần Số Học:</strong>
                        Dựa vào Tên và Ngày sinh để phân tích bài học đường đời, sứ mệnh và các chu kỳ năm cá nhân. Mang tính tổng quát.
                    </div>
                    <div className="p-4 bg-amber-900/10 rounded-xl border border-amber-500/20">
                        <strong className="text-amber-400 block mb-1">Tarot:</strong>
                        Đi sâu vào chi tiết của một sự việc cụ thể (Ví dụ: "Anh ấy nghĩ gì về tôi?", "Có nên đổi việc lúc này?"). Thần số học ít khi trả lời được các câu hỏi tình huống này.
                    </div>
                </div>
            </motion.div>

          </div>

          {/* SUMMARY TABLE */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mt-16 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12 text-center">
             <h2 className="text-2xl font-bold text-white mb-8">Tóm lại, khi nào nên chọn Tarot?</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    "Khi bạn đang phân vân giữa các lựa chọn",
                    "Khi cần lời khuyên cho mối quan hệ hiện tại",
                    "Khi muốn biết kết quả ngắn hạn của dự án",
                    "Khi cần chữa lành và soi rọi nội tâm"
                ].map((text, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                        <CheckCircle2 className="w-8 h-8 text-amber-500" />
                        <span className="text-sm text-slate-300">{text}</span>
                    </div>
                ))}
             </div>
             
             <div className="mt-10">
                <Link href="/booking">
                    <button className="px-12 py-4 bg-white text-black font-black rounded-xl hover:bg-slate-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        Đặt lịch xem Tarot ngay
                    </button>
                </Link>
             </div>
          </motion.div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#050505] py-12 mt-20 relative z-10 text-center">
        <p className="text-slate-600 text-[10px] font-bold tracking-[0.3em] uppercase">
            © 2026 MYSTIC TAROT.
        </p>
      </footer>
    </div>
  );
}