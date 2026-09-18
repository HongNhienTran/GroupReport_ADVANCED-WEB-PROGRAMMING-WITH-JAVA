"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FlashSaleProduct } from '@/types/product';
import ProductCard from '@/components/common/ProductCard';

interface FlashSaleProps {
    flashSales: FlashSaleProduct[];
}

export default function FlashSale({ flashSales }: FlashSaleProps) {
    // 1. Đồng hồ đếm ngược kết thúc (3 giờ 45 phút 12 giây)
    const [timeLeft, setTimeLeft] = useState<number>(3 * 3600 + 45 * 60 + 12);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

    // 2. Tự động chạy trượt (Auto-scroll carousel) khi có trên 4 sản phẩm
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!flashSales || flashSales.length <= 4 || isHovered) return;

        const interval = setInterval(() => {
            if (!sliderRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            // Nếu cuộn gần hết thì quay lại đầu, ngược lại cuộn tiếp 1 thẻ sản phẩm
            if (scrollLeft + clientWidth >= scrollWidth - 15) {
                sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [flashSales, isHovered]);

    const scrollLeftHandler = () => {
        sliderRef.current?.scrollBy({ left: -310, behavior: 'smooth' });
    };

    const scrollRightHandler = () => {
        sliderRef.current?.scrollBy({ left: 310, behavior: 'smooth' });
    };

    const hasMoreThanFour = flashSales && flashSales.length > 4;

    return (
        <section id="flash-sale" className="w-full my-16 md:my-24 select-none">
            {/* 
              Thanh Banner Dual-Tone Rộng Toàn Trang (Full Width): 
              - Nền xanh và trắng vẫn kéo dài toàn màn hình (full-bleed)
              - Chữ FLASH SALE căn lề thẳng đứng với rìa sản phẩm bên trái (max-w-7xl px-4 sm:px-6)
              - Đồng hồ đếm ngược căn lề thẳng đứng với rìa sản phẩm ngoài cùng bên phải
            */}
            <div className="relative w-full border-y border-slate-200/90 shadow-2xs mb-8 sm:mb-10 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                    <div className="flex flex-col md:flex-row items-stretch justify-between">
                        
                        {/* 1. Bên Trái: Màu Xanh Tone Web (bg-emerald-800), không icon. 
                            Căn lề trái thẳng hàng với rìa sản phẩm bên trái (pl-0) */}
                        <div className="relative md:w-[55%] lg:w-[52%] flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 sm:py-6 pl-0 pr-12 md:pr-18 text-white z-10">
                            {/* Lớp nền xanh mở rộng vô tận sang mép trái màn hình */}
                            <div className="hidden md:block absolute top-0 bottom-0 right-[calc(100%-1px)] w-[100vw] bg-emerald-800 -z-10 pointer-events-none" />
                            
                            {/* Lớp nền xanh chính của banner với đường cắt vát chéo sang mép phải */}
                            <div className="hidden md:block absolute inset-0 bg-emerald-800 -z-10 [clip-path:polygon(0_0,100%_0,calc(100%-48px)_100%,0_100%)] pointer-events-none" />

                            {/* Nền xanh tràn toàn bộ cho mobile */}
                            <div className="md:hidden absolute top-0 bottom-0 -left-[100vw] -right-[100vw] bg-emerald-800 -z-10" />

                            {/* Tiêu đề Flash Sale - căn lề thẳng hàng với mép trái sản phẩm */}
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block mb-0.5">
                                    Ưu Đãi Giờ Vàng
                                </span>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                    FLASH SALE
                                </h2>
                            </div>

                            {/* Badge Giảm Giá Up To % */}
                            <div className="flex items-center">
                                <div className="bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm tracking-wide shadow-sm flex items-center gap-1.5 border border-amber-300">
                                    <span>UP TO</span>
                                    <span className="text-base sm:text-xl font-extrabold">40% OFF</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Bên Phải: Nền Trắng hiển thị đồng hồ đếm ngược.
                            Căn lề phải thẳng hàng với mép phải sản phẩm cuối cùng (pr-0) */}
                        <div className="relative md:w-[45%] lg:w-[48%] flex flex-col sm:flex-row items-center justify-center md:justify-end gap-3 sm:gap-6 py-5 sm:py-6 pl-4 md:pl-8 pr-0 z-10 bg-white">
                            <div className="text-center sm:text-right">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                    Kết thúc trong
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-700 hidden sm:block">
                                    Số lượng có hạn
                                </span>
                            </div>

                            {/* Khối các ô số đếm ngược thời gian */}
                            <div className="flex items-center gap-2 sm:gap-2.5">
                                {/* Giờ */}
                                <div className="flex flex-col items-center">
                                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-slate-900 text-white flex items-center justify-center text-base sm:text-xl font-extrabold shadow-xs">
                                        {hours}
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mt-1">Giờ</span>
                                </div>

                                <span className="text-base sm:text-xl font-bold text-slate-400 -mt-3.5">:</span>

                                {/* Phút */}
                                <div className="flex flex-col items-center">
                                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-slate-900 text-white flex items-center justify-center text-base sm:text-xl font-extrabold shadow-xs">
                                        {minutes}
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mt-1">Phút</span>
                                </div>

                                <span className="text-base sm:text-xl font-bold text-slate-400 -mt-3.5">:</span>

                                {/* Giây */}
                                <div className="flex flex-col items-center">
                                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-base sm:text-xl font-extrabold shadow-xs">
                                        {seconds}
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 uppercase mt-1">Giây</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Danh sách sản phẩm Flash Sale: Hỗ trợ swipe vuốt trái phải & tự động trượt khi có trên 4 sản phẩm */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                {hasMoreThanFour ? (
                    <div className="relative group/slider">
                        {/* Nút lùi lại (Prev) */}
                        <button
                            type="button"
                            onClick={scrollLeftHandler}
                            aria-label="Xem sản phẩm trước"
                            className="hidden sm:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 items-center justify-center text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                        </button>

                        {/* Track danh sách có swipe cảm ứng & tự động chạy */}
                        <div
                            ref={sliderRef}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 snap-x snap-mandatory scrollbar-none select-none"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {flashSales.map((item) => (
                                <div
                                    key={item.id}
                                    className="w-[260px] sm:w-[280px] md:w-[285px] lg:w-[calc((100%-72px)/4)] flex-shrink-0 snap-start"
                                >
                                    <ProductCard
                                        id={item.id}
                                        name={item.name}
                                        price={item.price}
                                        originalPrice={item.oldPrice}
                                        imageUrl={item.imageUrl}
                                        rating={item.rating || 4.9}
                                        reviewCount={item.reviewCount || 128}
                                        soldCount={item.soldCount || 350}
                                        nutrition={item.nutrition || { calories: 145, sugarG: 2.0, proteinG: 5.5 }}
                                        dietaryTags={item.dietaryTags || ['FLASH SALE']}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Nút tiến tới (Next) */}
                        <button
                            type="button"
                            onClick={scrollRightHandler}
                            aria-label="Xem sản phẩm tiếp theo"
                            className="hidden sm:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 items-center justify-center text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                        </button>
                    </div>
                ) : (
                    /* Dưới 4 sản phẩm: Hiển thị dạng Grid thông thường */
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {flashSales.map((item) => (
                            <ProductCard
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                originalPrice={item.oldPrice}
                                imageUrl={item.imageUrl}
                                rating={item.rating || 4.9}
                                reviewCount={item.reviewCount || 128}
                                soldCount={item.soldCount || 350}
                                nutrition={item.nutrition || { calories: 145, sugarG: 2.0, proteinG: 5.5 }}
                                dietaryTags={item.dietaryTags || ['FLASH SALE']}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
