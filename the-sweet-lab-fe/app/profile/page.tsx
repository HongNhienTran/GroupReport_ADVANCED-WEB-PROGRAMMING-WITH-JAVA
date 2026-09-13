import React from 'react';
import type { Metadata } from 'next';
import ProfileView from '@/components/profile/ProfileView';

export const metadata: Metadata = {
    title: 'Hồ Sơ Cá Nhân & Dinh Dưỡng | The Sweet Lab',
    description: 'Quản lý thông tin tài khoản, đơn hàng và hồ sơ dinh dưỡng cá nhân tại The Sweet Lab.',
};

export default function ProfilePage() {
    return (
        <main className="min-h-[85vh] bg-slate-50/30">
            <ProfileView />
        </main>
    );
}
