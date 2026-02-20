"use client";

import React, { useState, useEffect } from "react";
import { LogOut, Menu, X, ChevronRight } from "lucide-react";
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
    // Khóa cuộn trang khi mở menu
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  // Tự động đóng menu khi chuyển trang
  useEffect(() => {
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
    { name: "Trang chủ", href: "/" },
    { name: "Rút Bài", href: "/tarot-draw" },
    { name: "Tarot là gì?", href: "/what-is-tarot" },
    { name: "Về chúng tôi", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="Logo" fill className="rounded-full object-cover" />
            </div>
            <span className="font-bold text-white tracking-tighter">
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
                    <Image
                      src={user?.profilePicture || "/default-avatar.png"}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
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

          {/* MOBILE TOGGLE - Nút mở Menu */}
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-white">
            <Menu size={28} />
          </button>
        </nav>
      </header>

      {/* --- MOBILE DRAWER OVERLAY --- */}
      {/* --- MOBILE DRAWER OVERLAY --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[9999]">
            {/* Backdrop tối nền - tạo cảm giác tách biệt hoàn toàn */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Menu Content trượt từ phải sang - Tông màu tối theo Background */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 w-[85%] max-w-[320px] h-full bg-[#0d0d0d] flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-white/5"
            >
              {/* Header của Menu: Amber & White Contrast */}
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <span className="font-black text-xs uppercase tracking-[0.3em] text-amber-500">
                  Danh mục
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Danh sách Links: Độ tương phản cao trên nền tối */}
              <div className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-8 py-5 transition-all duration-300 border-b border-white/[0.02] ${pathname === link.href
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-slate-200 hover:text-white hover:bg-white/[0.02]"
                      }`}
                  >
                    <span className="text-sm font-bold tracking-tight">
                      {link.name}
                    </span>
                    <ChevronRight
                      size={18}
                      className={pathname === link.href ? "text-amber-500" : "text-slate-600"}
                    />
                  </Link>
                ))}
              </div>

              {/* Phần Footer của Menu (User Card) - High Contrast */}
              <div className="p-6 bg-[#080808] border-t border-white/5">
                {mounted && user ? (
                  <div className="flex items-center justify-between bg-white/[0.03] p-4 rounded-2xl border border-white/10 shadow-inner">
                    <Link href={"/profile"}>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative w-10 h-10 rounded-full border-2 border-amber-500/30 overflow-hidden shrink-0">
                          <Image
                            src={user.profilePicture || "/default-avatar.png"}
                            alt="avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <p className="text-[9px] text-amber-500/60 uppercase font-black tracking-widest leading-none mb-1">
                            Xin chào,
                          </p>
                          <p className="text-sm font-bold text-white truncate">
                            {user.fullName || user.username}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link
                      href="/login"
                      className="block w-full py-4 bg-white text-black text-center rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/tarot-draw"
                      className="block w-full py-4 bg-amber-500 text-black text-center rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(245,158,11,0.2)] hover:scale-[1.02] transition-transform active:scale-95"
                    >
                      Bắt đầu ngay
                    </Link>
                  </div>
                )}

                {/* Social Dots - Giống ảnh mẫu ông gửi
                <div className="flex justify-center gap-4 mt-8 opacity-20">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  ))}
                </div> */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}