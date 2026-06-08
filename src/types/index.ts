// ─────────────────────────────────────────────
//  Core type definitions for Daily Work Tracker
// ─────────────────────────────────────────────

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status   = 'Pending' | 'In Progress' | 'Completed';
export type Category = 'Development' | 'Design' | 'Meeting' | 'Review' | 'Research' | 'Admin' | 'Other';

export interface Task {
  id: string;
  name: string;
  category: Category;
  priority: Priority;
  estHours: number;
  actualHours: number;
  status: Status;
  createdAt: string; // ISO timestamp
}
