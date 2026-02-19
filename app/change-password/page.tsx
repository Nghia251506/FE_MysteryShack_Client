'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppRedux';
import { changePassword } from '@/store/features/authSlice';

export default function ChangePasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { loading: isAuthLoading } = useAppSelector((state) => state.auth);

  const [showPass, setShowPass] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false); // State để hiện màn hình thành công

  const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (!email) {
      toast.error("Không tìm thấy dấu vết email. Liên kết có thể đã hết hạn!");
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return toast.error("Email không hợp lệ!");
    if (formData.newPassword !== formData.confirmNewPassword) {
      return toast.error("Mật khẩu xác nhận không trùng khớp!");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("Mật chú phải có ít nhất 6 ký tự!");
    }

    setIsLocalLoading(true);
    try {
      const result = await dispatch(changePassword({
        email: email, 
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
        currentPassword: "" 
      }));

      if (changePassword.fulfilled.match(result)) {
        // Thay vì redirect, ta bật màn hình success
        setIsFinished(true);
        toast.success("Cập nhật mật chú thành công!");
      } else {
        const errorMsg = result.payload as string;
        toast.error(errorMsg || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      toast.error("Năng lượng bị gián đoạn!");
    } finally {
      setIsLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0510] to-[#0a0510] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <Card className="relative bg-[#0f0a19]/95 border-white/10 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] overflow-hidden">
          <AnimatePresence mode="wait">
            {!isFinished ? (
              // MÀN HÌNH NHẬP MẬT KHẨU MỚI
              <motion.div
                key="form-reset"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <CardHeader className="space-y-3 text-center pb-6 pt-8">
                  <div className="mx-auto w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-1">
                    <ShieldCheck className="w-7 h-7 text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white tracking-tight">Thiết lập mật chú mới</CardTitle>
                  <CardDescription className="text-slate-400">Năng lượng mới đang chờ đợi bạn</CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center mb-2">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Đang khôi phục cho</p>
                      <p className="text-sm text-amber-400 font-medium italic break-all">
                        {email || "Không xác định"}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Mật khẩu mới</Label>
                      <div className="relative group/input">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                          required
                          type={showPass ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          className="h-11 pl-10 pr-10 bg-slate-950/50 border-white/10 text-slate-100 focus:border-purple-500/50 transition-all font-mono"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Xác nhận mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                          required
                          type="password"
                          value={formData.confirmNewPassword}
                          onChange={(e) => setFormData({...formData, confirmNewPassword: e.target.value})}
                          className="h-11 pl-10 bg-slate-950/50 border-white/10 text-slate-100 focus:border-purple-500/50 transition-all font-mono"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      disabled={isLocalLoading || isAuthLoading || !email}
                      className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-900/20 transition-all hover:scale-[1.02] uppercase tracking-widest text-xs"
                    >
                      { (isLocalLoading || isAuthLoading) ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          ĐANG KẾT NỐI...
                        </div>
                      ) : "XÁC NHẬN THAY ĐỔI" }
                    </Button>
                  </form>
                </CardContent>
              </motion.div>
            ) : (
              // MÀN HÌNH SUCCESS SAU KHI ĐỔI XONG
              <motion.div
                key="success-reset"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-8 text-center space-y-6"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Thành công!</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Mật chú của bạn đã được thanh tẩy và làm mới. <br/>
                    Giờ đây bạn đã có thể tiếp tục hành trình của mình.
                  </p>
                </div>
                
                <Button 
                  onClick={() => router.push('/login')}
                  className="w-full h-12 bg-white text-black hover:bg-slate-200 font-bold transition-all flex items-center justify-center gap-2 group"
                >
                  QUAY LẠI ĐĂNG NHẬP
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}