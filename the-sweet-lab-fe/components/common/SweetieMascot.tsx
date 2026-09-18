"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, MessageCircle, LogIn } from 'lucide-react';
import { authService } from '@/services/authService';
import { User } from '@/types/auth';

export default function SweetieMascot() {
  const [user, setUser] = useState<User | null>(null);
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const syncUser = () => {
      setUser(authService.getStoredUser());
    };

    syncUser();
    window.addEventListener('auth-changed', syncUser);
    return () => {
      window.removeEventListener('auth-changed', syncUser);
    };
  }, []);

  if (!mounted) return null;

  const isLoggedIn = !!user;
  const userName = user?.fullName || user?.email?.split('@')[0] || "bạn";

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end select-none">
      {/* 1. Bong bóng trò chuyện (Speech Bubble) */}
      {isBubbleOpen && (
        <div className="relative mb-2 max-w-[280px] sm:max-w-xs bg-white/95 backdrop-blur-md border border-emerald-100 p-4 rounded-2xl shadow-xl shadow-emerald-950/10 text-stone-800 transition-all">
          {/* Nút đóng bóng chat */}
          <button
            onClick={() => setIsBubbleOpen(false)}
            aria-label="Đóng tin nhắn"
            className="absolute top-2.5 right-2.5 p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Tiêu đề & Mascot Name Tag */}
          <div className="flex items-center gap-1.5 mb-1.5 pr-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase">Sweetie AI</span>
          </div>

          {/* Nội dung tin nhắn theo yêu cầu */}
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {isLoggedIn ? (
              <>
                Chào <span className="font-semibold text-emerald-800">&ldquo;{userName}&rdquo;</span>, trò chuyện cùng Sweetie để hiểu hơn về dinh dưỡng bạn cần nhé!
              </>
            ) : (
              <>Chào bạn! Đăng nhập để trải nghiệm trò chuyện cùng Botchat Sweetie nhé</>
            )}
          </p>

          {/* Nút hành động bổ trợ */}
          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-end">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  // Dự phòng mở khung chat AI khi module chat hoàn thiện
                  alert("Tính năng Chat AI với Sweetie đang được kết nối trong phân hệ AI Nutrition!");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Trò chuyện ngay
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Đăng nhập ngay
              </Link>
            )}
          </div>

          {/* Mũi tên trỏ xuống Mascot */}
          <div className="absolute -bottom-2 right-12 md:right-14 w-4 h-4 bg-white border-r border-b border-emerald-100 rotate-45" />
        </div>
      )}

      {/* 2. Mascot Sweetie ghim cố định góc phải */}
      <div className="relative group flex flex-col items-center">
        {/* Nút nhỏ nhắc nhở khi thu nhỏ hộp thoại: Nằm ngay trên đầu bé mascot */}
        {!isBubbleOpen && (
          <div className="mb-1.5 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => setIsBubbleOpen(true)}
              className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md border border-emerald-300 shadow-md shadow-emerald-950/10 rounded-full text-xs font-semibold text-emerald-800 hover:bg-emerald-50 hover:border-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chat với Sweetie</span>
            </button>
            {/* Mũi tên nhỏ trỏ xuống đầu bé */}
            <div className="w-2 h-2 bg-white border-r border-b border-emerald-300 rotate-45 -mt-1 shadow-2xs" />
          </div>
        )}

        {/* Hình ảnh Mascot Sweetie */}
        <button
          onClick={() => setIsBubbleOpen((prev) => !prev)}
          title="Trò chuyện với trợ lý dinh dưỡng Sweetie"
          className="relative block transform transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
        >
          <div className="relative w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-44 drop-shadow-xl">
            <Image
              src="/sweetie_wave.png"
              alt="Mascot Sweetie AI"
              fill
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
              priority
              className="object-contain"
            />
          </div>

          {/* Badge online nhỏ xinh bên cạnh */}
          <span className="absolute bottom-3 right-3 flex h-3.5 w-3.5">
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-sm" />
          </span>
        </button>
      </div>
    </div>
  );
}
