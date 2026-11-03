import Link from 'next/link';

// not-found 404 page
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl font-black text-blue-600 mb-2">404</div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        Không tìm thấy trang yêu cầu
      </h1>
      <p className="text-zinc-500 max-w-md mb-6 text-sm">
        Nội dung hoặc deadline bạn đang tìm kiếm không tồn tại hoặc đã bị xóa khỏi hệ thống.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          Về Trang chủ
        </Link>
        <Link
          href="/deadlines"
          className="px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors"
        >
          Xem danh sách Deadline
        </Link>
      </div>
    </div>
  );
}
