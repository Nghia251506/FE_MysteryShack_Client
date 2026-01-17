"use client";

import React, { useState } from "react";
import {
  Sparkles, Send, User, Calendar,
  CheckCircle2, Save, Feather, ChevronRight,
  Clock, Bold, Italic, List, Wand2, LayoutDashboard, History, Settings,
  HelpCircle, AlignLeft, Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. HÀM XỬ LÝ ẢNH LOCAL ---
// Quy tắc Next.js: File trong folder "public" sẽ được truy cập từ gốc "/"
// Ví dụ: public/tarot-deck/anh.jpg -> /tarot-deck/anh.jpg
const getLocalTarotImage = (filename: string) => {
  return `/tarot-deck/${filename}`;
};

const REQUEST_DATA = {
  requestId: "REQ-9981",
  querentName: "Nguyễn Vũ Nam Giang",
  topic: "Sự nghiệp & Tài chính tháng tới",
  birthday: "18/08/1998",
  timestamp: "10:30 AM - 24/05/2024",
  cards: [
    {
      id: 1,
      nameEn: "The Fool",
      // SỬA TÊN FILE CHO KHỚP VỚI ẢNH CHỤP MÀN HÌNH CỦA BẠN
      imageUrl: getLocalTarotImage("RWS_Tarot_00_Fool.jpg"),
      isReversed: false,
      position: "Hiện tại",
      keywords: ["Khởi đầu mới", "Tự do", "Ngây thơ", "Mạo hiểm"],
    },
    {
      id: 16,
      nameEn: "The Tower",
      // SỬA TÊN FILE CHO KHỚP
      imageUrl: getLocalTarotImage("RWS_Tarot_16_Tower.jpg"),
      isReversed: true,
      position: "Thử thách",
      keywords: ["Thay đổi nội tại", "Tránh được tai họa", "Sợ hãi"],
    },
    {
      id: 19,
      nameEn: "The Sun",
      // SỬA TÊN FILE CHO KHỚP (Giả định bạn có file này, nếu không hãy kiểm tra lại tên file Sun trong máy)
      imageUrl: getLocalTarotImage("RWS_Tarot_19_Sun.jpg"),
      isReversed: false,
      position: "Kết quả",
      keywords: ["Thành công", "Niềm vui", "Sự thật", "Rạng rỡ"],
    },
  ],
};

// --- COMPONENT: THANH CÔNG CỤ SOẠN THẢO ---
const EditorToolbar = () => (
  <div className="flex items-center gap-1 p-2 border-b border-slate-800/60 bg-slate-900/50 text-slate-400 rounded-t-xl select-none">
    <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
    <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
    <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><List className="w-4 h-4" /></button>
    <div className="w-px h-4 bg-slate-700 mx-2"></div>
    <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><AlignLeft className="w-4 h-4" /></button>
    <div className="flex-grow"></div>
    <button className="flex items-center gap-1 text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-md border border-purple-500/30 hover:bg-purple-900/50 transition-colors">
      <Wand2 className="w-3 h-3" /> AI Gợi ý
    </button>
  </div>
);

export default function ReaderDashboardProfessional() {
  const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [activeField, setActiveField] = useState<number | 'summary' | null>(null);

  const handleCardInputChange = (id: number, value: string) => {
    setCardInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(cardInputs).length === 0 && !summary.trim()) {
      alert("Vui lòng nhập nội dung luận giải!");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0410] text-slate-200 font-sans flex overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0f0518] border-r border-slate-800 hidden lg:flex flex-col h-screen sticky top-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
            <Feather className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-lg font-bold text-white">Mystic Reader</h1>
        </div>
        
        <nav className="flex-grow px-4 space-y-2 mt-6">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-amber-400 rounded-xl font-medium border border-slate-700/50">
            <LayoutDashboard className="w-5 h-5" /> Workspace
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/30 hover:text-white rounded-xl transition-colors">
            <History className="w-5 h-5" /> Lịch sử luận giải
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/30 hover:text-white rounded-xl transition-colors">
            <Settings className="w-5 h-5" /> Cài đặt
          </a>
        </nav>

        <div className="p-4 m-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Reader Giang</div>
            <div className="text-xs text-green-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> 
                Online
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow h-screen overflow-y-auto custom-scrollbar relative pb-24">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0a0410] to-[#0a0410]"></div>

        <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div 
                key="workspace"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* HEADER INFO */}
                <header className="bg-[#130823]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <Clock className="w-3.5 h-3.5" /> Nhận lúc: {REQUEST_DATA.timestamp}
                      <span className="text-slate-600">|</span>
                      <span className="text-amber-500 font-mono">{REQUEST_DATA.requestId}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{REQUEST_DATA.topic}</h2>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                        <User className="w-4 h-4 text-purple-400" /> Querent: <span className="font-semibold text-white">{REQUEST_DATA.querentName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                        <Calendar className="w-4 h-4 text-purple-400" /> NS: {REQUEST_DATA.birthday}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                     <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-xl">
                        <HelpCircle className="w-4 h-4"/> Hướng dẫn reader
                     </button>
                  </div>
                </header>

                {/* UNIFIED WORKSPACE */}
                <div className="bg-[#130823]/50 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-8 space-y-10 shadow-2xl">
                  
                  {/* CARD INPUT STREAMS */}
                  <div className="space-y-10 relative">
                    <div className="absolute left-[4.5rem] top-10 bottom-10 w-px bg-slate-800/50 hidden md:block"></div>

                    {REQUEST_DATA.cards.map((card, index) => (
                      <div 
                        key={card.id} 
                        className={`relative flex flex-col md:flex-row gap-8 group transition-all duration-300 ${activeField === card.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                        onFocus={() => setActiveField(card.id)}
                      >
                         {/* Position Marker */}
                        <div className="absolute left-[-2.25rem] top-8 w-4 h-4 bg-[#130823] border-2 border-slate-700 rounded-full z-10 hidden md:flex items-center justify-center">
                             <div className={`w-2 h-2 rounded-full transition-colors ${activeField === card.id ? 'bg-amber-500' : 'bg-slate-600'}`}></div>
                        </div>

                        {/* LEFT: CARD VISUAL */}
                        <div className="w-full md:w-40 shrink-0 flex flex-col items-center relative z-10">
                          <div className="relative w-32 h-52 md:w-40 md:h-64 perspective-1000 group-hover:-translate-y-1 transition-transform duration-300 bg-[#1e1b2e] rounded-xl border border-slate-800">
                            
                            {/* Loading Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                                <ImageIcon className="w-8 h-8 opacity-20" />
                            </div>

                            <div className="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* ẢNH BÀI TỪ LOCAL */}
                            <img 
                              src={card.imageUrl} 
                              alt={card.nameEn}
                              className={`relative w-full h-full object-cover rounded-xl shadow-2xl border-[3px] border-slate-800 group-hover:border-amber-500/40 transition-all duration-500 ${card.isReversed ? "rotate-180 ring-2 ring-red-900/60" : ""}`}
                            />

                            {card.isReversed && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <span className="bg-black/80 text-red-500 text-[10px] font-bold px-2 py-1 rounded rotate-180 uppercase border border-red-500/50 shadow-lg backdrop-blur-sm">Reversed</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 text-center">
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{card.position}</span>
                            <h3 className="text-lg font-bold text-white mt-1">{card.nameEn}</h3>
                          </div>
                        </div>

                        {/* RIGHT: PRO EDITOR */}
                        <div className="flex-grow flex flex-col">
                           <div className="mb-3 flex flex-wrap gap-2">
                            {card.keywords.map((kw, i) => (
                              <span key={i} className="text-[10px] bg-slate-950/50 text-slate-400 px-2.5 py-1 rounded-full border border-slate-800/80">
                                {kw}
                              </span>
                            ))}
                          </div>

                          <div className={`flex-grow flex flex-col bg-[#0a0410] border rounded-xl overflow-hidden transition-all duration-300 ${activeField === card.id ? 'border-amber-500/40 ring-1 ring-amber-500/20 shadow-lg shadow-amber-900/10' : 'border-slate-800 hover:border-slate-700'}`}>
                            <EditorToolbar />
                            <textarea 
                              value={cardInputs[card.id] || ""}
                              onChange={(e) => handleCardInputChange(card.id, e.target.value)}
                              placeholder={`Nhập nội dung giải nghĩa chi tiết cho lá bài này...`}
                              className="w-full flex-grow min-h-[220px] bg-transparent p-5 text-slate-200 text-base leading-relaxed outline-none resize-none placeholder-slate-600 custom-scrollbar font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SUMMARY SECTION */}
                  <div 
                    className={`pt-8 border-t border-slate-800/50 transition-all ${activeField === 'summary' ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                    onFocus={() => setActiveField('summary')}
                  >
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-300 flex items-center gap-2 mb-6">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      Lời Khuyên Tổng Quan & Đúc Kết
                    </h2>
                     <div className={`flex flex-col bg-[#0a0410] border rounded-xl overflow-hidden transition-all duration-300 ${activeField === 'summary' ? 'border-purple-500/40 ring-1 ring-purple-500/20 shadow-lg shadow-purple-900/10' : 'border-slate-800 hover:border-slate-700'}`}>
                        <EditorToolbar />
                        <textarea 
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                          placeholder="Tổng hợp lại thông điệp vũ trụ, đưa ra định hướng cụ thể cho Querent..."
                          className="w-full h-48 bg-transparent p-5 text-slate-200 text-base leading-relaxed outline-none resize-none placeholder-slate-600 custom-scrollbar font-sans"
                        />
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              // --- SUCCESS SCREEN ---
              <motion.div 
                key="success"
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                 <div className="relative mb-8">
                    <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 rounded-full" />
                    <div className="relative w-28 h-28 bg-gradient-to-br from-green-500/20 to-emerald-900/30 rounded-full flex items-center justify-center shadow-2xl border border-green-500/50 backdrop-blur-md">
                      <CheckCircle2 className="w-14 h-14 text-green-400" />
                    </div>
                  </div>
                <h2 className="text-4xl font-bold text-white mb-4">Hoàn Tất Luận Giải!</h2>
                <p className="text-slate-400 max-w-lg mx-auto text-lg mb-8 leading-relaxed">
                  Kết quả đã được gửi thành công đến khách hàng <strong className="text-amber-400">{REQUEST_DATA.querentName}</strong>.
                </p>
                <button 
                  onClick={() => { setIsSent(false); setCardInputs({}); setSummary(""); }}
                  className="group flex items-center gap-3 px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 transition-all font-medium shadow-lg"
                >
                  Tiếp tục với yêu cầu tiếp theo 
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- FLOATING ACTION BAR --- */}
      <AnimatePresence>
        {!isSent && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-0 md:left-64 right-0 z-40 px-4 flex justify-center pointer-events-none">
            <div className="bg-[#0f0518]/80 backdrop-blur-xl border border-slate-700/80 p-2 pl-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-5 pointer-events-auto">
              <div className="flex flex-col text-xs">
                <span className="text-slate-500 font-medium uppercase tracking-wider">Tiến độ</span>
                <span className="text-white font-bold">Đã nhập {Object.keys(cardInputs).length}/3 lá bài</span>
              </div>
              
              <div className="h-8 w-px bg-slate-800"></div>

              <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm font-medium border border-transparent hover:border-slate-700">
                    <Save className="w-4 h-4" /> Lưu nháp
                 </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <span className="animate-pulse">Đang gửi...</span> : <>Gửi Kết Quả <Send className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}