import React from 'react';
import { FlashSaleProduct } from '@/types/product';

interface FlashSaleProps {
    flashSales: FlashSaleProduct[];
}

export default function FlashSale({ flashSales }: FlashSaleProps) {
    return (
        <section className="max-w-7xl mx-auto px-6 py-12 text-center bg-gray-50/50 rounded-[2rem] my-8 border border-gray-100">
            <div className="mb-8">
                <h2 className="text-4xl font-black text-slate-950 flex items-center justify-center gap-2">
                    Flash Sale
                </h2>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                    Còn lại: <span className="font-bold text-emerald-600 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">03</span> giờ <span className="font-bold text-emerald-600 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">45</span> phút <span className="font-bold text-emerald-600 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">12</span> giây
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {flashSales.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative">
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">Sale</span>
                        <div>
                            <div className="w-full h-36 bg-gray-50 rounded-xl mb-3 flex items-center justify-center text-4xl">{item.imageUrl}</div>
                            <h3 className="font-bold text-slate-800 text-xs text-left min-h-[2rem] line-clamp-2">{item.name}</h3>
                        </div>
                        <div className="mt-2 text-left">
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-black text-red-600">{item.price.toLocaleString('vi-VN')}đ</span>
                                <span className="text-[10px] text-gray-400 line-through">Was: {item.oldPrice.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                                Thêm
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}