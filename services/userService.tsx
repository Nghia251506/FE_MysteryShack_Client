import axios from '@/lib/axios';
import { User } from '../types/user';

const API_URL = '/users';

export const UserService = {
  // Lấy Reader ngẫu nhiên (có hỗ trợ loại trừ người cũ)
  getRandomTopReader: async (excludeId?: number): Promise<User> => {
    const params = excludeId ? { excludeId } : {};
    const response = await axios.get(`${API_URL}/readers/random-top`, { params });
    return response.data;
  },

  // Lấy chi tiết 1 User
  getUserById: async (id: number): Promise<User> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
  toggleStatus: async () => {
    try {
      const response = await axios.put("/users/toggle-status");
      return response.data; // BE trả về: { success: true, newStatus: true/false, message: "..." }
    } catch (error) {
      throw error;
    }
  },
};