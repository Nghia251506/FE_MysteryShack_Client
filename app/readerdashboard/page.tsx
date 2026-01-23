"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, Send, User, Calendar,
  CheckCircle2, Bold, Italic, List, Wand2, LayoutDashboard, History,
  Clock, MessageSquare, Timer, Search, Inbox, Feather, XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReadingSessionService } from "@/services/readingSessionService";

// --- DATA BỘ BÀI TAROT ---
const TAROT_DECK_MAP: Record<number, { name: string, img: string }> = {
  1: { name: "The Magician", img: "https://sacred-texts.com/tarot/pkt/img/ar01.jpg" },
  2: { name: "The High Priestess", img: "https://sacred-texts.com/tarot/pkt/img/ar02.jpg" },
  3: { name: "The Empress", img: "https://sacred-texts.com/tarot/pkt/img/ar03.jpg" },
  4: { name: "The Emperor", img: "https://sacred-texts.com/tarot/pkt/img/ar04.jpg" },
  5: { name: "The Hierophant", img: "https://sacred-texts.com/tarot/pkt/img/ar05.jpg" },
  6: { name: "The Lovers", img: "https://sacred-texts.com/tarot/pkt/img/ar06.jpg" },
  7: { name: "The Chariot", img: "https://sacred-texts.com/tarot/pkt/img/ar07.jpg" },
  8: { name: "Strength", img: "https://sacred-texts.com/tarot/pkt/img/ar08.jpg" },
  9: { name: "The Hermit", img: "https://sacred-texts.com/tarot/pkt/img/ar09.jpg" },
  10: { name: "Wheel of Fortune", img: "https://sacred-texts.com/tarot/pkt/img/ar10.jpg" },
  11: { name: "Justice", img: "https://sacred-texts.com/tarot/pkt/img/ar11.jpg" },
  12: { name: "The Hanged Man", img: "https://sacred-texts.com/tarot/pkt/img/ar12.jpg" },
  13: { name: "Death", img: "https://sacred-texts.com/tarot/pkt/img/ar13.jpg" },
  14: { name: "Temperance", img: "https://sacred-texts.com/tarot/pkt/img/ar14.jpg" },
  15: { name: "The Devil", img: "https://sacred-texts.com/tarot/pkt/img/ar15.jpg" },
  16: { name: "The Tower", img: "https://sacred-texts.com/tarot/pkt/img/ar16.jpg" },
  17: { name: "The Star", img: "https://sacred-texts.com/tarot/pkt/img/ar17.jpg" },
  18: { name: "The Moon", img: "https://sacred-texts.com/tarot/pkt/img/ar18.jpg" },
  19: { name: "The Sun", img: "https://sacred-texts.com/tarot/pkt/img/ar19.jpg" },
  20: { name: "Judgement", img: "https://sacred-texts.com/tarot/pkt/img/ar20.jpg" },
  21: { name: "The World", img: "https://sacred-texts.com/tarot/pkt/img/ar21.jpg" },
  22: { name: "The Fool", img: "https://sacred-texts.com/tarot/pkt/img/ar00.jpg" },
};

const getCardInfo = (id: number) => {
  return TAROT_DECK_MAP[id] || { name: `Lá bài #${id}`, img: "https://i.pinimg.com/564x/24/76/94/247694902b9cb5216d2df26c59d87042.jpg" };
};

const EditorToolbar = () => (
  <div className="flex items-center gap-1 p-2 border-b border-slate-800/60 bg-slate-900/50 text-slate-400 rounded-t-xl select-none">
    <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
    <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
    <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><List className="w-4 h-4" /></button>
    <div className="w-px h-4 bg-slate-700 mx-2"></div>
    <button className="flex items-center gap-1 text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-md border border-purple-500/30 hover:bg-purple-900/50 transition-colors ml-auto">
      <Wand2 className="w-3 h-3" /> AI Gợi ý
    </button>
  </div>
);

