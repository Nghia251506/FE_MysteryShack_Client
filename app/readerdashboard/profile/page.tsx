// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { 
//   Star, ShieldCheck, MapPin, Edit3, Save, Camera, 
//   Award, Zap, TrendingUp, MessageSquare, 
//   Power, QrCode, UploadCloud, X, Mail, Sparkles, LayoutDashboard, AlertCircle, ArrowLeft, Calendar
// } from "lucide-react";
// import { motion } from "framer-motion";

// // --- 1. ĐỊNH NGHĨA DỮ LIỆU TỪ BACKEND ---
// interface ReaderUser {
//   id: number;
//   email: string;
//   fullName?: string; 
//   name?: string;
//   username?: string;
//   role: string;
//   avatarUrl?: string;
  
//   // Thông tin cá nhân
//   bio?: string;
//   phone?: string;
//   address?: string;
//   birthDate?: string; // Đã thêm trường này
//   specialties?: string[];
//   paymentQr?: string;
  
//   // Thống kê
//   rating?: number;
//   totalSessions?: number;
//   totalRevenue?: number;
//   experienceYears?: number;
// }

// export default function ReaderProfilePage() {
//   const router = useRouter();
//   const { user: rawUser } = useSelector((state: RootState) => state.auth);
//   const user = rawUser as unknown as ReaderUser;

//   const [isEditing, setIsEditing] = useState(false);
//   const [isOnline, setIsOnline] = useState(true);

//   // --- STATE FORM ---
//   const [formData, setFormData] = useState({
//     fullName: "",
//     bio: "",
//     specialties: [] as string[],
//     location: "",
//     birthDate: "", // State cho ngày sinh
//     paymentQr: "",
//   });
  
//   const [previewQr, setPreviewQr] = useState<string>("");

//   // --- ĐỒNG BỘ DỮ LIỆU ---
//   useEffect(() => {
//     if (user) {
//         const realName = user.fullName || user.name || user.username || user.email?.split('@')[0] || "";
        
//         // Xử lý ngày sinh: Nếu có thì format, không thì để rỗng
//         let dob = "";
//         if (user.birthDate) {
//             // Nếu BE trả về dạng ISO (2000-01-01T00:00:00Z), cắt lấy YYYY-MM-DD để hiện trong input date
//             dob = user.birthDate.split("T")[0];
//         }

//         setFormData({
//             fullName: realName,
//             bio: user.bio || "",
//             specialties: user.specialties || [],
//             location: user.address || "",
//             birthDate: dob,
//             paymentQr: user.paymentQr || ""
//         });
//         setPreviewQr(user.paymentQr || "");
//     }
//   }, [user]);

//   // --- HANDLERS ---
//   const handleQrUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => {
//             const base64 = reader.result as string;
//             setPreviewQr(base64);
//             setFormData(prev => ({ ...prev, paymentQr: base64 }));
//         };
//     }
//   };

//   const handleRemoveQr = () => {
//       setPreviewQr("");
//       setFormData(prev => ({ ...prev, paymentQr: "" }));
//   };

//   const handleSaveProfile = () => {
//     // TODO: Gọi API update profile tại đây
//     console.log("Saving profile:", formData);
//     alert("Đã cập nhật hồ sơ thành công!");
//     setIsEditing(false);
//   };

//   // Helper để hiển thị ngày sinh đẹp mắt (DD/MM/YYYY) khi không edit
//   const formatDateDisplay = (dateString: string) => {
//       if (!dateString) return "Chưa cập nhật";
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return dateString; // Fallback nếu string không phải ngày chuẩn
//       return date.toLocaleDateString('vi-VN');
//   };

//   return (
//     <motion.div 
//         initial={{ opacity: 0, y: 20 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         className="min-h-screen bg-[#050505] text-slate-200 font-sans relative pb-20 selection:bg-amber-500/30"
//     >
//       {/* Background Decor */}
//       <div className="fixed inset-0 pointer-events-none">
//         <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-amber-900/10 rounded-full blur-[100px]" />
//         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
//         {/* --- BUTTON: QUAY LẠI DASHBOARD --- */}
//         <div className="mb-6">
//             <button 
//                 onClick={() => router.push('/readerdashboard')}
//                 className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors group text-sm font-bold"
//             >
//                 <div className="p-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all">
//                     <ArrowLeft className="w-4 h-4" />
//                 </div>
//                 Quay lại Dashboard
//             </button>
//         </div>

