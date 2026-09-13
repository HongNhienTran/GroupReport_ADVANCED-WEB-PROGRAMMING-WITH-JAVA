"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingCart, User as UserIcon, LogOut, ChevronDown, Package, Heart, ShieldCheck } from 'lucide-react';
import { authService } from '@/services/authService';
import { User } from '@/types/auth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Đọc trạng thái đăng nhập từ localStorage
    const syncUser = () => {
      setUser(authService.getStoredUser());
    };

    syncUser();

    // Lắng nghe sự kiện thay đổi đăng nhập/đăng xuất
    window.addEventListener('auth-changed', syncUser);
    return () => {
      window.removeEventListener('auth-changed', syncUser);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/login');
  };

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  // Lấy chữ cái đầu của tên để làm avatar mặc định
  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      return parts[parts.length - 1].charAt(0).toUpperCase();
    }
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  return (
    <>
      <div className="bg-emerald-50 text-center py-2 text-xs font-semibold text-emerald-700 border-b border-emerald-100">
        🌱 100% Organic & Sugar-Free • Ăn vặt dinh dưỡng lành mạnh
      </div>

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">
            The Sweet <span className="text-emerald-600">Lab.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
            <Link
              href="/"
              className={`px-4 py-1.5 rounded-full text-xs transition-colors ${pathname === '/' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-emerald-600'
                }`}
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className={`px-4 py-1.5 rounded-full text-xs transition-colors ${pathname === '/products' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-emerald-600'
                }`}
            >
              Sản phẩm
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors text-xs">
              Cẩm nang
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors text-xs">
              Giới thiệu
            </Link>
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Ô Tìm kiếm */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Tìm bánh, kẹo..."
                className="bg-gray-50 border border-gray-200 pl-4 pr-9 py-1.5 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36 md:w-44 text-slate-800"
              />
              <div className="absolute right-3 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            {/* Sản phẩm yêu thích (Wishlist) */}
            <button
              title="Sản phẩm yêu thích"
              className="p-2.5 hover:bg-rose-50 rounded-full text-gray-700 hover:text-rose-600 relative transition-colors flex items-center justify-center cursor-pointer group"
            >
              <Heart className="w-4 h-4 text-slate-700 group-hover:text-rose-500 transition-colors" />
              <span className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                0
              </span>
            </button>

            {/* Giỏ hàng */}
            <button
              title="Giỏ hàng"
              className="p-2.5 hover:bg-emerald-50 rounded-full text-gray-700 hover:text-emerald-700 relative transition-colors flex items-center justify-center cursor-pointer group"
            >
              <ShoppingCart className="w-4 h-4 text-slate-700 group-hover:text-emerald-600 transition-colors" />
              <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                0
              </span>
            </button>

            {/* Trạng thái Auth: Avatar + Dropdown khi đã đăng nhập */}
            {user ? (
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Trigger Button: Avatar & Tên */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 py-1 px-1.5 md:pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                >
                  {/* Avatar hình ảnh hoặc chữ cái đầu */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-black text-xs shadow-sm ring-2 ring-emerald-500/20">
                    {user.avatarUrl || user.profile?.avatar ? (
                      <img
                        src={user.avatarUrl || user.profile?.avatar}
                        alt={user.fullName || 'User'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user.fullName, user.email)
                    )}
                  </div>

                  <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate hidden sm:inline-block group-hover:text-emerald-700 transition-colors">
                    {user.fullName || user.email.split('@')[0]}
                  </span>

                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-slate-700 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Menu Dropdown khi trỏ chuột vào */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 py-2 z-50 animate-fadeIn">
                    {/* Header thông tin người dùng */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-black text-slate-900 truncate">
                          {user.fullName || 'Khách hàng'}
                        </p>
                        {isAdmin && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Danh sách link menu */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors font-semibold"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-600" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>

                      <Link
                        href="#"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors font-semibold"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>Đơn hàng của tôi</span>
                      </Link>

                      <Link
                        href="#"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors font-semibold"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span>Sản phẩm yêu thích</span>
                      </Link>
                    </div>

                    {/* Nút Đăng xuất */}
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors font-semibold text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white px-4 py-1.5 rounded-full transition-all shadow-sm"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}