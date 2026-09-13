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
            className="max-w-7xl mx-auto px-4 sm:px-6 my-14 md:my-20 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* 1. Tiêu đề phân mục - ĐƯỢC ĐẶT GẦN HƠN VỚI BANNER ĐANG CHẠY */}
            <div className="text-center mb-3 md:mb-5">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Khám Phá Ngành Hàng Dinh Dưỡng
                </h2>
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

                    {/* --- Card Trái (Phong cách phẳng tự nhiên, chuyển động mượt mà) --- */}
                    <div
                        onClick={handlePrev}
                        title={`Xem ${prevCategory?.name}`}
                        className="hidden sm:flex flex-col items-center justify-center w-36 md:w-48 lg:w-56 h-[300px] md:h-[350px] p-4 bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/60 rounded-md shadow-2xs hover:shadow-xs cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform scale-90 hover:scale-95 opacity-55 hover:opacity-85 flex-shrink-0"
                    >
                        <div className="w-28 h-36 md:w-36 md:h-44 flex items-center justify-center my-auto rounded-sm overflow-hidden bg-white/60 flex-shrink-0">
                            <img
                                src={prevCategory?.imageUrl}
                                alt={prevCategory?.name}
                                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out"
                            />
                        </div>
                        <div className="text-center w-full flex-shrink-0 pt-2">
                            <h4 className="font-bold text-xs md:text-sm text-slate-700 line-clamp-1">
                                {prevCategory?.name}
                            </h4>
                        </div>
                    </div>

                    {/* --- Card Giữa (LỚN - Phong cách tự nhiên, không bo góc gượng gạo, chuyển động êm ái) --- */}
                    <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-[360px] sm:h-[380px] md:h-[420px] bg-slate-50/90 border border-slate-200/80 rounded-lg p-6 sm:p-8 md:p-10 shadow-md shadow-slate-900/5 relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform scale-100 z-20 flex-shrink-0">
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center h-full">
                            {/* Khối ảnh bên trái */}
                            <div className="flex items-center justify-center h-full relative">
                                <div className="w-48 h-56 sm:w-56 sm:h-64 md:w-64 md:h-76 flex items-center justify-center rounded-md overflow-hidden shadow-xs bg-white/70 flex-shrink-0">
                                    <img
                                        key={activeCategory?.id}
                                        src={activeCategory?.bannerUrl}
                                        alt={activeCategory?.name}
                                        className="w-full h-full object-cover select-none pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                                    />
                                </div>
                            </div>

                            {/* Khối nội dung bên phải */}
                            <div className="flex flex-col justify-between h-full md:pl-2 text-left py-2">
                                <div className="space-y-3">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 leading-tight tracking-tight line-clamp-2 h-14 sm:h-16 md:h-18 flex items-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                                        {activeCategory?.name}
                                    </h3>

                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 h-14 sm:h-16 md:h-18 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                                        {activeCategory?.description}
                                    </p>
                                </div>

                                <div className="pt-2 mt-auto">
                                    <Link
                                        href={`/products?category=${activeCategory?.slug}`}
                                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs sm:text-sm shadow-xs hover:shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                                    >
                                        <span>Xem Sản Phẩm</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Card Phải (Phong cách phẳng tự nhiên, chuyển động mượt mà) --- */}
                    <div
                        onClick={handleNext}
                        title={`Xem ${nextCategory?.name}`}
                        className="hidden sm:flex flex-col items-center justify-center w-36 md:w-48 lg:w-56 h-[300px] md:h-[350px] p-4 bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/60 rounded-md shadow-2xs hover:shadow-xs cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform scale-90 hover:scale-95 opacity-55 hover:opacity-85 flex-shrink-0"
                    >
                        <div className="w-28 h-36 md:w-36 md:h-44 flex items-center justify-center my-auto rounded-sm overflow-hidden bg-white/60 flex-shrink-0">
                            <img
                                src={nextCategory?.imageUrl}
                                alt={nextCategory?.name}
                                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out"
                            />
                        </div>
                        <div className="text-center w-full flex-shrink-0 pt-2">
                            <h4 className="font-bold text-xs md:text-sm text-slate-700 line-clamp-1">
                                {nextCategory?.name}
                            </h4>
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
                            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${isActive ? 'w-7 bg-emerald-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                                }`}
                        />
                    );
                })}
            </div>
        </section>
    );
}
