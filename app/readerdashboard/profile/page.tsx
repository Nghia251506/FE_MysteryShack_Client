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
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { updateUserProfile } from "@/store/slices/userSlice";

export default function ReaderProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // 1. Lấy data từ User (Profile) và Rating (Stats thực tế)
  const { user, loading } = useAppSelector((state: any) => state.user);
  const { stats: rStats } = useAppSelector((state: any) => state.rating); // Lấy stats từ slice rating

  const [isEditing, setIsEditing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // --- STATE FORM ---
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    location: "",
    birthDate: "",
    paymentQr: "",
  });

  const getExperienceTime = (createdAt: string) => {
    if (!createdAt) return "Mới tham gia";

    const start = new Date(createdAt);
    const now = new Date();

    // Tính tổng số ngày chênh lệch
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Nếu được từ 365 ngày trở lên thì tính theo năm
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      return `${years} Năm`;
    }

    // Nếu dưới 1 năm thì hiện số ngày
    return `${diffDays} Ngày`;
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

  // --- HÀM XỬ LÝ QR ---
  const handleQrUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let base64 = (reader.result as string).replace(/\s/g, "");
      setFormData((prev) => ({ ...prev, paymentQr: base64 }));
    };
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    const payload = {
      fullName: formData.fullName,
      bio: formData.bio,
      address: formData.location,
      birthDate: formData.birthDate,
      qrCode: formData.paymentQr,
      active: isOnline,
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
      {/* DECOR BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-amber-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* TOP NAV */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <button
            onClick={() => router.push("/readerdashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-xs tracking-widest transition-all group"
          >
            <ArrowLeft className="w-4 h-4" /> DASHBOARD
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase transition-all ${isOnline ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}
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
                  disabled={loading}
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-amber-600 text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-amber-900/20"
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
              <div className="relative w-44 h-44 mx-auto mb-8 p-1.5 bg-gradient-to-tr from-amber-500 via-purple-500 to-blue-500 rounded-full">
                <div className="w-full h-full rounded-full bg-[#0a0a0a] p-1 overflow-hidden relative">
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

              <h2 className="text-3xl font-black text-white tracking-tight">
                {formData.fullName}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Professional Reader
                </span>
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
            {/* STATS SECTION - Ghép Rating chuẩn từ Redux */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#110c1d]/60 border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 backdrop-blur-md">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                <div>
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

              <div className="bg-[#110c1d]/60 border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 backdrop-blur-md">
                <Award className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="text-2xl font-black text-white">
                    {getExperienceTime(user?.createdAt)}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Thâm niên Reader
                  </p>
                </div>
              </div>

              <div className="bg-[#110c1d]/60 border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 backdrop-blur-md">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-2xl font-black text-white">
                    {rStats?.totalReviewsMonth || 0}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Đánh giá mới
                  </p>
                </div>
              </div>
            </div>

            {/* BIO SECTION - Lấy trực tiếp từ user.bio */}
            <div className="bg-[#110c1d]/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black uppercase italic tracking-wider">
                  Tiểu sử & Năng lực
                </h3>
              </div>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-slate-300 outline-none focus:border-amber-500/50 resize-none leading-relaxed"
                  placeholder="Giới thiệu khả năng của bạn..."
                />
              ) : (
                <p className="text-slate-400 leading-relaxed italic text-lg whitespace-pre-line px-2">
                  {user?.bio ||
                    "Người này rất bí ẩn, chưa để lại lời giới thiệu nào..."}
                </p>
              )}
            </div>

            {/* QR SECTION */}
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
                    <UploadCloud className="w-4 h-4" /> Tải mã mới
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
                <div className="w-56 h-56 bg-black/60 rounded-[2.5rem] border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden shadow-inner group">
                  {formData.paymentQr ? (
                    <>
                      <img
                        src={
                          formData.paymentQr.startsWith("data:image")
                            ? formData.paymentQr
                            : `data:image/png;base64,${formData.paymentQr}`
                        }
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
                      Mã QR này dùng để khách hàng Tip/Thanh toán sau mỗi phiên
                      luận giải. Hãy đảm bảo ảnh QR rõ nét để không làm gián
                      đoạn dòng tiền của bạn.
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
