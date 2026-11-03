import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSubjects, getSubjectBySlug, getDeadlinesBySubject } from '@/lib/data';
import { DeadlineCountdown } from '@/components/DeadlineCountdown';

// static site generation params
export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((s) => ({ slug: s.slug }));
}

// subject dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    return { title: 'Không tìm thấy môn học' };
  }

  return {
    title: `${subject.name} (${subject.code})`,
    description: subject.description,
  };
}

// subject detail page - ssg
export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const deadlines = await getDeadlinesBySubject(slug);

  return (
    <div className="space-y-8">
      {/* breadcrumb */}
      <nav className="text-sm text-zinc-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200 font-medium">{subject.name}</span>
      </nav>

      {/* header */}
      <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 text-xs font-mono font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-lg">
              {subject.code}
            </span>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2">
              {subject.name}
            </h1>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold text-zinc-800 dark:text-zinc-200">GV: {subject.teacher}</div>
            <div className="text-zinc-400">{subject.credits} tín chỉ học phần</div>
          </div>
        </div>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-3xl">
          {subject.description}
        </p>
      </div>

      {/* deadlines list */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Danh sách Deadline môn này ({deadlines.length})
        </h2>

        {deadlines.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            Hiện chưa có deadline nào cho môn học này.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deadlines.map((d) => (
              <Link
                key={d.id}
                href={`/deadlines/${d.id}`}
                className="group p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs uppercase font-bold text-zinc-400">Độ ưu tiên: {d.priority}</span>
                    <DeadlineCountdown dueDate={d.dueDate} />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                    {d.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{d.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between text-xs text-zinc-400">
                  <span>Hạn chót: {new Date(d.dueDate).toLocaleString('vi-VN')}</span>
                  <span className="font-semibold text-blue-600 group-hover:underline">Chi tiết &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