//         {/* --- HEADER --- */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//             <div>
//                 <h2 className="text-3xl font-bold text-white">Hồ Sơ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">Reader</span></h2>
//                 <p className="text-slate-400 text-sm mt-1">Thông tin hiển thị công khai với khách hàng.</p>
//             </div>
            
//             <div className="flex items-center gap-3">
//                 <button 
//                     onClick={() => setIsOnline(!isOnline)}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all ${isOnline ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
//                 >
//                     <Power className="w-3.5 h-3.5" /> {isOnline ? "Đang Online" : "Đang Offline"}
//                 </button>
//                 {!isEditing ? (
//                     <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all">
//                         <Edit3 className="w-4 h-4" /> Cập nhật
//                     </button>
//                 ) : (
//                     <>
//                         <button onClick={() => setIsEditing(false)} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 text-sm font-bold">Hủy</button>
//                         <button onClick={handleSaveProfile} className="px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
//                             <Save className="w-4 h-4" /> Lưu
//                         </button>
//                     </>
//                 )}
//             </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
//             {/* --- CỘT TRÁI (INFO) --- */}
//             <div className="lg:col-span-4 space-y-6">
                
//                 {/* 1. Identity Card */}
//                 <div className="bg-[#130823]/60 border border-white/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
//                     <div className="relative group mx-auto w-fit">
//                         <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-amber-400 to-purple-600 mb-4 relative mx-auto">
//                             {user?.avatarUrl ? (
//                                 <Image src={user.avatarUrl} alt="Avatar" layout="fill" objectFit="cover" className="rounded-full border-4 border-[#130823]" />
//                             ) : (
//                                 <div className="w-full h-full bg-[#1a1025] rounded-full border-4 border-[#130823] flex items-center justify-center text-4xl font-bold text-white uppercase">
//                                     {(formData.fullName || user?.email || "?").charAt(0).toUpperCase()}
//                                 </div>
//                             )}
//                             {isEditing && (
//                                 <button className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-white/20 text-white hover:bg-amber-500 hover:text-black transition-all shadow-lg cursor-pointer">
//                                     <Camera className="w-4 h-4" />
//                                 </button>
//                             )}
//                         </div>
                        
//                         {isEditing ? (
//                             <input 
//                                 value={formData.fullName} 
//                                 onChange={(e) => setFormData({...formData, fullName: e.target.value})}
//                                 placeholder="Nhập tên hiển thị..."
//                                 className="text-xl font-bold text-white bg-transparent border-b border-white/20 outline-none w-full text-center mb-1 pb-1 placeholder:text-slate-600"
//                             />
//                         ) : (
//                             <h2 className="text-2xl font-bold text-white mb-1">
//                                 {formData.fullName || "Chưa đặt tên"}
//                             </h2>
//                         )}
                        
//                         <div className="flex items-center justify-center gap-2 mt-2">
//                             <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
//                                 <ShieldCheck className="w-3 h-3" /> {user?.role || "READER"}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="mt-8 space-y-4 text-left">
//                         {/* EMAIL */}
//                         <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors">
//                             <Mail className="w-5 h-5 text-slate-400" />
//                             <div className="overflow-hidden w-full">
//                                 <p className="text-xs text-slate-500 uppercase font-bold">Email</p>
//                                 <p className="text-sm text-slate-200 truncate">{user?.email}</p>
//                             </div>
//                         </div>

