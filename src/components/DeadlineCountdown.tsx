'use client';

import { useEffect, useState } from 'react';

// countdown badge component
export function DeadlineCountdown({ dueDate }: { dueDate: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-zinc-100 text-zinc-600">Đang tính...</span>;
  }

  const now = new Date().getTime();
  const target = new Date(dueDate).getTime();
  const diff = target - now;

  // overdue
  if (diff <= 0) {
    const overdueDays = Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24));
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        Quá hạn {overdueDays} ngày
      </span>
    );
  }

  // remaining days
  const remainingDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (remainingDays === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        Còn {remainingHours} giờ hôm nay
      </span>
    );
  }

  const badgeColor =
    remainingDays <= 3
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${badgeColor}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      Còn {remainingDays} ngày {remainingHours > 0 ? `${remainingHours}h` : ''}
    </span>
  );
}
