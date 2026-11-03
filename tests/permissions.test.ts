import { can, PERMISSION_MATRIX } from '@/lib/permissions';
import { Action, Role } from '@/types';

// unit tests for can()
describe('Hàm phân quyền can(role, action)', () => {
  // guest role tests
  describe('Vai trò guest (hoặc chưa đăng nhập)', () => {
    it('được phép xem deadline', () => {
      expect(can('guest', 'view_deadline')).toBe(true);
      expect(can(undefined, 'view_deadline')).toBe(true);
      expect(can(null, 'view_deadline')).toBe(true);
    });

    it('không được đánh dấu đã xong', () => {
      expect(can('guest', 'mark_completed')).toBe(false);
      expect(can(undefined, 'mark_completed')).toBe(false);
    });

    it('không được thêm deadline', () => {
      expect(can('guest', 'create_deadline')).toBe(false);
    });

    it('không được xoá deadline', () => {
      expect(can('guest', 'delete_deadline')).toBe(false);
    });
  });

  // user role tests
  describe('Vai trò user (sinh viên)', () => {
    it('được phép xem deadline', () => {
      expect(can('user', 'view_deadline')).toBe(true);
    });

    it('được phép đánh dấu đã xong', () => {
      expect(can('user', 'mark_completed')).toBe(true);
    });

    it('không được thêm deadline', () => {
      expect(can('user', 'create_deadline')).toBe(false);
    });

    it('không được xoá deadline', () => {
      expect(can('user', 'delete_deadline')).toBe(false);
    });
  });

  // admin role tests
  describe('Vai trò admin (lớp trưởng)', () => {
    it('toàn quyền thực hiện mọi hành động trong ma trận', () => {
      const allActions: Action[] = [
        'view_deadline',
        'mark_completed',
        'create_deadline',
        'delete_deadline',
      ];

      allActions.forEach((action) => {
        expect(can('admin', action)).toBe(true);
      });
    });
  });

  // matrix integrity tests
  describe('Tính toàn vẹn của PERMISSION_MATRIX', () => {
    it('chứa đủ 3 vai trò guest, user, admin', () => {
      expect(Object.keys(PERMISSION_MATRIX)).toEqual(['guest', 'user', 'admin']);
    });
  });
});
