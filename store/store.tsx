import { configureStore } from '@reduxjs/toolkit';
// Import các reducer
import tarotReducer from './slices/tarotSlice';
import authReducer from './features/authSlice'; // Đảm bảo đường dẫn đúng tới file authSlice bạn vừa tạo

export const store = configureStore({
  reducer: {
    tarot: tarotReducer, // Logic Tarot cũ
    auth: authReducer,   // Logic Auth mới (User, Token, Login...)
  },
  middleware: (getDefaultMiddleware: (arg0: { serializableCheck: boolean; }) => any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export types để dùng trong component
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;