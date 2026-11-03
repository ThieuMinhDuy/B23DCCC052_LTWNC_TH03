import Link from 'next/link';
import { HeaderAuth, HeaderNavLinks } from '@/components/HeaderAuth';

// header component without server cookie dependency
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* logo & brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-zinc-900 dark:text-zinc-100">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-sm">
              DH
            </span>
            <span>Class Deadline Hub</span>
          </Link>

          <HeaderNavLinks />
        </div>

        {/* auth actions */}
        <HeaderAuth />
      </div>
    </header>
  );
}
