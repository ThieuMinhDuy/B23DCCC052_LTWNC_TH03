import Link from 'next/link';
import { getSubjects, getDeadlines } from '@/lib/data';

// home page - ssg
export default async function HomePage() {
  const subjects = await getSubjects();
  const deadlines = await getDeadlines();

  return (
    <div className="space-y-12">
      {/* hero section */}
      <section className="text-center py-12 px-4 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent rounded-3xl border border-blue-100 dark:border-blue-900/30">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
          PTIT Class Hub 2026
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Cổng Quản Lý Deadline Của Lớp
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Tra cứu hạn chót bài tập, đồ án, lab thực hành công khai. Đăng nhập để tự động theo dõi tiến độ học tập cá nhân.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/deadlines"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors"
          >
            Xem toàn bộ Deadline ({deadlines.length})
          </Link>
        </div>
      </section>

      {/* subjects list */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Các môn học trong kỳ</h2>
            <p className="text-sm text-zinc-500">Xem danh sách bài tập và hạn nộp theo từng học phần</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((sub) => {
            const subjectDeadlines = deadlines.filter((d) => d.subjectSlug === sub.slug);
            return (
              <Link
                key={sub.id}
                href={`/subjects/${sub.slug}`}
                className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md">
                    {sub.code}
                  </span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {subjectDeadlines.length} deadline
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                  {sub.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{sub.description}</p>
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>GV: {sub.teacher}</span>
                  <span>{sub.credits} tín chỉ</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
