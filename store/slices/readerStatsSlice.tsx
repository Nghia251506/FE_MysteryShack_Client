import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { DashboardAnalyticsDTO } from "@/types/dashboard";
import { readerStatsService } from "@/services/readerStatsService";

// 1. Định nghĩa cấu trúc State của Slice
interface ReaderStatsState {
  analytics: DashboardAnalyticsDTO | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReaderStatsState = {
  analytics: null,
  isLoading: false,
  error: null,
};

// 2. Viết Async Thunk để gọi API
export const fetchDashboardAnalytics = createAsyncThunk(
  "readerStats/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const data = await readerStatsService.getDashboardAnalytics();
      return data;
    } catch (error: any) {
      // Trả về error message từ backend nếu có
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy dữ liệu thống kê"
      );
    }
  }
);

// 3. Khởi tạo Slice
const readerStatsSlice = createSlice({
  name: "readerStats",
  initialState,
  reducers: {
    // Nếu ông muốn reset data khi logout hoặc rời trang
    resetStats: (state) => {
      state.analytics = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Khi đang gọi API
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Khi gọi thành công
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action: PayloadAction<DashboardAnalyticsDTO>) => {
        state.isLoading = false;
        state.analytics = action.payload;
      })
      // Khi gọi thất bại
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetStats } = readerStatsSlice.actions;
export default readerStatsSlice.reducer;