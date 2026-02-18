import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ReaderProfile } from "@/types/reader";
import { ReaderProfileService } from "@/services/readerProfileService";

interface ReaderProfileState {
  currentProfile: ReaderProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReaderProfileState = {
  currentProfile: null,
  isLoading: false,
  error: null,
};

// Thunk để fetch profile
export const fetchReaderProfile = createAsyncThunk(
  "readerProfile/fetchById",
  async (readerId: number, { rejectWithValue }) => {
    try {
      return await ReaderProfileService.getProfile(readerId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi tải hồ sơ");
    }
  }
);

const readerProfileSlice = createSlice({
  name: "readerProfile",
  initialState,
  reducers: {
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReaderProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReaderProfile.fulfilled, (state, action: PayloadAction<ReaderProfile>) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchReaderProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProfile } = readerProfileSlice.actions;
export default readerProfileSlice.reducer;