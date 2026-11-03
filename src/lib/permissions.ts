import { Action, Role } from '@/types';

/**
 * Ma trận phân quyền RBAC tập trung cho hệ thống Class Deadline Hub.
 * Bám sát yêu cầu đề bài:
 * - guest: Chỉ xem deadline
 * - user: Xem deadline + Đánh dấu đã xong
 * - admin: Toàn quyền (Xem, Đánh dấu đã xong, Thêm deadline, Xoá deadline)
 */
export const PERMISSION_MATRIX: Record<Role, readonly Action[]> = {
  guest: ['view_deadline'],
  user: ['view_deadline', 'mark_completed'],
  admin: ['view_deadline', 'mark_completed', 'create_deadline', 'delete_deadline'],
} as const;

/**
 * Hàm can(role, action) kiểm tra xem một vai trò có quyền thực hiện hành động hay không.
 * Nếu role không được truyền (undefined/null), mặc định coi là 'guest'.
 *
 * @param role - Vai trò của người dùng ('admin' | 'user' | 'guest')
 * @param action - Hành động cần kiểm tra quyền
 * @returns boolean - true nếu được phép, ngược lại false
 */
export function can(role: Role | null | undefined, action: Action): boolean {
  const effectiveRole: Role = role || 'guest';
  const allowedActions = PERMISSION_MATRIX[effectiveRole];
  
  if (!allowedActions) {
    return false;
  }
  
  return allowedActions.includes(action);
}
