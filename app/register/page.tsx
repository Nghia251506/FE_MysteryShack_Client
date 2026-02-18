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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  User,
  Mail,
  Lock,
  AlertCircle,
  UserCircle,
  Calendar,
  CheckCircle2,
  X,
  MailQuestion,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registerUser } from "@/store/features/authSlice";
import Footer from "@/components/Footer";
import SocialFloating from "@/components/SocialFloating";

// --- VALIDATION HELPER ---
const validateField = (name: string, value: any, formData?: any) => {
  switch (name) {
    case 'username':
      if (!value) return "Vui lòng nhập tên đăng nhập.";
      if (value.length < 3) return "Tên đăng nhập ít nhất 3 ký tự.";
      if (/\s/.test(value)) return "Tên đăng nhập không được chứa khoảng trắng.";
      return "";
    case 'email':
      if (!value) return "Vui lòng nhập email.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Email không đúng định dạng.";
    case 'password':
      if (!value) return "Vui lòng nhập mật khẩu.";
      return value.length < 6 ? "Mật khẩu phải có ít nhất 6 ký tự." : "";
    case 'confirmPassword':
      if (!value) return "Vui lòng xác nhận mật khẩu.";
      return value !== formData.password ? "Mật khẩu xác nhận không khớp." : "";
    case 'fullName':
      if (!value.trim()) return "Vui lòng nhập họ và tên.";
      return value.trim().length < 2 ? "Họ tên quá ngắn ông giáo ơi." : "";
    case 'birthDate':
      if (!value) return "Vui lòng chọn ngày sinh.";
      return "";
    default:
      return "";
  }
};

// --- ERROR MESSAGE COMPONENT ---
const ErrorMessage = ({ message }: { message: string }) => (
  <motion.p
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className="text-[10px] text-red-400 ml-1 mt-1 font-medium flex items-center gap-1"
  >
    <AlertCircle className="w-3 h-3" /> {message}
  </motion.p>
);

