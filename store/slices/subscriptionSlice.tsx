import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionDTO } from '@/types/subscription'
import { VipPackageDto } from '@/types/vipPackage';
import SubscriptionService from '@/services/subscriptionService';
import VipPackageService from '@/services/VipPackageService';
import PaymentService from '@/services/paymentService';

interface SubscriptionState {
  currentSub: SubscriptionDTO | null;
  packages: VipPackageDto[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  currentSub: null,
  packages: [],
  loading: false,
  error: null,
};

// Thunk lấy gói VIP hiện tại của User
export const fetchCurrentSubscription = createAsyncThunk(
  'subscription/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      return await SubscriptionService.getCurrentSubscription();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông tin gói');
    }
  }
);

// Thunk lấy danh sách tất cả các gói VIP (để Reader chọn mua)
export const fetchVipPackages = createAsyncThunk(
  'subscription/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      return await VipPackageService.getAllPackages();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách gói');
    }
  }
);

export const buyVip = createAsyncThunk(
  "subscription/buyVip",
  async (packageId: number, { rejectWithValue }) => {
    try {
      // Gọi qua PaymentService mà ông đã viết (hàm POST /payment/buy-vip)
      const paymentUrl = await PaymentService.createPaymentUrl(packageId);
      return paymentUrl; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi thanh toán");
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    // Reset khi logout
    clearSubscription: (state) => {
      state.currentSub = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetch gói hiện tại
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action: PayloadAction<SubscriptionDTO>) => {
        state.loading = false;
        state.currentSub = action.payload;
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Xử lý fetch danh sách gói bán
      .addCase(fetchVipPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVipPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload; // Đổ data vào đây
      })
      .addCase(fetchVipPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;