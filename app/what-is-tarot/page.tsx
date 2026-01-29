"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Layers, Eye, ArrowRight, ArrowLeft } from "lucide-react";

export default function WhatIsTarotPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden relative">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-[40px] h-[40px] flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-75 group-hover:scale-105 transition-transform duration-700" />
                <Image src="/logo.png" alt="Mystic Tarot Logo" width={40} height={40} className="relative z-10 transition-transform duration-500 group-hover:rotate-3 rounded-full shadow-lg shadow-amber-500/20" />
            </div>
            <span className="font-bold text-lg text-white tracking-tighter">Mystic<span className="text-amber-500"> Tarot</span></span>
          </Link>
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
          </Link>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* HERO TITLE */}
          <div className="text-center mb-16 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Kiến thức căn bản
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Tarot Là Gì? <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">Tấm Gương Phản Chiếu Tâm Hồn</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Không đơn thuần là bói toán, Tarot là công cụ tâm lý học giúp kết nối với tiềm thức và định hướng tương lai.
            </motion.p>
          </div>

          {/* CONTENT BLOCKS */}
          <div className="space-y-12">
            
            {/* Block 1: Định nghĩa */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#130823]/60 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><BookOpen className="w-6 h-6" /></div>
                    <h2 className="text-2xl font-bold text-white mt-2">Nguồn gốc & Ý nghĩa</h2>
                </div>
                <div className="space-y-4 text-slate-300 leading-relaxed text-justify">
                    <p>
                        Tarot là một bộ bài gồm <strong>78 lá</strong>, xuất hiện từ giữa thế kỷ 15 tại châu Âu. Ban đầu được dùng để chơi bài, nhưng đến thế kỷ 18, nó bắt đầu được sử dụng cho mục đích huyền học và bói toán.
                    </p>
                    <p>
                        Ngày nay, Tarot được xem như một công cụ <strong>"Phản chiếu" (Reflection)</strong>. Nó không quyết định số phận thay bạn, mà giúp bạn nhìn rõ bức tranh toàn cảnh của vấn đề, từ đó đưa ra quyết định sáng suốt nhất. Nó hoạt động dựa trên nguyên lý "Đồng hiện" (Synchronicity) của nhà tâm lý học Carl Jung.
                    </p>
                </div>
            </motion.section>

            {/* Block 2: Cấu trúc */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#130823]/40 border border-white/10 rounded-[2rem] p-8 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4 text-purple-400">
                        <Layers className="w-5 h-5" />
                        <h3 className="text-xl font-bold">Bộ Ẩn Chính (Major Arcana)</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Gồm <strong>22 lá</strong> (từ The Fool đến The World). Đại diện cho những bài học nghiệp quả lớn, những sự kiện trọng đại hoặc các giai đoạn chuyển hóa tâm thức quan trọng trong cuộc đời con người.
                    </p>
                </div>
                <div className="bg-[#130823]/40 border border-white/10 rounded-[2rem] p-8 hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4 text-amber-400">
                        <Layers className="w-5 h-5" />
                        <h3 className="text-xl font-bold">Bộ Ẩn Phụ (Minor Arcana)</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Gồm <strong>56 lá</strong>, chia làm 4 nhóm (Gậy, Ly, Kiếm, Tiền). Phản ánh các sự kiện đời thường, cảm xúc hàng ngày, công việc và các mối quan hệ xã hội chi tiết hơn.
                    </p>
                </div>
            </motion.section>

            {/* Block 3: Giá trị */}
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center">
                <Eye className="w-10 h-10 text-white/50 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">Tại sao nên xem Tarot?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="p-4">
                        <h4 className="font-bold text-white mb-2">Thấu hiểu bản thân</h4>
                        <p className="text-xs text-slate-400">Nhìn nhận điểm mạnh, điểm yếu và những nỗi sợ tiềm ẩn.</p>
                    </div>
                    <div className="p-4 border-l border-white/10 border-r">
                        <h4 className="font-bold text-white mb-2">Chữa lành cảm xúc</h4>
                        <p className="text-xs text-slate-400">Giải tỏa những nút thắt trong lòng và tìm lại sự bình yên.</p>
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-white mb-2">Định hướng tương lai</h4>
                        <p className="text-xs text-slate-400">Dự báo các xu hướng sắp tới để bạn chuẩn bị tốt nhất.</p>
                    </div>
                </div>
            </motion.section>

            {/* CTA */}
            <div className="flex justify-center pt-8">
                <Link href="/tarot-draw">
                    <button className="px-10 py-4 bg-gradient-to-r from-amber-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                        Trải nghiệm ngay <ArrowRight className="w-5 h-5" />
                    </button>
                </Link>
            </div>

          </div>
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