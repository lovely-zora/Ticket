// ═════════════════════════════════════════════════════════════════════════════
//  Daily Work Tracker Dashboard — Main Application
//  Author: Full-Stack AI Assistant
//
//  Architecture:
//    ┌─ App (state, logic, orchestration) ──────────────────────────────────┐
//    │  ┌─ Header  (nav, export buttons)                                    │
//    │  ├─ Left Panel                                                       │
//    │  │   ├─ TaskForm   (add new task)                                    │
//    │  │   └─ TaskTable  (live task list with inline edits)                │
//    │  └─ Right Panel (Dashboard)                                          │
//    │      ├─ KPICards  (total / completed / in-progress / rate)           │
//    │      └─ Charts    (donut + bar via Chart.js)                         │
//    └───────────────────────────────────────────────────────────────────── ┘
// ═════════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import { Task, Status }       from './types';
import { loadTasks, saveTasks, clearTasks } from './utils/storage';
import { exportToExcel, exportToCSV }       from './utils/exporter';

import Header       from './components/Header';
import TaskForm     from './components/TaskForm';
import TaskTable    from './components/TaskTable';
import KPICards     from './components/KPICards';
import Charts       from './components/Charts';
import ConfirmModal from './components/ConfirmModal';
import Toast, { ToastType } from './components/Toast';

// ── Toast state shape ─────────────────────────────────────────────────────────
interface ToastState {
  message: string;
  type:    ToastType;
}

