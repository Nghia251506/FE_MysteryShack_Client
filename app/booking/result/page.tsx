"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles, MessageSquare, ArrowLeft, Star, Loader2, 
  ShieldCheck, RefreshCw, WifiOff
} from "lucide-react";
import { InterpretationService } from "@/services/interpretationService";

export default function InterpretationResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = async (isSilent = false) => {
    if (!sessionId) return;
    try {
      if (!isSilent) setLoading(true);
      const result = await InterpretationService.getView(sessionId);
      setData(result);
      setError(null); // Xóa lỗi nếu fetch thành công
    } catch (err: any) {
      // Nếu là fetch ngầm thì không hiện lỗi to tát, chỉ set state error để thông báo nhỏ
      setError(err.response?.data?.message || "Tín hiệu vũ trụ đang bị ngắt quãng...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [sessionId]);

  // Tự động kiểm tra mỗi 15 giây nếu chưa có luận giải HOẶC đang có lỗi
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!data?.interpretation1 || error) {
      interval = setInterval(() => {
        fetchResult(true);
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [data, error]);

  // 1. Loading khi mới vào trang lần đầu
  if (loading && !data) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
      <p className="text-purple-300 font-serif italic animate-pulse text-center">
        Đang kết nối năng lượng vũ trụ...
      </p>
    </div>
  );

  // 2. MÀN HÌNH CHỜ (Gộp cả case Đang chờ Reader và case Lỗi kết nối)
  if (!data?.interpretation1) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md bg-[#130823] border border-purple-500/30 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(168,85,247,0.2)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />

        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
          {
            <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
          }
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          Đang đợi kết nối...
        </h2>
        
        <div className="text-slate-400 leading-relaxed mb-8 space-y-2">
          {
            <p>
              Hệ thống đã nhận được câu hỏi. <br />
              <span className="text-purple-300 font-medium">Bạn vui lòng chờ cho đến khi reader gửi luận giải.</span>
            </p>
          }
          <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-4 block">
             Cập nhật tự động sau mỗi 15s
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => fetchResult()}
            className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all font-bold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
            {loading ? "Đang tải..." : "Làm mới ngay"}
          </button>
          <button onClick={() => router.push('/')} className="text-xs text-slate-500 hover:text-white transition-all uppercase font-bold tracking-widest">
            Quay lại trang chủ
          </button>
        </div>
      </motion.div>
    </div>
  );

  // 4. HIỂN THỊ KẾT QUẢ (Phần đổi font chính)
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-8 relative selection:bg-purple-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] font-black tracking-[0.2em] uppercase">
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <h2 className="text-[10px] font-black tracking-[0.4em] text-purple-500 uppercase border-b border-purple-500/30 pb-1">
            KẾT QUẢ LUẬN GIẢI
          </h2>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f0a18] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">

          {/* Header Thông tin */}
          <div className="p-8 md:p-12 border-b border-white/5 bg-gradient-to-br from-purple-500/5 to-transparent">
            <div className="flex items-center gap-5 mb-10">
              <div className="relative">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.reader?.fullName}`} className="w-20 h-20 rounded-3xl bg-purple-900/20 p-1 border border-purple-500/30 object-cover" alt="avatar" />
                <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-1.5 border-2 border-[#0f0a18]">
                  <ShieldCheck className="w-3 h-3 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-serif font-medium text-white tracking-tight">{data.reader?.fullName}</h1>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 mt-1">
                  <Star className="w-3 h-3 fill-current" /> Reader Chuyên Nghiệp
                </p>
              </div>
            </div>

            <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm">
              <p className="text-[10px] uppercase font-black text-purple-400 mb-4 tracking-[0.3em] flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Vấn đề bạn gửi đến
              </p>
              <p className="text-2xl italic text-slate-200 font-serif leading-[1.6] opacity-90">
                "{data.questionContent}"
              </p>
            </div>
          </div>

          {/* Trải bài - Cải thiện spacing và font tên bài */}
          <div className="p-8 md:p-12 bg-[#0f0a18]">
            <div className="grid grid-cols-3 gap-8">
              {data.selectedCards?.map((item: any, idx: number) => (
                <div key={idx} className="space-y-4 group relative">

                  {/* Số thứ tự lá bài (Badge) */}
                  <div className="absolute -top-3 -left-3 z-20 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center border-2 border-[#0f0a18] shadow-lg shadow-purple-900/40">
                    <span className="text-white font-serif font-bold text-sm">{idx + 1}</span>
                  </div>

                  {/* Hình ảnh lá bài */}
                  <div className={`relative aspect-[2/3.2] rounded-2xl overflow-hidden border-2 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] ${item.isReversed ? 'rotate-180 border-rose-500/30' : 'border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]'}`}>
                    <img
                      src={item.imageUrl}
                      className="w-full h-full object-cover"
                      alt={item.cardName}
                    />
                    {/* Lớp phủ gradient khi hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Tên lá bài */}
                  <p className="text-[10px] font-black text-slate-400 group-hover:text-purple-400 transition-colors uppercase tracking-[0.2em] text-center">
                    {item.cardName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Luận giải - Font chữ nội dung chính */}
          <div className="p-8 md:p-12 bg-black/30 border-t border-white/5 space-y-12">
            {[data.interpretation1, data.interpretation2, data.interpretation3].map((text, i) => text && (
              <div key={i} className="flex gap-8 group">
                <span className="text-5xl font-serif text-purple-900/40 font-bold leading-none transition-colors group-hover:text-purple-600/40">
                  0{i + 1}
                </span>
                <div className="space-y-2">
                  <div className="h-px w-8 bg-purple-500/30 mb-4" />
                  <p className="text-slate-300 leading-[1.8] text-lg font-light font-sans tracking-wide whitespace-pre-wrap first-letter:text-2xl first-letter:font-serif">
                    {text}
                  </p>
                </div>
              </div>
            ))}

            {data.advice && (
              <div className="mt-16 p-10 rounded-[2.5rem] bg-gradient-to-br from-amber-500/[0.07] to-transparent border border-amber-500/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-12 h-12 text-amber-500" />
                </div>
                <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-[0.4em] mb-6">Lời khuyên tâm linh</h4>
                <p className="text-slate-100 italic font-serif text-2xl leading-[1.6] relative z-10 antialiased">
                  {data.advice}
                </p>
              </div>
            )}

            {/* Kiểm tra nếu trạng thái là hoàn thành thì hiện Đánh giá, ngược lại hiện QR */}
            {data.status === 'COMPLETED' ? (
              // --- KHỐI ĐÁNH GIÁ SAO ---
              <div className="mt-12 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center animate-fade-in">
                <div className="text-center mb-6">
                  <h4 className="text-purple-400 font-black uppercase text-[10px] tracking-[0.4em] mb-2">Đánh giá trải nghiệm</h4>
                  <p className="text-slate-400 text-xs italic">Năng lượng của bạn đối với phiên kết nối này thế nào?</p>
                </div>

                <div className="flex gap-3 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-2xl text-yellow-500 hover:scale-110 transition-transform"
                      onClick={() => console.log(`Rated ${star} stars`)}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-300 focus:outline-none focus:border-purple-500"
                  placeholder="Chia sẻ cảm nhận của bạn về Reader..."
                  rows={3}
                />

                <button className="mt-4 px-8 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                  Gửi đánh giá
                </button>
              </div>
            ) : (
              // --- KHỐI QR PAYMENT (Giữ nguyên code cũ của bạn) ---
              data.qrPayment && (
                <div className="mt-12 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center">
                  <div className="text-center mb-6">
                    <h4 className="text-purple-400 font-black uppercase text-[10px] tracking-[0.4em] mb-2">Thanh toán năng lượng</h4>
                    <p className="text-slate-400 text-xs italic">Quét mã QR dưới đây để hoàn tất phiên kết nối</p>
                  </div>

                  <div className="relative p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                    <img
                      src={data.qrPayment.startsWith('data:image') ? data.qrPayment : `data:image/png;base64,${data.qrPayment}`}
                      alt="QR Payment"
                      className="w-64 h-64 object-contain"
                    />
                    <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-purple-500 rounded-tl-lg" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-purple-500 rounded-br-lg" />
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Giao dịch an toàn & bảo mật
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>

        <div className="mt-12 text-center pb-20">
          <p className="text-[10px] font-medium text-slate-600 uppercase tracking-[0.3em]">Kết nối năng lượng kết thúc</p>
        </div>
      </div>
    </div>
  );
}