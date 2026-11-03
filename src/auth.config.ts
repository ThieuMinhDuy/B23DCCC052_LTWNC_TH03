import type { NextAuthConfig } from 'next-auth';
import type { Role } from '@/types';

// auth config for edge & middleware
export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || token.sub || '';
        session.user.role = (token.role as Role) || 'user';
      }
      return session;
    },
  },
  providers: [],
};
