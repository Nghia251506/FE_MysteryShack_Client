'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, LayoutDashboard, User as UserIcon, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/features/authSlice';
import { AuthService } from "@/services/authService";
import { AnimatePresence, motion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMounted(true);
    setIsMenuOpen(false); // Đóng menu khi chuyển trang
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      dispatch(logout());
      router.push('/');
      router.refresh();
    }
  };

  const navLinks = [
    { name: 'Rút Bài', href: '/tarot-draw', icon: <Sparkles className="w-5 h-5" /> },
    { name: 'Tarot là gì?', href: '/what-is-tarot', icon: <ChevronRight className="w-5 h-5" /> },
    { name: 'So Sánh', href: '/compare-tarot', icon: <ChevronRight className="w-5 h-5" /> },
    { name: 'Về chúng tôi', href: '/about', icon: <ChevronRight className="w-5 h-5" /> },
    { name: 'Liên hệ', href: '/contact', icon: <ChevronRight className="w-5 h-5" /> },
  ];

  return (
    <header className="sticky top-0 z-[100] bg-[#050505]/60 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group relative z-[110]">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={45} 
            height={45} 
            className="rounded-full transition-transform group-hover:rotate-12"
          />
          <span className="font-bold text-lg text-white tracking-tighter">
            Mystic<span className="text-amber-500"> Tarot</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-bold transition-colors ${pathname === link.href ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500 transition-colors'}`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-white/10" />

          {mounted && (
            user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden xl:block">
                  <p className="text-[10px] text-slate-500 uppercase font-black">Member</p>
                  <p className="text-sm font-bold text-amber-500">{user.fullName || user.username}</p>
                </div>
                <Link href={user.role === 'READER' ? '/readerdashboard' : '/profile'}>
                  <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-amber-500 hover:text-black transition-all">
                    {user.role === 'READER' ? <LayoutDashboard className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                  </button>
                </Link>
                <button onClick={handleLogout} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-bold text-white px-5 py-2.5 hover:text-amber-500 transition-colors">Đăng Nhập</Link>
                <Link href="/login" className="text-sm font-bold text-white px-5 py-2.5 hover:text-amber-500 transition-colors">Đăng ký</Link>
                <Link href="/tarot-draw">
                  <button className="px-6 py-2.5 bg-amber-500 text-black font-black rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-amber-500/20">
                    Bắt đầu ngay
                  </button>
                </Link>
              </div>
            )
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button className="lg:hidden relative z-[110] p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* MOBILE OVERLAY MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed inset-0 z-[105] bg-[#050505] flex flex-col p-8 pt-24"
            >
               {/* Nội dung menu mobile ông có thể copy từ bản cũ hoặc dùng bản rút gọn này */}
               <div className="space-y-6">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="flex items-center justify-between text-2xl font-black text-white border-b border-white/5 pb-4">
                      {link.name} <ChevronRight className="text-amber-500" />
                    </Link>
                  ))}
                  {!user && (
                    <div className="grid grid-cols-2 gap-4 pt-8">
                       <Link href="/login" className="py-4 bg-white/5 text-center rounded-2xl font-bold">Đăng Nhập</Link>
                       <Link href="/register" className="py-4 bg-amber-500 text-black text-center rounded-2xl font-black">Đăng Ký</Link>
                    </div>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}