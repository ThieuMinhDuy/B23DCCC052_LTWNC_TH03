'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import {
  createDeadline,
  deleteDeadline,
  toggleDeadlineCompletion,
} from '@/lib/data';

// schema for creating deadline
const createDeadlineSchema = z.object({
  title: z.string().min(3, 'Tiêu đề ít nhất 3 ký tự').max(150),
  description: z.string().min(5, 'Mô tả ít nhất 5 ký tự'),
  subjectSlug: z.string().min(1, 'Vui lòng chọn môn học'),
  dueDate: z.string().min(1, 'Vui lòng chọn hạn chót'),
  priority: z.enum(['low', 'medium', 'high']),
});

// server action toggle completion
export async function toggleDeadlineAction(deadlineId: string) {
  const session = await auth();

  // check permission
  if (!session?.user || !can(session.user.role, 'mark_completed')) {
    return { success: false, error: 'Bạn không có quyền thực hiện thao tác này' };
  }

  const updated = await toggleDeadlineCompletion(deadlineId, session.user.id);
  if (!updated) {
    return { success: false, error: 'Không tìm thấy deadline' };
  }

  // revalidate paths
  revalidatePath('/deadlines');
  revalidatePath(`/deadlines/${deadlineId}`);
  revalidatePath('/dashboard');

  return { success: true, completed: updated.completedBy.includes(session.user.id) };
}

// server action create deadline
export async function createDeadlineAction(formData: FormData) {
  const session = await auth();

  // check admin permission
  if (!session?.user || !can(session.user.role, 'create_deadline')) {
    return { success: false, error: 'Chỉ Admin mới có quyền tạo deadline' };
  }

  const parsed = createDeadlineSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    subjectSlug: formData.get('subjectSlug'),
    dueDate: formData.get('dueDate'),
    priority: formData.get('priority'),
  });

  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: errorMsg };
  }

  const newDeadline = await createDeadline({
    ...parsed.data,
    createdBy: session.user.id,
  });

  // on-demand isr revalidation
  revalidatePath('/deadlines');
  revalidatePath(`/deadlines/${newDeadline.id}`);
  revalidatePath(`/subjects/${newDeadline.subjectSlug}`);
  revalidatePath('/dashboard');
  revalidatePath('/admin');

  return { success: true, deadline: newDeadline };
}

// server action delete deadline
export async function deleteDeadlineAction(deadlineId: string) {
  const session = await auth();

  // check admin permission
  if (!session?.user || !can(session.user.role, 'delete_deadline')) {
    return { success: false, error: 'Chỉ Admin mới có quyền xoá deadline' };
  }

  const success = await deleteDeadline(deadlineId);
  if (!success) {
    return { success: false, error: 'Xoá thất bại hoặc không tìm thấy deadline' };
  }

  // on-demand isr revalidation
  revalidatePath('/deadlines');
  revalidatePath(`/deadlines/${deadlineId}`);
  revalidatePath('/dashboard');
  revalidatePath('/admin');

  return { success: true };
}
