"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Award,
  Clock,
  MessageSquare,
  Sparkles,
  Lock,
} from "lucide-react";

import Header from "@/components/Header";
import SocialFloating from "@/components/SocialFloating";
import RatingModal from "@/components/RatingModal";

import { InterpretationService } from "@/services/interpretationService";
import { useAppSelector } from "@/hooks/useAppRedux";
import { RootState } from "@/store/store";

export default function InterpretationResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const { user } = useAppSelector((state: RootState) => state.auth);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchResult = async (isSilent = false) => {
    if (!sessionId) return;
    try {
      if (!isSilent) setLoading(true);
      const result = await InterpretationService.getView(sessionId);
      setData(result);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [sessionId]);

  // Reload ngầm mỗi 10s nếu chưa hoàn thành để tự động mở khóa khi Reader chốt đơn
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (data && data.status !== "COMPLETED" && data.status !== 2) {
      interval = setInterval(() => fetchResult(true), 10000);
    }
    return () => clearInterval(interval);
  }, [data]);

  const handlePaidConfirmation = async () => {
    setIsProcessing(true);
    try {
      if (sessionId)
        await InterpretationService.updateStatus(sessionId, "PAID");
      // Sau khi bấm, gọi lại API để cập nhật UI sang trạng thái chờ check
      fetchResult(true);
    } catch (err) {
      console.error("Lỗi xác nhận:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Màn hình Loading ban đầu
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <p className="text-purple-300 font-serif italic">Đang kết nối năng lượng vũ trụ...</p>
      </div>
    );
  }

  // Biến check trạng thái hoàn tất
  const isFinished = data?.status === "COMPLETED" || data?.status === 2;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 relative">
      <Header />
      <div className="max-w-4xl mx-auto pt-24 pb-20 px-4 md:px-8 relative z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 text-[10px] font-black tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Trở về
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f0a18] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {/* Header Thông tin Reader & Câu hỏi */}
          <div className="p-8 md:p-12 border-b border-white/5 bg-gradient-to-br from-purple-500/5 to-transparent">
            <div className="flex items-center gap-5 mb-10">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data?.reader?.fullName}`}
                className="w-20 h-20 rounded-3xl bg-purple-900/20 border border-purple-500/30 p-1"
                alt="avatar"
              />
              <div>
                <h1 className="text-3xl font-serif text-white">{data?.reader?.fullName}</h1>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                  <Star className="w-3 h-3 fill-current" /> Reader Chuyên Nghiệp
                </p>
              </div>
            </div>
            <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5">
              <p className="text-[10px] uppercase font-black text-purple-400 mb-4 tracking-widest">Câu hỏi của bạn</p>
              <p className="text-2xl italic text-slate-200 font-serif leading-relaxed">"{data?.questionContent}"</p>
            </div>
          </div>

          {/* Hiển thị các lá bài đã chọn */}
          <div className="p-8 md:p-12 grid grid-cols-3 gap-6 bg-black/20">
            {data?.selectedCards?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-4">
                <div className={`aspect-[2/3.2] rounded-2xl overflow-hidden border-2 shadow-2xl ${item.isReversed ? "rotate-180 border-rose-500/30" : "border-purple-500/20"}`}>
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.cardName} />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{item.cardName}</p>
              </div>
            ))}
          </div>

          {/* PHẦN LUẬN GIẢI - CHỈ MỞ KHI COMPLETED */}
          <AnimatePresence mode="wait">
            {isFinished ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-8 md:p-12 bg-black/30 border-t border-white/5 space-y-12"
              >
                {[data?.interpretation1, data?.interpretation2, data?.interpretation3].map((text, i) => text && (
                  <div key={i} className="flex gap-8 group">
                    <span className="text-5xl font-serif text-purple-900/40 font-bold leading-none group-hover:text-purple-600/40 transition-colors">0{i + 1}</span>
                    <div className="space-y-2">
                      <div className="h-px w-8 bg-purple-500/30 mb-4" />
                      <p className="text-slate-300 leading-[1.8] text-lg font-light whitespace-pre-wrap">{text}</p>
                    </div>
                  </div>
                ))}
                
                {data?.advice && (
                  <div className="mt-16 p-10 rounded-[2.5rem] bg-gradient-to-br from-amber-500/[0.07] to-transparent border border-amber-500/10 relative overflow-hidden">
                    <Sparkles className="absolute top-6 right-6 w-8 h-8 text-amber-500/20" />
                    <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-[0.4em] mb-6">Lời khuyên tâm linh</h4>
                    <p className="text-slate-100 italic font-serif text-2xl leading-[1.6]">{data.advice}</p>
                  </div>
                )}

                <div className="mt-10 py-10 border-t border-white/5 flex flex-col items-center">
                  <div className="bg-green-500/10 border border-green-500/20 px-6 py-2 rounded-full mb-8 text-green-500 font-bold text-[10px] tracking-widest uppercase">
                    <CheckCircle2 className="inline mr-2" size={16} /> Phiên đã hoàn tất
                  </div>
                  <button
                    onClick={() => setShowRating(true)}
                    className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-400 rounded-2xl text-black font-black text-xs tracking-widest flex items-center gap-3 shadow-xl"
                  >
                    <Award className="w-5 h-5" /> ĐÁNH GIÁ READER
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="locked"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-12 bg-black/40 border-t border-white/5 text-center"
              >
                <div className="max-w-md mx-auto py-12">
                  <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                    <Lock className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-3">Thông điệp đang được niêm phong</h3>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed">
                    Bạn cần hoàn tất thanh toán và đợi Reader xác nhận để có thể xem luận giải chi tiết từ vũ trụ.
                  </p>

                  {/* Khu vực Thanh toán QR */}
                  <div className="bg-black/40 border border-white/10 rounded-[2rem] p-8">
                    <p className="text-[10px] uppercase font-black text-amber-500 tracking-[0.2em] mb-4">Quét mã để giải mã</p>
                    <div className="text-3xl font-serif text-white mb-6">
                      {(data?.amount || 0).toLocaleString("vi-VN")} <span className="text-sm font-sans text-slate-500">VNĐ</span>
                    </div>
                    <img
                      src={data?.qrPayment?.startsWith('http') ? data.qrPayment : `data:image/png;base64,${data?.qrPayment}`}
                      className="w-48 h-48 mx-auto object-contain bg-white p-3 rounded-2xl mb-8 shadow-2xl"
                      alt="QR Payment"
                    />
                    <button
                      onClick={handlePaidConfirmation}
                      disabled={isProcessing || data?.status === "PAID"}
                      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                        data?.status === "PAID" 
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-[1.02]"
                      }`}
                    >
                      {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                      {data?.status === "PAID" ? "ĐANG CHỜ XÁC NHẬN..." : "XÁC NHẬN ĐÃ CHUYỂN KHOẢN"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <SocialFloating />
      <RatingModal
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        readerName={data?.reader?.fullName || "Reader"}
        requestId={Number(sessionId)}
      />
    </div>
  );
}