"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Sparkles, Send, User, Calendar,
  CheckCircle2, Bold, Italic, Wand2, LayoutDashboard, History,
  Clock, MessageSquare, Timer, Search, Inbox, Feather, XCircle, LogOut,
  AlertCircle, QrCode
    Sparkles, Send, User, Calendar,
    CheckCircle2, Bold, Italic, List, Wand2, LayoutDashboard, History,
    Clock, MessageSquare, Timer, Search, Inbox, Feather, XCircle, LogOut,
    AlertCircle, QrCode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Thêm Link từ next/link
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { ReadingSessionService } from "@/services/readingSessionService";
import { InterpretationService } from "@/services/interpretationService";
import { logout } from "@/store/features/authSlice"; 
import { LogoutModal } from "@/components/LogoutModal"; 
import { RootState } from "@/store/store";
import { convertFileToBase64 } from "@/utils/fileUtils";
import { logout } from "@/store/features/authSlice"; // Import action logout từ authSlice
import { LogoutModal } from "@/components/LogoutModal"; // Đường dẫn đến component LogoutModal của bạn
import { useRouter } from "next/navigation";
import { ReadingSession } from "@/types/readingSession";



// --- 1. HELPERS & CARD LOGIC ---
const getCardDetail = (id: number) => {
    const safeId = Number(id);
    const getImg = (prefix: string, num: number) =>
        `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${num.toString().padStart(2, '0')}.jpg`;

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
    <div className="flex items-center gap-1 p-2 border-b border-slate-800/60 bg-slate-900/50 text-slate-400 rounded-t-xl select-none">
        <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
        <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
        <button className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"><List className="w-4 h-4" /></button>
        <div className="w-px h-4 bg-slate-700 mx-2"></div>
        <button className="flex items-center gap-1 text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-md border border-purple-500/30 hover:bg-purple-900/50 transition-colors ml-auto"><Wand2 className="w-3 h-3" /> AI Gợi ý</button>
    </div>
);

