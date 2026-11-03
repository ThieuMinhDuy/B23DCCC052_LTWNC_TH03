import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { SessionProvider } from '@/components/SessionProvider';
import './globals.css';

// local next/font
const appFont = localFont({
  src: '../../public/fonts/font-vietnamese.woff2',
  variable: '--font-app',
  display: 'swap',
});

// default site metadata
export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    template: '%s | Class Deadline Hub PTIT',
    default: 'Class Deadline Hub - Cổng thông tin Deadline PTIT',
  },
  description: 'Hệ thống quản lý, theo dõi deadline công khai và cá nhân hóa cho sinh viên lớp học PTIT.',
};

// root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${appFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
