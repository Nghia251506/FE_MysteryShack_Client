'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, Clock, Share2, 
  Bookmark, ChevronLeft, Eye, Star, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; 
import { motion } from 'framer-motion';

// --- IMPORT HEADER & FOOTER ĐỒNG BỘ ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialFloating from "@/components/SocialFloating";

// --- REDUX (Nếu cần dùng thông tin user để lưu bài viết) ---
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function TarotArticle() {
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Giả lập dữ liệu bài viết
  const article = {
    category: "Kiến Thức Tarot",
    title: "Ý Nghĩa The Fool: Hành Trình Của Kẻ Khờ Và Sự Khởi Đầu Mới",
    author: "Master Elara",
    date: "25 Tháng 1, 2026",
    readTime: "8 phút đọc",
    views: "1,240",
    excerpt: "Lá bài The Fool không đơn thuần là sự ngây ngô. Đó là biểu tượng của lòng dũng cảm, sự tin tưởng tuyệt đối vào vũ trụ và bước chân đầu tiên vào hành trình tâm linh vô định.",
    image: "https://mystichouse.vn/wp-content/uploads/2012/10/The-Fool.jpg"
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col relative">
      
      {/* 1. HEADER ĐỒNG BỘ */}
      <Header />

      {/* 2. HIỆU ỨNG NỀN */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] bg-amber-900/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* 3. MAIN CONTENT */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24 flex-grow">
        
        {/* BREADCRUMB */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/" className="group inline-flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Quay lại trang chủ</span>
          </Link>
        </motion.div>

        {/* ARTICLE HEADER */}
        <section className="space-y-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
              {article.category}
            </span>
            
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
              {article.title}
            </h1>

            <p className="text-xl text-slate-400 italic font-light leading-relaxed border-l-2 border-amber-500/30 pl-6">
              "{article.excerpt}"
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5 text-slate-500 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white font-black text-[10px]">
                  {article.author.charAt(0)}
                </div>
                <span className="text-slate-300 font-bold">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> {article.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> {article.readTime}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" /> {article.views} lượt xem
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
          >
            <Image 
              src={article.image} 
              alt="Tarot Art" 
              fill 
              className="object-cover transition-transform duration-1000 hover:scale-105"
              priority
            />
          </motion.div>
        </section>

        {/* ARTICLE CONTENT */}
        <article className="prose prose-invert prose-amber max-w-none">
          <div className="space-y-8 text-slate-300 leading-relaxed text-lg font-light text-justify">
            <p>
              Trong thế giới của Tarot, <strong>The Fool (Kẻ Khờ)</strong> được đánh số 0 - con số của tiềm năng vô hạn. Anh ta đứng ở rìa một vách đá, mắt hướng về phía bầu trời, không phải vì sự bất cẩn, mà vì một niềm tin tuyệt đối vào hành trình phía trước.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-3 tracking-tight">
              <Sparkles className="text-amber-500 w-6 h-6" /> Biểu tượng của sự tự do
            </h2>
            
            <p>
              Chiếc túi nhỏ trên vai chứa đựng những kinh nghiệm quá khứ mà anh ta không còn bận tâm, bông hồng trắng trên tay đại diện cho sự thuần khiết của tâm hồn. Chú chó đồng hành là tiếng nói của bản năng đang cảnh báo, nhưng bước chân của Kẻ Khờ vẫn nhẹ tênh như không trọng lực.
            </p>

            {/* Highlight Box */}
            <div className="p-10 my-12 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 bg-amber-500/5 blur-3xl rounded-full" />
              <h4 className="text-amber-500 font-black mb-4 uppercase tracking-[0.2em] text-[10px]">Lời khuyên tâm linh:</h4>
              <p className="text-white text-2xl font-serif leading-relaxed italic">
                "Đừng sợ hãi khi phải bắt đầu lại từ đầu. Đôi khi, việc 'không biết gì' lại chính là sức mạnh lớn nhất."
              </p>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6 tracking-tight">Ý nghĩa trong các khía cạnh</h2>
            <div className="grid grid-cols-1 gap-4 not-prose">
              <div className="flex gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/10 flex-shrink-0 flex items-center justify-center text-pink-500">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <strong className="text-white block mb-1">Tình duyên:</strong> 
                  <span className="text-slate-400 text-sm">Một mối quan hệ mới đầy bất ngờ, cần sự cởi mở và không định kiến để cảm nhận trọn vẹn.</span>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex-shrink-0 flex items-center justify-center text-blue-500">
                  <Sparkles className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <strong className="text-white block mb-1">Sự nghiệp:</strong> 
                  <span className="text-slate-400 text-sm">Thời điểm vàng để khởi nghiệp hoặc thực hiện những ý tưởng táo bạo mà bạn hằng ấp ủ.</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* SHARE & INTERACTION */}
        <section className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-xs font-bold uppercase tracking-widest">
              <Share2 className="w-3.5 h-3.5 text-amber-500" /> Chia sẻ
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-xs font-bold uppercase tracking-widest">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" /> Lưu bài
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#050505] bg-slate-800 flex items-center justify-center text-[10px] font-black">
                   U{i}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">12 người khác đang thảo luận</p>
          </div>
        </section>

        {/* RELATED ARTICLES */}
        <section className="mt-32">
          <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tighter flex items-center gap-3">
            <Star className="text-amber-500 w-5 h-5" /> Bài viết liên quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((item) => (
              <div key={item} className="group p-6 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:border-amber-500/30 transition-all duration-500">
                <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-6 relative">
                   <Image 
                    src="https://tarot.vn/wp-content/uploads/2015/06/cach-thuc-thanh-tay-bo-bai-tarot.jpg" 
                    alt="Related" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                  />
                </div>
                <h4 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">Cách thanh tẩy bộ bài Tarot mới</h4>
                <p className="text-slate-500 text-sm line-clamp-2 font-light">Tìm hiểu các phương pháp thanh tẩy bằng muối, đá thạch anh...</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-32 text-center p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full translate-y-1/2" />
           <h2 className="text-3xl font-black text-white mb-6 relative z-10">Bạn đang trăn trở về hành trình?</h2>
           <p className="text-slate-400 mb-10 max-w-lg mx-auto relative z-10 font-light italic">"Hãy để các Reader giúp bạn giải mã những thông điệp mà vũ trụ đang gửi gắm."</p>
           <Link href="/tarot-draw" className="relative z-10 inline-block">
              <button className="group px-10 py-4 bg-white text-black font-black rounded-2xl transition-all hover:scale-105 flex items-center gap-3 uppercase text-sm">
                Đặt Lịch Tham Vấn <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
           </Link>
        </section>

      </main>

      {/* 4. FOOTER ĐỒNG BỘ */}
      <Footer />
      <SocialFloating/>
    </div>
  );
}