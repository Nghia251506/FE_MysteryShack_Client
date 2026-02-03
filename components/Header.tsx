"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/features/authSlice";
import { AuthService } from "@/services/authService";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMounted(true);
    setIsMenuOpen(false);
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
      setIsMenuOpen(false);
      router.push("/");
      router.refresh();
    }
  };

  const navLinks = [
    { name: "Rút Bài", href: "/tarot-draw" },
    { name: "Tarot là gì?", href: "/what-is-tarot" },
    { name: "So Sánh", href: "/compare-tarot" },
    { name: "Về chúng tôi", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-[100] bg-[#050505]/60 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3 group relative z-[110]"
        >
          <div className="relative w-[40px] h-[40px]">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="rounded-full object-cover transition-transform group-hover:rotate-12"
            />
          </div>
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
              className={`text-sm font-bold transition-colors ${pathname === link.href ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}`}
            >
              {link.name}
            </Link>
          ))}
          {mounted && user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <Link
                href={user.role === "READER" ? "/readerdashboard" : "/profile"}
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xs">
                  {user.fullName?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">
                  {user.fullName}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-bold text-white px-5 py-2.5 hover:text-amber-500 transition-colors"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold text-white px-5 py-2.5 hover:text-amber-500 transition-colors"
              >
                Đăng ký
              </Link>
              <Link href="/tarot-draw">
                <button className="px-6 py-2.5 bg-amber-500 text-black font-black rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-amber-500/20">
                  Bắt đầu ngay
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="lg:hidden relative z-[110] p-2 text-white bg-white/5 rounded-xl border border-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* --- MOBILE NAV OVERLAY --- */}
        {/* --- MOBILE NAV OVERLAY (BẢN FIX TRIỆT ĐỂ LỖI TRÔI LÊN TRÊN) --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
              style={{ height: "100vh", width: "100vw" }}
            >
              {/* Click ra ngoài để đóng */}
              <div
                className="absolute inset-0"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu Block chính */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="relative w-full max-w-[350px] bg-[#0a0a0a] border border-amber-500/30 rounded-[3rem] p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] z-[1000] flex flex-col"
              >
                {/* Nút đóng X */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-amber-500 hover:text-black transition-all"
                >
                  <X size={24} />
                </button>

                {/* PHẦN 2: DANH SÁCH MENU (Đưa lên trên) */}
                <div className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`
                flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
                ${
                  pathname === link.href
                    ? "bg-amber-500 border-amber-500 text-black shadow-[0_8px_20px_rgba(245,158,11,0.3)]"
                    : "bg-white/[0.03] border-white/10 text-slate-300 hover:border-amber-500/50 hover:text-amber-500"
                }
              `}
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        {link.name}
                      </span>
                      <ChevronRight
                        size={16}
                        className={
                          pathname === link.href
                            ? "text-black"
                            : "text-amber-500/40"
                        }
                      />
                    </Link>
                  ))}
                </div>

                {/* KHOẢNG CÁCH & ĐƯỜNG KẺ NGĂN CÁCH (Fix lỗi dính) */}
                <div className="my-6 border-t border-white/10 w-full" />

                {/* PHẦN 1: THÔNG TIN USER / LOGIN (Đưa xuống dưới) */}
                <div className="w-full">
                  {mounted && user ? (
                    <div className="flex items-center justify-between bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                          {user.fullName?.charAt(0) || "U"}
                        </div>
                        <div className="max-w-[120px]">
                          <p className="text-[9px] text-amber-500/60 uppercase font-black tracking-widest">
                            Xin chào,
                          </p>
                          <p className="text-sm font-bold text-white truncate">
                            {user.fullName || user.username}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                      >
                        <LogOut size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href="/login"
                          className="py-3.5 bg-white/5 border border-white/10 text-white text-center rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10"
                        >
                          Đăng nhập
                        </Link>
                        <Link
                          href="/login"
                          className="py-3.5 bg-white text-black text-center rounded-xl font-black text-[10px] uppercase tracking-widest"
                        >
                          Đăng ký
                        </Link>
                      </div>
                      <Link
                        href="/tarot-draw"
                        className="block w-full py-4 bg-amber-500 text-black text-center rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_5px_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-transform"
                      >
                        Bắt đầu ngay
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
