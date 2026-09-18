"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { Category } from '@/types/product';

interface CategoryGridProps {
    categories: Category[];
}

interface CategoryMeta {
    image: string;
    tagline: string;
    highlights: string[];
}

const CATEGORY_META: Record<string, CategoryMeta> = {
    'socola-cacao-thu-cong': {
        image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=800',
        tagline: 'Socola Đen & Nama Thủ Công',
        highlights: ['Bean-to-bar 70% - 100%', 'Nama cốt dừa thuần chay', 'Chống oxy hóa Polyphenol']
    },
    'banh-quy-banh-nuong-organic': {
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800',
        tagline: 'Ngũ Cốc Nguyên Cám & Eat Clean',
        highlights: ['Biscotti không đường', 'Bánh ngói hạnh nhân Keto', 'Giàu chất xơ & protein']
    },
    'keo-deo-keo-thao-moc-tu-nhien': {
        image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=800',
        tagline: 'Pectin Quả Mọng Thuần Chay',
        highlights: ['100% Pectin táo tự nhiên', 'Không gelatin động vật', 'Bổ sung Vitamin C hữu cơ']
    },
    'hop-qua-combo-suc-khoe': {
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800',
        tagline: 'Quà Tặng Tinh Tế & Thân Thiện',
        highlights: ['Hộp Kraft & giỏ mây tre đan', 'Bánh kẹo dinh dưỡng tuyển chọn', 'Gắn kết yêu thương']
    }
};

// Dữ liệu fallback chuẩn 4 danh mục nếu chưa nạp API
const DEFAULT_CATEGORIES: Category[] = [
    {
        id: 'cat-1',
        name: 'Socola & Cacao Thủ Công',
        slug: 'socola-cacao-thu-cong',
        productCount: 4,
        description: 'Dòng socola đen bean-to-bar nguyên chất, nama tươi mềm tan và bột cacao nguyên chất giàu chất chống oxy hóa tự nhiên.',
        imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=800'
    },
    {
        id: 'cat-2',
        name: 'Bánh Quy & Bánh Nướng Organic',
        slug: 'banh-quy-banh-nuong-organic',
        productCount: 4,
        description: 'Bánh nướng ngũ cốc nguyên cám, bánh ngói hạnh nhân Keto và Biscotti giòn tan không đường, giàu chất xơ và đạm thực vật sạch.',
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800'
    },
    {
        id: 'cat-3',
        name: 'Kẹo Dẻo & Kẹo Thảo Mộc Tự Nhiên',
        slug: 'keo-deo-keo-thao-moc-tu-nhien',
        productCount: 4,
        description: 'Kẹo dẻo hoa quả thuần chay từ pectin táo tự nhiên, 100% nước ép quả mọng và kẹo ngậm thảo dược thông họng không đường.',
        imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=800'
    },
    {
        id: 'cat-4',
        name: 'Hộp Quà & Combo Sức Khỏe',
        slug: 'hop-qua-combo-suc-khoe',
        productCount: 4,
        description: 'Set quà biếu sức khỏe tinh tế với giỏ mây tre đan thủ công, hộp giấy kraft eco-friendly và các dòng bánh kẹo healthy trao gửi tình thân.',
        imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800'
    }
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Lấy tối đa 4 danh mục chính (ưu tiên dữ liệu thật từ backend, nếu thiếu thì dùng default)
    const displayCategories = categories && categories.length > 0 
        ? categories.slice(0, 4) 
        : DEFAULT_CATEGORIES;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 my-14 md:my-20 select-none">
            {/* Tiêu đề phần Ngành Hàng */}
            <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-100">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DANH MỤC TUYỂN CHỌN</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase leading-tight font-serif">
                    Khám Phá Ngành Hàng Dinh Dưỡng
                </h2>
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase mt-2">
                    4 dòng sản phẩm chuẩn organic, không đường tinh luyện & dồi dào năng lượng sạch
                </p>
            </div>

            {/* 4 Khung Ảnh Ngành Hàng (Grid 4 cột) có hiệu ứng Hover xem chi tiết như Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {displayCategories.map((cat, idx) => {
                    const meta = CATEGORY_META[cat.slug] || {
                        image: cat.imageUrl || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800',
                        tagline: 'Dòng sản phẩm healthy tự nhiên',
                        highlights: ['100% Nguyên liệu sạch', 'Không chất bảo quản', 'Chuẩn calo & dinh dưỡng']
                    };

                    const bgImage = cat.imageUrl && cat.imageUrl.startsWith('http') 
                        ? cat.imageUrl 
                        : meta.image;

                    return (
                        <div
                            key={String(cat.id || idx)}
                            className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-200/80"
                            onMouseEnter={() => setHoveredId(String(cat.id || idx))}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Ảnh nền Ngành Hàng (Zoom mượt mà khi hover) */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                                <img
                                    src={bgImage}
                                    alt={cat.name}
                                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>

                            {/* Lớp phủ mặc định (Default State) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent p-5 flex flex-col justify-end transition-opacity duration-300 group-hover:opacity-0">
                                <div className="space-y-1">
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        {cat.productCount ? `${cat.productCount} Sản phẩm` : '4 Sản phẩm'}
                                    </span>
                                    <h3 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-md">
                                        {cat.name}
                                    </h3>
                                    <p className="text-xs text-amber-300 font-semibold drop-shadow-sm truncate">
                                        {meta.tagline}
                                    </p>
                                </div>
                            </div>

                            {/* Lớp phủ chi tiết khi Trỏ Chuột (Hover State) giống Brand */}
                            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md p-5 flex flex-col justify-between text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                                
                                {/* Top: Tag, Tên và Mô tả */}
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            Ngành Hàng #{idx + 1}
                                        </span>
                                        <span className="text-[10px] text-emerald-400 font-semibold">
                                            {cat.productCount ? `${cat.productCount} sản phẩm` : '4 sản phẩm'}
                                        </span>
                                    </div>

                                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                                        {cat.name}
                                    </h3>

                                    <p className="text-[11px] sm:text-xs font-semibold text-amber-300 mt-1 line-clamp-1">
                                        {meta.tagline}
                                    </p>

                                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2.5 line-clamp-3 font-normal">
                                        {cat.description || 'Khám phá các dòng sản phẩm chất lượng cao, an toàn cho sức khỏe và giàu dinh dưỡng tự nhiên.'}
                                    </p>
                                </div>

                                {/* Bottom: Các điểm nổi bật & Nút Xem Sản Phẩm */}
                                <div className="pt-3 border-t border-white/10">
                                    <div className="space-y-1.5 mb-4">
                                        {meta.highlights.map((highlight, hIdx) => (
                                            <div key={hIdx} className="flex items-center gap-1.5 text-[11px] text-slate-200">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                                <span className="truncate">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href={`/products?category=${cat.slug}`}
                                        className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-emerald-400 px-3.5 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-95"
                                    >
                                        <span>Khám Phá Danh Mục</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
