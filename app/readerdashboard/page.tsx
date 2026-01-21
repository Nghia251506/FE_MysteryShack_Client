"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, Send, User, Calendar,
  CheckCircle2, Save, Feather, ChevronRight,
  Clock, Bold, Italic, List, Wand2, LayoutDashboard, History, Settings,
  HelpCircle, AlignLeft, Image as ImageIcon, XCircle, CheckCircle,MessageSquare, Timer,Eye, Download, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK DATA LỊCH SỬ ---
const HISTORY_DATA = [
  {
    id: "REQ-8820",
    querentName: "Trần Thế Tường",
    topic: "Vấn đề tình cảm hiện tại",
    status: "Completed",
    date: "22/05/2024",
    previewCards: ["RWS_Tarot_06_Lovers.jpg", "RWS_Tarot_13_Death.jpg", "RWS_Tarot_02_High_Priestess.jpg"]
  },
  {
    id: "REQ-8815",
    querentName: "Hoàng Thanh Trúc",
    topic: "Dự báo năng lượng tuần mới",
    status: "Completed",
    date: "20/05/2024",
    previewCards: ["RWS_Tarot_19_Sun.jpg", "RWS_Tarot_01_Magician.jpg", "RWS_Tarot_10_Wheel_of_Fortune.jpg"]
  }
];

// --- MOCK DATA ---
const PENDING_REQUESTS = [
  {
    id: "REQ-9981",
    querentName: "Nguyễn Vũ Nam Giang",
    topic: "Sự nghiệp & Tài chính tháng tới",
    question: "Tôi đang có ý định nhảy việc vào tháng sau, liệu tình hình tài chính có ổn định để tôi thực hiện thay đổi này không?",
    birthday: "18/08/1998",
    timestamp: "10:30 AM - 24/05/2024",
    previewCards: [
      { id: 1, name: "The Fool", img: "/tarot-deck/RWS_Tarot_00_Fool.jpg" },
      { id: 16, name: "The Tower", img: "/tarot-deck/RWS_Tarot_16_Tower.jpg" },
      { id: 19, name: "The Sun", img: "/tarot-deck/RWS_Tarot_19_Sun.jpg" }
    ]
  },
  {
    id: "REQ-9982",
    querentName: "Lê Minh Anh",
    topic: "Định hướng học tập năm 2026",
    question: "Em muốn biết liệu mình có cơ hội nhận học bổng du học trong năm nay không ạ?",
    birthday: "05/10/2000",
    timestamp: "02:15 PM - 24/05/2024",
    previewCards: [
      { id: 2, name: "The High Priestess", img: "/tarot-deck/RWS_Tarot_02_High_Priestess.jpg" },
      { id: 3, name: "The Empress", img: "/tarot-deck/RWS_Tarot_03_Empress.jpg" },
      { id: 10, name: "Wheel of Fortune", img: "/tarot-deck/RWS_Tarot_10_Wheel_of_Fortune.jpg" }
    ]
  }
];

const getLocalTarotImage = (filename: string) => `/tarot-deck/${filename}`;

