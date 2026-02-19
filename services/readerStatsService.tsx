import axios from "@/lib/axios";
// Import các interface đã định nghĩa (giả sử ông để ở file types)
import { DashboardAnalyticsDTO } from "@/types/dashboard";

/**
 * Interface cho dữ liệu Dashboard cơ bản (nếu ReaderStatsDTO khác DashboardAnalyticsDTO)
 * Tôi tạo tạm dựa theo tên Controller của ông, ông có thể điều chỉnh field cho khớp
 */
export interface ReaderStatsDTO {
  totalBalance: number;
  activeSessions: number;
  completedSessions: number;
  totalSpent: number;
}

const API_PATH = "/reader/statistics";

export const readerStatsService = {

  /**
   * Lấy dữ liệu phân tích đầy đủ (bao gồm cả các biểu đồ Income và Performance)
   */
  getDashboardAnalytics: async (): Promise<DashboardAnalyticsDTO> => {
    const response = await axios.get<DashboardAnalyticsDTO>(`${API_PATH}/dashboard-analytics`);
    return response.data;
  }
};

export default readerStatsService;