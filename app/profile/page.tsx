"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar, Mail, LogOut, Loader2, ArrowRight, ChevronLeft,
  ChevronRight, History as HistoryIcon, Edit3, Camera, Check, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/features/authSlice";
import { fetchAllMyHistories } from "@/store/slices/historySlice";
import { updateCustomerProfile } from "@/store/slices/userSlice"; 
import { AppwriteService } from "@/appwrite.config"; 
import { LogoutModal } from "@/components/LogoutModal";
import SocialFloating from "@/components/SocialFloating";
import Header from "@/components/Header";
import { AuthService } from "@/services/authService";
import { toast } from "sonner";
import Footer from "@/components/Footer";

export default function UserProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Dữ liệu từ Redux
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    allHistories, 
    loading: allLoading,
    totalPages,
    currentPage,
    totalElements 
  } = useSelector((state: RootState) => state.history);

  const [isMounted, setIsMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- STATE CHỈNH SỬA THÔNG TIN ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    birthDate: "",
    profilePicture: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Load dữ liệu lần đầu
  useEffect(() => {
    setIsMounted(true);
    if (user) {
      // Gọi lịch sử trải bài trang đầu tiên
      dispatch(fetchAllMyHistories({ page: 0, size: 6 }));
      
      // Đồng bộ dữ liệu User vào Form Edit
      setEditForm({
        fullName: user.fullName || "",
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : "",
        profilePicture: user.profilePicture || ""
      });
    }
  }, [dispatch, user]);

  // Xử lý phân trang
  const handlePageChange = (newPage: number) => {
    dispatch(fetchAllMyHistories({ page: newPage, size: 6 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- XỬ LÝ UPLOAD ẢNH LÊN APPWRITE ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng và dung lượng (Dưới 5MB)
    if (!file.type.startsWith('image/')) {
        toast.error("Vui lòng chọn định dạng hình ảnh!");
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB");
      return;
    }

    setIsUploadingImage(true);
    const toastId = toast.loading("Đang tải ảnh lên hệ thống...");

    try {
      // 1. Upload lên Appwrite
      const uploadedUrl = await AppwriteService.uploadFile(file);
      
      // 2. Cập nhật link vào form tạm
      setEditForm(prev => ({ ...prev, profilePicture: uploadedUrl }));
      
      toast.success("Tải ảnh thành công!", { id: toastId });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Lỗi khi tải ảnh lên Appwrite", { id: toastId });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // --- XỬ LÝ LƯU THÔNG TIN VỀ BACKEND ---
  const handleSaveProfile = async () => {
    if (!editForm.fullName.trim()) {
      toast.error("Họ tên không được để trống");
      return;
    }

    setIsUpdating(true);
    try {
      // Gọi Thunk update hồ sơ Customer (đã có logic cập nhật LocalStorage trong Slice)
      await dispatch(updateCustomerProfile(editForm as any)).unwrap();
      
      setIsEditing(false);
      toast.success("Hồ sơ của bạn đã được cập nhật!");
    } catch (error: any) {
      toast.error(error || "Cập nhật thất bại!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      dispatch(logout());
      router.push("/login");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "CANCELED": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "IN_PROGRESS": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "ACCEPTED": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      default: return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }
  };

  if (!isMounted || !user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans relative pb-20">
      <Header />
      <SocialFloating />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-amber-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI - THÔNG TIN USER */}
          <div className="lg:col-span-4 xl:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="sticky top-28 space-y-6"
            >
              <div className="bg-[#130823]/60 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-amber-500 z-20">
                    <Edit3 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="absolute top-6 right-6 flex gap-2 z-20">
                    <button 
                        disabled={isUpdating || isUploadingImage}
                        onClick={handleSaveProfile} 
                        className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-full text-green-400 transition-all disabled:opacity-50"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                
                <div className="relative z-10 text-center">
                  <div className="relative w-28 h-28 mx-auto mb-5">
                    <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-10" />
                    <img
                      src={editForm.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                      className={`w-full h-full rounded-full border-2 border-white/10 p-1 object-cover relative z-10 bg-[#1a1025] transition-all duration-300 ${isUploadingImage ? 'grayscale blur-[2px]' : ''}`}
                      alt="Avatar"
                    />
                    
                    {/* Overlay Camera đổi ảnh */}
                    {isEditing && (
                        <label className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 rounded-full cursor-pointer border-2 border-dashed border-amber-500/30 hover:border-amber-500 transition-all">
                            {isUploadingImage ? <Loader2 className="w-6 h-6 text-amber-500 animate-spin" /> : (
                                <>
                                    <Camera className="w-6 h-6 text-amber-500 mb-1" />
                                    <span className="text-[8px] font-bold text-white uppercase">Đổi ảnh</span>
                                </>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                        <input 
                            type="text"
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                            className="w-full bg-white/5 border border-amber-500/30 rounded-xl px-3 py-2 text-center text-white text-sm font-bold focus:outline-none focus:border-amber-500 transition-all"
                            placeholder="Họ và tên"
                        />
                        <input 
                            type="date"
                            value={editForm.birthDate}
                            onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                            className="w-full bg-white/5 border border-amber-500/30 rounded-xl px-3 py-2 text-center text-white text-xs focus:outline-none focus:border-amber-500 transition-all"
                        />
                    </div>
                  ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2">{user.fullName}</h2>
                        <div className="flex items-center justify-center gap-2 text-amber-500/80 mt-4 mb-6">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-sm font-medium">
                                {user.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                            </span>
                        </div>
                    </>
                  )}
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 opacity-70">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <p className="text-xs text-slate-300 truncate font-medium">{user.email}</p>
                    </div>
                  </div>

                  <button onClick={() => setShowLogoutModal(true)} className="w-full mt-8 py-3.5 flex items-center justify-center gap-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest border border-red-500/10">
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              </div>

              <div className="bg-[#130823]/40 border border-white/10 rounded-[2rem] p-6 text-center backdrop-blur-md">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Tổng số trải bài</p>
                <div className="flex items-baseline justify-center gap-1">
                    <p className="text-4xl font-black text-white tracking-tighter">{totalElements || 0}</p>
                    <p className="text-sm text-slate-500 font-bold uppercase">Phiên</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CỘT PHẢI - NHẬT KÝ TRẢI BÀI */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                  Nhật ký <span className="text-amber-500">Trải bài</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">Lưu trữ năng lượng và thông điệp từ vũ trụ.</p>
              </div>
              <button onClick={() => router.push('/tarot-draw')} className="px-6 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-colors flex items-center gap-2 shadow-lg">
                Trải bài mới <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {allLoading ? (
              <div className="h-[450px] flex flex-col items-center justify-center bg-white/[0.02] rounded-[3rem] border border-white/5 border-dashed">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-500" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Đang kết nối tâm linh...</p>
              </div>
            ) : allHistories && allHistories.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center bg-white/[0.02] rounded-[3rem] border border-white/5 border-dashed text-center px-6">
                    <HistoryIcon className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-500 font-medium">Bạn chưa có phiên trải bài nào.</p>
                </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatePresence mode="popLayout">
                  {allHistories.map((session: any, index: number) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => router.push(`/booking/result?sessionId=${session.id}`)}
                      className="group bg-[#130823]/40 border border-white/5 rounded-[2.5rem] p-7 hover:bg-[#1a1025] hover:border-amber-500/30 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-[280px]"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(session.status)}`}>
                                {session.status}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {new Date(session.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight">
                            {session.question?.topic?.name || "Phiên trải bài Tarot"}
                        </h3>
                        <p className="text-slate-500 text-sm mt-2 line-clamp-2 italic">
                            "{session.question?.questionText || "Thông điệp từ những lá bài..."}"
                        </p>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 overflow-hidden">
                                <img 
                                    src={session.interpretationForm?.requestId?.reader?.profilePicture || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.id}`} 
                                    className="w-full h-full object-cover" 
                                    alt="Reader"
                                />
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Reader</p>
                                <p className="text-sm font-bold text-slate-200">{session.interpretationForm?.requestId?.reader?.fullName || "Hệ thống"}</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* PHÂN TRANG */}
            {!allLoading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12 bg-[#130823]/60 p-3 rounded-3xl w-fit mx-auto border border-white/10 backdrop-blur-xl">
                <button
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-3 rounded-2xl bg-white/5 text-slate-400 disabled:opacity-10 hover:text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-2 px-4 font-mono">
                  <span className="text-sm font-black text-white">{currentPage + 1}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-sm font-black text-slate-500">{totalPages}</span>
                </div>

                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-3 rounded-2xl bg-white/5 text-slate-400 disabled:opacity-10 hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
      <Footer />
    </div>
  );
}