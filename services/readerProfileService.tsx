import axios from "@/lib/axios";
import { ReaderProfile } from "@/types/reader"; // Sử dụng Type tôi đã định nghĩa ở trên

export const ReaderProfileService = {
  /**
   * Lấy hồ sơ chi tiết (Unified Profile) của Reader
   */
  getProfile: async (readerId: number): Promise<ReaderProfile> => {
    const response = await axios.get(`/v1/reader-profiles/${readerId}`);
    return response.data;
  },
};