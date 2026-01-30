"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebaseConfig";
import { registerFcmToken, receiveNotification } from "@/store/slices/fcmSlice"; // Import thêm action mới
import { RootState } from "@/store/store";
import { toast } from 'react-toastify';

export default function FCMInitializer() {
    const dispatch = useDispatch<any>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { isRegistered } = useSelector((state: RootState) => state.fcm);

    // 1. Logic đăng ký Token (Giữ nguyên - rất tốt)
    useEffect(() => {
        const setupFCM = async () => {
            if (user?.id && !isRegistered && messaging) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        const token = await getToken(messaging, {
                            vapidKey: "BBTUhjveP6qB3Hi5Tucv53td40FymzdGJ8TSvpcOPI9Wnu2ecwvx_X5uZ3IHTTby_kA3Sq4yNHF_kqDgUisxks4"
                        });

                        if (token) {
                            console.log("FCM Token registered:", token);
                            dispatch(registerFcmToken({ userId: user.id, token }));
                        }
                    }
                } catch (error) {
                    console.error("FCM Setup Error:", error);
                }
            }
        };
        setupFCM();
    }, [user?.id, isRegistered, dispatch]);

    // 2. Logic lắng nghe tin nhắn (Foreground) - ĐỘ LẠI CHỖ NÀY
    useEffect(() => {
        if (messaging) {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log("Message received: ", payload);

                // --- PHÁT ÂM THANH ---
                const audio = new Audio("/sounds/notification.mp3");
                audio.play().catch(() => {});

                // --- LOGIC PHÂN LOẠI HIỂN THỊ ---
                // Nếu BE gửi data message (có type), ta ưu tiên dùng Popup Global
                if (payload.data && payload.data.type) {
                    dispatch(receiveNotification(payload.data));
                } 
                // Nếu là thông báo bình thường không có type, thì hiện Toast như cũ
                else {
                    toast.info(
                        <div>
                            <b>{payload.notification?.title}</b>
                            <p>{payload.notification?.body}</p>
                        </div>
                    );
                }
            });
            return () => unsubscribe();
        }
    }, [dispatch]); // Thêm dispatch vào dependency

    return null;
}