// ─────────────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  // ── Core state ──────────────────────────────────────────────────────────────
  const [tasks,        setTasks]        = useState<Task[]>(() => loadTasks());
  const [modalOpen,    setModalOpen]    = useState(false);
  const [toast,        setToast]        = useState<ToastState | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | Status>('All');

  // ── Persist any change to localStorage immediately ──────────────────────────
  const persist = useCallback((updated: Task[]) => {
    setTasks(updated);
    saveTasks(updated);
  }, []);

  // ── Show a toast message ────────────────────────────────────────────────────
  const showToast = (message: string, type: ToastType = 'success') =>
    setToast({ message, type });

  // ── Add a new task ──────────────────────────────────────────────────────────
  const handleAddTask = (task: Task) => {
    const updated = [task, ...tasks];
    persist(updated);
    showToast(`✅ "${task.name}" added successfully!`);
  };

  // ── Update task status ──────────────────────────────────────────────────────
  const handleStatusChange = (id: string, status: Status) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    persist(updated);
  };

  // ── Update actual hours ─────────────────────────────────────────────────────
  const handleActualHoursChange = (id: string, hours: number) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, actualHours: hours } : t));
    persist(updated);
  };

  // ── Delete a task ───────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    const task    = tasks.find((t) => t.id === id);
    const updated = tasks.filter((t) => t.id !== id);
    persist(updated);
    showToast(`🗑️ "${task?.name ?? 'Task'}" removed.`, 'info');
  };

  // ── End-of-Day Archive ───────────────────────────────────────────────────────
  //    1. Export to Excel via SheetJS
  //    2. Clear localStorage
  //    3. Reset UI state
  const handleEndOfDay = () => {
    try {
      exportToExcel(tasks);          // triggers .xlsx download
      clearTasks();                  // wipe localStorage
      setTasks([]);                  // reset UI
      setModalOpen(false);
      setActiveFilter('All');
      showToast('📥 Archive exported & workspace cleared! Have a great evening.', 'success');
    } catch (err) {
      console.error('Export failed:', err);
      showToast('Export failed. Please try again.', 'error');
      setModalOpen(false);
    }
  };

  // ── Export CSV (no clear) ───────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (tasks.length === 0) return;
    try {
      exportToCSV(tasks);
      showToast('📄 CSV downloaded successfully!', 'success');
    } catch {
      showToast('CSV export failed. Please try again.', 'error');
    }
  };

  // ── Filtered view ───────────────────────────────────────────────────────────
  const displayedTasks = activeFilter === 'All'
    ? tasks
    : tasks.filter((t) => t.status === activeFilter);

  const filterOptions: Array<'All' | Status> = ['All', 'Pending', 'In Progress', 'Completed'];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* ── Navigation Bar ─────────────────────────────────────────────────── */}
      <Header
        taskCount={tasks.length}
        onEndOfDay={() => setModalOpen(true)}
        onExportCSV={handleExportCSV}
      />

      {/* ── Main content area ──────────────────────────────────────────────── */}
      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* ═══════════════════════════════════════════════════════════════
              LEFT PANEL — Workspace (Task Form + Task Table)
          ═══════════════════════════════════════════════════════════════ */}
          <section className="flex w-full flex-col gap-4 lg:w-[58%] xl:w-[62%]">
            {/* Section label */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Workspace
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Task form */}
            <TaskForm onAdd={handleAddTask} />

            {/* Filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {filterOptions.map((f) => {
                const count = f === 'All'
                  ? tasks.length
                  : tasks.filter((t) => t.status === f).length;

                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition
                      ${activeFilter === f
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    {f}
                    <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold
                      ${activeFilter === f ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Task table */}
            <TaskTable
              tasks={displayedTasks}
              onStatusChange={handleStatusChange}
              onActualHoursChange={handleActualHoursChange}
              onDelete={handleDelete}
            />
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              RIGHT PANEL — KPI Dashboard
          ═══════════════════════════════════════════════════════════════ */}
          <section className="flex w-full flex-col gap-4 lg:w-[42%] xl:w-[38%] lg:sticky lg:top-[65px] lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto lg:pb-4">
            {/* Section label */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                KPI Dashboard
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Scorecards */}
            <KPICards tasks={tasks} />

            {/* Charts */}
            <Charts tasks={tasks} />

            {/* Hour summary card */}
            <HourSummaryCard tasks={tasks} />
          </section>
        </div>
      </main>

      {/* ── End-of-Day Confirmation Modal ──────────────────────────────────── */}
      <ConfirmModal
        isOpen={modalOpen}
        taskCount={tasks.length}
        onConfirm={handleEndOfDay}
        onCancel={() => setModalOpen(false)}
      />

      {/* ── Toast notification ──────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Hour Summary card — extra analytics widget
// ─────────────────────────────────────────────────────────────────────────────
const HourSummaryCard: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const totalEst    = tasks.reduce((s, t) => s + t.estHours,    0);
  const totalActual = tasks.reduce((s, t) => s + t.actualHours, 0);
  const diff        = totalActual - totalEst;
  const overBudget  = diff > 0;

  // Hours breakdown by category
  const categoryMap: Record<string, { est: number; actual: number }> = {};
  tasks.forEach((t) => {
    if (!categoryMap[t.category]) categoryMap[t.category] = { est: 0, actual: 0 };
    categoryMap[t.category].est    += t.estHours;
    categoryMap[t.category].actual += t.actualHours;
  });
  const categories = Object.entries(categoryMap);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Hour Summary</h3>
          <p className="text-[11px] text-slate-400">Estimated vs. actual time</p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <Metric label="Est. Hours"    value={`${totalEst.toFixed(1)}h`}    color="text-slate-700" />
        <Metric label="Actual Hours"  value={`${totalActual.toFixed(1)}h`} color="text-slate-700" />
        <Metric
          label="Variance"
          value={tasks.length === 0 ? '—' : `${overBudget ? '+' : ''}${diff.toFixed(1)}h`}
          color={tasks.length === 0 ? 'text-slate-400' : overBudget ? 'text-rose-500' : 'text-emerald-600'}
        />
      </div>

      {/* Category breakdown */}
      {categories.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">By Category</p>
          {categories.map(([cat, hrs]) => {
            const pct = totalEst > 0 ? (hrs.est / totalEst) * 100 : 0;
            return (
              <div key={cat}>
                <div className="mb-0.5 flex items-center justify-between text-xs">
                  <span className="text-slate-600">{cat}</span>
                  <span className="text-slate-400">{hrs.est.toFixed(1)}h est.</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tasks.length === 0 && (
        <p className="mt-4 text-center text-xs text-slate-400">Add tasks to see hour analytics.</p>
      )}
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <p className={`text-lg font-bold ${color}`}>{value}</p>
    <p className="mt-0.5 text-[10px] text-slate-400">{label}</p>
  </div>
);

export default App;
