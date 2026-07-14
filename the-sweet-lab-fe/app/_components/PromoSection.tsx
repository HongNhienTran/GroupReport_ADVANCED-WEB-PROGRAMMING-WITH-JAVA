import React from 'react';

export default function PromoSection() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-8">
            <div className="bg-emerald-950 text-white rounded-[2rem] p-10 text-center space-y-6 relative overflow-hidden">
                <div className="space-y-2 z-10 relative">
                    <h2 className="text-2xl md:text-3xl font-extrabold">Góc Ngọt Lành</h2>
                    <h3 className="text-lg md:text-xl font-bold text-emerald-100">Đăng ký nhận cẩm nang ăn vặt lành mạnh hàng tuần</h3>
                    <p className="text-gray-400 text-xs max-w-md mx-auto">
                        Đăng ký nhận cẩm nang ăn vặt lành mạnh hoàn toàn miễn phí, an toàn sạch sẽ, mang ngọt mát mát ngọt cách lành mạnh.
                    </p>
                </div>

                <div className="max-w-md mx-auto flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1.5 border border-white/10 z-10 relative">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-transparent px-4 py-2 w-full text-xs text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button className="bg-white text-slate-900 hover:bg-emerald-50 text-xs font-bold px-6 py-2 rounded-full whitespace-nowrap transition-colors shadow-sm">
                        Đăng Ký
                    </button>
                </div>
            </div>
        </section>
    );
}