"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, MapPin, Phone, Mail, 
  Facebook, Instagram, Send, 
  CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- CUSTOM TIKTOK ICON (Vì Lucide có thể chưa hỗ trợ bản này) ---
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// --- CẤU HÌNH GOOGLE FORM ---
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfpe1TxgGEv7x94eUYMd0Y4INGNeY1QbY815jUqOvnfOFMikQ/formResponse";

const ENTRY_IDS = {
    name: "entry.556119113",      
    email: "entry.1660047032",    
    subject: "entry.1482290872",  
    message: "entry.1573380806"   
};

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const googleFormData = new FormData();
    googleFormData.append(ENTRY_IDS.name, formData.name);
    googleFormData.append(ENTRY_IDS.email, formData.email);
    googleFormData.append(ENTRY_IDS.subject, formData.subject);
    googleFormData.append(ENTRY_IDS.message, formData.message);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        mode: "no-cors",
        body: googleFormData,
      });

      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-3">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link href="/" className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative w-[60px] h-[60px] flex items-center justify-center">
                      <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full scale-75 group-hover:scale-105 transition-transform duration-700" />
                      <Image 
                        src="/logo.png" 
                        alt="Mystic Tarot Logo" 
                        width={60} 
                        height={60} 
                        className="relative z-10 transition-transform duration-500 group-hover:rotate-3 rounded-full shadow-lg shadow-amber-500/20"
                      />
                  </div>
                  <span className="font-bold text-2xl text-white tracking-tighter hidden sm:block">
                    Mystic<span className="text-amber-500">Tarot</span>
                  </span>
              </Link>
              <button 
                onClick={() => router.push('/tarot-draw')}
                className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-full transition-all text-sm shadow-lg backdrop-blur-sm"
              >
                Bắt đầu ngay
              </button>
          </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        
        {/* HERO */}
        <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6"
            >
                <Sparkles className="w-4 h-4" /> Kết nối với chúng tôi
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            >
                Chúng tôi luôn ở đây để <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-400">
                    lắng nghe câu chuyện của bạn
                </span>
            </motion.h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Dù bạn cần hỗ trợ về dịch vụ, hợp tác hay chỉ đơn giản là muốn chia sẻ trải nghiệm, hãy gửi tin nhắn cho Mystic Tarot.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LEFT COLUMN: INFO CARD */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-5 space-y-8"
            >
                {/* Contact Info Card */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-20 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-colors" />
                    
                    <h3 className="text-2xl font-bold text-white mb-8">Thông tin liên hệ</h3>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 text-amber-500 shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Email hỗ trợ</p>
                                <a href="mailto:tranvunamgiang98@gmail.com" className="text-white text-lg font-medium hover:text-amber-400 transition-colors">tranvunamgiang98@gmail.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 text-purple-500 shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Hotline</p>
                                <p className="text-white text-lg font-medium">090 123 4567 (8:00 - 22:00)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 text-green-500 shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Văn phòng</p>
                                <p className="text-white text-base font-medium leading-relaxed">
                                    Thành phố Hồ Chí Minh,<br />
                                    Việt Nam
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/10">
                        <p className="text-sm text-slate-500 mb-4 font-bold">Mạng xã hội</p>
                        <div className="flex gap-4">
                            {/* FACEBOOK */}
                            <a 
                                href="https://www.facebook.com/giangtran1808/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all text-slate-400 border border-white/5 hover:border-transparent hover:-translate-y-1"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>

                            {/* INSTAGRAM */}
                            <a 
                                href="https://www.instagram.com/tarotbycafenha/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all text-slate-400 border border-white/5 hover:border-transparent hover:-translate-y-1"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>

                            {/* TIKTOK */}
                            <a 
                                href="https://www.tiktok.com/@leoaslan98" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-black hover:text-white flex items-center justify-center transition-all text-slate-400 border border-white/5 hover:border-white/20 hover:-translate-y-1"
                            >
                                <TikTokIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* RIGHT COLUMN: FORM */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-7"
            >
                <div className="bg-[#130823]/80 border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl relative">
                    {/* Success Modal Overlay */}
                    <AnimatePresence>
                        {isSuccess && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 z-20 bg-[#130823] rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8"
                            >
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Gửi thành công!</h3>
                                <p className="text-slate-400 max-w-sm mb-8">Cảm ơn bạn đã liên hệ. Đội ngũ Mystic Tarot sẽ phản hồi bạn trong thời gian sớm nhất.</p>
                                <button 
                                    onClick={() => setIsSuccess(false)}
                                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                                >
                                    Gửi tin nhắn khác
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <h3 className="text-2xl font-bold text-white mb-6">Gửi tin nhắn trực tuyến</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Họ và tên</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all"
                                    placeholder="Nhập tên của bạn"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Chủ đề</label>
                            <input 
                                type="text" 
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all"
                                placeholder="VD: Hỗ trợ booking, Hợp tác..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nội dung tin nhắn</label>
                            <textarea 
                                name="message"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all resize-none"
                                placeholder="Hãy chia sẻ chi tiết vấn đề của bạn..."
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Đang gửi...' : (
                                <>Gửi tin nhắn <Send className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-black/40 py-12 mt-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                  <Image 
                    src="/logo.png" 
                    alt="Mystic Tarot Logo" 
                    width={40} 
                    height={40} 
                    className="rounded-full shadow-md shadow-amber-500/10 group-hover:scale-110 transition-transform"
                  />
                  <span className="font-bold text-white group-hover:text-amber-400 transition-colors">Mystic Tarot © 2025</span>
              </Link>
              <div className="flex gap-8 text-sm text-slate-500">
                  <a href="#" className="hover:text-amber-400 transition-colors">Điều khoản</a>
                  <a href="#" className="hover:text-amber-400 transition-colors">Bảo mật</a>
                  <a href="#" className="hover:text-amber-400 transition-colors">Liên hệ</a>
              </div>
          </div>
      </footer>
    </div>
  );
}