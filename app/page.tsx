'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Moon, Star, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Moon,
      title: 'Bói Bài Tarot',
      description: 'Khám phá vận mệnh qua 78 lá bài Tarot huyền bí',
    },
    {
      icon: Sparkles,
      title: 'Giải Đáp Tương Lai',
      description: 'Nhận lời khuyên và định hướng cho cuộc sống',
    },
    {
      icon: Star,
      title: 'Tarot Hằng Ngày',
      description: 'Rút một lá bài mỗi ngày để biết vận may của bạn',
    },
    {
      icon: Eye,
      title: 'Đọc Vị Trí Bài',
      description: 'Phân tích sâu với nhiều cách xếp bài khác nhau',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wMiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>

      <header className="relative border-b border-amber-900/20 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="w-8 h-8 text-amber-500" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Mystic Tarot
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-amber-100 hover:text-amber-500 hover:bg-amber-950/30">
                Đăng Nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white">
                Đăng Ký
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500"></div>
                <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500"></div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 leading-tight">
              Khám Phá Vận Mệnh
              <br />
              Qua Bài Tarot
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Để những lá bài huyền bí dẫn dắt bạn qua hành trình khám phá
              bản thân và tương lai
            </p>

            <div className="flex gap-4 justify-center pt-8">
              {/* NÚT CHÍNH - DẪN ĐẾN TRANG BÓI BÀI */}
              <Link href="/tarot">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-lg px-8 py-6 shadow-lg shadow-amber-900/50"
                >
                  Bắt Đầu Bói Bài
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="border-amber-500/30 text-amber-100 hover:bg-amber-950/30 hover:text-amber-500 text-lg px-8 py-6"
              >
                Tìm Hiểu Thêm
              </Button>
            </div>
          </div>

          {/* Features cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-900/50 border-amber-900/20 backdrop-blur-sm hover:bg-slate-900/80 transition-all duration-300 cursor-pointer group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div
                      className={`p-4 rounded-full bg-gradient-to-br from-amber-900/30 to-amber-950/30 group-hover:from-amber-600/30 group-hover:to-amber-500/30 transition-all duration-300 ${
                        hoveredCard === index ? 'scale-110' : ''
                      }`}
                    >
                      <feature.icon className="w-8 h-8 text-amber-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-amber-100">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm border border-amber-900/20 rounded-2xl p-12">
            <div className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-amber-500" />
              <Star className="w-8 h-8 text-amber-400" />
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Sẵn Sàng Khám Phá Tương Lai?
            </h2>
            <p className="text-xl text-slate-300">
              Đăng ký ngay để bắt đầu hành trình khám phá vận mệnh của bạn
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-lg px-12 py-6"
              >
                Đăng Ký Miễn Phí
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-amber-900/20 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400">
          <p>© 2025 Mystic Tarot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}