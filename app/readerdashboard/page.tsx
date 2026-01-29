"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Sparkles, Send, User, Calendar,
  CheckCircle2, Bold, Italic, Wand2, LayoutDashboard, History,
  Clock, MessageSquare, Timer, Search, Inbox, Feather, XCircle, LogOut,
  AlertCircle, QrCode, DollarSign, X, Info, AlertTriangle, List, CreditCard, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image"; // Ensure Image is imported
import { useRouter } from "next/navigation";
import { ReadingSessionService } from "@/services/readingSessionService";
import { InterpretationService } from "@/services/interpretationService";
import { logout } from "@/store/features/authSlice";
import { LogoutModal } from "@/components/LogoutModal";
import { RootState } from "@/store/store";
import { convertFileToBase64 } from "@/utils/fileUtils";
import { AuthService } from "@/services/authService"; // Import AuthService

// --- 1. TOAST NOTIFICATION SYSTEM ---
type ToastType = 'success' | 'error' | 'info';
interface ToastMsg { id: number; type: ToastType; message: string; }

const ToastContainer = ({ toasts, removeToast }: { toasts: ToastMsg[], removeToast: (id: number) => void }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="pointer-events-auto min-w-[300px] max-w-sm bg-[#1a1025]/90 border border-white/10 rounded-xl shadow-2xl p-4 flex items-start gap-3 backdrop-blur-md"
                    >
                        <div className={`mt-0.5 p-1 rounded-full ${
                            toast.type === 'success' ? 'bg-green-500/20 text-green-400' :
                            toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4"/> : toast.type === 'error' ? <AlertCircle className="w-4 h-4"/> : <Info className="w-4 h-4"/>}
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-sm font-bold ${toast.type === 'success' ? 'text-green-400' : toast.type === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
                                {toast.type === 'success' ? 'Thành Công' : toast.type === 'error' ? 'Lỗi' : 'Thông báo'}
                            </h4>
                            <p className="text-slate-300 text-xs mt-1">{toast.message}</p>
                        </div>
                        <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-white transition-colors"><X className="w-4 h-4"/></button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// --- 2. HELPERS ---
const getCardDetail = (id: number) => {
  const safeId = Number(id);
  const getImg = (prefix: string, num: number) => `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${num.toString().padStart(2, '0')}.jpg`;
  if (safeId <= 22) {
    const majors = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"];
    return { name: majors[safeId - 1] || `Major #${safeId}`, img: getImg("ar", safeId - 1) };
  }
  const suits = [{ name: "Wands", code: "wa" }, { name: "Cups", code: "cu" }, { name: "Swords", code: "sw" }, { name: "Pentacles", code: "pe" }];
  const minorIndex = safeId - 23; const suitIndex = Math.floor(minorIndex / 14); const rankIndex = minorIndex % 14;
  const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
  if (suitIndex < 4) return { name: `${ranks[rankIndex]} of ${suits[suitIndex].name}`, img: getImg(suits[suitIndex].code, rankIndex + 1) };
  return { name: `Card #${safeId}`, img: "https://placehold.co/150x250?text=?" };
};

const getVietQR = (amount: number, content: string) => `https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`;

const EditorToolbar = () => (
  <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-white/5 text-slate-400 rounded-t-xl select-none">
    <button className="p-1.5 hover:bg-white/10 rounded hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
    <button className="p-1.5 hover:bg-white/10 rounded hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
    <div className="w-px h-4 bg-white/10 mx-2"></div>
    <button className="flex items-center gap-1 text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-md border border-purple-500/30 hover:bg-purple-500/30 transition-colors ml-auto"><Wand2 className="w-3 h-3" /> AI Gợi ý</button>
  </div>
);

