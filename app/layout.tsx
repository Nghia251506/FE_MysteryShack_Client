import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import các Context Provider
import { TarotProvider } from "@/context/TarotContext";
import { AuthProvider } from "@/context/AuthContext"; // <--- Thêm dòng này

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
        {/* Bọc AuthProvider ở ngoài cùng để quản lý User toàn cục */}
        <AuthProvider>
          <TarotProvider>
            {children}
          </TarotProvider>
        </AuthProvider>
      </body>
    </html>
  );
}