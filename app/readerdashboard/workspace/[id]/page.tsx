// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Clock, User, Calendar, Sparkles, QrCode, Send, 
//   Bold, Italic, Wand2, CheckCircle2, DollarSign, Timer, ArrowLeft 
// } from "lucide-react";
// import { ReadingSessionService } from "@/services/readingSessionService";
// import { InterpretationService } from "@/services/interpretationService";

// // --- HELPERS (Giữ nguyên từ code gốc của bạn) ---
// const getCardDetail = (id: number) => {
//   const safeId = Number(id);
//   const getImg = (prefix: string, num: number) => `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${num.toString().padStart(2, '0')}.jpg`;
//   if (safeId <= 22) {
//     const majors = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"];
//     return { name: majors[safeId - 1] || `Major #${safeId}`, img: getImg("ar", safeId - 1) };
//   }
//   const suits = [{ name: "Wands", code: "wa" }, { name: "Cups", code: "cu" }, { name: "Swords", code: "sw" }, { name: "Pentacles", code: "pe" }];
//   const minorIndex = safeId - 23; const suitIndex = Math.floor(minorIndex / 14); const rankIndex = minorIndex % 14;
//   const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
//   if (suitIndex < 4) return { name: `${ranks[rankIndex]} of ${suits[suitIndex].name}`, img: getImg(suits[suitIndex].code, rankIndex + 1) };
//   return { name: `Card #${safeId}`, img: "https://placehold.co/150x250?text=?" };
// };

// const getVietQR = (amount: number, content: string) => `https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`;

// const EditorToolbar = () => (
//   <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-white/5 text-slate-400 rounded-t-xl select-none">
//     <button className="p-1.5 hover:bg-white/10 rounded hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
//     <button className="p-1.5 hover:bg-white/10 rounded hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
//     <div className="w-px h-4 bg-white/10 mx-2"></div>
//     <button className="flex items-center gap-1 text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-md border border-purple-500/30 hover:bg-purple-500/30 transition-colors ml-auto"><Wand2 className="w-3 h-3" /> AI Gợi ý</button>
//   </div>
// );

// export default function WorkspacePage() {
//   const { id } = useParams();
//   const router = useRouter();

//   // -- STATES --
//   const [activeRequest, setActiveRequest] = useState<any>(null);
//   const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
//   const [summary, setSummary] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSent, setIsSent] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(3600);
//   const [confirmingPayment, setConfirmingPayment] = useState(false);

//   // -- FETCH & TRANSFORM DATA --
//   useEffect(() => {
//     const loadDetail = async () => {
//       try {
//         const response: any = await ReadingSessionService.getById(id);
//         const transformed = transformData(response);
//         setActiveRequest(transformed);
//       } catch (err) {
//         console.error("Error loading request:", err);
//         router.push("/readerdashboard");
//       }
//     };
//     loadDetail();
//   }, [id]);

//   const transformData = (item: any) => {
//     let rawCreatedAt = item.createdAt || item.created_at || item.timestamp || new Date().toISOString();
//     let cards: any[] = [];
//     try {
//       let raw = item.selectedCards;
//       if (typeof raw === 'string') raw = JSON.parse(raw);
//       if (Array.isArray(raw)) {
//         cards = raw.map((c: any, index: number) => {
//           const cardId = Number(c.cardId || c.id || 0);
//           const localInfo = getCardDetail(cardId);
//           return {
//             id: cardId || (1000 + index),
//             isReversed: c.isReversed || false,
//             name: c.nameVi || c.name || localInfo.name,
//             img: c.imageUrl || c.image || localInfo.img
//           };
//         });
//       }
//     } catch (e) { console.error("Transform cards error", e); }

