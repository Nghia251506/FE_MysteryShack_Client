"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Inbox, History, User as UserIcon, LogOut, Power } from "lucide-react";
import { logout } from "@/store/features/authSlice";
import { RootState } from "@/store/store";
import { AuthService } from "@/services/authService";
import { UserService } from "@/services/userService";
import { toast } from "react-hot-toast";
import { updateActiveStatus } from "@/store/slices/userSlice";
import FCMInitializer from "@/components/common/FCMInitializer";
import { ModalFCMGlobal } from "@/components/fcm/ModalFCMGlobal";

export default function ReaderLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.user);
    const [mounted, setMounted] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (user) setIsActive(!!user.active);
    }, [user]);

    const handleToggleStatus = async () => {
        try {
            const data = await UserService.toggleStatus();
            if (data?.newStatus !== undefined) {
                dispatch(updateActiveStatus(data.newStatus));
                setIsActive(data.newStatus);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            localStorage.clear();
            dispatch(logout());
            router.replace("/login");
        } catch (error) {
            router.replace("/login");
        }
    };

    const navItems = [
        { name: "Yêu cầu", icon: Inbox, href: "/readerdashboard", active: pathname === "/readerdashboard" },
        { name: "Lịch sử", icon: History, href: "/readerdashboard/history", active: pathname === "/readerdashboard/history" },
        { name: "Hồ sơ", icon: UserIcon, href: "/readerdashboard/profile", active: pathname === "/readerdashboard/profile" },
    ];

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col lg:flex-row relative">

            {/* SIDEBAR DESKTOP */}
            <aside className="hidden lg:flex w-64 bg-[#130823]/60 backdrop-blur-xl border-r border-white/5 flex-col h-screen sticky top-0 z-50">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-8 h-auto" priority />
                        <span className="font-bold text-xl text-white">Mystic<span className="text-amber-500">Tarot</span></span>
                    </Link>
                </div>
                <nav className="flex-grow px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-amber-600/20 text-white border border-white/10' : 'text-slate-400 hover:bg-white/5'}`}>
                            <item.icon className="w-5 h-5" /> {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 m-4 space-y-3">
                    <button onClick={handleToggleStatus} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isActive ? "border-green-500/50 text-green-400" : "border-white/5 text-slate-500"}`}>
                        <Power className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase">{isActive ? "Sẵn sàng" : "Đang nghỉ"}</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 text-red-400/60 border border-red-500/10 rounded-xl text-[10px] font-bold uppercase hover:bg-red-500/20">
                        <LogOut className="w-3.5 h-3.5" /> Thoát
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-grow min-h-screen pb-24 lg:pb-0">{children}</main>

            {/* BOTTOM NAV MOBILE */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#130823]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 shadow-2xl">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href} className={`flex flex-col items-center gap-1 ${item.active ? 'text-amber-500' : 'text-slate-500'}`}>
                            <item.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    ))}
                    <button onClick={handleToggleStatus} className={`flex flex-col items-center gap-1 ${isActive ? 'text-green-400' : 'text-slate-500'}`}>
                        <Power className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Trạng thái</span>
                    </button>
                    <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-red-400/70">
                        <LogOut className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Thoát</span>
                    </button>
                </div>
            </div>
        </div>
    );
}