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
} from "lucide-react";

// Import các Component
import Header from "@/components/Header";
import SocialFloating from "@/components/SocialFloating";
import RatingModal from "@/components/RatingModal";

// Import Services & Hooks chuẩn của ông
import { InterpretationService } from "@/services/interpretationService";
import { useAppSelector } from "@/hooks/useAppRedux"; // Dùng hook này để lấy user
import { RootState } from "@/store/store";

export default function InterpretationResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  // Dùng hook chuẩn của ông để lấy thông tin user từ Redux
  const { user } = useAppSelector((state: RootState) => state.auth);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchResult = async (isSilent = false) => {
    if (!sessionId) return;
    try {
      if (!isSilent) setLoading(true);
      const result = await InterpretationService.getView(sessionId);
      console.log(result);
      setData(result);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [sessionId]);

  // Reload ngầm mỗi 10s nếu chưa hoàn thành
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
      setShowCountdown(true);
    } catch (err) {
      setShowCountdown(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- LOGIC MÀN HÌNH CHỜ (ĐÃ FIX MẠNH) ---
  // Check nếu data tồn tại nhưng chưa có nội dung luận giải hoặc status chưa xong
  const isPending =
    data &&
    data.status === "PENDING" && // Bắt lỗi hiện "" như trong ảnh
    data.status !== "COMPLETED" &&
    data.status !== 2 &&
    loading === true;

  if (loading === false && isPending && data?.status === "PENDING")
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <p className="text-purple-300 font-serif italic">
          Đang kết nối năng lượng vũ trụ...
        </p>
      </div>
    );

  if (loading === true)
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0f0a18] border border-purple-500/30 p-12 rounded-[3rem] max-w-lg shadow-2xl relative z-10"
        >
          <Clock className="w-16 h-16 text-purple-500 animate-pulse mx-auto mb-6" />
          <h2 className="text-2xl font-serif text-white mb-4">
            Reader {data?.reader?.fullName || ""} đang nhập kết quả...
          </h2>
          <p className="text-slate-400 italic mb-8">
            Năng lượng đang được chuyển hóa. Kết quả sẽ tự động hiển thị ngay
            khi Reader hoàn tất.
          </p>
          <button
            onClick={() => router.push("/profile")}
            className="px-8 py-3 border border-purple-500/30 rounded-full text-purple-400 uppercase text-[10px] font-black tracking-widest"
          >
            Xem các phiên khác
          </button>
        </motion.div>
        <SocialFloating />
      </div>
    );

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
          <div className="p-8 md:p-12 border-b border-white/5 bg-gradient-to-br from-purple-500/5 to-transparent">
            <div className="flex items-center gap-5 mb-10">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data?.reader?.fullName}`}
                className="w-20 h-20 rounded-3xl bg-purple-900/20 border border-purple-500/30 p-1"
                alt="avatar"
              />
              <div>
                <h1 className="text-3xl font-serif text-white">
                  {data?.reader?.fullName}
                </h1>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                  <Star className="w-3 h-3 fill-current" /> Reader Chuyên Nghiệp
                </p>
              </div>
            </div>
            <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5">
              <p className="text-[10px] uppercase font-black text-purple-400 mb-4 tracking-widest">
                Câu hỏi của bạn
              </p>
              <p className="text-2xl italic text-slate-200 font-serif leading-relaxed">
                "{data?.questionContent}"
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-3 gap-6">
            {data?.selectedCards?.map((item: any, idx: number) => (
              <div key={idx} className="space-y-4">
                <div
                  className={`aspect-[2/3.2] rounded-2xl overflow-hidden border-2 ${item.isReversed ? "rotate-180 border-rose-500/30" : "border-purple-500/20"}`}
                >
                  <img
                    src={item.imageUrl}
                    className="w-full h-full object-cover"
                    alt={item.cardName}
                  />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                  {item.cardName}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 md:p-12 bg-black/30 border-t border-white/5">
            <div className="space-y-12 mb-16">
              {[
                data?.interpretation1,
                data?.interpretation2,
                data?.interpretation3,
              ].map(
                (text, i) =>
                  text && (
                    <div key={i} className="flex gap-8">
                      <span className="text-5xl font-serif text-purple-900/40 font-bold">
                        0{i + 1}
                      </span>
                      <p className="text-slate-300 leading-[1.8] text-lg font-light whitespace-pre-wrap">
                        {text}
                      </p>
                    </div>
                  ),
              )}
            </div>

            {/* Thanh toán QR */}
            {data?.status !== "COMPLETED" && data?.status !== 2 && (
              <div className="mt-10 pt-10 border-t border-white/5 flex flex-col items-center">
                <div className="mb-6 text-center">
                  <p className="text-[10px] uppercase font-black text-amber-500 tracking-[0.2em] mb-2">
                    Số tiền cần thanh toán
                  </p>
                  <div className="text-4xl font-serif text-white flex items-baseline gap-2">
                    {/* Giả sử amount nằm trong data.amount hoặc data.readingSession.amount */}
                    {(
                      data?.amount ||
                      data?.readingSession?.amount ||
                      0
                    ).toLocaleString("vi-VN")}
                    <span className="text-sm font-sans text-slate-500 uppercase">
                      VNĐ
                    </span>
                  </div>
                </div>
                <img
                  src={
                    data?.qrPayment?.startsWith("data:image")
                      ? data.qrPayment
                      : `data:image/png;base64,${data?.qrPayment}`
                  }
                  className="w-60 h-60 object-contain bg-white p-4 rounded-3xl mb-8"
                  alt="QR"
                />
                <button
                  onClick={handlePaidConfirmation}
                  disabled={isProcessing}
                  className="px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold flex items-center gap-3"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ShieldCheck />
                  )}{" "}
                  XÁC NHẬN THANH TOÁN
                </button>
              </div>
            )}

            {/* Rating Button */}
            {(data?.status === "COMPLETED" || data?.status === 2) && (
              <div className="mt-10 py-10 border-t border-white/5 flex flex-col items-center">
                <div className="bg-green-500/10 border border-green-500/20 px-6 py-2 rounded-full mb-8 text-green-500 font-bold text-[10px] tracking-widest">
                  <CheckCircle2 className="inline mr-2" size={16} /> HOÀN TẤT
                </div>
                <button
                  onClick={() => setShowRating(true)}
                  className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-400 rounded-2xl text-black font-black text-xs tracking-widest flex items-center gap-3 shadow-xl shadow-amber-500/20"
                >
                  <Award className="w-5 h-5" /> ĐÁNH GIÁ READER
                </button>
              </div>
            )}
          </div>
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
