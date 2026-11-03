'use client';

import { useState, useTransition, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toggleDeadlineAction } from '@/lib/actions';

// mark completed toggle button
export function MarkCompletedButton({
  deadlineId,
  completedBy,
}: {
  deadlineId: string;
  completedBy: string[];
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isInitiallyCompleted = userId ? completedBy.includes(userId) : false;

  const [completed, setCompleted] = useState(isInitiallyCompleted);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (userId) {
      setCompleted(completedBy.includes(userId));
    }
  }, [userId, completedBy]);

  if (!session?.user) {
    return (
      <div className="text-xs text-zinc-500 italic">
        Đăng nhập sinh viên để đánh dấu đã hoàn thành deadline này.
      </div>
    );
  }

  function handleToggle() {
    startTransition(async () => {
      const nextState = !completed;
      setCompleted(nextState);
      const res = await toggleDeadlineAction(deadlineId);
      if (!res.success) {
        setCompleted(!nextState);
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
        completed
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
          : 'border-2 border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-zinc-800 dark:text-zinc-200'
      }`}
    >
      <span>{completed ? '✓ Đã hoàn thành' : '○ Đánh dấu đã xong'}</span>
      {isPending && <span className="animate-spin text-xs">⌛</span>}
    </button>
  );
}
