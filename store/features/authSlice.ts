import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/services/authService';
import { User, LoginRequest, RegisterRequest, AuthResponse, ChangPasswordRequest } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  verificationStatus: 'idle' | 'loading' | 'success' | 'expired' | 'error';
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('currentUser');
      return {
        user: user ? JSON.parse(user) : null,
        token: token || null,
        isAuthenticated: !!token,
        loading: false,
        error: null,
        verificationStatus: 'idle',
      };
    } catch (e) {
      console.error("Lỗi parse auth storage:", e);
    }
  }
  return { user: null, token: null, isAuthenticated: false, loading: false, error: null, verificationStatus: 'idle' };
};

const initialState: AuthState = getInitialState();

// 1. Thunk: Đăng nhập
export const loginUser = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      return response;
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue("Đã xảy ra lỗi hệ thống");
    }
  }
);

// 2. Thunk: Đăng ký (Đã bỏ tự động Login để chờ Verify)
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(data);
      return response; // Trả về thông báo yêu cầu check mail
    } catch (err: any) {
      // TRỌNG TÂM Ở ĐÂY: 
      // Nếu BE trả về lỗi (400, 401...), ta lấy data (Map lỗi) ném vào rejectWithValue
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue("Đã xảy ra lỗi hệ thống");
    }
  }
);

// 3. Thunk: Xác thực Token Email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ token, userId }: { token: string; userId: number }, thunkAPI) => {
    try {
      const response = await AuthService.verifyToken(token, userId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Xác thực thất bại');
    }
  }
);

// 4. Thunk: Gửi lại email xác thực
export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (email: string, thunkAPI) => {
    try {
      const response = await AuthService.resendVerificationEmail(email);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Gửi lại email thất bại');
    }
  }
);

// 5. Thunk: Quên mật khẩu
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await AuthService.forgotPassword(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Yêu cầu quên mật khẩu thất bại');
    }
  }
);

//6. Thunk: Đổi mật khẩu
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data: ChangPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.changePassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Đổi mật khẩu thất bại');
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
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', action.payload.token);
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      // 1. Reset State trong Redux về mặc định
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.verificationStatus = 'idle';

      // 2. Clear sạch sành sanh Storage
      if (typeof window !== 'undefined') {
        // Xóa sạch LocalStorage (Token, User, Register Draft...)
        localStorage.clear();

        // Xóa sạch SessionStorage (Dữ liệu bốc bài, chủ đề đang chọn...)
        sessionStorage.clear();

        // Nếu ông muốn giữ lại một vài thứ (ví dụ: Theme hay Ngôn ngữ) thì mới dùng removeItem
        // Còn muốn Clear sạch để Demo không lỗi thì dùng .clear() là chuẩn nhất.
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(state.user));
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetVerificationStatus: (state) => {
      state.verificationStatus = 'idle';
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
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', action.payload.token);
          localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        // Đăng ký xong chưa cho isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.verificationStatus = 'loading';
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.verificationStatus = 'success';
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        // Logic check nếu BE trả về mã expired thì set status tương ứng
        state.verificationStatus = (action.payload as string).includes('hết hạn') ? 'expired' : 'error';
      })

      // Resend Verification
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false;
        state.error = null; // Hoặc set 1 cái toast thành công
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null; // Hoặc set 1 cái toast thành công
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      }
      ).addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null; // Hoặc set 1 cái toast thành công
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateUser, clearError, loginSuccess, resetVerificationStatus } = authSlice.actions;
export default authSlice.reducer;
