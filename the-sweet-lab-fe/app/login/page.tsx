import React from 'react';
import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Đăng Nhập | The Sweet Lab',
    description: 'Đăng nhập vào tài khoản The Sweet Lab để mua sắm các sản phẩm bánh kẹo healthy và nhận các ưu đãi dinh dưỡng độc quyền.',
};

export default function LoginPage() {
    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50/50">
            {/* Ambient Background Gradient Circles */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-lime-100/40 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                {/* Back to Home Link */}
                <div className="w-full mb-6 flex justify-start">
                    <Link
                        href="/"
                        className="text-xs font-semibold text-gray-500 hover:text-emerald-700 inline-flex items-center gap-1.5 transition-colors"
                    >
                        ← Quay lại Trang chủ
                    </Link>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