//                         {/* NGÀY SINH (MỚI) */}
//                         <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors">
//                             <Calendar className="w-5 h-5 text-slate-400" />
//                             <div className="w-full">
//                                 <p className="text-xs text-slate-500 uppercase font-bold">Ngày sinh</p>
//                                 {isEditing ? (
//                                     <input 
//                                         type="date"
//                                         value={formData.birthDate} 
//                                         onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
//                                         className="text-sm text-slate-200 bg-transparent border-b border-white/20 outline-none w-full [color-scheme:dark]"
//                                     />
//                                 ) : (
//                                     <p className="text-sm text-slate-200 font-medium">{formatDateDisplay(formData.birthDate)}</p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* ĐỊA ĐIỂM */}
//                         <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors">
//                             <MapPin className="w-5 h-5 text-slate-400" />
//                             <div className="w-full">
//                                 <p className="text-xs text-slate-500 uppercase font-bold">Địa điểm</p>
//                                 {isEditing ? (
//                                     <input 
//                                         value={formData.location} 
//                                         onChange={(e) => setFormData({...formData, location: e.target.value})}
//                                         placeholder="Nhập địa điểm..."
//                                         className="text-sm text-slate-200 bg-transparent border-b border-white/20 outline-none w-full placeholder:text-slate-600"
//                                     />
//                                 ) : (
//                                     <p className="text-sm text-slate-200 font-medium">{formData.location || "Chưa cập nhật"}</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 2. Total Revenue Card */}
//                 <div className="bg-gradient-to-br from-[#1a1025] to-[#0f0518] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
//                     <div className="flex items-center gap-2 mb-3 text-slate-400 font-bold text-xs uppercase tracking-wider">
//                         <TrendingUp className="w-4 h-4 text-green-400" /> Tổng Thu Nhập
//                     </div>
//                     <div className="flex items-baseline gap-2 relative z-10">
//                         <h2 className="text-4xl font-bold text-white tracking-tight">
//                             {(user?.totalRevenue ?? 0).toLocaleString('vi-VN')}
//                         </h2>
//                         <span className="text-slate-500 font-bold text-sm">VNĐ</span>
//                     </div>
//                 </div>
//             </div>
            
//             {/* --- CỘT PHẢI (DETAILS) --- */}
//             <div className="lg:col-span-8 space-y-6">
                
//                 {/* 1. Stats Grid */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div className="bg-[#130823]/60 border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
//                         <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-amber-400/10 text-amber-400"><Star className="w-5 h-5" /></div>
//                         <p className="text-2xl font-bold text-white mb-1">{user?.rating || 0}</p>
//                         <p className="text-slate-500 text-[10px] font-bold uppercase">Đánh giá</p>
//                     </div>
//                     <div className="bg-[#130823]/60 border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
//                         <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-blue-400/10 text-blue-400"><MessageSquare className="w-5 h-5" /></div>
//                         <p className="text-2xl font-bold text-white mb-1">{user?.totalSessions || 0}</p>
//                         <p className="text-slate-500 text-[10px] font-bold uppercase">Tổng phiên</p>
//                     </div>
//                     <div className="bg-[#130823]/60 border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
//                         <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-green-400/10 text-green-400"><Zap className="w-5 h-5" /></div>
//                         <p className="text-2xl font-bold text-white mb-1">--%</p>
//                         <p className="text-slate-500 text-[10px] font-bold uppercase">Phản hồi</p>
//                     </div>
//                     <div className="bg-[#130823]/60 border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
//                         <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-purple-400/10 text-purple-400"><Award className="w-5 h-5" /></div>
//                         <p className="text-2xl font-bold text-white mb-1">{user?.experienceYears || 0} Năm</p>
//                         <p className="text-slate-500 text-[10px] font-bold uppercase">Kinh nghiệm</p>
//                     </div>
//                 </div>

//                 {/* 2. Bio & Specialties */}
//                 <div className="bg-[#130823]/60 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden backdrop-blur-xl">
//                     <div className="flex items-center gap-3 mb-6">
//                         <LayoutDashboard className="w-5 h-5 text-amber-500" />
//                         <h3 className="text-lg font-bold text-white">Giới thiệu & Chuyên môn</h3>
//                     </div>

