"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { closeFcmModal } from "@/store/slices/fcmSlice";
import { useRouter } from "next/navigation";
import { ReadingSessionService } from "@/services/readingSessionService";
import { toast } from "react-toastify";
import { Bell, Star } from "lucide-react";

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

        return;
      }

      // Toast báo lỗi khi không tìm thấy ai
      if (type === "SEARCHING_READER") {
        toast.warning(
          "😔 Hiện tại các Reader đều đang bận. Vui lòng chờ cho đến khi hệ thống tìm được Reader phù hợp với bạn!",
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
  const toastOnlyTypes = ["SEARCHING_READER"];
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
                window.location.reload();
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
      case "READER_ACCOUNT_BLOCKED":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
              <span className="text-4xl">⚖️</span>
            </div>
            <h3 className="text-xl font-bold text-red-600 tracking-tight">
              Kết nối tạm gián đoạn
            </h3>

            <div className="mt-4 bg-red-50/50 p-5 rounded-2xl border border-red-100 relative text-left">
              <div className="absolute -top-2 left-4 bg-white px-2 text-[10px] text-red-500 font-bold uppercase">
                Thông điệp từ hệ thống
              </div>
              <p className="text-gray-700 text-sm leading-relaxed italic">
                "Năng lượng của bạn hiện đang được tạm giữ để cân bằng lại. Cánh cửa nhận khách tạm thời đóng để Admin giải quyết các khiếu nại hoặc kiểm tra định kỳ."
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <p className="text-xs text-slate-500 px-2">
                Vui lòng kiên nhẫn đợi Admin phản hồi phán quyết cuối cùng. Khi mọi thứ sáng tỏ, bạn sẽ tiếp tục hành trình dẫn lối.
              </p>

              <button
                onClick={handleClose}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase"
              >
                Đã ghi nhận
              </button>
            </div>
          </div>
        );
      // 1. THÔNG BÁO BẢO TRÌ (MAINTENANCE)
      case "MAINTENANCE":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-sm border border-amber-200">
              <span className="text-4xl">🛠️</span>
            </div>
            <h3 className="text-xl font-black text-amber-700 uppercase tracking-tighter">
              Hệ thống bảo trì
            </h3>
            <div className="mt-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                {message || "Chúng tôi đang nâng cấp hệ thống để mang lại trải nghiệm tốt hơn. Vui lòng quay lại sau ít phút!"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-black transition-all"
            >
              ĐÃ HIỂU
            </button>
          </div>
        );

      // 2. TÀI KHOẢN BỊ KHÓA (ACCOUNT_BLOCKED)
      case "ACCOUNT_BLOCKED":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
              <span className="text-4xl">🚫</span>
            </div>
            <h3 className="text-xl font-bold text-red-600">Truy cập bị từ chối</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Security Alert</p>

            <div className="mt-4 bg-red-50 p-4 rounded-2xl border border-red-100 text-left">
              <p className="text-red-800 text-sm leading-relaxed italic">
                "{message || "Tài khoản của bạn tạm thời bị khóa do vi phạm chính sách cộng đồng hoặc phát hiện hoạt động bất thường."}"
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  handleClose();
                  router.push("/support"); // Link tới trang hỗ trợ nếu có
                }}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
              >
                LIÊN HỆ HỖ TRỢ
              </button>
              <button onClick={handleClose} className="text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors">
                Đóng
              </button>
            </div>
          </div>
        );

      // 3. KHUYẾN MÃI / SỰ KIỆN (PROMOTION)
      case "PROMOTION":
        return (
          <div className="text-center relative overflow-hidden">
            {/* Decor một chút cho giống app xịn */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl" />

            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-100 -rotate-6">
              <span className="text-5xl">🎁</span>
            </div>

            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
              Ưu Đãi Đặc Biệt!
            </h3>

            <p className="mt-3 text-slate-600 font-medium px-2">
              {message || "Bạn nhận được một món quà bất ngờ từ hệ thống. Khám phá ngay!"}
            </p>

            <button
              onClick={() => {
                handleClose();
                if (currentNotification.link) router.push(currentNotification.link);
              }}
              className="mt-8 w-full bg-emerald-500 text-white py-4 rounded-2xl font-black tracking-wider shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-1 transition-all"
            >
              NHẬN QUÀ NGAY 🚀
            </button>

            <button
              onClick={handleClose}
              className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-emerald-500 transition-colors"
            >
              Để sau nhé
            </button>
          </div>
        );

      case "READER_MATCHED_SUCCESS":
        return (
          <div className="text-center p-2">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
              <span className="text-4xl">🔮</span>
            </div>

            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
              Đã Tìm Thấy Reader!
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Hệ thống đã kết nối thành công với một Reader phù hợp với tần số năng lượng của bạn.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleClose(); // Đóng modal
                  router.push("/booking"); // Bay về trang booking
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all"
              >
                KẾT NỐI NGAY
              </button>

              <button
                onClick={handleClose}
                className="text-slate-400 text-xs font-medium hover:text-slate-600 transition-colors uppercase tracking-widest"
              >
                Để sau
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            {/* Icon mặc định cho các thông báo không xác định */}
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Bell size={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              Thông báo mới
            </h3>

            <p className="mt-3 text-slate-500 text-sm leading-relaxed px-2">
              {message || "Bạn có một cập nhật mới từ hệ thống. Vui lòng kiểm tra để không bỏ lỡ thông tin quan trọng."}
            </p>

            <button
              onClick={handleClose}
              className="mt-8 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all uppercase text-xs tracking-widest"
            >
              Đã ghi nhận
            </button>

            {/* Thêm một lựa chọn nhỏ bên dưới nếu cần */}
            <p className="mt-4 text-[10px] text-slate-300 uppercase tracking-tighter">
              System Notification
            </p>
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