// --- TOAST COMPONENT ---
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void; }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, x: 20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: -20, x: 20 }}
    className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 ${type === "success" ? "bg-green-900/90 text-green-100" : "bg-red-900/90 text-red-100"}`}
  >
    {type === "success" ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

// --- SUCCESS MODAL ---
const SuccessModal = ({ isOpen, onClose, email }: { isOpen: boolean, onClose: () => void, email: string }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm bg-[#160d26] border border-amber-500/30 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(217,119,6,0.15)]"
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-6">
            <MailQuestion className="w-10 h-10 text-amber-400 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Chúc mừng bạn!</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Bạn đã đăng ký tài khoản thành công. Vui lòng kiểm tra email <span className="text-amber-400 font-semibold">{email}</span> để xác thực tài khoản.
          </p>
          <Button onClick={onClose} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold">
            Tôi đã hiểu
          </Button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    isReader: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // --- LOGIC: KHÔI PHỤC DỮ LIỆU TẠM ---
  useEffect(() => {
    const savedData = localStorage.getItem('draft_register_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed, password: "", confirmPassword: "" }));
      } catch (e) { console.error("Lỗi parse data tạm:", e); }
    }
  }, []);

  // --- LOGIC: LƯU DỮ LIỆU TẠM (Trừ Password) ---
  useEffect(() => {
    const { password, confirmPassword, ...dataToSave } = formData;
    localStorage.setItem('draft_register_data', JSON.stringify(dataToSave));
  }, [formData]);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(user.role === "READER" ? "/readerdashboard" : "/profile");
    }
  }, [isAuthenticated, user, router]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'agreeToTerms' && key !== 'isReader') {
        const error = validateField(key, (formData as any)[key], formData);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Vui lòng kiểm tra lại thông tin!", "error");
      return;
    }

    if (!formData.agreeToTerms) {
      showToast("Vui lòng đồng ý với điều khoản sử dụng.", "error");
      return;
    }

    const resultAction = await dispatch(
      registerUser({
        username: formData.username,
        passwordHash: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        role: formData.isReader ? "READER" : "CUSTOMER",
      }),
    );

    if (registerUser.fulfilled.match(resultAction)) {
      localStorage.removeItem('draft_register_data'); // Đăng ký xong thì xóa nháp
      setIsSuccessModalOpen(true);
    } else {
      const serverErrors = resultAction.payload;
      if (typeof serverErrors === "object" && serverErrors !== null) {
        setErrors(serverErrors as Record<string, string>); 
        showToast("Thông tin đăng ký đã tồn tại hoặc không hợp lệ!", "error");
      } else {
        showToast(typeof serverErrors === "string" ? serverErrors : "Đăng ký thất bại.", "error");
      }
    }
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex flex-col relative overflow-x-hidden font-sans text-slate-100">
      <Header />
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
      <SuccessModal isOpen={isSuccessModalOpen} onClose={handleCloseModal} email={formData.email} />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0510] to-[#0a0510] pointer-events-none"></div>

      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="relative w-full max-w-md my-8">
          <Card className="w-full bg-[#0f0a19]/90 border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-2 text-center pb-6 pt-8">
              <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent flex items-center justify-center border border-amber-500/20 mb-1">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-white">Khởi Đầu Mới</CardTitle>
              <CardDescription className="text-slate-400">Tạo tài khoản để khám phá vận mệnh của bạn</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Họ và tên</Label>
                  <div className="relative group/input">
                    <UserCircle className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.fullName ? 'text-red-400' : 'text-slate-500 group-focus-within/input:text-amber-500'}`} />
                    <Input id="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" className={`h-10 pl-10 bg-slate-950/50 border-white/10 ${errors.fullName ? 'border-red-500/50' : 'focus:border-amber-500/50'}`} disabled={loading} />
                  </div>
                  <AnimatePresence>{errors.fullName && <ErrorMessage message={errors.fullName} />}</AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Tên đăng nhập</Label>
                  <div className="relative group/input">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.username ? 'text-red-400' : 'text-slate-500 group-focus-within/input:text-amber-500'}`} />
                    <Input id="username" value={formData.username} onChange={handleChange} placeholder="username123" className={`h-10 pl-10 bg-slate-950/50 border-white/10 ${errors.username ? 'border-red-500/50' : 'focus:border-amber-500/50'}`} disabled={loading} />
                  </div>
                  <AnimatePresence>{errors.username && <ErrorMessage message={errors.username} />}</AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="birthDate" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Ngày sinh</Label>
                  <div className="relative group/input">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.birthDate ? 'text-red-400' : 'text-slate-500 group-focus-within/input:text-amber-500'}`} />
                    <Input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className={`h-10 pl-10 bg-slate-950/50 border-white/10 text-slate-200 [color-scheme:dark] ${errors.birthDate ? 'border-red-500/50' : 'focus:border-amber-500/50'}`} disabled={loading} />
                  </div>
                  <AnimatePresence>{errors.birthDate && <ErrorMessage message={errors.birthDate} />}</AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Email</Label>
                  <div className="relative group/input">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-500 group-focus-within/input:text-amber-500'}`} />
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" autoComplete="off" className={`h-10 pl-10 bg-slate-950/50 border-white/10 ${errors.email ? 'border-red-500/50' : 'focus:border-amber-500/50'}`} disabled={loading} />
                  </div>
                  <AnimatePresence>{errors.email && <ErrorMessage message={errors.email} />}</AnimatePresence>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Mật khẩu</Label>
                    <div className="relative group/input">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.password ? 'text-red-400' : 'text-slate-500'}`} />
                      <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="••••••" className={`h-10 pl-10 pr-8 bg-slate-950/50 border-white/10 ${errors.password ? 'border-red-500/50' : ''}`} disabled={loading} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400">
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <AnimatePresence>{errors.password && <ErrorMessage message={errors.password} />}</AnimatePresence>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Xác nhận</Label>
                    <div className="relative group/input">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.confirmPassword ? 'text-red-400' : 'text-slate-500'}`} />
                      <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••" className={`h-10 pl-10 pr-8 bg-slate-950/50 border-white/10 ${errors.confirmPassword ? 'border-red-500/50' : ''}`} disabled={loading} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400">
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <AnimatePresence>{errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}</AnimatePresence>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <Checkbox id="isReader" checked={formData.isReader} onCheckedChange={(checked) => setFormData({ ...formData, isReader: !!checked })} disabled={loading} className="border-amber-500/50 data-[state=checked]:bg-amber-600" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="isReader" className="text-sm text-amber-200 cursor-pointer font-semibold flex items-center gap-2">Tôi muốn là Reader <Sparkles className="w-3.5 h-3.5 text-amber-400" /></Label>
                      <p className="text-[10px] text-slate-500 italic">(Cần làm bài test sau đăng ký)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 py-1">
                    <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: !!checked })} disabled={loading} className="mt-0.5 border-white/20" />
                    <Label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer font-normal">
                      Tôi đồng ý với <Link href="/terms" className="text-amber-500 hover:underline">Điều khoản</Link> và <Link href="/privacy" className="text-amber-500 hover:underline">Bảo mật</Link>
                    </Label>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold transition-all shadow-lg">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...</> : "Đăng Ký Ngay"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-500 text-sm">
                  Đã có tài khoản?{" "}
                  <Link href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"} className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">Đăng nhập</Link>
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