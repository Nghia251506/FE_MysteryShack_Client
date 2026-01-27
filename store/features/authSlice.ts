import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/services/authService'; // Đảm bảo đường dẫn đúng
import { User, LoginRequest, RegisterRequest } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Helper lấy dữ liệu từ LocalStorage (chỉ chạy ở client)
const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('currentUser');
      return {
        user: user ? JSON.parse(user) : null,
        token: token || null,
        loading: false,
        error: null,
      };
    } catch (e) {
      console.error("Lỗi parse auth storage:", e);
    }
  }
  return { user: null, token: null, loading: false, error: null };
};

const initialState: AuthState = getInitialState();

// --- ASYNC THUNKS (Xử lý gọi API) ---

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, thunkAPI) => {
    try {
      const response = await AuthService.login(credentials);
      // Map response: Nếu backend trả về { token: "...", user: {...} }
      // Nếu backend trả về thẳng User có chứa token, sửa lại logic map này nhé
      return { 
        user: response.user || response, 
        token: response.token 
      };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, thunkAPI) => {
    try {
      await AuthService.register(data);
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- SLICE ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
      }
    },
    // Action cập nhật user (dùng cho Profile Page)
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          if (action.payload.token) localStorage.setItem('accessToken', action.payload.token);
          localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;