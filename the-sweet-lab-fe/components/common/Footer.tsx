import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-emerald-50/60 border-t border-emerald-100/50 mt-0 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">

                {/* Lưới các cột thông tin chính */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">

                    {/* Cột 1: Về Chúng Tôi */}
                    <div className="space-y-3">
                        <h4 className="font-black text-slate-950 text-xs sm:text-sm tracking-wider uppercase">
                            Về Chúng Tôi
                        </h4>
                        <ul className="space-y-2 text-xs font-medium text-slate-600">
                            <li>
                                <Link href="#" className="hover:text-emerald-700 transition-colors">Câu chuyện thương hiệu</Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-emerald-700 transition-colors">Tất cả sản phẩm</Link>
                            </li>
                            <li>
                                <Link href="#categories" className="hover:text-emerald-700 transition-colors">Danh mục dinh dưỡng</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-700 transition-colors">Chứng nhận hữu cơ</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 2: Chính Sách */}
                    <div className="space-y-3">
                        <h4 className="font-black text-slate-950 text-xs sm:text-sm tracking-wider uppercase">
                            Chính Sách
                        </h4>
                        <ul className="space-y-2 text-xs font-medium text-slate-600">
                            <li>
                                <Link href="#" className="hover:text-emerald-700 transition-colors">Chính sách đổi trả 7 ngày</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-700 transition-colors">Chính sách bảo mật</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-700 transition-colors">Điều khoản dịch vụ</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-700 transition-colors">Cam kết chất lượng</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ Trợ & Mua Hàng */}
                    <div className="space-y-3">
                        <h4 className="font-black text-slate-950 text-xs sm:text-sm tracking-wider uppercase">
                            Hỗ Trợ Mua Hàng
                        </h4>
                        <ul className="space-y-2 text-xs font-medium text-slate-600">
                            <li>
                                <Link href="#" className="hover:text-emerald-700 transition-colors">Phương thức vận chuyển</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-700 transition-colors">Hình thức thanh toán</Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-emerald-700 transition-colors">Tài khoản & Đơn hàng</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-700 transition-colors">Hỏi đáp dinh dưỡng</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 4: Liên Hệ & Hợp Tác */}
                    <div className="space-y-3">
                        <h4 className="font-black text-slate-950 text-xs sm:text-sm tracking-wider uppercase">
                            Liên Hệ
                        </h4>
                        <ul className="space-y-2 text-xs font-medium text-slate-600">
                            <li>
                                Hotline: <span className="font-bold text-slate-900">1900 6868</span>
                            </li>
                            <li className="break-all">
                                Email: <a href="mailto:contact@thesweetlab.com" className="hover:text-emerald-700 transition-colors font-medium">contact@thesweetlab.com</a>
                            </li>
                            <li>
                                Giờ hoạt động: 08:00 - 21:30 hàng ngày
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Đường gạch ngang phân cách & Logo chuẩn The Sweet Lab. */}
                <div className="border-t border-emerald-100/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    {/* Logo thương hiệu viết chuẩn như Header */}
                    <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 hover:opacity-95 transition-opacity">
                        The Sweet <span className="text-emerald-600">Lab.</span>
                    </Link>

                    {/* Dòng bản quyền */}
                    <div className="text-slate-500 font-medium text-center sm:text-right text-[11px] sm:text-xs">
                        Copyright © {new Date().getFullYear()} <strong className="text-slate-700 font-bold">The Sweet Lab</strong>. All rights reserved.
                    </div>
                </div>

            </div>
        </footer>
    );
}