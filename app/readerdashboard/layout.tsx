// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
// import { useSelector, useDispatch } from "react-redux";
// import {
//     Inbox,
//     LayoutDashboard,
//     History,
//     User as UserIcon,
//     LogOut,
//     Loader2,
//     Power
// } from "lucide-react";
// import { logout } from "@/store/features/authSlice";
// import { RootState } from "@/store/store";
// import { AuthService } from "@/services/authService";
// import { UserService } from "@/services/userService";
// import { toast } from "react-hot-toast";
// import { updateActiveStatus } from "@/store/slices/userSlice";

// export default function ReaderLayout({ children }: { children: React.ReactNode }) {
//     const pathname = usePathname();
//     const router = useRouter();
//     const dispatch = useDispatch();
//     const { user } = useSelector((state: RootState) => state.user);

//     const [mounted, setMounted] = useState(false);
//     const [isLoggingOut, setIsLoggingOut] = useState(false);
//     const [isToggling, setIsToggling] = useState(false);
//     const [isActive, setIsActive] = useState(false);

//     useEffect(() => {
//         setMounted(true);
//         if (user) {
//             // Soi đúng vào user.active (không phải isActive)
//             setIsActive(!!user.active);
//             console.log("Trạng thái từ Redux:", user.active);
//         }
//     }, [user]); // Lắng nghe mỗi khi user trong Redux thay đổi

//     const handleToggleStatus = async () => {
//         setIsToggling(true);
//         try {
//             const data = await UserService.toggleStatus();

//             // Check log để chắc chắn BE trả về đúng true/false
//             console.log("BE Response:", data);

//             if (data.newStatus !== undefined) {
//                 // 1. Cập nhật Redux (Dùng cho các trang khác và F5)
//                 dispatch(updateActiveStatus(data.newStatus));

//                 // 2. ÉP UI local thay đổi ngay lập tức (Dùng cho cái nút hiện tại)
//                 setIsActive(data.newStatus);

//                 toast.success(data.message);
//             }
//         } catch (error) {
//             console.error("Lỗi Toggle:", error);
//             toast.error("Lỗi cập nhật trạng thái");
//         } finally {
//             setIsToggling(false);
//         }
//     };
//     const handleLogout = async () => {
//         setIsLoggingOut(true);
//         try {
//             await AuthService.logout();
//         } catch (error) {
//             console.error("Lỗi khi gọi API logout:", error);
//         } finally {
//             localStorage.removeItem("accessToken");
//             localStorage.removeItem("user");
//             dispatch(logout());
//             router.replace("/login");
//             setIsLoggingOut(false);
//         }
//     };

//     const navItems = [
//         { name: "Yêu cầu mới", icon: Inbox, href: "/readerdashboard", active: pathname === "/readerdashboard" },
//         {
//             name: "Workspace",
//             icon: LayoutDashboard,
//             href: "#",
//             disabled: !pathname.includes("/workspace"),
//             active: pathname.includes("/workspace")
//         },
//         { name: "Lịch sử", icon: History, href: "/readerdashboard/history", active: pathname === "/readerdashboard/history" },
//     ];

//     return (
//         <div className="min-h-screen bg-[#050505] text-slate-200 font-sans flex overflow-hidden relative">
//             {/* Background Effects */}
//             <div className="fixed inset-0 pointer-events-none">
//                 <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
//                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
//             </div>

//             <aside className="w-64 bg-[#130823]/60 backdrop-blur-xl border-r border-white/5 hidden lg:flex flex-col h-screen sticky top-0 z-50">
//                 <div className="p-6">
//                     <Link href="/" className="flex items-center gap-3 group">
//                         <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-8 h-8" />
//                         <span className="font-bold text-xl text-white">Mystic<span className="text-amber-500">Tarot</span></span>
//                     </Link>
//                 </div>

//                 <nav className="flex-grow px-4 space-y-2 mt-4">
//                     {navItems.map((item) => (
//                         <Link
//                             key={item.name}
//                             href={item.disabled ? "#" : item.href}
//                             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-gradient-to-r from-amber-600/20 to-purple-600/20 text-white border border-white/10 font-bold' : 'text-slate-400 hover:bg-white/5'
//                                 } ${item.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
//                         >
//                             <item.icon className="w-5 h-5" /> {item.name}
//                         </Link>
//                     ))}
//                     <div className="my-4 border-t border-white/5" />
//                     <Link href="/readerdashboard/profile" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white font-bold transition-colors">
//                         <UserIcon className="w-5 h-5" /> Hồ sơ cá nhân
//                     </Link>
//                 </nav>

//                 {/* Cụm điều khiển trạng thái & User Info */}
//                 <div className="p-4 m-4 mt-auto">
//                     {/* Nút Toggle Status */}
//                     <button
//                         onClick={handleToggleStatus}
//                         disabled={isToggling}
//                         className={`w-full mb-3 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${isActive
//                             ? "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
//                             : "bg-slate-800/40 border-white/5 text-slate-500"
//                             } hover:scale-[1.02] active:scale-95 disabled:opacity-50`}
//                     >
//                         <div className="relative flex items-center justify-center">
//                             {isToggling ? (
//                                 <Loader2 className="w-4 h-4 animate-spin" />
//                             ) : (
//                                 <>
//                                     <Power className={`w-4 h-4 transition-all ${isActive ? "drop-shadow-[0_0_8px_rgba(34,197,94,1)]" : ""}`} />
//                                     {isActive && (
//                                         <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                         <span className="text-[10px] font-black uppercase tracking-[0.15em]">
//                             {isActive ? "Đang nhận khách" : "Đang nghỉ ngơi"}
//                         </span>
//                     </button>

//                     {/* User Info Card */}
//                     <div className="bg-white/5 rounded-xl border border-white/5 p-3 flex items-center gap-3 mb-3">
//                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-black shrink-0 transition-all duration-700 ${isActive ? "bg-amber-500" : "bg-slate-600 grayscale opacity-60"}`}>
//                             {mounted ? user?.fullName?.charAt(0) : ""}
//                         </div>
//                         <div className="overflow-hidden">
//                             <p className="text-sm font-bold text-white truncate">
//                                 {mounted ? (user?.fullName || "Reader") : "..."}
//                             </p>
//                             <p className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors duration-500 ${isActive ? "text-green-400" : "text-slate-500"}`}>
//                                 <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-slate-600"}`}></span>
//                                 {isActive ? "Trực tuyến" : "Ngoại tuyến"}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Nút Đăng xuất */}
//                     <button
//                         onClick={handleLogout}
//                         disabled={isLoggingOut}
//                         className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400/60 border border-red-500/10 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50"
//                     >
//                         {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
//                         {isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}
//                     </button>
//                 </div>
//             </aside>

//             <main className="flex-grow h-screen overflow-y-auto custom-scrollbar relative">
//                 {children}
//             </main>
//         </div>
//     );
// }