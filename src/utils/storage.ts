// ─────────────────────────────────────────────
//  localStorage helpers for task persistence
// ─────────────────────────────────────────────

import { Task } from '../types';

const STORAGE_KEY = 'dwt_tasks_v1';

/** Load tasks from localStorage. Returns an empty array if nothing is stored. */
export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

/** Persist the full task array to localStorage. */
export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/** Wipe all tasks from localStorage (called after End-of-Day archive). */
export function clearTasks(): void {
  localStorage.removeItem(STORAGE_KEY);
}
