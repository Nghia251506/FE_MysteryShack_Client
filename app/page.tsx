"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Star,
  ArrowRight,
  Heart,
  Briefcase,
  Wallet,
  Compass,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// --- IMPORT HEADER & FOOTER ĐÃ TÁCH ---
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialFloating from "@/components/SocialFloating";

export default function Home() {
  const [hoveredTopic, setHoveredTopic] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const topics = [
    {
      icon: Heart,
      title: "Tình Duyên",
      description:
        "Thấu hiểu cảm xúc, kết nối trái tim và định hướng những rạn nứt hay khởi đầu mới.",
      color: "from-pink-500/20 to-rose-500/20",
      accent: "text-rose-400",
      border: "hover:border-rose-500/50",
    },
    {
      icon: Briefcase,
      title: "Sự Nghiệp",
      description:
        "Khám phá tiềm năng ẩn giấu, thời cơ thăng tiến và những bước ngoặt trong công việc.",
      color: "from-blue-500/20 to-indigo-500/20",
      accent: "text-blue-400",
      border: "hover:border-blue-500/50",
    },
    {
      icon: Wallet,
      title: "Tài Chính",
      description:
        "Nhận diện vận may tiền bạc, quản lý dòng chảy năng lượng vật chất bền vững.",
      color: "from-emerald-500/20 to-teal-500/20",
      accent: "text-emerald-400",
      border: "hover:border-emerald-500/50",
    },
    {
      icon: Compass,
      title: "Định Hướng",
      description:
        "Tìm kiếm câu trả lời cho những băn khoăn về bản ngã và mục đích sống sâu thẳm.",
      color: "from-amber-500/20 to-orange-500/20",
      accent: "text-amber-400",
      border: "hover:border-amber-500/50",
    },
  ];

  const steps = [
    {
      id: "01",
      title: "Tập trung tâm trí",
      desc: "Lắng nghe trực giác, đặt câu hỏi và rút 3 lá bài từ bộ 78 lá cổ điển.",
    },
    {
      id: "02",
      title: "Kết nối Reader",
      desc: "Chọn bậc thầy Tarot đồng điệu với năng lượng của bạn để bắt đầu tham vấn.",
    },
    {
      id: "03",
      title: "Nhận luận giải",
      desc: "Đón nhận thông điệp chi tiết từ vũ trụ được cá nhân hóa cho riêng bạn.",
    },
  ];

  const handleTopicClick = (title: string) => {
    setSelectedTopic(title);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col">
      {/* 1. HEADER NHÚNG VÀO ĐẦU TRANG */}
      <Header />

      {/* --- MODAL KHẢI HUYỀN CHƯA MỞ (COMING SOON) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-10 rounded-[3rem] shadow-[0_0_100px_-20px_rgba(245,158,11,0.2)] text-center"
            >
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl" />

              <div className="relative mb-8">
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
                <div className="relative flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 border-2 border-dashed border-amber-500/20 rounded-full scale-150"
                  />
                  <div className="w-20 h-20 bg-gradient-to-b from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                    <Sparkles className="w-10 h-10 text-black" />
                  </div>
                </div>
              </div>

              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">
                Khải Huyền Chưa Mở
              </h3>

              <div className="space-y-4 mb-10">
                <p className="text-amber-500 font-bold text-sm tracking-[0.3em] uppercase">
                  Chủ đề: {selectedTopic}
                </p>
                <p className="text-slate-400 leading-relaxed text-lg font-light italic px-4">
                  "Sợi dây thiên mệnh về{" "}
                  <span className="text-white font-medium">
                    {selectedTopic}
                  </span>{" "}
                  đang được dệt lại bởi các Norn. Khi các tinh tú hội tụ đủ năng
                  lượng, cánh cổng này sẽ tự khắc khai mở."
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="group relative w-full py-5 bg-white text-black font-black rounded-2xl overflow-hidden transition-transform active:scale-95"
              >
                <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors uppercase">
                  Tuân theo sự sắp đặt <ArrowRight className="w-5 h-5" />
                </span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] right-[-5%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-overlay"></div>
      </div>

      <main className="relative z-10 flex-grow">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-32 md:pt-48 md:pb-56 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-black uppercase tracking-[0.2em] shadow-inner backdrop-blur-sm">
              <Sparkles className="w-4 h-4 animate-pulse" /> Huyền Bí Trong Từng
              Lá – Hy Vọng Trong Từng Lời
            </div>
            <h1 className="text-6xl md:text-[90px] font-extrabold text-white leading-[1.1] tracking-tighter">
              Giải Mã Vận Mệnh <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-400">
                Kết Nối Tâm Thức & Khai Sáng
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-light">
              Đằng sau mỗi lá bài là một thông điệp đang chờ đợi. Hãy để chúng
              tôi đồng hành cùng bạn trên con đường tìm kiếm sự an nhiên và định
              hướng cuộc đời.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/tarot-draw">
                <button className="group relative px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black text-lg rounded-2xl shadow-[0_0_50px_-10px_rgba(245,158,11,0.6)] hover:scale-[1.03] transition-all flex items-center justify-center gap-3">
                  Bắt Đầu Rút Bài{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/what-is-tarot">
                <button className="px-12 py-5 bg-white/5 border border-white/10 text-slate-200 font-bold text-lg rounded-2xl hover:bg-white/10 hover:scale-[1.03] transition-all backdrop-blur-xl border-dashed">
                  Tìm hiểu thêm
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* TOPICS SECTION (Dùng handleTopicClick) */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-center md:text-left">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Chìa Khoá Mở Cửa Tâm Hồn
              </h2>
              <p className="text-slate-500 text-lg">
                Lựa chọn lĩnh vực bạn đang trăn trở.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-amber-500/20 rounded-full" />
              <div className="w-24 h-1 bg-amber-500 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleTopicClick(topic.title)}
                className={`relative group p-10 rounded-[3rem] bg-[#130823]/40 border border-white/5 backdrop-blur-2xl transition-all duration-500 cursor-pointer ${topic.border} shadow-2xl`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 transition-all ${topic.accent}`}
                >
                  <topic.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {topic.title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed">
                  {topic.description}
                </p>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500">
                  Khai mở ngay <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-6xl mx-auto px-6 py-32">
          <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-20 text-center tracking-tight">
              Cách Thức <span className="text-amber-500">Kết Nối</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="space-y-8 text-center md:text-left group"
                >
                  <span className="text-7xl font-black text-white/[0.03] block font-serif tracking-tighter group-hover:text-amber-500/10 transition-colors duration-500">
                    {step.id}
                  </span>
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-white group-hover:text-amber-500 transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-slate-400 text-base leading-relaxed font-light">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="flex items-center justify-center gap-4">
              <Star className="w-12 h-12 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight">
              Sẵn Sàng Khai Mở <br /> Chân Trời Mới?
            </h2>
            <div className="pt-8">
              {mounted &&
                (!user ? (
                  <Link href="/register">
                    <button className="px-16 py-6 bg-white text-black font-black text-xl rounded-full hover:bg-slate-200 transition-all">
                      Đăng Ký Miễn Phí
                    </button>
                  </Link>
                ) : (
                  <Link href="/tarot-draw">
                    <button className="px-16 py-6 bg-white text-black font-black text-xl rounded-full hover:bg-slate-200 transition-all">
                      Rút Bài Ngay
                    </button>
                  </Link>
                ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* 2. FOOTER NHÚNG VÀO CUỐI TRANG */}
      <Footer />
      <SocialFloating />
    </div>
  );
}
