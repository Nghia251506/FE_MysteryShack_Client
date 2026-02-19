'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, Send, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppRedux';
import { forgotPassword, clearError } from '@/store/features/authSlice';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Vui lòng nhập email!");

    // Gọi thunk forgotPassword đã viết trong Slice
    const result = await dispatch(forgotPassword(email));

    if (forgotPassword.fulfilled.match(result)) {
      setIsSubmitted(true);
      toast.success("Mật chỉ đã được gửi!");
    } else {
      toast.error(result.payload as string || "Email không tồn tại trong hệ thống!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0510] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0510] to-[#0a0510] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
        
        <Card className="relative bg-[#0f0a19]/90 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <CardHeader className="space-y-3 text-center pb-6 pt-8">
                  <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-1">
                    <Mail className="w-7 h-7 text-amber-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white tracking-tight">Khôi phục mật chú</CardTitle>
                  <CardDescription className="text-slate-400">Nhập email gắn liền với định mệnh của bạn</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                      <Label className="text-slate-300 text-xs uppercase tracking-wider font-semibold ml-1">Địa chỉ Email</Label>
                      <div className="relative group/input">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-amber-500 transition-colors" />
                        <Input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="h-11 pl-10 bg-slate-950/50 border-white/10 text-slate-100 focus:border-amber-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <Button 
                      disabled={loading}
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold shadow-lg transition-all hover:scale-[1.02]"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />} 
                      GỬI MẬT CHỈ
                    </Button>
                  </form>

                  <div className="text-center pt-2">
                    <Link href="/login" className="text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center justify-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Quay lại đăng nhập
                    </Link>
                  </div>
                </CardContent>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-8 text-center space-y-6"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Kiểm tra hộp thư!</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Một liên kết khôi phục mật chú đã được gửi đến <br/>
                    <span className="text-amber-400 italic">{email}</span>. <br/>
                    Hãy thực hiện theo chỉ dẫn trong vòng 15 phút.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                  className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Gửi lại nếu chưa nhận được
                </Button>
                <div className="pt-4">
                  <Link href="/login" className="text-xs text-amber-500 hover:underline">
                    Quay lại trang chủ
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}