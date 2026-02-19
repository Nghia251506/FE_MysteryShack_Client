import axios from "@/lib/axios"; // Hoặc axios tùy cấu hình của bạn
import { History } from "@/types/history";

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Trang hiện tại
  last: boolean;
}

export const HistoryService = {
  // Lấy chi tiết lịch sử dựa trên Session ID
  getHistoryBySessionId: async (
    sessionId: number | string,
  ): Promise<History> => {
    const response = await axios.get(`/v1/history/session/${sessionId}`);
    return response.data;
  },

  // (Tùy chọn) Gửi rating/feedback
  submitFeedback: async (
    sessionId: number,
    data: { rating: number; feedback: string },
  ) => {
    const response = await axios.post(
      `/v1/history/session/${sessionId}/feedback`,
      data,
    );
    return response.data;
  },

  //   getAllHistory: async (): Promise<History[]> => {
  //         const response = await axios.get('/v1/history');
  //         return response.data;
  //     },

  // ENDPOINT MỚI: Lấy 10 cái gần nhất
  getRecentHistory: async (
    page: number = 0,
    size: number = 10,
  ): Promise<PageResponse<History>> => {
    // Gọi API với query params: /v1/histories/recent?page=0&size=10
    const response = await axios.get("/v1/histories/recent", {
      params: {
        page: page,
        size: size,
      },
    });

    // Bây giờ response.data sẽ là object Page chứ không phải mảng nữa
    return response.data;
  },

  getMyHistories: async (
    page: number = 0,
    size: number = 6, // Mặc định 6 cái như giao diện ông thiết kế
  ): Promise<PageResponse<History>> => {
    const response = await axios.get("/v1/histories/my-history", {
      params: {
        page: page,
        size: size,
      },
    });
    
    // Bây giờ response.data trả về object Page { content, totalPages, ... }
    return response.data;
  },
};