const REQUEST_DATA = {
  requestId: "REQ-9981",
  querentName: "Nguyễn Vũ Nam Giang",
  topic: "Sự nghiệp & Tài chính tháng tới",
  birthday: "18/08/1998",
  timestamp: "10:30 AM - 24/05/2024",
  cards: [
    { id: 1, nameEn: "The Fool", imageUrl: getLocalTarotImage("RWS_Tarot_00_Fool.jpg"), isReversed: false, position: "Hiện tại", keywords: ["Khởi đầu mới", "Tự do", "Ngây thơ", "Mạo hiểm"] },
    { id: 16, nameEn: "The Tower", imageUrl: getLocalTarotImage("RWS_Tarot_16_Tower.jpg"), isReversed: true, position: "Thử thách", keywords: ["Thay đổi nội tại", "Tránh được tai họa", "Sợ hãi"] },
    { id: 19, nameEn: "The Sun", imageUrl: getLocalTarotImage("RWS_Tarot_19_Sun.jpg"), isReversed: false, position: "Kết quả", keywords: ["Thành công", "Niềm vui", "Sự thật", "Rạng rỡ"] },
  ],
};

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
  const [activeTab, setActiveTab] = useState<'requests' | 'workspace' | 'history'>('requests');
  const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [activeField, setActiveField] = useState<number | 'summary' | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCardInputChange = (id: number, value: string) => {
    setCardInputs(prev => ({ ...prev, [id]: value }));
  };
  
  // Logic hiển thị danh sách lịch sử có lọc theo tìm kiếm
  const filteredHistory = HISTORY_DATA.filter(item => 
    item.querentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // số lượng yêu cầu
  const newRequestsCount = PENDING_REQUESTS.length;
  // --- LOGIC ĐẾM NGƯỢC ---
  const [timeLeft, setTimeLeft] = useState(59 * 60 + 59); // 59 phút 59 giây = 3599 giây

  // 1. Hàm xử lý khi nhấn "Chấp nhận"
  const handleAcceptRequest = () => {
    // RESET bộ đếm về 59:59 trước khi vào workspace
    setTimeLeft(59 * 60 + 59); 
    // Reset trạng thái đã gửi (nếu trước đó đã gửi một yêu cầu khác)
    setIsSent(false);
    // Chuyển sang màn hình làm việc
    setActiveTab('workspace');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Chỉ đếm khi đang ở tab workspace và chưa gửi bài, và thời gian > 0
    if (activeTab === 'workspace' && !isSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    // Cleanup function để tránh rò rỉ bộ nhớ hoặc chạy chồng chéo
    return () => clearInterval(timer);
  }, [activeTab, isSent, timeLeft]); // Theo dõi cả 3 biến này

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  
  const handleSubmit = () => {
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
        <button 
            onClick={() => setActiveTab('requests')} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'requests' ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-lg' : 'text-slate-400 hover:bg-slate-800/30'}`}
          >
            <div className="flex items-center gap-3">
              <History className="w-5 h-5" />
              <span>Yêu cầu mới</span>
            </div>
            {newRequestsCount > 0 && (
              <span className="flex items-center justify-center bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full shadow-lg shadow-amber-900/40 animate-bounce">
                {newRequestsCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('workspace')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'workspace' ? 'bg-slate-800/50 text-amber-400 border border-slate-700/50' : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Workspace
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'history' ? 'bg-slate-800/50 text-amber-400 border border-slate-700/50' : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'}`}
          >
            <History className="w-5 h-5" /> Lịch sử luận giải
          </button>
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
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Online
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow h-screen overflow-y-auto custom-scrollbar relative pb-24">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0a0410] to-[#0a0410]"></div>

        <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
          <AnimatePresence mode="wait">
            
            {/* 1. GIAO DIỆN DANH SÁCH YÊU CẦU */}
            {activeTab === 'requests' && (
              <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <header className="mb-8">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Yêu cầu luận giải <span className="text-amber-500">mới</span></h2>
                  <p className="text-slate-400 mt-2">Xem trước trải bài và câu hỏi của khách hàng.</p>
                </header>

                <div className="grid gap-6">
                  {PENDING_REQUESTS.map((req) => (
                    <div key={req.id} className="bg-[#130823]/60 backdrop-blur-md border border-slate-800 rounded-[2rem] overflow-hidden hover:border-slate-600 transition-all shadow-xl group">
                      <div className="p-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                          {/* Left: Preview Cards */}
                          <div className="flex gap-2 shrink-0">
                            {req.previewCards.map((c, i) => (
                              <div key={i} className="relative w-16 h-28 md:w-20 md:h-32 rounded-lg border border-slate-700 overflow-hidden shadow-lg transform group-hover:rotate-0 transition-transform duration-500" style={{ rotate: `${(i - 1) * 5}deg`, marginLeft: i > 0 ? '-1rem' : '0' }}>
                                <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              </div>
                            ))}
                          </div>

                          {/* Middle: Content */}
                          <div className="flex-grow space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">{req.id}</span>
                              <span className="text-slate-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3"/> {req.timestamp}</span>
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{req.topic}</h3>
                              <div className="mt-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                <p className="text-sm text-slate-300 italic flex gap-2">
                                  <MessageSquare className="w-4 h-4 text-purple-500 shrink-0" /> "{req.question}"
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
                              <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800"><User className="w-3.5 h-3.5 text-purple-400"/> {req.querentName}</span>
                              <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800"><Calendar className="w-3.5 h-3.5 text-purple-400"/> {req.birthday}</span>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex lg:flex-col justify-end gap-3 shrink-0">
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
                              <XCircle className="w-4 h-4" /> Từ chối
                            </button>
                            <button 
                              onClick={handleAcceptRequest}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-all text-sm font-bold shadow-lg shadow-amber-900/40 hover:-translate-y-0.5"
                            >
                              <CheckCircle className="w-4 h-4" /> Chấp nhận
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. GIAO DIỆN WORKSPACE (GIỮ NGUYÊN CODE CỦA BẠN) */}
            {activeTab === 'workspace' && !isSent && (
              <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
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
                  {/* ĐỒNG HỒ ĐẾM NGƯỢC */}
                  <div className="flex flex-col items-center px-6 py-2 bg-slate-950/50 rounded-2xl border border-amber-500/20 shadow-inner min-w-[140px]">
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em] mb-1">Thời gian còn lại</span>
                    <div className={`text-3xl font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      <Timer className="w-5 h-5 text-amber-500" />
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </header>

                {/* UNIFIED WORKSPACE (Phần card và editor của bạn) */}
                <div className="bg-[#130823]/50 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-8 space-y-10 shadow-2xl">
                  {REQUEST_DATA.cards.map((card) => (
                    <div key={card.id} className="flex flex-col md:flex-row gap-8">
                       <div className="w-full md:w-40 shrink-0 flex flex-col items-center">
                          <img src={card.imageUrl} className={`w-40 h-64 object-cover rounded-xl border-4 border-slate-800 ${card.isReversed ? 'rotate-180' : ''}`} alt={card.nameEn} />
                          <h3 className="text-white font-bold mt-2">{card.nameEn}</h3>
                       </div>
                       <div className="flex-grow flex flex-col">
                          <EditorToolbar />
                          <textarea 
                            value={cardInputs[card.id] || ""}
                            onChange={(e) => handleCardInputChange(card.id, e.target.value)}
                            className="w-full h-48 bg-[#0a0410] border border-slate-800 p-4 rounded-b-xl outline-none"
                            placeholder="Nhập nội dung luận giải..."
                          />
                       </div>
                    </div>
                  ))}
                  
                  {/* Summary Section */}
                  <div className="pt-8 border-t border-slate-800">
                    <h3 className="text-xl font-bold text-amber-500 mb-4 flex items-center gap-2"><Sparkles/> Lời khuyên tổng kết</h3>
                    <EditorToolbar />
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full h-32 bg-[#0a0410] border border-slate-800 p-4 rounded-b-xl outline-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. GIAO DIỆN LỊCH SỬ LUẬN GIẢI (GIỮ CHỖ) */}
            {/* GIAO DIỆN LỊCH SỬ LUẬN GIẢI */}
            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Lịch sử luận giải</h2>
                    <p className="text-slate-400 mt-1">Quản lý và xem lại các phiên trải bài đã hoàn thành.</p>
                  </div>
                  
                  {/* Thanh tìm kiếm */}
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Tìm tên khách, chủ đề..."
                      className="bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-amber-500/50 transition-all w-full md:w-64 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </header>

                <div className="bg-[#130823]/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4 font-bold">Mã / Ngày</th>
                        <th className="px-6 py-4 font-bold">Khách hàng</th>
                        <th className="px-6 py-4 font-bold">Chủ đề</th>
                        <th className="px-6 py-4 font-bold">Trải bài</th>
                        <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="text-amber-500 font-mono text-xs font-bold mb-1">{item.id}</div>
                            <div className="text-slate-500 text-[11px] flex items-center gap-1"><Clock className="w-3 h-3"/> {item.date}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-white font-medium text-sm">{item.querentName}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-slate-300 text-sm truncate max-w-[200px]">{item.topic}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex -space-x-2">
                              {item.previewCards.map((img, i) => (
                                <img 
                                  key={i} 
                                  src={`/tarot-deck/${img}`} 
                                  className="w-8 h-12 object-cover rounded border border-slate-700 shadow-lg group-hover:translate-y-[-2px] transition-transform" 
                                  title="Xem bài"
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all" title="Xem chi tiết">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-500 transition-all" title="Tải PDF">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredHistory.length === 0 && (
                    <div className="py-20 text-center">
                      <History className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                      <p className="text-slate-500">Không tìm thấy kết quả nào phù hợp.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* MÀN HÌNH THÀNH CÔNG */}
            {isSent && (
              <motion.div key="success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center py-20">
                <CheckCircle2 className="w-20 h-20 text-green-400 mb-6" />
                <h2 className="text-4xl font-bold text-white mb-4">Hoàn Tất Luận Giải!</h2>
                <button onClick={() => { setIsSent(false); setActiveTab('requests'); }} className="px-8 py-3 bg-slate-800 rounded-xl">Quay về danh sách</button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* FLOATING ACTION BAR (Chỉ hiện khi ở workspace) */}
      {activeTab === 'workspace' && !isSent && (
        <div className="fixed bottom-6 left-0 md:left-64 right-0 z-40 px-4 flex justify-center">
          <div className="bg-[#0f0518]/90 border border-slate-700 p-2 pl-6 rounded-2xl flex items-center gap-5 shadow-2xl">
            <span className="text-white text-sm">Đã nhập {Object.keys(cardInputs).length}/3 lá</span>
            <button onClick={handleSubmit} className="bg-gradient-to-r from-amber-600 to-purple-600 px-6 py-2 rounded-xl text-white font-bold flex items-center gap-2">
              {isSubmitting ? "Đang gửi..." : "Gửi Kết Quả"} <Send className="w-4 h-4"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}