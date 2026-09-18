"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Tag } from 'lucide-react';

const POPULAR_TAGS = [
    { label: 'Socola đen 85%', query: 'Socola Đen' },
    { label: 'Biscotti không đường', query: 'Biscotti' },
    { label: 'Kẹo dẻo Vegan', query: 'Kẹo Dẻo' },
    { label: 'Nama cốt dừa', query: 'Nama' },
    { label: 'Bánh ngói Keto', query: 'Bánh Ngói' },
    { label: 'Hộp quà Healthy', query: 'Hộp Quà' },
];

export default function HeroSection() {
    const router = useRouter();
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = keyword.trim();
        const params = new URLSearchParams();
        if (trimmed) params.set('search', trimmed);
        if (category !== 'all') params.set('category', category);

        const url = `/products${params.toString() ? `?${params.toString()}` : ''}`;
        router.push(url);
    };

    const handleTagClick = (tagQuery: string) => {
        setKeyword(tagQuery);
        router.push(`/products?search=${encodeURIComponent(tagQuery)}`);
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 md:pt-14 pb-10 md:pb-16 mb-4 md:mb-8 relative overflow-hidden">
            {/* SVG Background Curve - Chỉ bao bọc phần Banner trên, không tràn xuống thanh tìm kiếm */}
            <div className="absolute top-0 right-0 w-full md:w-[50%] lg:w-[46%] h-[420px] md:h-[470px] z-0 pointer-events-none hidden md:block overflow-hidden">
                <svg
                    viewBox="0 0 500 500"
                    preserveAspectRatio="none"
                    className="w-full h-full text-emerald-800 filter drop-shadow-[-8px_0_12px_rgba(0,0,0,0.04)]"
                >
                    <path
                        fill="currentColor"
                        d="M160,0 C230,110 90,220 180,330 C240,400 330,440 500,450 L500,0 Z"
                    />
                </svg>
            </div>
            <div className="absolute inset-x-0 top-0 h-[380px] bg-emerald-800 z-0 md:hidden rounded-b-[2.5rem]"></div>

            {/* 1. Phần Banner chính (Text bên trái, Ảnh đĩa bánh kẹo bên phải) */}
            <div className="md:flex items-center justify-between gap-12 relative z-10 min-h-[420px]">
                <div className="max-w-xl space-y-5 z-10 md:text-left text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.18] tracking-tight">
                        Nuông Chiều <br />
                        <span className="text-emerald-600 md:text-emerald-600 text-emerald-400">Cơn Thèm Ngọt</span> <br />
                        Một Cách Lành Mạnh
                    </h1>
                    <p className="text-gray-500 md:text-gray-500 text-emerald-100/80 text-sm md:text-base leading-relaxed">
                        Bật công tắc ngọt lành, xua tan ngày mệt mỏi. Ăn vặt thuần tự nhiên, nuông chiều cơ thể đúng cách.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="#categories"
                            className="inline-block bg-emerald-600 hover:bg-emerald-700 md:bg-emerald-600 md:hover:bg-emerald-700 bg-white text-slate-900 md:text-white font-bold px-8 py-3 rounded-full transition-colors shadow-sm hover:shadow-md text-sm"
                        >
                            Khám Phá Ngay
                        </Link>
                    </div>
                </div>

                <div className="mt-10 md:mt-0 relative w-full md:w-[480px] h-[360px] md:h-[420px] flex items-center justify-center z-10">
                    <div className="w-[300px] sm:w-[360px] h-[300px] sm:h-[360px] bg-white rounded-full border-4 border-white/40 flex items-center justify-center group cursor-pointer shadow-md">
                        <div className="relative w-[340px] sm:w-[420px] h-[260px] sm:h-[300px] flex-shrink-0 flex items-center justify-center select-none">
                            <img
                                src="/Hero_Img.png"
                                alt="Fruits Platter"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Thanh Tìm Kiếm Dời Xuống Dưới Banner & Kéo Dài (Theo phong cách mẫu) */}
            <div className="w-full mt-10 md:mt-14 relative z-20">
                {/* Khung viền ngoài màu xanh nhẹ nhàng bo tròn mềm mại như ảnh mẫu */}
                <div className="bg-[#dce9d8]/85 backdrop-blur-md p-3 sm:p-4 rounded-3xl md:rounded-full max-w-4xl lg:max-w-5xl mx-auto shadow-sm border border-emerald-200/80">
                    
                    {/* Hộp tìm kiếm chính màu trắng dạng viên thuốc (Pill Bar) */}
                    <form 
                        onSubmit={handleSearch}
                        className="bg-white rounded-2xl md:rounded-full p-2 sm:p-2.5 flex flex-col md:flex-row items-center gap-2 sm:gap-3 shadow-md shadow-emerald-950/5 border border-slate-100"
                    >
                        {/* Input nhập từ khóa */}
                        <div className="flex items-center gap-3 flex-1 w-full pl-3 sm:pl-4 py-1">
                            <Search className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Tìm kiếm bánh quy, socola đen, kẹo dẻo healthy, hộp quà..."
                                className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>

                        {/* Đường phân cách thẳng đứng */}
                        <div className="hidden md:block h-8 w-[1px] bg-slate-200" />

                        {/* Dropdown chọn danh mục nhanh */}
                        <div className="flex items-center w-full md:w-auto px-3 py-1 border-t md:border-t-0 border-slate-100">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full md:w-56 bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer py-1"
                            >
                                <option value="all">Tất cả danh mục bánh kẹo</option>
                                <option value="socola-cacao-thu-cong">Socola & Cacao Thủ Công</option>
                                <option value="banh-quy-banh-nuong-organic">Bánh Quy & Bánh Nướng Organic</option>
                                <option value="keo-deo-keo-thao-moc-tu-nhien">Kẹo Dẻo & Thảo Mộc Tự Nhiên</option>
                                <option value="hop-qua-combo-suc-khoe">Hộp Quà & Combo Sức Khỏe</option>
                            </select>
                        </div>

                        {/* Nút bấm Tìm Kiếm màu xanh Emerald nổi bật */}
                        <button
                            type="submit"
                            className="w-full md:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-7 sm:px-9 py-3 rounded-xl md:rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md text-xs sm:text-sm whitespace-nowrap cursor-pointer"
                        >
                            <span>Tìm Kiếm</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                </div>

                {/* Các Tag gợi ý tìm kiếm nhanh ngay dưới thanh tìm kiếm */}
                <div className="max-w-4xl lg:max-w-5xl mx-auto mt-3.5 px-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold mr-1">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        Gợi ý:
                    </span>
                    {POPULAR_TAGS.map((tag, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleTagClick(tag.query)}
                            className="bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 px-3 py-1 rounded-full border border-slate-200/80 transition-colors hover:border-emerald-300 cursor-pointer shadow-2xs text-[11px] sm:text-xs"
                        >
                            #{tag.label}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
