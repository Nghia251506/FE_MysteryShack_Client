import { configureStore } from '@reduxjs/toolkit';
import tarotReducer from './slices/tarotSlice';

export const store = configureStore({
  reducer: {
    tarot: tarotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;