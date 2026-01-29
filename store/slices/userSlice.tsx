import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';

interface UserState {
  user: User | null;
  matchedReader: User | null;
  loading: boolean;
  error: string | null;
}

// Hàm lấy dữ liệu từ đúng key "currentUser" trong ảnh của ông
const getInitialUser = (): User | null => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("currentUser"); // Đổi từ "user" thành "currentUser"
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
  user: getInitialUser(), // Nạp dữ liệu từ LocalStorage ngay khi khởi tạo
  matchedReader: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
      // Lưu vào đúng key "currentUser"
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
        // 1. Tạo object mới (Spread operator) để React render lại UI
        state.user = {
          ...state.user,
          active: action.payload // Dùng 'active' thay vì 'isActive' cho khớp JSON BE
        };

        // 2. Cập nhật vào LocalStorage với key "currentUser"
        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(state.user));
          console.log("LocalStorage đã cập nhật active thành:", action.payload);
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setMatchedReader: (state, action: PayloadAction<User | null>) => {
      state.matchedReader = action.payload;
    },
  },
});

export const { updateActiveStatus, setUser, setLoading,setMatchedReader } = userSlice.actions;
export default userSlice.reducer;