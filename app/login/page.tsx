'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Eye, EyeOff, Loader2, Sparkles, User, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { loginUser, clearError } from '@/store/features/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Callback URL dùng để lưu vết trang trước đó (VD: đang ở Booking bị bắt login)
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // --- LOGIC 1: Auto Redirect nếu F5 trang mà đã đăng nhập ---
  useEffect(() => {
    if (isAuthenticated && user) {
        if (user.role === 'READER') {
            router.push('/readerdashboard');
        } else {
            // Nếu là User: Ưu tiên quay lại trang cũ (nếu có), không thì vào Profile
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

    // Mapping password -> passwordHash để khớp API
    const resultAction = await dispatch(loginUser({ 
      username: formData.username, 
      passwordHash: formData.password 
    }));

    if (loginUser.fulfilled.match(resultAction)) {
      // Lấy thông tin user vừa login xong
      const loggedInUser = resultAction.payload.user;

      // --- LOGIC 2: Điều hướng sau khi bấm nút Đăng Nhập ---
      if (loggedInUser.role === 'READER') {
          // READER -> Vào Dashboard
          router.push('/readerdashboard');
      } else {
          // USER -> Vào Profile (hoặc quay lại Booking nếu đang dở dang)
          if (callbackUrl && callbackUrl !== '/' && !callbackUrl.includes('login')) {
              router.push(callbackUrl);
          } else {
              router.push('/profile');
          }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0510] to-[#0a0510]"></div>
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-amber-600/10 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="group flex items-center gap-3 text-amber-100/80 hover:text-amber-400 transition-all duration-300">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-amber-500/50 backdrop-blur-md transition-colors">
            <Moon className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-wide">Mystic Tarot</span>
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
                  <AlertCircle className="w-4 h-4 shrink-0" /><span>{typeof error === 'string' ? error : 'Đăng nhập thất bại'}</span>
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
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f0a19] px-2 text-slate-500">Hoặc tiếp tục với</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-300 text-xs h-10">GOOGLE</Button>
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-300 text-xs h-10">FACEBOOK</Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Bạn chưa có số tài khoản? <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-amber-500 hover:text-amber-400 font-bold transition-colors hover:underline decoration-amber-500/30 underline-offset-4">Đăng ký ngay</Link>
              </p>
            </div>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0f0a19] px-2 text-slate-500">Hoặc tiếp tục với</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" disabled={loading} className="h-10 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" disabled={loading} className="h-10 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all">
                  <svg className="mr-2 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.651-2.797 3.363v.896h4.441l-.544 3.667h-3.897v7.98C19.967 22.46 24 18.067 24 12.001 24 5.372 18.627 0 12 0S0 5.372 0 12.001c0 6.066 4.033 10.459 9.101 11.69z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}