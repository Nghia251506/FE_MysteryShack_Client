'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, Sparkles, User, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { loginUser, clearError } from '@/store/features/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // --- LOGIC 1: Auto Redirect nếu đã đăng nhập ---
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    const resultAction = await dispatch(loginUser({
      username: formData.username,
      passwordHash: formData.password 
    }));

    if (loginUser.fulfilled.match(resultAction)) {
      const loggedInUser = resultAction.payload.user;
      const role = loggedInUser?.role || "CUSTOMER";

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
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0510] to-[#0a0510]"></div>
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-amber-600/10 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* --- LOGO VỀ TRANG CHỦ (Đã sửa dùng Image) --- */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="group flex items-center gap-3 text-amber-100/80 hover:text-amber-400 transition-all duration-300">
          <div className="relative w-[50px] h-[50px] flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-75 group-hover:scale-105 transition-transform duration-700" />
              <Image 
                src="/logo.png" 
                alt="Mystic Tarot Logo" 
                width={50} 
                height={50} 
                className="relative z-10 transition-transform duration-500 group-hover:rotate-6 rounded-full shadow-lg shadow-amber-500/20"
              />
          </div>
          <span className="text-lg font-bold tracking-wide">MysteryShack</span>
        </Link>
      </div>

      <div className="relative w-full max-w-md z-10 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        
        <Card className="relative w-full bg-[#0f0a19]/90 border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-6 pt-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent flex items-center justify-center border border-amber-500/20 mb-1 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Sparkles className="w-7 h-7 text-amber-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-white tracking-tight">Chào Mừng</CardTitle>
            <CardDescription className="text-slate-400 text-sm">Nhập thông tin để kết nối năng lượng</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 flex items-center gap-2 text-red-200 text-xs animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{typeof error === 'string' ? error : 'Đăng nhập thất bại'}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Tên đăng nhập</Label>
                <div className="relative group/input">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-amber-500 transition-colors" />
                  <Input 
                    type="text" 
                    placeholder="username hoặc email" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="h-11 pl-10 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-slate-300 text-xs uppercase tracking-wider font-semibold">Mật khẩu</Label>
                  <Link href="/forgot-password" className="text-[10px] text-amber-500 hover:text-amber-400 hover:underline">Quên mật khẩu?</Link>
                </div>
                <div className="relative group/input">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-amber-500 transition-colors" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-11 pl-10 pr-10 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all" 
                    required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang kết nối...</> : 'Đăng Nhập'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f0a19] px-2 text-slate-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button variant="outline" className="h-10 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                GOOGLE
              </Button>
              <Button variant="outline" className="h-10 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                FACEBOOK
              </Button>
            </div>

            <div className="text-center">
              <p className="text-slate-500 text-sm">
                Chưa có tài khoản? <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-amber-500 hover:text-amber-400 font-bold transition-colors hover:underline decoration-amber-500/30 underline-offset-4">Đăng ký ngay</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}