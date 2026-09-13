"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { authService } from '@/services/authService';

export default function RegisterForm() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có tối thiểu 6 ký tự.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
            return;
        }

        if (!agreeTerms) {
            setError('Vui lòng đồng ý với điều khoản sử dụng để tiếp tục.');
            return;
        }

        setIsLoading(true);
        try {
            const message = await authService.register({ fullName, email, password });
            setIsSuccess(true);
            setSuccessMessage(message);
        } catch (err: any) {
            setError(err.message || 'Đăng ký không thành công. Email có thể đã được sử dụng.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100/80 border border-slate-100 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                    Đăng Ký Thành Công!
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    {successMessage || 'Tài khoản của bạn đã được tạo. Vui lòng kiểm tra hòm thư Email (hoặc Mailpit port 8025 khi chạy local) để kích hoạt tài khoản.'}
                </p>
                <div className="space-y-3">
                    <Link
                        href="/login"
                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20"
                    >
                        <span>Đến Trang Đăng Nhập</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/"
                        className="w-full inline-block text-gray-500 hover:text-slate-800 text-xs font-semibold py-2 transition-colors"
                    >
                        Trở về Trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100/80 border border-slate-100 relative">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-3 shadow-sm border border-emerald-100">
                    <UserPlus className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Tạo Tài Khoản
                </h2>
                <p className="text-gray-500 text-xs mt-1.5">
                    Gia nhập The Sweet Lab và nhận ngay ưu đãi quà chào mừng
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Họ và tên
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ví dụ: Nguyễn Văn An"
                            required
                            className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                        />
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Địa chỉ Email
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ban@example.com"
                            required
                            className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                        />
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Mật khẩu
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tối thiểu 6 ký tự..."
                            required
                            className="w-full pl-10 pr-10 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                        />
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu..."
                            required
                            className="w-full pl-10 pr-10 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                        />
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-2 pt-1">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-3.5 h-3.5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer mt-0.5"
                    />
                    <label htmlFor="terms" className="text-[11px] text-gray-500 cursor-pointer leading-tight select-none">
                        Tôi đồng ý với{' '}
                        <a href="#" className="text-emerald-600 hover:underline">Điều khoản dịch vụ</a> và{' '}
                        <a href="#" className="text-emerald-600 hover:underline">Chính sách bảo mật</a> của The Sweet Lab.
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span>Đăng Ký Tài Khoản</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-gray-500">
                Đã có tài khoản?{' '}
                <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                    Đăng nhập tại đây
                </Link>
            </div>
        </div>
    );
}
