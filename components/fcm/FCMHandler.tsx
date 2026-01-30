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

        // Lắng nghe tin nhắn khi App đang mở (Foreground)
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Nhận tin nhắn Foreground:", payload);
            
            // 1. Phát âm thanh Ting Ting
            const audio = new Audio("/sounds/notification.mp3"); // Ông nhớ bỏ file sound vào public nhé
            audio.play().catch(e => console.log("Chưa tương tác trang nên ko tự phát âm thanh được"));

            // 2. Dispatch vào Redux để Modal mở ra
            // Lưu ý: BE mình gửi data message nên lấy payload.data
            dispatch(receiveNotification(payload.data));
        });

        return () => unsubscribe();
    }, [dispatch]);

    return null; // Component này không hiển thị gì cả
};