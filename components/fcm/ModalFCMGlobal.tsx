"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { closeFcmModal } from "@/store/slices/fcmSlice";
import { useRouter } from "next/navigation";

export const ModalFCMGlobal = () => {
    const { isModalOpen, currentNotification } = useAppSelector((state) => state.fcm);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isModalOpen && currentNotification?.type === "NEW_MATCH_REQUEST") {
            setCountdown(30);
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        dispatch(closeFcmModal());
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isModalOpen, currentNotification, dispatch]);

    if (!isModalOpen || !currentNotification) return null;

    const handleClose = () => dispatch(closeFcmModal());

    const renderContent = () => {
        const { type, sessionId, customerName, customerRating, readerName, message } = currentNotification;

        switch (type) {
            // 1. READER: Nhận cuốc mới (Kiểu Grab)
            case "NEW_MATCH_REQUEST":
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">🔮</span>
                        </div>
                        <h3 className="text-xl font-bold text-green-600">Yêu cầu xem bài mới!</h3>
                        <div className="mt-3 text-gray-600">
                            <p>Khách hàng: <span className="font-semibold text-black">{customerName}</span></p>
                            <p>Đánh giá: <span className="text-yellow-500 font-bold">⭐ {customerRating}</span></p>
                        </div>
                        <div className="mt-4 py-2 px-4 bg-orange-100 text-orange-700 rounded-full font-medium animate-pulse">
                            Hết hạn sau: {countdown} giây
                        </div>
                        <button 
                            onClick={() => {
                                router.push(`/reader/session/${sessionId}`);
                                handleClose();
                            }}
                            className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all"
                        >
                            CHẤP NHẬN NGAY
                        </button>
                    </div>
                );

            // 2. CUSTOMER: Reader đã nhận bài và đang xem
            case "READER_ACCEPTED":
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h3 className="text-lg font-bold text-blue-600">Reader đã sẵn sàng!</h3>
                        <p className="mt-2 text-gray-600">{readerName} đã bắt đầu trải bài cho bạn. Vui lòng giữ kết nối.</p>
                        <button onClick={handleClose} className="mt-6 w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold">Đóng</button>
                    </div>
                );

            // 3. CUSTOMER: Reader từ chối (Hệ thống tìm người khác)
            case "READER_REJECTED":
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⏳</span>
                        </div>
                        <h3 className="text-lg font-bold text-red-500">Đang tìm Reader khác</h3>
                        <p className="mt-2 text-gray-600 text-sm">{message}</p>
                        <div className="mt-4 flex justify-center"><div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>
                    </div>
                );

            // 4. CUSTOMER: Đã có kết quả luận giải (Yêu cầu thanh toán để xem hết)
            case "READING_FINISHED":
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-bounce">🧧</div>
                        <h3 className="text-xl font-bold text-purple-600">Kết quả đã sẵn sàng!</h3>
                        <p className="mt-2 text-gray-600">{message}</p>
                        <button 
                            onClick={() => {
                                router.push(`/booking/result?sessionId=${sessionId}`);
                                handleClose();
                            }}
                            className="mt-6 w-full bg-purple-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200"
                        >
                            XEM LUẬN GIẢI NGAY
                        </button>
                    </div>
                );

            // 5. READER: Khách hàng báo đã chuyển tiền
            case "PAYMENT_NOTIFICATION":
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">💰</span>
                        </div>
                        <h3 className="text-lg font-bold text-orange-600">Khách báo đã trả tiền!</h3>
                        <p className="mt-2 text-gray-600">{message}</p>
                        <button 
                            onClick={() => {
                                router.push(`/readerdashboard/workspace/${sessionId}`);
                                handleClose();
                            }}
                            className="mt-6 w-full bg-orange-500 text-white py-3 rounded-xl font-bold"
                        >
                            KIỂM TRA & XÁC NHẬN
                        </button>
                    </div>
                );

            // 6. CUSTOMER: Reader xác nhận đã nhận tiền (Unlock)
            case "PAYMENT_CONFIRMED":
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✨</span>
                        </div>
                        <h3 className="text-lg font-bold text-green-600">Thanh toán hoàn tất!</h3>
                        <p className="mt-2 text-gray-600">{message}</p>
                        <button 
                            onClick={() => {
                                router.push(`/booking/result?sessionId=${sessionId}`);
                                handleClose();
                            }}
                            className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl font-bold"
                        >
                            MỞ KHÓA BÀI LUẬN
                        </button>
                    </div>
                );

            default:
                return (
                    <div className="text-center">
                        <h3 className="text-lg font-bold">Thông báo</h3>
                        <p className="mt-2 text-gray-600">{message || "Bạn có thông báo mới"}</p>
                        <button onClick={handleClose} className="mt-6 w-full bg-gray-100 py-3 rounded-xl">Đóng</button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full relative mx-4 border border-gray-100">
                <button 
                    onClick={handleClose}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                >
                    ✕
                </button>
                {renderContent()}
            </div>
        </div>
    );
};