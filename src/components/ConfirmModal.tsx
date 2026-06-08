// ─────────────────────────────────────────────
//  Confirmation dialog for End-of-Day archive
// ─────────────────────────────────────────────

import React from 'react';

interface ConfirmModalProps {
  isOpen:    boolean;
  taskCount: number;
  onConfirm: () => void;
  onCancel:  () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, taskCount, onConfirm, onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl shadow-slate-300">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <svg className="h-7 w-7 text-emerald-600" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>

        <h2 className="text-center text-lg font-bold text-slate-800">End of Day Archive</h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          This will export <span className="font-semibold text-slate-700">{taskCount} task{taskCount !== 1 ? 's' : ''}</span> to
          an Excel file (<code className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-600">.xlsx</code>),
          then <span className="font-semibold text-rose-600">clear today's workspace</span> for a fresh start tomorrow.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95"
          >
            Export &amp; Clear
          </button>
        </div>

        <p className="mt-3 text-center text-[11px] text-slate-400">
          ⚠️ This action cannot be undone. Make sure your data is correct before exporting.
        </p>
      </div>
    </div>
  );
};

export default ConfirmModal;
