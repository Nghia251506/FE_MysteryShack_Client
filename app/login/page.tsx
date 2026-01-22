'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Eye, EyeOff, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Import AuthContext
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Lấy hàm login từ context

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // --- LOGIC XỬ LÝ USERNAME/EMAIL ĐỂ TRÁNH LỖI 401 ---
      // Nếu người dùng nhập Email (có chứa @), ta lấy phần trước @ làm username
      let usernameToSend = formData.email.trim();
      if (usernameToSend.includes('@')) {
          usernameToSend = usernameToSend.split('@')[0];
      }

      // Gọi API Login
      await login({ 
        username: usernameToSend, 
        passwordHash: formData.password 
      });

      // --- CHUYỂN HƯỚNG SANG TAROT DRAW ---
      // Sau khi login thành công, chuyển ngay sang trang rút bài
      router.push("/tarot-draw");

    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err);
      // Hiển thị lỗi
      const msg = err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0510] to-[#0a0510]"></div>
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-amber-600/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* Logo Corner */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="group flex items-center gap-3 text-amber-100/80 hover:text-amber-400 transition-all duration-300">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-amber-500/50 backdrop-blur-md transition-colors">
            <Moon className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-wide">Mystic Tarot</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md z-10 group">
        {/* Glow Effect behind card */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        
        <Card className="relative w-full bg-[#0f0a19]/90 border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-8 pt-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent flex items-center justify-center border border-amber-500/20 mb-2 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-white tracking-tight">
              Chào Mừng
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Nhập thông tin để kết nối với vũ trụ
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 flex items-center gap-2 text-red-200 text-sm animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-xs uppercase tracking-wider font-semibold">
                  Email hoặc Tên đăng nhập
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="username hoặc email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all duration-300"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-slate-300 text-xs uppercase tracking-wider font-semibold">
                    Mật khẩu
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-amber-500/80 hover:text-amber-400 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-11 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 pr-10 transition-all duration-300"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-base shadow-lg shadow-amber-900/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng Nhập'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Bạn chưa có tài khoản?{' '}
                <Link
                  href="/register"
                  className="text-amber-500 hover:text-amber-400 font-semibold transition-colors hover:underline decoration-amber-500/30 underline-offset-4"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>

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
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className="h-10 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className="h-10 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                >
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