"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, Send, User, Calendar,
  CheckCircle2, Bold, Italic, List, Wand2, LayoutDashboard, History,
  Clock, MessageSquare, Timer, Search, Inbox, Feather, XCircle, LogOut,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReadingSessionService } from "@/services/readingSessionService";
import { InterpretationService } from "@/services/interpretationService";

// --- 1. LOGIC 78 LÁ BÀI (Helper Functions) ---
const getCardDetail = (id: number) => {
  const safeId = Number(id);
  const getImg = (prefix: string, num: number) => 
    `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${num.toString().padStart(2, '0')}.jpg`;

  // Major Arcana (1-22)
  if (safeId <= 22) {
    const majors = [
      "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", 
      "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", 
      "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", 
      "The Devil", "The Tower", "The Star", "The Moon", "The Sun", 
      "Judgement", "The World"
    ];
    return { name: majors[safeId - 1] || `Major #${safeId}`, img: getImg("ar", safeId - 1) };
  }

  // Minor Arcana (23-78)
  const suits = [
    { name: "Wands", code: "wa" }, { name: "Cups", code: "cu" },
    { name: "Swords", code: "sw" }, { name: "Pentacles", code: "pe" }
  ];
  const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

  const minorIndex = safeId - 23; 
  const suitIndex = Math.floor(minorIndex / 14);
  const rankIndex = minorIndex % 14;

  if (suitIndex < 4) {
    const suit = suits[suitIndex];
    return { name: `${ranks[rankIndex]} of ${suit.name}`, img: getImg(suit.code, rankIndex + 1) };
  }

  return { name: `Card #${safeId}`, img: "https://placehold.co/150x250?text=?" };
};

const EditorToolbar = () => (
  <div className="flex items-center gap-1 p-2 border-b border-slate-800/60 bg-slate-900/50 text-slate-400 rounded-t-xl select-none">
    <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
    <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
    <div className="w-px h-4 bg-slate-700 mx-2"></div>
    <button className="flex items-center gap-1 text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-md border border-purple-500/30 hover:bg-purple-900/50 transition-colors ml-auto">
      <Wand2 className="w-3 h-3" /> AI Gợi ý
    </button>
  </div>
);

