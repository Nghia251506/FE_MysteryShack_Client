'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050505] py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-4">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={50} 
                height={50} 
                className="rounded-full border border-amber-500/20"
              />
              <span className="font-black text-2xl text-white tracking-tighter uppercase">
                Mystic <span className="text-amber-500">Tarot</span>
              </span>
            </div>
            <p className="text-slate-500 text-base max-w-sm leading-relaxed font-medium">
              Nền tảng tham vấn tâm linh và chiêm nghiệm tâm lý học hiện đại qua hệ thống biểu tượng Tarot cổ điển.
            </p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-amber-500 font-black text-xs uppercase tracking-[0.3em]">Khám Phá</h4>
            <ul className="space-y-3 text-sm font-bold text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Liên hệ với chúng tôi</Link></li>
              <li><Link href="/what-is-tarot" className="hover:text-white transition-colors">Tarot là gì?</Link></li>
              <li><Link href="/compare-tarot" className="hover:text-white transition-colors">So sánh huyền học</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-amber-500 font-black text-xs uppercase tracking-[0.3em]">Pháp Lý</h4>
            <ul className="space-y-3 text-sm font-bold text-slate-400">
              <li><Link href="/terms" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Miễn trừ trách nhiệm</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-[10px] font-black tracking-[0.4em] uppercase">
            © 2026 MYSTIC TAROT. BEYOND THE FUTURE.
          </p>
          <div className="flex gap-8 text-[10px] font-black text-slate-500 tracking-widest uppercase">
            <span className="cursor-help hover:text-white transition-colors">Hà Nội</span>
            <span className="cursor-help hover:text-white transition-colors">Sài Gòn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}