"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  Inbox,
  History,
  User as UserIcon,
  LogOut,
  Power,
  LayoutDashboard,
  BellRing,
} from "lucide-react";
import { logout } from "@/store/features/authSlice";
import { RootState } from "@/store/store";
import { AuthService } from "@/services/authService";
import { UserService } from "@/services/userService";
import { toast } from "react-hot-toast";
import { updateActiveStatus } from "@/store/slices/userSlice";
import FCMInitializer from "@/components/common/FCMInitializer";
import { ModalFCMGlobal } from "@/components/fcm/ModalFCMGlobal";
import { messaging } from "@/lib/firebaseConfig";
import { onMessage } from "firebase/messaging";
import { receiveNotification } from "@/store/slices/fcmSlice";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) setIsActive(!!user.active);
  }, [user]);

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
  useEffect(() => {
    if (!mounted || !messaging) return;

    // Đăng ký lắng nghe thông báo Foreground
    const unsubscribe = onMessage(messaging, (payload) => {

      // 1. QUAN TRỌNG: Đẩy dữ liệu vào Redux để ModalFCMGlobal có thể bắt được và hiển thị
      if (payload.data) {
        // Lưu ý: Đảm bảo ông đã import receiveNotification từ fcmSlice ở trên đầu file nhé
        // Nếu chưa import được thì dùng: dispatch({ type: "fcm/receiveNotification", payload: payload.data });
        dispatch(receiveNotification(payload.data));
      }

      // 2. Hiển thị Toast Custom (Giữ nguyên giao diện đẹp của ông)
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-[#1c112d] shadow-2xl rounded-[1.5rem] pointer-events-auto flex ring-1 ring-white/10 border border-amber-500/30`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/50">
                    <BellRing className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-white">
                    {payload.notification?.title || payload.data?.customerName || "Yêu cầu mới!"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {payload.notification?.body || payload.data?.message || "Bạn có một phiên Tarot mới đang chờ luận giải."}
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
        ),
        { duration: 6000 },
      );

      // 3. Phát tiếng chuông
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {
        console.log("Trình duyệt chặn autoplay audio");
      });
    });

    return () => unsubscribe();
  }, [mounted, router, dispatch]);
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Nếu là Reader, phải gọi tắt trạng thái ĐẦU TIÊN (khi vẫn còn Token)
      if (user?.role === "READER") {
        try {
          await UserService.toggleStatus(); // Gọi hàm toggle của ông
          console.log("Reader status turned OFF");
        } catch (statusError) {
          console.error("Không thể tắt trạng thái Reader:", statusError);
        }
      }

      // 2. Sau đó mới gọi API logout của hệ thống
      await AuthService.logout();
      
    } catch (e) {
      console.error("Lỗi trong quá trình logout:", e);
    } finally {
      // 3. Cuối cùng mới dọn dẹp bộ nhớ và đẩy ra trang login
      localStorage.clear();
      dispatch(logout());
      router.replace("/login");
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      name: "Tổng quan",
      icon: Inbox,
      href: "/readerdashboard",
      active: pathname === "/readerdashboard",
    },
    {
      name: "Workspace",
      icon: LayoutDashboard,
      href: "#",
      disabled: !pathname.includes("/workspace"),
      active: pathname.includes("/workspace"),
    },
    {
      name: "Lịch sử",
      icon: History,
      href: "/readerdashboard/history",
      active: pathname === "/readerdashboard/history",
    },
    {
      name: "Hồ sơ",
      icon: UserIcon,
      href: "/readerdashboard/profile",
      active: pathname === "/readerdashboard/profile",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col lg:flex-row relative">
      {/* Khởi tạo lắng nghe FCM */}
      <FCMInitializer />

      {/* Modal nổ ra ở tầng cao nhất của App */}
      <ModalFCMGlobal />
      {/* Toast nổ ra ở tầng cao nhất của App */}
      <ToastContainer/>
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-64 bg-[#130823]/60 backdrop-blur-xl border-r border-white/5 flex-col h-screen sticky top-0 z-50">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-auto"
              priority
            />
            <span className="font-bold text-xl text-white">
              Mystic<span className="text-amber-500"> Tarot</span>
            </span>
          </Link>
        </div>
        <nav className="flex-grow px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? "bg-amber-600/20 text-white border border-white/10" : "text-slate-400 hover:bg-white/5"}`}
            >
              <item.icon className="w-5 h-5" /> {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 m-4 mt-auto space-y-3">
          <button
            onClick={handleToggleStatus}
            disabled={isToggling}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
              isActive
                ? "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                : "bg-slate-800/40 border-white/5 text-slate-500"
            } active:scale-95 disabled:opacity-50`}
          >
            <Power
              className={`w-4 h-4 ${isActive ? "drop-shadow-[0_0_8px_rgba(34,197,94,1)]" : ""}`}
            />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">
              {isActive ? "Đang nhận khách" : "Đang nghỉ ngơi"}
            </span>
          </button>

          <div className="bg-white/5 rounded-xl border border-white/5 p-3 flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-black shrink-0 ${isActive ? "bg-amber-500" : "bg-slate-600"}`}
            >
              {user?.fullName?.charAt(0)}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-sm font-bold text-white truncate">
                {user?.fullName || "Reader"}
              </p>
              <p
                className={`text-[10px] font-bold uppercase ${isActive ? "text-green-400" : "text-slate-500"}`}
              >
                {isActive ? "Trực tuyến" : "Ngoại tuyến"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400/60 border border-red-500/10 rounded-xl text-[10px] font-black uppercase transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            {isLoggingOut ? "Đang thoát..." : "Đăng xuất"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow min-h-screen pb-24 lg:pb-0">{children}</main>

      {/* BOTTOM NAV MOBILE */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#130823]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 shadow-2xl">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${item.active ? "text-amber-500" : "text-slate-500"}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={handleToggleStatus}
            className={`flex flex-col items-center gap-1 ${isActive ? "text-green-400" : "text-slate-500"}`}
          >
            <Power className="w-6 h-6" />
            <span className="text-[10px] font-medium">Trạng thái</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-red-400/70"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] font-medium">Thoát</span>
          </button>
        </div>
      </div>
    </div>
  );
}
