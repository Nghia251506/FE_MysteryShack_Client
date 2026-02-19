"use client";

import React, { useState, useEffect, useRef } from "react";
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
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { fetchUserById, updateUserProfile } from "@/store/slices/userSlice";
// Import service Appwrite của ông
import { AppwriteService } from "@/appwrite.config";
import { fetchReaderRatings } from "@/store/slices/ratingSlice";

export default function ReaderProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const { user, loading } = useAppSelector((state: any) => state.user);
  const { stats: rStats } = useAppSelector((state: any) => state.rating);

  const [isEditing, setIsEditing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    location: "",
    birthDate: "",
    paymentQr: "",
    profilePicture: "",
  });

  // --- ĐỒNG BỘ DỮ LIỆU ---
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.username || "",
        bio: user.bio || "",
        location: user.address || "",
        birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
        paymentQr: user.QRCode || "", // Đây giờ sẽ là link URL từ Appwrite
        profilePicture: user.profilePicture || "",
      });
      setIsOnline(user.active ?? true);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      // Chỉ gọi khi có user ID để lấy sao trung bình và lượt đánh giá
      dispatch(fetchReaderRatings(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserById(user.id));
    }
  }, [dispatch]);

  // --- HÀM UPLOAD CHUNG (Dùng cho cả Avatar và QR) ---
  const handleFileUpload = async (file: File, type: "avatar" | "qr") => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ảnh quá nặng! Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    try {
      if (type === "avatar") setUploadingAvatar(true);
      else setUploadingQr(true);

      // Upload lên Appwrite và lấy URL trực tiếp
      const fileUrl = await AppwriteService.uploadFile(file);

      setFormData((prev) => ({
        ...prev,
        [type === "avatar" ? "profilePicture" : "paymentQr"]: fileUrl,
      }));

      toast.success(
        `Đã tải ${type === "avatar" ? "ảnh đại diện" : "mã QR"} lên!`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải ảnh lên Appwrite.");
    } finally {
      if (type === "avatar") setUploadingAvatar(false);
      else setUploadingQr(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    const payload = {
      fullName: formData.fullName,
      bio: formData.bio,
      address: formData.location,
      birthDate: formData.birthDate,
      qrCode: formData.paymentQr, // Lưu URL của QR vào DB
      active: isOnline,
      profilePicture: formData.profilePicture,
    };

    const resultAction = await dispatch(
      updateUserProfile({ id: user.id, userData: payload }),
    );

    if (updateUserProfile.fulfilled.match(resultAction)) {
      toast.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
    } else {
      toast.error("Lưu thất bại! Vui lòng thử lại.");
    }
  };

  const getExperienceTime = (createdAt: string) => {
    if (!createdAt) return "Mới tham gia";
    const start = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 365
      ? `${Math.floor(diffDays / 365)} Năm`
      : `${diffDays} Ngày`;
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
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-amber-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header Nav */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <button
            onClick={() => router.push("/readerdashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-xs tracking-widest transition-all group"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại trang tổng quan
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => isEditing && setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase transition-all ${isOnline ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"} ${isEditing ? "cursor-pointer" : "cursor-default"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              />
              {isOnline ? "Online" : "Offline"}
            </button>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                <Edit3 className="w-4 h-4 text-amber-500" /> Sửa hồ sơ
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-slate-400 text-sm font-bold"
                >
                  Hủy
                </button>
                <button
                  disabled={loading || uploadingAvatar || uploadingQr}
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-amber-600 text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-amber-900/20 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}{" "}
                  LƯU
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: AVATAR CARD */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#110c1d]/80 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl text-center">
              <div className="relative w-44 h-44 mx-auto mb-8 p-1.5 bg-gradient-to-tr from-amber-500 via-purple-500 to-blue-500 rounded-full group">
                <div className="w-full h-full rounded-full bg-[#0a0a0a] p-1 overflow-hidden relative">
                  {formData.profilePicture ? (
                    <Image
                      src={formData.profilePicture}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/10">
                      {formData.fullName.charAt(0)}
                    </div>
                  )}
                  {isEditing && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleFileUpload(e.target.files[0], "avatar")
                  }
                />
              </div>

              <div className="space-y-2">
                {isEditing ? (
                  <input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center text-xl font-black text-white w-full outline-none"
                    placeholder="Nhập tên..."
                  />
                ) : (
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    {formData.fullName}
                  </h2>
                )}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Professional Reader
                  </span>
                </div>
              </div>

              <div className="mt-10 space-y-4 text-left border-t border-white/5 pt-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <div className="truncate">
                    <p className="text-[9px] text-slate-500 font-black uppercase">
                      Email
                    </p>
                    <p className="text-sm">{user?.email}</p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <Calendar className="w-4 h-4 text-slate-500" />
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
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Trung bình sao */}
              <div className="bg-[#110c1d]/60 border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 backdrop-blur-md">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                <div>
                  {/* Nếu averageRatingMonth tồn tại thì hiện, không thì hiện 0.0 */}
                  <p className="text-2xl font-black text-white">
                    {rStats?.averageRatingMonth
                      ? Number(rStats.averageRatingMonth).toFixed(1)
                      : "0.0"}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Trung bình Sao
                  </p>
                </div>
              </div>

              {/* Thâm niên */}
              <div className="bg-[#110c1d]/60 border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 backdrop-blur-md">
                <Award className="w-6 h-6 text-purple-400" />
                <div>
                  {/* Gọi hàm tính ngày tháng từ ngày tạo acc của user */}
                  <p className="text-2xl font-black text-white">
                    {getExperienceTime(user?.createdAt)}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Thâm niên
                  </p>
                </div>
              </div>

              {/* Đánh giá mới */}
              <div className="bg-[#110c1d]/60 border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 backdrop-blur-md">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <div>
                  {/* Lấy tổng review trong tháng từ stats */}
                  <p className="text-2xl font-black text-white">
                    {rStats?.totalReviewsMonth || 0}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Đánh giá mới
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-[#110c1d]/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black uppercase italic tracking-wider">
                  Tiểu sử
                </h3>
              </div>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-slate-300 outline-none resize-none leading-relaxed"
                />
              ) : (
                <p className="text-slate-400 leading-relaxed italic text-lg whitespace-pre-line px-2">
                  {user?.bio || "Người này rất bí ẩn..."}
                </p>
              )}
            </div>

            {/* QR SECTION (ĐÃ THAY ĐỔI SANG APPWRITE UPLOAD) */}
            <div className="bg-[#110c1d]/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-green-500/10 rounded-2xl text-green-500 border border-green-500/20">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase">
                      QR Thanh Toán
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
                      Bank Transfer / Tip QR
                    </p>
                  </div>
                </div>
                {isEditing && (
                  <label className="cursor-pointer px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2">
                    {uploadingQr ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    Tải mã mới
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload(e.target.files[0], "qr")
                      }
                    />
                  </label>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="w-56 h-56 bg-black/60 rounded-[2.5rem] border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden shadow-inner group">
                  {formData.paymentQr ? (
                    <>
                      <img
                        src={formData.paymentQr}
                        alt="QR"
                        className="w-full h-full object-contain p-4"
                      />
                      {isEditing && (
                        <button
                          onClick={() =>
                            setFormData((p) => ({ ...p, paymentQr: "" }))
                          }
                          className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm transition-all"
                        >
                          <div className="bg-red-600 p-3 rounded-full">
                            <X className="w-6 h-6 text-white" />
                          </div>
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-[10px] font-black text-white/10 uppercase">
                      Chưa có mã QR
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <div className="p-6 bg-amber-500/5 rounded-[2rem] border border-amber-500/10 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                    <p className="text-xs text-slate-400 italic">
                      Lưu ý: Mã QR được tải lên hệ thống lưu trữ Appwrite để đảm
                      bảo tốc độ hiển thị nhanh nhất.
                    </p>
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
