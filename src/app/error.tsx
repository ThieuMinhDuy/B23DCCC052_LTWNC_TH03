'use client';

import { useEffect } from 'react';

// error boundary ui
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4">
        ✕
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        Đã có lỗi xảy ra!
      </h2>
      <p className="text-sm text-zinc-500 max-w-md mb-6">
        Hệ thống không thể tải được trang hoặc xử lý yêu cầu. Bạn có thể nhấn nút dưới đây để thử lại.
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
      >
        Thử lại
      </button>
    </div>
  );
}
