"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import ProductCard from '@/components/common/ProductCard';

interface ProductSuggestionProps {
    products: Product[];
}

const FILTER_TABS = [
    { id: 'ALL', label: 'TẤT CẢ' },
    { id: 'SOCOLA', label: 'SOCOLA' },
    { id: 'BANH_QUY', label: 'BÁNH QUY' },
    { id: 'KEO_DEO', label: 'KẸO DẺO' },
    { id: 'HOP_QUA', label: 'HỘP QUÀ' },
];

export default function ProductSuggestion({ products }: ProductSuggestionProps) {
    const [activeTab, setActiveTab] = useState<string>('ALL');

    // Lọc sản phẩm theo tab được chọn
    const filteredProducts = products.filter((prod) => {
        if (activeTab === 'ALL') return true;
        const name = (prod.name || '').toLowerCase();
        const catName = (prod.categoryName || '').toLowerCase();

        if (activeTab === 'SOCOLA') return name.includes('socola') || catName.includes('socola');
        if (activeTab === 'BANH_QUY') return name.includes('bánh') || name.includes('quy') || catName.includes('bánh');
        if (activeTab === 'KEO_DEO') return name.includes('kẹo') || catName.includes('kẹo');
        if (activeTab === 'HOP_QUA') return name.includes('hộp') || name.includes('quà') || name.includes('combo') || catName.includes('quà');
        return true;
    });

    return (
        <section className="max-w-7xl mx-auto px-6 my-20 md:my-28">
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
                    Gợi Ý Dành Riêng Cho Bạn
                </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-gray-500 mb-8 border-b border-gray-100 pb-3">
                {FILTER_TABS.map((tab, idx) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <React.Fragment key={tab.id}>
                            {idx > 0 && <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>}
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`uppercase transition-all py-1.5 px-3 relative cursor-pointer ${isActive
                                        ? 'text-emerald-700 font-extrabold after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-emerald-700'
                                        : 'hover:text-emerald-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Products Grid Đồng Bộ (ProductCard) - Hiển thị tối đa đúng 4 sản phẩm */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-400 bg-slate-50/50 rounded-xl border border-slate-100">
                    <p className="text-sm">Hiện chưa có sản phẩm nào trong danh mục này.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.slice(0, 4).map((prod) => (
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
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
                >
                    <span>Xem Tất Cả Sản Phẩm</span>
                    <span>➔</span>
                </Link>
            </div>
        </section>
    );
}
