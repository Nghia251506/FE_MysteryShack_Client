import axios from '@/lib/axios';
import { User } from '../types/user';

const API_URL = '/users';

export const UserService = {
  // Lấy Reader ngẫu nhiên (có hỗ trợ loại trừ người cũ)
  getRandomReader: async (excludeIds: number[], customerId: number): Promise<User | null> => {
    const response = await axios.get(`${API_URL}/random-top`, {
      params: {
        excludeIds: excludeIds.join(','), // Chuyển mảng thành chuỗi 1,2,3 để Spring nhận List<Long>
        currentCustomerId: customerId
      }
    });
    return response.status === 204 ? null : response.data;
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