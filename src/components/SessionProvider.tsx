'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

// session provider wrapper
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
