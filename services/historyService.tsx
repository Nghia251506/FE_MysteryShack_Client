import axios from "@/lib/axios"; // Hoặc axios tùy cấu hình của bạn
import { History } from "@/types/history";

export const HistoryService = {
    // Lấy chi tiết lịch sử dựa trên Session ID
    getHistoryBySessionId: async (sessionId: number | string): Promise<History> => {
        const response = await axios.get(`/v1/history/session/${sessionId}`);
        return response.data;
    },

    // (Tùy chọn) Gửi rating/feedback
    submitFeedback: async (sessionId: number, data: { rating: number; feedback: string }) => {
        const response = await axios.post(`/v1/history/session/${sessionId}/feedback`, data);
        return response.data;
    },

//   getAllHistory: async (): Promise<History[]> => {
//         const response = await axios.get('/v1/history');
//         return response.data;
//     },

    // ENDPOINT MỚI: Lấy 10 cái gần nhất
    getRecentHistory: async (): Promise<History[]> => {
        const response = await axios.get('/v1/histories/recent');
        return response.data;
    },

    getMyHistories: async (): Promise<History[]> => {
        const response = await axios.get('/v1/histories/my-history');
        return response.data;
    }
};