import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Import ReduxProvider (Thay thế cho AuthProvider và TarotProvider cũ)
import { ReduxProvider } from "@/app/providers/ReduxProvider"; 
import FCMInitializer from "@/components/common/FCMInitializer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystic Tarot",
  description: "Kết nối Reader chuyên nghiệp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {/* 2. Bọc toàn bộ ứng dụng bằng ReduxProvider */}
        <ReduxProvider>
          <FCMInitializer />
          <ToastContainer/>
            {children}
        </ReduxProvider>
      </body>
    </html>
  );
}