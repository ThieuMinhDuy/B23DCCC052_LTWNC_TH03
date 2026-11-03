import type { Metadata } from 'next';
import { getDeadlines, getSubjects } from '@/lib/data';
import { DeadlineFilter } from '@/components/DeadlineFilter';

// isr 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tất cả Deadline',
  description: 'Danh sách tổng hợp các bài tập, đồ án, lab thực hành công khai của lớp với cơ chế ISR 60s.',
};

// deadlines list page - isr 60s
export default async function DeadlinesPage() {
  const deadlines = await getDeadlines();
  const subjects = await getSubjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
            Tất cả Deadline của lớp
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Dữ liệu tĩnh tự động làm mới ngầm sau mỗi 60 giây (ISR)
          </p>
        </div>
      </div>

      <DeadlineFilter initialDeadlines={deadlines} subjects={subjects} />
    </div>
  );
}
