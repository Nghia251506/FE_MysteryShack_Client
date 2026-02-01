import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CreateRatingDTO, Rating, RatingStats } from '@/types/rating';
import { RatingService } from '@/services/ratingService';

interface RatingState {
  ratings: Rating[];
  stats: RatingStats | null;
  pendingSessions: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RatingState = {
  ratings: [],
  stats: null,
  pendingSessions: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu đánh giá của một Reader
export const fetchReaderRatings = createAsyncThunk(
  'rating/fetchReaderRatings',
  async (readerId: number, { rejectWithValue }) => {
    try {
      const [ratings, stats] = await Promise.all([
        RatingService.getReaderRatings(readerId),
        RatingService.getReaderStats(readerId)
      ]);
      return { ratings, stats };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi khi lấy đánh giá");
    }
  }
);

export const createNewRating = createAsyncThunk(
  'rating/createNewRating',
  async (data: CreateRatingDTO, { rejectWithValue }) => {
    try {
      const response = await RatingService.createRating(data);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Không thể gửi đánh giá");
    }
  }
);

export const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    clearRatingState: (state) => {
      state.ratings = [];
      state.stats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReaderRatings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReaderRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = action.payload.ratings;
        state.stats = action.payload.stats;
      })
      .addCase(fetchReaderRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNewRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewRating.fulfilled, (state, action: PayloadAction<Rating>) => {
        state.loading = false;
        // Sau khi đánh giá thành công, thêm ngay vào đầu danh sách hiện tại (nếu đang ở trang profile reader)
        state.ratings.unshift(action.payload);
      })
      .addCase(createNewRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRatingState } = ratingSlice.actions;
export default ratingSlice.reducer;