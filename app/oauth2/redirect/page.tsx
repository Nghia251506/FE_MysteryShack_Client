'use client'
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/features/authSlice';

export default function OAuth2RedirectHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get('token');
        const id = searchParams.get('id');
        const email = searchParams.get('email');
        const fullName = searchParams.get('fullName');
        const role = searchParams.get('role');

        if (token && id) {
            // Đóng gói user y hệt cấu trúc Login thường trả về
            const userData = {
                id: Number(id),
                email,
                fullName,
                role,
                isVerified: true // OAuth2 mặc định là đã verify
            };

            // 1. Đẩy vào Redux & LocalStorage (Hàm loginSuccess của ông đã cân hết rồi)
            dispatch(loginSuccess({ user: userData, token: token }));

            // 2. Chuyển hướng
            router.push('/');
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