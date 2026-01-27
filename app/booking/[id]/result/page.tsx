"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Lock, Unlock, Sparkles, Star, User, Calendar, 
  CheckCircle2, AlertCircle, Loader2, ArrowRight, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InterpretationService } from "@/services/interpretationService"; // Giả định bạn có service này

// --- 1. HELPER: LẤY ẢNH TAROT (Giống bên Reader Dashboard) ---
const getCardDetail = (id: number) => {
  const safeId = Number(id);
  const getImg = (prefix: string, num: number) => 
    `https://www.sacred-texts.com/tarot/pkt/img/${prefix}${num.toString().padStart(2, '0')}.jpg`;

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

// --- 2. HELPER: TÁCH CHUỖI TỪ READER (Quan trọng) ---
// Reader gửi dạng: "Header ||| Card1 Text ||| Card2 Text ||| Summary"
const parseContent = (fullText: string) => {
    if (!fullText) return [];
    return fullText.split("|||").map(s => s.trim()).filter(Boolean);
};

// --- 3. HELPER: TẠO QR CODE ---
const getVietQR = (amount: number, content: string) => 
    `https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`;


export default function UserResultPage() {
  const params = useParams(); 
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [cardsData, setCardsData] = useState<any[]>([]); // Lưu thông tin ảnh bài
  const [textSections, setTextSections] = useState<string[]>([]); // Lưu nội dung luận giải
  
  // --- TRẠNG THÁI THANH TOÁN ---
  const [isPaid, setIsPaid] = useState(false); 
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if(sessionId) fetchResult();
  }, [sessionId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      // Gọi API lấy kết quả (Giả sử API trả về cả status thanh toán)
      // const response = await InterpretationService.getById(sessionId);
      
      // --- MOCK DATA ĐỂ TEST ---
      const response = {
          status: isPaid ? 'COMPLETED' : 'PAYMENT_PENDING', // Giả lập
          selectedCards: [1, 5, 10], // ID 3 lá bài
          amount: 50000,
          // Nội dung Reader đã nhập (Giả lập cấu trúc |||)
          content: `Khách hàng: Giang - 18/08/1998\nCâu hỏi: Tình yêu sắp tới?|||
                    Lá 1 (The Magician): Bạn có đầy đủ nguồn lực để bắt đầu một mối quan hệ mới. Sự tự tin là chìa khóa.|||
                    Lá 2 (The Hierophant): Có thể bạn sẽ gặp người này qua sự giới thiệu của người lớn tuổi hoặc môi trường truyền thống.|||
                    Lá 3 (Wheel of Fortune): Vận mệnh đang xoay chuyển, một cơ hội bất ngờ sẽ đến vào tháng sau.|||
                    LỜI KHUYÊN TỔNG KẾT:\nHãy mở lòng và đón nhận những tín hiệu từ vũ trụ. Đừng ngại thử thách bản thân ở môi trường mới.`
      };

      setData(response);
      
      // 1. Xử lý Cards (Để lấy ảnh)
      const processedCards = response.selectedCards.map((id: number) => getCardDetail(id));
      setCardsData(processedCards);

      // 2. Xử lý Nội dung Text
      setTextSections(parseContent(response.content));

    } catch (error) {
      console.error("Lỗi tải kết quả:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
      setPaying(true);
      // Giả lập gọi API check thanh toán
      setTimeout(() => {
          setIsPaid(true); // Mở khóa!
          setPaying(false);
          alert("Thanh toán thành công! Đã mở khóa toàn bộ nội dung.");
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0410] flex flex-col items-center justify-center">
        <div className="relative">
            <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 animate-pulse"></div>
            <Loader2 className="relative w-12 h-12 text-amber-500 animate-spin" />
        </div>
        <p className="mt-4 text-slate-400 font-medium text-sm tracking-widest uppercase">Đang kết nối vũ trụ...</p>
    </div>
  );

  if (!data) return null;

  // --- MAP DỮ LIỆU ---
  // textSections[0] là Header Info
  // textSections[1...N] là nội dung bài
  // textSections[Last] là Tổng kết
  const headerInfo = textSections[0]; 
  const summaryInfo = textSections[textSections.length - 1];
  
  // Ghép Card Image với Text tương ứng
  // Giả sử Reader nhập đúng thứ tự: Card 1 -> Text 1 (ở index 1 của mảng textSections)
  const readingCards = cardsData.map((card, index) => ({
      ...card,
      content: textSections[index + 1] || "Đang cập nhật nội dung..."
  }));

  return (
    <div className="min-h-screen bg-[#0a0410] text-slate-200 font-sans pb-32 selection:bg-amber-500/30">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0a0410]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-white tracking-wider">MYSTIC READER</span>
            </div>
            {isPaid && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-500/20 text-green-400 text-xs font-bold">
                    <CheckCircle2 className="w-3 h-3" /> PREMIUM
                </div>
            )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 relative z-10 space-y-12">
        
        {/* 1. INFO CARD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#130823] to-[#0f0518] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 bg-amber-500/10 blur-[60px] rounded-full"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 leading-tight">Kết Quả Luận Giải</h1>
                    <div className="text-amber-200/80 text-sm font-medium flex items-center gap-2 mb-4">
                        <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString('vi-VN')}
                    </div>
                    <div className="whitespace-pre-line text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed text-sm">
                        {headerInfo}
                    </div>
                </div>
                <div className="shrink-0 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg shadow-amber-900/40 text-[#0a0410]">
                   <Star className="w-8 h-8 fill-current" />
                </div>
            </div>
        </motion.div>

        {/* 2. READING CARDS */}
        <div className="space-y-12">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">Thông Điệp Tarot</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            {readingCards.map((card, index) => {
                const isLocked = !isPaid && index > 0; // Khóa từ lá thứ 2 trở đi nếu chưa trả tiền

                return (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative grid md:grid-cols-[200px_1fr] gap-8 p-6 rounded-3xl border transition-all duration-500 ${isLocked ? 'bg-[#0a0410] border-white/5' : 'bg-[#130823]/60 border-purple-500/20 hover:border-amber-500/30 hover:bg-[#130823]'}`}
                    >
                        {/* Cột ảnh bài */}
                        <div className="relative flex flex-col items-center">
                            <div className={`relative w-48 h-72 rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 ${!isLocked && 'group-hover:scale-105 group-hover:-rotate-1'} border-[3px] ${isLocked ? 'border-slate-800' : 'border-slate-700'}`}>
                                <img src={card.img} alt={card.name} className={`w-full h-full object-cover ${isLocked ? 'grayscale opacity-50 blur-sm' : ''}`} />
                                {isLocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                        <Lock className="w-10 h-10 text-slate-400" />
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className={`font-bold ${isLocked ? 'text-slate-600' : 'text-amber-400'}`}>{card.name}</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Lá bài #{index + 1}</p>
                            </div>
                        </div>

                        {/* Cột nội dung */}
                        <div className="relative">
                            <div className={`h-full whitespace-pre-line leading-loose text-slate-300 text-sm md:text-base ${isLocked ? 'blur-md select-none opacity-30 overflow-hidden max-h-[200px]' : ''}`}>
                                {card.content}
                            </div>
                            
                            {/* --- LỚP PHỦ KHI BỊ KHÓA --- */}
                            {isLocked && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
                                    <div className="bg-[#0a0410]/90 border border-amber-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs">
                                        <Lock className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                                        <h4 className="text-white font-bold mb-1">Nội Dung Cao Cấp</h4>
                                        <p className="text-slate-400 text-xs mb-4">Mở khóa để xem chi tiết ý nghĩa lá bài này dành cho bạn.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>

        {/* 3. SUMMARY */}
        {textSections.length > 1 && (
            <motion.div 
                initial={{ opacity: 0 }} 
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="pt-8"
            >
                <div className={`relative bg-gradient-to-br from-purple-900/20 to-[#0f0518] border border-purple-500/30 rounded-3xl p-8 md:p-12 text-center overflow-hidden ${!isPaid ? 'opacity-80' : ''}`}>
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    <Sparkles className="absolute top-6 left-6 w-6 h-6 text-purple-500 opacity-50" />
                    <Sparkles className="absolute bottom-6 right-6 w-6 h-6 text-amber-500 opacity-50" />

                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                        <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> 
                        Tổng Kết & Lời Khuyên
                    </h3>

                    <div className={`whitespace-pre-line text-slate-200 leading-loose relative z-10 ${!isPaid ? 'blur-lg select-none h-32 overflow-hidden' : ''}`}>
                        {summaryInfo}
                    </div>

                    {!isPaid && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-t from-[#0a0410] via-transparent to-transparent">
                            <div className="bg-[#130823] border border-white/10 px-6 py-3 rounded-full flex items-center gap-3 shadow-xl">
                                <Lock className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-bold text-white">Lời khuyên bị khóa</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        )}

      </main>

      {/* FOOTER ACTION: THANH TOÁN */}
      <AnimatePresence>
      {!isPaid && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 p-6 z-50 flex justify-center bg-gradient-to-t from-[#0a0410] via-[#0a0410]/95 to-transparent backdrop-blur-[2px]"
          >
              <button 
                  onClick={handlePayment}
                  disabled={paying}
                  className="group relative w-full max-w-md bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-[#0a0410] font-bold text-lg px-8 py-4 rounded-2xl shadow-[0_0_40px_-10px_rgba(245,158,11,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 overflow-hidden flex items-center justify-center gap-3"
              >
                  <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12"></div>
                  
                  {paying ? (
                      <><Loader2 className="animate-spin w-5 h-5" /> Đang xử lý...</>
                  ) : (
                      <>
                        <Unlock className="w-5 h-5" /> 
                        <span>Mở khóa Full Luận Giải</span>
                        <span className="bg-black/10 px-2 py-0.5 rounded text-sm ml-1">50.000đ</span>
                      </>
                  )}
              </button>
          </motion.div>
      )}
      </AnimatePresence>

    </div>
  );
}