"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Leaf } from 'lucide-react';
import { authService } from '@/services/authService';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!email.trim() || !password.trim()) {
            setError('Vui lòng điền đầy đủ Email và Mật khẩu.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await authService.login({ email, password });
            setSuccessMessage(`Chào mừng ${res.user.fullName || res.user.email}! Đang chuyển hướng...`);
            setTimeout(() => {
                router.push('/');
                router.refresh();
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const fillDemoAccount = (demoEmail: string, demoPass: string) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        setError(null);
    };

    return (
        <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100/80 border border-slate-100 relative">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Đăng Nhập
                </h2>
                <p className="text-gray-500 text-xs mt-1.5">
                    Khám phá thế giới bánh kẹo hữu cơ và dinh dưỡng lành mạnh
                </p>
            </div>

            {/* Error / Success Alert */}
            {error && (
                <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email
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
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700">
                            Mật khẩu
                        </label>
                        <a href="#" className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu..."
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

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                    <input
                        type="checkbox"
                        id="remember"
                        defaultChecked
                        className="w-3.5 h-3.5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer select-none">
                        Ghi nhớ đăng nhập trên thiết bị này
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
                            <span>Đăng Nhập</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Quick Demo Credentials Box */}
            <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tài khoản kiểm thử nhanh (Demo)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => fillDemoAccount('customer1@thesweetlab.com', 'Customer@123')}
                        className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900 text-left transition-all"
                    >
                        <div className="font-bold text-[11px]">Khách hàng 1</div>
                        <div className="text-[9px] text-gray-500">customer1@...</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillDemoAccount('admin@thesweetlab.com', 'Admin@123')}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 text-left transition-all"
                    >
                        <div className="font-bold text-[11px]">Quản trị viên</div>
                        <div className="text-[9px] text-gray-500">admin@...</div>
                    </button>
                </div>
            </div>

            {/* Switch to Register */}
            <div className="mt-6 text-center text-xs text-gray-500">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                    Đăng ký tài khoản mới
                </Link>
            </div>
        </div>
    );
}
