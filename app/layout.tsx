// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ReduxProvider } from "@/app/providers/ReduxProvider"; 
import FCMInitializer from "@/components/common/FCMInitializer";
import { ModalFCMGlobal } from "@/components/fcm/ModalFCMGlobal"; // Import Modal Global bạn vừa tạo

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystic Tarot",
  description: "Kết nối Reader chuyên nghiệp",
  icons: {
    icon: "/logo (1).png", // Đường dẫn tính từ thư mục public
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ReduxProvider>
          {/* Khởi tạo lắng nghe FCM */}
          <FCMInitializer /> 
          
          {/* Modal nổ ra ở tầng cao nhất của App */}
          <ModalFCMGlobal /> 
          
          <ToastContainer/>
            {children}
        </ReduxProvider>
      </body>
    </html>
  );
}