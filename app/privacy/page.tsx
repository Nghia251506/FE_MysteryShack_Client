"use client";

import React from "react";
import { useRouter } from "next/navigation";
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

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-blue-500/30 overflow-x-hidden flex flex-col relative">
      
      <Header />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex-grow w-full">
        
        {/* HERO TITLE */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 border-b border-white/10 pb-12"
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
            <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
                Cập nhật lần cuối: 19/02/2026. Mystic Tarot cam kết minh bạch trong việc bảo vệ thông tin cá nhân của bạn.
            </p>
        </motion.div>

        {/* MỘT SECTION DUY NHẤT CHỨA TẤT CẢ NỘI DUNG */}
        <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#0a0a1a]/40 border border-white/5 rounded-[3rem] p-8 md:p-16 backdrop-blur-xl space-y-20 shadow-2xl"
        >
            {/* PHẦN I: PHÁP LÝ */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-white border-l-4 border-blue-500 pl-6">
                    <Scale className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">I. Bản chất Dịch vụ & Giới hạn Pháp lý</h2>
                </div>
                <div className="pl-10 space-y-8">
                    <Article title="Vai trò Nền tảng">
                        Mystic Tarot vận hành như một bên thứ ba cung cấp giải pháp hạ tầng kết nối giữa Khách hàng và các Reader. Chúng tôi không trực tiếp cung cấp dịch vụ tư vấn và không chịu trách nhiệm về nội dung tư vấn cá biệt.
                    </Article>
                    <Article title="Định danh Dịch vụ">
                        Mọi hoạt động được xác lập là "Chiêm nghiệm tâm lý" và "Giải mã biểu tượng". Chúng tôi kiên quyết từ chối và nghiêm cấm các hành vi mê tín dị đoan trái pháp luật.
                    </Article>
                </div>
            </div>

            {/* PHẦN II: DỮ LIỆU */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-white border-l-4 border-amber-500 pl-6">
                    <Database className="w-6 h-6 text-amber-400" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">II. Chính sách Dữ liệu</h2>
                </div>
                <div className="pl-10 space-y-6">
                    <h3 className="text-lg font-bold text-amber-200/90 flex items-center gap-2">
                        Danh mục thu thập dữ liệu chuyên biệt
                    </h3>
                    <ul className="list-disc pl-5 space-y-3 text-slate-400 text-sm leading-relaxed">
                        <li><strong className="text-white">Định danh:</strong> Họ tên, số điện thoại, email xác thực.</li>
                        <li><strong className="text-blue-400">Nhân trắc học:</strong> Ngày, tháng, năm và Giờ sinh chính xác (để thiết lập bản đồ thông tin).</li>
                        <li><strong className="text-white">Hệ thống:</strong> Lịch sử tương tác và nhật ký giao dịch bảo mật.</li>
                    </ul>
                </div>
            </div>

            {/* PHẦN III: QUY CHUẨN */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-white border-l-4 border-purple-500 pl-6">
                    <UserX className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">III. Quy chuẩn Tương tác</h2>
                </div>
                <div className="pl-10 space-y-8">
                    <Article title="Bảo mật Tương tác (No-Chat Policy)">
                        Chúng tôi không tích hợp tính năng nhắn tin trực tiếp để bảo vệ sự riêng tư tối đa và ngăn chặn các giao dịch ngoài hệ thống không an toàn.
                    </Article>
                    <Article title="Đạo đức Reader">
                        Cam kết không dự báo về sinh mạng, bệnh tật và tuyệt đối giữ bí mật thông tin của khách hàng trong mọi tình huống.
                    </Article>
                </div>
            </div>

            {/* PHẦN IV: KỸ THUẬT - GIỮ LẠI GRID ĐỂ KHÔNG BỊ TRỐNG */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-white border-l-4 border-green-500 pl-6">
                    <Lock className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">IV. Cơ chế Bảo mật Kỹ thuật</h2>
                </div>
                <div className="pl-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-center transition-colors">
                        <Fingerprint className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                        <h4 className="text-white font-bold mb-1 text-sm">SSL/TLS</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Mã hóa toàn vẹn</p>
                    </div>
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-center transition-colors">
                        <Lock className="w-8 h-8 text-green-400 mx-auto mb-4" />
                        <h4 className="text-white font-bold mb-1 text-sm">Access Control</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Đặc quyền tối thiểu</p>
                    </div>
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-center transition-colors">
                        <Shield className="w-8 h-8 text-amber-400 mx-auto mb-4" />
                        <h4 className="text-white font-bold mb-1 text-sm">PCI DSS</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Giao dịch an toàn</p>
                    </div>
                </div>
            </div>

        </motion.section>

        {/* CTA */}
        <div className="mt-20 text-center">
            <button 
                onClick={() => router.push('/')}
                className="group px-10 py-4 bg-white text-black font-black rounded-2xl transition-all hover:scale-105 flex items-center gap-3 mx-auto uppercase text-xs tracking-widest"
            >
                Tôi đã hiểu các chính sách này <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

      </main>

      <Footer />
      <SocialFloating />
    </div>
  );
}

// --- HELPER COMPONENT (FIXED FONT) ---
const Article = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed text-justify pl-4 border-l border-white/10">
            {children}
        </p>
    </div>
);