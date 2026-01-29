"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
    Inbox,
    LayoutDashboard,
    History,
    User as UserIcon,
    LogOut,
    Power,
    BellRing
} from "lucide-react";
import { logout } from "@/store/features/authSlice";
import { RootState } from "@/store/store";
import { AuthService } from "@/services/authService";
import { UserService } from "@/services/userService";
import { toast } from "react-hot-toast";
import { updateActiveStatus } from "@/store/slices/userSlice";

// --- IMPORT FIREBASE LOGIC ---
import { messaging } from "@/lib/firebaseConfig"; 
import { onMessage } from "firebase/messaging";

export default function ReaderLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.user);

    const [mounted, setMounted] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // 1. CHỐNG HYDRATION & SYNC USER
    useEffect(() => {
        setMounted(true);
        if (user) {
            setIsActive(!!user.active);
        }
    }, [user]);

    // 2. LOGIC FCM
    useEffect(() => {
        if (!mounted || !messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Nhận thông báo mới (Foreground):", payload);
            
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#1c112d] shadow-2xl rounded-[1.5rem] pointer-events-auto flex ring-1 ring-white/10 border border-amber-500/30`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/50">
                                    <BellRing className="h-5 w-5 text-amber-500" />
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-bold text-white">
                                    {payload.notification?.title || "Yêu cầu mới!"}
                                </p>
                                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                                    {payload.notification?.body || "Bạn có một phiên Tarot mới đang chờ luận giải."}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-white/5">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                router.push("/readerdashboard");
                            }}
                            className="w-full border border-transparent rounded-none rounded-r-[1.5rem] p-4 flex items-center justify-center text-xs font-black text-amber-500 hover:bg-white/5 focus:outline-none uppercase tracking-tighter"
                        >
                            Xem ngay
                        </button>
                    </div>
                </div>
            ), { duration: 6000 });

            const audio = new Audio("/sounds/notification.mp3");
            audio.play().catch(() => {});
        });

        return () => unsubscribe();
    }, [mounted, router]);

    const handleToggleStatus = async () => {
        if (isToggling) return;
        setIsToggling(true);
        try {
            const data = await UserService.toggleStatus();
            if (data && data.newStatus !== undefined) {
                dispatch(updateActiveStatus(data.newStatus));
                setIsActive(data.newStatus);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        } finally {
            setIsToggling(false);
        }
    };

    // --- HÀM LOGOUT CHUẨN ---
    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            // Gọi API báo backend hủy token (quan trọng)
            await AuthService.logout();
        } catch (error) {
            console.error("Lỗi khi logout API:", error);
        } finally {
            // Dọn dẹp client dù API lỗi hay không
            localStorage.removeItem("accessToken");
            localStorage.removeItem("currentUser");
            dispatch(logout());
            router.replace("/login");
            setIsLoggingOut(false);
        }
    };

    const navItems = [
        { name: "Yêu cầu mới", icon: Inbox, href: "/readerdashboard", active: pathname === "/readerdashboard" },
        { name: "Workspace", icon: LayoutDashboard, href: "#", disabled: !pathname.includes("/workspace"), active: pathname.includes("/workspace") },
        { name: "Lịch sử", icon: History, href: "/readerdashboard/history", active: pathname === "/readerdashboard/history" },
    ];

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans flex overflow-hidden relative">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <aside className="w-64 bg-[#130823]/60 backdrop-blur-xl border-r border-white/5 hidden lg:flex flex-col h-screen sticky top-0 z-50">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-8 h-8" />
                        <span className="font-bold text-xl text-white">Mystic<span className="text-amber-500">Tarot</span></span>
                    </Link>
                </div>

                <nav className="flex-grow px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.disabled ? "#" : item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-gradient-to-r from-amber-600/20 to-purple-600/20 text-white border border-white/10 font-bold' : 'text-slate-400 hover:bg-white/5'
                                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <item.icon className="w-5 h-5" /> {item.name}
                        </Link>
                    ))}
                    <div className="my-4 border-t border-white/5" />
                    <Link href="/readerdashboard/profile" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white font-bold transition-colors">
                        <UserIcon className="w-5 h-5" /> Hồ sơ cá nhân
                    </Link>
                </nav>

                <div className="p-4 m-4 mt-auto space-y-3">
                    <button
                        onClick={handleToggleStatus}
                        disabled={isToggling}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${isActive
                            ? "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                            : "bg-slate-800/40 border-white/5 text-slate-500"
                            } active:scale-95 disabled:opacity-50`}
                    >
                        <Power className={`w-4 h-4 ${isActive ? "drop-shadow-[0_0_8px_rgba(34,197,94,1)]" : ""}`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                            {isActive ? "Đang nhận khách" : "Đang nghỉ ngơi"}
                        </span>
                    </button>

                    <div className="bg-white/5 rounded-xl border border-white/5 p-3 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-black shrink-0 ${isActive ? "bg-amber-500" : "bg-slate-600"}`}>
                            {user?.fullName?.charAt(0) || "R"}
                        </div>
                        <div className="overflow-hidden text-left">
                            <p className="text-sm font-bold text-white truncate">{user?.fullName || "Reader"}</p>
                            <p className={`text-[10px] font-bold uppercase ${isActive ? "text-green-400" : "text-slate-500"}`}>
                                {isActive ? "Trực tuyến" : "Ngoại tuyến"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400/60 border border-red-500/10 rounded-xl text-[10px] font-black uppercase transition-all hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        {isLoggingOut ? "Đang thoát..." : "Đăng xuất"}
                    </button>
                </div>
            </aside>

            <main className="flex-grow h-screen overflow-y-auto custom-scrollbar relative z-10">
                {children}
            </main>
        </div>
    );
}