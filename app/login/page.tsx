"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  User,
  Lock,
  AlertCircle,
  X,
  Moon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { loginUser, clearError } from "@/store/features/authSlice";
import { UserService } from "@/services/userService";
import { useAppDispatch } from "@/hooks/useAppRedux";
import { motion, AnimatePresence } from "framer-motion";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialFloating from "@/components/SocialFloating";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (message: string, type: "error" | "success") => {
    if (type === "error") toast.error(message);
    else toast.success(message);
  };

  // --- HELPER LOGIC: GỘP DATA GUEST ---
  const mergeGuestSession = useCallback(() => {
    const guestDataRaw = sessionStorage.getItem("guestTarotSession");
    if (guestDataRaw) {
      try {
        const guestData = JSON.parse(guestDataRaw);
        const userDataRaw = sessionStorage.getItem("tarot_draw_state_persist");
        const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

        const mergedData = {
          ...userData,
          ...guestData,
          updatedAt: Date.now(),
          isMigrated: true
        };

        sessionStorage.setItem("tarot_draw_state_persist", JSON.stringify(mergedData));
        sessionStorage.removeItem("guestTarotSession");
        console.log("Đã gộp dữ liệu rút bài từ khách vào tài khoản chính.");
        return true;
      } catch (e) {
        console.error("Lỗi gộp session:", e);
      }
    }
    return false;
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "READER" || user.role === "ADMIN") {
        router.push("/readerdashboard");
      } else {
        // Sau khi đăng nhập thành công, check xem có cần về lại trang rút bài không
        const hasMerged = mergeGuestSession();
        if (hasMerged) {
          router.push("/tarot-draw");
        } else if (callbackUrl && callbackUrl !== "/" && !callbackUrl.includes("login")) {
          router.push(callbackUrl);
        } else {
          router.push("/profile");
        }
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, router, callbackUrl, dispatch, mergeGuestSession]);

  const handleGoogleLogin = () => {
    window.location.href = "https://api.mystictarots.xyz/oauth2/authorization/google";
  };

  const handleComingSoon = (method: string) => {
    setMethodName(method);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrors({
        username: !formData.username ? "Vui lòng nhập tên đăng nhập" : "",
        password: !formData.password ? "Vui lòng nhập mật khẩu" : "",
      });
      return;
    }

    const resultAction = await dispatch(
      loginUser({
        username: formData.username,
        passwordHash: formData.password,
      }),
    );

    if (loginUser.fulfilled.match(resultAction)) {
      const loggedInUser = resultAction.payload.user;
      const role = loggedInUser?.role || "CUSTOMER";

      if (role === "READER") {
        try {
          await UserService.toggleStatus();
        } catch (error) {
          console.error("Lỗi tự động bật trạng thái:", error);
        }
      }
      
      // Logic chuyển hướng đã được xử lý trong useEffect phía trên khi isAuthenticated thay đổi
    }
    else if (loginUser.rejected.match(resultAction)) {
      const serverError = resultAction.payload as any;
      if (serverError?.message === "Bad credentials") {
        setErrors({
          username: "Tên đăng nhập hoặc mật khẩu không chính xác",
          password: " ",
        });
        showToast("Đăng nhập thất bại, kiểm tra lại thông tin!", "error");
      } else {
        const msg = typeof serverError === "string" ? serverError : "Đã có lỗi xảy ra";
        showToast(msg, "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex flex-col relative overflow-x-hidden font-sans">
      <Header />
      {/* ... (Giữ nguyên phần Modal & UI bên dưới của ông) ... */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 p-10 rounded-[3rem] text-center"
            >
              <h3 className="text-2xl font-black text-white mb-4 uppercase">Cánh Cổng Đang Đóng</h3>
              <p className="text-slate-400 italic mb-8">Phương thức {methodName} đang được thiết lập...</p>
              <button onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-white text-black font-black rounded-2xl">Đã hiểu ý trời</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex items-center justify-center p-4 relative z-10 py-20">
        <div className="relative w-full max-w-md group">
          <Card className="relative w-full bg-[#0f0a19]/90 border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-3 text-center pb-6 pt-8">
              <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent flex items-center justify-center border border-amber-500/20 mb-1">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-white tracking-tight">Chào Mừng</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-xs uppercase font-semibold ml-1">Tên đăng nhập</Label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="h-11 bg-slate-950/50 border-white/10 text-slate-100"
                    required
                  />
                  {errors.username && <p className="text-red-500 text-[10px]">{errors.username}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-xs uppercase font-semibold ml-1">Mật khẩu</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-11 bg-slate-950/50 border-white/10 text-slate-100"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-amber-600 to-orange-600">
                  {loading ? "Đang kết nối..." : "Đăng Nhập"}
                </Button>
              </form>

              <div className="relative my-6 text-center">
                <span className="bg-[#0f0a19] px-2 text-slate-500 text-xs uppercase">Hoặc</span>
              </div>

              <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-11 border-white/10 bg-white/5 text-slate-300">
                <FaGoogle className="mr-2" /> GOOGLE
              </Button>

              <div className="mt-6 text-center">
                <p className="text-slate-500 text-sm">
                  Chưa có tài khoản? <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-amber-500 font-bold">Đăng ký ngay</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}