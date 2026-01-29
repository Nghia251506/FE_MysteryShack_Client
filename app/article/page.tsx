'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, Clock, User, 
  Share2, Bookmark, ChevronLeft, 
  MessageCircle, Eye, Star
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; 
import { motion } from 'framer-motion';

// --- REDUX & AUTH (Giữ nguyên logic từ Home) ---
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
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* 1. HIỆU ỨNG NỀN (Đồng nhất với Home) */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] bg-amber-900/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        
        {/* BREADCRUMB & BACK BUTTON */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Quay lại trang chủ</span>
          </Link>
        </motion.div>

        {/* 2. ARTICLE HEADER */}
        <section className="space-y-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
              {article.category}
            </span>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tighter">
              {article.title}
            </h1>

            <p className="text-xl text-slate-400 italic font-light leading-relaxed border-l-2 border-amber-500/30 pl-6">
              "{article.excerpt}"
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold">
                  {article.author.charAt(0)}
                </div>
                <span className="text-slate-300 font-bold">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {article.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {article.readTime}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" /> {article.views} lượt xem
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/20"
          >
            <Image 
              src={article.image} 
              alt="Tarot Art" 
              fill 
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
          </motion.div>
        </section>

        {/* 3. ARTICLE CONTENT (Typography focused) */}
        <article className="prose prose-invert prose-amber max-w-none">
          <div className="space-y-8 text-slate-300 leading-relaxed text-lg font-light">
            <p>
              Trong thế giới của Tarot, <strong>The Fool (Kẻ Khờ)</strong> được đánh số 0 - con số của tiềm năng vô hạn. Anh ta đứng ở rìa một vách đá, mắt hướng về phía bầu trời, không phải vì sự bất cẩn, mà vì một niềm tin tuyệt đối vào hành trình phía trước.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-3">
              <Sparkles className="text-amber-500 w-6 h-6" /> Biểu tượng của sự tự do
            </h2>
            
            <p>
              Chiếc túi nhỏ trên vai chứa đựng những kinh nghiệm quá khứ mà anh ta không còn bận tâm, bông hồng trắng trên tay đại diện cho sự thuần khiết của tâm hồn. Chú chó đồng hành là tiếng nói của bản năng đang cảnh báo, nhưng bước chân của Kẻ Khờ vẫn nhẹ tênh như không trọng lực.
            </p>

            {/* Highlight Box */}
            <div className="p-8 my-12 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 bg-amber-500/5 blur-3xl rounded-full group-hover:bg-amber-500/10 transition-colors" />
              <h4 className="text-amber-500 font-bold mb-4 uppercase tracking-tighter">Lời khuyên từ lá bài:</h4>
              <p className="text-white text-xl font-medium leading-relaxed">
                "Đừng sợ hãi khi phải bắt đầu lại từ đầu. Đôi khi, việc 'không biết gì' lại chính là sức mạnh lớn nhất để bạn đón nhận những phép màu mà lý trí không bao giờ hiểu được."
              </p>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Ý nghĩa trong các khía cạnh</h2>
            <ul className="space-y-4 list-none p-0">
              <li className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                </div>
                <div>
                  <strong className="text-white block mb-1">Tình duyên:</strong> Một mối quan hệ mới đầy bất ngờ, cần sự cởi mở và không định kiến.
                </div>
              </li>
              <li className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div>
                  <strong className="text-white block mb-1">Sự nghiệp:</strong> Thời điểm thích hợp để khởi nghiệp hoặc chuyển hướng sang một lĩnh vực hoàn toàn mới.
                </div>
              </li>
            </ul>
          </div>
        </article>

        {/* 4. SHARE & INTERACTION */}
        <section className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all">
              <Share2 className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold">Chia sẻ</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold">Lưu bài viết</span>
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                   U{i}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#050505] bg-amber-600 flex items-center justify-center text-[10px] font-bold text-white">
                +12
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium italic">Đang thảo luận sôi nổi...</p>
          </div>
        </section>

        {/* 5. RELATED ARTICLES (Card Style từ Home) */}
        <section className="mt-32">
          <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
            <Star className="text-amber-500 w-5 h-5" /> Bài viết liên quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((item) => (
              <div key={item} className="group p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all duration-500">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 relative">
                   <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                   <Image 
                    src="https://tarot.vn/wp-content/uploads/2015/06/cach-thuc-thanh-tay-bo-bai-tarot.jpg" 
                    alt="Related" 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <h4 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">Cách thanh tẩy bộ bài Tarot mới mua</h4>
                <p className="text-slate-500 text-sm line-clamp-2">Tìm hiểu các phương pháp thanh tẩy bằng muối, đá thạch anh hoặc năng lượng mặt trăng...</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CALL TO ACTION (Tái sử dụng style từ Home) */}
        <section className="mt-32 text-center p-12 rounded-[3rem] bg-gradient-to-b from-amber-500/10 to-transparent border border-white/5">
           <h2 className="text-3xl font-bold text-white mb-6">Bạn đang trăn trở về hành trình của mình?</h2>
           <p className="text-slate-400 mb-10 max-w-lg mx-auto">Hãy để các Reader của chúng tôi giúp bạn giải mã những thông điệp mà vũ trụ đang gửi gắm.</p>
           <Link href="/tarot-draw">
              <button className="px-10 py-4 bg-amber-600 hover:bg-amber-500 text-black font-black rounded-2xl transition-all hover:scale-105 shadow-xl shadow-amber-900/20">
                Đặt Lịch Tham Vấn Ngay
              </button>
           </Link>
        </section>

      </main>
    </div>
  );
}