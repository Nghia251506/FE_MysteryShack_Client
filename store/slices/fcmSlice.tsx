import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fcmService } from "../../services/FcmService";
import { FcmTokenRequest } from "../../types/fcm";

export const registerFcmToken = createAsyncThunk(
    "fcm/register",
    async (data: FcmTokenRequest, { rejectWithValue }) => {
        try {
            return await fcmService.registerToken(data);
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

interface FcmState {
    token: string | null;
    isRegistered: boolean;
    loading: boolean;
}

const initialState: FcmState = {
    token: null,
    isRegistered: false,
    loading: false,
};

const fcmSlice = createSlice({
    name: "fcm",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerFcmToken.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerFcmToken.fulfilled, (state) => {
                state.loading = false;
                state.isRegistered = true;
            })
            .addCase(registerFcmToken.rejected, (state) => {
                state.loading = false;
                state.isRegistered = false;
            });
    },
});

export const { setToken } = fcmSlice.actions;
export default fcmSlice.reducer;