"use client";

import React, { useState } from 'react';
import { Category } from '@/types/product';

interface CategoryGridProps {
    categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
    const defaultCategories = categories.map((cat) => ({
        ...cat,
        description: cat.description || `Khám phá các dòng sản phẩm ${cat.name} organic, 100% tự nhiên, không đường hóa học và an toàn cho sức khỏe.`,
        bannerUrl: cat.bannerUrl || cat.imageUrl
    }));

    const [selectedId, setSelectedId] = useState<number>(defaultCategories[0]?.id || 1);
    const activeCategory = defaultCategories.find(cat => cat.id === selectedId) || defaultCategories[0];

    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-50/50 rounded-3xl p-8 md:p-12 mb-12 border border-emerald-100/20 relative overflow-hidden min-h-[360px]">

                <div className="flex items-center justify-center relative min-h-[260px] md:min-h-[300px] order-1 md:order-1">
                    <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center animate-float-main transition-all duration-500 transform">
                        <img
                            key={activeCategory?.id}
                            src={activeCategory?.bannerUrl}
                            alt={activeCategory?.name}
                            className="w-full h-full object-contain filter drop-shadow-xl select-none pointer-events-none animate-scaleIn"
                        />
                    </div>
                </div>

                <div className="space-y-4 z-10 transition-all duration-500 animate-fadeIn order-2 md:order-2 md:pl-8">
                    <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        [ Khám Phá Ngành Hàng ]
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-950 leading-tight">
                        {activeCategory?.name}
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md">
                        {activeCategory?.description}
                    </p>
                    <div className="pt-2">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md shadow-emerald-600/10 hover:shadow-lg hover:scale-[1.02] transition-all">
                            Xem Tất Cả Sản Phẩm
                        </button>
                    </div>
                </div>

            </div>

            <div className="text-left mb-6">
                <h3 className="font-extrabold text-slate-950 text-xl tracking-tight">
                    Chọn Danh Mục
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {defaultCategories.map((cat) => {
                    const isSelected = cat.id === selectedId;

                    return (
                        <div
                            key={cat.id}
                            onClick={() => setSelectedId(cat.id)}
                            className={`pt-6 pb-5 px-4 md:px-5 rounded-2xl border text-center transition-all duration-300 cursor-pointer group flex flex-col items-center justify-between min-h-[200px] relative
                ${isSelected
                                    ? `${cat.backgroundColor} border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-[1.02]`
                                    : 'bg-white border-slate-100 hover:border-emerald-200/60 hover:shadow-md'
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500 rounded-t-2xl"></div>
                            )}

                            <div className="w-full h-24 mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <img
                                    src={cat.imageUrl}
                                    alt={cat.name}
                                    className="w-full h-full object-contain select-none pointer-events-none filter drop-shadow-sm"
                                />
                            </div>

                            <div className="mt-auto w-full">
                                <h4 className={`font-extrabold text-sm tracking-wide line-clamp-1 transition-colors ${isSelected ? 'text-emerald-700' : 'text-slate-800'}`}>
                                    {cat.name}
                                </h4>
                                <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                                    {cat.productCount} sản phẩm
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

        </section>
    );
}