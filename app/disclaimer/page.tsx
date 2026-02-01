"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, Brain, Stethoscope, UserCheck, 
  Store, WifiOff, RefreshCw, ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";

// --- IMPORT HEADER & FOOTER ĐỒNG BỘ ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialFloating from "@/components/SocialFloating";

export default function DisclaimerPage() {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col relative">
      
      {/* 1. HEADER ĐỒNG BỘ TOÀN HỆ THỐNG */}
      <Header />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex-grow">
        
        {/* HERO TITLE */}
        <motion.div 
            initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}
            className="text-center mb-16 border-b border-white/10 pb-12"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-6">
                <ShieldAlert className="w-4 h-4" /> Tuyên bố quan trọng
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
                Miễn Trừ Trách Nhiệm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
                    & Giới Hạn Dịch Vụ
                </span>
            </h1>
            <p className="text-slate-500 italic text-sm max-w-2xl mx-auto leading-relaxed">
                Vui lòng đọc kỹ các nội dung dưới đây trước khi sử dụng dịch vụ. Việc tiếp tục sử dụng Mystic Tarot đồng nghĩa với việc bạn đã hiểu và chấp nhận các tuyên bố này.
            </p>
        </motion.div>

        {/* CONTENT BLOCKS */}
        <div className="space-y-8">

            <SectionBlock 
                icon={Brain} 
                title="1. Bản chất về nội dung và dịch vụ"
                delay={0.1}
            >
                <Article title="Tham vấn định hướng">
                    Mọi nội dung trong các phiên kết nối được xây dựng dựa trên các hệ thống biểu tượng và chiêm nghiệm tâm lý. Đây là dịch vụ hỗ trợ tinh thần và định hướng tư duy cá nhân.
                </Article>
                <Article title="Tính chủ quan">
                    Các diễn giải mang tính chất chủ quan dựa trên chuyên môn của từng Reader. Mystic Tarot không cam kết về tính chính xác tuyệt đối hay sự ứng nghiệm trong tương lai.
                </Article>
            </SectionBlock>

            <SectionBlock 
                icon={Stethoscope} 
                title="2. Giới hạn đối với các lời khuyên chuyên môn"
                delay={0.2}
            >
                <p className="mb-4 text-slate-400 italic text-sm">Nội dung trên Mystic Tarot không thay thế các dịch vụ tư vấn chuyên môn sau:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 hover:border-red-500/20 transition-colors">
                        <strong className="text-red-400 block mb-2 font-bold uppercase text-xs tracking-widest">Y tế & Sức khỏe</strong>
                        <p className="text-sm text-slate-400">Chúng tôi không cung cấp chẩn đoán y khoa, lời khuyên điều trị bệnh lý hoặc tư vấn tâm thần chuyên sâu.</p>
                    </div>
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-colors">
                        <strong className="text-amber-400 block mb-2 font-bold uppercase text-xs tracking-widest">Pháp lý & Tài chính</strong>
                        <p className="text-sm text-slate-400">Mọi thông tin liên quan đến đầu tư hoặc pháp lý chỉ mang tính chất tham khảo cho góc nhìn cá nhân.</p>
                    </div>
                </div>
            </SectionBlock>

            <SectionBlock 
                icon={UserCheck} 
                title="3. Quyền tự quyết của khách hàng"
                delay={0.3}
            >
                <Article title="Quyền tự quyết tối cao">
                    Khách hàng là chủ thể duy nhất giữ quyền đưa ra quyết định cuối cùng đối với mọi vấn đề cá nhân của mình.
                </Article>
                <Article title="Miễn trừ trách nhiệm hệ quả">
                    Mystic Tarot miễn trừ trách nhiệm đối với bất kỳ thiệt hại nào phát sinh từ việc Khách hàng hành động dựa trên nội dung tham vấn của Reader.
                </Article>
            </SectionBlock>

            <SectionBlock 
                icon={Store} 
                title="4. Vai trò Marketplace"
                delay={0.4}
            >
                <ul className="list-disc pl-5 space-y-3 text-slate-400 text-sm">
                    <li><strong className="text-white">Tính độc lập:</strong> Reader là đối tác độc lập, không phải nhân viên của Nền tảng.</li>
                    <li><strong className="text-white">Hạ tầng:</strong> Chúng tôi cung cấp hạ tầng kết nối kỹ thuật, không can thiệp vào phát ngôn cá nhân thời gian thực của Reader.</li>
                </ul>
            </SectionBlock>

            <SectionBlock 
                icon={WifiOff} 
                title="5. Rủi ro kỹ thuật"
                delay={0.5}
            >
                <Article title="Sự cố khách quan">
                    Chúng tôi không cam kết dịch vụ luôn không bị gián đoạn do các yếu tố bất khả kháng như sự cố máy chủ toàn cầu hoặc đường truyền mạng.
                </Article>
            </SectionBlock>

        </div>

        {/* CTA QUAY LẠI TRANG CHỦ */}
        <div className="mt-20 text-center">
            <button 
                onClick={() => router.push('/')}
                className="group relative px-10 py-4 bg-white/5 border border-white/10 hover:border-amber-500/50 text-slate-300 font-black rounded-2xl transition-all flex items-center gap-3 mx-auto uppercase text-sm tracking-tighter shadow-2xl"
            >
                Tôi đã hiểu và quay lại trang chủ <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-amber-500" />
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
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay, duration: 0.5 }}
        className="bg-[#130823]/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-sm hover:bg-[#130823]/60 transition-all duration-500"
    >
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-inner border border-white/5">
                <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </motion.section>
);

const Article = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed text-justify pl-4 border-l border-white/5">
            {children}
        </p>
    </div>
);