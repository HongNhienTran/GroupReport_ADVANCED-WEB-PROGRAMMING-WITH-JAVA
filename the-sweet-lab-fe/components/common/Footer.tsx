import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-emerald-50/60 border-t border-emerald-100/50 mt-12">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Lưới các cột thông tin chính */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">

                    {/* Cột 1: Về Chúng Tôi */}
                    <div className="space-y-3">
                        <h4 className="font-black text-slate-950 text-sm tracking-wide uppercase">Về Chúng Tôi</h4>
                        <ul className="space-y-2 text-xs font-medium text-gray-600">
                            <li>
                                <Link href="#" className="hover:text-emerald-600 transition-colors">Về Chúng Tôi</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-600 transition-colors">Chợ bánh</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-600 transition-colors">Thanh Toán</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 2: Chính Sách */}
                    <div className="space-y-3">
                        <h4 className="font-black text-slate-950 text-sm tracking-wide uppercase">Chính Sách</h4>
                        <ul className="space-y-2 text-xs font-medium text-gray-600">
                            <li>
                                <Link href="#" className="hover:text-emerald-600 transition-colors">Chợ sách</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-600 transition-colors">Tính Thẩm Mỹ</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-600 transition-colors">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Thanh Toán */}
                    <div className="space-y-3">
                        <h4 className="font-black text-slate-950 text-sm tracking-wide uppercase">Thanh Toán</h4>
                        <ul className="space-y-2 text-xs font-medium text-gray-600">
                            <li>
                                <Link href="#" className="hover:text-emerald-600 transition-colors">Vận chuyển</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-600 transition-colors">Log In</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 4: Contact Us */}
                    <div className="space-y-3">
                        <h4 className="font-black text-slate-950 text-sm tracking-wide uppercase">Contact Us</h4>
                        <ul className="space-y-2 text-xs font-medium text-gray-600">
                            <li className="break-all">
                                Email: <a href="mailto:Emailkm@thesweetLab.com" className="hover:text-emerald-600 transition-colors">Emailkm@thesweetLab.com</a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Đường gạch ngang phân cách */}
                <div className="border-t border-emerald-100/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-gray-500 tracking-wide">
                    <div>
                        The Sweet Lab.
                    </div>
                    <div>
                        Copyright © The Sweet Lab.
                    </div>
                </div>

            </div>
        </footer>
    );
}