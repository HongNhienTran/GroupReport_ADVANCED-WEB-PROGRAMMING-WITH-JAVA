import React from 'react';
import { FlashSaleProduct } from '@/types/product';
import ProductCard from '@/components/common/ProductCard';

interface FlashSaleProps {
    flashSales: FlashSaleProduct[];
}

export default function FlashSale({ flashSales }: FlashSaleProps) {
    return (
        <section className="max-w-7xl mx-auto px-6 py-12 text-center bg-gray-50/70 rounded-2xl my-20 md:my-28 border border-gray-100 shadow-xs">
            {/* Header đếm ngược */}
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-slate-950 flex items-center justify-center gap-2 tracking-tight">
                    Flash Sale Giờ Vàng
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
                    Còn lại: <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-xs">03</span> giờ <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-xs">45</span> phút <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-xs">12</span> giây
                </p>
            </div>

            {/* Grid sản phẩm đồng bộ bằng ProductCard */}
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
        </section>
    );
}
