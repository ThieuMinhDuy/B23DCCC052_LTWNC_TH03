import Link from 'next/link';
import type { Metadata } from 'next';

// 403 metadata
export const metadata: Metadata = {
  title: '403 - Không có quyền truy cập | Class Deadline Hub',
  robots: {
    index: false,
    follow: false,
  },
};

// 403 page
export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center text-3xl font-black mb-4">
        !
      </div>
      <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
        403 - Quyền truy cập bị từ chối
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-6">
        Bạn không có quyền quản trị (Admin) để truy cập trang này. Trang này chỉ dành cho Lớp trưởng.
      </p>
      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Về Dashboard
        </Link>
        <Link
          href="/"
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors"
        >
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
