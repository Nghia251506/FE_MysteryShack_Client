"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, MessageSquare, ArrowLeft, Star, Loader2, 
  ShieldCheck, RefreshCw, Clock, CheckCircle2, Info
} from "lucide-react";
import { InterpretationService } from "@/services/interpretationService";

export default function InterpretationResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchResult = async (isSilent = false) => {
    if (!sessionId) return;
    try {
      if (!isSilent) setLoading(true);
      const result = await InterpretationService.getView(sessionId);
      setData(result);
    } catch (err) {
      console.error("Lỗi fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [sessionId]);

  // Tự động reload ngầm để cập nhật trạng thái "Đã thanh toán" (COMPLETED)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (data && data.status !== 'COMPLETED' && data.status !== 2) {
      interval = setInterval(() => fetchResult(true), 15000);
    }
    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showCountdown && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setShowCountdown(false); // Đóng popup sau khi hết 30s
      setCountdown(30);
    }
    return () => clearInterval(timer);
  }, [showCountdown, countdown]);

  const handlePaidConfirmation = async () => {
    setIsProcessing(true);
    try {
      if (sessionId) {
        // Gọi API cập nhật trạng thái báo cho Reader
        await InterpretationService.updateStatus(sessionId, "PAID"); 
      }
      setShowCountdown(true);
    } catch (err) {
      setShowCountdown(true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading && !data) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
      <p className="text-purple-300 font-serif italic animate-pulse">Đang kết nối năng lượng vũ trụ...</p>
    </div>
  );

  const isWaitingReader = !data?.interpretation1 && data?.status !== 'SUBMITTED' && data?.status !== 'COMPLETED';

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-8 relative selection:bg-purple-500/30">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] font-black tracking-[0.2em] uppercase">
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <h2 className="text-[10px] font-black tracking-[0.4em] text-purple-500 uppercase border-b border-purple-500/30 pb-1">KẾT QUẢ LUẬN GIẢI</h2>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f0a18] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          
          {/* Reader Info */}
          <div className="p-8 md:p-12 border-b border-white/5 bg-gradient-to-br from-purple-500/5 to-transparent">
            <div className="flex items-center gap-5 mb-10">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.reader?.fullName}`} className="w-20 h-20 rounded-3xl bg-purple-900/20 p-1 border border-purple-500/30" alt="avatar" />
              <div>
                <h1 className="text-3xl font-serif font-medium text-white">{data.reader?.fullName}</h1>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 mt-1"><Star className="w-3 h-3 fill-current" /> Reader Chuyên Nghiệp</p>
              </div>
            </div>
            <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm">
              <p className="text-[10px] uppercase font-black text-purple-400 mb-4 tracking-[0.3em] flex items-center gap-2"><MessageSquare className="w-3 h-3" /> Vấn đề của bạn</p>
              <p className="text-2xl italic text-slate-200 font-serif leading-relaxed">"{data.questionContent}"</p>
            </div>
          </div>

          {/* Cards Display */}
          <div className="p-8 md:p-12 bg-[#0f0a18]">
            <div className="grid grid-cols-3 gap-6 md:gap-10">
              {data.selectedCards?.map((item: any, idx: number) => (
                <div key={idx} className="space-y-4 group">
                  <div className={`relative aspect-[2/3.2] rounded-2xl overflow-hidden border-2 transition-all duration-500 group-hover:scale-105 ${item.isReversed ? 'rotate-180 border-rose-500/30' : 'border-purple-500/20'}`}>
                    <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.cardName} />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center group-hover:text-purple-400 transition-colors">{item.cardName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LUẬN GIẢI CHI TIẾT (Hiển thị ngay lập tức) */}
          <div className="p-8 md:p-12 bg-black/30 border-t border-white/5">
            <div className="space-y-12 mb-16">
              {[data.interpretation1, data.interpretation2, data.interpretation3].map((text, i) => text && (
                <div key={i} className="flex gap-8 group">
                  <span className="text-5xl font-serif text-purple-900/40 font-bold leading-none">0{i + 1}</span>
                  <p className="text-slate-300 leading-[1.8] text-lg font-light whitespace-pre-wrap">{text}</p>
                </div>
              ))}
              
              {data.advice && (
                <div className="mt-16 p-10 rounded-[2.5rem] bg-gradient-to-br from-amber-500/[0.07] to-transparent border border-amber-500/10 italic font-serif text-2xl text-slate-100 text-center leading-relaxed">
                  "{data.advice}"
                </div>
              )}
            </div>

            {/* PHẦN THANH TOÁN (Chỉ hiển thị nếu status chưa là COMPLETED) */}
            {(data.status !== 'COMPLETED' && data.status !== 2) && (
              <div className="mt-10 pt-10 border-t border-white/5 flex flex-col items-center bg-purple-500/5 rounded-[3rem] p-8">
                <div className="text-center mb-10">
                  <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-[0.4em] mb-3 flex items-center justify-center gap-2">
                     <Info className="w-4 h-4"/> Tri ân năng lượng
                  </h4>
                  <p className="text-slate-400 text-sm italic">Mọi thứ đã được hé lộ. Hãy gửi lời tri ân tới Reader để hoàn tất giao thức.</p>
                </div>

                <div className="relative p-5 bg-white rounded-[2rem] mb-12 shadow-[0_0_50px_rgba(168,85,247,0.15)] group">
                  <img 
                    src={data.qrPayment?.startsWith('data:image') ? data.qrPayment : `data:image/png;base64,${data.qrPayment}`} 
                    className="w-60 h-60 object-contain" 
                    alt="QR Payment" 
                  />
                </div>

                <button 
                  onClick={handlePaidConfirmation}
                  disabled={isProcessing}
                  className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold text-base shadow-xl hover:shadow-purple-500/40 transition-all active:scale-95 disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                    XÁC NHẬN ĐÃ THANH TOÁN
                  </div>
                </button>
              </div>
            )}

            {/* Thông báo khi đã xong hoàn toàn */}
            {(data.status === 'COMPLETED' || data.status === 2) && (
              <div className="mt-10 py-4 flex items-center justify-center gap-2 text-green-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                <CheckCircle2 className="w-4 h-4" /> Giao thức đã hoàn tất thành công
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* POPUP ĐẾM NGƯỢC */}
      <AnimatePresence>
        {showCountdown && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#130823] border border-purple-500/30 p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                  <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={226} strokeDashoffset={226 - (226 * countdown) / 30} className="text-purple-500 transition-all duration-1000" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white font-mono">{countdown}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Thông báo đã gửi!</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">Reader sẽ sớm xác nhận thanh toán của bạn. Bạn có thể tiếp tục xem nội dung bên dưới.</p>
              <button onClick={() => setShowCountdown(false)} className="text-purple-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Đóng</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}