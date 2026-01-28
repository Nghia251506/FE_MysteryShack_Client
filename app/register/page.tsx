'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Moon, Eye, EyeOff, Loader2, Sparkles, User, Mail, Lock, AlertCircle, UserCircle, Calendar, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion'; // Thêm thư viện animation

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { registerUser, loginSuccess } from '@/store/features/authSlice'; 

// --- COMPONENT TOAST NHỎ ---
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, x: 20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: -20, x: 20 }}
    className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 ${
      type === 'success' ? 'bg-green-900/90 text-green-100' : 'bg-red-900/90 text-red-100'
    }`}
  >
    {type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"><X className="w-4 h-4" /></button>
  </motion.div>
);

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // State quản lý Toast
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    username: '', 
    fullName: '',
    email: '',
    birthDate: '', 
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  // Hàm hiển thị Toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    // Tự tắt sau 3s
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password.length < 6) return setValidationError('Mật khẩu phải có ít nhất 6 ký tự.');
    if (formData.password !== formData.confirmPassword) return setValidationError('Mật khẩu xác nhận không khớp.');
    if (!formData.agreeToTerms) return setValidationError('Vui lòng đồng ý với điều khoản sử dụng.');

    try {
      const resultAction = await dispatch(registerUser({
        username: formData.username,
        passwordHash: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        role: "CUSTOMER"
      }));

      if (registerUser.fulfilled.match(resultAction)) {
        const realAuthData = resultAction.payload;

        if (realAuthData && realAuthData.token) {
             dispatch(loginSuccess({ 
                 user: realAuthData.user, 
                 token: realAuthData.token 
             }));
             
             // --- THAY ALERT BẰNG TOAST ---
             showToast('Đăng ký thành công! Đang chuyển hướng...', 'success');
             
             // Đợi 1.5s để người dùng đọc thông báo rồi mới chuyển trang
             setTimeout(() => {
                 router.push(callbackUrl);
             }, 1500);

        } else {
             showToast("Đăng ký thành công. Vui lòng đăng nhập lại.", 'success');
             setTimeout(() => router.push("/login"), 1500);
        }
      } else {
        // Xử lý lỗi từ Redux trả về (nếu có)
        const errorMsg = typeof resultAction.payload === 'string' ? resultAction.payload : "Đăng ký thất bại.";
        setValidationError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error("Lỗi:", err);
      const msg = 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại.';
      setValidationError(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* --- HIỂN THỊ TOAST --- */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0510] to-[#0a0510]"></div>
      
      {/* BACKGROUND ELEMENTS */}
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
            <CardTitle className="text-3xl font-bold text-white tracking-tight">Khởi Đầu Mới</CardTitle>
            <CardDescription className="text-slate-400 text-sm">Tạo tài khoản để khám phá vận mệnh của bạn</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {validationError && (
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 flex items-center gap-2 text-red-200 text-xs animate-in fade-in slide-in-from-top-1 break-words">
                  <AlertCircle className="w-4 h-4 shrink-0" /><span>{validationError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Họ và tên</Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input id="fullName" type="text" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="h-10 pl-10 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50" required disabled={loading} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Tên đăng nhập</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input id="username" type="text" placeholder="username123" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="h-10 pl-10 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50" required disabled={loading} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="birthDate" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Ngày sinh</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="h-10 pl-10 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50 [color-scheme:dark]" required disabled={loading} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input id="email" type="email" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-10 pl-10 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50" required disabled={loading} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="h-10 pl-10 pr-8 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50" required disabled={loading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400" disabled={loading}>
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Xác nhận</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="h-10 pl-10 pr-8 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/50" required disabled={loading} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400" disabled={loading}>
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })} disabled={loading} className="mt-0.5 border-white/20 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 data-[state=checked]:text-white" />
                <Label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer font-normal">
                  Tôi đồng ý với <Link href="/terms" className="text-amber-500 hover:text-amber-300 underline underline-offset-2">Điều khoản sử dụng</Link> và <Link href="/privacy" className="text-amber-500 hover:text-amber-300 underline underline-offset-2">Chính sách bảo mật</Link>
                </Label>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang tạo tài khoản...</> : 'Đăng Ký Ngay'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Đã có tài khoản? <Link href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"} className="text-amber-500 hover:text-amber-400 font-semibold transition-colors hover:underline decoration-amber-500/30 underline-offset-4">Đăng nhập</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}