// Import từ thư mục gốc dùng alias @/
import axiosClient from '@/utils/axiosClient'; 
import { ReadingSession, ReadingSessionDTO } from '@/types/readingSession';

const ENDPOINT = '/sessions';

export const ReadingSessionService = {
    // 1. Lấy tất cả
    getAll: async (): Promise<ReadingSession[]> => {
        const response = await axiosClient.get(ENDPOINT);
        return response.data;
    },

    // 2. Tạo mới (User gửi request cho Reader)
    create: async (data: ReadingSessionDTO): Promise<ReadingSession> => {
        const response = await axiosClient.post(ENDPOINT, data);
        return response.data;
    }

    // ... Các hàm update, delete, getById giữ nguyên như bài trước
};