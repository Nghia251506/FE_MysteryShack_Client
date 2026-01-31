"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Wallet, Star, 
  Zap, BarChart3, History, 
  Gem, ShieldCheck, Trophy, 
  ArrowUpRight, PieChart
} from "lucide-react";
import { ReadingSessionService } from "@/services/readingSessionService";

export default function ReaderDashboardPage() {
  const [stats, setStats] = useState({
    todayIncome: 250000,
    weekIncome: 1750000,
    monthIncome: 5400000,
    totalSessions: 124,
    rating: 4.9
  });

  const quota = {
    remaining: 15,
    total: 50,
    package: "Gói Kim Cương",
    expiry: "30/02/2026"
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 pb-32">
      
      {/* --- HEADER: CHÀO READER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Bảng điều khiển <span className="text-amber-500">Thu nhập</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Chào mừng trở lại! Hôm nay bạn đang làm rất tốt.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-white font-bold text-sm">{stats.rating}</span>
           </div>
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">Top 5% Reader</span>
           </div>
        </div>
      </header>

      {/* --- PHẦN 1: STATS BAR - THU NHẬP RÒNG --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thu nhập ngày */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-amber-500/20 relative overflow-hidden group"
        >
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/10 rotate-12" />
          <p className="text-xs font-black uppercase tracking-widest opacity-80">Hôm nay</p>
          <h2 className="text-4xl font-black mt-2 italic">+{stats.todayIncome.toLocaleString()}đ</h2>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold bg-black/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
            <ArrowUpRight className="w-3 h-3" /> Tăng 12% so với hôm qua
          </div>
        </motion.div>

        {/* Thu nhập tuần */}
        <div className="bg-[#130823]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-amber-500/30 transition-all">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full uppercase">Tuần này</span>
          </div>
          <div className="mt-8">
            <p className="text-3xl font-black text-white italic">{stats.weekIncome.toLocaleString()}đ</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Đã giải mã: 24 phiên</p>
          </div>
        </div>

        {/* Thu nhập tháng */}
        <div className="bg-[#130823]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-amber-500/30 transition-all">
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
              <PieChart className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full uppercase">Tháng 01</span>
          </div>
          <div className="mt-8">
            <p className="text-3xl font-black text-white italic">{stats.monthIncome.toLocaleString()}đ</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Tổng phiên: {stats.totalSessions}</p>
          </div>
        </div>
      </section>

      {/* --- PHẦN 2: SUBSCRIPTION CARD - QUẢN LÝ GÓI --- */}
      <section className="bg-gradient-to-r from-[#1c142e] to-[#0d1117] border border-amber-500/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
          <Gem className="w-64 h-64" />
        </div>

        <div className="flex items-center gap-8 z-10">
          <div className="w-24 h-24 rounded-[2rem] bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
            <Gem className="w-12 h-12 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              {quota.package}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <p className="text-sm text-slate-400 font-medium">Trạng thái: Đang hoạt động • Hạn: {quota.expiry}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4 z-10 w-full md:w-80">
          <div className="w-full">
            <div className="flex justify-between text-[10px] font-black uppercase mb-3">
              <span className="text-amber-500 tracking-widest">Lượt nhận khách còn lại</span>
              <span className="text-white text-sm">{quota.remaining} / {quota.total}</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(quota.remaining / quota.total) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              />
            </div>
          </div>
          <button className="w-full md:w-auto mt-2 px-8 py-3 bg-white text-black text-xs font-black uppercase rounded-2xl hover:bg-amber-500 hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-3">
            Gia hạn gói hội viên <Zap className="w-4 h-4 fill-current" />
          </button>
        </div>
      </section>

      {/* --- PHẦN 3: LỊCH SỬ GẦN ĐÂY (NHỎ GỌN) --- */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-[#130823]/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between group cursor-pointer hover:bg-[#130823]/60 transition-all">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
                  <History className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-white">Lịch sử thu nhập</h4>
                  <p className="text-[10px] text-slate-500">Xem chi tiết các phiên đã giải mã</p>
               </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
         </div>

         <div className="bg-[#130823]/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between group cursor-pointer hover:bg-[#130823]/60 transition-all">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
                  <BarChart3 className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-white">Thống kê hiệu suất</h4>
                  <p className="text-[10px] text-slate-500">Xem tỷ lệ hài lòng của khách hàng</p>
               </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
         </div>
      </footer>

      {/* --- TRẠNG THÁI CHỜ (RELAX) --- */}
      <div className="flex flex-col items-center justify-center py-10 opacity-30">
          <div className="w-1 h-1 bg-amber-500 rounded-full animate-ping" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-4">Hệ thống đang trực tuyến</p>
      </div>

    </div>
  );
}