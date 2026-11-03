import { auth } from '@/auth';
import { SidebarNav } from '@/components/SidebarNav';

// dashboard nested layout with sidebar
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* sidebar */}
      <aside className="md:col-span-1 space-y-6">
        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="font-semibold text-sm truncate text-zinc-900 dark:text-zinc-100">
                {session?.user?.name}
              </div>
              <div className="text-xs text-zinc-500 truncate">{session?.user?.email}</div>
            </div>
          </div>
          <SidebarNav userRole={session?.user?.role} />
        </div>
      </aside>

      {/* content area */}
      <div className="md:col-span-3">{children}</div>
    </div>
  );
}
