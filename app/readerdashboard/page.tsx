"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Wallet,
  Zap,
  BarChart3,
  History,
  Gem,
  ShieldCheck,
  ArrowUpRight,
  PieChart,
  Loader2,
  Clock,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

import { ReadingSessionService } from "@/services/readingSessionService";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { fetchReaderRatings } from "@/store/slices/ratingSlice";
import { fetchCurrentSubscription } from "@/store/slices/subscriptionSlice";
import { fetchDashboardAnalytics } from "@/store/slices/readerStatsSlice"; // Import Thunk mới
import { BsFillBookmarkStarFill } from "react-icons/bs";

export default function ReaderDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // 1. Kết nối với Redux Store
  const { user } = useAppSelector((state: any) => state.auth);
  const { currentSub } = useAppSelector((state: any) => state.subscription);
  const { analytics, isLoading: statsLoading } = useAppSelector((state: any) => state.readerStats);

  const readerName = user?.fullName || user?.username || "Người đọc ẩn danh";
  const readerId = user?.id;

  const [loading, setLoading] = useState(true);
  const [processingSession, setProcessingSession] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // 2. Hàm fetch dữ liệu tổng hợp
  const fetchDashboardData = useCallback(async () => {
    if (!readerId) return;

    try {
      setLoading(true);

      // Gọi song song các API: Analytics (Redux), Session đang xử lý, Rating và Subscription
      await Promise.all([
        dispatch(fetchDashboardAnalytics()).unwrap(), // Lấy data DTO mới cho biểu đồ và 4 số chính
        ReadingSessionService.getProcessingSession(Number(readerId)),
        dispatch(fetchReaderRatings(Number(readerId))).unwrap(),
        dispatch(fetchCurrentSubscription()).unwrap(),
      ]).then(([_, activeSession]) => {
        setProcessingSession(activeSession);
      });

    } catch (error) {
      console.error("Lỗi Dashboard API:", error);
    } finally {
      setLoading(false);
    }
  }, [readerId, dispatch]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Logic Countdown cho phiên đang chạy
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

  const totalLimit = currentSub?.packages?.maxJobsPerDay || 1;
  const remaining = currentSub?.remainingJobs ?? 0;
  const progressPercent = (remaining / totalLimit) * 100;

  // Loading State
  if (loading || statsLoading || !readerId) {
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
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-2">
        <div className="flex-1">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Tổng quan <span className="text-amber-500">Hệ thống</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">
            Báo cáo hiệu suất Reader: <span className="text-slate-300 font-bold">#{readerName}</span>
          </p>
        </div>

        {/* Status Widget */}
        <AnimatePresence mode="wait">
          {processingSession ? (
            <motion.div
              key="processing"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onClick={() => router.push(`/workspace/${processingSession.id}`)}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-amber-600/20 rounded-[2rem] blur-md opacity-75"></div>
              <div className="relative bg-[#1a0b2e]/90 border border-red-500/20 backdrop-blur-2xl p-3 px-6 rounded-[2rem] flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${timeLeft < 600 ? "bg-red-600 animate-pulse" : "bg-amber-500"}`}>
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col min-w-[160px]">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">Phiên đang chạy</span>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-mono font-black">
                    <span className={timeLeft < 600 ? "text-red-500" : "text-amber-400"}>{formatTime(timeLeft)}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-red-500" />
              </div>
            </motion.div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 px-6 rounded-[2rem] flex items-center gap-3">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sẵn sàng nhận khách</span>
            </div>
          )}
        </AnimatePresence>
      </header>

      {/* 3 SECTION CHỈ SỐ LẤY TỪ REDUX ANALYTICS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-black bg-black/20 px-3 py-1 rounded-full uppercase">Hôm nay</span>
          </div>
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/10 rotate-12" />
          <div className="mt-8 relative z-10">
            <h2 className="text-4xl font-black italic">
              +{(analytics?.todayIncome || 0).toLocaleString()}đ
            </h2>
            <p className="text-[10px] font-bold uppercase opacity-80 mt-1">Thu nhập ròng trong ngày</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-[#130823]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-xl shadow-black/50">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full uppercase">Tháng này</span>
          </div>
          <div className="mt-8">
            <p className="text-3xl font-black text-white italic">
              {(analytics?.monthIncome || 0).toLocaleString()}đ
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Doanh thu tích lũy tháng</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-[#130823]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-xl shadow-black/50">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
              <PieChart className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full uppercase">Hiệu suất</span>
          </div>
          <div className="mt-8">
            <p className="text-3xl font-black text-white italic">
              {analytics?.totalSessions || 0} Phiên
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Tổng phiên đã hoàn thành</p>
          </div>
        </motion.div>
      </section>

      {/* Quản lý gói cước */}
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
              {currentSub?.packageName || "Gói Cơ Bản"}
            </h3>
            <p className="text-sm text-slate-400 font-medium tracking-tight">
              Trạng thái: <span className={currentSub?.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}>
                {currentSub?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Hết hạn'}
              </span>
              {currentSub?.endDate && ` • Hạn: ${new Date(currentSub.endDate).toLocaleDateString('vi-VN')}`}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-4 z-10 w-full md:w-80">
          <div className="w-full">
            <div className="flex justify-between text-[10px] font-black uppercase mb-3 text-white tracking-widest">
              <span className="text-amber-500">Lượt nhận khách còn lại</span>
              <span>{remaining} / {totalLimit}</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={`h-full ${progressPercent <= 20 ? 'bg-red-500' : 'bg-amber-500'}`}
              />
            </div>
          </div>
          <button onClick={() => router.push('/readerdashboard/pricing')} className="w-full md:w-auto mt-2 px-8 py-3 bg-white text-black text-xs font-black uppercase rounded-2xl hover:bg-amber-500 hover:text-white transition-all">
            Gia hạn ngay <Zap className="w-4 h-4 inline-block ml-2 fill-current" />
          </button>
        </div>
      </section>

      {/* BIỂU ĐỒ THU NHẬP VÀ HIỆU SUẤT (Sử dụng dữ liệu từ Analytics Redux) */}
      <footer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Biểu đồ thu nhập tuần */}
        <div className="bg-[#130823]/80 border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-black text-white uppercase italic">Biến động thu nhập</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase">7 ngày gần nhất</p>
            </div>
            <History className="w-5 h-5 text-amber-500" />
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.incomeChart || []}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 10}} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a0b2e', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value.toLocaleString()}đ`, "Thu nhập"]}
                />
                <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Biểu đồ năng suất phiên */}
        <div className="bg-[#130823]/80 border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-black text-white uppercase italic">Phân bổ trạng thái</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Tỷ lệ phiên theo trạng thái</p>
            </div>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.performanceChart || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 10}} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1a0b2e', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {(analytics?.performanceChart || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </footer>
    </div>
  );
}