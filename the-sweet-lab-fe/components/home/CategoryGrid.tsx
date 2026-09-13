"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Category } from '@/types/product';

interface CategoryGridProps {
    categories: Category[];
}

const AUTO_PLAY_INTERVAL = 4500; // Tự động luân chuyển sau 4.5 giây

export default function CategoryGrid({ categories }: CategoryGridProps) {
    const items = categories.length > 0 ? categories.map((cat) => ({
        ...cat,
        description: cat.description || `Khám phá các dòng sản phẩm ${cat.name} organic, 100% tự nhiên, không đường hóa học và an toàn cho sức khỏe.`,
        bannerUrl: cat.bannerUrl || cat.imageUrl
    })) : [];

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const total = items.length;

    const handlePrev = useCallback(() => {
        if (total === 0) return;
        setActiveIndex((prev) => (prev - 1 + total) % total);
    }, [total]);

    const handleNext = useCallback(() => {
        if (total === 0) return;
        setActiveIndex((prev) => (prev + 1) % total);
    }, [total]);

    // 1. Cơ chế tự động chuyển động mượt mà khi không tương tác
    useEffect(() => {
        if (total <= 1 || isPaused) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            handleNext();
        }, AUTO_PLAY_INTERVAL);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [total, isPaused, handleNext]);

    // 2. Hỗ trợ phím mũi tên trái / phải
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrev, handleNext]);

    if (total === 0) return null;

    const prevIndex = (activeIndex - 1 + total) % total;
    const nextIndex = (activeIndex + 1) % total;

    const prevCategory = items[prevIndex];
    const activeCategory = items[activeIndex];
    const nextCategory = items[nextIndex];

    return (
        <section
            id="categories"
            className="max-w-7xl mx-auto px-4 sm:px-6 my-10 md:my-16 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* 1. Tiêu đề phân mục - ĐƯỢC ĐẶT GẦN HƠN VỚI BANNER ĐANG CHẠY */}
            <div className="text-center mb-3 md:mb-5">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Khám Phá Ngành Hàng Dinh Dưỡng
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg mx-auto leading-relaxed">
                    Chọn danh mục để xem các dòng bánh kẹo healthy thuần tự nhiên và tốt cho sức khỏe
                </p>
            </div>

            {/* 2. Container Coverflow 3 Cards (Bo góc tự nhiên rounded-2xl, chuyển động mượt mà) */}
            <div className="relative flex items-center justify-center h-[420px] md:h-[460px] py-2 px-6 sm:px-10 md:px-14">
                {/* Mũi tên điều hướng Trái */}
                <button
                    onClick={handlePrev}
                    aria-label="Danh mục trước"
                    className="absolute left-0 sm:left-2 md:left-4 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-700 rounded-full shadow-md hover:shadow-lg border border-slate-100 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Ba Cards: Trái (Nhỏ tự nhiên), Giữa (Lớn nội dung), Phải (Nhỏ tự nhiên) */}
                <div className="w-full h-full flex items-center justify-center gap-4 sm:gap-6 md:gap-8 overflow-hidden">

                    {/* --- Card Trái (Bo góc tự nhiên rounded-2xl) --- */}
                    <div
                        onClick={handlePrev}
                        title={`Xem ${prevCategory?.name}`}
                        className="hidden sm:flex flex-col items-center justify-between w-36 md:w-48 lg:w-56 h-[320px] md:h-[380px] p-4 md:p-5 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/70 rounded-2xl shadow-xs hover:shadow-sm cursor-pointer transition-all duration-700 ease-out transform scale-90 hover:scale-95 opacity-60 hover:opacity-85 flex-shrink-0"
                    >
                        <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full flex-shrink-0">
                            Trước đó
                        </span>
                        <div className="w-28 h-36 md:w-36 md:h-44 flex items-center justify-center my-auto rounded-xl overflow-hidden shadow-xs bg-white/60 flex-shrink-0">
                            <img
                                src={prevCategory?.imageUrl}
                                alt={prevCategory?.name}
                                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500"
                            />
                        </div>
                        <div className="text-center w-full flex-shrink-0 h-9 flex flex-col justify-center">
                            <h4 className="font-bold text-xs md:text-sm text-slate-700 line-clamp-1">
                                {prevCategory?.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                                {prevCategory?.productCount} sản phẩm
                            </p>
                        </div>
                    </div>

                    {/* --- Card Giữa (LỚN - Cố định kích thước & bo góc rounded-2xl tự nhiên) --- */}
                    <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-[360px] sm:h-[380px] md:h-[420px] bg-slate-50/85 border border-emerald-100/60 rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg shadow-slate-900/5 relative overflow-hidden transition-all duration-700 ease-out transform scale-100 z-20 flex-shrink-0">
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center h-full">
                            {/* Khối ảnh bên trái (Bo góc rounded-xl tự nhiên) */}
                            <div className="flex items-center justify-center h-full relative">
                                <div className="w-48 h-56 sm:w-56 sm:h-64 md:w-64 md:h-76 flex items-center justify-center rounded-xl overflow-hidden shadow-sm bg-white/60 flex-shrink-0">
                                    <img
                                        key={activeCategory?.id}
                                        src={activeCategory?.bannerUrl}
                                        alt={activeCategory?.name}
                                        className="w-full h-full object-cover select-none pointer-events-none transition-all duration-700 ease-out"
                                    />
                                </div>
                            </div>

                            {/* Khối nội dung bên phải (Cố định chiều cao, chuyển động chữ mượt mà) */}
                            <div className="flex flex-col justify-between h-full md:pl-2 text-left py-1">
                                <div className="space-y-2.5">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-emerald-100/70 text-emerald-800 text-[11px] font-bold rounded-full">
                                        <span>Danh mục nổi bật</span>
                                        <span>•</span>
                                        <span>{activeCategory?.productCount} sản phẩm</span>
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 leading-tight tracking-tight line-clamp-2 h-14 sm:h-16 md:h-18 flex items-center transition-all duration-500">
                                        {activeCategory?.name}
                                    </h3>

                                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-3 h-14 sm:h-16 md:h-18 transition-all duration-500">
                                        {activeCategory?.description}
                                    </p>
                                </div>

                                <div className="pt-2 mt-auto">
                                    <Link
                                        href={`/products?category=${activeCategory?.slug}`}
                                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                                    >
                                        <span>Xem Tất Cả Sản Phẩm</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Card Phải (Bo góc tự nhiên rounded-2xl) --- */}
                    <div
                        onClick={handleNext}
                        title={`Xem ${nextCategory?.name}`}
                        className="hidden sm:flex flex-col items-center justify-between w-36 md:w-48 lg:w-56 h-[320px] md:h-[380px] p-4 md:p-5 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/70 rounded-2xl shadow-xs hover:shadow-sm cursor-pointer transition-all duration-700 ease-out transform scale-90 hover:scale-95 opacity-60 hover:opacity-85 flex-shrink-0"
                    >
                        <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full flex-shrink-0">
                            Tiếp theo
                        </span>
                        <div className="w-28 h-36 md:w-36 md:h-44 flex items-center justify-center my-auto rounded-xl overflow-hidden shadow-xs bg-white/60 flex-shrink-0">
                            <img
                                src={nextCategory?.imageUrl}
                                alt={nextCategory?.name}
                                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500"
                            />
                        </div>
                        <div className="text-center w-full flex-shrink-0 h-9 flex flex-col justify-center">
                            <h4 className="font-bold text-xs md:text-sm text-slate-700 line-clamp-1">
                                {nextCategory?.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                                {nextCategory?.productCount} sản phẩm
                            </p>
                        </div>
                    </div>

                </div>

                {/* Mũi tên điều hướng Phải */}
                <button
                    onClick={handleNext}
                    aria-label="Danh mục tiếp theo"
                    className="absolute right-0 sm:right-2 md:right-4 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-700 rounded-full shadow-md hover:shadow-lg border border-slate-100 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>

            {/* Indicator Dots - 4 chấm chọn nhanh 4 danh mục */}
            <div className="flex items-center justify-center gap-2 mt-4">
                {items.map((cat, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`Chọn danh mục ${cat.name}`}
                            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                                isActive ? 'w-7 bg-emerald-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                            }`}
                        />
                    );
                })}
            </div>
        </section>
    );
}
