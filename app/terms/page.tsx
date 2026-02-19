"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Scale,
  Shield,
  Users,
  FileText,
  CreditCard,
  Gavel,
  ArrowRight,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";

// --- IMPORT HEADER & FOOTER ĐÃ TÁCH ---
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialFloating from "@/components/SocialFloating";

export default function TermsPage() {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col relative">
      <Header />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex-grow w-full">
        {/* TITLE SECTION */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 border-b border-white/10 pb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Shield className="w-4 h-4 text-amber-500" /> Trung tâm Pháp lý
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter italic">
            Điều Khoản <span className="text-amber-500">&</span> Chính Sách{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-400">
              Sử Dụng Mystic Tarot
            </span>
          </h1>
          <p className="text-slate-500 italic text-sm">
            Cập nhật lần cuối: 19/02/2026
          </p>
        </motion.div>

        {/* MỘT SECTION DUY NHẤT CHỨA TẤT CẢ NỘI DUNG */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-[#130823]/30 border border-white/5 rounded-[3rem] p-8 md:p-16 backdrop-blur-xl space-y-16"
        >
          {/* PHẦN I: ĐỊNH NGHĨA */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-white">
              <Scale className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                I. Phạm vi Dịch vụ
              </h2>
            </div>

            <div className="pl-10 space-y-6">
              <Article title="Điều 1: Bản chất mô hình vận hành">
                <p className="text-slate-400 mb-4 italic">
                  Mystic Tarot hoạt động với tư cách là sàn giao dịch kết nối
                  nhu cầu tham vấn giữa Khách hàng và các Reader.
                </p>
                <ul className="list-disc pl-5 space-y-3 text-slate-400">
                  <li>
                    Chúng tôi cung cấp hạ tầng kỹ thuật, không trực tiếp thực
                    hiện các nội dung tư vấn.
                  </li>
                  <li>
                    Mối quan hệ giữa Reader và Khách hàng là quan hệ dân sự độc
                    lập, chúng tôi không can thiệp vào chuyên môn của Reader.
                  </li>
                </ul>
              </Article>
            </div>
          </div>

          {/* PHẦN II: DỮ LIỆU */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-white">
              <Lock className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                II. Quyền Riêng Tư & Dữ Liệu
              </h2>
            </div>

            <div className="pl-10 space-y-6">
              <Article title="Điều 2: Thu thập dữ liệu chuyên biệt">
                <p className="text-slate-400 mb-3">
                  Người dùng đồng ý cung cấp các thông tin sau để phục vụ phân
                  tích:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-400">
                  <li>
                    <strong className="text-white">Định danh:</strong> Họ tên,
                    Số điện thoại và Email xác thực.
                  </li>
                  <li>
                    <strong className="text-amber-500">
                      Kỹ thuật chuyên sâu:
                    </strong>{" "}
                    Ngày, tháng, năm sinh và giờ sinh chính xác (để lập Bản đồ
                    sao/Natal Chart).
                  </li>
                </ul>
              </Article>
            </div>
          </div>

          {/* PHẦN III: QUYỀN VÀ TRÁCH NHIỆM */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-white">
              <Users className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                III. Trách Nhiệm Các Bên
              </h2>
            </div>

            <div className="pl-10 space-y-6">
              <Article title="Điều 3: Đối với Khách hàng">
                <ul className="list-disc pl-5 space-y-3 text-slate-400">
                  <li>
                    <strong className="text-white">Tính chất tham khảo:</strong>{" "}
                    Mọi nội dung tư vấn chỉ mang tính định hướng tư duy, không
                    thay thế lời khuyên y tế hay pháp lý.
                  </li>
                  <li>
                    <strong className="text-white">Quyền tự quyết:</strong> Bạn
                    chịu hoàn toàn trách nhiệm cho các hành động thực tế sau
                    phiên trải nghiệm.
                  </li>
                </ul>
              </Article>
            </div>
          </div>

          {/* PHẦN IV: GIAO DỊCH */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-white">
              <CreditCard className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                IV. Quy định Thanh Toán
              </h2>
            </div>

            <div className="pl-10 space-y-6">
              <Article title="Điều 4: Kết nối chính thống">
                <p className="text-slate-400 leading-relaxed italic">
                  Mọi hoạt động thanh toán và đặt lịch phải thông qua hệ thống
                  Mystic Tarot. Chúng tôi không chịu trách nhiệm bảo vệ nếu
                  người dùng giao dịch ngoài nền tảng.
                </p>
              </Article>
            </div>
          </div>

          {/* PHẦN V: PHÁP LÝ CHUNG */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-white">
              <Gavel className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                V. Luật Điều Chỉnh
              </h2>
            </div>

            <div className="pl-10 space-y-6">
              <Article title="Điều 5: Giải quyết tranh chấp">
                <p className="text-slate-400">
                  Thỏa thuận được thực thi theo pháp luật hiện hành của nước
                  Cộng hòa Xã hội Chủ nghĩa Việt Nam.
                </p>
              </Article>
            </div>
          </div>
        </motion.section>

        {/* CTA DƯỚI CÙNG */}
        <div className="mt-20 text-center">
          <p className="text-slate-500 text-sm mb-8">
            Sử dụng dịch vụ đồng nghĩa với việc bạn đã đọc và đồng ý với các
            điều khoản trên.
          </p>
          <button
            onClick={() => router.push("/")}
            className="group relative px-10 py-4 bg-white text-black font-black rounded-2xl overflow-hidden hover:scale-105 transition-all flex items-center gap-2 mx-auto"
          >
            <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors uppercase text-xs tracking-widest">
              Đã hiểu và quay về trang chủ <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </main>

      <Footer />
      <SocialFloating />
    </div>
  );
}

// --- HELPER COMPONENT ---
const Article = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    {/* Bỏ font-serif và italic ở đây vì nó gây lỗi dấu Tiếng Việt */}
    <h3 className="text-lg font-bold text-amber-400/90 tracking-wide border-l-2 border-amber-500/50 pl-4">
      {title}
    </h3>
    <div className="text-base leading-relaxed pl-5">{children}</div>
  </div>
);
