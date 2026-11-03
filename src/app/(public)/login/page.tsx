import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from './LoginForm';

// noindex login
export const metadata: Metadata = {
  title: 'Đăng nhập | Class Deadline Hub',
  description: 'Trang đăng nhập cổng thông tin deadline lớp học',
  robots: {
    index: false,
    follow: false,
  },
};

// login page
export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-zinc-500">Đang tải form đăng nhập...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
