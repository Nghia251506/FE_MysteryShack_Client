'use client'
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/features/authSlice';

export default function OAuth2RedirectHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    // --- HELPER LOGIC: GỘP DATA GUEST VÀO USER ---
    const mergeTarotData = () => {
        const guestDataRaw = sessionStorage.getItem('guestTarotSession');
        if (guestDataRaw) {
            try {
                const guestData = JSON.parse(guestDataRaw);
                const userDataRaw = sessionStorage.getItem('tarot_draw_state_persist');
                const userData = userDataRaw ? JSON.parse(userDataRaw) : {};

                // Gộp data và đánh dấu đã migrate
                const mergedData = {
                    ...userData,
                    ...guestData,
                    updatedAt: Date.now(),
                    isMigrated: true
                };

                sessionStorage.setItem('tarot_draw_state_persist', JSON.stringify(mergedData));
                sessionStorage.removeItem('guestTarotSession');
                console.log("Đã đồng bộ dữ liệu khách từ Google Login");
                return true;
            } catch (e) {
                console.error("Lỗi gộp session OAuth2:", e);
            }
        }
        return false;
    };

    useEffect(() => {
        const token = searchParams.get('token');
        const id = searchParams.get('id');
        const email = searchParams.get('email');
        const fullName = searchParams.get('fullName');
        const role = searchParams.get('role');
        const birthDate = searchParams.get('birthDate');
        const profilePicture = searchParams.get('profilePicture');

        if (token && id) {
            const userData = {
                id: Number(id),
                email,
                fullName,
                role,
                isVerified: true,
                birthDate: birthDate,
                profilePicture: profilePicture,
            };

            // 1. Cập nhật Auth State
            dispatch(loginSuccess({ user: userData, token: token }));

            // 2. Thực hiện gộp dữ liệu Tarot
            const hasMerged = mergeTarotData();

            // 3. Chuyển hướng thông minh
            // Nếu vừa gộp data xong, ưu tiên đưa về trang rút bài để họ tiếp tục
            if (hasMerged) {
                router.push('/tarot-draw');
            } else {
                router.push('/profile');
            }
        } else {
            router.push('/login?error=oauth2_failed');
        }
    }, [router, searchParams, dispatch]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500 mb-4"></div>
            <p className="text-amber-500 font-bold">Đang đồng bộ linh hồn với Google...</p>
        </div>
    );
}