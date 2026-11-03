'use client';

import { useState, useTransition } from 'react';
import { Deadline, Subject } from '@/types';
import { createDeadlineAction, deleteDeadlineAction } from '@/lib/actions';

// admin deadline manager with form and delete
export function AdminDeadlineManager({
  deadlines,
  subjects,
}: {
  deadlines: Deadline[];
  subjects: Subject[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // handle delete
  function handleDelete(id: string, title: string) {
    if (!confirm(`Bạn có chắc chắn muốn xoá deadline "${title}"?`)) return;

    setError('');
    setSuccess('');
    startTransition(async () => {
      const res = await deleteDeadlineAction(id);
      if (res.success) {
        setSuccess('Đã xoá deadline thành công!');
      } else {
        setError(res.error || 'Xoá thất bại');
      }
    });
  }

  // handle create
  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createDeadlineAction(formData);
      if (res.success) {
        setSuccess('Đã thêm deadline mới thành công!');
        form.reset();
        setShowAddForm(false);
      } else {
        setError(res.error || 'Thêm deadline thất bại');
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* alert feedback */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 rounded-xl text-sm">
          {success}
        </div>
      )}

      {/* header & toggle form button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Danh sách quản lý ({deadlines.length})
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          {showAddForm ? 'Đóng form' : '+ Thêm Deadline mới'}
        </button>
      </div>

      {/* create form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
        >
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Tạo Deadline học phần mới
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Tiêu đề deadline *
              </label>
              <input
                name="title"
                required
                placeholder="VD: Bài thực hành 4"
                className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Môn học *
              </label>
              <select
                name="subjectSlug"
                required
                className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Hạn chót (Due date) *
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                required
                className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Độ ưu tiên *
              </label>
              <select
                name="priority"
                defaultValue="medium"
                className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="high">Cao (High)</option>
                <option value="medium">Trung bình (Medium)</option>
                <option value="low">Thấp (Low)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              Mô tả chi tiết yêu cầu *
            </label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Nội dung bài tập, định dạng nộp file, lưu ý..."
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {isPending ? 'Đang xử lý...' : 'Lưu Deadline'}
            </button>
          </div>
        </form>
      )}

      {/* deadlines management table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs uppercase text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Tiêu đề & Môn</th>
                <th className="px-5 py-3.5">Hạn chót</th>
                <th className="px-5 py-3.5">Ưu tiên</th>
                <th className="px-5 py-3.5">Đã hoàn thành</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {deadlines.map((d) => (
                <tr key={d.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                  <td className="px-5 py-4 font-mono text-xs text-zinc-400">{d.id}</td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{d.title}</div>
                    <div className="text-xs text-zinc-400">{d.subjectSlug}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500 whitespace-nowrap">
                    {new Date(d.dueDate).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase ${
                        d.priority === 'high'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : d.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {d.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500">
                    {d.completedBy.length} SV
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(d.id, d.title)}
                      disabled={isPending}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-400 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