//                     <div className="space-y-6">
//                         {/* Bio Input */}
//                         <div className={`rounded-2xl p-1 border ${isEditing ? 'border-amber-500/30 bg-black/20' : 'border-white/5 bg-transparent'}`}>
//                             {isEditing ? (
//                                 <textarea 
//                                     value={formData.bio}
//                                     onChange={(e) => setFormData({...formData, bio: e.target.value})}
//                                     className="w-full h-32 bg-transparent border-none rounded-xl p-4 text-slate-200 focus:ring-0 resize-none leading-relaxed text-sm placeholder-slate-600"
//                                     placeholder="Viết một đoạn giới thiệu ngắn về bản thân..."
//                                 />
//                             ) : (
//                                 <div className="p-4">
//                                     <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
//                                         {formData.bio || <span className="italic text-slate-500">Chưa có thông tin giới thiệu.</span>}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Specialties Tags */}
//                         <div>
//                             <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
//                                 <Sparkles className="w-3 h-3" /> Thế mạnh
//                             </h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {formData.specialties.length > 0 ? formData.specialties.map((tag, i) => (
//                                     <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/10 transition-all cursor-default">
//                                         # {tag}
//                                     </span>
//                                 )) : <span className="text-slate-500 italic text-sm">Chưa cập nhật chuyên môn</span>}
//                                 {isEditing && (
//                                     <button className="px-4 py-2 rounded-xl border border-dashed border-slate-600 text-slate-400 text-xs font-bold hover:text-white hover:border-slate-400 transition-all">
//                                         + Thêm
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 3. QR CODE MANAGER */}
//                 <div className="bg-[#130823]/60 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden backdrop-blur-xl">
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg"><QrCode className="w-5 h-5 text-white" /></div>
//                             <div>
//                                 <h3 className="text-lg font-bold text-white">Mã QR Thanh Toán</h3>
//                                 <p className="text-xs text-slate-400">Dùng để nhận Donate từ khách hàng</p>
//                             </div>
//                         </div>
                        
//                         {isEditing && (
//                             <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10 group">
//                                 <UploadCloud className="w-4 h-4 text-slate-300 group-hover:text-white" />
//                                 <span className="text-xs font-bold text-slate-300 group-hover:text-white">Tải ảnh lên</span>
//                                 <input type="file" accept="image/*" className="hidden" onChange={handleQrUpload} />
//                             </label>
//                         )}
//                     </div>

//                     <div className="flex flex-col md:flex-row gap-6 items-center">
//                         {/* Khu vực hiển thị QR */}
//                         <div className="relative w-48 h-48 bg-black/40 rounded-3xl border-2 border-dashed border-slate-700/50 flex flex-col items-center justify-center overflow-hidden hover:border-amber-500/30 transition-colors shrink-0 group">
//                             {previewQr ? (
//                                 <>
//                                     <img src={previewQr} alt="QR Code" className="w-full h-full object-cover p-2 rounded-3xl" />
//                                     {isEditing && (
//                                         <button onClick={handleRemoveQr} className="absolute top-2 right-2 p-1.5 bg-red-600/90 rounded-full text-white shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100">
//                                             <X className="w-4 h-4" />
//                                         </button>
//                                     )}
//                                 </>
//                             ) : (
//                                 <div className="text-center p-4 opacity-50">
//                                     <QrCode className="w-12 h-12 text-slate-500 mx-auto mb-2" />
//                                     <p className="text-slate-400 text-[10px] font-medium">Chưa có mã QR</p>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Văn bản hướng dẫn */}
//                         <div className="flex-1 bg-blue-500/5 p-5 rounded-2xl border border-blue-500/10">
//                             <div className="flex items-start gap-3">
//                                 <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
//                                 <div className="space-y-2">
//                                     <p className="text-sm text-blue-100 font-bold">Hướng dẫn hiển thị:</p>
//                                     <p className="text-xs text-slate-300 leading-relaxed">
//                                         Mã QR này sẽ được <strong className="text-amber-400">tự động đính kèm</strong> vào cuối mỗi kết quả trải bài mà bạn gửi cho khách hàng.
//                                     </p>
//                                     <p className="text-xs text-slate-400 leading-relaxed">
//                                         Điều này giúp khách hàng dễ dàng gửi thêm tiền <strong>Tip/Donate</strong> cho bạn nếu họ hài lòng với thông điệp nhận được. Hãy đảm bảo ảnh QR rõ nét.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }