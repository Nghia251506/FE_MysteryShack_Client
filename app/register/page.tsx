'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Moon, Eye, EyeOff, Loader2, Sparkles, User, Mail, Lock, AlertCircle, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '', // Thêm trường username
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate cơ bản phía Client
    if (formData.password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        setIsLoading(false);
        return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setIsLoading(false);
      return;
    }
    if (!formData.agreeToTerms) {
      setError('Vui lòng đồng ý với điều khoản sử dụng.');
      setIsLoading(false);
      return;
    }

    try {
      // Gọi API đăng ký
      await register({
        username: formData.username, // Gửi username người dùng nhập
        passwordHash: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        role: "CUSTOMER"
      });

      alert('Đăng ký tài khoản thành công! Hãy đăng nhập ngay.');
      router.push('/login');

    } catch (err: any) {
      console.error("Lỗi đăng ký:", err);
      // Hiển thị lỗi chi tiết từ Backend (nếu có)
      const msg = err.response?.data?.message || JSON.stringify(err.response?.data) || 'Đăng ký thất bại. Kiểm tra lại thông tin.';
      // Mẹo: Nếu msg chứa "Validation failed", hãy bảo user check lại độ dài username/password
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0510] to-[#0a0510]"></div>
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-amber-600/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="group flex items-center gap-3 text-amber-100/80 hover:text-amber-400 transition-all duration-300">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-amber-500/50 backdrop-blur-md transition-colors">
            <Moon className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-wide">Mystic Tarot</span>
        </Link>
      </div>

      <div className="relative w-full max-w-md z-10 group my-8">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-amber-500 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

        <Card className="relative w-full bg-[#0f0a19]/90 border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-6 pt-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent flex items-center justify-center border border-amber-500/20 mb-1 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Sparkles className="w-7 h-7 text-amber-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-white tracking-tight">
              Khởi Đầu Mới
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Tạo tài khoản để khám phá vận mệnh của bạn
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 flex items-center gap-2 text-red-200 text-xs animate-in fade-in slide-in-from-top-1 break-words">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">
                  Họ và tên
                </Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-10 pl-10 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Username Field (ĐÃ THÊM LẠI ĐỂ FIX LỖI VALIDATION) */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">
                  Tên đăng nhập
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="username123"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="h-10 pl-10 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-10 pl-10 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-10 pl-10 pr-8 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">
                    Xác nhận
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="h-10 pl-10 pr-8 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 py-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                  disabled={isLoading}
                  className="mt-0.5 border-white/20 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 data-[state=checked]:text-white"
                />
                <Label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer font-normal">
                  Tôi đồng ý với{' '}
                  <Link href="/terms" className="text-amber-500 hover:text-amber-300 underline underline-offset-2 transition-colors">
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link href="/privacy" className="text-amber-500 hover:text-amber-300 underline underline-offset-2 transition-colors">
                    Chính sách bảo mật
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-900/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  'Đăng Ký Ngay'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Đã có tài khoản?{' '}
                <Link
                  href="/login"
                  className="text-amber-500 hover:text-amber-400 font-semibold transition-colors hover:underline decoration-amber-500/30 underline-offset-4"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}