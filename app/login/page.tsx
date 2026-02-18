'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, Sparkles, User, Lock, AlertCircle, X, Moon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { loginUser, clearError } from '@/store/features/authSlice';
import { UserService } from '@/services/userService';
import { useAppDispatch } from '@/hooks/useAppRedux';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORT HEADER & FOOTER ---
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialFloating from '@/components/SocialFloating';
import { toast } from "react-toastify"

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Trạng thái cho hiệu ứng Coming Soon (Giữ cho Facebook)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [methodName, setMethodName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

// Hàm hiển thị thông báo nhanh (Nếu ông chưa có thư viện Toast)
const showToast = (message: string, type: 'error' | 'success') => {
  // Tạm thời dùng alert nếu chưa có component Toast, hoặc gọi hàm toast của ông
  if (type === 'error') {
    toast.error(message);
  } else {
    toast.success(message);
  }
};

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'READER' || user.role === 'ADMIN') {
        router.push('/readerdashboard');
      } else {
        if (callbackUrl && callbackUrl !== '/' && !callbackUrl.includes('login')) {
          router.push(callbackUrl);
        } else {
          router.push('/profile');
        }
      }
    }
    return () => { dispatch(clearError()); };
  }, [isAuthenticated, user, router, callbackUrl, dispatch]);

  // --- LOGIC LOGIN GOOGLE ---
  const handleGoogleLogin = () => {
    // Bay thẳng sang Backend để Google xử lý
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

    const resultAction = await dispatch(loginUser({
      username: formData.username,
      passwordHash: formData.password,
    }));

    // --- THÀNH CÔNG ---
    if (loginUser.fulfilled.match(resultAction)) {
      const loggedInUser = resultAction.payload.user;
      const role = loggedInUser?.role || "CUSTOMER";

      if (role === "READER") {
        try {
          await UserService.toggleStatus();
          console.log("Reader is now Online");
        } catch (error) {
          console.error("Lỗi tự động bật trạng thái:", error);
        }
      }

      if (role === "READER" || role === "ADMIN") {
        router.push("/readerdashboard");
      } else {
        if (callbackUrl && callbackUrl !== '/' && !callbackUrl.includes('login')) {
          router.push(callbackUrl);
        } else {
          router.push("/profile");
        }
      }
    }
    // --- THẤT BẠI (THÊM ĐOẠN NÀY VÀO ĐÂY) ---
    else if (loginUser.rejected.match(resultAction)) {
      const serverError = resultAction.payload as any;

      // Nếu BE trả về đúng cái chuỗi "Bad credentials"
      if (serverError?.message === "Bad credentials") {
        setErrors({
          username: "Tên đăng nhập hoặc mật khẩu không chính xác",
          password: " ", // Để trống hoặc dấu cách để ô password cũng hiện viền đỏ (nếu có logic border)
        });
        showToast("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập!", "error");
      } else {
        // Các lỗi khác (ví dụ: Account locked, server down...)
        const msg = typeof serverError === 'string' ? serverError : "Đã có lỗi xảy ra";
        showToast(msg, "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex flex-col relative overflow-x-hidden font-sans">

      <Header />

      {/* --- MODAL COMING SOON CHO FACEBOOK --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 p-10 rounded-[3rem] shadow-[0_0_100px_-20px_rgba(245,158,11,0.2)] text-center"
            >
              <div className="relative mb-6 flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-amber-500/30 rounded-full scale-125"
                />
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                  <Moon className="w-8 h-8 text-amber-500 animate-pulse" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-white mb-4 uppercase">Cánh Cổng Đang Đóng</h3>
              <p className="text-slate-400 italic mb-8">
                "Kết nối qua <span className="text-amber-400 font-bold">{methodName}</span> đang được các pháp sư thiết lập cổ trận. Hãy sử dụng phương thức truyền thống để đăng nhập vào cõi Mystic."
              </p>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-amber-500 hover:text-white transition-all uppercase text-sm tracking-widest"
              >
                Đã hiểu ý trời
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0510] to-[#0a0510] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <main className="flex-grow flex items-center justify-center p-4 relative z-10 py-20">
        <div className="relative w-full max-w-md group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>

          <Card className="relative w-full bg-[#0f0a19]/90 border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-3 text-center pb-6 pt-8">
              <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent flex items-center justify-center border border-amber-500/20 mb-1">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-white tracking-tight">Chào Mừng</CardTitle>
              <CardDescription className="text-slate-400 text-sm">Nhập thông tin để kết nối năng lượng</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 flex items-center gap-2 text-red-200 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{typeof error === 'string' ? error : 'Đăng nhập thất bại'}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Tên đăng nhập</Label>
                  <div className="relative group/input">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-amber-500 transition-colors" />
                    <Input
                      type="text" placeholder="username hoặc email"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="h-11 pl-10 bg-slate-950/50 border-white/10 text-slate-100 focus:border-amber-500/50 transition-all"
                      required
                    />
                    {errors.username && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.username}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-slate-300 text-xs uppercase tracking-wider font-semibold">Mật khẩu</Label>
                    <Link href="/forgot-password" className="text-[10px] text-amber-500/50 cursor-not-allowed">Quên mật khẩu?</Link>
                  </div>
                  <div className="relative group/input">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-amber-500 transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"} placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-11 pl-10 pr-10 bg-slate-950/50 border-white/10 text-slate-100 focus:border-amber-500/50 transition-all"
                      required
                    />
                    {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.password}</p>}
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold shadow-lg transition-all hover:scale-[1.02]">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang kết nối...</> : 'Đăng Nhập'}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f0a19] px-2 text-slate-500">Hoặc tiếp tục với</span></div>
              </div>

              {/* --- NÚT SOCIAL LOGIN ĐÃ THÔNG NÒNG --- */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline" className="h-10 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  GOOGLE
                </Button>
                <Button
                  onClick={() => handleComingSoon('Facebook')}
                  variant="outline" className="h-10 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  FACEBOOK
                </Button>
              </div>

              <div className="text-center">
                <p className="text-slate-500 text-sm">
                  Chưa có tài khoản? <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-amber-500 hover:text-amber-400 font-bold transition-colors hover:underline">Đăng ký ngay</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <SocialFloating />
    </div>
  );
}