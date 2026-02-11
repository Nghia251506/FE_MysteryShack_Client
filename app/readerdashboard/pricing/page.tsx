"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check, Zap, Crown, Gem, Loader2, ArrowRight,
    ShieldCheck, Rocket, Calendar, RefreshCcw, LayoutGrid
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { toast } from "react-toastify";
import {
    buyVip,
    fetchVipPackages,
    fetchCurrentSubscription // Import cái Thunk mới của ông
} from "@/store/slices/subscriptionSlice";

export default function PricingPage() {
    const dispatch = useAppDispatch();

    // 1. Lấy dữ liệu từ Redux
    const { user } = useAppSelector((state: any) => state.auth);
    const {
        packages,
        currentSub, // Lấy gói hiện tại từ slice
        loading: subLoading
    } = useAppSelector((state: any) => state.subscription);

    console.log(currentSub)

    const [buyingId, setBuyingId] = useState<number | null>(null);
    const [showAllPackages, setShowAllPackages] = useState(false);

    // 2. Logic kiểm tra gói còn hạn hay không
    const hasActiveSub = currentSub &&
        currentSub.status === 'ACTIVE' &&
        new Date(currentSub.endDate) > new Date();

    // 3. useEffect để fetch dữ liệu khi vào trang
    useEffect(() => {
        // Lấy danh sách 3 gói mặc định
        dispatch(fetchVipPackages());

        // Nếu đã đăng nhập thì lấy thông tin gói của riêng Reader này
        if (user) {
            dispatch(fetchCurrentSubscription());
        }
    }, [dispatch, user]);

    const handleSubscribe = async (pkgId: number) => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để tiếp tục!");
            return;
        }
        try {
            setBuyingId(pkgId);
            const resultAction = await dispatch(buyVip(pkgId));
            if (buyVip.fulfilled.match(resultAction)) {
                toast.success("Đang tạo liên kết thanh toán...");
                window.location.href = resultAction.payload;
            } else {
                toast.error(resultAction.payload as string || "Lỗi khởi tạo thanh toán");
            }
        } catch (error: any) {
            toast.error("Đã xảy ra lỗi không xác định");
        } finally {
            setBuyingId(null);
        }
    };

    if (subLoading && packages.length === 0) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0d0415]">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang kiểm tra đặc quyền...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0415] py-20 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-amber-500/10 blur-[120px] rounded-full opacity-30" />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* 1. DASHBOARD GÓI HIỆN TẠI - Thiết kế như một tấm thẻ Membership cao cấp */}
                {hasActiveSub && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 bg-gradient-to-br from-[#1a1025] via-[#25163a] to-[#1a1025] border border-amber-500/40 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                    >
                        {/* Hiệu ứng ánh kim chạy qua thẻ */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />

                        <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Crown className="w-64 h-64 text-amber-500" />
                        </div>

                        <div className="relative z-10 flex flex-col gap-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <div className="flex items-center gap-2 text-amber-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-3">
                                        <div className="w-8 h-[1px] bg-amber-500" />
                                        Thành viên Premium
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic leading-none">
                                        {currentSub.packageName}
                                    </h2>
                                    <p className="mt-2 text-slate-400 font-medium">Xin chào, <span className="text-white">{currentSub.fullName}</span>. Bạn đang tận hưởng mọi đặc quyền cao cấp nhất.</p>
                                </div>

                                <div className="flex flex-col items-end">
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Trạng thái</div>

                                    {currentSub?.status === 'ACTIVE' ? (
                                        /* UI cho trạng thái Đang kích hoạt */
                                        <div className="px-4 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Đang kích hoạt
                                        </div>
                                    ) : (
                                        /* UI cho trạng thái Hết hạn hoặc khác (PENDING, EXPIRED...) */
                                        <div className="px-4 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold flex items-center gap-2">
                                            <div className="w-2 h-2 bg-rose-500 rounded-full" /> Đã hết hạn
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="h-[1px] bg-white/10 w-full" />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                <div className="space-y-1">
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Hạn sử dụng</div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-amber-500" />
                                        <span className="text-xl font-bold text-white">{new Date(currentSub.endDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Lượt tiếp khách/tháng</div>
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-amber-500" />
                                        <span className="text-xl font-bold text-white">{currentSub.remainingJobs} / 20</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-start md:justify-end gap-3">
                                    <button
                                        onClick={() => handleSubscribe(currentSub.packages.id)}
                                        className="h-14 px-8 bg-amber-500 text-black font-black uppercase text-xs rounded-xl hover:bg-amber-400 hover:scale-105 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                                    >
                                        <RefreshCcw className="w-4 h-4" /> Gia hạn gói
                                    </button>
                                    <button
                                        onClick={() => setShowAllPackages(!showAllPackages)}
                                        className={`h-14 w-14 flex items-center justify-center rounded-xl border transition-all ${showAllPackages ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                                    >
                                        <LayoutGrid className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 2. HEADER TIÊU ĐỀ & GRID GÓI - Chỉ hiện rõ khi chưa có gói hoặc khi user muốn Đổi gói */}
                <AnimatePresence>
                    {(!hasActiveSub || showAllPackages) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            // Chú ý: Bỏ overflow-hidden ở đây để badge không bị cắt
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12"
                        >
                            {[...packages].sort((a: any, b: any) => a.price - b.price).map((pkg: any, idx: number) => (
                                <motion.div
                                    key={pkg.id}
                                    // Thêm flex flex-col và h-full để card cao bằng nhau và điều khiển được vị trí nút
                                    className={`relative group rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col h-full ${pkg.id === currentSub?.packages?.id
                                            ? "bg-amber-500/10 border-2 border-amber-500 z-10"
                                            : "bg-[#130823]/60 border border-white/5 hover:border-amber-500/30 z-0"
                                        }`}
                                >
                                    {/* Badge trạng thái - Dùng z-50 và đẩy lên -top-4 để nổi hẳn lên trên */}
                                    {pkg.id === currentSub?.packages?.id && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-[0_0_15px_rgba(245,158,11,0.5)] whitespace-nowrap">
                                            Gói hiện tại
                                        </div>
                                    )}

                                    {/* Phần nội dung bọc trong flex-grow để đẩy nút xuống dưới */}
                                    <div className="flex-grow">
                                        <div className="mb-6">
                                            <h4 className="text-xl font-black text-white uppercase italic mb-1">{pkg.name}</h4>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-white">{pkg.price?.toLocaleString()}đ</span>
                                                <span className="text-slate-500 text-[10px] font-bold uppercase">/{pkg.durationDays} ngày</span>
                                            </div>
                                        </div>

                                        {/* HIỂN THỊ DỮ LIỆU ĐỘNG */}
                                        <div className="space-y-3 mb-8">
                                            <FeatureItem text={`${pkg.maxJobsPerDay} lượt tiếp khách / tháng`} />

                                            {pkg.benefits && typeof pkg.benefits === 'string' ? (
                                                pkg.benefits
                                                    .split(';')
                                                    .map((item: string) => item.trim())
                                                    .filter((item: string) => item.length > 0)
                                                    .map((benefitText: string, i: number) => (
                                                        <FeatureItem key={i} text={benefitText} />
                                                    ))
                                            ) : (
                                                <>
                                                    <FeatureItem text="Hỗ trợ ưu tiên 24/7" />
                                                    <FeatureItem text="Ưu tiên hiển thị Profile" />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Nút bấm với mt-auto để luôn nằm dưới cùng */}
                                    <button
                                        onClick={() => handleSubscribe(pkg.id)}
                                        disabled={buyingId !== null}
                                        className={`mt-auto w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-3 ${pkg.id === currentSub?.packages?.id
                                                ? "bg-transparent text-amber-500 border border-amber-500/50 hover:bg-amber-500 hover:text-black"
                                                : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                                            }`}
                                    >
                                        {buyingId === pkg.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            pkg.id === currentSub?.packages?.id ? "Gia hạn gói" : "Chọn gói này"
                                        )}
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function FeatureItem({ text, color = "text-emerald-500" }: { text: string; color?: string }) {
    return (
        <div className="flex items-center gap-3">
            <Check className={`w-4 h-4 ${color}`} />
            <span className="text-slate-300 text-sm font-medium">{text}</span>
        </div>
    );
}