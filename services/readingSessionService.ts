// Import từ thư mục gốc dùng alias @/
import axios from "@/lib/axios";
import { ReaderStatsDto } from "@/types/reader";
import { ReadingSession, ReadingSessionDTO } from '@/types/readingSession';

const ENDPOINT = '/v1/sessions';

export const ReadingSessionService = {
    // Lấy danh sách (Dùng /matched để tránh lỗi 500 Lazy Load)
    getAllAmount: async (): Promise<number> => {
        const response = await axios.get(`${ENDPOINT}/total-income`);
        return response.data;
    },
    getAllSession: async (): Promise<number> => {
        const response = await axios.get(`${ENDPOINT}/total-sessions`);
        return response.data;
    },
    getProcessingSession: async (readerId: number): Promise<ReadingSession | null> => {
        try {
            // Khi cộng chuỗi thế này, JS tự ép số thành chuỗi để gửi đi
            const response = await axios.get(`${ENDPOINT}/reader/${readerId}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy phiên đang xử lý:", error);
            return null;
        }
    },

    getDashboardStats: async (): Promise<ReaderStatsDto> => {
        const response = await axios.get(`/reader/statistics/dashboard`);
        return response.data;
    },

    // 2. Tạo mới (User gửi request từ trang Tarot Draw)
    create: async (data: any, token: string | null, p0: any): Promise<ReadingSession> => {
        const response = await axios.post(ENDPOINT, data);
        return response.data;
    },

    // 3. Cập nhật thông tin chung (Nếu cần sửa note, status thủ công)
    update: async (id: number | string, data: Partial<ReadingSessionDTO>): Promise<ReadingSession> => {
        const response = await axios.put(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    // 4. Xóa cứng (Dùng cho admin hoặc dọn dẹp dữ liệu)
    delete: async (id: number | string): Promise<void> => {
        await axios.delete(`${ENDPOINT}/${id}`);
    },

    // 5. Lấy chi tiết theo ID (Option)
    getById: async (id: number | string): Promise<ReadingSession> => {
        const response = await axios.get(`${ENDPOINT}/${id}`);
        return response.data;
    },

    // --- 👇 CÁC HÀM BỔ SUNG CHO READER DASHBOARD 👇 ---

    // 6. Reader Chấp nhận yêu cầu (Chuyển trạng thái sang ACCEPTED/IN_PROGRESS)
    // API: POST /api/v1/sessions/{id}/accept
    accept: async (id: number | string): Promise<any> => {
        const response = await axios.post(`${ENDPOINT}/${id}/accept`);
        return response.data;
    },

    // 7. Reader Từ chối yêu cầu (Chuyển trạng thái sang REJECTED)
    // API: POST /api/v1/sessions/{id}/reject
    reject: async (id: number | string): Promise<any> => {
        const response = await axios.post(`${ENDPOINT}/${id}/reject`);
        return response.data;
    }
};
