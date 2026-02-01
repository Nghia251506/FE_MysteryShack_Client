"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, Heart, Eye, Target, 
  Users, Code, Headphones, ArrowRight,
  ShieldCheck, Star
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-400 italic">
                    Thấu cảm & Định hướng
                </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed font-light"
            >
                Mystic Tarot không chỉ là một website rút bài. Chúng tôi là cầu nối số, nơi tri thức cổ xưa gặp gỡ công nghệ hiện đại để giúp bạn tìm thấy câu trả lời bên trong chính mình.
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
                    Chúng tôi nỗ lực tạo ra một môi trường tham vấn **An toàn - Bảo mật - Minh bạch**. Mỗi lá bài được lật mở trên Mystic Tarot là một lời gợi mở, giúp bạn xoa dịu tâm hồn, giải tỏa áp lực và có thêm góc nhìn khách quan để tự tin đưa ra những quyết định quan trọng trong cuộc sống.
                </p>
            </motion.div>
            <motion.div 
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10"
            >
                <Heart className="w-12 h-12 text-purple-500 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">Sứ mệnh với Reader</h2>
                <p className="text-slate-400 leading-relaxed text-justify">
                    Mystic Tarot là "ngôi nhà chung" cho các Tarot Reader chuyên nghiệp. Chúng tôi cung cấp hạ tầng công nghệ tối ưu, giúp các Reader tập trung hoàn toàn vào chuyên môn và sự thấu cảm, đồng thời xây dựng cộng đồng làm nghề văn minh, tôn trọng các tiêu chuẩn đạo đức nghề nghiệp.
                </p>
            </motion.div>
        </section>

        {/* --- ĐỘI NGŨ VẬN HÀNH (Admin, Tech, Support) --- */}
        <section className="mb-40">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Những người đứng sau "Cánh cổng"</h2>
                <p className="text-slate-500">Chúng tôi làm việc lặng lẽ để đảm bảo trải nghiệm của bạn luôn mượt mà nhất.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Bộ phận Quản trị */}
                <TeamCard 
                    icon={ShieldCheck} 
                    title="Hội đồng Quản trị" 
                    desc="Định hướng chiến lược, kiểm soát chất lượng nội dung và đảm bảo các tiêu chuẩn đạo đức nghề nghiệp trên nền tảng."
                    color="amber"
                />
                {/* Bộ phận Kỹ thuật */}
                <TeamCard 
                    icon={Code} 
                    title="Đội ngũ Kỹ thuật" 
                    desc="Những 'pháp sư' code thực thụ, duy trì hệ thống vận hành 24/7 với bảo mật SSL cao nhất và trải nghiệm người dùng tối ưu."
                    color="purple"
                />
                {/* Bộ phận Hỗ trợ */}
                <TeamCard 
                    icon={Headphones} 
                    title="Bộ phận Hỗ trợ" 
                    desc="Luôn lắng nghe và đồng hành cùng khách hàng cũng như Reader trong mọi vấn đề về giao dịch và trải nghiệm dịch vụ."
                    color="blue"
                />
            </div>
        </section>

        {/* --- GIÁ TRỊ CỐT LÕI --- */}
        <section className="mb-40 p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px]" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="space-y-4">
                    <div className="text-4xl font-black text-amber-500 italic">01.</div>
                    <h3 className="text-xl font-bold text-white">Chân thực</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Không thổi phồng, không mê tín. Chúng tôi tôn trọng sự thật và tính chiêm nghiệm.</p>
                </div>
                <div className="space-y-4">
                    <div className="text-4xl font-black text-purple-500 italic">02.</div>
                    <h3 className="text-xl font-bold text-white">Bảo mật</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Mọi thông tin cá nhân và nội dung phiên trải bài đều được mã hóa tuyệt đối.</p>
                </div>
                <div className="space-y-4">
                    <div className="text-4xl font-black text-blue-500 italic">03.</div>
                    <h3 className="text-xl font-bold text-white">Cộng đồng</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Góp phần xây dựng một cộng đồng Tarot văn minh, hiện đại tại Việt Nam.</p>
                </div>
            </div>
        </section>

        {/* --- KÊU GỌI HÀNH ĐỘNG --- */}
        <section className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Bạn đã sẵn sàng kết nối?</h2>
            <button 
                onClick={() => router.push('/tarot-draw')}
                className="group relative px-16 py-6 bg-white text-black font-black rounded-3xl overflow-hidden hover:scale-105 transition-all inline-flex items-center gap-4 uppercase tracking-tighter"
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

// --- HÀM PHỤ CHO TEAM CARD ---
const TeamCard = ({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => {
    const colorMap: any = {
        amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 flex flex-col items-center text-center group"
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 group-hover:scale-110 ${colorMap[color]}`}>
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            
            {/* Ảnh Placeholder để ông thay sau */}
            <div className="mt-8 flex -space-x-3 overflow-hidden">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-[#050505] bg-slate-800 flex items-center justify-center border border-white/10">
                        <Users className="w-4 h-4 text-slate-600" />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};