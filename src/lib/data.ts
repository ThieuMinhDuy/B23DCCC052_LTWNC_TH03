import fs from 'fs/promises';
import path from 'path';
import { Deadline, Subject, User } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SUBJECTS_FILE = path.join(DATA_DIR, 'subjects.json');
const DEADLINES_FILE = path.join(DATA_DIR, 'deadlines.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// --- SUBJECTS ---

export async function getSubjects(): Promise<Subject[]> {
  try {
    const raw = await fs.readFile(SUBJECTS_FILE, 'utf-8');
    return JSON.parse(raw) as Subject[];
  } catch (error) {
    console.error('Lỗi khi đọc file subjects.json:', error);
    return [];
  }
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.slug === slug) || null;
}

// --- DEADLINES ---

export async function getDeadlines(): Promise<Deadline[]> {
  try {
    const raw = await fs.readFile(DEADLINES_FILE, 'utf-8');
    return JSON.parse(raw) as Deadline[];
  } catch (error) {
    console.error('Lỗi khi đọc file deadlines.json:', error);
    return [];
  }
}

export async function getDeadlineById(id: string): Promise<Deadline | null> {
  const deadlines = await getDeadlines();
  return deadlines.find((d) => d.id === id) || null;
}

export async function getDeadlinesBySubject(subjectSlug: string): Promise<Deadline[]> {
  const deadlines = await getDeadlines();
  return deadlines.filter((d) => d.subjectSlug === subjectSlug);
}

export async function saveDeadlines(deadlines: Deadline[]): Promise<void> {
  await fs.writeFile(DEADLINES_FILE, JSON.stringify(deadlines, null, 2), 'utf-8');
}

export async function createDeadline(
  data: Omit<Deadline, 'id' | 'createdAt' | 'completedBy'>
): Promise<Deadline> {
  const deadlines = await getDeadlines();
  
  // Tạo id số tự tăng hoặc chuỗi số lớn nhất + 1
  const numericIds = deadlines
    .map((d) => parseInt(d.id, 10))
    .filter((n) => !isNaN(n));
  const nextId = numericIds.length > 0 ? (Math.max(...numericIds) + 1).toString() : '1';

  const newDeadline: Deadline = {
    ...data,
    id: nextId,
    createdAt: new Date().toISOString(),
    completedBy: [],
  };

  deadlines.unshift(newDeadline);
  await saveDeadlines(deadlines);
  return newDeadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const deadlines = await getDeadlines();
  const initialLength = deadlines.length;
  const filtered = deadlines.filter((d) => d.id !== id);

  if (filtered.length === initialLength) {
    return false;
  }

  await saveDeadlines(filtered);
  return true;
}

export async function toggleDeadlineCompletion(
  deadlineId: string,
  userId: string
): Promise<Deadline | null> {
  const deadlines = await getDeadlines();
  const index = deadlines.findIndex((d) => d.id === deadlineId);

  if (index === -1) {
    return null;
  }

  const deadline = deadlines[index];
  const isCompleted = deadline.completedBy.includes(userId);

  if (isCompleted) {
    deadline.completedBy = deadline.completedBy.filter((uid) => uid !== userId);
  } else {
    deadline.completedBy.push(userId);
  }

  deadlines[index] = deadline;
  await saveDeadlines(deadlines);
  return deadline;
}

// --- USERS ---

export async function getUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(raw) as User[];
  } catch (error) {
    console.error('Lỗi khi đọc file users.json:', error);
    return [];
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}
