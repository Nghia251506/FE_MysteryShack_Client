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

interface FcmNotificationPayload {
    type: string;           // NEW_MATCH_REQUEST, READING_FINISHED, v.v.
    sessionId?: string;     // ID của phiên Tarot
    customerName?: string;  // Tên khách hàng
    customerRating?: number; // Đánh giá của khách
    message?: string;       // Nội dung hiển thị thêm
    [key: string]: any;     // Các field linh động khác từ Backend
    ratingValue?: number; 
    comment?: string;
}

interface FcmState {
    token: string | null;
    isRegistered: boolean;
    loading: boolean;
    currentNotification: FcmNotificationPayload | null; // Lưu data từ BE gửi về (sessionId, type...)
    isModalOpen: boolean;
}

const initialState: FcmState = {
    token: null,
    isRegistered: false,
    loading: false,
    currentNotification: null,
    isModalOpen: false,
};

const fcmSlice = createSlice({
    name: "fcm",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        // Action này để Layout gọi khi nhận được onMessage (Foreground)
        receiveNotification: (state, action) => {
            state.currentNotification = action.payload;
            state.isModalOpen = true; // Kích hoạt bật Popup toàn cục
        },
        closeFcmModal: (state) => {
            state.isModalOpen = false;
            state.currentNotification = null;
        },
        resetFcmState: (state) => {
            state.token = null;
            state.isRegistered = false;
            state.isModalOpen = false;
            state.currentNotification = null;
        }
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

export const { setToken, receiveNotification, closeFcmModal } = fcmSlice.actions;
export default fcmSlice.reducer;