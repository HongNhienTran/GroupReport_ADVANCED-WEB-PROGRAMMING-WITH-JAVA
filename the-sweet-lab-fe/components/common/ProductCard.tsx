"use client";

import React, { useState } from 'react';
import { Heart, Plus, Star } from 'lucide-react';
import { ProductNutrition } from '@/types/product';

export interface ProductCardProps {
    id: string | number;
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    rating?: number;
    reviewCount?: number;
    soldCount?: number;
    nutrition?: ProductNutrition;
    dietaryTags?: string[];
    onAddToCart?: () => void;
    onToggleWishlist?: (isFav: boolean) => void;
}

export default function ProductCard({
    id,
    name,
    price,
    originalPrice,
    imageUrl,
    rating = 5.0,
    reviewCount = 48,
    soldCount = 120,
    nutrition,
    dietaryTags,
    onAddToCart,
    onToggleWishlist
}: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    // Tính % giảm giá nếu có
    const discount = originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : null;

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const nextFav = !isFavorite;
        setIsFavorite(nextFav);
        if (onToggleWishlist) {
            onToggleWishlist(nextFav);
        }
    };

    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart();
        } else {
            // Demo notification
            alert(`Đã thêm "${name}" vào giỏ hàng thành công!`);
        }
    };

    return (
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[380px] group relative select-none">
            {/* 1. Huy hiệu % Sale ở góc trên bên trái (CHỈ HIỂN THỊ KHI CÓ GIẢM GIÁ) */}
            {discount && discount > 0 ? (
                <span className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    -{discount}%
                </span>
            ) : null}

            {/* 2. Nút Yêu Thích hình trái tim ở góc trên bên phải */}
            <button
                onClick={handleWishlistClick}
                title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                aria-label="Yêu thích sản phẩm"
                className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white shadow-xs flex items-center justify-center transition-colors cursor-pointer"
            >
                <Heart
                    className={`w-3.5 h-3.5 transition-colors ${
                        isFavorite ? "text-red-500 fill-red-500" : "text-slate-400 hover:text-red-500"
                    }`}
                />
            </button>

            <div className="flex-1 flex flex-col">
                {/* 3. Khung ảnh sản phẩm (Bo góc tự nhiên rounded-lg, KHÔNG zoom khi hover) */}
                <div className="w-full h-40 bg-gray-50 rounded-lg mb-2.5 flex items-center justify-center overflow-hidden relative flex-shrink-0">
                    {imageUrl?.startsWith('http') || imageUrl?.startsWith('/') ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover select-none pointer-events-none rounded-lg"
                        />
                    ) : (
                        <span className="text-4xl">{imageUrl}</span>
                    )}

                    {/* Tag ăn kiêng nhỏ ở góc nếu có */}
                    {dietaryTags && dietaryTags.length > 0 && (
                        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/90 text-emerald-800 shadow-xs border border-emerald-100">
                            {dietaryTags[0]}
                        </span>
                    )}
                </div>

                {/* 4. Đánh giá Vote Review & Lượt bán */}
                <div className="flex items-center justify-between text-[11px] mb-1 h-5 flex-shrink-0">
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rating.toFixed(1)}</span>
                        <span className="text-gray-400 text-[10px] font-normal">({reviewCount})</span>
                    </div>
                    <span className="text-gray-500 font-medium text-[10px]">
                        Đã bán {soldCount >= 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount}
                    </span>
                </div>

                {/* 5. Tên sản phẩm cố định chiều cao */}
                <h3 className="font-semibold text-slate-800 text-xs sm:text-sm text-left h-9 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors flex items-start flex-shrink-0">
                    {name}
                </h3>

                {/* 6. Bảng tóm tắt dinh dưỡng (Nutrition Summary) */}
                <div className="h-5 mt-1 flex items-center gap-1.5 text-[10px] text-gray-500 flex-shrink-0 overflow-hidden">
                    {nutrition ? (
                        <>
                            {nutrition.calories && (
                                <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                                    {nutrition.calories} kcal
                                </span>
                            )}
                            {nutrition.sugarG !== undefined && (
                                <span className="text-gray-400">Đường: {nutrition.sugarG}g</span>
                            )}
                            {nutrition.proteinG !== undefined && (
                                <span className="text-gray-400">• Đạm: {nutrition.proteinG}g</span>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                            100% Hữu cơ & Thuần chay
                        </span>
                    )}
                </div>
            </div>

            {/* 7. Giá tiền & Nút Thêm vào giỏ là dấu cộng (+) */}
            <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
                <div>
                    <span className="text-sm sm:text-base font-bold text-slate-900 block leading-tight">
                        {price.toLocaleString('vi-VN')}đ
                    </span>
                    {discount && originalPrice ? (
                        <span className="text-[10px] text-gray-400 line-through block h-3.5">
                            {originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                    ) : (
                        <span className="block h-3.5"></span>
                    )}
                </div>

                {/* Nút thêm giỏ là dấu cộng */}
                <button
                    onClick={handleAddToCartClick}
                    title="Thêm vào giỏ hàng"
                    aria-label="Thêm vào giỏ hàng"
                    className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold transition-colors shadow-xs flex items-center justify-center cursor-pointer"
                >
                    <Plus className="w-4 h-4 stroke-[3]" />
                </button>
            </div>
        </div>
    );
}
