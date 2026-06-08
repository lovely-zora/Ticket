// ─────────────────────────────────────────────
//  Lightweight toast / snackbar notification
// ─────────────────────────────────────────────

import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message:  string;
  type:     ToastType;
  onClose:  () => void;
  duration?: number; // ms, default 3500
}

const colourMap: Record<ToastType, string> = {
  success: 'bg-emerald-600 text-white',
  error:   'bg-rose-600 text-white',
  info:    'bg-slate-700 text-white',
};

const iconMap: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  info: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3500 }) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all ${colourMap[type]}`}>
      {iconMap[type]}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
