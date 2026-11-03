'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SignOutButton } from '@/components/AuthButton';

// client auth status in header
export function HeaderAuth() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</div>
        <div className="flex items-center justify-end gap-1.5">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              user.role === 'admin' ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            {user.role === 'admin' ? 'Lớp trưởng (Admin)' : 'Sinh viên'}
          </span>
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}

// client header links
export function HeaderNavLinks() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
      <Link
        href="/dashboard"
        className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors font-medium"
      >
        Dashboard
      </Link>
      {user.role === 'admin' && (
        <Link
          href="/admin"
          className="text-amber-600 dark:text-amber-400 hover:underline transition-colors font-semibold"
        >
          Quản trị
        </Link>
      )}
    </nav>
  );
}
