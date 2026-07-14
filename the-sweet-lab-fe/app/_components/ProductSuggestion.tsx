import React from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    rating: number;
}

interface ProductSuggestionProps {
    products: Product[];
}

export default function ProductSuggestion({ products }: ProductSuggestionProps) {
    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-black text-slate-950 tracking-tight">
                    Gợi Ý Cho Bạn
                </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-gray-500 mb-8 border-b border-gray-100 pb-4">
                <button className="hover:text-emerald-600 uppercase transition-colors">TẤT CẢ</button>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <button className="text-emerald-600 border-b-2 border-emerald-600 pb-4 -mb-[18px] uppercase">SOCOLA</button>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <button className="hover:text-emerald-600 uppercase transition-colors">BÁNH QUY</button>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <button className="hover:text-emerald-600 uppercase transition-colors">KẸO DẺO</button>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <button className="hover:text-emerald-600 uppercase transition-colors">HỘP QUÀ</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((prod) => (
                    <div
                        key={prod.id}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                        <div>
                            {/* Khung chứa ảnh sản phẩm */}
                            <div className="w-full h-40 bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden p-2">
                                <img
                                    src={prod.imageUrl}
                                    alt={prod.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
                                />
                            </div>

                            <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold mb-1">
                                ⭐ <span>{prod.rating.toFixed(1)}</span>
                            </div>

                            <h3 className="font-bold text-slate-800 text-xs text-left line-clamp-2 min-h-[2rem] tracking-wide">
                                {prod.name}
                            </h3>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm font-black text-slate-900">
                                {prod.price.toLocaleString('vi-VN')}đ
                            </span>
                            <button className="w-7 h-7 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg transition-colors font-bold text-sm flex items-center justify-center shadow-sm">
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Nút Xem Thêm nằm góc phải phía dưới */}
            <div className="flex justify-end mt-6">
                <a
                    href="#"
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md shadow-emerald-700/10 hover:shadow-lg transition-all"
                >
                    Xem Thêm ➔
                </a>
            </div>
        </section>
    );
}