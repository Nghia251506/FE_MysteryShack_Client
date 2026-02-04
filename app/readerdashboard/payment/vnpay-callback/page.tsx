"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import axios from "@/lib/axios";
import { useAppDispatch } from "@/hooks/useAppRedux";
import { fetchCurrentSubscription } from "@/store/slices/subscriptionSlice";
import { toast } from "react-toastify";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xác thực giao dịch...");
  
  // Dùng useRef để tránh việc useEffect chạy 2 lần trong StrictMode (gây lỗi verify 2 lần)
  const hasCalled = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;

      try {
        // 1. Kiểm tra Response Code từ VNPay trước (00 là thành công)
        const responseCode = searchParams.get("vnp_ResponseCode");
        
        if (responseCode !== "00") {
          setStatus("error");
          setMessage("Giao dịch bị hủy hoặc không thành công.");
          return;
        }

        // 2. Gom tất cả query params để gửi xuống BE verify chữ ký
        const params = Object.fromEntries(searchParams.entries());
        
        // Gọi đến API Callback ở BE (Hàm activateSubscriptionByReaderId của ông)
        // Lưu ý: Endpoint này phải khớp với Controller ở BE nhé
        await axios.get("/payment/vnpay-callback", { params });

        // 3. Nếu BE trả về 200 OK -> Xác thực thành công
        setStatus("success");
        setMessage("Chúc mừng! Gói VIP của bạn đã được kích hoạt thành công.");
        toast.success("Nâng cấp gói VIP thành công!");

        // 4. Update lại thông tin subscription trong Redux để Dashboard nhảy số ngay
        dispatch(fetchCurrentSubscription());

      } catch (error: any) {
        console.error("Verify Error:", error);
        setStatus("error");
        setMessage(error.response?.data?.message || "Có lỗi xảy ra khi xác thực giao dịch.");
        toast.error("Xác thực giao dịch thất bại!");
      }
    };

    verifyPayment();
  }, [searchParams, dispatch]);

  return (
    <div className="min-h-screen bg-[#0d0415] flex items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full" />

      <div className="max-w-md w-full bg-[#130823]/60 border border-white/5 p-10 rounded-[3rem] relative z-10 text-center shadow-2xl backdrop-blur-md">
        
        {status === "loading" && (
          <div className="py-10">
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold uppercase tracking-widest italic mb-2">Đang kiểm tra</h2>
            <p className="text-slate-400 text-sm italic">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="animate-in fade-in zoom-in duration-700">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black italic uppercase text-white mb-4">Thành Công!</h2>
            <p className="text-slate-300 text-sm font-medium mb-8 leading-relaxed">
              {message}
            </p>
            <button
              onClick={() => router.push("/readerdashboard")}
              className="w-full py-4 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
            >
              Truy cập Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="animate-in fade-in zoom-in duration-700">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-black italic uppercase text-white mb-4">Thất Bại</h2>
            <p className="text-slate-300 text-sm font-medium mb-8 leading-relaxed">
              {message}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/pricing")}
                className="w-full py-4 bg-white/5 text-white border border-white/10 font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all"
              >
                Thử thanh toán lại
              </button>
              <button
                onClick={() => router.push("/readerdashboard")}
                className="w-full py-2 text-slate-500 font-bold text-[10px] uppercase hover:text-white transition-all"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" /> Bảo mật bởi VNPay & MysticTarots
        </div>
      </div>
    </div>
  );
}