"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, Brain, Stethoscope, UserCheck, 
  Store, WifiOff, ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";

// --- IMPORT HEADER & FOOTER ĐỒNG BỘ ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialFloating from "@/components/SocialFloating";

export default function DisclaimerPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col relative">
      
      <Header />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/5 rounded-full blur-[100px]" />
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-6">
                <ShieldAlert className="w-4 h-4" /> Thông báo pháp lý
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
                Miễn Trừ Trách Nhiệm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-orange-400">
                    & Giới Hạn Dịch Vụ
                </span>
            </h1>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
                Vui lòng đọc kỹ trước khi sử dụng. Tiếp tục sử dụng Mystic Tarot đồng nghĩa với việc bạn chấp nhận các điều khoản dưới đây.
            </p>
        </motion.div>

        {/* MỘT SECTION DUY NHẤT CHỨA TẤT CẢ NỘI DUNG */}
        <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#130823]/40 border border-white/5 rounded-[3rem] p-8 md:p-16 backdrop-blur-xl space-y-16 shadow-2xl"
        >
            {/* PHẦN 1: BẢN CHẤT */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-white border-l-4 border-amber-500 pl-6">
                    <Brain className="w-6 h-6 text-amber-500" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">1. Bản chất Nội dung</h2>
                </div>
                <div className="pl-10 space-y-8">
                    <Article title="Tham vấn định hướng">
                        Mọi nội dung dựa trên hệ thống biểu tượng và chiêm nghiệm tâm lý. Đây là dịch vụ hỗ trợ tinh thần, không mang tính chất bói toán mê tín.
                    </Article>
                    <Article title="Tính chủ quan">
                        Các diễn giải mang tính cá nhân của Reader. Chúng tôi không cam kết về tính chính xác tuyệt đối hay sự ứng nghiệm trong thực tế.
                    </Article>
                </div>
            </div>

            {/* PHẦN 2: CHUYÊN MÔN */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-white border-l-4 border-red-500 pl-6">
                    <Stethoscope className="w-6 h-6 text-red-500" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">2. Giới hạn Chuyên môn</h2>
                </div>
                <div className="pl-10 space-y-6">
                    <p className="text-slate-400 text-sm">Nội dung không thay thế các dịch vụ tư vấn chuyên môn sau:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5">
                            <strong className="text-red-400 block mb-2 font-bold uppercase text-xs tracking-widest">Y tế & Sức khỏe</strong>
                            <p className="text-sm text-slate-400 leading-relaxed">Không cung cấp chẩn đoán y khoa hoặc lời khuyên điều trị bệnh lý.</p>
                        </div>
                        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5">
                            <strong className="text-amber-400 block mb-2 font-bold uppercase text-xs tracking-widest">Pháp lý & Tài chính</strong>
                            <p className="text-sm text-slate-400 leading-relaxed">Thông tin chỉ mang tính tham khảo, không phải lời khuyên đầu tư.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PHẦN 3: TỰ QUYẾT */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-white border-l-4 border-blue-500 pl-6">
                    <UserCheck className="w-6 h-6 text-blue-500" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">3. Quyền Tự Quyết</h2>
                </div>
                <div className="pl-10 space-y-8">
                    <Article title="Trách nhiệm cá nhân">
                        Khách hàng là chủ thể duy nhất quyết định hành động của mình. Chúng tôi miễn trừ mọi trách nhiệm đối với hệ quả từ các quyết định cá nhân đó.
                    </Article>
                </div>
            </div>

            {/* PHẦN 4: HẠ TẦNG */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-white border-l-4 border-purple-500 pl-6">
                    <Store className="w-6 h-6 text-purple-500" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">4. Vai trò Nền tảng</h2>
                </div>
                <div className="pl-10">
                    <ul className="list-disc pl-5 space-y-4 text-slate-400 text-sm leading-relaxed">
                        <li>Reader là đối tác độc lập, không phải nhân viên trực thuộc.</li>
                        <li>Chúng tôi cung cấp kết nối kỹ thuật, không can thiệp vào tư duy của Reader.</li>
                    </ul>
                </div>
            </div>

            {/* PHẦN 5: KỸ THUẬT */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-white border-l-4 border-slate-500 pl-6">
                    <WifiOff className="w-6 h-6 text-slate-500" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">5. Sự cố Kỹ thuật</h2>
                </div>
                <div className="pl-10">
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Dịch vụ có thể gián đoạn do sự cố máy chủ toàn cầu hoặc lỗi đường truyền mạng bất khả kháng.
                    </p>
                </div>
            </div>

        </motion.section>

        {/* CTA */}
        <div className="mt-20 text-center">
            <button 
                onClick={() => router.push('/')}
                className="group relative px-10 py-4 bg-white/5 border border-white/10 hover:border-amber-500/50 text-slate-300 font-black rounded-2xl transition-all flex items-center gap-3 mx-auto uppercase text-xs tracking-widest shadow-2xl"
            >
                Xác nhận đã hiểu và quay về <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-500" />
            </button>
        </div>

      </main>

      <Footer />
      <SocialFloating/>
    </div>
  );
}

// --- HELPER COMPONENT (NO ITALIC/SERIF TO FIX FONT) ---
const Article = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed text-justify pl-4 border-l border-white/10">
            {children}
        </p>
    </div>
);