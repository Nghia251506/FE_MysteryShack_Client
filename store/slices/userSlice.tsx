import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ProfileUpdateRequest, User } from "@/types/user";
import { UserService } from "@/services/userService"; // Ông check lại đường dẫn này nhé

interface UserState {
  user: User | null;
  matchedReader: User | null;
  excludedIds: number[]; // Lưu danh sách ID đã lướt qua
  loading: boolean;
  error: string | null;
}

// --- ASYNC THUNK: GỌI QUA USER_SERVICE ---
export const fetchRandomReader = createAsyncThunk(
  "user/fetchRandomReader",
  async (customerId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      // Sử dụng hàm getRandomReader từ UserService ông vừa viết
      const data = await UserService.getRandomReader(
        state.user.excludedIds,
        customerId,
      );
      return data; // Trả về User hoặc null (nếu 204)
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi khi tìm Reader",
      );
    }
  },
);

export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await UserService.getUserById(id);
      return data; // Trả về object User
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể lấy thông tin người dùng"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    { id, userData }: { id: number; userData: any },
    { rejectWithValue },
  ) => {
    try {
      const data = await UserService.updateProfile(id, userData);
      return data; // Trả về User đã cập nhật từ BE
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể cập nhật hồ sơ",
      );
    }
  },
);

export const updateCustomerProfile = createAsyncThunk(
  "user/updateCustomerProfile",
  async (userData: ProfileUpdateRequest, { rejectWithValue }) => {
    try {
      // Gọi hàm Service dành cho Customer
      const data = await UserService.updateProfileCustomer(userData);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể cập nhật hồ sơ khách hàng",
      );
    }
  },
);

const getInitialUser = (): User | null => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("currentUser");
    if (saved && saved !== "undefined") {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

const initialState: UserState = {
  user: getInitialUser(),
  matchedReader: null,
  excludedIds: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("currentUser", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("currentUser");
        }
      }
    },
    updateActiveStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          active: action.payload,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(state.user));
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMatchedReader: (state, action: PayloadAction<User | null>) => {
      state.matchedReader = action.payload;
    },
    // Reset khi khách muốn bắt đầu lại từ đầu hoặc thoát màn hình
    resetMatching: (state) => {
      state.matchedReader = null;
      state.excludedIds = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomReader.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRandomReader.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.loading = false;
          state.matchedReader = action.payload;

          // Nếu tìm thấy Reader, nhét ID vào mảng loại trừ ngay
          if (action.payload) {
            if (!state.excludedIds.includes(action.payload.id)) {
              state.excludedIds.push(action.payload.id);
            }
          }
        },
      )
      .addCase(fetchRandomReader.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.matchedReader = null; // Reset nếu lỗi để UI không hiển thị sai
      })

      // --- XỬ LÝ UPDATE PROFILE ---
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload; // Ghi đè user mới vào state
          state.error = null;

          // Cập nhật lại LocalStorage để đồng bộ
          if (typeof window !== "undefined") {
            localStorage.setItem("currentUser", JSON.stringify(action.payload));
          }
        },
      )
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCustomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCustomerProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload; // Cập nhật state user hiện tại
          state.error = null;

          // Cập nhật lại LocalStorage: Xóa cũ - Ghi mới
          if (typeof window !== "undefined") {
            localStorage.removeItem("currentUser");
            localStorage.setItem("currentUser", JSON.stringify(action.payload));
          }
        },
      )
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload; // Cập nhật dữ liệu mới nhất từ server vào state
        state.error = null;

        // Đồng bộ lại LocalStorage để khi reload trang không bị dữ liệu cũ
        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(action.payload));
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateActiveStatus,
  setUser,
  setLoading,
  setMatchedReader,
  resetMatching,
} = userSlice.actions;

export default userSlice.reducer;
