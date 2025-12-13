'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wMiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>

      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2 text-amber-100 hover:text-amber-500 transition-colors">
          <Moon className="w-6 h-6" />
          <span className="text-xl font-bold">Mystic Tarot</span>
        </Link>
      </div>

      <Card className="w-full max-w-md bg-slate-900/80 border-amber-900/20 backdrop-blur-sm shadow-2xl relative z-10">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-amber-900/30 to-amber-950/30">
              <Moon className="w-12 h-12 text-amber-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            Chào Mừng Trở Lại
          </CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Đăng nhập để tiếp tục hành trình khám phá vận mệnh
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-100">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-slate-950/50 border-amber-900/30 text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-amber-100">
                  Mật khẩu
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
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
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-slate-950/50 border-amber-900/30 text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-base py-6 shadow-lg shadow-amber-900/50"
            >
              Đăng Nhập
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Chưa có tài khoản?{' '}
              <Link
                href="/register"
                className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-amber-900/20">
            <p className="text-center text-sm text-slate-500">
              Hoặc đăng nhập với
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-amber-900/30 text-slate-300 hover:bg-amber-950/30 hover:text-amber-500 hover:border-amber-500/30"
              >
                Google
              </Button>
              <Button
                variant="outline"
                className="border-amber-900/30 text-slate-300 hover:bg-amber-950/30 hover:text-amber-500 hover:border-amber-500/30"
              >
                Facebook
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
