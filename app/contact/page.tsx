"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, MapPin, Phone, Mail, 
  Send, CheckCircle2, ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- IMPORT CÁC COMPONENT ĐỒNG BỘ ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialFloating from '@/components/SocialFloating';

// --- CẤU HÌNH GOOGLE FORM (Giữ nguyên logic của ông) ---
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
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col relative">
      
      {/* 1. HEADER CHUẨN HỆ THỐNG */}
      <Header />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex-grow">
        
        {/* HERO SECTION */}
        <div className="text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6"
            >
                <Sparkles className="w-3.5 h-3.5" /> Kết nối tâm linh
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]"
            >
                Lắng nghe <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-400 italic">câu chuyện</span> <br />
                của riêng bạn
            </motion.h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed italic">
                "Dù là trăn trở về định mệnh hay một ý tưởng hợp tác, Mystic Tarot luôn ở đây để đồng hành cùng bạn."
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT COLUMN: INFO CARDS */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-5 space-y-6"
            >
                <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group hover:border-amber-500/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-24 bg-amber-500/5 blur-[100px] rounded-full group-hover:bg-amber-500/10 transition-colors" />
                    
                    <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tighter">Thông tin liên hệ</h3>
                    
                    <div className="space-y-8 relative z-10">
                        <ContactInfoItem 
                            icon={Mail} 
                            label="Email hỗ trợ" 
                            value="mystictarot@mystictarots.xyz" 
                            link="mailto:mystictarot@mystictarots.xyz"
                            color="amber"
                        />
                        <ContactInfoItem 
                            icon={Phone} 
                            label="Hotline" 
                            value="0862273012" 
                            subValue="(8:00 - 22:00 hàng ngày)"
                            color="purple"
                        />
                        <ContactInfoItem 
                            icon={MapPin} 
                            label="Văn phòng" 
                            value="Thành phố Hà Nội, Việt Nam" 
                            color="green"
                        />
                    </div>
                </div>

                {/* Card phụ kích thích đặt lịch */}
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-amber-600/20 to-transparent border border-amber-500/10">
                    <h4 className="text-white font-bold mb-2">Bạn cần xem bài gấp?</h4>
                    <p className="text-slate-400 text-sm mb-6">Hãy sử dụng tính năng rút bài trực tuyến để nhận thông điệp ngay lập tức.</p>
                    <Link href="/tarot-draw" className="text-amber-500 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                        Rút bài ngay <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>

            {/* RIGHT COLUMN: CONTACT FORM */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-7"
            >
                <div className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 rounded-[3.5rem] backdrop-blur-xl relative shadow-2xl">
                    <AnimatePresence>
                        {isSuccess && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 z-20 bg-[#050505] rounded-[3.5rem] flex flex-col items-center justify-center text-center p-8"
                            >
                                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20 animate-bounce">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Gửi thành công!</h3>
                                <p className="text-slate-400 max-w-sm mb-10 font-light">Cảm ơn bạn. Đội ngũ Mystic Tarot đã tiếp nhận thông tin và sẽ phản hồi qua Email trong vòng 24h.</p>
                                <button 
                                    onClick={() => setIsSuccess(false)}
                                    className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 uppercase text-xs tracking-widest"
                                >
                                    Gửi thêm tin nhắn
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter">Gửi tin nhắn trực tuyến</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput 
                                label="Họ và tên" 
                                name="name" 
                                placeholder="Nhập tên của bạn" 
                                value={formData.name} 
                                onChange={handleChange} 
                            />
                            <FormInput 
                                label="Email liên hệ" 
                                name="email" 
                                type="email"
                                placeholder="name@example.com" 
                                value={formData.email} 
                                onChange={handleChange} 
                            />
                        </div>

                        <FormInput 
                            label="Chủ đề cần hỗ trợ" 
                            name="subject" 
                            placeholder="VD: Hợp tác, Lỗi thanh toán, Booking..." 
                            value={formData.subject} 
                            onChange={handleChange} 
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Nội dung chi tiết</label>
                            <textarea 
                                name="message"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-700 focus:outline-none focus:border-amber-500/30 focus:bg-transparent transition-all resize-none font-light"
                                placeholder="Hãy chia sẻ vấn đề của bạn để chúng tôi hỗ trợ tốt nhất..."
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isSubmitting ? 'Đang truyền tin...' : (
                                <>Gửi tin nhắn <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>

      </main>

      {/* 2. FOOTER CHUẨN HỆ THỐNG */}
      <Footer />

      {/* 3. SOCIAL MEDIA TỎA SÁNG */}
      <SocialFloating />
    </div>
  );
}

// --- HELPER COMPONENTS ---

const ContactInfoItem = ({ icon: Icon, label, value, subValue, link, color }: any) => {
    const colors: any = {
        amber: "text-amber-500 bg-amber-500/10",
        purple: "text-purple-500 bg-purple-500/10",
        green: "text-green-500 bg-green-500/10"
    };
    return (
        <div className="flex items-start gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shrink-0 ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
                {link ? (
                    <a href={link} className="text-white text-lg font-bold hover:text-amber-400 transition-colors">{value}</a>
                ) : (
                    <p className="text-white text-lg font-bold">{value}</p>
                )}
                {subValue && <p className="text-slate-500 text-xs mt-1 italic font-light">{subValue}</p>}
            </div>
        </div>
    );
};

const FormInput = ({ label, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">{label}</label>
        <input 
            required
            {...props}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-700 focus:outline-none focus:border-amber-500/30 focus:bg-transparent transition-all font-light"
        />
    </div>
);