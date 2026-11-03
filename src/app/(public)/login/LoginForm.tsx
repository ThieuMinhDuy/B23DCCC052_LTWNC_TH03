'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

// client login form
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError('Email hoặc mật khẩu không chính xác.');
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Đã có lỗi xảy ra trong quá trình đăng nhập.');
      setLoading(false);
    }
  }

  // quick fill credentials
  function fillAccount(accEmail: string, accPass: string) {
    setEmail(accEmail);
    setPassword(accPass);
    setError('');
  }

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Đăng nhập tài khoản</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Hệ thống quản lý deadline lớp học - Class Deadline Hub
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Email PTIT
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ptit.edu.vn hoặc sv@ptit.edu.vn"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          {loading ? 'Đang xác thực...' : 'Đăng nhập'}
        </button>
      </form>

      {/* demo accounts */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 text-center">
          Tài khoản kiểm thử nhanh (Click để điền)
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => fillAccount('admin@ptit.edu.vn', 'admin123')}
            className="p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-left transition-colors"
          >
            <div className="font-semibold text-zinc-800 dark:text-zinc-200">Lớp trưởng (Admin)</div>
            <div className="text-zinc-500 dark:text-zinc-400">admin@ptit.edu.vn</div>
            <div className="text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">pass: admin123</div>
          </button>

          <button
            type="button"
            onClick={() => fillAccount('sv@ptit.edu.vn', 'sv123456')}
            className="p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-left transition-colors"
          >
            <div className="font-semibold text-zinc-800 dark:text-zinc-200">Sinh viên (User)</div>
            <div className="text-zinc-500 dark:text-zinc-400">sv@ptit.edu.vn</div>
            <div className="text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">pass: sv123456</div>
          </button>
        </div>
      </div>
    </div>
  );
}
