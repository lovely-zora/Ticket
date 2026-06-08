// ─────────────────────────────────────────────────────────────────────────────
//  Chart components powered by Chart.js + react-chartjs-2
//  - DonutChart: Task status distribution
//  - BarChart:   Tasks grouped by priority
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Task } from '../types';

// Register all required Chart.js components once
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface ChartsProps {
  tasks: Task[];
}

// ── Shared chart option defaults ──────────────────────────────────────────────
const tooltipDefaults = {
  backgroundColor: '#1e293b',
  titleColor:      '#f8fafc',
  bodyColor:       '#cbd5e1',
  borderColor:     '#334155',
  borderWidth:     1,
  cornerRadius:    8,
  padding:         10,
};

const Charts: React.FC<ChartsProps> = ({ tasks }) => {
  const pending     = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress  = tasks.filter((t) => t.status === 'In Progress').length;
  const completed   = tasks.filter((t) => t.status === 'Completed').length;

  const lowP      = tasks.filter((t) => t.priority === 'Low').length;
  const medP      = tasks.filter((t) => t.priority === 'Medium').length;
  const highP     = tasks.filter((t) => t.priority === 'High').length;
  const critP     = tasks.filter((t) => t.priority === 'Critical').length;

  // ── Donut: Status Distribution ─────────────────────────────────────────────
  const donutData = {
    labels:   ['Pending', 'In Progress', 'Completed'],
    datasets: [{
      data:            [pending, inProgress, completed],
      backgroundColor: ['#e2e8f0', '#fde68a', '#6ee7b7'],
      borderColor:     ['#cbd5e1', '#f59e0b', '#10b981'],
      borderWidth:     2,
      hoverOffset:     6,
    }],
  };

  const donutOptions = {
    responsive:         true,
    maintainAspectRatio: true,
    cutout:             '68%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth:   10,
          boxHeight:  10,
          borderRadius: 5,
          font:       { size: 11 },
          color:      '#64748b',
          padding:    14,
          usePointStyle: true,
        },
      },
      tooltip: { ...tooltipDefaults },
    },
  };

  // ── Bar: Priority Breakdown ────────────────────────────────────────────────
  const barData = {
    labels:   ['Low', 'Medium', 'High', 'Critical'],
    datasets: [{
      label:           'Tasks',
      data:            [lowP, medP, highP, critP],
      backgroundColor: ['#bfdbfe', '#ddd6fe', '#fed7aa', '#fecaca'],
      borderColor:     ['#3b82f6', '#7c3aed', '#f97316', '#ef4444'],
      borderWidth:     2,
      borderRadius:    8,
      borderSkipped:   false,
    }],
  };

  const barOptions = {
    responsive:         true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { ...tooltipDefaults },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#94a3b8',
          font: { size: 11 },
        },
        grid: {
          color: '#f1f5f9',
        },
        border: { display: false, dash: [4, 4] },
      },
    },
  };

  const isEmpty = tasks.length === 0;

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* ── Donut Chart ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Status Distribution</h3>
            <p className="text-[11px] text-slate-400">Today's task breakdown</p>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          </span>
        </div>

        {isEmpty ? (
          <EmptyChart label="No data yet — add tasks to see the chart." />
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[260px]">
              <Doughnut data={donutData} options={donutOptions} />
            </div>
          </div>
        )}
      </div>

      {/* ── Bar Chart ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Priority Breakdown</h3>
            <p className="text-[11px] text-slate-400">Tasks per priority level</p>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4"  />
              <line x1="6"  y1="20" x2="6"  y2="14" />
            </svg>
          </span>
        </div>

        {isEmpty ? (
          <EmptyChart label="No data yet — add tasks to see the chart." />
        ) : (
          <Bar data={barData} options={barOptions} />
        )}
      </div>
    </div>
  );
};

// ── Small placeholder when there is no data ────────────────────────────────
const EmptyChart: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex h-36 items-center justify-center text-center">
    <p className="text-xs text-slate-400">{label}</p>
  </div>
);

export default Charts;
