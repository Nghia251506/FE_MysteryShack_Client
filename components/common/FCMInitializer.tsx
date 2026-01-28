"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebaseConfig";
import { registerFcmToken } from "@/store/slices/fcmSlice";
import { RootState } from "@/store/store";
import { toast } from 'react-toastify';

export default function FCMInitializer() {
    const dispatch = useDispatch<any>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { isRegistered } = useSelector((state: RootState) => state.fcm);

    useEffect(() => {
        const setupFCM = async () => {
            // 1. Chỉ chạy khi có User, chưa đăng ký Token và Messaging đã sẵn sàng
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
                    } else {
                        console.warn("Quyền thông báo bị từ chối.");
                    }
                } catch (error) {
                    console.error("FCM Setup Error:", error);
                }
            }
        };

        setupFCM();
    }, [user?.id, isRegistered, dispatch]);

    useEffect(() => {
        // 2. Tách logic lắng nghe tin nhắn (Foreground) ra để đảm bảo nó luôn trực chiến
        if (messaging) {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log("Message received: ", payload);

                // Hiển thị Toast tùy chỉnh đẹp hơn
                toast.info(
                    <div>
                        <b style={{ display: 'block' }}>{payload.notification?.title}</b>
                        <span>{payload.notification?.body}</span>
                    </div>, 
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        // icon: "🔮"
                    }
                );
            });
            return () => unsubscribe();
        }
    }, []); // Chỉ đăng ký lắng nghe 1 lần duy nhất khi component mount

    return null;
}