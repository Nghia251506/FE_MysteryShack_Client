"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  ArrowRight, 
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { resendVerification, clearError } from "@/store/features/authSlice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function VerifyResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const status = searchParams.get("status"); // success, expired, invalid
  const email = searchParams.get("email"); // Lấy email từ URL nếu bị expired

  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [resent, setResent] = useState(false);

  // Xử lý gửi lại email
  const handleResend = async () => {
    if (email) {
      const result = await dispatch(resendVerification(email));
      if (resendVerification.fulfilled.match(result)) {
        setResent(true);
      }
    }
  };

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Xác Thực Thành Công!</h1>
              <p className="text-slate-400">Vận mệnh đã sẵn sàng. Tài khoản của bạn đã được kích hoạt.</p>
            </div>
            <Button 
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold h-12"
            >
              Đăng Nhập Ngay <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case "expired":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-12 h-12 text-amber-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Liên Kết Hết Hạn</h1>
              <p className="text-slate-400">Tiếc quá, mã xác thực này đã không còn hiệu lực do quá thời gian.</p>
            </div>
            
            {resent ? (
              <div className="p-4 rounded-xl bg-green-900/20 border border-green-500/30 text-green-400 text-sm">
                Mã xác thực mới đã được gửi đến <span className="font-bold">{email}</span>. Hãy kiểm tra lại hòm thư nhé!
              </div>
            ) : (
              <Button 
                onClick={handleResend}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-12"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Mail className="mr-2 w-4 h-4" />}
                Gửi Lại Mã Xác Thực
              </Button>
            )}
            <p className="text-xs text-slate-500">Trở về <Link href="/login" className="text-amber-500 hover:underline">Trang đăng nhập</Link></p>
          </div>
        );

      case "invalid":
      default:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Lỗi Xác Thực</h1>
              <p className="text-slate-400">Liên kết không hợp lệ hoặc đã được sử dụng trước đó.</p>
            </div>
            <Button 
              onClick={() => router.push("/support")}
              variant="outline"
              className="w-full border-white/10 text-slate-300 hover:bg-white/5 h-12"
            >
              Liên Hệ Hỗ Trợ
            </Button>
            <Button 
              onClick={() => router.push("/")}
              variant="link"
              className="text-amber-500"
            >
              Quay về Trang Chủ
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex flex-col relative overflow-hidden">
      <Header />
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0510] to-[#0a0510] pointer-events-none"></div>
      
      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-amber-500 rounded-2xl opacity-20 blur group-hover:opacity-30 transition"></div>
            <div className="relative bg-[#0f0a19]/90 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
              {renderContent()}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

// Helper link component
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <a href={href} className={className}>{children}</a>;
}