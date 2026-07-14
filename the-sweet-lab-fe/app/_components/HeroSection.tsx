import React from 'react';

export default function HeroSection() {
    return (
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:flex items-center justify-between gap-12 relative overflow-hidden min-h-[500px]">
            <div className="absolute inset-y-0 right-0 w-full md:w-[55%] z-0 pointer-events-none hidden md:block">
                <svg
                    viewBox="0 0 500 500"
                    preserveAspectRatio="none"
                    className="w-full h-full object-cover text-emerald-800/100 filter drop-shadow-[-10px_0_15px_rgba(0,0,0,0.03)]"
                >
                    <path
                        fill="currentColor"
                        d="M150,0 C220,120 80,260 200,380 C260,440 320,470 500,500 L500,0 Z"
                    />
                </svg>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[45%] bg-emerald-800 z-0 md:hidden rounded-t-[3rem]"></div>
            <div className="max-w-xl space-y-5 z-10 md:text-left text-center">
                <h1 className="text-5xl md:text-6xl font-black text-slate-950 leading-[1.15]">
                    Nuông Chiều <br />
                    <span className="text-emerald-600 md:text-emerald-600 text-emerald-400">Cơn Thèm Ngọt</span> <br />
                    Một Cách Lành Mạnh
                </h1>
                <p className="text-gray-500 md:text-gray-500 text-emerald-100/80 text-sm md:text-base leading-relaxed">
                    Bật công tắc ngọt lành, xua tan ngày mệt mỏi. Ăn vặt thuần tự nhiên, nuông chiều cơ thể đúng cách.
                </p>
                <div className="pt-2">
                    <button className="bg-emerald-600 hover:bg-emerald-700 md:bg-emerald-600 md:hover:bg-emerald-700 bg-white text-slate-900 md:text-white font-bold px-8 py-3 rounded-full transition-all shadow-md shadow-emerald-900/10 hover:shadow-xl hover:scale-[1.02] text-sm">
                        Mua Ngay
                    </button>
                </div>
            </div>

            <div className="mt-12 md:mt-0 relative w-full md:w-[480px] h-[420px] flex items-center justify-center z-10">
                <div className="w-[360px] h-[360px] bg-white rounded-full border-4 border-white/40 flex items-center justify-center animate-float-main group cursor-pointer">
                    <div className="relative w-[420px] h-[300px] flex-shrink-0 flex items-center justify-center group-hover:scale-[1.04] transition-transform duration-500 select-none"
                    >
                        <img
                            src="/Hero_Img.png"
                            alt="Fruits Platter"
                            className="w-full h-full object-covers"
                        />
                    </div>
                </div>
            </div>

        </section>
    );
}