export default function ReaderDashboardProfessional() {
  const router = useRouter();
  
  // States
  const [activeTab, setActiveTab] = useState<'requests' | 'workspace' | 'history'>('requests');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [completedRequests, setCompletedRequests] = useState<any[]>([]);
  const [activeRequest, setActiveRequest] = useState<any>(null); 
  
  const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(59 * 60 + 59); 
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem("accessToken"); 
        localStorage.removeItem("user"); 
        router.push("/login"); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const response: any = await ReadingSessionService.getAll();
        const dataList = Array.isArray(response) ? response : (response.content || []);

        if(Array.isArray(dataList)) {
            const pending = dataList
                .filter((i: any) => i.status !== 'COMPLETED' && i.status !== 'REJECTED') 
                .map(transformData);
            setPendingRequests(pending);

            const completed = dataList
                .filter((i: any) => i.status === 'COMPLETED')
                .map(transformData);
            setCompletedRequests(completed);
        }
    } catch (error) {
        console.error("❌ Lỗi tải dữ liệu:", error);
    }
  };

  // --- 2. XỬ LÝ DỮ LIỆU TỪ BACKEND (Fix lỗi null/rỗng) ---
  const transformData = (item: any) => {
      let cards: any[] = [];
      try {
          // Double Parse để xử lý lỗi backend stringify JSON nhiều lần
          let raw = item.selectedCards;
          if (typeof raw === 'string') {
            try { raw = JSON.parse(raw); } catch {}
          }
          if (typeof raw === 'string') {
            try { raw = JSON.parse(raw); } catch {}
          }

          if(Array.isArray(raw)) {
              cards = raw.map((c: any) => {
                  const id = typeof c === 'object' ? (c.id || c.cardId) : c; 
                  const isReversed = typeof c === 'object' ? (c.isReversed || false) : false;
                  if (!id) return null;
                  const info = getCardDetail(Number(id));
                  return { id: Number(id), isReversed, ...info };
              }).filter(Boolean);
          }
      } catch (e) {
          console.error("Lỗi parse cards:", e);
      }

      // Fix birthDate null
      let birthDateDisplay = "Chưa cung cấp";
      if (item.birthDate) {
          try {
             const d = new Date(item.birthDate);
             if (!isNaN(d.getTime())) {
                 birthDateDisplay = d.toLocaleDateString('vi-VN');
             } else {
                 birthDateDisplay = String(item.birthDate);
             }
          } catch(e) { birthDateDisplay = String(item.birthDate); }
      }

      let querentName = item.fullName || "Khách ẩn danh";
      let question = item.questionName || "Không có câu hỏi chi tiết";
      let topic = "Tổng quan";

      if (!item.fullName && item.note) {
          const parts = item.note.split(' - ');
          parts.forEach((p: string) => {
              if (p.includes('KH:')) querentName = p.replace('KH: ', '').trim();
              if (p.includes('Hỏi:')) question = p.replace('Hỏi: ', '').trim();
          });
      }

      return {
          id: item.id,
          querentName,
          topic,
          question,
          birthDate: birthDateDisplay,
          timestamp: item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : "Vừa xong",
          cards, 
          rawNote: item.note,
          status: item.status
      };
  };

  // --- API Actions ---
  const handleAcceptRequest = async (request: any) => {
    try {
        await ReadingSessionService.accept(request.id);
        setActiveRequest(request); 
        setTimeLeft(59 * 60 + 59); 
        setIsSent(false);          
        setCardInputs({});         
        setSummary("");
        setActiveTab('workspace'); 
    } catch (error: any) {
        alert("Lỗi: " + (error.response?.data?.message || "Không thể chấp nhận yêu cầu"));
    }
  };

  const handleRejectRequest = async (id: any) => {
      if(confirm("Bạn có chắc chắn muốn từ chối yêu cầu này không?")) {
          try {
              await ReadingSessionService.reject(id);
              setPendingRequests(prev => prev.filter(req => req.id !== id));
          } catch (error: any) {
              alert("Lỗi: " + (error.response?.data?.message || "Lỗi server"));
          }
      }
  };

  // --- LOGIC GỬI BÀI (QUAN TRỌNG: GỘP CHUỖI VỚI '|||') ---
  const handleSubmit = async () => {
    if (!activeRequest) return;
    setIsSubmitting(true);

    try {
        // Tạo chuỗi nội dung có cấu trúc để Frontend User dễ cắt (split)
        let structuredContent = "";
        
        // Phần 1: Header (Thông tin chung)
        structuredContent += `Khách hàng: ${activeRequest.querentName} - Sinh: ${activeRequest.birthDate}\n`;
        structuredContent += `Câu hỏi: ${activeRequest.question}`;
        structuredContent += "|||"; // Dấu phân cách section

        // Phần 2: Loop qua từng lá bài
        // Lưu ý: Nếu backend không trả về bài nào thì phần này sẽ trống, reader cần tự xử lý ở phần tổng kết
        if (activeRequest.cards.length > 0) {
            activeRequest.cards.forEach((card: any) => {
                const inputKey = card.id;
                const text = cardInputs[inputKey] || "Chưa có nội dung chi tiết cho lá bài này.";
                const orientation = card.isReversed ? "(Ngược)" : "(Xuôi)";
                
                structuredContent += `Lá bài: ${card.name} ${orientation}\n${text}`;
                structuredContent += "|||"; // Dấu phân cách mỗi lá
            });
        } else {
             // Trường hợp lỗi data không có bài, gửi placeholder để không bị lỗi index bên user
             structuredContent += "Dữ liệu bài bị thiếu từ hệ thống.\n(Vui lòng xem lời khuyên tổng kết)|||\n|||";
        }
        
        // Phần 3: Tổng kết
        structuredContent += `LỜI KHUYÊN TỔNG KẾT:\n${summary || "Chúc bạn mọi điều tốt lành."}`;

        // Gọi Service gửi đi
        await InterpretationService.submit(activeRequest.id, structuredContent);

        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
            fetchData(); 
        }, 1000);

    } catch (error: any) {
        alert(`Gửi thất bại: ${error.response?.data?.message || "Lỗi server"}`);
        setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTab === 'workspace' && !isSent && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, isSent, timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const filteredHistory = completedRequests.filter(item => item.querentName.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- GIAO DIỆN ---
  return (
    <div className="min-h-screen bg-[#0a0410] text-slate-200 font-sans flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0f0518] border-r border-slate-800 hidden lg:flex flex-col h-screen sticky top-0 z-50">
            <div className="p-6 flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                <Feather className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-lg font-bold text-white">Mystic Reader</h1>
            </div>
            
            <nav className="flex-grow px-4 space-y-2 mt-6">
            <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'requests' ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-lg' : 'text-slate-400 hover:bg-slate-800/30'}`}>
                <div className="flex items-center gap-3"><Inbox className="w-5 h-5" /> <span>Yêu cầu mới</span></div>
                {pendingRequests.length > 0 && <span className="bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{pendingRequests.length}</span>}
            </button>
            
            <button 
                onClick={() => activeRequest && setActiveTab('workspace')}
                disabled={!activeRequest} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'workspace' ? 'bg-slate-800/50 text-amber-400 border border-slate-700/50' : 'text-slate-400 hover:bg-slate-800/30 hover:text-white disabled:opacity-50'}`}
            >
                <LayoutDashboard className="w-5 h-5" /> Workspace
            </button>

            <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'history' ? 'bg-slate-800/50 text-amber-400 border border-slate-700/50' : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'}`}>
                <History className="w-5 h-5" /> Lịch sử
            </button>
            </nav>

            <div className="p-4 m-4">
                <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-300"><User className="w-5 h-5" /></div>
                    <div>
                        <div className="text-sm font-medium text-white">Reader Giang</div>
                        <div className="text-xs text-green-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Online</div>
                    </div>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 transition-colors text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-grow h-screen overflow-y-auto custom-scrollbar relative pb-24">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0a0410] to-[#0a0410]"></div>

            <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
            <AnimatePresence mode="wait">
                
                {/* 1. DANH SÁCH YÊU CẦU */}
                {activeTab === 'requests' && (
                <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <header className="mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Yêu cầu luận giải <span className="text-amber-500">mới</span></h2>
                    <p className="text-slate-400 mt-2">Danh sách chờ xử lý từ hệ thống.</p>
                    </header>

                    {pendingRequests.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 text-slate-500">
                            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50"/>
                            <p>Hiện không có yêu cầu nào.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                        {pendingRequests.map((req) => (
                            <div key={req.id} className="bg-[#130823]/60 backdrop-blur-md border border-slate-800 rounded-[2rem] overflow-hidden hover:border-slate-600 transition-all shadow-xl group">
                            <div className="p-8">
                                <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex gap-2 shrink-0">
                                    {req.cards.length > 0 ? req.cards.map((c: any, i: number) => (
                                    <div key={i} className="relative w-16 h-28 md:w-20 md:h-32 rounded-lg border border-slate-700 overflow-hidden shadow-lg transform group-hover:rotate-0 transition-transform duration-500" style={{ rotate: `${(i - 1) * 5}deg`, marginLeft: i > 0 ? '-1rem' : '0' }}>
                                        <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                                        {c.isReversed && <div className="absolute top-1 right-1 bg-red-600 text-white text-[8px] px-1 rounded font-bold">REV</div>}
                                    </div>
                                    )) : (
                                        <div className="w-32 h-28 flex flex-col items-center justify-center bg-slate-900/50 rounded-lg border border-slate-700 border-dashed text-slate-500">
                                            <AlertCircle className="w-6 h-6 mb-1 text-slate-600"/>
                                            <span className="text-[10px]">Lỗi dữ liệu</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow space-y-3">
                                    <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">#{req.id}</span>
                                    <span className="text-slate-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3"/> {req.timestamp}</span>
                                    </div>
                                    <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{req.topic}</h3>
                                    <div className="mt-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                        <p className="text-sm text-slate-300 italic flex gap-2"><MessageSquare className="w-4 h-4 text-purple-500 shrink-0" /> "{req.question}"</p>
                                    </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
                                    <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800"><User className="w-3.5 h-3.5 text-purple-400"/> {req.querentName}</span>
                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${req.birthDate === "Chưa cung cấp" ? 'bg-red-900/20 border-red-900/30 text-red-400' : 'bg-slate-900/50 border-slate-800'}`}>
                                        <Calendar className="w-3.5 h-3.5 text-blue-400"/> {req.birthDate}
                                    </span>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col justify-end gap-3 shrink-0">
                                    <button onClick={() => handleRejectRequest(req.id)} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
                                    <XCircle className="w-4 h-4" /> Từ chối
                                    </button>
                                    <button onClick={() => handleAcceptRequest(req)} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-all text-sm font-bold shadow-lg shadow-amber-900/40 hover:-translate-y-0.5">
                                    <CheckCircle2 className="w-4 h-4" /> Chấp nhận
                                    </button>
                                </div>
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}
                </motion.div>
                )}

                {/* 2. WORKSPACE */}
                {activeTab === 'workspace' && activeRequest && !isSent && (
                <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <header className="bg-[#130823]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Clock className="w-3.5 h-3.5" /> Nhận lúc: {activeRequest.timestamp}
                        <span className="text-slate-600">|</span>
                        <span className="text-amber-500 font-mono">#{activeRequest.id}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{activeRequest.topic}</h2>
                        <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                            <User className="w-4 h-4 text-purple-400" /> Querent: <span className="font-semibold text-white">{activeRequest.querentName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                            <Calendar className="w-4 h-4 text-blue-400" /> Sinh: <span className="font-semibold text-white">{activeRequest.birthDate}</span>
                        </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center px-6 py-2 bg-slate-950/50 rounded-2xl border border-amber-500/20 shadow-inner min-w-[140px]">
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em] mb-1">Thời gian còn lại</span>
                        <div className={`text-3xl font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        <Timer className="w-5 h-5 text-amber-500" />
                        {formatTime(timeLeft)}
                        </div>
                    </div>
                    </header>

                    <div className="bg-[#130823]/50 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-8 space-y-10 shadow-2xl">
                    
                    {/* KHU VỰC NHẬP LUẬN GIẢI */}
                    {activeRequest.cards.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-red-900/30 rounded-2xl bg-red-900/10">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy dữ liệu bài!</h3>
                            <p className="text-slate-400 max-w-lg mx-auto mb-4">
                                Backend hiện trả về danh sách rỗng. Hãy nhập lời khuyên tổng kết bên dưới.
                            </p>
                        </div>
                    ) : (
                        activeRequest.cards.map((card: any) => (
                            <div key={card.id} className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-40 shrink-0 flex flex-col items-center">
                                <img src={card.img} className="w-40 h-64 object-cover rounded-xl border-4 border-slate-800" alt={card.name} />
                                <h3 className="text-white font-bold mt-2 text-center">
                                    {card.name} 
                                    {card.isReversed && <span className="text-red-400 text-sm block">(Ngược)</span>}
                                </h3>
                            </div>
                            <div className="flex-grow flex flex-col">
                                <EditorToolbar />
                                <textarea 
                                    value={cardInputs[card.id] || ""}
                                    onChange={(e) => setCardInputs({...cardInputs, [card.id]: e.target.value})}
                                    className="w-full h-48 bg-[#0a0410] border border-slate-800 p-4 rounded-b-xl outline-none text-white focus:border-amber-500/50 transition-colors placeholder:text-slate-600"
                                    placeholder={`Nhập luận giải chi tiết cho lá ${card.name} ${card.isReversed ? '(Ngược)' : ''}...`}
                                />
                            </div>
                            </div>
                        ))
                    )}
                    
                    <div className="pt-8 border-t border-slate-800">
                        <h3 className="text-xl font-bold text-amber-500 mb-4 flex items-center gap-2"><Sparkles/> Lời khuyên tổng kết</h3>
                        <EditorToolbar />
                        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full h-32 bg-[#0a0410] border border-slate-800 p-4 rounded-b-xl outline-none text-white focus:border-amber-500/50 transition-colors" placeholder="Tóm tắt thông điệp và lời khuyên cho khách hàng..." />
                    </div>
                    </div>
                </motion.div>
                )}

                {/* 3. LỊCH SỬ LUẬN GIẢI */}
                {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Lịch sử luận giải</h2>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="text" placeholder="Tìm kiếm..." className="bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 outline-none w-64 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    </header>

                    <div className="bg-[#130823]/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4 font-bold">Mã / Ngày</th>
                            <th className="px-6 py-4 font-bold">Khách hàng</th>
                            <th className="px-6 py-4 font-bold">Chủ đề</th>
                            <th className="px-6 py-4 font-bold text-right">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                        {filteredHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-5">
                                <div className="text-amber-500 font-mono text-xs font-bold mb-1">#{item.id}</div>
                                <div className="text-slate-500 text-[11px]">{item.timestamp}</div>
                            </td>
                            <td className="px-6 py-5 text-white text-sm">{item.querentName}</td>
                            <td className="px-6 py-5 text-slate-300 text-sm">{item.topic}</td>
                            <td className="px-6 py-5 text-right"><span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs font-bold">Hoàn thành</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </motion.div>
                )}

                {/* MÀN HÌNH THÀNH CÔNG */}
                {isSent && (
                <motion.div key="success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center py-20">
                    <CheckCircle2 className="w-20 h-20 text-green-400 mb-6" />
                    <h2 className="text-4xl font-bold text-white mb-4">Gửi Luận Giải Thành Công!</h2>
                    <p className="text-slate-400 mb-6">Kết quả đã được chuyển đến khách hàng.</p>
                    <button onClick={() => { setIsSent(false); setActiveTab('requests'); }} className="px-8 py-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">Quay về danh sách</button>
                </motion.div>
                )}

            </AnimatePresence>
            </div>
        </main>

        {/* FLOATING BAR */}
        {activeTab === 'workspace' && activeRequest && !isSent && (
            <div className="fixed bottom-6 left-0 md:left-64 right-0 z-40 px-4 flex justify-center">
            <div className="bg-[#0f0518]/90 border border-slate-700 p-2 pl-6 rounded-2xl flex items-center gap-5 shadow-2xl backdrop-blur-md">
                <span className="text-white text-sm">
                    {activeRequest.cards.length > 0 
                        ? `Đã nhập ${Object.keys(cardInputs).length}/${activeRequest.cards.length} lá` 
                        : "Vui lòng nhập lời khuyên"}
                </span>
                <button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-amber-600 to-purple-600 px-6 py-2 rounded-xl text-white font-bold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50">
                {isSubmitting ? "Đang gửi..." : "Gửi Kết Quả"} <Send className="w-4 h-4"/>
                </button>
            </div>
            </div>
        )}
    </div>
  );
}