// ─────────────────────────────────────────────
//  Top navigation bar component
// ─────────────────────────────────────────────

import React from 'react';
// todayDateString used via exporter utilities, not needed directly here

interface HeaderProps {
  taskCount: number;
  onEndOfDay: () => void;
  onExportCSV: () => void;
}

const Header: React.FC<HeaderProps> = ({ taskCount, onEndOfDay, onExportCSV }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">
        {/* ── Brand ── */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-md shadow-emerald-200">
            {/* clipboard-check icon */}
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-800 leading-none">
              Daily Work Tracker
            </h1>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{today}</p>
          </div>
        </div>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-2">
          {/* Task pill */}
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {taskCount} task{taskCount !== 1 ? 's' : ''} today
          </span>

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            disabled={taskCount === 0}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Export CSV
          </button>

          {/* End of Day */}
          <button
            onClick={onEndOfDay}
            disabled={taskCount === 0}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            End of Day Archive
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
