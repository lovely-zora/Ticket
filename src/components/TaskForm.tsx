// ─────────────────────────────────────────────
//  Task input form – left panel
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Priority, Category } from '../types';

interface TaskFormProps {
  onAdd: (task: Task) => void;
}

const CATEGORIES: Category[] = [
  'Development', 'Design', 'Meeting', 'Review', 'Research', 'Admin', 'Other',
];

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

const defaultForm = {
  name:      '',
  category:  'Development' as Category,
  priority:  'Medium' as Priority,
  estHours:  '',
};

const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
  const [form, setForm]     = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())              errs.name     = 'Task name is required.';
    if (!form.estHours || Number(form.estHours) <= 0)
      errs.estHours = 'Enter a valid positive number.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const newTask: Task = {
      id:          uuidv4(),
      name:        form.name.trim(),
      category:    form.category,
      priority:    form.priority,
      estHours:    parseFloat(form.estHours),
      actualHours: 0,
      status:      'Pending',
      createdAt:   new Date().toISOString(),
    };

    onAdd(newTask);
    setForm(defaultForm);
    setErrors({});
  };

  const field = (key: keyof typeof form, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
        Add New Task
      </h2>

      <div className="space-y-3">
        {/* Task Name */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Task Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => field('name', e.target.value)}
            placeholder="e.g. Review pull request #42"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition
              focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
              ${errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}
          />
          {errors.name && <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>}
        </div>

        {/* Category + Priority in a grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
            <select
              value={form.category}
              onChange={(e) => field('category', e.target.value as Category)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => field('priority', e.target.value as Priority)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Est. Hours */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Estimated Hours <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="0.25"
            step="0.25"
            value={form.estHours}
            onChange={(e) => field('estHours', e.target.value)}
            placeholder="e.g. 2.5"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition
              focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
              ${errors.estHours ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}
          />
          {errors.estHours && <p className="mt-1 text-[11px] text-rose-500">{errors.estHours}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-1 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
