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
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const res = await AuthService.login(data);
      
      // Lưu vào state và localStorage
      // Lưu ý: Backend bạn trả về cấu trúc nào? 
      // Giả sử res trả về { token: "...", ...userFields } hoặc { token: "...", user: {...} }
      // Bạn cần log res ra để map cho đúng nhé. 
      // Code dưới đây giả định res là object User có chứa token.
      
      const userData = res.user || res; // Fallback tùy cấu trúc BE
      const token = res.token;

      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("accessToken", token);
      
      // Setup default header cho các request sau
      // axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      router.push("/"); // Về trang chủ
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Ném lỗi để UI hiển thị
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await AuthService.register(data);
      // Đăng ký xong thì auto login hoặc chuyển sang trang login
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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};