"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Category } from '@/types/product';
import ProductCard from '@/components/common/ProductCard';

interface ProductSuggestionProps {
    products: Product[];
    categories?: Category[];
}

const CATEGORY_CARDS = [
    {
        id: 'ALL',
        slug: 'tat-ca-san-pham',
        name: 'Tất Cả Sản Phẩm',
        imageUrl: '/categories/All.png',
    },
    {
        id: 'SOCOLA',
        slug: 'socola-cacao-thu-cong',
        name: 'Socola & Cacao Thủ Công',
        imageUrl: '/categories/Socola.png',
    },
    {
        id: 'BANH_QUY',
        slug: 'banh-quy-banh-nuong-organic',
        name: 'Bánh Quy & Bánh Nướng Organic',
        imageUrl: '/categories/Bakery.png',
    },
    {
        id: 'KEO_DEO',
        slug: 'keo-deo-keo-thao-moc-tu-nhien',
        name: 'Kẹo Dẻo & Kẹo Thảo Mộc Tự Nhiên',
        imageUrl: '/categories/Candies.png',
    },
    {
        id: 'HOP_QUA',
        slug: 'hop-qua-combo-suc-khoe',
        name: 'Hộp Quà & Combo Sức Khỏe',
        imageUrl: '/categories/Gifts.png',
    },
];

