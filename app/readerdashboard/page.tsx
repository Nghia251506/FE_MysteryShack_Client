"use client";

import React, { useState, useEffect, useCallback,forwardRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Loader2, X, Clock, 
  ChevronLeft, ChevronRight,
  ArrowUpRight, Inbox,
  Calendar, Zap, Timer, XCircle, CheckCircle2, User
} from "lucide-react";
import { ReadingSessionService } from "@/services/readingSessionService";
import { toast } from "react-hot-toast";

// --- LOGIC LẤY CHI TIẾT ẢNH TỪ ID ---
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

// Link ảnh mặt sau dự phòng (Tránh lỗi CONNECTION_REFUSED từ localhost)
const BACK_CARD_IMG = "https://i.pinimg.com/originals/eb/82/96/eb829623899238374092490df21d5c2e.png";

// --- COMPONENT CON: REQUEST CARD ---
const RequestCard = forwardRef<HTMLDivElement, { req: any; onAccept: any; onReject: any }>(
    ({ req, onAccept, onReject }, ref) => {
        const [displayTime, setDisplayTime] = useState<string>("--:--");
        const [isExpired, setIsExpired] = useState(false);

        useEffect(() => {
            const calculateTime = () => {
                if (!req.rawCreatedAt) return 0;
                const createdTime = new Date(req.rawCreatedAt).getTime();
                const expireTime = createdTime + 5 * 60 * 1000;
                const now = Date.now();
                return Math.floor((expireTime - now) / 1000);
            };

            let diffInSeconds = calculateTime();

            // Kiểm tra ngay lập tức khi mount
            if (diffInSeconds <= 0 && !isExpired) {
                setDisplayTime("00:00");
                setIsExpired(true);
                onReject(req.id, true);
                return;
            }

            const interval = setInterval(() => {
                const currentDiff = calculateTime();
                if (currentDiff <= 0) {
                    setDisplayTime("00:00");
                    if (!isExpired) {
                        setIsExpired(true);
                        onReject(req.id, true);
                    }
                    clearInterval(interval);
                } else {
                    const minutes = Math.floor(currentDiff / 60);
                    const seconds = currentDiff % 60;
                    setDisplayTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
                }
            }, 1000);

            return () => clearInterval(interval);
        }, [req.rawCreatedAt, req.id, onReject, isExpired]);

        // Tính toán phần trăm thanh tiến trình
        const progressWidth = () => {
            if (displayTime === "00:00") return "0%";
            const total = 300; // 5 phút = 300s
            const current = Math.max(0, (new Date(req.rawCreatedAt).getTime() + 300000 - Date.now()) / 1000);
            return `${(current / total) * 100}%`;
        };

        return (
            <motion.div
                ref={ref} // CỰC KỲ QUAN TRỌNG: Gán ref vào đây
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0d1117] border border-white/5 rounded-[2.5rem] p-8 mb-6 relative overflow-hidden shadow-2xl group hover:border-amber-500/30 transition-all"
            >
                {/* Thanh tiến trình phía trên */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: progressWidth() }}
                        transition={{ duration: 1, ease: "linear" }}
                        className={`h-full ${displayTime === "00:00" ? "bg-red-500" : "bg-amber-500"}`}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-8 text-white">
                    {/* Tarot Cards Preview */}
                    <div className="relative w-full lg:w-48 h-40 flex justify-center items-center shrink-0">
                        {req.cards && req.cards.length > 0 ? (
                            req.cards.map((c: any, i: number) => (
                                <div
                                    key={i}
                                    className="absolute w-24 h-36 rounded-xl border border-white/10 overflow-hidden bg-[#1c142e] shadow-2xl transition-transform group-hover:scale-105"
                                    style={{
                                        left: `${i * 22}%`,
                                        rotate: `${(i - 1) * 10}deg`,
                                        zIndex: i,
                                        transformOrigin: "bottom center",
                                    }}
                                >
                                    <img
                                        src={c.img || BACK_CARD_IMG}
                                        alt={c.name}
                                        className={`w-full h-full object-cover ${c.isReversed ? "rotate-180" : ""}`}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = BACK_CARD_IMG;
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-24 h-36 bg-slate-800/50 rounded-xl border border-dashed border-slate-600 flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase">
                                No Cards
                            </div>
                        )}
                    </div>

                    {/* Content Info */}
                    <div className="flex-grow space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                                    #{req.id}
                                </span>
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                        req.status === "MATCHED"
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    }`}
                                >
                                    {req.status === "MATCHED" ? "ĐÃ KHỚP" : "ĐANG CHỜ"}
                                </span>
                            </div>
                            <div
                                className={`flex items-center gap-2 font-mono font-bold text-sm px-3 py-1 rounded-full border ${
                                    displayTime === "00:00"
                                        ? "text-red-500 border-red-500/10 bg-red-500/10"
                                        : "text-green-400 border-green-500/10 bg-green-500/10"
                                }`}
                            >
                                <Timer className="w-4 h-4" /> {displayTime}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-amber-500 transition-colors">
                                {req.topic}
                            </h3>
                            <div className="mt-2 p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:bg-black/60 transition-all">
                                <p className="text-sm text-slate-300 italic">"{req.question}"</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-[10px] border border-amber-500/20">
                                    {req.querentName?.charAt(0) || "Q"}
                                </div>
                                <span className="text-slate-200">{req.querentName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-amber-500/50" />
                                <span>{req.birthDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col justify-end gap-3 shrink-0 min-w-[180px]">
                        <button
                            onClick={() => onReject(req.id, false)}
                            className="flex-1 lg:flex-none p-4 rounded-2xl bg-[#1c142e] text-slate-400 border border-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-tighter"
                        >
                            Bỏ qua <XCircle className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onAccept(req)}
                            className="flex-[2] lg:flex-none py-5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-[11px] uppercase tracking-widest hover:shadow-[0_0_30px_rgba(230,126,34,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/10"
                        >
                            BẮT ĐẦU <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }
);

// --- COMPONENT CHÍNH ---
export default function ReaderDashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ignoredIds, setIgnoredIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const transformData = useCallback((item: any) => {
    let rawCreatedAt = item.createdAt || item.created_at || item.timestamp;
    if (!rawCreatedAt && typeof window !== 'undefined') {
        const key = `session_created_at_${item.id}`;
        const stored = localStorage.getItem(key);
        if (stored) rawCreatedAt = stored;
        else { rawCreatedAt = new Date().toISOString(); localStorage.setItem(key, rawCreatedAt); }
    }

    let cards: any[] = [];
    try {
        let raw = item.selectedCards;
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

    let birthDateDisplay = "Chưa cung cấp";
    const rawDob = item.customer?.birthDate || item.birthDate;
    if(rawDob) { try { if (Array.isArray(rawDob)) birthDateDisplay = `${rawDob[2]}/${rawDob[1]}/${rawDob[0]}`; else { const d = new Date(rawDob); birthDateDisplay = !isNaN(d.getTime()) ? d.toLocaleDateString('vi-VN') : String(rawDob); } } catch { birthDateDisplay = String(rawDob); } }

    let querentName = item.customer?.fullName || item.fullName || "Khách ẩn danh";
    let questionContent = item.question?.content || item.question?.questionText || item.questionName || "Không có câu hỏi";
    if (item.note && (querentName === "Khách ẩn danh" || querentName === "customer")) { if (item.note.includes("KH:")) querentName = item.note.split("KH:")[1].split("-")[0].trim(); }

    return {
        id: item.id, querentName, topic: "Tổng quan", question: questionContent,
        birthDate: birthDateDisplay, timestamp: new Date(rawCreatedAt).toLocaleString('vi-VN'),
        cards, status: item.status, amount: item.amount || 50000, rawCreatedAt
    };
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      const response: any = await ReadingSessionService.getAll();
      const dataList = Array.isArray(response) ? response : (response.content || []);
      const pending = dataList
        .filter((i: any) => (i.status === 'PENDING' || i.status === 'MATCHED') && !ignoredIds.includes(i.id))
        .map(transformData);
      setRequests(pending);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, [ignoredIds, transformData]);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleAccept = async (req: any) => {
    try {
      await ReadingSessionService.accept(req.id);
      toast.success(`Đã nhận đơn của ${req.querentName}`);
      router.push(`/readerdashboard/workspace/${req.id}`);
    } catch (e) { toast.error("Lỗi nhận đơn"); }
  };

  const handleReject = (id: number, isAuto: boolean = false) => {
    setIgnoredIds(prev => [...prev, id]);
    if(!isAuto) toast.success("Đã ẩn yêu cầu");
  };

  const filteredRequests = requests.filter(r => r.querentName.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentItems = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Zap className="text-amber-500 fill-amber-500 w-8 h-8" /> Yêu cầu <span className="text-amber-500">Mới nhất</span>
          </h1>
          <p className="text-slate-500 text-sm">Bạn có {requests.length} phiên cần giải mã</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Tìm tên khách hàng..." className="w-full bg-[#0d1117]/80 border border-white/10 rounded-2xl py-3 pl-12 text-white outline-none focus:border-amber-500/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-40"><Loader2 className="w-10 h-10 text-amber-500 animate-spin" /></div>
      ) : currentItems.length > 0 ? (
        <div className="flex flex-col">
          <AnimatePresence mode="popLayout">
            {currentItems.map((req) => (
              <RequestCard key={req.id} req={req} onAccept={handleAccept} onReject={handleReject} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[4rem]">
          <Inbox className="w-16 h-16 text-slate-800 mb-6" />
          <p className="text-slate-600 font-black uppercase text-xs tracking-[0.4em]">Danh sách trống</p>
        </div>
      )}
    </div>
  );
}