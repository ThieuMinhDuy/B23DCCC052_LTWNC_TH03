import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/auth';
import { getDeadlines, getSubjects } from '@/lib/data';
import { DeadlineCountdown } from '@/components/DeadlineCountdown';
import { MarkCompletedButton } from '@/components/MarkCompletedButton';

// ssr dynamic
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard cá nhân',
  robots: {
    index: false,
    follow: false,
  },
};

// dashboard page - ssr
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const userId = session.user.id;
  const deadlines = await getDeadlines();
  const subjects = await getSubjects();
  const subjectMap = new Map(subjects.map((s) => [s.slug, s.name]));

  const completedDeadlines = deadlines.filter((d) => d.completedBy.includes(userId));
  const pendingDeadlines = deadlines.filter((d) => !d.completedBy.includes(userId));

  const now = new Date().getTime();
  const overdueCount = pendingDeadlines.filter((d) => new Date(d.dueDate).getTime() < now).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
          Xin chào, {session.user.name} 👋
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Theo dõi tiến độ nộp bài tập và hoàn thành deadline cá nhân
        </p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="text-xs font-semibold text-zinc-400 uppercase">Tổng deadline</div>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-1">{deadlines.length}</div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Đã hoàn thành</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {completedDeadlines.length}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Đang chờ nộp</div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {pendingDeadlines.length}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Quá hạn chưa xong</div>
          <div className="text-3xl font-black text-red-600 dark:text-red-400 mt-1">
            {overdueCount}
          </div>
        </div>
      </div>

      {/* pending deadlines list */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Deadline cần làm ({pendingDeadlines.length})
        </h2>

        {pendingDeadlines.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500">
            Tuyệt vời! Bạn đã hoàn thành toàn bộ deadline hiện tại. 🎉
          </div>
        ) : (
          <div className="space-y-3">
            {pendingDeadlines.map((d) => (
              <div
                key={d.id}
                className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-blue-600">
                      {subjectMap.get(d.subjectSlug)}
                    </span>
                    <DeadlineCountdown dueDate={d.dueDate} />
                  </div>
                  <Link
                    href={`/deadlines/${d.id}`}
                    className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 transition-colors"
                  >
                    {d.title}
                  </Link>
                  <div className="text-xs text-zinc-400 mt-1">
                    Hạn: {new Date(d.dueDate).toLocaleString('vi-VN')}
                  </div>
                </div>

                <MarkCompletedButton deadlineId={d.id} completedBy={d.completedBy} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* completed deadlines list */}
      {completedDeadlines.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Deadline đã hoàn thành ({completedDeadlines.length})
          </h2>
          <div className="space-y-3 opacity-75">
            {completedDeadlines.map((d) => (
              <div
                key={d.id}
                className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center gap-4"
              >
                <div>
                  <div className="text-xs text-zinc-400">{subjectMap.get(d.subjectSlug)}</div>
                  <Link href={`/deadlines/${d.id}`} className="font-semibold text-zinc-700 dark:text-zinc-300 line-through">
                    {d.title}
                  </Link>
                </div>
                <MarkCompletedButton deadlineId={d.id} completedBy={d.completedBy} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
