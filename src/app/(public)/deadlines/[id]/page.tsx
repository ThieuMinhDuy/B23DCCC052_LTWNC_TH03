import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDeadlines, getDeadlineById, getSubjectBySlug } from '@/lib/data';
import { DeadlineCountdown } from '@/components/DeadlineCountdown';
import { MarkCompletedButton } from '@/components/MarkCompletedButton';

// generate static params for all deadlines
export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({ id: d.id }));
}

// dynamic metadata for deadline detail
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    return { title: 'Không tìm thấy deadline' };
  }

  return {
    title: `${deadline.title} | Deadline Hub`,
    description: deadline.description,
    openGraph: {
      title: deadline.title,
      description: deadline.description,
      type: 'article',
      url: `/deadlines/${id}`,
    },
  };
}

// deadline detail page - isr on-demand
export default async function DeadlineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    notFound();
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);

  // json-ld breadcrumb structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'http://localhost:3000',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: subject?.name || 'Môn học',
        item: `http://localhost:3000/subjects/${deadline.subjectSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: deadline.title,
        item: `http://localhost:3000/deadlines/${deadline.id}`,
      },
    ],
  };

  return (
    <article className="space-y-8 max-w-4xl mx-auto">
      {/* json-ld script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* breadcrumb */}
      <nav className="text-sm text-zinc-500 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <span>/</span>
        <Link href="/deadlines" className="hover:text-blue-600">Deadlines</Link>
        <span>/</span>
        {subject && (
          <>
            <Link href={`/subjects/${subject.slug}`} className="hover:text-blue-600">
              {subject.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-800 dark:text-zinc-200 font-medium truncate max-w-xs">
          {deadline.title}
        </span>
      </nav>

      {/* main content card */}
      <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {subject && (
              <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-lg">
                {subject.code} - {subject.name}
              </span>
            )}
            <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              Ưu tiên: {deadline.priority}
            </span>
          </div>
          <DeadlineCountdown dueDate={deadline.dueDate} />
        </div>

        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
          {deadline.title}
        </h1>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/70 dark:border-zinc-700/60 flex flex-wrap justify-between items-center gap-4 text-sm">
          <div>
            <span className="text-zinc-400 block text-xs">Hạn nộp chính thức</span>
            <strong className="text-zinc-800 dark:text-zinc-200 text-base">
              {new Date(deadline.dueDate).toLocaleString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </strong>
          </div>
          <div className="text-right">
            <span className="text-zinc-400 block text-xs">Sinh viên hoàn thành</span>
            <strong className="text-zinc-800 dark:text-zinc-200">
              {deadline.completedBy.length} bạn
            </strong>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Mô tả chi tiết</h2>
          <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base whitespace-pre-line bg-zinc-50/50 dark:bg-zinc-800/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            {deadline.description}
          </div>
        </div>

        {/* action button */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <MarkCompletedButton deadlineId={deadline.id} completedBy={deadline.completedBy} />
          <Link
            href="/deadlines"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            &larr; Quay lại danh sách
          </Link>
        </div>
      </div>
    </article>
  );
}