//     return {
//       id: item.id,
//       querentName: item.customer?.fullName || "Khách ẩn danh",
//       topic: "Tổng quan",
//       question: item.question?.content || "Không có câu hỏi",
//       birthDate: item.customer?.birthDate ? new Date(item.customer.birthDate).toLocaleDateString('vi-VN') : "Chưa cung cấp",
//       timestamp: new Date(rawCreatedAt).toLocaleString('vi-VN'),
//       cards,
//       amount: item.amount || 50000,
//       rawCreatedAt
//     };
//   };

//   // -- TIMER LOGIC --
//   useEffect(() => {
//     if (!activeRequest || isSent) return;
//     const interval = setInterval(() => {
//       const startTime = new Date(activeRequest.rawCreatedAt).getTime();
//       const limitTime = startTime + (60 * 60 * 1000);
//       const remaining = Math.max(0, Math.floor((limitTime - Date.now()) / 1000));
//       setTimeLeft(remaining);
//       if (remaining <= 0) clearInterval(interval);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [activeRequest, isSent]);

//   // -- HANDLERS --
//   const handleSubmit = async () => {
//     if (!activeRequest) return;
//     setIsSubmitting(true);
//     try {
//       const payload = {
//         interpretation1: cardInputs[activeRequest.cards[0]?.id] || "Thông điệp lá 1",
//         interpretation2: cardInputs[activeRequest.cards[1]?.id] || "Thông điệp lá 2",
//         interpretation3: cardInputs[activeRequest.cards[2]?.id] || "Thông điệp lá 3",
//         advice: summary || "Lời khuyên từ Tarot",
//         qrPayment: getVietQR(activeRequest.amount, `Thanh toan don ${activeRequest.id}`)
//       };
//       await InterpretationService.submit(activeRequest.id, payload);
//       setIsSent(true);
//     } catch (e) {
//       alert("Gửi thất bại!");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleConfirmPayment = async () => {
//     setConfirmingPayment(true);
//     try {
//       await InterpretationService.confirmPayment(activeRequest.id);
//       router.push("/readerdashboard");
//     } catch (e) {
//       alert("Xác nhận thất bại!");
//     } finally {
//       setConfirmingPayment(false);
//     }
//   };

//   if (!activeRequest) return (
//     <div className="flex items-center justify-center h-screen text-slate-400 animate-pulse">
//       Đang khởi tạo không gian trải bài...
//     </div>
//   );

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-8 pb-32 relative z-10">
//       <AnimatePresence mode="wait">
//         {!isSent ? (
//           <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            
//             {/* Header Workspace */}
//             <div className="bg-[#130823]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
//               <div>
//                 <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs mb-4 transition-colors">
//                   <ArrowLeft className="w-3 h-3"/> Quay lại
//                 </button>
//                 <div className="flex items-center gap-3 mb-2">
//                   <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">#{activeRequest.id}</span>
//                   <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {activeRequest.timestamp}</span>
//                 </div>
//                 <h2 className="text-3xl font-bold text-white mb-2">{activeRequest.topic}</h2>
//                 <div className="flex gap-4 text-sm text-slate-300">
//                   <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-purple-400"/> {activeRequest.querentName}</span>
//                   <span className="w-px h-4 bg-white/10"></span>
//                   <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-400"/> {activeRequest.birthDate}</span>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center px-6 py-3 bg-black/20 rounded-2xl border border-white/5 min-w-[140px]">
//                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Hết hạn sau</span>
//                 <div className={`text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
//                   {Math.floor(timeLeft/60).toString().padStart(2,'0')}:{(timeLeft%60).toString().padStart(2,'0')}
//                 </div>
//               </div>
//             </div>