// --- REQUEST CARD ---
const RequestCard = ({ req, onAccept, onReject }: { req: any, onAccept: any, onReject: any }) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
// --- COMPONENT REQUEST CARD ---
const RequestCard = ({ req, onAccept, onReject }: { req: ReadingSession, onAccept: any, onReject: any }) => {
    const [timeLeft, setTimeLeft] = useState<number>(300);
    const WAIT_TIME_SECONDS = 300;

    useEffect(() => {
        // Hàm tính toán an toàn
        const calculateTimeLeft = () => {
            // Kiểm tra tồn tại của req và matchedAt
            const rawDate = req?.matchedAt || req?.matchedAt;
            console.log(req)
            console.log("Raw matchedAt:", rawDate);
            if (!rawDate) return 300; // Nếu chưa có date, mặc định giữ 5:00

            try {
                // Xử lý chuỗi nano giây an toàn
                let cleanDate = String(rawDate);
                if (cleanDate.includes('.')) {
                    const [main, ms] = cleanDate.split('.');
                    cleanDate = `${main}.${ms.substring(0, 3)}Z`;
                }

                const matchedTime = new Date(cleanDate).getTime();
                if (isNaN(matchedTime)) return 300;

                const diff = Math.floor((matchedTime + (WAIT_TIME_SECONDS * 1000) - Date.now()) / 1000);
                return diff > 0 ? diff : 0;
            } catch (e) {
                return 300;
            }
        };

        // Cập nhật ngay lần đầu
        const initial = calculateTimeLeft();
        setTimeLeft(initial);

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            // CHỈ REJECT KHI CÓ DỮ LIỆU DATE VÀ ĐÃ HẾT GIỜ THỰC SỰ
            if ((req?.matchedAt || req?.matchedAt) && remaining <= 0) {
                clearInterval(timer);
                onReject(req.id, true);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [req?.matchedAt, req?.matchedAt, req?.id]);

    // Nếu không có dữ liệu id, không hiển thị card để tránh rác giao diện
    if (!req?.id) return null;

    return (
        <div className="bg-[#130823]/60 backdrop-blur-md border border-slate-800 rounded-[2rem] p-8 mb-6 relative overflow-hidden shadow-2xl">
            {/* Thanh Progress */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                <div
                    className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 60 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${(timeLeft / 300) * 100}%` }}
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 text-white">
                {/* Hình ảnh bài */}
                <div className="flex gap-2 shrink-0 min-w-[120px]">
                    {req?.selectedCards?.length > 0 ? (
                        req.selectedCards.map((card: any, i: number) => (
                            <div key={i} className="relative w-16 h-28 rounded-lg border border-slate-700 overflow-hidden"
                                style={{ rotate: `${(i - 1) * 5}deg`, marginLeft: i > 0 ? '-1rem' : '0' }}>
                                <img src={card.imageUrl} alt="card" className="w-full h-full object-cover" />
                            </div>
                        ))
                    ) : (
                        <div className="w-16 h-28 bg-slate-800/50 rounded-lg border border-dashed border-slate-600 flex items-center justify-center text-[10px] text-slate-500">No Cards</div>
                    )}
                </div>

                <div className="flex-grow space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-amber-500 font-mono font-bold">#{req.id}</span>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border font-mono ${timeLeft < 60 ? 'text-red-500 border-red-500/30' : 'text-green-400 border-green-500/30'}`}>
                            <Timer size={16} />
                            <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
                        </div>
                    </div>
                    <div className="flex-grow space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">#{req.id}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${req.status === 'MATCHED' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-300'}`}>{req.status === 'MATCHED' ? 'ĐÃ KHỚP' : 'MỚI'}</span>
                                <span className="text-slate-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3"/> {req.timestamp}</span>
                            </div>
                            <div className={`flex items-center gap-2 font-mono font-bold text-sm px-3 py-1 rounded-full border ${timeLeft < 60 ? 'text-red-500 border-red-500/30 bg-red-500/10 animate-pulse' : 'text-green-400 border-green-500/30 bg-green-500/10'}`}><Timer className="w-4 h-4"/> {formatTimer(timeLeft)}</div>

                    <div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                            {req.topic || "Chủ đề"}
                        </h3>
                        <div className="mt-2 p-3 bg-slate-950/40 rounded-xl border border-slate-800/50">
                            <p className="text-sm text-slate-300 italic">
                                "{req.question || "Đang chờ câu hỏi..."}"
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <User size={14} className="text-purple-400" />
                        <span>{req.querentName || "Khách hàng ẩn danh"}</span>
                    </div>
                </div>

                <div className="flex lg:flex-col justify-end gap-3 shrink-0">
                    <button onClick={() => onReject(req.id, false)} className="px-6 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">Từ chối</button>
                    <button onClick={() => onAccept(req)} className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-900/20">Chấp nhận</button>
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
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.auth);

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'workspace' | 'history'>('requests');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [completedRequests, setCompletedRequests] = useState<any[]>([]);
  const [activeRequest, setActiveRequest] = useState<any>(null); 
  const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [searchTerm, setSearchTerm] = useState("");
  const [ignoredIds, setIgnoredIds] = useState<number[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'requests' | 'workspace' | 'history'>('requests');
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [completedRequests, setCompletedRequests] = useState<any[]>([]);
    const [activeRequest, setActiveRequest] = useState<any>(null);
    const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
    const [summary, setSummary] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [confirmingPayment, setConfirmingPayment] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3600);
    const [searchTerm, setSearchTerm] = useState("");
    const [ignoredIds, setIgnoredIds] = useState<number[]>([]);

    const [idCardReques, setIdCardRequest] = useState<any[]>([]);
    const [idRequest, setIdRequest] = useState<number | null>(null);

    const handleLogout = () => {
        if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            router.push("/login");
        }
    }
    // State cho Logout Pop-up
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleConfirmLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    dispatch(logout()); 
    router.push("/login");
  };
    // Hàm mở Modal Đăng xuất
    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    // Hàm xác nhận đăng xuất thật sự
    const handleConfirmLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        dispatch(logout()); // Gọi action logout để clear redux state
        router.push("/login");
    };
    const [qrBase64, setQrBase64] = useState<string>("");

    const handleQrUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64 = await convertFileToBase64(file);
                setQrBase64(base64); // Lưu chuỗi này vào state
                console.log("QR Base64:", base64);
            } catch (error) {
                console.error("Lỗi chuyển đổi ảnh QR:", error);
            }
        }
    };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, [ignoredIds, user]); 
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [ignoredIds]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (activeTab === 'workspace' && activeRequest && !isSent) {
            timer = setInterval(() => { setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1)); }, 1000);
        }
        return () => clearInterval(timer);
    }, [activeTab, activeRequest, isSent]);

  const fetchData = async () => {
    if (!user) return;
    try {
        const response: any = await ReadingSessionService.getAll();
        const dataList = Array.isArray(response) ? response : (response.content || []);
        
        if(Array.isArray(dataList)) {
            const pending = dataList
                .filter((i: any) => 
                    (i.status === 'PENDING' || i.status === 'MATCHED') && 
                    i.status !== 'REJECTED' && 
                    !ignoredIds.includes(i.id)
                )
                .map(transformData);
                
            setPendingRequests(pending);
            
            const completed = dataList
                .filter((i: any) => i.status === 'COMPLETED')
                .map(transformData);
            setCompletedRequests(completed);
        }
    } catch (error) { console.error("Error fetching:", error); }
  };
    const fetchData = async () => {
        try {
            const response: any = await ReadingSessionService.getAll();
            const dataList = Array.isArray(response) ? response : (response.content || []);
            if (Array.isArray(dataList)) {
                // Tắt bộ lọc Status để đảm bảo hiện dữ liệu
                const pending = dataList
                    .filter((i: any) => i.status !== 'COMPLETED' && i.status !== 'REJECTED' && !ignoredIds.includes(i.id))
                    .map(transformData);
                setPendingRequests(pending);
                const completed = dataList.filter((i: any) => i.status === 'COMPLETED').map(transformData);
                setCompletedRequests(completed);
            }
        } catch (error) { console.error("Error fetching:", error); }
    };

  const transformData = (item: any) => {
      let cards: any[] = [];
      try {
          let raw = item.selectedCards;
          if (typeof raw === 'string') try { raw = JSON.parse(raw); } catch {}
          if (typeof raw === 'string') try { raw = JSON.parse(raw); } catch {}
          if(Array.isArray(raw) && raw.length > 0) {
              cards = raw.map((c: any, index: number) => {
                  const id = Number(c.cardId || c.id || 0); 
                  const isReversed = typeof c === 'object' ? (c.isReversed || false) : false;
                  const serverName = c.nameVi || c.name; 
                  const serverImg = c.imageUrl || c.image || c.img;
                  const localInfo = getCardDetail(id);
                  return { id: id || (1000 + index), isReversed, name: serverName || localInfo.name, img: serverImg || localInfo.img };
              });
          }
      } catch (e) { }
    const transformData = (item: any) => {
        // --- 1. XỬ LÝ LÁ BÀI (CARDS) ---
        let cards: any[] = [];
        let isCorrupted = false;
        try {
            let raw = item.selectedCards;
            if (typeof raw === 'string') try { raw = JSON.parse(raw); } catch { }
            if (typeof raw === 'string') try { raw = JSON.parse(raw); } catch { }

            if (Array.isArray(raw) && raw.length > 0) {
                const hasBadData = raw.some((c: any) => !c.cardId && !c.id);
                if (!hasBadData) {
                    cards = raw.map((c: any, index: number) => {
                        const id = Number(c.cardId || c.id || 0);
                        const isReversed = typeof c === 'object' ? (c.isReversed || c.reversed || false) : false;
                        const serverName = c.nameVi || c.name;
                        const serverImg = c.imageUrl || c.image || c.img;
                        // getCardDetail là hàm helper lấy thông tin ảnh/tên từ file local của bạn
                        const localInfo = typeof getCardDetail === 'function' ? getCardDetail(id) : { name: '', img: '' };

                        return {
                            id: id || (1000 + index),
                            isReversed,
                            name: serverName || localInfo.name,
                            img: serverImg || localInfo.img
                        };
                    });
                } else { isCorrupted = true; }
            } else { isCorrupted = true; }
        } catch (e) { isCorrupted = true; }

        // Logic dự phòng (Backup) nếu selectedCards bị lỗi nhưng có note
        if ((cards.length === 0 || isCorrupted) && item.note && item.note.includes("BACKUP_CARDS:")) {
            try {
                const parts = item.note.split("BACKUP_CARDS:");
                if (parts[1]) {
                    const backupIds = parts[1].trim().split(",");
                    cards = backupIds.map((pair: string) => {
                        const [idStr, revStr] = pair.split("-");
                        const id = Number(idStr);
                        if (!id) return null;
                        const info = typeof getCardDetail === 'function' ? getCardDetail(id) : {};
                        return { id, isReversed: revStr === "1", ...info };
                    }).filter(Boolean);
                }
            } catch (e) { }
        }

        // --- 2. XỬ LÝ TOPIC (LẤY TỪ QUESTION) ---
        const TOPIC_NAME_MAP: Record<number | string, string> = {
            1: "Tình Yêu",
            2: "Sự Nghiệp",
            3: "Tài Chính"
        };

        let topicDisplay = "Tổng quan";
        // Ưu tiên lấy trực tiếp từ object lồng nhau (nếu BE đã Join bảng Topic)
        if (item.question?.topic?.name) {
            topicDisplay = item.question.topic.name;
        }
        // Nếu chỉ có ID, map qua bảng tên tiếng Việt
        else if (item.question?.topicId) {
            topicDisplay = TOPIC_NAME_MAP[item.question.topicId] || "Tổng quan";
        }

        // --- 3. XỬ LÝ THÔNG TIN KHÁCH HÀNG & CÂU HỎI ---
        let birthDateDisplay = "Chưa cung cấp";
        const rawDob = item.customer?.birthDate || item.birthDate;
        if (rawDob) {
            try {
                if (Array.isArray(rawDob)) {
                    birthDateDisplay = `${rawDob[2]}/${rawDob[1]}/${rawDob[0]}`;
                } else {
                    const d = new Date(rawDob);
                    birthDateDisplay = !isNaN(d.getTime()) ? d.toLocaleDateString('vi-VN') : String(rawDob);
                }
            } catch { birthDateDisplay = String(rawDob); }
        }

        let querentName = item.customer?.fullName || item.fullName || "Khách ẩn danh";
        let questionContent = item.question?.content || item.question?.questionText || item.questionName || "Không có câu hỏi";

        // Parse tên khách từ note nếu dữ liệu chính bị trống
        if (item.note && (querentName === "Khách ẩn danh" || querentName === "customer")) {
            if (item.note.includes("KH:")) {
                querentName = item.note.split("KH:")[1].split("-")[0].trim();
            }
        }

        // --- 4. THỜI GIAN & TRẠNG THÁI ---
        const createdTime = item.createdAt ? new Date(item.createdAt).getTime() : Date.now();
        const expiryTimestamp = createdTime + (5 * 60 * 1000); // Hết hạn sau 5 phút

        return {
            id: item.id,
            querentName,
            topic: topicDisplay, // <--- Đã sửa lấy từ Question
            question: questionContent,
            birthDate: birthDateDisplay,
            timestamp: item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : "Vừa xong",
            cards,
            rawNote: item.note,
            status: item.status,
            amount: item.amount || 50000,
            expiryTimestamp
        };
    };

  const handleAcceptRequest = async (request: any) => {
    try { await ReadingSessionService.accept(request.id); setActiveRequest(request); setTimeLeft(3600); setIsSent(false); setCardInputs({}); setSummary(""); setActiveTab('workspace'); } catch (e: any) { alert(e.message); }
  };
    const handleAcceptRequest = async (request: any) => {
        try {
            await ReadingSessionService.accept(request.id);
            console.log(request);
            setActiveRequest(request);
            setTimeLeft(59 * 60 + 59);
            setIsSent(false);
            setCardInputs({});
            setSummary("");
            setIdRequest(request.id);
            setActiveTab('workspace');
            // router.push(`/readerdashboard/workspace/${request.id}`);
        } catch (error: any) {
            alert("Lỗi: " + (error.response?.data?.message || "Không thể chấp nhận yêu cầu"));
        }
    };

    const handleRejectRequest = async (id: any, isAuto: boolean = false) => {
        if (!isAuto && !confirm("Bạn có chắc chắn muốn từ chối yêu cầu này không?")) return;
        setIgnoredIds(prev => [...prev, id]);
        setPendingRequests(prev => prev.filter(req => req.id !== id));
        try { await ReadingSessionService.reject(id); } catch (e: any) { alert("Lỗi khi từ chối"); setIgnoredIds(prev => prev.filter(i => i !== id)); }
    };

  const handleSubmit = async () => {
    if (!activeRequest) return;
    setIsSubmitting(true);
    
    try {
        const card1Content = activeRequest.cards[0] ? (cardInputs[activeRequest.cards[0].id] || "") : "";
        const card2Content = activeRequest.cards[1] ? (cardInputs[activeRequest.cards[1].id] || "") : "";
        const card3Content = activeRequest.cards[2] ? (cardInputs[activeRequest.cards[2].id] || "") : "";

        const interp1 = card1Content.trim() !== "" ? card1Content : "Lá bài 1 - Năng lượng khởi đầu.";
        const interp2 = card2Content.trim() !== "" ? card2Content : "Lá bài 2 - Năng lượng trung tâm.";
        const interp3 = card3Content.trim() !== "" ? card3Content : "Lá bài 3 - Năng lượng kết thúc.";
        
        const adviceText = summary.trim() !== "" ? summary : "Tarot khuyên querent nên lắng nghe trực giác nội tâm.";
        const qrLink = getVietQR(activeRequest.amount, `Thanh toan don ${activeRequest.id}`);

        const payload = {
            interpretation1: interp1,
            interpretation2: interp2,
            interpretation3: interp3,
            advice: adviceText,
            qrPayment: qrLink
        };

        await InterpretationService.submit(activeRequest.id, payload);
    const handleSubmit = async () => {
        if (!activeRequest) return;
        setIsSubmitting(true);

        try {
            // Gọi Service gửi đi
            await InterpretationService.submit(activeRequest.id, {
                interpretation1: cardInputs[activeRequest.cards[0]?.id] || "Nội dung lá 1 trống",
                interpretation2: cardInputs[activeRequest.cards[1]?.id] || "Nội dung lá 2 trống",
                interpretation3: cardInputs[activeRequest.cards[2]?.id] || "Nội dung lá 3 trống",
                advice: summary || "Chúc bạn mọi điều tốt lành.",
                qrPayment: qrBase64 // Hoặc lấy từ state nếu bạn có ô nhập link QR
            });

            setTimeout(() => {
                setIsSubmitting(false);
                setIsSent(true);
                fetchData();
            }, 1500);

        } catch (e: any) {
            const serverMessage = e.response?.data?.message || e.response?.data?.error || "Lỗi không xác định";
            alert(`Gửi thất bại: ${serverMessage}`);
            setIsSubmitting(false);
        }
    };

  const handleConfirmPayment = async () => {
    if (!activeRequest || !confirm(`Xác nhận đã nhận thanh toán ${activeRequest.amount.toLocaleString('vi-VN')}đ?`)) return;
    setConfirmingPayment(true);
    try { await InterpretationService.confirmPayment(activeRequest.id); alert("✅ Đã xác nhận thanh toán thành công!"); await fetchData(); setActiveRequest(null); setIsSent(false); setActiveTab('requests'); } catch (e: any) { alert(`❌ Xác nhận thất bại: ${e.message}`); } finally { setConfirmingPayment(false); }
  };
    const handleConfirmPayment = async () => {
        if (!activeRequest) return;
        if (!confirm(`Xác nhận đã nhận thanh toán ${activeRequest.amount.toLocaleString('vi-VN')}đ từ ${activeRequest.querentName}?`)) {
            return;
        }
        setConfirmingPayment(true);
        try {
            await InterpretationService.confirmPayment(activeRequest.id);
            alert("✅ Đã xác nhận thanh toán thành công!");
            await fetchData();
            setActiveRequest(null);
            setIsSent(false);
            setActiveTab('requests');
        } catch (e: any) {
            alert(`❌ Xác nhận thất bại: ${e.response?.data?.message || e.message}`);
        } finally {
            setConfirmingPayment(false);
        }
    };

    const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const filteredHistory = completedRequests.filter(item =>
        item.querentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0410] text-slate-200 font-sans flex overflow-hidden">
        <aside className="w-64 bg-[#0f0518] border-r border-slate-800 hidden lg:flex flex-col h-screen sticky top-0 z-50">
            {/* LOGO LINK VỀ TRANG CHỦ */}
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3 cursor-pointer group">
                    <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30 group-hover:bg-amber-500/30 transition-colors">
                        <Feather className="w-6 h-6 text-amber-500" />
                    </div>
                    <h1 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Mystic Reader</h1>
                </Link>
            </div>

            <nav className="flex-grow px-4 space-y-2 mt-6">
               <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'requests' ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-lg' : 'text-slate-400 hover:bg-slate-800/30'}`}><div className="flex items-center gap-3"><Inbox className="w-5 h-5" /> <span>Yêu cầu mới</span></div>{pendingRequests.length > 0 && <span className="bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{pendingRequests.length}</span>}</button>
               <button onClick={() => activeRequest && setActiveTab('workspace')} disabled={!activeRequest} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'workspace' ? 'bg-slate-800/50 text-amber-400 border border-slate-700/50' : 'text-slate-400 hover:bg-slate-800/30 hover:text-white disabled:opacity-50'}`}><LayoutDashboard className="w-5 h-5" /> Workspace</button>
               <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'history' ? 'bg-slate-800/50 text-amber-400 border border-slate-700/50' : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'}`}><History className="w-5 h-5" /> Lịch sử</button>
            </nav>
            <div className="p-4 m-4">
                <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-300"><User className="w-5 h-5" /></div><div><div className="text-sm font-medium text-white">{user?.fullName || "Reader"}</div><div className="text-xs text-green-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Online</div></div></div>
                <button onClick={handleLogoutClick} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 transition-colors text-sm font-medium"><LogOut className="w-4 h-4" /> Đăng xuất</button>
            </div>
        </aside>
    return (
        <div className="min-h-screen bg-[#0a0410] text-slate-200 font-sans flex overflow-hidden">
            <aside className="w-64 bg-[#0f0518] border-r border-slate-800 hidden lg:flex flex-col h-screen sticky top-0 z-50">
                <div className="p-6 flex items-center gap-3"><div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30"><Feather className="w-6 h-6 text-amber-500" /></div><h1 className="text-lg font-bold text-white">Mystic Reader</h1></div>
                <nav className="flex-grow px-4 space-y-2 mt-6">
                    <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'requests' ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-lg' : 'text-slate-400 hover:bg-slate-800/30'}`}><div className="flex items-center gap-3"><Inbox className="w-5 h-5" /> <span>Yêu cầu mới</span></div>{pendingRequests.length > 0 && <span className="bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{pendingRequests.length}</span>}</button>
                    <button onClick={() => activeRequest && setActiveTab('workspace')} disabled={!activeRequest} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'workspace' ? 'bg-slate-800/50 text-amber-400 border border-slate-700/50' : 'text-slate-400 hover:bg-slate-800/30 hover:text-white disabled:opacity-50'}`}><LayoutDashboard className="w-5 h-5" /> Workspace</button>
                    <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'history' ? 'bg-slate-800/50 text-amber-400 border border-slate-700/50' : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'}`}><History className="w-5 h-5" /> Lịch sử</button>
                </nav>
                <div className="p-4 m-4">
                    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-300"><User className="w-5 h-5" /></div>
                        <div>
                            <div className="text-sm font-medium text-white">{user?.fullName || "Reader"}</div>
                            <div className="text-xs text-green-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Online</div>
                        </div>
                    </div>
                    {/* Thay handleLogout trực tiếp bằng handleLogoutClick */}
                    <button onClick={handleLogoutClick} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 transition-colors text-sm font-medium">
                        <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                </div>
            </aside>

        <main className="flex-grow h-screen overflow-y-auto custom-scrollbar relative pb-24">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0a0410] to-[#0a0410]"></div>
            <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
            <AnimatePresence mode="wait">
                {activeTab === 'requests' && (
                <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <header className="mb-8"><h2 className="text-3xl font-bold text-white tracking-tight">Yêu cầu luận giải <span className="text-amber-500">mới</span></h2><p className="text-slate-400 mt-2">Danh sách chờ xử lý từ hệ thống.</p></header>
                    {pendingRequests.length === 0 ? (<div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 text-slate-500"><Inbox className="w-12 h-12 mx-auto mb-3 opacity-50"/><p>Hiện không có yêu cầu nào.</p></div>) : (
                        <div className="grid gap-6">{pendingRequests.map((req) => ( <RequestCard key={req.id} req={req} onAccept={handleAcceptRequest} onReject={handleRejectRequest} /> ))}</div>
                    )}
                </motion.div>
                )}
            <main className="flex-grow h-screen overflow-y-auto custom-scrollbar relative pb-24">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0a0410] to-[#0a0410]"></div>
                <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'requests' && (
                            <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                <header className="mb-8"><h2 className="text-3xl font-bold text-white tracking-tight">Yêu cầu luận giải <span className="text-amber-500">mới</span></h2><p className="text-slate-400 mt-2">Danh sách chờ xử lý từ hệ thống.</p></header>
                                {pendingRequests.length === 0 ? (<div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 text-slate-500"><Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>Hiện không có yêu cầu nào.</p></div>) : (
                                    <div className="grid gap-6">
                                        {pendingRequests.map((req) => (<RequestCard key={req.id} req={req} onAccept={handleAcceptRequest} onReject={handleRejectRequest} />))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                {activeTab === 'workspace' && activeRequest && !isSent && (
                <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <header className="bg-[#130823]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl"><div><div className="flex items-center gap-2 text-xs text-slate-400 mb-2"><Clock className="w-3.5 h-3.5" /> Nhận lúc: {activeRequest.timestamp}<span className="text-slate-600">|</span><span className="text-amber-500 font-mono">#{activeRequest.id}</span></div><h2 className="text-2xl font-bold text-white mb-2">{activeRequest.topic}</h2><div className="flex items-center gap-4 text-sm"><div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800"><User className="w-4 h-4 text-purple-400" /> Querent: <span className="font-semibold text-white">{activeRequest.querentName}</span></div><div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800"><Calendar className="w-4 h-4 text-blue-400" /> Sinh: <span className="font-semibold text-white">{activeRequest.birthDate}</span></div></div></div><div className="flex flex-col items-center px-6 py-2 bg-slate-950/50 rounded-2xl border border-amber-500/20 shadow-inner min-w-[140px]"><span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em] mb-1">Thời gian còn lại</span><div className={`text-3xl font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}><Timer className="w-5 h-5 text-amber-500" />{formatTime(timeLeft)}</div></div></header>
                    <div className="bg-[#130823]/50 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-8 space-y-10 shadow-2xl">
                    {activeRequest.cards.length === 0 ? (<div className="text-center py-12 border-2 border-dashed border-red-900/30 rounded-2xl bg-red-900/10"><AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" /><h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy dữ liệu bài!</h3><p className="text-slate-400">Backend trả về dữ liệu rỗng.</p></div>) : (
                        activeRequest.cards.map((card: any, index: number) => (<div key={card.id} className="flex flex-col md:flex-row gap-8"><div className="w-full md:w-40 shrink-0 flex flex-col items-center"><img src={card.img} className="w-40 h-64 object-cover rounded-xl border-4 border-slate-800" alt={card.name} /><h3 className="text-white font-bold mt-2 text-center">{card.name} {card.isReversed && <span className="text-red-400 text-sm block">(Ngược)</span>}</h3></div><div className="flex-grow flex flex-col"><EditorToolbar /><textarea value={cardInputs[card.id] || ""} onChange={(e) => setCardInputs({...cardInputs, [card.id]: e.target.value})} className="w-full h-48 bg-[#0a0410] border border-slate-800 p-4 rounded-b-xl outline-none text-white focus:border-amber-500/50 transition-colors" placeholder={`Nhập luận giải chi tiết cho lá ${card.name} ${card.isReversed ? '(Ngược)' : ''}...`} /></div></div>))
                    )}
                    <div className="pt-8 border-t border-slate-800"><h3 className="text-xl font-bold text-amber-500 mb-4 flex items-center gap-2"><Sparkles/> Lời khuyên tổng kết</h3><EditorToolbar /><textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full h-32 bg-[#0a0410] border border-slate-800 p-4 rounded-b-xl outline-none text-white focus:border-amber-500/50 transition-colors" placeholder="Tóm tắt thông điệp và lời khuyên cho khách hàng..." /></div>
                    <div className="pt-8 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8"><div><h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><QrCode className="w-5 h-5 text-green-400"/> Mã QR thanh toán</h3><p className="text-sm text-slate-400 mb-4">Quét mã để xác nhận thanh toán đơn hàng này.</p><div className="p-4 bg-white/5 rounded-2xl border border-slate-700 w-fit"><img src={getVietQR(activeRequest.amount, `Thanh toan don ${activeRequest.id}`)} alt="QR Payment" className="w-40 h-40 object-contain rounded-lg"/></div></div><div className="flex flex-col justify-center space-y-4"><div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700"><div className="flex items-center justify-between mb-2"><span className="text-slate-400 text-sm">Số tiền:</span><span className="text-xl font-bold text-green-400">{activeRequest.amount.toLocaleString('vi-VN')} đ</span></div><div className="flex items-center justify-between"><span className="text-slate-400 text-sm">Trạng thái:</span><span className="text-xs font-bold bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Chờ xác nhận</span></div></div><p className="text-xs text-slate-500 italic">* Kiểm tra kỹ thông tin trước khi gửi kết quả.</p></div></div>
                    </div>
                </motion.div>
                )}
                        {activeTab === 'workspace' && activeRequest && !isSent && (
                            <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                                <header className="bg-[#130823]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl"><div><div className="flex items-center gap-2 text-xs text-slate-400 mb-2"><Clock className="w-3.5 h-3.5" /> Nhận lúc: {activeRequest.timestamp}<span className="text-slate-600">|</span><span className="text-amber-500 font-mono">#{activeRequest.id}</span></div><h2 className="text-2xl font-bold text-white mb-2">{activeRequest.topic}</h2><h2 className="text-2xl font-bold text-white mb-2">{activeRequest.questionName}</h2><div className="flex items-center gap-4 text-sm"><div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800"><User className="w-4 h-4 text-purple-400" /> Querent: <span className="font-semibold text-white">{activeRequest.querentName}</span></div><div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800"><Calendar className="w-4 h-4 text-blue-400" /> Sinh: <span className="font-semibold text-white">{activeRequest.birthDate}</span></div></div></div><div className="flex flex-col items-center px-6 py-2 bg-slate-950/50 rounded-2xl border border-amber-500/20 shadow-inner min-w-[140px]"><span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em] mb-1">Thời gian còn lại</span><div className={`text-3xl font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}><Timer className="w-5 h-5 text-amber-500" />{formatTime(timeLeft)}</div></div></header>
                                <div className="bg-[#130823]/50 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-8 space-y-10 shadow-2xl">
                                    {activeRequest.cards.length === 0 ? (
                                        <div className="text-center py-12 border-2 border-dashed border-red-900/30 rounded-2xl bg-red-900/10"><AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" /><h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy dữ liệu bài!</h3><p className="text-slate-400">Backend trả về dữ liệu rỗng.</p></div>
                                    ) : (
                                        activeRequest.cards.map((card: any, index: number) => (
                                            <div key={card.id} className="flex flex-col md:flex-row gap-8">
                                                <div className="w-full md:w-40 shrink-0 flex flex-col items-center">
                                                    <img src={card.img} className="w-40 h-64 object-cover rounded-xl border-4 border-slate-800" alt={card.name} />
                                                    <h3 className="text-white font-bold mt-2 text-center">{card.name} {card.isReversed && <span className="text-red-400 text-sm block">(Ngược)</span>}</h3>
                                                </div>
                                                <div className="flex-grow flex flex-col">
                                                    <EditorToolbar />
                                                    <textarea value={cardInputs[card.id] || ""} onChange={(e) => setCardInputs({ ...cardInputs, [card.id]: e.target.value })} className="w-full h-48 bg-[#0a0410] border border-slate-800 p-4 rounded-b-xl outline-none text-white focus:border-amber-500/50 transition-colors" placeholder={`Nhập luận giải chi tiết cho lá ${card.name} ${card.isReversed ? '(Ngược)' : ''}...`} />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div className="pt-8 border-t border-slate-800"><h3 className="text-xl font-bold text-amber-500 mb-4 flex items-center gap-2"><Sparkles /> Lời khuyên tổng kết</h3><EditorToolbar /><textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full h-32 bg-[#0a0410] border border-slate-800 p-4 rounded-b-xl outline-none text-white focus:border-amber-500/50 transition-colors" placeholder="Tóm tắt thông điệp và lời khuyên cho khách hàng..." /></div>
                                    <div className="pt-8 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div><h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><QrCode className="w-5 h-5 text-green-400" /> Mã QR thanh toán</h3><p className="text-sm text-slate-400 mb-4">Quét mã để xác nhận thanh toán đơn hàng này.</p><div className="p-4 bg-white/5 rounded-2xl border border-slate-700 w-fit"><img src={getVietQR(activeRequest.amount, `Thanh toan don ${activeRequest.id}`)} alt="QR Payment" className="w-40 h-40 object-contain rounded-lg" /></div></div>
                                        <div className="flex flex-col justify-center space-y-4"><div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700"><div className="flex items-center justify-between mb-2"><span className="text-slate-400 text-sm">Số tiền:</span><span className="text-xl font-bold text-green-400">{activeRequest.amount.toLocaleString('vi-VN')} đ</span></div><div className="flex items-center justify-between"><span className="text-slate-400 text-sm">Trạng thái:</span><span className="text-xs font-bold bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Chờ xác nhận</span></div></div><p className="text-xs text-slate-500 italic">* Kiểm tra kỹ thông tin trước khi gửi kết quả.</p></div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-sm text-slate-400 mb-2 block">Cập nhật mã QR thanh toán</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleQrUpload}
                                            className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-purple-900/30 file:text-purple-400 hover:file:bg-purple-900/50"
                                        />
                                        {qrBase64 && <img src={qrBase64} alt="Preview QR" className="w-32 h-32 mt-2 rounded-lg border border-slate-700" />}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'history' && (
                            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                <header className="flex justify-between items-center mb-8"><h2 className="text-3xl font-bold text-white">Lịch sử luận giải</h2><div className="relative group"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" placeholder="Tìm kiếm..." className="bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 outline-none w-64 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></header>
                                <div className="bg-[#130823]/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-2xl"><table className="w-full text-left border-collapse"><thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-widest"><tr><th className="px-6 py-4 font-bold">Mã / Ngày</th><th className="px-6 py-4 font-bold">Khách hàng</th><th className="px-6 py-4 font-bold">Chủ đề</th><th className="px-6 py-4 font-bold text-right">Trạng thái</th></tr></thead><tbody className="divide-y divide-slate-800/50">{filteredHistory.map((item) => (<tr key={item.id} className="hover:bg-white/5 transition-colors"><td className="px-6 py-5"><div className="text-amber-500 font-mono text-xs font-bold mb-1">#{item.id}</div><div className="text-slate-500 text-[11px]">{item.timestamp}</div></td><td className="px-6 py-5 text-white text-sm">{item.querentName}</td><td className="px-6 py-5 text-slate-300 text-sm">{item.topic}</td><td className="px-6 py-5 text-right"><span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs font-bold">Hoàn thành</span></td></tr>))}</tbody></table></div>
                            </motion.div>
                        )}

                {isSent && (
                <motion.div key="success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8"><div className="bg-[#130823]/80 backdrop-blur-xl border border-green-500/30 rounded-3xl p-12 text-center"><CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6 animate-pulse" /><h2 className="text-4xl font-bold text-white mb-4">Đã Gửi Bài Giải!</h2><p className="text-slate-400 mb-2">Kết quả đã được gửi đến khách hàng.</p></div><div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-md border-2 border-green-500/30 rounded-[2rem] p-8 shadow-2xl text-center"><h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">Xác nhận thanh toán</h3><button onClick={handleConfirmPayment} disabled={confirmingPayment} className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 mx-auto">{confirmingPayment ? "Đang xử lý..." : <><CheckCircle2 className="w-5 h-5" /> Xác Nhận Đã Nhận Tiền</>}</button></div></motion.div>
                )}
            </AnimatePresence>
            </div>
        </main>
                        {isSent && (
                            <motion.div key="success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8">
                                <div className="bg-[#130823]/80 backdrop-blur-xl border border-green-500/30 rounded-3xl p-12 text-center">
                                    <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6 animate-pulse" />
                                    <h2 className="text-4xl font-bold text-white mb-4">Đã Gửi Bài Giải!</h2>
                                    <p className="text-slate-400 mb-2">Kết quả đã được gửi đến khách hàng.</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-md border-2 border-green-500/30 rounded-[2rem] p-8 shadow-2xl text-center">
                                    <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">Xác nhận thanh toán</h3>
                                    <button onClick={handleConfirmPayment} disabled={confirmingPayment} className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 mx-auto">
                                        {confirmingPayment ? "Đang xử lý..." : <><CheckCircle2 className="w-5 h-5" /> Xác Nhận Đã Nhận Tiền</>}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

        {activeTab === 'workspace' && activeRequest && !isSent && (
            <div className="fixed bottom-6 left-0 md:left-64 right-0 z-40 px-4 flex justify-center"><div className="bg-[#0f0518]/90 border border-slate-700 p-2 pl-6 rounded-2xl flex items-center gap-5 shadow-2xl backdrop-blur-md"><span className="text-white text-sm">{activeRequest.cards.length > 0 ? `Đã nhập ${Object.keys(cardInputs).length}/${activeRequest.cards.length} lá` : "Vui lòng nhập lời khuyên"}</span><button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-amber-600 to-purple-600 px-6 py-2 rounded-xl text-white font-bold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50">{isSubmitting ? "Đang gửi..." : "Gửi Kết Quả"} <Send className="w-4 h-4"/></button></div></div>
        )}
            {activeTab === 'workspace' && activeRequest && !isSent && (
                <div className="fixed bottom-6 left-0 md:left-64 right-0 z-40 px-4 flex justify-center">
                    <div className="bg-[#0f0518]/90 border border-slate-700 p-2 pl-6 rounded-2xl flex items-center gap-5 shadow-2xl backdrop-blur-md"><span className="text-white text-sm">{activeRequest.cards.length > 0 ? `Đã nhập ${Object.keys(cardInputs).length}/${activeRequest.cards.length} lá` : "Vui lòng nhập lời khuyên"}</span><button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-amber-600 to-purple-600 px-6 py-2 rounded-xl text-white font-bold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50">{isSubmitting ? "Đang gửi..." : "Gửi Kết Quả"} <Send className="w-4 h-4" /></button></div>
                </div>
            )}

        <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleConfirmLogout} />
    </div>
  );
            {/* --- ADD LOGOUT MODAL AT THE END --- */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
}