export default function ReaderDashboardProfessional() {
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const response: any = await ReadingSessionService.getAll();
        const dataList = Array.isArray(response) ? response : (response.content || []);

        if(Array.isArray(dataList)) {
            // Tắt bộ lọc Status để đảm bảo hiện dữ liệu
            const pending = dataList
                .filter((i: any) => i.status !== 'COMPLETED') 
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

  const transformData = (item: any) => {
      let cards: any[] = [];
      try {
          const raw = typeof item.selectedCards === 'string' ? JSON.parse(item.selectedCards) : item.selectedCards;
          if(Array.isArray(raw)) {
              cards = raw.map((id: number) => ({ id, ...getCardInfo(id) }));
          }
      } catch (e) {}

      let querentName = "Khách ẩn danh";
      if (item.customer) {
          querentName = item.customer.fullName || item.customer.username || "Khách hàng #" + item.customer.id;
      } else if (item.note) {
          const parts = item.note.split(' - ');
          if (parts[0]) querentName = parts[0].replace('KH: ', '');
      }

      let question = "Không có câu hỏi chi tiết";
      if (item.question && item.question.questionText) {
          question = item.question.questionText;
      } else if (item.note) {
           const parts = item.note.split(' - ');
           if (parts[2]) question = parts[2].replace('Hỏi: ', '');
      }

      let topic = "Tổng quan";
      if (item.note) {
           const parts = item.note.split(' - ');
           if (parts[1]) topic = parts[1].replace('Chủ đề: ', '');
      }

      return {
          id: item.id,
          querentName: querentName,
          topic: topic,
          question: question,
          timestamp: item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : "Vừa xong",
          cards: cards,
          rawNote: item.note,
          status: item.status
      };
  };

  const handleAcceptRequest = (request: any) => {
    setActiveRequest(request); 
    setTimeLeft(59 * 60 + 59); 
    setIsSent(false);          
    setCardInputs({});         
    setSummary("");
    setActiveTab('workspace'); 
  };

  // --- HÀM TỪ CHỐI (Mới thêm) ---
  const handleRejectRequest = (id: any) => {
      if(confirm("Bạn có chắc chắn muốn từ chối yêu cầu này không?")) {
          // Hiện tại chỉ xóa khỏi giao diện, sau này gọi API Delete
          setPendingRequests(prev => prev.filter(req => req.id !== id));
      }
  };

  const handleSubmit = async () => {
    if (!activeRequest) return;
    setIsSubmitting(true);

    try {
        await ReadingSessionService.update(activeRequest.id, {
            status: "COMPLETED",
            note: (activeRequest.rawNote || "") + " || ĐÃ TRẢ LỜI",
        });

        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
            fetchData(); 
        }, 1500);

    } catch (error) {
        alert("Có lỗi khi gửi kết quả!");
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

  const filteredHistory = completedRequests.filter(item => 
    item.querentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0410] text-slate-200 font-sans flex overflow-hidden">
      {/* SIDEBAR */}
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

        <div className="p-4 m-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-300"><User className="w-5 h-5" /></div>
          <div>
            <div className="text-sm font-medium text-white">Reader Giang</div>
            <div className="text-xs text-green-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Online</div>
          </div>
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
                                {req.cards.map((c: any, i: number) => (
                                <div key={i} className="relative w-16 h-28 md:w-20 md:h-32 rounded-lg border border-slate-700 overflow-hidden shadow-lg transform group-hover:rotate-0 transition-transform duration-500" style={{ rotate: `${(i - 1) * 5}deg`, marginLeft: i > 0 ? '-1rem' : '0' }}>
                                    <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                                </div>
                                ))}
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
                                </div>
                            </div>

                            {/* Actions (Đã thêm lại nút Từ Chối) */}
                            <div className="flex lg:flex-col justify-end gap-3 shrink-0">
                                <button 
                                  onClick={() => handleRejectRequest(req.id)}
                                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                                >
                                  <XCircle className="w-4 h-4" /> Từ chối
                                </button>
                                <button 
                                  onClick={() => handleAcceptRequest(req)} 
                                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-all text-sm font-bold shadow-lg shadow-amber-900/40 hover:-translate-y-0.5"
                                >
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

            {/* 2. GIAO DIỆN WORKSPACE */}
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
                  {activeRequest.cards.map((card: any) => (
                    <div key={card.id} className="flex flex-col md:flex-row gap-8">
                       <div className="w-full md:w-40 shrink-0 flex flex-col items-center">
                          <img src={card.img} className="w-40 h-64 object-cover rounded-xl border-4 border-slate-800" alt={card.name} />
                          <h3 className="text-white font-bold mt-2 text-center">{card.name}</h3>
                       </div>
                       <div className="flex-grow flex flex-col">
                          <EditorToolbar />
                          <textarea 
                            value={cardInputs[card.id] || ""}
                            onChange={(e) => setCardInputs({...cardInputs, [card.id]: e.target.value})}
                            className="w-full h-48 bg-[#0a0410] border border-slate-800 p-4 rounded-b-xl outline-none text-white focus:border-amber-500/50 transition-colors"
                            placeholder={`Nhập luận giải chi tiết cho lá ${card.name}...`}
                          />
                       </div>
                    </div>
                  ))}
                  
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
                <h2 className="text-4xl font-bold text-white mb-4">Hoàn Tất Luận Giải!</h2>
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
                Đã nhập {Object.keys(cardInputs).length}/{activeRequest.cards.length} lá
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