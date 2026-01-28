'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Star, ArrowRight, 
  Heart, Briefcase, Wallet, Compass, 
  ChevronRight, LogOut, LayoutDashboard, User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; 
import { motion } from 'framer-motion';

// --- REDUX IMPORTS ---
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/features/authSlice';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [hoveredTopic, setHoveredTopic] = useState<number | null>(null);
  
  // --- LOGIC AUTH ---
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.refresh(); 
  };

  const topics = [
    {
      icon: Heart,
      title: 'Tình Duyên',
      description: 'Thấu hiểu cảm xúc, kết nối trái tim và định hướng những rạn nứt hay khởi đầu mới.',
      color: "from-pink-500/20 to-rose-500/20",
      accent: "text-rose-400",
      border: "hover:border-rose-500/50"
    },
    {
      icon: Briefcase,
      title: 'Sự Nghiệp',
      description: 'Khám phá tiềm năng ẩn giấu, thời cơ thăng tiến và những bước ngoặt trong công việc.',
      color: "from-blue-500/20 to-indigo-500/20",
      accent: "text-blue-400",
      border: "hover:border-blue-500/50"
    },
    {
      icon: Wallet,
      title: 'Tài Chính',
      description: 'Nhận diện vận may tiền bạc, quản lý dòng chảy năng lượng vật chất bền vững.',
      color: "from-emerald-500/20 to-teal-500/20",
      accent: "text-emerald-400",
      border: "hover:border-emerald-500/50"
    },
    {
      icon: Compass,
      title: 'Định Hướng',
      description: 'Tìm kiếm câu trả lời cho những băn khoăn về bản ngã và mục đích sống sâu thẳm.',
      color: "from-amber-500/20 to-orange-500/20",
      accent: "text-amber-400",
      border: "hover:border-amber-500/50"
    }
  ];

  const steps = [
    { id: '01', title: 'Tập trung tâm trí', desc: 'Lắng nghe trực giác, đặt câu hỏi và rút 3 lá bài từ bộ 78 lá cổ điển.' },
    { id: '02', title: 'Kết nối Reader', desc: 'Chọn bậc thầy Tarot đồng điệu với năng lượng của bạn để bắt đầu tham vấn.' },
    { id: '03', title: 'Nhận luận giải', desc: 'Đón nhận thông điệp chi tiết từ vũ trụ được cá nhân hóa cho riêng bạn.' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* 1. HIỆU ỨNG NỀN HUYỀN BÍ */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-15%] right-[-5%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-overlay"></div>
      </div>

      {/* 2. NAVIGATION BAR (HEADER ĐÃ THU NHỎ) */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 group">
            
            {/* LOGO HEADER NHỎ (50px) - ĐỒNG NHẤT VỚI CÁC TRANG CON */}
            <div className="relative w-[50px] h-[50px] flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-75 group-hover:scale-105 transition-transform duration-700" />
                <Image 
                  src="/logo.png" 
                  alt="Mystic Tarot Logo" 
                  width={50} 
                  height={50} 
                  className="relative z-10 transition-transform duration-500 group-hover:rotate-3 rounded-full shadow-lg shadow-amber-500/20"
                />
            </div>
            
            <span className="font-bold text-xl text-white tracking-tighter hidden sm:block">
              Mystic<span className="text-amber-500"> Tarot</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link href="/tarot-draw" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Rút Bài</Link>
            <Link href="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sứ mệnh</Link>
            
            <div className="h-4 w-px bg-white/10" />
            
            {user ? (
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Xin chào</p>
                    <p className="text-sm font-bold text-amber-500">{user.fullName || user.username}</p>
                 </div>
                 
                 {user.role === 'READER' ? (
                    <Link href="/readerdashboard">
                      <button className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-amber-400 transition-colors" title="Dashboard">
                         <LayoutDashboard className="w-5 h-5" />
                      </button>
                    </Link>
                 ) : (
                    <Link href="/profile">
                      <button className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-amber-400 transition-colors" title="Hồ sơ cá nhân">
                         <UserIcon className="w-5 h-5" />
                      </button>
                    </Link>
                 )}

                 <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-500/20 text-red-400 hover:bg-red-900/40 rounded-full text-xs font-bold transition-all">
                    <LogOut className="w-3 h-3" /> Thoát
                 </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-6 py-2 bg-white/5 border border-white/10 text-slate-200 hover:text-amber-400 hover:bg-white/10 rounded-full text-sm font-bold transition-all">
                    Đăng Nhập
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-full text-sm shadow-lg shadow-amber-900/20 hover:scale-105 transition-all">
                    Bắt đầu ngay
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        
        {/* 3. HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 md:pt-32 md:pb-56 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-black uppercase tracking-[0.2em] shadow-inner backdrop-blur-sm">
                <Sparkles className="w-4 h-4 animate-pulse" /> Huyền Bí Trong Từng Lá – Hy Vọng Trong Từng Lời
            </div>

            <h1 className="text-6xl md:text-[90px] font-extrabold text-white leading-[1.1] tracking-tighter">
              Hành Trình Khám Phá <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-400">
                Nội Tâm & Những Điều Sâu Thẳm
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
               Vượt qua những bộn bề, hãy để chúng tôi cùng bạn đi sâu vào nội tâm, 
               thấu hiểu bản sắc cá nhân và tìm thấy ánh sáng dẫn lối cho tương lai.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/tarot-draw">
                <button className="group relative px-12 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 text-black font-black text-lg rounded-2xl shadow-[0_0_50px_-10px_rgba(245,158,11,0.6)] hover:scale-[1.03] transition-all flex items-center justify-center gap-3 overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  Bắt Đầu Rút Bài <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/about">
                <button className="px-12 py-5 bg-white/5 border border-white/10 text-slate-200 font-bold text-lg rounded-2xl hover:bg-white/10 transition-all backdrop-blur-xl border-dashed">
                  Tìm hiểu thêm
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* 4. CONSULTATION TOPICS */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Chìa Khoá Mở Cửa Tâm Hồn</h2>
                  <p className="text-slate-500 text-lg max-w-md">Lựa chọn lĩnh vực bạn đang trăn trở để nhận được lời hồi đáp chính xác từ các reader uy tín của chúng tôi.</p>
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
                onMouseEnter={() => setHoveredTopic(index)}
                onMouseLeave={() => setHoveredTopic(null)}
                className={`relative group p-10 rounded-[3rem] bg-[#130823]/40 border border-white/5 backdrop-blur-2xl transition-all duration-500 cursor-default ${topic.border} shadow-2xl`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${topic.accent}`}>
                  <topic.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                  {topic.title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed group-hover:text-slate-300 transition-colors">
                  {topic.description}
                </p>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500">
                    Khám phá ngay <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section className="max-w-6xl mx-auto px-6 py-32">
            <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-purple-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 p-32 bg-amber-600/5 blur-[120px] rounded-full" />
                
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-20 text-center tracking-tight">Cách Thức <span className="text-amber-500">Kết Nối</span></h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
                    {steps.map((step, idx) => (
                        <div key={idx} className="space-y-8 text-center md:text-left group">
                            <span className="text-7xl font-black text-white/[0.03] block font-serif tracking-tighter group-hover:text-amber-500/10 transition-colors duration-500">{step.id}</span>
                            <div className="space-y-4">
                                <h4 className="text-2xl font-bold text-white group-hover:text-amber-500 transition-colors">{step.title}</h4>
                                <p className="text-slate-400 text-base leading-relaxed font-light">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 6. CALL TO ACTION */}
        <section className="max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="flex items-center justify-center gap-4">
              <Star className="w-6 h-6 text-amber-500/40" />
              <Star className="w-12 h-12 text-amber-400 fill-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] animate-pulse" />
              <Star className="w-6 h-6 text-amber-500/40" />
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight">
              Sẵn Sàng Khai Mở <br /> Chân Trời Mới?
            </h2>
            <p className="text-xl text-slate-400 max-w-xl mx-auto font-light">Đã đến lúc tìm thấy câu trả lời cho những trăn trở sâu thẳm nhất trong lòng bạn.</p>
            <div className="pt-8">
                {!user && (
                  <Link href="/register">
                    <button className="px-16 py-6 bg-white text-black font-black text-xl rounded-full shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-slate-200 hover:scale-105 transition-all">
                      Đăng Ký Miễn Phí
                    </button>
                  </Link>
                )}
                {user && (
                  <Link href="/tarot-draw">
                    <button className="px-16 py-6 bg-white text-black font-black text-xl rounded-full shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-slate-200 hover:scale-105 transition-all">
                      Rút Bài Ngay
                    </button>
                  </Link>
                )}
            </div>
            <div className="flex items-center justify-center gap-6 pt-10">
                <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                            <UserIcon className="w-5 h-5 text-slate-400" />
                        </div>
                    ))}
                </div>
                <p className="text-slate-500 text-sm font-medium">Hơn <span className="text-white">2,000+</span> tâm hồn đã được dẫn dắt thành công.</p>
            </div>
          </motion.div>
        </section>

      </main>

      {/* 7. FOOTER */}
      <footer className="border-t border-white/5 bg-[#050505] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-6 space-y-4">
                <div className="flex items-center gap-3">
                  {/* LOGO FOOTER (60px) */}
                  <Image 
                    src="/logo.png" 
                    alt="Mystic Tarot Logo" 
                    width={60} 
                    height={60} 
                    className="rounded-full shadow-lg shadow-amber-500/10"
                  />
                  <span className="font-bold text-2xl text-white tracking-tight">Mystic Tarot</span>
                </div>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-light">
                  Nền tảng tham vấn tâm linh và chiêm nghiệm tâm lý học hiện đại qua hệ thống biểu tượng Tarot.
                </p>
            </div>
            <div className="md:col-span-3 space-y-3">
                <h4 className="text-white font-bold text-xs uppercase tracking-widest">Nền tảng</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                    <li><Link href="/about" className="hover:text-amber-400 transition-colors">Về chúng tôi</Link></li>
                    <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Liên hệ hỗ trợ</Link></li>
                </ul>
            </div>
            <div className="md:col-span-3 space-y-3">
                <h4 className="text-white font-bold text-xs uppercase tracking-widest">Pháp lý</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                    <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Điều khoản dịch vụ</Link></li>
                    <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Chính sách bảo mật</Link></li>
                    <li><Link href="/disclaimer" className="hover:text-amber-400 transition-colors">Miễn trừ trách nhiệm</Link></li>
                </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-600 text-[10px] font-bold tracking-[0.3em] uppercase">
                © 2026 MYSTIC TAROT. BEYOND THE FUTURE.
              </p>
              <div className="flex gap-4">
                  <div className="w-6 h-6 bg-slate-900 rounded-full hover:bg-amber-500/50 transition-colors cursor-pointer border border-white/5" />
                  <div className="w-6 h-6 bg-slate-900 rounded-full hover:bg-amber-500/50 transition-colors cursor-pointer border border-white/5" />
              </div>
          </div>
        </div>
      </footer>
    </div>
  );
}