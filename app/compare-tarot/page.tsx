"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Scale, Compass, Star, Binary, 
  ArrowLeft, CheckCircle2, ArrowRight 
} from "lucide-react";

// --- IMPORT CÁC COMPONENT HỆ THỐNG ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialFloating from '@/components/SocialFloating';

export default function CompareTarotPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col relative">
      
      {/* 1. HEADER ĐỒNG BỘ */}
      <Header />

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[70vw] h-[70vw] bg-indigo-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-rose-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 py-16 px-6 flex-grow max-w-6xl mx-auto w-full">
        
        {/* Nút quay lại tinh tế */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/" className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quay lại</span>
          </Link>
        </motion.div>

        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Scale className="w-3 h-3" /> So sánh bộ môn
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight"
          >
            Tarot & Các Bộ Môn <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-rose-400 italic">
               Huyền Học Khác
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.1 }} 
            className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed"
          >
            Mỗi phương pháp là một lăng kính soi rọi tâm hồn. Hiểu rõ sự khác biệt để tìm thấy câu trả lời chính xác nhất cho hành trình của bạn.
          </motion.p>
        </div>

        {/* --- COMPARISON CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          
          {/* CARD 1: VS CUNG HOÀNG ĐẠO */}
          <ComparisonCard 
            icon={Star} 
            title="So với Chiêm Tinh" 
            subtitle="Astrology / Horoscope"
            color="blue"
            delay={0.1}
            leftTitle="Chiêm Tinh Học"
            leftContent="Thiên về tính cách bẩm sinh, xu hướng dài hạn và sự tương tác giữa các hành tinh. Mang tính cố định và bao quát."
            rightTitle="Tarot"
            rightContent="Tập trung vào năng lượng hiện tại và tình huống cụ thể. Tarot linh hoạt hơn, soi rọi những ngóc ngách tâm lý tức thời."
          />

          {/* CARD 2: VS TỬ VI */}
          <ComparisonCard 
            icon={Compass} 
            title="So với Tử Vi" 
            subtitle="Eastern Horoscope"
            color="rose"
            delay={0.2}
            leftTitle="Tử Vi Đông Phương"
            leftContent="Dựa trên giờ sinh cố định để vẽ ra bản đồ cuộc đời với các đại vận, tiểu hạn mang tính định mệnh cao."
            rightTitle="Tarot"
            rightContent="Là 'tấm ảnh chụp nhanh' của hiện tại. Trả lời tốt cho câu hỏi ngắn hạn (3-6 tháng) và gợi ý cách giải quyết vấn đề."
          />

          {/* CARD 3: VS THẦN SỐ HỌC */}
          <ComparisonCard 
            icon={Binary} 
            title="So với Thần Số Học" 
            subtitle="Numerology"
            color="green"
            delay={0.3}
            leftTitle="Thần Số Học"
            leftContent="Dựa vào Tên và Ngày sinh để phân tích bài học đường đời, sứ mệnh. Mang tính quy luật và tổng quát."
            rightTitle="Tarot"
            rightContent="Đi sâu vào chi tiết cụ thể: 'Anh ấy nghĩ gì?', 'Có nên đổi việc?'. Tarot lấp đầy những khoảng trống mà con số chưa nói hết."
          />

        </div>

        {/* --- SUMMARY BOX --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-8 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px]" />
          <h2 className="text-3xl font-black text-white mb-10 tracking-tight uppercase">Khi nào bạn nên chọn Tarot?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {[
              "Đang phân vân giữa các lựa chọn cụ thể",
              "Cần thấu hiểu cảm xúc của đối phương",
              "Muốn biết xu hướng ngắn hạn của dự án",
              "Cần chữa lành và soi rọi nội tâm sâu sắc"
            ].map((text, i) => (
              <div key={i} className="flex gap-4 p-5 bg-black/40 rounded-3xl border border-white/5 group hover:border-amber-500/30 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-slate-400 leading-snug">{text}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-16">
            <Link href="/tarot-draw">
              <button className="group px-12 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto uppercase text-sm tracking-tighter">
                Bắt đầu rút bài ngay <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </motion.div>

      </main>

      {/* 2. FOOTER ĐỒNG BỘ */}
      <Footer />

      {/* 3. SOCIAL FLOATING */}
      <SocialFloating />
    </div>
  );
}

// --- HELPER COMPONENT CHO CARD SO SÁNH ---
const ComparisonCard = ({ icon: Icon, title, subtitle, color, delay, leftTitle, leftContent, rightTitle, rightContent }: any) => {
  const colorMap: any = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ delay }} 
      className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 hover:border-white/20 transition-all group flex flex-col"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${colorMap[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{title}</h3>
      <p className="text-[10px] text-slate-500 mb-8 font-black uppercase tracking-[0.2em]">{subtitle}</p>
      
      <div className="space-y-4 flex-grow">
        <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 group-hover:bg-transparent transition-colors">
          <strong className="text-slate-200 text-xs block mb-2 uppercase tracking-widest">{leftTitle}:</strong>
          <p className="text-slate-500 text-sm font-light leading-relaxed">{leftContent}</p>
        </div>
        <div className="p-5 bg-amber-500/[0.03] rounded-2xl border border-amber-500/10 group-hover:bg-amber-500/[0.05] transition-colors">
          <strong className="text-amber-500 text-xs block mb-2 uppercase tracking-widest">{rightTitle}:</strong>
          <p className="text-slate-300 text-sm font-light leading-relaxed">{rightContent}</p>
        </div>
      </div>
    </motion.div>
  );
};