'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Deadline, Subject } from '@/types';
import { DeadlineCountdown } from '@/components/DeadlineCountdown';

// client deadline filter & list
export function DeadlineFilter({
  initialDeadlines,
  subjects,
}: {
  initialDeadlines: Deadline[];
  subjects: Subject[];
}) {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const subjectMap = new Map(subjects.map((s) => [s.slug, s.name]));

  // filter deadlines
  const filtered = initialDeadlines.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || d.subjectSlug === selectedSubject;
    const matchesPriority = priorityFilter === 'all' || d.priority === priorityFilter;
    return matchesSearch && matchesSubject && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* filter bar */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm deadline, bài tập, lab..."
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full md:w-1/2 flex gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả môn học</option>
            {subjects.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-36 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Độ ưu tiên</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>
      </div>

      {/* count info */}
      <div className="text-sm text-zinc-500">
        Hiển thị <strong>{filtered.length}</strong> / {initialDeadlines.length} deadline
      </div>

      {/* deadlines grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          Không tìm thấy deadline nào phù hợp với bộ lọc.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((d) => {
            const subjectName = subjectMap.get(d.subjectSlug) || d.subjectSlug;
            const priorityBadge =
              d.priority === 'high'
                ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                : d.priority === 'medium'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';

            return (
              <Link
                key={d.id}
                href={`/deadlines/${d.id}`}
                className="group p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {subjectName}
                    </span>
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md uppercase ${priorityBadge}`}>
                      {d.priority}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                    {d.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{d.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <DeadlineCountdown dueDate={d.dueDate} />
                  <span className="text-xs text-zinc-400">
                    Hạn: {new Date(d.dueDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
