// loading ui with skeleton
export default function Loading() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-zinc-500 animate-pulse">Đang tải dữ liệu, vui lòng đợi...</p>
    </div>
  );
}
