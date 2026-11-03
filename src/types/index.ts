export type Role = 'admin' | 'user' | 'guest';

export type Action =
  | 'view_deadline'
  | 'mark_completed'
  | 'create_deadline'
  | 'delete_deadline';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: Role;
  avatarUrl?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  teacher: string;
  credits: number;
  color: string; // Tailwind color class or hex for nice badges
}

export type DeadlinePriority = 'low' | 'medium' | 'high';

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subjectSlug: string;
  dueDate: string; // ISO 8601 string, e.g. "2026-11-20T23:59:59Z"
  priority: DeadlinePriority;
  completedBy: string[]; // List of user IDs who marked this deadline as completed
  createdAt: string;
  createdBy: string; // user ID
}
