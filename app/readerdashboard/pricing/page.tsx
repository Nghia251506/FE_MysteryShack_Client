"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
    Check, 
    Zap, 
    Crown, 
    Gem, 
    Loader2, 
    ArrowRight,
    ShieldCheck,
    Rocket
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { toast } from "react-toastify";
import { buyVip, fetchVipPackages } from "@/store/slices/subscriptionSlice";

export default function PricingPage() {
    const dispatch = useAppDispatch();
    
    // 1. Lấy dữ liệu từ Redux
    const { user } = useAppSelector((state: any) => state.auth);
    const { packages, loading: subLoading } = useAppSelector((state: any) => state.subscription);
    
    // Quản lý trạng thái loading riêng cho từng nút bấm
    const [buyingId, setBuyingId] = useState<number | null>(null);

    useEffect(() => {
        if (packages.length === 0) {
            dispatch(fetchVipPackages());
        }
    }, [dispatch, packages.length]);

    // 2. Hàm xử lý Click "Kích hoạt"
    const handleSubscribe = async (pkgId: number) => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để tiếp tục!");
            return;
        }

        try {
            setBuyingId(pkgId);
            
            // QUAN TRỌNG: dispatch Thunk. 
            // Hãy đảm bảo trong PaymentService, ông dùng params cho packageId
            const resultAction = await dispatch(buyVip(pkgId));
            
            // unwrapping để bắt lỗi hoặc lấy URL trực tiếp
            const paymentUrl = await (resultAction as any).payload;

            if (buyVip.fulfilled.match(resultAction)) {
                toast.success("Đang tạo liên kết thanh toán...");
                // Chuyển hướng trình duyệt sang VNPay
                window.location.href = resultAction.payload;
            } else {
                const errorMsg = resultAction.payload as string;
                toast.error(errorMsg || "Lỗi khởi tạo thanh toán");
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
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang tải các đặc quyền...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0415] py-20 px-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-amber-500/10 blur-[120px] rounded-full opacity-30" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <Crown className="w-3 h-3" /> Đặc quyền Reader chuyên nghiệp
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-6">
                        Nâng cấp <span className="text-amber-500">năng lực</span>
                    </h1>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {packages.map((pkg: any, idx: number) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative group rounded-[3rem] p-8 transition-all duration-500 ${
                                idx === 1 
                                ? "bg-gradient-to-b from-[#2a1b3d] to-[#130823] border-2 border-amber-500/50 scale-105 shadow-[0_0_50px_rgba(245,158,11,0.15)]" 
                                : "bg-[#130823]/60 border border-white/5 hover:border-amber-500/30"
                            }`}
                        >
                            <div className="mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                                    idx === 0 ? "bg-blue-500/10 text-blue-400" :
                                    idx === 1 ? "bg-amber-500/10 text-amber-500" :
                                    "bg-purple-500/10 text-purple-400"
                                }`}>
                                    {idx === 0 ? <Rocket className="w-7 h-7" /> : idx === 1 ? <Zap className="w-7 h-7" /> : <Gem className="w-7 h-7" />}
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">{pkg.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-white">{pkg.price?.toLocaleString()}đ</span>
                                    <span className="text-slate-500 text-sm font-bold">/{pkg.durationDays} ngày</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <FeatureItem text={`Tối đa ${pkg.maxJobsPerDay} khách/ngày`} />
                                <FeatureItem text="Ưu tiên hiển thị" />
                                <FeatureItem text={`Thời hạn: ${pkg.durationDays} ngày`} />
                                {idx > 0 && <FeatureItem text="Huy hiệu Reader Gold" color="text-amber-500" />}
                            </div>

                            <button
                                onClick={() => handleSubscribe(pkg.id)}
                                disabled={buyingId !== null}
                                className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 ${
                                    idx === 1 
                                    ? "bg-amber-500 text-black hover:bg-amber-400" 
                                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                                }`}
                            >
                                {buyingId === pkg.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>Kích hoạt ngay <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>
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