//             {/* Main Editor */}
//             <div className="bg-[#130823]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-10 shadow-2xl">
//               {activeRequest.cards.map((card: any) => (
//                 <div key={card.id} className="flex flex-col md:flex-row gap-8 pb-8 border-b border-white/5 last:border-0 last:pb-0">
//                   <div className="w-full md:w-48 shrink-0 flex flex-col items-center">
//                     <div className="relative group">
//                       <img src={card.img} className="w-40 h-64 object-cover rounded-xl border-2 border-white/10 shadow-lg group-hover:scale-105 transition-transform" alt={card.name} />
//                       {card.isReversed && <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">REV</div>}
//                     </div>
//                     <h3 className="text-white font-bold mt-3 text-center">{card.name}</h3>
//                   </div>
//                   <div className="flex-grow flex flex-col">
//                     <label className="text-xs font-bold text-slate-400 uppercase mb-2">Luận giải lá bài</label>
//                     <div className="flex-grow flex flex-col bg-black/20 rounded-xl border border-white/10 overflow-hidden focus-within:border-amber-500/50 transition-colors">
//                       <EditorToolbar />
//                       <textarea 
//                         value={cardInputs[card.id] || ""} 
//                         onChange={(e) => setCardInputs({...cardInputs, [card.id]: e.target.value})} 
//                         className="w-full h-40 bg-transparent border-none p-4 outline-none text-slate-200 text-sm leading-relaxed resize-none" 
//                         placeholder={`Nhập thông điệp cho lá ${card.name}...`} 
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
              
//               <div className="pt-8 border-t border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div>
//                   <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400"/> Lời khuyên tổng kết</h3>
//                   <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
//                     <EditorToolbar />
//                     <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full h-40 bg-transparent border-none p-4 outline-none text-slate-200 text-sm leading-relaxed resize-none" placeholder="Đúc kết lời khuyên..." />
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><QrCode className="w-4 h-4 text-green-400"/> Thanh toán</h3>
//                   <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex gap-4 items-center">
//                     <div className="p-2 bg-white rounded-lg">
//                       <img src={getVietQR(activeRequest.amount, `Thanh toan don ${activeRequest.id}`)} alt="QR" className="w-24 h-24"/>
//                     </div>
//                     <div className="space-y-2 flex-1">
//                       <div className="flex justify-between text-sm"><span className="text-slate-400">Số tiền:</span><span className="font-bold text-green-400">{activeRequest.amount.toLocaleString()} đ</span></div>
//                       <div className="text-xs text-slate-500">Mã QR tự động tạo dựa trên số tiền đơn hàng.</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Floating Action Bar */}
//             <div className="fixed bottom-6 left-0 md:left-64 right-0 z-40 px-4 flex justify-center">
//               <div className="bg-[#1a1025]/90 border border-white/10 p-2 pl-6 rounded-2xl flex items-center gap-6 shadow-2xl backdrop-blur-xl">
//                 <span className="text-slate-300 text-sm font-medium">
//                   Đã nhập: {Object.keys(cardInputs).length}/{activeRequest.cards.length} lá
//                 </span>
//                 <button 
//                   onClick={handleSubmit} 
//                   disabled={isSubmitting} 
//                   className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-2.5 rounded-xl text-white font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
//                 >
//                   {isSubmitting ? "Đang gửi..." : "Gửi Kết Quả"} <Send className="w-4 h-4"/>
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div key="success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center min-h-[70vh]">
//             <div className="bg-[#130823]/80 backdrop-blur-xl border border-green-500/30 rounded-[3rem] p-12 text-center shadow-2xl">
//               <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
//                 <CheckCircle2 className="w-10 h-10 text-green-400" />
//               </div>
//               <h2 className="text-4xl font-bold text-white mb-2">Đã Gửi Thành Công!</h2>
//               <p className="text-slate-400 mb-8">Vui lòng chờ khách hàng thanh toán.</p>
//               <button 
//                 onClick={handleConfirmPayment} 
//                 disabled={confirmingPayment} 
//                 className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all flex items-center gap-2 mx-auto"
//               >
//                 {confirmingPayment ? "Đang xử lý..." : <><DollarSign className="w-5 h-5" /> Xác Nhận Đã Nhận Tiền</>}
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }