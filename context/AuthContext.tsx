"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginRequest, RegisterRequest } from "@/types/auth";
import { AuthService } from "@/services/authService";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void; // <--- 1. THÊM DÒNG NÀY
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user từ localStorage khi app khởi chạy
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("accessToken");
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Lỗi đọc user cũ:", e);
        // Nếu lỗi JSON, xóa luôn để tránh lỗi app
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const res = await AuthService.login(data);
      
      // --- LOG ĐỂ KIỂM TRA BACKEND TRẢ VỀ GÌ ---
      console.log("LOGIN RESPONSE:", res); 
      // Nếu ở đây không thấy birthDate, bạn phải bảo Backend thêm vào!

      // Map dữ liệu (Fallback nếu backend trả về cấu trúc khác)
      const userData = res.user || res; 
      const token = res.token;

      // Lưu vào state & local
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      if (token) localStorage.setItem("accessToken", token);
      
      router.push("/"); 
    } catch (error) {
      console.error("Login failed", error);
      throw error; 
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await AuthService.register(data);
      // Đăng ký xong chuyển sang login
      router.push("/login");
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  // 2. THÊM HÀM CẬP NHẬT USER (Dùng cho trang Profile lưu lại)
  const updateUser = (newUserData: User) => {
    setUser(newUserData);
    localStorage.setItem("currentUser", JSON.stringify(newUserData));
  };

  return (
    // 3. ĐƯA updateUser VÀO VALUE
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};