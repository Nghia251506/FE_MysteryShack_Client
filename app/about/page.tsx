"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Sparkles, Heart, Target, 
  Users, Code, Headphones, ArrowRight,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

// --- IMPORT HEADER & FOOTER ĐỒNG BỘ ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialFloating from "@/components/SocialFloating";

export default function AboutUsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col relative">
      
      <Header />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex-grow">
        
        {/* --- HERO SECTION --- */}
        <section className="text-center mb-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-8"
            >
                <Sparkles className="w-4 h-4" /> Câu chuyện của chúng tôi
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight"
            >
                Kiến tạo không gian <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-400">
                    Thấu cảm & Định hướng
                </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed font-light"
            >
                Mystic Tarot không chỉ là một website rút bài. Chúng tôi là cầu nối số, nơi tri thức cổ xưa gặp gỡ công nghệ hiện đại.
            </motion.p>
        </section>

        {/* --- SỨ MỆNH & TẦM NHÌN --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-40">
            <motion.div 
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10"
            >
                <Target className="w-12 h-12 text-amber-500 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">Sứ mệnh với Khách hàng</h2>
                <p className="text-slate-400 leading-relaxed text-justify">
                  Chúng tôi nỗ lực tạo ra một môi trường tham vấn **An toàn - Bảo mật - Minh bạch**. Mỗi lá bài là một lời gợi mở, giúp bạn xoa dịu tâm hồn và có thêm góc nhìn khách quan.
                </p>
            </motion.div>
            <motion.div 
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10"
            >
                <Heart className="w-12 h-12 text-purple-500 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">Sứ mệnh với Reader</h2>
                <p className="text-slate-400 leading-relaxed text-justify">
                  Mystic Tarot là "ngôi nhà chung" cho các Reader chuyên nghiệp. Chúng tôi cung cấp hạ tầng công nghệ tối ưu để các Reader tập trung hoàn toàn vào sự thấu cảm.
                </p>
            </motion.div>
        </section>

        {/* --- ĐỘI NGŨ VẬN HÀNH --- */}
        <section className="mb-40">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight uppercase">Những người đứng sau "Cánh cổng"</h2>
                <p className="text-slate-500">Đội ngũ tận tâm đảm bảo trải nghiệm của bạn luôn tuyệt vời nhất.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. HỘI ĐỒNG QUẢN TRỊ (2 NGƯỜI) */}
                <TeamCard 
                    icon={ShieldCheck} 
                    title="Hội đồng Quản trị" 
                    desc="Định hướng chiến lược và kiểm soát chất lượng đạo đức nghề nghiệp trên nền tảng."
                    color="amber"
                    images={[
                        "/team/tech1.jpg", // Thay link ảnh thực tế của ông vào đây
                        "/team/tech3.jpg"
                    ]}
                />

                {/* 2. ĐỘI NGŨ KỸ THUẬT (3 NGƯỜI) */}
                <TeamCard 
                    icon={Code} 
                    title="Đội ngũ Kỹ thuật" 
                    desc="Các pháp sư code duy trì hệ thống vận hành 24/7 với bảo mật SSL cao nhất."
                    color="purple"
                    images={[
                        "/team/tech1.jpg", 
                        "/team/tech2.jpg",
                        "/team/tech3.jpg"
                    ]}
                />

                {/* 3. BỘ PHẬN HỖ TRỢ (2 NGƯỜI) */}
                <TeamCard 
                    icon={Headphones} 
                    title="Bộ phận Hỗ trợ" 
                    desc="Luôn lắng nghe và đồng hành cùng khách hàng trong mọi vấn đề giao dịch."
                    color="blue"
                    images={[
                        "/team/tech3.jpg",
                        "/team/tech2.jpg",
                    ]}
                />
            </div>
        </section>

        {/* --- GIÁ TRỊ CỐT LÕI --- */}
        <section className="mb-40 p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px]" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <div className="text-4xl font-black text-amber-500">01.</div>
                    <h3 className="text-xl font-bold text-white uppercase">Chân thực</h3>
                    <p className="text-sm text-slate-500">Không thổi phồng, không mê tín. Chúng tôi tôn trọng sự thật.</p>
                </div>
                <div className="space-y-4">
                    <div className="text-4xl font-black text-purple-500">02.</div>
                    <h3 className="text-xl font-bold text-white uppercase">Bảo mật</h3>
                    <p className="text-sm text-slate-500">Mọi phiên trải bài đều được mã hóa tuyệt đối.</p>
                </div>
                <div className="space-y-4">
                    <div className="text-4xl font-black text-blue-500">03.</div>
                    <h3 className="text-xl font-bold text-white uppercase">Cộng đồng</h3>
                    <p className="text-sm text-slate-500">Xây dựng cộng đồng Tarot văn minh tại Việt Nam.</p>
                </div>
            </div>
        </section>

        {/* --- CTA --- */}
        <section className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter">Sẵn sàng kết nối?</h2>
            <button 
                onClick={() => router.push('/tarot-draw')}
                className="group relative px-16 py-6 bg-white text-black font-black rounded-3xl overflow-hidden hover:scale-105 transition-all inline-flex items-center gap-4 uppercase tracking-tighter shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
                <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                    Trải nghiệm ngay <ArrowRight className="w-6 h-6" />
                </span>
            </button>
        </section>

      </main>

      <Footer />
      <SocialFloating/>
    </div>
  );
}

// --- TEAM CARD COMPONENT (WITH IMAGE AVATARS) ---
const TeamCard = ({ icon: Icon, title, desc, color, images }: { icon: any, title: string, desc: string, color: string, images: string[] }) => {
    const colorMap: any = {
        amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 flex flex-col items-center text-center group transition-all duration-500 hover:bg-white/[0.02]"
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 group-hover:scale-110 ${colorMap[color]}`}>
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">{desc}</p>
            
            {/* HIỂN THỊ ẢNH ANH EM TEAM */}
            <div className="flex -space-x-4">
                {images.map((imgSrc, index) => (
                    <motion.div 
                        key={index}
                        whileHover={{ y: -10, zIndex: 50, scale: 1.1 }}
                        className="relative w-14 h-14 rounded-full border-4 border-[#050505] overflow-hidden bg-slate-800 shadow-xl"
                    >
                        <Image 
                            src={imgSrc} 
                            alt={`${title} member`}
                            fill
                            className="object-cover"
                            // Fallback nếu chưa có ảnh thực tế
                            onError={(e: any) => {
                                e.target.src = "https://ui-avatars.com/api/?background=333&color=fff&name=MT";
                            }}
                        />
                    </motion.div>
                ))}
            </div>
            <p className="mt-4 text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">
                {images.length} Thành viên
            </p>
        </motion.div>
    );
};