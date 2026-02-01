"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Layers, Eye, ArrowRight, ArrowLeft } from "lucide-react";

// --- IMPORT HEADER & FOOTER ĐÃ TÁCH ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialFloating from "@/components/SocialFloating";

export default function WhatIsTarotPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col relative">
      
      {/* 1. HEADER ĐỒNG BỘ TOÀN TRANG */}
      <Header />

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 flex-grow py-16 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* BREADCRUMB - Thay thế nút quay lại cũ cho tinh tế */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-amber-500 flex items-center gap-2 transition-colors uppercase tracking-widest">
              <ArrowLeft className="w-3 h-3" /> Quay lại trang chủ
            </Link>
          </motion.div>

          {/* HERO TITLE */}
          <div className="text-center mb-16 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Kiến thức căn bản
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Tarot Là Gì? <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">Tấm Gương Phản Chiếu</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-light italic">
              "Không đơn thuần là bói toán, Tarot là ngôn ngữ của linh hồn giúp bạn trò chuyện với chính tiềm thức của mình."
            </motion.p>
          </div>

          {/* CONTENT BLOCKS */}
          <div className="space-y-12">
            
            {/* Block 1: Định nghĩa */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#130823]/60 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><BookOpen className="w-6 h-6" /></div>
                    <h2 className="text-2xl font-bold text-white mt-2">Nguồn gốc & Ý nghĩa</h2>
                </div>
                <div className="space-y-4 text-slate-300 leading-relaxed text-justify relative z-10">
                    <p>
                        Tarot là một bộ bài gồm <strong>78 lá</strong>, xuất hiện từ giữa thế kỷ 15 tại châu Âu. Ban đầu được dùng để chơi bài, nhưng đến thế kỷ 18, nó bắt đầu được sử dụng cho mục đích huyền học và bói toán.
                    </p>
                    <p>
                        Ngày nay, Tarot được xem như một công cụ <strong>"Phản chiếu" (Reflection)</strong>. Nó không quyết định số phận thay bạn, mà giúp bạn nhìn rõ bức tranh toàn cảnh của vấn đề, từ đó đưa ra quyết định sáng suốt nhất dựa trên nguyên lý của nhà tâm lý học Carl Jung.
                    </p>
                </div>
            </motion.section>

            {/* Block 2: Cấu trúc */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-[#130823]/40 border border-white/10 rounded-[2rem] p-8 hover:border-purple-500/30 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4 text-purple-400 group-hover:scale-105 transition-transform">
                        <Layers className="w-5 h-5" />
                        <h3 className="text-xl font-bold">Bộ Ẩn Chính (Major Arcana)</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Gồm <strong>22 lá</strong> (từ The Fool đến The World). Đại diện cho những bài học nghiệp quả lớn, những sự kiện trọng đại hoặc các giai đoạn chuyển hóa tâm thức quan trọng.
                    </p>
                </div>
                <div className="group bg-[#130823]/40 border border-white/10 rounded-[2rem] p-8 hover:border-amber-500/30 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4 text-amber-400 group-hover:scale-105 transition-transform">
                        <Layers className="w-5 h-5" />
                        <h3 className="text-xl font-bold">Bộ Ẩn Phụ (Minor Arcana)</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Gồm <strong>56 lá</strong>, chia làm 4 nhóm (Gậy, Ly, Kiếm, Tiền). Phản ánh các sự kiện đời thường, cảm xúc hàng ngày và các mối quan hệ xã hội chi tiết.
                    </p>
                </div>
            </motion.section>

            {/* Block 3: Giá trị */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center shadow-xl">
                <Eye className="w-10 h-10 text-white/20 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">Giá trị cốt lõi</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="p-4 space-y-2">
                        <h4 className="font-bold text-amber-400">Thấu hiểu</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Nhìn nhận điểm mạnh, điểm yếu và những nỗi sợ tiềm ẩn bên trong.</p>
                    </div>
                    <div className="p-4 border-y md:border-y-0 md:border-x border-white/5 space-y-2">
                        <h4 className="font-bold text-amber-400">Chữa lành</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Giải tỏa những nút thắt trong lòng và tìm lại sự bình yên nội tại.</p>
                    </div>
                    <div className="p-4 space-y-2">
                        <h4 className="font-bold text-amber-400">Định hướng</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Dự báo các xu hướng sắp tới để bạn có sự chuẩn bị tâm thế tốt nhất.</p>
                    </div>
                </div>
            </motion.section>

            {/* CTA */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex justify-center pt-8 pb-12">
                <Link href="/tarot-draw">
                    <button className="group relative px-12 py-5 bg-white text-black font-black rounded-2xl overflow-hidden hover:scale-105 transition-all flex items-center gap-3">
                        <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors uppercase">
                          Trải nghiệm ngay <ArrowRight className="w-5 h-5" />
                        </span>
                    </button>
                </Link>
            </motion.div>

          </div>
        </div>
      </main>

      {/* 2. FOOTER ĐÃ ĐỒNG BỘ */}
      <Footer />
      <SocialFloating/>
    </div>
  );
}