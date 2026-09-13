"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    User as UserIcon, Mail, Phone, MapPin, Calendar, Activity, 
    Target, Apple, ShieldCheck, LogOut, ArrowLeft, 
    Edit3 
} from 'lucide-react';
import { authService } from '@/services/authService';
import { User } from '@/types/auth';

const ACTIVITY_LABELS: Record<string, string> = {
    SEDENTARY: 'Ít vận động (văn phòng)',
    LIGHT: 'Vận động nhẹ (1-3 ngày/tuần)',
    MODERATE: 'Vận động vừa phải (3-5 ngày/tuần)',
    VERY_ACTIVE: 'Năng động (6-7 ngày/tuần)',
    EXTRA_ACTIVE: 'Cường độ cao / Vận động viên',
};

const GOAL_LABELS: Record<string, string> = {
    WEIGHT_LOSS: 'Giảm cân & Cắt giảm Calo',
    MUSCLE_GAIN: 'Tăng cơ & Bổ sung Protein',
    MAINTENANCE: 'Duy trì vóc dáng & Sống khỏe',
    KETO: 'Chế độ ăn Keto & Low Carb',
    VEGAN: 'Lối sống Thuần chay (Vegan)',
    LOW_SUGAR: 'Hạn chế đường & Bảo vệ đường huyết',
};

const DIETARY_LABELS: Record<string, string> = {
    STANDARD: 'Tiêu chuẩn',
    VEGETARIAN: 'Ăn chay có trứng sữa',
    VEGAN: 'Thuần chay 100%',
    GLUTEN_FREE: 'Không chứa Gluten',
    DIABETIC_FRIENDLY: 'Phù hợp người tiểu đường',
    KETO: 'Keto Healthy',
};

