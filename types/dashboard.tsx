/**
 * Interface đại diện cho dữ liệu biểu đồ thu nhập (Income Chart)
 */
export interface IncomeChartPoint {
  label: string;
  value: number;
}

/**
 * Interface đại diện cho dữ liệu biểu đồ hiệu suất (Performance Chart)
 */
export interface PerformancePoint {
  name: string;   // VD: "Hoàn thành", "Đã hủy", "Khác"
  value: number;  // Số lượng session
  color: string;  // Mã màu Hex: "#f59e0b"
}

/**
 * DTO tổng hợp cho Dashboard Analytics
 */
export interface DashboardAnalyticsDTO {
  todayIncome: number;
  monthIncome: number;
  totalIncome: number;
  totalSessions: number;
  incomeChart: IncomeChartPoint[];
  performanceChart: PerformancePoint[];
}