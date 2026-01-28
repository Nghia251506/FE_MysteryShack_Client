"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, User, Calendar, Timer, AlertCircle, Send,
    Sparkles, QrCode, ArrowLeft, CheckCircle2,
    MessageSquare, Wand2, Bold, Italic, List
} from "lucide-react";
import { InterpretationService } from '@/services/interpretationService';
import { ReadingSessionService } from '@/services/readingSessionService';
import { EditorToolbar } from '@/components/EditorToolbar';

export default function WorkspaceStandalone() {
    const { id } = useParams();
    const router = useRouter();

    // Copy toàn bộ State từ trang cũ sang
    const [activeRequest, setActiveRequest] = useState<any>(null);
    const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
    const [summary, setSummary] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3600);
    const [qrBase64, setQrBase64] = useState<string>("");
    const [confirmingPayment, setConfirmingPayment] = useState(false);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [completedRequests, setCompletedRequests] = useState<any[]>([]);
    const [ignoredIds, setIgnoredIds] = useState<number[]>([]);

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

    // Logic 1: Lấy dữ liệu khi vào trang (Dùng ID từ URL)
    useEffect(() => {
        const loadData = async () => {
            try {
                const idValue = Array.isArray(id) ? id[0] : id;
                const res = await ReadingSessionService.getById(idValue);
                setActiveRequest(transformData(res)); // Dùng hàm transform cũ của bạn
            } catch (err) {
                router.push("/readerdashboard");
            }
        };
        loadData();
    }, [id]);

    // Logic 2: Timer (Giữ nguyên)
    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
        return () => clearInterval(timer);
    }, []);

    // Logic 3: Handle Submit & Confirm (Giữ nguyên hàm cũ của bạn)
    const handleSubmit = async () => {
        if (!activeRequest) return;
        setIsSubmitting(true);

        try {
            console.log(`-----------${activeRequest.id}`)
            console.log(activeRequest)
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
    const handleConfirmPayment = async () => { /* Code cũ của bạn */ };
    const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    if (!activeRequest) return <div className="p-20 text-center text-white">Đang khởi tạo không gian...</div>;

    return (
        <div className="min-h-screen bg-[#0a0410] text-slate-200 p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto pb-32">
                {/* Header điều hướng */}
                <button
                    onClick={() => router.push('/readerdashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-amber-500 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
                </button>

                <AnimatePresence mode="wait">
                    {!isSent ? (
                        <motion.div key="workspace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            {/* --- BÊ NGUYÊN PHẦN UI HEADER WORKSPACE CỦA BẠN VÀO ĐÂY --- */}
                            <header className="bg-[#130823]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                        <Clock className="w-3.5 h-3.5" /> Nhận lúc: {activeRequest.timestamp}
                                        <span className="text-amber-500 font-mono"> | #{activeRequest.id}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{activeRequest.questionName}</h2>
                                    {/* ... Các thông tin Querent ... */}
                                </div>
                                {/* Timer */}
                                <div className="flex flex-col items-center px-6 py-2 bg-slate-950/50 rounded-2xl border border-amber-500/20">
                                    <span className="text-[10px] text-amber-500 font-bold uppercase mb-1">Thời gian còn lại</span>
                                    <div className={`text-3xl font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                            </header>

                            {/* --- PHẦN TEXTAREA LUẬN GIẢI --- */}
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
                                                onChange={(e) => setCardInputs({ ...cardInputs, [card.id]: e.target.value })}
                                                className="w-full h-48 bg-[#0a0410] border border-slate-800 p-4 rounded-b-xl text-white outline-none focus:border-amber-500/50"
                                                placeholder={`Luận giải lá ${card.name}...`}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Tổng kết & Thanh toán (Bê nguyên UI cũ sang) */}
                                <div className="pt-8 border-t border-slate-800">
                                    <h3 className="text-xl font-bold text-amber-500 mb-4 flex items-center gap-2"><Sparkles /> Lời khuyên tổng kết</h3>
                                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full h-32 bg-[#0a0410] border border-slate-800 p-4 rounded-xl text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* --- PHẦN UI KHI ĐÃ GỬI BÀI (isSent) --- */
                        <motion.div key="success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8">
                            <div className="bg-[#130823]/80 border border-green-500/30 rounded-3xl p-12 text-center">
                                <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6" />
                                <h2 className="text-4xl font-bold text-white mb-4">Đã Gửi Bài Giải!</h2>
                                <button onClick={handleConfirmPayment} className="mt-8 px-10 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-500 transition-all">
                                    {confirmingPayment ? "Đang xử lý..." : "Xác Nhận Đã Nhận Tiền"}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Thanh công cụ cố định ở dưới trang Workspace */}
            {!isSent && (
                <div className="fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center">
                    <div className="bg-[#0f0518]/90 border border-slate-700 p-2 pl-6 rounded-2xl flex items-center gap-5 shadow-2xl backdrop-blur-md">
                        <span className="text-white text-sm">
                            Đã nhập {Object.keys(cardInputs).length}/{activeRequest.cards.length} lá
                        </span>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-amber-600 to-purple-600 px-6 py-2 rounded-xl text-white font-bold flex items-center gap-2">
                            {isSubmitting ? "Đang gửi..." : "Gửi Kết Quả"} <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
