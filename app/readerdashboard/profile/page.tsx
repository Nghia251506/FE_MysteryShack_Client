"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Star,
  ShieldCheck,
  Edit3,
  Save,
  Camera,
  Award,
  Zap,
  MessageSquare,
  Power,
  QrCode,
  UploadCloud,
  X,
  Mail,
  Sparkles,
  LayoutDashboard,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// --- CHECK LẠI ĐƯỜNG DẪN NÀY CHO ĐÚNG PROJECT CỦA ÔNG ---
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { updateUserProfile } from "@/store/slices/userSlice";
import imageCompression from "browser-image-compression";

// --- INTERFACE LOCAL CHO READER ---
interface ReaderUser {
  id: number;
  email: string;
  fullName?: string;
  username?: string;
  role: string;
  profilePicture?: string;
  bio?: string;
  address?: string;
  birthDate?: string;
  qrCode?: string;
  rating?: number;
  totalSessions?: number;
  experienceYears?: number;
  active?: boolean;
}

export default function ReaderProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Lấy data từ store (UserSlice)
  const { user, loading } = useAppSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [preview, setPreview] = useState<string>("");

  // --- STATE FORM ---
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    location: "",
    birthDate: "",
    paymentQr: "",
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Ép kiểu về string và đảm bảo không có khoảng trắng thừa
        const base64String = (reader.result as string).trim();
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // --- ĐỒNG BỘ DỮ LIỆU ---
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.username || "",
        bio: user.bio || "",
        location: user.address || "",
        birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
        paymentQr: user.qrCode || "",
      });
      setIsOnline(user.active ?? true);
    }
  }, [user]);

  // --- HÀM XÀO NẤU BASE64 ---
  const handleQrUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Tạo URL tạm để hiển thị preview cho sướng mắt trước
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const reader = new FileReader();
    // Đọc dưới dạng DataURL nhưng sẽ làm sạch nó
    reader.readAsDataURL(file);

    reader.onload = () => {
      let base64 = reader.result as string;

      // BƯỚC QUAN TRỌNG: Làm sạch chuỗi
      // Loại bỏ mọi ký tự xuống dòng, khoảng trắng mà trình duyệt tự thêm vào
      base64 = base64.replace(/\s/g, "");

      setFormData((prev) => ({ ...prev, paymentQr: base64 }));
    };
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    // Lấy giá trị QR hiện tại từ state
    const currentQr = formData.paymentQr;

    const payload = {
      fullName: formData.fullName,
      bio: formData.bio,
      address: formData.location,
      birthDate: formData.birthDate,
      qrCode: currentQr, // Bắn thẳng cái chuỗi sạch này lên
      active: isOnline,
    };

    // Dispatch action
    const resultAction = await dispatch(
      updateUserProfile({
        id: user.id,
        userData: payload,
      }),
    );

    if (updateUserProfile.fulfilled.match(resultAction)) {
      toast.success("Cập nhật thành công!");
      setIsEditing(false);
    } else {
      toast.error("Lưu thất bại! Check lại dung lượng ảnh.");
    }
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật";
    const [y, m, d] = dateString.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-slate-200 font-sans relative pb-20 overflow-x-hidden"
    >
      {/* --- DECOR BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-ping" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* NAV & ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <button
            onClick={() => router.push("/readerdashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-sm transition-all group"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-amber-500/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            DASHBOARD
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-tighter transition-all ${isOnline ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              />
              {isOnline ? "Đang trực tuyến" : "Ngoại tuyến"}
            </button>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold transition-all shadow-xl"
              >
                <Edit3 className="w-4 h-4 text-amber-500" /> Sửa hồ sơ
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-slate-400 text-sm font-bold hover:text-white transition-colors"
                >
                  Hủy
                </button>
                <button
                  disabled={loading}
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  LƯU THAY ĐỔI
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: AVATAR CARD */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              layout
              className="bg-[#110c1d]/80 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-20 h-20" />
              </div>

              <div className="relative w-44 h-44 mx-auto mb-8">
                <div className="w-full h-full rounded-full p-1.5 bg-gradient-to-tr from-amber-500 via-purple-500 to-blue-500 animate-spin-slow">
                  <div className="w-full h-full rounded-full bg-[#0a0a0a] p-1">
                    <div className="w-full h-full rounded-full relative overflow-hidden">
                      {user?.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/10">
                          {formData.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-3 bg-amber-500 rounded-full text-black hover:scale-110 transition-transform shadow-2xl">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="text-center space-y-2">
                {isEditing ? (
                  <input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="bg-white/5 border-b-2 border-amber-500/50 text-white text-2xl font-bold text-center w-full focus:outline-none focus:border-amber-500 transition-all"
                  />
                ) : (
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    {formData.fullName}
                  </h2>
                )}
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Professional Reader
                  </span>
                </div>
              </div>

              <div className="mt-12 space-y-4 pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[1.5rem] border border-white/5">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div className="truncate">
                    <p className="text-[9px] text-slate-500 font-black uppercase">
                      Email
                    </p>
                    <p className="text-sm">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[1.5rem] border border-white/5">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <div className="w-full">
                    <p className="text-[9px] text-slate-500 font-black uppercase">
                      Ngày sinh
                    </p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthDate: e.target.value,
                          })
                        }
                        className="bg-transparent text-sm text-white w-full outline-none [color-scheme:dark]"
                      />
                    ) : (
                      <p className="text-sm">
                        {formatDateDisplay(formData.birthDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: BIO & QR */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Rating",
                  val: user?.rating || 0,
                  icon: Star,
                  color: "text-amber-400",
                },
                {
                  label: "Sessions",
                  val: user?.totalSessions || 0,
                  icon: MessageSquare,
                  color: "text-blue-400",
                },
                {
                  label: "Experience",
                  val: (user?.experienceYears || 0) + " Yrs",
                  icon: Award,
                  color: "text-purple-400",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-[#110c1d]/60 border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 backdrop-blur-md"
                >
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                  <div>
                    <p className="text-2xl font-black text-white">{s.val}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bio Card */}
            <div className="bg-[#110c1d]/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
              <div className="flex items-center gap-3 mb-8">
                <LayoutDashboard className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-black uppercase tracking-tight">
                  Tiểu sử & Chuyên môn
                </h3>
              </div>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full h-44 bg-black/40 border border-white/10 rounded-[2rem] p-6 text-slate-300 focus:border-amber-500/50 outline-none resize-none leading-relaxed shadow-inner"
                  placeholder="Viết gì đó thật 'deep' về khả năng tarot của bạn..."
                />
              ) : (
                <p className="text-slate-400 leading-relaxed italic text-lg whitespace-pre-line px-2">
                  {formData.bio ||
                    "Người này rất bí ẩn, chưa để lại lời giới thiệu nào..."}
                </p>
              )}
            </div>

            {/* QR Card */}
            <div className="bg-[#110c1d]/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-green-500/10 rounded-2xl text-green-500 border border-green-500/20">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      QR Thanh Toán
                    </h3>
                    <p className="text-xs text-slate-500 font-bold">
                      Dùng để nhận Tip sau khi xem bài
                    </p>
                  </div>
                </div>
                {isEditing && (
                  <label className="cursor-pointer px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" /> Tải ảnh mới
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleQrUpload}
                    />
                  </label>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="w-60 h-60 bg-black/60 rounded-[2.5rem] border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group shadow-inner">
                  {formData.paymentQr ? (
                    <>
                      <img
                        src={user?.qrCode?.startsWith("data:image")
                          ? user.qrCode
                          : `data:image/png;base64,${formData.paymentQr}`}
                        alt="Payment QR"
                        className="w-full h-full object-contain p-4"
                      />
                      {isEditing && (
                        <button
                          onClick={() =>
                            setFormData((p) => ({ ...p, paymentQr: "" }))
                          }
                          className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                        >
                          <div className="bg-red-600 p-3 rounded-full text-white shadow-xl">
                            <X className="w-6 h-6" />
                          </div>
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center space-y-2 opacity-20">
                      <QrCode className="w-12 h-12 mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-tighter">
                        Trống
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-6">
                  <div className="p-6 bg-amber-500/5 rounded-[2rem] border border-amber-500/10 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      Mã QR này sẽ hiển thị ở cuối bản luận giải. Khách hàng có
                      thể quét để cảm ơn bạn. Hãy chọn ảnh QR ngân hàng rõ nét
                      nhất.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-amber-500 transition-all duration-1000 ${formData.paymentQr ? "w-full" : "w-0"}`}
                      />
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-green-500 transition-all duration-1000 ${isOnline ? "w-full" : "w-0"}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
