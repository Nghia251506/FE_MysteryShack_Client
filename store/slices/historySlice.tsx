import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { History } from "@/types/history";
import { HistoryService } from "@/services/historyService";

interface HistoryState {
  currentHistory: History | null;
  recentHistories: any[];
  loading: boolean;
  recentLoading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  currentHistory: null,
  recentHistories: [],
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
  }
);


export const fetchRecentHistory = createAsyncThunk(
  "history/fetchRecent",
  async (_, { rejectWithValue }) => {
    try {
      return await HistoryService.getRecentHistory();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Không thể tải lịch sử gần đây");
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.currentHistory = null;
    }
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
      })
      .addCase(fetchRecentHistory.fulfilled, (state, action) => {
        state.recentLoading = false;
        state.recentHistories = action.payload;
      })
      .addCase(fetchRecentHistory.rejected, (state, action) => {
        state.recentLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHistory } = historySlice.actions;
export default historySlice.reducer;