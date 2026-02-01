"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Scale, Shield, Users, FileText, 
  CreditCard, Gavel, ArrowRight, Lock 
} from "lucide-react";
import { motion } from "framer-motion";

// --- IMPORT HEADER & FOOTER ĐÃ TÁCH ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialFloating from "@/components/SocialFloating";

export default function TermsPage() {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col relative">
      
      {/* 1. HEADER ĐỒNG BỘ */}
      <Header />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex-grow">
        
        {/* TITLE SECTION */}
        <motion.div 
            initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}
            className="text-center mb-16 border-b border-white/10 pb-12"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
                <FileText className="w-4 h-4 text-amber-500" /> Văn bản pháp lý
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
                Thỏa Thuận Dịch Vụ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">
                    & Điều Khoản Sử Dụng
                </span>
            </h1>
            <p className="text-slate-500 italic text-sm">
                Cập nhật lần cuối: 28/01/2026
            </p>
        </motion.div>

        {/* CONTENT BLOCKS */}
        <div className="space-y-12">

            {/* PHẦN I */}
            <SectionBlock 
                icon={Scale} 
                title="Phần I: Định nghĩa và Phạm vi Dịch vụ"
                delay={0.1}
            >
                <Article title="Điều 1: Bản chất mô hình vận hành">
                    <ul className="list-disc pl-5 space-y-3 text-slate-400">
                        <li>
                            <strong className="text-white">Vai trò Nền tảng:</strong> Mystic Tarot hoạt động với tư cách là sàn giao dịch thương mại điện tử kết nối nhu cầu tham vấn giữa Khách hàng và các Reader.
                        </li>
                        <li>
                            <strong className="text-white">Giới hạn Trách nhiệm:</strong> Chúng tôi cung cấp hạ tầng, không trực tiếp tư vấn. Mối quan hệ giữa Reader và Khách hàng là quan hệ dân sự độc lập.
                        </li>
                    </ul>
                </Article>
            </SectionBlock>

            {/* PHẦN II */}
            <SectionBlock 
                icon={Lock} 
                title="Phần II: Chính sách Dữ liệu & Quyền riêng tư"
                delay={0.2}
            >
                <Article title="Điều 2: Thu thập dữ liệu chuyên biệt">
                    <p className="mb-3">Người dùng đồng ý cung cấp các dữ liệu sau để phục vụ phân tích chuyên môn:</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>Thông tin định danh: Họ tên, Số điện thoại, Email.</li>
                        <li>
                            <span className="text-amber-500 font-bold">Thông tin kỹ thuật:</span> Ngày, tháng, năm sinh và Giờ sinh (bắt buộc để lập Natal Chart).
                        </li>
                    </ul>
                </Article>
            </SectionBlock>

            {/* PHẦN III */}
            <SectionBlock 
                icon={Users} 
                title="Phần III: Quyền và Trách nhiệm các bên"
                delay={0.3}
            >
                <Article title="Điều 4: Đối với khách hàng">
                    <ul className="list-disc pl-5 space-y-3 text-slate-400">
                        <li>
                            <strong className="text-white">Tính chất tham khảo:</strong> Nội dung tư vấn mang tính chất định hướng tư duy, không phải lời khuyên pháp lý hay y tế.
                        </li>
                        <li>
                            <strong className="text-white">Quyền tự quyết:</strong> Khách hàng chịu trách nhiệm cuối cùng cho mọi hành động thực tế của mình.
                        </li>
                    </ul>
                </Article>
            </SectionBlock>

            {/* PHẦN IV */}
            <SectionBlock 
                icon={CreditCard} 
                title="Phần IV: Quy định Giao dịch"
                delay={0.4}
            >
                <Article title="Điều 7: Phương thức kết nối">
                    <p className="text-slate-400">Mọi hoạt động đặt lịch và thanh toán phải được thực hiện thông qua hệ thống của Mystic Tarot để được bảo vệ quyền lợi.</p>
                </Article>
            </SectionBlock>

            {/* PHẦN V */}
            <SectionBlock 
                icon={Gavel} 
                title="Phần V: Điều khoản Pháp lý chung"
                delay={0.5}
            >
                <Article title="Điều 10: Luật điều chỉnh">
                    <p className="text-slate-400">Thỏa thuận này được điều chỉnh và giải thích theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.</p>
                </Article>
            </SectionBlock>

        </div>

        {/* CTA DƯỚI CÙNG */}
        <div className="mt-20 text-center bg-white/[0.02] border border-white/5 p-12 rounded-[3rem]">
            <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
                Bằng việc sử dụng Mystic Tarot, bạn xác nhận đã hiểu và tuân thủ các quy định pháp lý nêu trên.
            </p>
            <button 
                onClick={() => router.push('/')}
                className="group relative px-10 py-4 bg-white text-black font-black rounded-2xl overflow-hidden hover:scale-105 transition-all flex items-center gap-2 mx-auto"
            >
                <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors uppercase text-sm">
                    Xác nhận và về trang chủ <ArrowRight className="w-4 h-4" />
                </span>
            </button>
        </div>

      </main>

      {/* 2. FOOTER ĐỒNG BỘ */}
      <Footer />
      <SocialFloating/>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const SectionBlock = ({ icon: Icon, title, children, delay }: { icon: any, title: string, children: React.ReactNode, delay: number }) => (
    <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay, duration: 0.5 }}
        className="bg-[#130823]/50 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm hover:border-amber-500/20 transition-all duration-500"
    >
        <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <Icon className="w-6 h-6" />
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
        <h3 className="text-lg font-bold text-amber-400/90 font-serif tracking-wide underline underline-offset-8 decoration-white/5">{title}</h3>
        <div className="text-base leading-relaxed">
            {children}
        </div>
    </div>
);