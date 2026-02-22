'use client'
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/features/authSlice';

export default function OAuth2RedirectHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    // --- LOGIC GỘP DATA TOÀN DIỆN (SESSION + LOCAL) ---
    const mergeAllPossibleTarotData = () => {
        try {
            // 1. Quét tất cả các nguồn có thể chứa data cũ
            const guestSession = sessionStorage.getItem('guestTarotSession');
            const persistSession = sessionStorage.getItem('tarot_draw_state_persist');
            const localTarotSession = localStorage.getItem('tarot-session');
            const localPersist = localStorage.getItem('tarot_draw_state_persist');

            // 2. Phân tích data (Ưu tiên lấy cái nào có dữ liệu mới nhất)
            const gData = guestSession ? JSON.parse(guestSession) : null;
            const pData = persistSession ? JSON.parse(persistSession) : null;
            const lTData = localTarotSession ? JSON.parse(localTarotSession) : null;
            const lPData = localPersist ? JSON.parse(localPersist) : null;

            // Nếu không có bất kỳ data nào thì thoát
            if (!gData && !pData && !lTData && !lPData) return false;

            // 3. Hợp nhất dữ liệu (Gộp tất cả vào một object chung)
            // Thứ tự spread: lPData < lTData < pData < gData (Cái sau đè cái trước, ưu tiên guestSession nhất)
            const mergedData = {
                ...lPData,
                ...lTData,
                ...pData,
                ...gData,
                updatedAt: Date.now(),
                isMigrated: true
            };

            // 4. Lưu đồng bộ vào cả 2 key quan trọng nhất ở LocalStorage để "bất tử"
            const finalString = JSON.stringify(mergedData);
            localStorage.setItem('tarot-session', finalString);
            localStorage.setItem('tarot_draw_state_persist', finalString);

            // 5. Dọn dẹp rác ở SessionStorage
            sessionStorage.removeItem('guestTarotSession');
            sessionStorage.removeItem('tarot_draw_state_persist');
            
            console.log("Hệ thống Google OAuth2 đã gộp và đồng bộ hóa linh hồn bài Tarot.");
            return true;
        } catch (e) {
            console.error("Lỗi gộp data Tarot toàn diện:", e);
            return false;
        }
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

            dispatch(loginSuccess({ user: userData, token: token }));

            // Gộp data toàn diện
            const hasData = mergeAllPossibleTarotData();

            if (hasData) {
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