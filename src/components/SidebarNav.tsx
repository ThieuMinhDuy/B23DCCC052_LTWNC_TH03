'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon?: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Tổng quan tiến độ', icon: '📊' },
  { href: '/admin', label: 'Quản trị (Admin)', icon: '⚙️', adminOnly: true },
];

// client sidebar navigation
export function SidebarNav({ userRole }: { userRole?: string }) {
  const pathname = usePathname();

  const filteredItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly && userRole !== 'admin') return false;
    return true;
  });

  return (
    <nav className="space-y-1.5">
      {filteredItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
