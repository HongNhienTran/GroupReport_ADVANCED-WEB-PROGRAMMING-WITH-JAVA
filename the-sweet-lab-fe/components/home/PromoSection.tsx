import React from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PromoSection() {
    return (
        <section className="w-full bg-slate-50/90 border-t border-slate-200/80 mt-16 md:mt-24 select-none">
            {/* Khối Banner giới thiệu chính: Chiều cao gọn gàng ~ 1/2 bản cũ, chiều rộng full trang */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 md:py-6">
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 md:gap-8">
                    {/* Cột trái: Văn bản giới thiệu thương hiệu súc tích */}
                    <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center text-left">
                        {/* Tag phụ */}
                        <div className="flex items-center gap-2 mb-1.5">
                        </div>

                        {/* Tiêu đề chính phong cách NEW VIBES */}
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase mb-1.5">
                            Vị Ngọt Tự Nhiên, <span className="text-emerald-700">Lối Sống Lành Mạnh</span>
                        </h2>

                        {/* Đoạn mô tả ngắn gọn */}
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mb-3 font-medium">
                            <strong className="text-slate-900 font-bold">The Sweet Lab</strong> – phòng thí nghiệm vị giác thuần tự nhiên. Toàn bộ bánh kẹo, socola hữu cơ được nghiên cứu từ 100% nguyên liệu sạch, ít calo và không đường tinh luyện.
                        </p>

                        {/* Nút Call to Action gọn gàng */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="#categories"
                                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200 shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span>Khám Phá Bộ Sưu Tập</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                                href="#flash-sale"
                                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                <span>Ưu Đãi Đặc Biệt</span>
                            </Link>
                        </div>
                    </div>

                    {/* Cột phải: Ảnh ngang compact, chiều cao thấp gọn */}
                    <div className="hidden md:block md:col-span-5 lg:col-span-4 h-32 md:h-40 rounded-xl relative overflow-hidden bg-slate-200 border border-slate-200/80 shadow-xs group">
                        <img
                            src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop"
                            alt="The Sweet Lab Healthy Sweets Collection"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/15 via-transparent to-transparent pointer-events-none" />

                    </div>
                </div>
            </div>

            {/* Phần dưới: Thanh 4 cam kết dịch vụ sát liền với footer */}
            <div className="border-t border-slate-200/70 bg-white/80 px-4 sm:px-6 py-3.5 md:py-4">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Item 1 */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100/80">
                            <Truck className="w-4 h-4 stroke-[1.8]" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wide">
                                GIAO SIÊU TỐC
                            </h4>
                            <p className="text-[10px] text-slate-500 font-medium">
                                Bảo quản lạnh, giao tận nơi
                            </p>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100/80">
                            <RotateCcw className="w-4 h-4 stroke-[1.8]" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wide">
                                ĐỔI TRẢ DỄ DÀNG
                            </h4>
                            <p className="text-[10px] text-slate-500 font-medium">
                                Trong 7 ngày nếu lỗi sản phẩm
                            </p>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100/80">
                            <Award className="w-4 h-4 stroke-[1.8]" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wide">
                                CHUẨN DINH DƯỠNG
                            </h4>
                            <p className="text-[10px] text-slate-500 font-medium">
                                Kiểm định calo & hữu cơ
                            </p>
                        </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100/80">
                            <ShieldCheck className="w-4 h-4 stroke-[1.8]" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wide">
                                THANH TOÁN AN TOÀN
                            </h4>
                            <p className="text-[10px] text-slate-500 font-medium">
                                Bảo mật 100% VNPay / MoMo
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
