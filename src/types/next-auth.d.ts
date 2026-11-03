import { Role } from '@/types';
import { DefaultSession } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

// augment session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: Role;
  }
}

// augment jwt types
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: Role;
  }
}
