import axios from "axios"; 
// QUAN TRỌNG: Dùng axios gốc, KHÔNG dùng axiosClient (vì axiosClient mặc định có /v1)
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";

// ĐƯỜNG DẪN RIÊNG CHO AUTH (KHÔNG CÓ /v1)
const AUTH_API_URL = "http://localhost:8080/api/auth"; 

export const AuthService = {
  // 1. Đăng nhập
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const payload = {
        username: data.username,
        password: data.passwordHash 
    };
    // Gọi thẳng vào link không có v1
    const response = await axios.post(`${AUTH_API_URL}/login`, payload);
    return response.data;
  },

  // 2. Đăng ký
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const payload = {
        ...data,
        password: data.passwordHash
    };
    // Gọi thẳng vào link không có v1 -> FIX LỖI 404
    const response = await axios.post(`${AUTH_API_URL}/register`, payload);
    return response.data;
  },

  logout: async () => {
    return await axios.post(`${AUTH_API_URL}/logout`);
  }
};