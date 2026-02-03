"use client";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebaseConfig";
import { useAppDispatch } from "@/hooks/useAppRedux";
import { receiveNotification } from "@/store/slices/fcmSlice";

export const FCMHandler = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Nhận tin nhắn Foreground:", payload);
        
        // 1. Xác định loại thông báo từ Data BE gửi về
        // Giả sử BE gửi field 'status' hoặc 'type' trong data
        const notifyType = payload.data?.type; // Vd: "NEW_REQUEST", "COMPLETED", "REJECTED"

        // 2. Chọn âm thanh tương ứng
        let soundFile = "/sounds/notification.mp3"; // Mặc định

        switch (notifyType) {
            case "READING_FINISHED":
                soundFile = "/sounds/success_ding.mp3";
                break;
            case "PAYMENT_SENT":
                soundFile = "/sounds/tingting.mp3";
                break;
            default:
                soundFile = "/sounds/notification.mp3";
        }

        // 3. Phát âm thanh
        const audio = new Audio(soundFile);
        audio.play().catch(e => console.log("Browser chặn auto-play, cần tương tác trước"));

        // 4. Dispatch vào Redux
        dispatch(receiveNotification(payload.data));
    });

    return () => unsubscribe();
}, [dispatch, messaging]);

    return null; // Component này không hiển thị gì cả
};