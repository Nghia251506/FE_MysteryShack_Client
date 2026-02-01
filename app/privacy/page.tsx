"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Shield, Database, Lock, UserX, 
  Gavel, Scale, Fingerprint, ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";

// --- IMPORT CÁC COMPONENT ĐỒNG BỘ ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialFloating from '@/components/SocialFloating';

export default function PrivacyPage() {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col relative">
      
      {/* 1. HEADER CHUẨN */}
      <Header />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex-grow">
        
        {/* HERO TITLE */}
        <motion.div 
            initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}
            className="text-center mb-16 border-b border-white/10 pb-12"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Shield className="w-4 h-4" /> Cam kết bảo vệ dữ liệu
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
                Chính Sách Bảo Mật <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400">
                    & Quyền Riêng Tư
                </span>
            </h1>
            <p className="text-slate-500 italic text-sm max-w-2xl mx-auto leading-relaxed">
                Mystic Tarot cam kết minh bạch trong việc thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn theo các tiêu chuẩn an toàn cao nhất.
            </p>
        </motion.div>

        {/* CONTENT BLOCKS */}
        <div className="space-y-12">

            {/* PHẦN I: TUYÊN BỐ PHÁP LÝ */}
            <SectionBlock 
                icon={Scale} 
                title="I. Tuyên bố Bản chất Dịch vụ & Giới hạn Pháp lý"
                delay={0.1}
                color="blue"
            >
                <Article title="Vai trò Nền tảng">
                    Mystic Tarot vận hành như một bên thứ ba cung cấp giải pháp hạ tầng kết nối giữa Khách hàng và các Nhà tham vấn độc lập (Reader). Chúng tôi không trực tiếp cung cấp dịch vụ tư vấn và không chịu trách nhiệm liên đới về nội dung cá biệt.
                </Article>
                <Article title="Định danh Dịch vụ">
                    Mọi hoạt động được xác lập là “Chiêm nghiệm tâm lý” và “Giải mã biểu tượng”. Chúng tôi kiên quyết từ chối và nghiêm cấm các hành vi mê tín dị đoan trái pháp luật.
                </Article>
            </SectionBlock>

            {/* PHẦN II: DỮ LIỆU */}
            <SectionBlock 
                icon={Database} 
                title="II. Chính sách Dữ liệu & Quyền riêng tư"
                delay={0.2}
                color="amber"
            >
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-amber-200/90 flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" /> 
                        Danh mục thu thập dữ liệu chuyên biệt
                    </h3>
                    <ul className="list-disc pl-5 space-y-3 text-slate-400 text-sm">
                        <li><strong className="text-white">Định danh:</strong> Họ tên, số điện thoại, email xác thực.</li>
                        <li><strong className="text-white">Nhân trắc học:</strong> Ngày, tháng, năm và Giờ sinh chính xác (để thiết lập bản đồ thông tin).</li>
                        <li><strong className="text-white">Hệ thống:</strong> Lịch sử tương tác và nhật ký giao dịch bảo mật.</li>
                    </ul>
                </div>
            </SectionBlock>

            {/* PHẦN III: TƯƠNG TÁC */}
            <SectionBlock 
                icon={UserX} 
                title="III. Quy chuẩn Tương tác"
                delay={0.3}
                color="blue"
            >
                <Article title="Bảo mật Tương tác (No-Chat Policy)">
                    Chúng tôi không tích hợp tính năng nhắn tin trực tiếp để bảo vệ sự riêng tư tối đa và ngăn chặn các giao dịch ngoài hệ thống không an toàn.
                </Article>
                <Article title="Đạo đức Reader">
                    Cam kết không dự báo về sinh mạng, bệnh tật và tuyệt đối giữ bí mật thông tin của khách hàng.
                </Article>
            </SectionBlock>

            {/* PHẦN IV: BẢO MẬT KỸ THUẬT */}
            <SectionBlock 
                icon={Lock} 
                title="IV. Cơ chế Bảo mật Kỹ thuật"
                delay={0.4}
                color="blue"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-center group hover:border-blue-500/30 transition-colors">
                        <Fingerprint className="w-10 h-10 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-bold mb-1">SSL/TLS</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Mã hóa toàn vẹn</p>
                    </div>
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-center group hover:border-green-500/30 transition-colors">
                        <Lock className="w-10 h-10 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-bold mb-1">Access Control</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Đặc quyền tối thiểu</p>
                    </div>
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-center group hover:border-amber-500/30 transition-colors">
                        <Shield className="w-10 h-10 text-amber-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-bold mb-1">PCI DSS</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Giao dịch an toàn</p>
                    </div>
                </div>
            </SectionBlock>

        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
            <button 
                onClick={() => router.push('/')}
                className="group px-10 py-4 bg-white text-black font-black rounded-2xl transition-all hover:scale-105 flex items-center gap-3 mx-auto uppercase text-sm tracking-tighter"
            >
                Đã hiểu và quay về <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

      </main>

      {/* 2. FOOTER CHUẨN */}
      <Footer />

      {/* 3. SOCIAL FLOATING TỎA SÁNG */}
      <SocialFloating />
    </div>
  );
}

// --- HELPER COMPONENTS ---

const SectionBlock = ({ icon: Icon, title, children, delay, color = "blue" }: { icon: any, title: string, children: React.ReactNode, delay: number, color?: string }) => (
    <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay, duration: 0.5 }}
        className="bg-[#0a0a1a]/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-500 shadow-2xl"
    >
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5">
            <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${color === 'amber' ? 'text-amber-500' : 'text-blue-500'} shrink-0 border border-white/5 shadow-inner`}>
                <Icon className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        </div>
        <div className="space-y-8">
            {children}
        </div>
    </motion.section>
);

const Article = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed text-justify pl-4 border-l border-white/5">
            {children}
        </p>
    </div>
);