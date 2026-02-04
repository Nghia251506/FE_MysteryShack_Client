"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Wallet,
  Star,
  Zap,
  BarChart3,
  History,
  Gem,
  ShieldCheck,
  Trophy,
  ArrowUpRight,
  PieChart,
  Loader2,
  Clock,
} from "lucide-react";
import { ReadingSessionService } from "@/services/readingSessionService";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { fetchReaderRatings } from "@/store/slices/ratingSlice";
// IMPORT THÊM ĐÂY
import { fetchCurrentSubscription } from "@/store/slices/subscriptionSlice";
import { BsFillBookmarkStarFill } from "react-icons/bs";

export default function ReaderDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // 1. Lấy dữ liệu từ Redux
  const { user } = useAppSelector((state: any) => state.auth);
  const ratingState = useAppSelector((state: any) => state.rating);
  // LẤY THÊM SUBSCRIPTION TỪ STORE
  const { currentSub, loading: subLoading } = useAppSelector((state: any) => state.subscription);

  const rStats = ratingState.stats;
  const readerId = user?.id;

  const [incomeStats, setIncomeStats] = useState({
    todayIncome: 0,
    totalIncome: 0,
    totalSessions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [processingSession, setProcessingSession] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // 3. Fetch dữ liệu tổng hợp
  const fetchDashboardData = useCallback(async () => {
    if (!readerId) return;

    try {
      setLoading(true);

      // Gọi song song tất cả
      const [income, sessions, activeSession, ratings, sub] = await Promise.all([
        ReadingSessionService.getAllAmount(),
        ReadingSessionService.getAllSession(),
        ReadingSessionService.getProcessingSession(Number(readerId)),
        dispatch(fetchReaderRatings(Number(readerId))).unwrap(),
        dispatch(fetchCurrentSubscription()).unwrap(),
      ]);

      console.log("Check data về:", { income, sessions });

      // Cập nhật State với đúng biến đã hứng ở trên
      setIncomeStats({
        totalIncome: income || 0,
        totalSessions: sessions || 0,
        todayIncome: income || 0,
      });

      setProcessingSession(activeSession);

    } catch (error) {
      console.error("Lỗi Dashboard API:", error);
    } finally {
      setLoading(false);
    }
  }, [readerId, dispatch]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Logic Countdown giữ nguyên...
  useEffect(() => {
    if (!processingSession || !processingSession.acceptedAt) return;
    const timer = setInterval(() => {
      const startTime = new Date(processingSession.acceptedAt).getTime();
      const endTime = startTime + 60 * 60 * 1000;
      const diff = Math.floor((endTime - Date.now()) / 1000);
      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(timer);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [processingSession]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- LOGIC DATA ĐỘNG CHO GÓI ---
  // Tính toán phần trăm dựa trên data thật hoặc default nếu chưa mua gói
  const totalLimit = currentSub?.maxJobs || 1; // Tránh chia cho 0
  const remaining = currentSub?.remainingJobs ?? 0;
  const progressPercent = (remaining / totalLimit) * 100;

  if (loading || !readerId) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase text-[10px] tracking-[0.3em]">
          Đang kết nối luồng năng lượng...
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 pb-32">
      {/* Header và Stats Section giữ nguyên UI của ông... */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-2">
        <div className="flex-1">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Tổng quan <span className="text-amber-500">thu nhập</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            ID: <span className="text-slate-300 font-bold">#{readerId}</span> —
            Tháng này nhận được{" "}
            <span className="text-amber-500 font-bold">
              {rStats?.totalReviewsMonth ?? 0}
            </span>{" "}
            đánh giá.
          </p>
        </div>

        {/* PROCESSING WIDGET UI của ông... */}
        <AnimatePresence mode="wait">
          {processingSession ? (
            <motion.div
              key="processing"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(`/workspace/${processingSession.id}`)}
              className="relative group cursor-pointer flex-shrink-0"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-amber-600/20 rounded-[2rem] blur-md opacity-75"></div>
              <div className="relative bg-[#1a0b2e]/90 border border-red-500/20 backdrop-blur-2xl p-3 px-6 rounded-[2rem] flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${timeLeft < 600 ? "bg-red-600 animate-pulse" : "bg-amber-500"}`}>
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col min-w-[160px]">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">Đang diễn ra</span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5 italic">Phiên luận giải hiện tại</p>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-mono font-black">
                    <span className={timeLeft < 600 ? "text-red-500" : "text-amber-400"}>{formatTime(timeLeft)}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-red-500" />
              </div>
            </motion.div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 px-6 rounded-[2rem] flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sẵn sàng nhận khách</span>
            </div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 flex-shrink-0">
          <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-white font-bold text-sm">
              {rStats?.averageRatingMonth ? rStats.averageRatingMonth.toFixed(1) : "0.0"}
            </span>
          </div>
          <div className="bg-[#130823]/80 border border-amber-500/20 px-4 py-3 rounded-2xl flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] text-slate-300 font-black uppercase leading-none">Top Reader<br />Yêu thích</span>
          </div>
        </div>
      </header>

      {/* STATS SECTION UI giữ nguyên... */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-blue-400">
              <Wallet className="w-6 h-6 text-amber-800" />
            </div>
            <TrendingUp className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/10 rotate-12" />
            <p className="text-l font-black uppercase tracking-widest opacity-80 p-2">Thu nhập ròng</p>
          </div>
          <h2 className="text-4xl font-black mt-2 italic">+{incomeStats.todayIncome.toLocaleString()}đ</h2>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold bg-black/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
            <ArrowUpRight className="w-3 h-3" /> Tăng trưởng ổn định
          </div>
        </motion.div>

        {/* Đánh giá box */}
        <motion.div whileHover={{ y: -5 }} className="bg-[#130823]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-xl shadow-black/50">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
              <BsFillBookmarkStarFill className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full uppercase">Đánh giá</span>
          </div>
          <div className="mt-8">
            <p className="text-3xl font-black text-white italic">{rStats?.totalReviewsMonth || 0} Lượt</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Tổng review đã nhận</p>
          </div>
        </motion.div>

        {/* Năng suất box */}
        <motion.div whileHover={{ y: -5 }} className="bg-[#130823]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-xl shadow-black/50">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
              <PieChart className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full uppercase">Năng suất</span>
          </div>
          <div className="mt-8">
            <p className="text-3xl font-black text-white italic">{incomeStats.totalSessions} Phiên</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Đã hoàn thành luận giải</p>
          </div>
        </motion.div>
      </section>

      {/* QUẢN LÝ GÓI - ĐÃ ĐƯỢC GẮN DATA ĐỘNG */}
      <section className="bg-gradient-to-r from-[#1c142e] to-[#0d1117] border border-amber-500/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
          <Gem className="w-64 h-64" />
        </div>
        <div className="flex items-center gap-8 z-10">
          <div className="w-24 h-24 rounded-[2rem] bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
            <Gem className="w-12 h-12 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              {currentSub?.packageName || "Chưa mua gói"}
            </h3>
            <p className="text-sm text-slate-400 font-medium tracking-tight">
              Trạng thái: <span className={currentSub?.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}>
                {currentSub?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Hết hạn/Chưa có'}
              </span>
              {currentSub?.endDate && ` • Hạn: ${new Date(currentSub.endDate).toLocaleDateString('vi-VN')}`}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-4 z-10 w-full md:w-80">
          <div className="w-full">
            <div className="flex justify-between text-[10px] font-black uppercase mb-3 text-white tracking-widest">
              <span className="text-amber-500">Lượt nhận khách trong ngày</span>
              <span>
                {remaining} / {currentSub?.maxJobs || 0}
              </span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={`h-full shadow-[0_0_20px_rgba(245,158,11,0.4)] ${progressPercent <= 20 ? 'bg-gradient-to-r from-red-600 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-amber-600 to-amber-400'
                  }`}
              />
            </div>
          </div>
          <button
            onClick={() => router.push('/readerdashboard/pricing')} // Hoặc link trang mua gói của ông
            className="w-full md:w-auto mt-2 px-8 py-3 bg-white text-black text-xs font-black uppercase rounded-2xl hover:bg-amber-500 hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-3"
          >
            {currentSub ? "Gia hạn gói" : "Mua gói ngay"} <Zap className="w-4 h-4 fill-current" />
          </button>
        </div>
      </section>

      {/* Footer giữ nguyên... */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#130823]/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between group cursor-pointer hover:bg-white/5 hover:border-amber-500/40 transition-all shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-amber-400 transition-colors">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">Lịch sử thu nhập</h4>
              <p className="text-[10px] text-slate-500 font-medium italic">Đối soát chi tiết các phiên đã xong</p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
        </div>
        {/* Box thống kê hiệu suất giữ nguyên... */}
        <div className="bg-[#130823]/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between group cursor-pointer hover:bg-white/5 hover:border-amber-500/40 transition-all shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-amber-400 transition-colors">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">Thống kê hiệu suất</h4>
              <p className="text-[10px] text-slate-500 font-medium italic">Báo cáo tỷ lệ hài lòng từ khách</p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
        </div>
      </footer>
    </div>
  );
}