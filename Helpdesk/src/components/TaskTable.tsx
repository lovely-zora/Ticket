// ─────────────────────────────────────────────────────────────────────────────
//  Live task table – supports inline status changes and actual hours editing.
//  Row background colours update dynamically based on task status.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Task, Status, Priority } from '../types';

interface TaskTableProps {
  tasks: Task[];
  onStatusChange:      (id: string, status: Status)  => void;
  onActualHoursChange: (id: string, hours: number)   => void;
  onDelete:            (id: string)                  => void;
}

// ── Row colour helpers ──────────────────────────────────────────────────────
const statusRowClass: Record<Status, string> = {
  'Pending':     'bg-white hover:bg-slate-50',
  'In Progress': 'bg-amber-50 hover:bg-amber-100/60',
  'Completed':   'bg-emerald-50 hover:bg-emerald-100/60',
};

const statusBadgeClass: Record<Status, string> = {
  'Pending':     'bg-slate-100 text-slate-600',
  'In Progress': 'bg-amber-100 text-amber-700',
  'Completed':   'bg-emerald-100 text-emerald-700',
};

const priorityBadgeClass: Record<Priority, string> = {
  'Low':      'bg-blue-50  text-blue-600',
  'Medium':   'bg-violet-50 text-violet-600',
  'High':     'bg-orange-50 text-orange-600',
  'Critical': 'bg-rose-50  text-rose-600',
};

const categoryIcon: Record<string, string> = {
  Development: '💻', Design: '🎨', Meeting: '🤝',
  Review: '🔍', Research: '📚', Admin: '🗂️', Other: '📌',
};

const TaskTable: React.FC<TaskTableProps> = ({
  tasks, onStatusChange, onActualHoursChange, onDelete,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <div className="mb-3 text-5xl">📋</div>
        <p className="text-sm font-medium text-slate-500">No tasks yet</p>
        <p className="mt-1 text-xs text-slate-400">Use the form above to add your first task for today.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* scrollable wrapper so the table doesn't break the layout */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['#', 'Task', 'Category', 'Priority', 'Status', 'Est.h', 'Act.h', ''].map((h) => (
                <th key={h}
                  className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task, idx) => (
              <tr key={task.id}
                className={`transition-colors duration-200 ${statusRowClass[task.status]}`}>

                {/* Index */}
                <td className="w-8 px-4 py-3 text-xs font-medium text-slate-400">{idx + 1}</td>

                {/* Task name */}
                <td className="max-w-[200px] px-4 py-3">
                  <span className={`block truncate font-medium text-slate-800 ${task.status === 'Completed' ? 'line-through opacity-60' : ''}`}>
                    {task.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>

                {/* Category */}
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="flex items-center gap-1 text-xs text-slate-600">
                    <span>{categoryIcon[task.category] ?? '📌'}</span>
                    {task.category}
                  </span>
                </td>

                {/* Priority badge */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${priorityBadgeClass[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>

                {/* Status dropdown */}
                <td className="px-4 py-3">
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
                    className={`rounded-lg border-0 px-2 py-1 text-xs font-semibold outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-emerald-300 cursor-pointer ${statusBadgeClass[task.status]}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>

                {/* Est. Hours */}
                <td className="px-4 py-3 text-xs text-slate-600">{task.estHours}h</td>

                {/* Actual Hours – inline editable */}
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={task.actualHours === 0 ? '' : task.actualHours}
                    onChange={(e) => onActualHoursChange(task.id, parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
                  />
                </td>

                {/* Delete */}
                <td className="px-3 py-3">
                  <button
                    onClick={() => onDelete(task.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-400"
                    title="Remove task"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer summary bar */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-[11px] text-slate-500">
        <span>{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</span>
        <span>
          Est. total: <strong className="text-slate-700">{tasks.reduce((s, t) => s + t.estHours, 0).toFixed(2)}h</strong>
          &nbsp;·&nbsp; Actual total: <strong className="text-slate-700">{tasks.reduce((s, t) => s + t.actualHours, 0).toFixed(2)}h</strong>
        </span>
      </div>
    </div>
  );
};

export default TaskTable;
