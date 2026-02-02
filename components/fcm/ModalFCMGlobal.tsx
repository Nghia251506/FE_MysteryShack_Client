"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { closeFcmModal } from "@/store/slices/fcmSlice";
import { useRouter } from "next/navigation";
import { ReadingSessionService } from "@/services/readingSessionService";
import { toast } from "react-toastify";
import { Star } from "lucide-react";

export const ModalFCMGlobal = () => {
  const { isModalOpen, currentNotification } = useAppSelector(
    (state) => state.fcm,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // --- LOGIC XỬ LÝ TOAST RIÊNG CHO READER_MATCHED_SUCCESS ---
  useEffect(() => {
    if (isModalOpen && currentNotification) {
      const { type } = currentNotification;

      // Chỉ Toast, không hiện Modal cho type này
      if (type === "READER_MATCHED_SUCCESS") {
        toast.success(
          "✨ Đã tìm thấy Reader phù hợp! Đang chờ Reader xác nhận...",
        );
        dispatch(closeFcmModal()); // Đóng modal ngay lập tức để không render phần dưới
        return;
      }

      // Toast báo lỗi khi không tìm thấy ai
      if (type === "NO_READER_AVAILABLE") {
        toast.error(
          "😔 Hiện tại các Reader đều đang bận. Vui lòng thử lại sau!",
        );
        dispatch(closeFcmModal());
        return;
      }
    }
  }, [isModalOpen, currentNotification, dispatch]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isModalOpen && currentNotification?.type === "NEW_MATCH_REQUEST") {
      setCountdown(30);

      // 2. Bắt đầu phát nhạc lặp lại
      if (!audioRef.current) {
        audioRef.current = new Audio("/sounds/notification.mp3");
      }
      audioRef.current.onended = () => {
        if (audioRef.current) audioRef.current.play();
      };

      // 2. Kích hoạt phát nhạc
      audioRef.current.play().catch((e) => {
        console.warn("Chưa có tương tác người dùng, nhạc chưa thể kêu!");
      });

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            stopSound(); // Tắt nhạc khi hết giờ
            dispatch(closeFcmModal());
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup: Tắt nhạc khi Component bị unmount hoặc Modal đóng
    return () => {
      clearInterval(timer);
      stopSound();
    };
  }, [isModalOpen, currentNotification, dispatch]);

  // BE đã check Role rồi nên ở đây chỉ cần check xem có data không thôi
  if (!isModalOpen || !currentNotification) return null;
  const toastOnlyTypes = ["READER_MATCHED_SUCCESS", "NO_READER_AVAILABLE"];
  if (toastOnlyTypes.includes(currentNotification.type)) return null;

  const handleClose = () => {
    stopSound(); // Tắt nhạc khi đóng thủ công
    dispatch(closeFcmModal());
  };

  const renderContent = () => {
    // Khớp các biến từ Map.of của Spring Boot
    const { type, sessionId, customerName, message, ratingValue, comment } = currentNotification;

    switch (type) {
      // 1. READER: Nhận cuốc mới (Kiểu Grab)
      case "NEW_MATCH_REQUEST":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔮</span>
            </div>
            <h3 className="text-xl font-bold text-green-600">
              Yêu cầu xem bài mới!
            </h3>
            <div className="mt-3 text-gray-600">
              <p>
                Khách hàng:{" "}
                <span className="font-semibold text-black">{customerName}</span>
              </p>
            </div>
            <div className="mt-4 py-2 px-4 bg-orange-100 text-orange-700 rounded-full font-medium animate-pulse">
              Hết hạn sau: {countdown} giây
            </div>
            <button
              onClick={async () => {
                try {
                  stopSound(); // 3. Tắt nhạc NGAY KHI bấm chấp nhận
                  if (!sessionId) {
                    toast.error("Không có sessionId hợp lệ.");
                    return;
                  }
                  await ReadingSessionService.accept(sessionId);
                  toast.success("Đã chấp nhận yêu cầu!");
                  handleClose();
                  router.push(`/readerdashboard/workspace/${sessionId}`);
                } catch (error) {
                  console.error("Lỗi khi chấp nhận session:", error);
                  toast.error("Không thể chấp nhận yêu cầu.");
                  handleClose();
                }
              }}
              className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all"
            >
              CHẤP NHẬN NGAY
            </button>
            <button
              onClick={async () => {
                try {
                  stopSound(); // 3. Tắt nhạc NGAY KHI bấm chấp nhận
                  if (!sessionId) {
                    toast.error("Không có sessionId hợp lệ.");
                    return;
                  }
                  await ReadingSessionService.reject(sessionId);
                  toast.success("Đã từ chối yêu cầu!");
                  handleClose();
                } catch (error) {
                  console.error("Lỗi khi từ chối session:", error);
                  toast.error("Không thể từ chối yêu cầu.");
                  handleClose();
                }
              }}
              className="mt-6 w-full bg-red-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
            >
              TỪ CHỐI YÊU CẦU
            </button>
          </div>
        );

      // 2. CUSTOMER: Reader đã nhận bài
      case "READER_ACCEPTED":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-lg font-bold text-blue-600">
              Reader đã sẵn sàng!
            </h3>
            <p className="mt-2 text-gray-600">{message}</p>
            <button
              onClick={handleClose}
              className="mt-6 w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold"
            >
              Đóng
            </button>
          </div>
        );

      // 3. CUSTOMER: Reader từ chối
      case "READER_REJECTED":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⏳</span>
            </div>
            <h3 className="text-lg font-bold text-red-500">
              Đang tìm Reader khác
            </h3>
            <p className="mt-2 text-gray-600 text-sm">{message}</p>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        );

      // 4. CUSTOMER: Đã có kết quả luận giải
      case "READING_FINISHED":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-bounce">
              🧧
            </div>
            <h3 className="text-xl font-bold text-purple-600">
              Kết quả đã sẵn sàng!
            </h3>
            <p className="mt-2 text-gray-600">{message}</p>
            <button
              onClick={() => {
                handleClose();
                router.push(`/booking/result?sessionId=${sessionId}`);
              }}
              className="mt-6 w-full bg-purple-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200"
            >
              XEM LUẬN GIẢI NGAY
            </button>
          </div>
        );

      // 5. READER: Khách hàng báo đã chuyển tiền (Khớp type PAYMENT_SENT từ BE)
      case "PAYMENT_SENT":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-lg font-bold text-orange-600">
              Khách báo đã trả tiền!
            </h3>
            <p className="mt-2 text-gray-600">{message}</p>
            <button
              onClick={() => {
                handleClose();
                router.push(`/readerdashboard/workspace/${sessionId}`);
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
            <h3 className="text-lg font-bold text-green-600">
              Thanh toán hoàn tất!
            </h3>
            <p className="mt-2 text-gray-600">{message}</p>
            <button
              onClick={() => {
                handleClose();
                router.push(`/booking/result?sessionId=${sessionId}`);
              }}
              className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl font-bold"
            >
              MỞ KHÓA BÀI LUẬN
            </button>
          </div>
        );
      case "NEW_RATING":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-200">
              <span className="text-4xl">🌟</span>
            </div>
            <h3 className="text-xl font-bold text-amber-600">
              Phản hồi từ khách hàng!
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Khách hàng:{" "}
              <span className="font-medium text-gray-700">
                {customerName || "Ẩn danh"}
              </span>
            </p>

            {/* Hiển thị số sao */}
            <div className="mt-4 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={`${s <= (Number(ratingValue) || 0) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>

            {/* Hiển thị lời nhắn */}
            <div className="mt-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-100 relative">
              <div className="absolute -top-2 left-4 bg-white px-2 text-[10px] text-amber-500 font-bold uppercase">
                Nhận xét
              </div>
              <p className="text-gray-600 italic text-sm leading-relaxed">
                "
                {comment ||
                  "Khách hàng này đã để lại đánh giá tuyệt vời mà không cần lời nói!"}
                "
              </p>
            </div>

            <button
              onClick={handleClose}
              className="mt-6 w-full bg-amber-500 text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 uppercase"
            >
              Tiếp tục tỏa sáng
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <h3 className="text-lg font-bold">Thông báo mới</h3>
            <p className="mt-2 text-gray-600">
              {message || "Bạn có một cập nhật mới từ hệ thống"}
            </p>
            <button
              onClick={handleClose}
              className="mt-6 w-full bg-gray-100 py-3 rounded-xl"
            >
              Đóng
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full relative border border-gray-100 animate-in fade-in zoom-in duration-300">
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
