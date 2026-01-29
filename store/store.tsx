import { configureStore } from '@reduxjs/toolkit';
// Import các reducer
import tarotReducer from './slices/tarotSlice';
import authReducer from './features/authSlice'; // Đảm bảo đường dẫn đúng tới file authSlice bạn vừa tạo
import userReducer from './slices/userSlice';
import fcmReducer from "./slices/fcmSlice";
import historyRecucer from './slices/historySlice';

export const store = configureStore({
  reducer: {
    tarot: tarotReducer, // Logic Tarot cũ
    auth: authReducer,   // Logic Auth mới (User, Token, Login...)
    user: userReducer,
    fcm: fcmReducer,
    history: historyRecucer,
  },
  middleware: (getDefaultMiddleware: (arg0: { serializableCheck: boolean; }) => any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export types để dùng trong component
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;