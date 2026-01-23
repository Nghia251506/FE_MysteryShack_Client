// Dữ liệu User trả về sau khi Login thành công
export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: 'CUSTOMER' | 'READER' | 'ADMIN';
    token?: string; // JWT Token
  }
  
  // Payload gửi lên khi Đăng nhập
  export interface LoginRequest {
    username: string;
    passwordHash: string; // Backend bạn đặt tên là passwordHash hay password? Thường là password ở DTO request.
  }
  
  // Payload gửi lên khi Đăng ký
  export interface RegisterRequest {
    username: string;
    passwordHash: string;
    email: string;
    fullName: string;
    role: 'CUSTOMER' | 'READER';
  }
  
  // Response chuẩn từ Auth API
  export interface AuthResponse {
    token: string;
    user: User;
    message?: string;
  }