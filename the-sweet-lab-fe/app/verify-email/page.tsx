"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Mail, RefreshCw } from 'lucide-react';
import { authService } from '@/services/authService';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tokenFromUrl = searchParams.get('token');

    const [token, setToken] = useState(tokenFromUrl || '');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');
    const [resendEmail, setResendEmail] = useState('');
    const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [resendMessage, setResendMessage] = useState('');

    useEffect(() => {
        if (tokenFromUrl) {
            handleVerify(tokenFromUrl);
        }
    }, [tokenFromUrl]);

    const handleVerify = async (tokenToVerify: string) => {
        if (!tokenToVerify.trim()) {
            setStatus('error');
            setMessage('Mã token xác thực không được để trống.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const res = await authService.verifyEmail(tokenToVerify.trim());
            setStatus('success');
            setMessage(res || 'Tài khoản của bạn đã được kích hoạt thành công!');
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'Mã kích hoạt không hợp lệ hoặc đã hết hạn.');
        }
    };

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resendEmail.trim()) return;

        setResendStatus('loading');
        setResendMessage('');

        try {
            const res = await authService.resendVerification(resendEmail.trim());
            setResendStatus('success');
            setResendMessage(res || 'Đã gửi lại email kích hoạt!');
        } catch (err: any) {
            setResendStatus('error');
            setResendMessage(err.message || 'Gửi lại email thất bại. Vui lòng kiểm tra lại địa chỉ email.');
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50/50">
            {/* Ambient Background Gradient Circles */}
            <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100/80 border border-slate-100 text-center">
                    {/* 1. Đang tải / Đang kích hoạt */}
                    {status === 'loading' && (
                        <div className="py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-4 animate-pulse">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Đang kích hoạt tài khoản...</h2>
                            <p className="text-xs text-gray-500">Vui lòng chờ trong giây lát trong khi hệ thống xác thực mã của bạn.</p>
                        </div>
                    )}

                    {/* 2. Kích hoạt thành công */}
                    {status === 'success' && (
                        <div className="py-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                                Kích Hoạt Thành Công!
                            </h2>
                            <p className="text-xs text-gray-600 leading-relaxed mb-8">
                                {message}
                            </p>
                            <Link
                                href="/login"
                                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20"
                            >
                                <span>Đăng Nhập Ngay</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}

                    {/* 3. Kích hoạt thất bại hoặc chưa có token */}
                    {(status === 'error' || status === 'idle') && (
                        <div>
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border ${status === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                {status === 'error' ? <XCircle className="w-8 h-8" /> : <Mail className="w-8 h-8" />}
                            </div>

                            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                                {status === 'error' ? 'Xác Thực Thất Bại' : 'Kích Hoạt Tài Khoản'}
                            </h2>

                            {status === 'error' && (
                                <p className="text-xs text-red-500 mb-6 bg-red-50 py-2.5 px-3.5 rounded-xl border border-red-100">
                                    {message}
                                </p>
                            )}

                            {/* Form nhập Token thủ công */}
                            <div className="text-left mb-6">
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Nhập mã kích hoạt (Token) từ Email:
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        placeholder="Dán mã UUID từ email..."
                                        className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                    <button
                                        onClick={() => handleVerify(token)}
                                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </div>

                            {/* Mục Gửi lại Email kích hoạt */}
                            <div className="pt-6 border-t border-slate-100 text-left">
                                <p className="text-xs font-semibold text-slate-700 mb-2">Chưa nhận được mail hoặc mã hết hạn?</p>
                                <form onSubmit={handleResend} className="flex gap-2">
                                    <input
                                        type="email"
                                        value={resendEmail}
                                        onChange={(e) => setResendEmail(e.target.value)}
                                        placeholder="Nhập email của bạn..."
                                        className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={resendStatus === 'loading'}
                                        className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                                    >
                                        {resendStatus === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                        <span>Gửi lại</span>
                                    </button>
                                </form>
                                {resendStatus === 'success' && (
                                    <p className="text-xs text-emerald-600 mt-2">{resendMessage}</p>
                                )}
                                {resendStatus === 'error' && (
                                    <p className="text-xs text-red-500 mt-2">{resendMessage}</p>
                                )}
                            </div>

                            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between text-xs font-semibold text-slate-500">
                                <Link href="/login" className="hover:text-emerald-700 transition-colors">
                                    ← Về trang Đăng nhập
                                </Link>
                                <Link href="/" className="hover:text-emerald-700 transition-colors">
                                    Trang chủ
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[85vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
