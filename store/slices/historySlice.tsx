import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { History } from "@/types/history";
import { HistoryService } from "@/services/historyService";

interface HistoryState {
  currentHistory: History | null;
  recentHistories: History[];
  allHistories: History[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  isLast: boolean;
  loading: boolean;
  recentLoading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  currentHistory: null,
  recentHistories: [],
  allHistories: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  isLast: false,
  loading: false,
  recentLoading: false,
  error: null,
};

// Thunk để fetch dữ liệu
export const fetchHistoryBySession = createAsyncThunk(
  "history/fetchBySession",
  async (sessionId: number | string, { rejectWithValue }) => {
    try {
      return await HistoryService.getHistoryBySessionId(sessionId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi tải lịch sử");
    }
  },
);

export const fetchAllMyHistories = createAsyncThunk(
  "history/fetchAllMy",
  async (
    params: { page?: number; size?: number } | undefined,
    { rejectWithValue },
  ) => {
    try {
      // Truyền params vào service, nếu params undefined thì dùng mặc định trong Service
      return await HistoryService.getMyHistories(params?.page, params?.size);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi tải lịch sử");
    }
  },
);

export const fetchRecentHistory = createAsyncThunk(
  "history/fetchRecent",
  async (
    params: { page: number; size: number } | undefined,
    { rejectWithValue },
  ) => {
    try {
      // Truyền params vào service (mặc định page 0, size 10 nếu không có)
      const page = params?.page ?? 0;
      const size = params?.size ?? 10;
      return await HistoryService.getRecentHistory(page, size);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Không thể tải lịch sử");
    }
  },
);

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.currentHistory = null;
    },
    resetHistoryState: (state) => {
      state.recentHistories = [];
      state.currentPage = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoryBySession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistoryBySession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHistory = action.payload;
      })
      .addCase(fetchHistoryBySession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchRecentHistory.pending, (state) => {
        state.recentLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentHistory.fulfilled, (state, action) => {
        state.recentLoading = false;

        // --- BÓC TÁCH DỮ LIỆU TỪ PAGE OBJECT ---
        const { content, totalPages, totalElements, number, last } =
          action.payload;

        state.recentHistories = content; // Mảng dữ liệu
        state.totalPages = totalPages;
        state.totalElements = totalElements;
        state.currentPage = number;
        state.isLast = last;
        // ---------------------------------------
      })
      .addCase(fetchRecentHistory.rejected, (state, action) => {
        state.recentLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllMyHistories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMyHistories.fulfilled, (state, action) => {
        state.loading = false;
        state.allHistories = action.payload.content; // <--- Ông chỉ gán mảng vào đây
        state.totalPages = action.payload.totalPages; // <--- Thông tin trang nằm ở đây
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchAllMyHistories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHistory } = historySlice.actions;
export default historySlice.reducer;
