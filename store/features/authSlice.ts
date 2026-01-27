import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/services/authService';
import { User, LoginRequest, RegisterRequest } from '@/types/auth';

// 1. Thêm isAuthenticated vào Interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean; // <--- THÊM DÒNG NÀY
  loading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('currentUser');
      return {
        user: user ? JSON.parse(user) : null,
        token: token || null,
        // 2. Tính toán trạng thái đăng nhập từ token
        isAuthenticated: !!token, 
        loading: false,
        error: null,
      };
    } catch (e) {
      console.error("Lỗi parse auth storage:", e);
    }
  }
  return { user: null, token: null, isAuthenticated: false, loading: false, error: null };
};

const initialState: AuthState = getInitialState();

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, thunkAPI) => {
    try {
      const response = await AuthService.login(credentials);
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
      const loginResponse = await AuthService.login({
        username: data.username,
        passwordHash: data.passwordHash // <--- Fix lỗi type password -> passwordHash
      });
      return {
        user: loginResponse.user || loginResponse,
        token: loginResponse.token
      };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true; // <--- Cập nhật thành true
      state.loading = false;
      state.error = null;

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', action.payload.token);
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false; // <--- Cập nhật thành false
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
      }
    },

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
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // <--- True khi login xong
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', action.payload.token);
          localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // isAuthenticated sẽ được set bởi loginSuccess ở UI hoặc logic loginUser
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateUser, clearError, loginSuccess } = authSlice.actions;
export default authSlice.reducer;