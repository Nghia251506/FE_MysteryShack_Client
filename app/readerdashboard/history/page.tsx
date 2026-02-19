"use client";

import React, { useState, useEffect, useMemo } from "react";
import { InterpretationService } from "@/services/interpretationService";
import {
  Search,
  User,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  Filter,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { fetchAllMyHistories } from "@/store/slices/historySlice";

const STATUS_FILTERS = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ thanh toán", value: "WAITING_PAYMENT" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã từ chối", value: "CANCELED" },
  { label: "Đang xử lý", value: "PROCESSING" },
];

export default function HistoryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Lấy dữ liệu từ Redux
  const {
    allHistories,
    loading,
    totalPages: reduxTotalPages, // Lấy biến đã lưu trong Slice
    totalElements: reduxTotalElements,
  } = useAppSelector((state: any) => state.history);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [processingId, setProcessingId] = useState<string | number | null>(
    null,
  );
  const itemsPerPage = 5;

  // --- FIX 1: Truy xuất mảng dữ liệu thực từ cấu trúc lồng nhau ---
  const rawItems = useMemo(() => {
    if (Array.isArray(allHistories)) return allHistories;
    if (allHistories?.content) return allHistories.content; // Dự phòng nếu chưa bóc tách lớp 2
    return [];
  }, [allHistories]);

  // --- FIX 2: Lấy thông tin phân trang chuẩn từ API ---
  const totalPages = reduxTotalPages || 0;
  const totalElements = reduxTotalElements || 0;

  const transformItem = (item: any) => {
    let querentName =
      item.customer?.fullName || item.fullName || "Khách ẩn danh";
    if (item.note?.includes("KH:")) {
      const parts = item.note.split("KH:")[1];
      if (parts) querentName = parts.split("-")[0].trim();
    }

    let birthDateDisplay = "N/A";
    const rawDob = item.customer?.birthDate || item.birthDate;
    if (rawDob) {
      if (Array.isArray(rawDob)) {
        birthDateDisplay = `${rawDob[2]}/${rawDob[1]}/${rawDob[0]}`;
      } else {
        birthDateDisplay = new Date(rawDob).toLocaleDateString("vi-VN");
      }
    }

    return {
      ...item,
      querentName,
      birthDate: birthDateDisplay,
      dateFormatted: new Date(item.createdAt || item.timestamp).toLocaleString(
        "vi-VN",
      ),
    };
  };

  useEffect(() => {
    dispatch(
      fetchAllMyHistories({
        page: currentPage,
        size: itemsPerPage,
      }),
    );
  }, [dispatch, currentPage]);

  // --- FIX 3: Filter dựa trên mảng đã trích xuất ---
  const displayData = useMemo(() => {
    return rawItems
      .filter((item: any) => {
        const name = (item.customer?.fullName || "").toLowerCase();
        const id = (item.id || "").toString();
        const matchesSearch =
          name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm);
        const matchesStatus =
          statusFilter === "ALL" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .map(transformItem);
  }, [rawItems, searchTerm, statusFilter]);

  const handleConfirmPayment = async (sessionId: string | number) => {
    setProcessingId(sessionId);
    try {
      await InterpretationService.confirmPayment(sessionId);
      toast.success("Đã xác nhận thanh toán!");
      dispatch(fetchAllMyHistories({ page: currentPage, size: itemsPerPage }));
    } catch (error: any) {
      toast.error("Xác nhận thất bại.");
    } finally {
      setProcessingId(null);
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-400/20">
            <CheckCircle2 className="w-3 h-3" /> HOÀN THÀNH
          </span>
        );
      case "WAITING_PAYMENT":
        return (
          <span className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-400/20 animate-pulse">
            <Clock className="w-3 h-3" /> CHỜ THANH TOÁN
          </span>
        );
      default:
        return (
          <span className="text-slate-400 bg-white/5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/10 uppercase font-mono">
            {status}
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 py-8 relative z-10"
    >
      <header className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Lịch sử{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-black">
                PHIÊN TRẢI
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 font-medium italic opacity-80">
              Tổng số: {totalElements} phiên
            </p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              placeholder="Tìm tên hoặc ID..."
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 w-full text-sm text-white outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#1a1025]/60 border border-white/5 rounded-[1.25rem] w-fit backdrop-blur-md">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value);
                setCurrentPage(0);
              }}
              className={`px-5 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all ${
                statusFilter === f.value
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-[#130823]/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03] text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-white/5">
              <tr>
                <th className="px-8 py-6">Phiên</th>
                <th className="px-8 py-6">Khách hàng</th>
                <th className="px-8 py-6 text-center">Trạng thái</th>
                <th className="px-8 py-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-24 text-center text-slate-500 animate-pulse italic font-mono"
                    >
                      Đang truy xuất dữ liệu...
                    </td>
                  </tr>
                ) : displayData.length > 0 ? (
                  displayData.map((item: any) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={item.id}
                      className="group hover:bg-white/[0.03] transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="font-mono text-sm text-amber-500 font-black">
                          #{item.id}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.dateFormatted}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-100 font-bold">
                              {item.querentName}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              NS: {item.birthDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {renderStatus(item.status)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 items-center">
                          {item.status === "WAITING_PAYMENT" && (
                            <button
                              onClick={() => handleConfirmPayment(item.id)}
                              disabled={processingId === item.id}
                              className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black rounded-lg transition-all"
                            >
                              {processingId === item.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "XÁC NHẬN"
                              )}
                            </button>
                          )}
                          <button
                            onClick={() =>
                              router.push(
                                `/readerdashboard/workspace/${item.id}`,
                              )
                            }
                            className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-24 text-center text-slate-500 opacity-50 font-medium tracking-widest uppercase text-xs"
                    >
                      <Filter className="w-8 h-8 mx-auto mb-3 opacity-20" />{" "}
                      Không có dữ liệu phù hợp
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PHÂN TRANG CHUẨN */}
        {!loading && totalPages > 1 && (
          <div className="px-8 py-6 bg-black/20 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-10 hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 disabled:opacity-10 hover:bg-white/10 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
