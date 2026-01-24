import axios from "axios";
import { ReadingSession, CreateReadingSessionDTO } from "@/types/readingSession";

const API_URL = "http://localhost:8080/api/v1/sessions";

const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : "";
    return { 
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        } 
    };
};

export const ReadingSessionService = {
  // Lấy danh sách (Dùng /matched để tránh lỗi 500 Lazy Load)
  getAll: async (): Promise<ReadingSession[]> => {
    const response = await axios.get(`${API_URL}/matched`, getAuthHeader());
    return response.data;
  },

  // Tạo mới (Booking)
  create: async (data: CreateReadingSessionDTO): Promise<ReadingSession> => {
    console.log("Payload gửi đi:", JSON.stringify(data, null, 2)); // Check log này
    const response = await axios.post(API_URL, data, getAuthHeader());
    return response.data;
  },

  // [FIX] Accept theo ảnh (POST)
  accept: async (id: number | string): Promise<ReadingSession> => {
    const response = await axios.post(`${API_URL}/${id}/accept`, {}, getAuthHeader());
    return response.data;
  },

  // [FIX] Reject theo ảnh (POST)
  reject: async (id: number | string): Promise<ReadingSession> => {
    const response = await axios.post(`${API_URL}/${id}/reject`, {}, getAuthHeader());
    return response.data;
  },

  update: async (id: number | string, data: Partial<ReadingSession>): Promise<ReadingSession> => {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
    return response.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  },

  getById: async (id: number | string): Promise<ReadingSession> => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  }
};