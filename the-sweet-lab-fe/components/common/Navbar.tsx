import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart } from 'lucide-react'; 

export default function Navbar() {
  return (
    <>
      <div className="bg-emerald-50 text-center py-2 text-xs font-semibold text-emerald-700 border-b border-emerald-100">
        🌱 100% Organic & Sugar-Free
      </div>
      
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">
            The Sweet <span className="text-emerald-600">Lab.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link href="#" className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs">Trang chủ</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Sản phẩm</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Giới thiệu</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Blog</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Liên hệ</Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Ô Tìm kiếm */}
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-50 border border-gray-200 pl-4 pr-9 py-1.5 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 w-40 text-slate-800"
              />
              <div className="absolute right-3 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
            <button className="p-2.5 hover:bg-gray-100 rounded-full text-gray-700 relative transition-colors flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-slate-700" /> 
              <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                0
              </span>
            </button>
            
            <Link href="#" className="text-xs font-bold border border-gray-300 hover:border-emerald-600 px-4 py-1.5 rounded-md transition-colors shadow-sm">
              Đăng nhập
            </Link>

            <div className="flex items-center gap-1 border border-gray-200 p-1 rounded-md bg-gray-50/50 shadow-sm">
              <button title="Tiếng Việt" className="hover:scale-110 transition-transform p-0.5 text-base">VN</button>
              <div className="w-[1px] h-4 bg-gray-200 mx-0.5"></div>
              <button title="English" className="hover:scale-110 transition-transform p-0.5 text-base">EN</button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}