export default function ProfileView() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            const currentUser = await authService.getProfile();
            if (!currentUser) {
                router.push('/login');
                return;
            }
            setUser(currentUser);
            setIsLoading(false);
        };

        loadUserData();
    }, [router]);

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-500 font-semibold">Đang tải hồ sơ...</span>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const isAdmin = user.role === 'ROLE_ADMIN' || user.role === 'ADMIN';

    // Tính chỉ số BMI ước tính nếu có chiều cao và cân nặng
    const heightM = user.nutritionProfile?.height ? user.nutritionProfile.height / 100 : null;
    const weightKg = user.nutritionProfile?.weight || null;
    const bmi = heightM && weightKg ? (weightKg / (heightM * heightM)).toFixed(1) : null;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-emerald-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại Trang chủ
                </Link>
            </div>

            {/* Main Header Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-950/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    {/* Avatar with Edit Button */}
                    <div className="relative">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-white text-4xl font-black shadow-lg flex-shrink-0 overflow-hidden">
                            {user.avatarUrl || user.profile?.avatar ? (
                                <img
                                    src={user.avatarUrl || user.profile?.avatar}
                                    alt={user.fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'
                            )}
                        </div>
                        <button
                            title="Đổi ảnh đại diện"
                            className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-white text-emerald-800 hover:bg-emerald-50 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-2 flex-grow">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                {user.fullName || 'Khách hàng The Sweet Lab'}
                            </h1>
                            {isAdmin && (
                                <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                    <ShieldCheck className="w-3 h-3" />
                                    ADMINISTRATOR
                                </span>
                            )}
                        </div>

                        <p className="text-emerald-100/80 text-xs font-medium">
                            {user.email}
                        </p>

                        {/* Nút Đăng xuất đặt dưới Email trong Component chứa Avatar */}
                        <div className="pt-2">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-red-500/80 border border-white/20 hover:border-transparent px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2-Column Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Cột 1: Thông tin cá nhân */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-emerald-600" />
                            Thông Tin Cá Nhân
                        </h2>
                        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                            <Edit3 className="w-3.5 h-3.5" />
                            Chỉnh sửa
                        </button>
                    </div>

                    <div className="space-y-4 text-xs">
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-gray-400 block font-medium">Email</span>
                                <span className="text-slate-800 font-bold">{user.email}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-gray-400 block font-medium">Số điện thoại</span>
                                <span className="text-slate-800 font-bold">
                                    {user.profile?.phone || 'Chưa cập nhật'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-gray-400 block font-medium">Địa chỉ nhận hàng</span>
                                <span className="text-slate-800 font-bold">
                                    {user.profile?.address || 'Chưa cập nhật địa chỉ'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-gray-400 block font-medium">Giới tính & Ngày sinh</span>
                                <span className="text-slate-800 font-bold">
                                    {user.profile?.gender === 'MALE' ? 'Nam' : user.profile?.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                                    {user.profile?.dateOfBirth && ` • ${user.profile.dateOfBirth}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột 2: Hồ sơ Dinh Dưỡng & Sức Khỏe (USP của The Sweet Lab) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h2 className="text-base font-extrabold text-slate-900">
                            Hồ Sơ Dinh Dưỡng
                        </h2>
                        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer">
                            <Edit3 className="w-3.5 h-3.5" />
                            Chỉnh sửa
                        </button>
                    </div>

                    <div className="space-y-4 text-xs">
                        {/* Chiều cao, cân nặng, BMI */}
                        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-center">
                            <div>
                                <span className="text-[10px] text-gray-400 font-medium block">Chiều cao</span>
                                <span className="text-sm font-black text-slate-800">
                                    {user.nutritionProfile?.height ? `${user.nutritionProfile.height} cm` : '--'}
                                </span>
                            </div>
                            <div className="border-x border-slate-200">
                                <span className="text-[10px] text-gray-400 font-medium block">Cân nặng</span>
                                <span className="text-sm font-black text-slate-800">
                                    {user.nutritionProfile?.weight ? `${user.nutritionProfile.weight} kg` : '--'}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-400 font-medium block">Chỉ số BMI</span>
                                <span className="text-sm font-black text-emerald-700">
                                    {bmi || '--'}
                                </span>
                            </div>
                        </div>

                        {/* Cường độ vận động */}
                        <div className="flex items-start gap-3">
                            <Activity className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-gray-400 block font-medium">Mức độ vận động</span>
                                <span className="text-slate-800 font-bold">
                                    {user.nutritionProfile?.activityLevel ? (ACTIVITY_LABELS[user.nutritionProfile.activityLevel] || user.nutritionProfile.activityLevel) : 'Chưa thiết lập'}
                                </span>
                            </div>
                        </div>

                        {/* Mục tiêu dinh dưỡng */}
                        <div className="flex items-start gap-3">
                            <Target className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-gray-400 block font-medium">Mục tiêu dinh dưỡng</span>
                                <span className="text-slate-800 font-bold">
                                    {user.nutritionProfile?.goal ? (GOAL_LABELS[user.nutritionProfile.goal] || user.nutritionProfile.goal) : 'Chưa thiết lập'}
                                </span>
                            </div>
                        </div>

                        {/* Chế độ ăn ưu tiên */}
                        <div className="flex items-start gap-3">
                            <Apple className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="text-gray-400 block font-medium">Chế độ ăn ưa thích</span>
                                <span className="text-emerald-700 font-bold">
                                    {user.nutritionProfile?.dietaryPreference ? (DIETARY_LABELS[user.nutritionProfile.dietaryPreference] || user.nutritionProfile.dietaryPreference) : 'Tiêu chuẩn'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Action Links */}
            <div className="bg-slate-50/60 rounded-3xl p-6 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-800">
                        Cần điều chỉnh mục tiêu dinh dưỡng hay chế độ ăn?
                    </h3>
                    <p className="text-xs text-gray-500">
                        The Sweet Lab sẽ tự động gợi ý các sản phẩm phù hợp nhất với hồ sơ sức khỏe của bạn.
                    </p>
                </div>
                <Link
                    href="/#categories"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow-md shadow-emerald-600/10 hover:shadow-lg"
                >
                    Khám Phá Sản Phẩm Phù Hợp
                </Link>
            </div>
        </div>
    );
}
