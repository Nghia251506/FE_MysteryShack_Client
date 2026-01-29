import axios from "@/lib/axios"; 
// Lưu ý: Đảm bảo "@/lib/axios" là instance axios đã cấu hình Base URL (ví dụ: http://localhost:8080/api)
// và Interceptor (để tự động gắn Token vào Header khi gọi API).

import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";

export const AuthService = {
  // 1. Đăng nhập
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Mapping dữ liệu từ form sang format Backend yêu cầu
    const payload = {
        username: data.username,
        password: data.passwordHash 
    };
    // Gọi API: /auth/login (Không có /v1)
    const response = await axios.post(`/auth/login`, payload);
    return response.data;
  },

  // 2. Đăng ký
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const payload = {
        ...data,
        password: data.passwordHash
    };
    // Gọi API: /auth/register (Không có /v1)
    const response = await axios.post(`/auth/register`, payload);
    return response.data;
  },

  // 3. Đăng xuất
  logout: async () => {
    // Gọi API: /auth/logout
    // Backend cần Token để biết ai đang logout.
    // Đảm bảo axios instance đã tự động gắn 'Authorization: Bearer <token>'
    return await axios.post(`/auth/logout`);
  }
};