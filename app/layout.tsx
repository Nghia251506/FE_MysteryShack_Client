import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TarotProvider } from "@/context/TarotContext"; // <--- Import này

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
        <TarotProvider> {/* <--- Bọc Provider ở đây */}
          {children}
        </TarotProvider>
      </body>
    </html>
  );
}