// --- 3. MODALS ---
const PaymentConfirmationModal = ({ isOpen, onClose, onConfirm, amount, loading }: any) => {
    if (!isOpen) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-sm w-full bg-[#1a1025] border border-green-500/30 rounded-[2rem] p-8 text-center shadow-2xl relative">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 bg-green-500/10 border-green-500/50 text-green-400"><DollarSign className="w-10 h-10" /></div>
                <h3 className="text-2xl font-bold text-white mb-2">Xác nhận tiền về</h3>
                <p className="text-slate-400 text-sm mb-6">Bạn xác nhận đã nhận được khoản thanh toán <span className="text-green-400 font-bold">{amount?.toLocaleString('vi-VN')} đ</span>?</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-all">Hủy</button>
                    <button onClick={onConfirm} disabled={loading} className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all shadow-lg shadow-green-900/20 disabled:opacity-70">{loading ? 'Đang xử lý...' : 'Đã nhận tiền'}</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const RejectConfirmationModal = ({ isOpen, onClose, onConfirm }: any) => {
    if (!isOpen) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-sm w-full bg-[#1a1025] border border-red-500/30 rounded-[2rem] p-8 text-center shadow-2xl relative">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 bg-red-500/10 border-red-500/50 text-red-400"><AlertTriangle className="w-10 h-10" /></div>
                <h3 className="text-2xl font-bold text-white mb-2">Từ chối yêu cầu?</h3>
                <p className="text-slate-400 text-sm mb-6">Bạn có chắc chắn muốn từ chối yêu cầu này? Yêu cầu sẽ được chuyển cho Reader khác.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-all">Quay lại</button>
                    <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-900/20">Từ chối</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- REQUEST CARD (STYLE PROFILE) ---
const RequestCard = ({ req, onAccept, onReject }: { req: any, onAccept: any, onReject: any }) => {
    const [displayTime, setDisplayTime] = useState<string>("--:--");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            if (!req.rawCreatedAt) return 0;
            const createdTime = new Date(req.rawCreatedAt).getTime();
            const expireTime = createdTime + (5 * 60 * 1000); // 5 phút
            const now = Date.now();
            return Math.floor((expireTime - now) / 1000);
        };

        let diffInSeconds = calculateTime();
        if (diffInSeconds <= 0 && !isExpired) {
            setDisplayTime("00:00"); setIsExpired(true); onReject(req.id, true); return;
        }

        const interval = setInterval(() => {
            diffInSeconds = calculateTime();
            if (diffInSeconds <= 0) {
                setDisplayTime("00:00"); if (!isExpired) { setIsExpired(true); onReject(req.id, true); }
                clearInterval(interval);
            } else {
                const minutes = Math.floor(diffInSeconds / 60); const seconds = diffInSeconds % 60;
                setDisplayTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [req.rawCreatedAt, req.id, onReject, isExpired]);

    return (
        <div className="bg-[#130823]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 mb-6 relative overflow-hidden shadow-xl hover:border-white/20 transition-all group">
            {/* Progress Bar Timer */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                <motion.div initial={{ width: "100%" }} animate={{ width: displayTime === "00:00" ? "0%" : `${(Math.max(0, (new Date(req.rawCreatedAt).getTime() + 300000 - Date.now()) / 3000))}%` }} transition={{ duration: 1, ease: "linear" }} className={`h-full ${displayTime === "00:00" ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 text-white pt-2">
                {/* Card Images */}
                <div className="flex gap-2 shrink-0 min-w-[120px]">
                    {req.cards.length > 0 ? req.cards.map((c: any, i: number) => (
                        <div key={i} className="relative w-16 h-24 rounded-lg border border-white/10 overflow-hidden shadow-lg" style={{ rotate: `${(i - 1) * 6}deg`, marginLeft: i > 0 ? '-1rem' : '0' }}>
                            <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                            {c.isReversed && <div className="absolute top-0.5 right-0.5 bg-red-600/90 text-white text-[6px] px-1 rounded">REV</div>}
                        </div>
                    )) : (
                        <div className="w-16 h-24 bg-white/5 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-[10px] text-slate-500">Empty</div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-grow space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">#{req.id}</span>
                            <span className="text-slate-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3"/> {req.timestamp}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 font-mono font-bold text-xs px-2 py-0.5 rounded-full border ${displayTime === "00:00" ? 'text-red-400 border-red-500/30 bg-red-500/10 animate-pulse' : 'text-green-400 border-green-500/30 bg-green-500/10'}`}><Timer className="w-3 h-3"/> {displayTime}</div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide">{req.topic}</h3>
                        <p className="text-sm text-slate-300 italic mt-1 line-clamp-2">"{req.question}"</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5"><User className="w-3 h-3 text-purple-400"/> {req.querentName}</span>
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5"><Calendar className="w-3 h-3 text-blue-400"/> {req.birthDate}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col justify-end gap-2 shrink-0">
                    <button onClick={() => onReject(req.id, false)} className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold flex items-center justify-center gap-1"><XCircle className="w-3 h-3"/> Từ chối</button>
                    <button onClick={() => onAccept(req)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3"/> Chấp nhận</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD ---
export default function ReaderDashboardProfessional() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // -- STATES --
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const addToast = (type: ToastType, message: string) => {
      const id = Date.now(); setToasts(prev => [...prev, { id, type, message }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000); 
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'workspace' | 'history'>('requests');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [completedRequests, setCompletedRequests] = useState<any[]>([]);
  const [activeRequest, setActiveRequest] = useState<any>(null); 
  const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [rejectModal, setRejectModal] = useState<{isOpen: boolean, id: number | null}>({isOpen: false, id: null});

  const [timeLeft, setTimeLeft] = useState(3600); 
  const [searchTerm, setSearchTerm] = useState("");
  const [ignoredIds, setIgnoredIds] = useState<number[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [qrBase64, setQrBase64] = useState<string>("");

  useEffect(() => { setIsMounted(true); }, []);

  const handleLogoutClick = () => setShowLogoutModal(true);
  
  const handleConfirmLogout = async () => {
    try {
        await AuthService.logout();
    } catch (error) {
        console.error("Lỗi khi gọi API logout:", error);
    } finally {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        dispatch(logout()); 
        router.push("/login");
    }
  };

  const handleQrUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) { try { const base64 = await convertFileToBase64(file); setQrBase64(base64); } catch { addToast('error', "Lỗi tải ảnh QR"); } }
  };

  // --- FETCHING LOGIC ---
  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 5000); return () => clearInterval(interval); }, [ignoredIds, user]); 

  // Timer Workspace
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTab === 'workspace' && activeRequest && !isSent) {
      const calculateWorkspaceTime = () => {
          const startTime = new Date(activeRequest.rawCreatedAt).getTime();
          const limitTime = startTime + (60 * 60 * 1000); 
          const now = Date.now();
          return Math.max(0, Math.floor((limitTime - now) / 1000));
      };
      
      setTimeLeft(calculateWorkspaceTime());
      timer = setInterval(() => {
          const remaining = calculateWorkspaceTime();
          setTimeLeft(remaining);
          if (remaining <= 0) clearInterval(timer);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, activeRequest, isSent]);

  const fetchData = async () => {
    if (!user) return;
    try {
        const response: any = await ReadingSessionService.getAll();
        const dataList = Array.isArray(response) ? response : (response.content || []);
        if(Array.isArray(dataList)) {
            const pending = dataList.filter((i: any) => (i.status === 'PENDING' || i.status === 'MATCHED') && i.status !== 'REJECTED' && !ignoredIds.includes(i.id)).map(transformData);
            setPendingRequests(pending);
            const completed = dataList.filter((i: any) => i.status === 'COMPLETED').map(transformData);
            setCompletedRequests(completed);
        }
    } catch (error) { console.error("Error fetching:", error); }
  };

  const transformData = (item: any) => {
      let rawCreatedAt = item.createdAt || item.created_at || item.timestamp;
      if (!rawCreatedAt && typeof window !== 'undefined') {
          const key = `session_created_at_${item.id}`; const stored = localStorage.getItem(key);
          if (stored) rawCreatedAt = stored; else { rawCreatedAt = new Date().toISOString(); localStorage.setItem(key, rawCreatedAt); }
      }
      
      let cards: any[] = [];
      try {
          let raw = item.selectedCards; if (typeof raw === 'string') try { raw = JSON.parse(raw); } catch {}
          if(Array.isArray(raw) && raw.length > 0) {
              cards = raw.map((c: any, index: number) => {
                  const id = Number(c.cardId || c.id || 0); const isReversed = typeof c === 'object' ? (c.isReversed || false) : false;
                  const serverName = c.nameVi || c.name; const serverImg = c.imageUrl || c.image || c.img; const localInfo = getCardDetail(id);
                  return { id: id || (1000 + index), isReversed, name: serverName || localInfo.name, img: serverImg || localInfo.img };
              });
          }
      } catch (e) { }
      
      let birthDateDisplay = "Chưa cung cấp"; const rawDob = item.customer?.birthDate || item.birthDate;
      if(rawDob) { try { if (Array.isArray(rawDob)) birthDateDisplay = `${rawDob[2]}/${rawDob[1]}/${rawDob[0]}`; else { const d = new Date(rawDob); birthDateDisplay = !isNaN(d.getTime()) ? d.toLocaleDateString('vi-VN') : String(rawDob); } } catch { birthDateDisplay = String(rawDob); } }
      let querentName = item.customer?.fullName || item.fullName || "Khách ẩn danh";
      let questionContent = item.question?.content || item.question?.questionText || item.questionName || "Không có câu hỏi";
      if (item.note && (querentName === "Khách ẩn danh" || querentName === "customer")) { if (item.note.includes("KH:")) querentName = item.note.split("KH:")[1].split("-")[0].trim(); }

      return { id: item.id, querentName, topic: "Tổng quan", question: questionContent, birthDate: birthDateDisplay, timestamp: new Date(rawCreatedAt).toLocaleString('vi-VN'), cards, rawNote: item.note, status: item.status, amount: item.amount || 50000, rawCreatedAt };
  };

  // --- HANDLERS ---
  const handleAcceptRequest = async (request: any) => {
    try { await ReadingSessionService.accept(request.id); setActiveRequest(request); setIsSent(false); setCardInputs({}); setSummary(""); setActiveTab('workspace'); addToast('success', 'Đã nhận yêu cầu! Bắt đầu luận giải.'); } 
    catch (e: any) { addToast('error', e.message || "Lỗi khi nhận yêu cầu"); }
  };

  const handleRejectRequest = async (id: any, isAuto: boolean = false) => {
      if (isAuto) { setIgnoredIds(prev => [...prev, id]); setPendingRequests(prev => prev.filter(req => req.id !== id)); try { await ReadingSessionService.reject(id); addToast('info', `Yêu cầu #${id} đã hết hạn.`); } catch (e) {} } 
      else { setRejectModal({ isOpen: true, id: id }); }
  };

  const handleConfirmReject = async () => {
      const id = rejectModal.id; if (!id) return;
      setRejectModal({ isOpen: false, id: null }); setIgnoredIds(prev => [...prev, id]); setPendingRequests(prev => prev.filter(req => req.id !== id));
      try { await ReadingSessionService.reject(id); addToast('success', 'Đã từ chối yêu cầu.'); } catch (e: any) { addToast('error', "Lỗi khi từ chối yêu cầu"); setIgnoredIds(prev => prev.filter(i => i !== id)); }
  };

  const handleSubmit = async () => {
    if (!activeRequest) return; setIsSubmitting(true);
    try {
        const card1Content = activeRequest.cards[0] ? (cardInputs[activeRequest.cards[0].id] || "") : "";
        const card2Content = activeRequest.cards[1] ? (cardInputs[activeRequest.cards[1].id] || "") : "";
        const card3Content = activeRequest.cards[2] ? (cardInputs[activeRequest.cards[2].id] || "") : "";
        const interp1 = card1Content.trim() !== "" ? card1Content : "Lá bài 1 - Năng lượng khởi đầu.";
        const interp2 = card2Content.trim() !== "" ? card2Content : "Lá bài 2 - Năng lượng trung tâm.";
        const interp3 = card3Content.trim() !== "" ? card3Content : "Lá bài 3 - Năng lượng kết thúc.";
        const adviceText = summary.trim() !== "" ? summary : "Tarot khuyên querent nên lắng nghe trực giác nội tâm.";
        const qrLink = qrBase64 || getVietQR(activeRequest.amount, `Thanh toan don ${activeRequest.id}`);
        const payload = { interpretation1: interp1, interpretation2: interp2, interpretation3: interp3, advice: adviceText, qrPayment: qrLink };
        await InterpretationService.submit(activeRequest.id, payload);
        setTimeout(() => { setIsSubmitting(false); setIsSent(true); fetchData(); addToast('success', 'Đã gửi bài giải thành công!'); }, 1500);
    } catch (e: any) { addToast('error', `Gửi thất bại: ${e.message}`); setIsSubmitting(false); }
  };

  const handleConfirmPayment = async () => {
    if (!activeRequest) return; setConfirmingPayment(true);
    try { await InterpretationService.confirmPayment(activeRequest.id); setShowPaymentModal(false); await fetchData(); setActiveRequest(null); setIsSent(false); setActiveTab('requests'); addToast('success', 'Đã xác nhận thanh toán!'); } 
    catch (e: any) { addToast('error', `Thất bại: ${e.message}`); } finally { setConfirmingPayment(false); }
  };

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const filteredHistory = completedRequests.filter(item => item.querentName.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans flex overflow-hidden relative selection:bg-amber-500/30">
        
        {/* Background Decor */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-amber-900/10 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* TOAST */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        {/* SIDEBAR (STYLE PROFILE) */}
        <aside className="w-64 bg-[#130823]/60 backdrop-blur-xl border-r border-white/5 hidden lg:flex flex-col h-screen sticky top-0 z-50">
            <div className="p-6">
                {/* ĐÃ THAY LOGO Ở ĐÂY */}
                <Link href="/" className="flex items-center gap-3 cursor-pointer group">
                    <Image src="/logo.png" alt="MysticTarot Logo" width={32} height={32} className="w-8 h-8 object-contain group-hover:opacity-80 transition-opacity" />
                    <span className="font-bold text-xl text-white">Mystic<span className="text-amber-500">Tarot</span></span>
                </Link>
            </div>

            <nav className="flex-grow px-4 space-y-2 mt-4">
               <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'requests' ? 'bg-gradient-to-r from-amber-600/20 to-purple-600/20 text-white border border-white/10 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                   <div className="flex items-center gap-3"><Inbox className="w-5 h-5" /> <span>Yêu cầu mới</span></div>
                   {pendingRequests.length > 0 && <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">{pendingRequests.length}</span>}
               </button>
               
               <button onClick={() => activeRequest && setActiveTab('workspace')} disabled={!activeRequest} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'workspace' ? 'bg-white/10 text-white border border-white/5 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50'}`}>
                   <LayoutDashboard className="w-5 h-5" /> Workspace
               </button>
               
               <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'history' ? 'bg-white/10 text-white border border-white/5 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                   <History className="w-5 h-5" /> Lịch sử
               </button>

               <div className="my-4 border-t border-white/5"></div>

               {/* BUTTON SANG READER PROFILE */}
               <Link href="/readerdashboard/profile" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors font-bold">
                   <User className="w-5 h-5" /> <span>Hồ sơ cá nhân</span>
               </Link>
            </nav>

            <div className="p-4 m-4">
                <div className="bg-white/5 rounded-xl border border-white/5 p-3 flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">{user?.fullName?.charAt(0)}</div>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white truncate max-w-[100px]">{user?.fullName || "Reader"}</div>
                        <div className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online</div>
                    </div>
                </div>
                <button onClick={handleLogoutClick} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors text-xs font-bold uppercase tracking-wider">
                    <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-grow h-screen overflow-y-auto custom-scrollbar relative pb-24">
            <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
            <AnimatePresence mode="wait">
                
                {/* TAB 1: REQUESTS */}
                {activeTab === 'requests' && (
                <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <header className="mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Yêu cầu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">Mới Nhất</span></h2>
                        <p className="text-slate-400 text-sm mt-2">Danh sách các khách hàng đang chờ bạn kết nối.</p>
                    </header>
                    
                    {pendingRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-[#130823]/40 rounded-[2rem] border border-white/5 border-dashed">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4"><Inbox className="w-8 h-8 text-slate-500 opacity-50"/></div>
                            <p className="text-slate-400 font-medium">Hiện chưa có yêu cầu nào.</p>
                            <p className="text-slate-500 text-sm">Vui lòng chờ đợi...</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {pendingRequests.map((req) => ( <RequestCard key={req.id} req={req} onAccept={handleAcceptRequest} onReject={handleRejectRequest} /> ))}
                        </div>
                    )}
                </motion.div>
                )}

                {/* TAB 2: WORKSPACE */}
                {activeTab === 'workspace' && activeRequest && !isSent && (
                <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    {/* Header Workspace */}
                    <div className="bg-[#130823]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">#{activeRequest.id}</span>
                                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {activeRequest.timestamp}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">{activeRequest.topic}</h2>
                            <div className="flex gap-4 text-sm text-slate-300">
                                <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-purple-400"/> {activeRequest.querentName}</span>
                                <span className="w-px h-4 bg-white/10"></span>
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-400"/> {activeRequest.birthDate}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center px-6 py-3 bg-black/20 rounded-2xl border border-white/5 min-w-[140px]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Hết hạn sau</span>
                            <div className={`text-2xl font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                                {Math.floor(timeLeft/60).toString().padStart(2,'0')}:{(timeLeft%60).toString().padStart(2,'0')}
                            </div>
                        </div>
                    </div>

                    {/* Main Editor */}
                    <div className="bg-[#130823]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-10 shadow-2xl">
                        {activeRequest.cards.length === 0 ? (
                            <div className="text-center py-12 text-red-400">Không có dữ liệu bài</div>
                        ) : (
                            activeRequest.cards.map((card: any, index: number) => (
                                <div key={card.id} className="flex flex-col md:flex-row gap-8 pb-8 border-b border-white/5 last:border-0 last:pb-0">
                                    <div className="w-full md:w-48 shrink-0 flex flex-col items-center">
                                        <div className="relative group">
                                            <img src={card.img} className="w-40 h-64 object-cover rounded-xl border-2 border-white/10 shadow-lg group-hover:scale-105 transition-transform" alt={card.name} />
                                            {card.isReversed && <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">REV</div>}
                                        </div>
                                        <h3 className="text-white font-bold mt-3 text-center">{card.name}</h3>
                                    </div>
                                    <div className="flex-grow flex flex-col">
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-2">Luận giải lá bài</label>
                                        <div className="flex-grow flex flex-col bg-black/20 rounded-xl border border-white/10 overflow-hidden focus-within:border-amber-500/50 transition-colors">
                                            <EditorToolbar />
                                            <textarea 
                                                value={cardInputs[card.id] || ""} 
                                                onChange={(e) => setCardInputs({...cardInputs, [card.id]: e.target.value})} 
                                                className="w-full h-40 bg-transparent border-none p-4 outline-none text-slate-200 placeholder-slate-600 text-sm leading-relaxed resize-none" 
                                                placeholder={`Nhập thông điệp cho lá ${card.name}...`} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        
                        {/* Summary & QR */}
                        <div className="pt-8 border-t border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400"/> Lời khuyên tổng kết</h3>
                                <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden h-full">
                                    <EditorToolbar />
                                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full h-40 bg-transparent border-none p-4 outline-none text-slate-200 placeholder-slate-600 text-sm leading-relaxed resize-none" placeholder="Đúc kết lời khuyên..." />
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><QrCode className="w-4 h-4 text-green-400"/> Thông tin thanh toán</h3>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex gap-4 items-center">
                                    <div className="p-2 bg-white rounded-lg">
                                        <img src={getVietQR(activeRequest.amount, `Thanh toan don ${activeRequest.id}`)} alt="QR Payment" className="w-24 h-24 object-contain"/>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Số tiền:</span><span className="font-bold text-green-400">{activeRequest.amount.toLocaleString()} đ</span></div>
                                        <div className="text-xs text-slate-500 bg-black/20 p-2 rounded border border-white/5">QR này sẽ được gửi kèm cho khách để họ thanh toán.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                )}

                {/* TAB 3: HISTORY */}
                {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <header className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-white">Lịch sử <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">Luận Giải</span></h2>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input type="text" placeholder="Tìm tên khách..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none w-64 text-sm text-white focus:border-amber-500/50 transition-colors" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </header>
                    <div className="bg-[#130823]/60 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest border-b border-white/5">
                                <tr><th className="px-6 py-4 font-bold">Mã / Ngày</th><th className="px-6 py-4 font-bold">Khách hàng</th><th className="px-6 py-4 font-bold">Chủ đề</th><th className="px-6 py-4 font-bold text-right">Trạng thái</th></tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-amber-400 font-mono text-xs font-bold mb-1">#{item.id}</div>
                                            <div className="text-slate-500 text-[10px]">{item.timestamp}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-200 text-sm font-medium">{item.querentName}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{item.topic}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded text-[10px] font-bold uppercase">Hoàn thành</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredHistory.length === 0 && <div className="text-center py-10 text-slate-500 text-sm">Chưa có lịch sử nào.</div>}
                    </div>
                </motion.div>
                )}

                {/* SUCCESS SCREEN */}
                {isSent && (
                <motion.div key="success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8 flex flex-col items-center justify-center h-[60vh]">
                    <div className="bg-[#130823]/80 backdrop-blur-xl border border-green-500/30 rounded-[3rem] p-12 text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-400 animate-bounce" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2">Đã Gửi Thành Công!</h2>
                        <p className="text-slate-400 mb-8">Kết quả luận giải đã được gửi đến khách hàng.</p>
                        <button onClick={() => setShowPaymentModal(true)} disabled={confirmingPayment} className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 mx-auto transform hover:scale-105">
                            {confirmingPayment ? "Đang xử lý..." : <><DollarSign className="w-5 h-5" /> Xác Nhận Đã Nhận Tiền</>}
                        </button>
                    </div>
                </motion.div>
                )}

            </AnimatePresence>
            </div>
        </main>

        {/* FLOATING ACTION BAR FOR WORKSPACE */}
        {activeTab === 'workspace' && activeRequest && !isSent && (
            <div className="fixed bottom-6 left-0 md:left-64 right-0 z-40 px-4 flex justify-center">
                <div className="bg-[#1a1025]/90 border border-white/10 p-2 pl-6 rounded-2xl flex items-center gap-6 shadow-2xl backdrop-blur-xl">
                    <span className="text-slate-300 text-sm font-medium">
                        {activeRequest.cards.length > 0 ? `Đã nhập: ${Object.keys(cardInputs).length}/${activeRequest.cards.length} lá` : "Vui lòng nhập lời khuyên"}
                    </span>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-2.5 rounded-xl text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-amber-900/20 transition-all disabled:opacity-50 hover:scale-105">
                        {isSubmitting ? "Đang gửi..." : "Gửi Kết Quả"} <Send className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        )}

        {/* MODALS */}
        <PaymentConfirmationModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onConfirm={handleConfirmPayment} amount={activeRequest?.amount || 50000} loading={confirmingPayment} />
        <RejectConfirmationModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({isOpen: false, id: null})} onConfirm={handleConfirmReject} />
        <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleConfirmLogout} />
    </div>
  );
}