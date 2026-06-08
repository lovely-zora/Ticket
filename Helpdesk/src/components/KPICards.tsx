// ─────────────────────────────────────────────
//  KPI Scorecard widgets – top of the dashboard
// ─────────────────────────────────────────────

import React from 'react';
import { Task } from '../types';

interface KPICardsProps {
  tasks: Task[];
}

const KPICards: React.FC<KPICardsProps> = ({ tasks }) => {
  const total      = tasks.length;
  const completed  = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const pending    = tasks.filter((t) => t.status === 'Pending').length;
  const rate       = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cards = [
    {
      label: 'Total Tasks',
      value: total,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
      accent: 'bg-violet-500',
      light:  'bg-violet-50 text-violet-600',
      text:   'text-violet-700',
    },
    {
      label: 'Completed',
      value: completed,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      accent: 'bg-emerald-500',
      light:  'bg-emerald-50 text-emerald-600',
      text:   'text-emerald-700',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      accent: 'bg-amber-500',
      light:  'bg-amber-50 text-amber-600',
      text:   'text-amber-700',
    },
    {
      label: 'Pending',
      value: pending,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      accent: 'bg-slate-400',
      light:  'bg-slate-100 text-slate-500',
      text:   'text-slate-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.light}`}>
              {card.icon}
            </span>
            {/* tiny trend dot – decorative */}
            <span className={`h-2 w-2 rounded-full ${card.accent}`} />
          </div>
          <p className={`mt-3 text-2xl font-bold ${card.text}`}>{card.value}</p>
          <p className="mt-0.5 text-xs text-slate-500">{card.label}</p>
        </div>
      ))}

      {/* Completion Rate – full-width accent card */}
      <div className="col-span-2 xl:col-span-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 p-4 shadow-sm text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-100">Completion Rate</p>
            <p className="mt-1 text-3xl font-bold">{rate}%</p>
          </div>
          <div className="relative h-14 w-14">
            {/* Circular progress ring */}
            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="white" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - rate / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
              {rate}%
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{ width: `${rate}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-emerald-100">
          {completed} of {total} tasks completed today
        </p>
      </div>
    </div>
  );
};

export default KPICards;
