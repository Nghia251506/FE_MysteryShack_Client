import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';

interface UserState {
  matchedReader: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  matchedReader: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMatchedReader: (state, action: PayloadAction<User | null>) => {
      state.matchedReader = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setMatchedReader, setLoading } = userSlice.actions;
export default userSlice.reducer;