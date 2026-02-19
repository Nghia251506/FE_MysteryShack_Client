import axios from "@/lib/axios"; 
// QUAN TRỌNG: Đảm bảo @/lib/axios đã được cấu hình Interceptor 
// để tự động gắn header 'Authorization: Bearer ...' khi có token.

import { LoginRequest, RegisterRequest, AuthResponse, ChangPasswordRequest } from "@/types/auth";
import { verify } from "node:crypto";

// Định nghĩa kiểu dữ liệu cho update info
interface UpdateBookingInfoRequest {
    fullName: string;
    birthDate: string; // Format YYYY-MM-DD
}

export const AuthService = {
  // 1. Đăng nhập
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const payload = {
        username: data.username,
        password: data.passwordHash 
    };
    // Gọi thẳng vào link không có /v1
    const response = await axios.post(`/auth/login`, payload);
    return response.data;
  },

  // 2. Đăng ký
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const payload = {
        ...data,
        password: data.passwordHash
    };
    // Gọi thẳng vào link không có /v1
    const response = await axios.post(`/auth/register`, payload);
    return response.data;
  },

  // 3. Đăng xuất
  logout: async () => {
    // API này yêu cầu Token. 
    // Nếu axios instance của bạn chưa tự động gắn token, bạn cần truyền config vào tham số thứ 2.
    // Ví dụ: { headers: { Authorization: `Bearer ${token}` } }
    return await axios.post(`/auth/logout`);
  },

  // 4. Cập nhật thông tin Booking (Mới thêm)
  // URL: /api/users/booking-info/{id} (Không có /v1 theo yêu cầu của bạn)
  updateBookingInfo: async (userId: number | string, data: UpdateBookingInfoRequest) => {
      const response = await axios.put(`/users/booking-info/${userId}`, data);
      return response.data;
  },
  verifyToken: async (token: string, userId: number) => {
    try {
      const response = await axios.post(`/auth/public/verify`, { token, userId });
      return response.data; // Trả về thông tin người dùng nếu token hợp lệ
    } catch (error) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }
  },
  resendVerificationEmail: async (email: string) => {
    try {
      const response = await axios.post(`/auth/public/resend-verify`, { email });
      return response.data; // Trả về thông báo thành công
    } catch (error) {
      throw new Error("Không thể gửi lại email xác nhận");
    }
  },
  forgotPassword: async (email: string) => {
    try {
      const response = await axios.post(`/auth/forgot-password?email=${email}`);
      return response.data; // Trả về thông báo thành công
    } catch (error) {
      throw new Error("Không thể gửi email đặt lại mật khẩu");
    }
  },
  changePassword: async (data: ChangPasswordRequest) => {
    try {
      const response = await axios.post(`/auth/reset-password`, data);
      return response.data; // Trả về thông báo thành công
    } catch (error) {
      throw new Error("Không thể đổi mật khẩu");
    }
  },
};