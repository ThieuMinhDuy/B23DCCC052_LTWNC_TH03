import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { getDeadlines, getSubjects } from '@/lib/data';
import { AdminDeadlineManager } from '@/components/AdminDeadlineManager';

// ssr dynamic
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản trị Deadline Lớp học',
  robots: {
    index: false,
    follow: false,
  },
};

// admin management page - ssr
export default async function AdminPage() {
  const session = await auth();

  // defense in depth check
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (!can(session.user.role, 'create_deadline')) {
    redirect('/403');
  }

  const deadlines = await getDeadlines();
  const subjects = await getSubjects();

  return (
    <div className="space-y-6">
      <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Khu vực Quản trị (Admin)
          </span>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
            Quản trị Deadline của Lớp
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Quyền Lớp trưởng: Thêm mới hoặc Xoá deadline. Dữ liệu sẽ tự động revalidate tức thì (On-demand ISR).
          </p>
        </div>
      </div>

      <AdminDeadlineManager deadlines={deadlines} subjects={subjects} />
    </div>
  );
}