export default function ProductSuggestion({ products, categories }: ProductSuggestionProps) {
    const [activeTab, setActiveTab] = useState<string>('ALL');

    // Lọc sản phẩm theo danh mục được chọn
    const filteredProducts = products.filter((prod) => {
        if (activeTab === 'ALL') return true;
        const name = (prod.name || '').toLowerCase();
        const catName = (prod.categoryName || '').toLowerCase();
        const catSlug = (prod.categorySlug || '').toLowerCase();

        if (activeTab === 'SOCOLA') return name.includes('socola') || catName.includes('socola') || catSlug.includes('socola');
        if (activeTab === 'BANH_QUY') return name.includes('bánh') || name.includes('quy') || catName.includes('bánh') || catSlug.includes('banh');
        if (activeTab === 'KEO_DEO') return name.includes('kẹo') || catName.includes('kẹo') || catSlug.includes('keo');
        if (activeTab === 'HOP_QUA') return name.includes('hộp') || name.includes('quà') || name.includes('combo') || catName.includes('quà') || catSlug.includes('hop');
        return true;
    });

    // Tạo danh sách 5 thẻ đại diện (gồm thẻ Tất Cả Sản Phẩm + 4 ảnh ngành hàng trong /categories)
    const displayCategoryCards = CATEGORY_CARDS.map((card) => {
        if (card.id === 'ALL') return card;
        const found = categories?.find((c) => c.slug === card.slug);
        return {
            ...card,
            name: found?.name || card.name,
            imageUrl: card.imageUrl,
        };
    });

    // Điều khiển Carousel trượt ngang & tự động cuộn khi có > 4 sản phẩm
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Reset cuộn về vị trí đầu mỗi khi thay đổi danh mục tab
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [activeTab]);

    // Tự động trượt qua phải nếu có từ 4 sản phẩm trở lên
    useEffect(() => {
        if (!filteredProducts || filteredProducts.length <= 4 || isHovered) return;

        const interval = setInterval(() => {
            if (!sliderRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            if (scrollLeft + clientWidth >= scrollWidth - 15) {
                sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                sliderRef.current.scrollBy({ left: 310, behavior: 'smooth' });
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [filteredProducts, isHovered]);

    const scrollLeftHandler = () => {
        sliderRef.current?.scrollBy({ left: -310, behavior: 'smooth' });
    };

    const scrollRightHandler = () => {
        sliderRef.current?.scrollBy({ left: 310, behavior: 'smooth' });
    };

    const hasMoreThanFour = filteredProducts && filteredProducts.length > 4;

    return (
        <section className="w-full mt-24 sm:mt-32 md:mt-40 mb-16 md:mb-24">
            {/* Khối 5 ngành hàng trải dài rộng toàn trang, lề trái phải cách vào vừa phải (không phủ sát mép như flashsale) */}
            <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 mb-10">
                {/* Header gợi ý - Căn chính giữa */}
                <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        Gợi Ý Dành Riêng Cho Bạn
                    </h2>
                </div>

                {/* 5 Khung Ảnh Đại Diện: Bao gồm Tất Cả Sản Phẩm (All.png) và 4 ngành hàng, trải rộng toàn trang */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
                    {displayCategoryCards.map((cat) => {
                        const isActive = activeTab === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveTab(cat.id)}
                                className="group flex flex-col items-center cursor-pointer text-center select-none"
                            >
                                {/* Khung ảnh: Chiều cao thấp hơn (tỷ lệ 2:1), vuông góc không radius */}
                                <div className="w-full aspect-[2/1] overflow-hidden bg-slate-50 transition-all duration-200">
                                    <img
                                        src={cat.imageUrl}
                                        alt={cat.name}
                                        className="w-full h-full object-cover object-center pointer-events-none"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Tên ngành hàng đặt phía dưới ảnh */}
                                <div className="mt-2.5 sm:mt-3 flex flex-col items-center">
                                    <span className={`text-xs sm:text-sm font-semibold transition-colors line-clamp-2 px-1 ${isActive
                                            ? 'text-emerald-700 font-bold'
                                            : 'text-slate-800 group-hover:text-emerald-700'
                                        }`}>
                                        {cat.name}
                                    </span>
                                    {isActive && (
                                        <div className="w-6 h-0.5 bg-emerald-600 rounded-full mt-1.5" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Products Carousel / Grid Đồng Bộ (ProductCard) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 bg-slate-50/50 rounded-xl border border-slate-100">
                        <p className="text-sm">Hiện chưa có sản phẩm nào trong danh mục này.</p>
                    </div>
                ) : hasMoreThanFour ? (
                    <div className="relative group/slider">
                        {/* Nút lùi lại (Prev) - Cách xa mép ngoài sản phẩm đầu tiên */}
                        <button
                            type="button"
                            onClick={scrollLeftHandler}
                            aria-label="Xem sản phẩm trước"
                            className="hidden sm:flex absolute -left-4 md:-left-7 lg:-left-10 xl:-left-12 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md border border-slate-200 items-center justify-center text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                        </button>

                        {/* Track danh sách có swipe vuốt & tự động trượt */}
                        <div
                            ref={sliderRef}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 snap-x snap-mandatory scrollbar-none select-none"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {filteredProducts.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="w-[260px] sm:w-[280px] md:w-[285px] lg:w-[calc((100%-72px)/4)] flex-shrink-0 snap-start"
                                >
                                    <ProductCard
                                        id={prod.id}
                                        name={prod.name}
                                        price={prod.price}
                                        originalPrice={prod.originalPrice}
                                        imageUrl={prod.imageUrl}
                                        rating={prod.rating || 5.0}
                                        reviewCount={prod.reviewCount || 64}
                                        soldCount={prod.soldCount || 190}
                                        nutrition={prod.nutrition || { calories: 160, sugarG: 1.5, proteinG: 6.8 }}
                                        dietaryTags={prod.dietaryTags}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Nút tiến tới (Next) - Cách xa mép ngoài sản phẩm cuối dãy */}
                        <button
                            type="button"
                            onClick={scrollRightHandler}
                            aria-label="Xem sản phẩm tiếp theo"
                            className="hidden sm:flex absolute -right-4 md:-right-7 lg:-right-10 xl:-right-12 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md border border-slate-200 items-center justify-center text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                        </button>
                    </div>
                ) : (
                    /* Dưới hoặc bằng 4 sản phẩm: Hiển thị dạng Grid thông thường */
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {filteredProducts.map((prod) => (
                            <ProductCard
                                key={prod.id}
                                id={prod.id}
                                name={prod.name}
                                price={prod.price}
                                originalPrice={prod.originalPrice}
                                imageUrl={prod.imageUrl}
                                rating={prod.rating || 5.0}
                                reviewCount={prod.reviewCount || 64}
                                soldCount={prod.soldCount || 190}
                                nutrition={prod.nutrition || { calories: 160, sugarG: 1.5, proteinG: 6.8 }}
                                dietaryTags={prod.dietaryTags}
                            />
                        ))}
                    </div>
                )}

                {/* Nút Xem Tất Cả Sản Phẩm dẫn sang trang /products */}
                <div className="flex justify-end mt-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-full text-xs shadow-xs hover:shadow-sm transition-colors cursor-pointer"
                    >
                        <span>Xem Tất Cả Sản Phẩm</span>
                        <span>➔</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
