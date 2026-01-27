"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Moon, ShieldCheck, Scale, 
  Users, Zap, AlertTriangle, ArrowRight,
  Info, Heart, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUsPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* HEADER / NAVIGATION BAR (Đồng nhất với các trang khác) */}
      <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div onClick={() => router.push('/')} className="flex items-center gap-2 cursor-pointer group">
                  <Moon className="w-8 h-8 text-amber-500 transition-transform group-hover:rotate-12" />
                  <span className="font-bold text-2xl text-white tracking-tighter">
                    Mystic<span className="text-amber-500">Tarot</span>
                  </span>
              </div>
              <button 
                onClick={() => router.push('/tarot-draw')}
                className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-full transition-all text-sm shadow-lg"
              >
                Bắt đầu ngay
              </button>
          </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        
        {/* HERO SECTION */}
        <section className="text-center mb-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-8"
            >
                <Sparkles className="w-4 h-4" /> Về chúng tôi
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight"
            >
                Kết nối tâm hồn qua <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-400 italic">
                    biểu tượng Tarot
                </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed"
            >
                Nền tảng số chuyên biệt kết nối những Tarot Reader độc lập với những tâm hồn đang tìm kiếm sự định hướng và an yên trong tinh thần.
            </motion.p>
        </section>

        {/* 1. BẢN CHẤT DỊCH VỤ */}
        <motion.section 
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center"
        >
            <div className="space-y-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/30">
                    <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-white">Sứ mệnh của Mystic Tarot</h2>
                <div className="space-y-4 text-slate-400 leading-relaxed">
                    <p>
                        Chúng tôi định vị dịch vụ là một công cụ hỗ trợ tinh thần, tham khảo và định hướng tư duy cá nhân. Mystic Tarot không phải là dịch vụ dự đoán tương lai hay cam kết về các sự kiện định mệnh.
                    </p>
                    <p>
                        Mọi phiên kết nối là một không gian chiêm nghiệm tâm lý, nơi các biểu tượng Tarot trở thành cầu nối để bạn thấu hiểu chính mình hơn thông qua góc nhìn chủ quan của những Reader dày dạn kinh nghiệm.
                    </p>
                </div>
            </div>
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-amber-600/20 rounded-[2.5rem] blur-2xl group-hover:opacity-100 transition-opacity opacity-50" />
                <div className="relative aspect-video bg-[#130823] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center overflow-hidden">
                    <div className="flex gap-4 mb-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-16 h-24 rounded-lg bg-gradient-to-b from-white/10 to-transparent border border-white/5 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />
                        ))}
                    </div>
                    <p className="text-amber-200/80 italic font-serif">"Tarot không thay đổi số phận, nó soi sáng những con đường bạn có thể chọn."</p>
                </div>
            </div>
        </motion.section>

        {/* 2 & 4. MARKETPLACE & INDEPENDENCE */}
        <motion.section 
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
        >
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group">
                <Users className="w-10 h-10 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-4">Mô hình Marketplace</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Chúng tôi đóng vai trò là hạ tầng kỹ thuật trung gian. Các Reader là những đối tác độc lập, chịu trách nhiệm cá nhân về quan điểm và diễn giải của họ.
                </p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group">
                <ShieldCheck className="w-10 h-10 text-green-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-4">Minh bạch & Tin cậy</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Mọi giao dịch được thực hiện trong môi trường nền tảng an toàn. Chúng tôi từ chối trách nhiệm đối với các thỏa thuận ngoài tầm kiểm soát của hệ thống.
                </p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group">
                <Scale className="w-10 h-10 text-amber-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-4">Tuân thủ Pháp luật</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Mystic Tarot xác lập rõ ràng: Không cổ súy mê tín dị đoan. Hoạt động của chúng tôi phục vụ mục đích giải trí tinh thần và chiêm nghiệm tâm lý.
                </p>
            </motion.div>
        </motion.section>

        {/* 3 & 5 & 6. ĐIỀU KHOẢN VÀ TRÁCH NHIỆM (Disclaimer Box) */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-red-900/10 to-transparent border border-red-500/20 rounded-[3rem] p-10 md:p-16 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
            <div className="flex flex-col md:flex-row gap-12 relative z-10">
                <div className="md:w-1/3">
                    <div className="inline-flex items-center gap-2 text-red-400 font-bold uppercase tracking-tighter mb-4">
                        <AlertTriangle className="w-5 h-5" /> Giới hạn trách nhiệm
                    </div>
                    <h2 className="text-3xl font-bold text-white leading-tight">Sự tự quyết <br /> là của bạn.</h2>
                </div>
                <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <h4 className="text-white font-bold flex items-center gap-2">
                             Chuyên gia tư vấn
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Nội dung Tarot không thay thế chẩn đoán y khoa, tư vấn pháp lý hay khuyến nghị đầu tư tài chính chính thức.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-white font-bold flex items-center gap-2">
                             Quyền tự định đoạt
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Người dùng là chủ thể duy nhất chịu trách nhiệm đối với mọi quyết định cá nhân dựa trên nội dung tham vấn.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-white font-bold flex items-center gap-2">
                             Rủi ro kỹ thuật
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Chúng tôi nỗ lực duy trì hệ thống nhưng không cam kết dịch vụ luôn không gián đoạn do các yếu tố hạ tầng bên thứ ba.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-white font-bold flex items-center gap-2">
                             Cập nhật định hướng
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Chúng tôi bảo lưu quyền chỉnh sửa và tạm ngưng dịch vụ để phù hợp với quy định pháp luật Việt Nam tại từng thời điểm.
                        </p>
                    </div>
                </div>
            </div>
        </motion.section>

        {/* FINAL CALL TO ACTION */}
        <section className="mt-40 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Bắt đầu hành trình <br /> khám phá bản thân</h2>
            <p className="text-slate-400 max-w-xl mx-auto italic">
                Cung cấp không gian chiêm nghiệm Tarot trong khuôn khổ pháp lý rõ ràng, minh bạch và có giới hạn trách nhiệm.
            </p>
            <button 
              onClick={() => router.push('/tarot-draw')}
              className="group relative px-12 py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] hover:scale-105 transition-all flex items-center gap-3 mx-auto"
            >
                Rút bài ngay <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-black/40 py-12 mt-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                  <Moon className="w-6 h-6 text-amber-500" />
                  <span className="font-bold text-white">Mystic Tarot © 2025</span>
              </div>
              <div className="flex gap-8 text-sm text-slate-500">
                  <a href="#" className="hover:text-amber-400 transition-colors">Điều khoản</a>
                  <a href="#" className="hover:text-amber-400 transition-colors">Bảo mật</a>
                  <a href="#" className="hover:text-amber-400 transition-colors">Liên hệ</a>
              </div>
          </div>
      </footer>
    </div>
  );
}