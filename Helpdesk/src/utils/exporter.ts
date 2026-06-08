// ─────────────────────────────────────────────────────────────────────────────
//  Excel / CSV Export Logic using SheetJS (xlsx)
//
//  SheetJS converts a JavaScript array-of-objects into a full .xlsx workbook:
//    1. utils.json_to_sheet()  → turns our Task[] into a worksheet
//    2. utils.book_new()       → creates an empty workbook container
//    3. utils.book_append_sheet() → attaches the worksheet to the workbook
//    4. writeFile()            → serialises & triggers a browser download
// ─────────────────────────────────────────────────────────────────────────────

import * as XLSX from 'xlsx';
import { Task } from '../types';

/** Format today's date as YYYY-MM-DD for filenames & the archive column. */
export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * exportToExcel
 * ─────────────
 * Accepts the current task list, appends a "Date Logged" column,
 * and downloads a .xlsx file named Daily_Archive_<date>.xlsx.
 */
export function exportToExcel(tasks: Task[]): void {
  const dateLogged = todayDateString();

  // Step 1 – Map Task objects → plain rows the spreadsheet can understand
  const rows = tasks.map((t) => ({
    'Task Name':    t.name,
    'Category':     t.category,
    'Priority':     t.priority,
    'Status':       t.status,
    'Est. Hours':   t.estHours,
    'Actual Hours': t.actualHours,
    'Created At':   new Date(t.createdAt).toLocaleString(),
    'Date Logged':  dateLogged,   // ← the important archive column
  }));

  // Step 2 – Convert the row array into a SheetJS worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Step 3 – Apply column widths for readability
  worksheet['!cols'] = [
    { wch: 30 }, // Task Name
    { wch: 14 }, // Category
    { wch: 10 }, // Priority
    { wch: 12 }, // Status
    { wch: 11 }, // Est. Hours
    { wch: 13 }, // Actual Hours
    { wch: 22 }, // Created At
    { wch: 14 }, // Date Logged
  ];

  // Step 4 – Create a new workbook and attach the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Archive');

  // Step 5 – Trigger the browser download
  XLSX.writeFile(workbook, `Daily_Archive_${dateLogged}.xlsx`);
}

/**
 * exportToCSV
 * ───────────
 * Lighter alternative – downloads a .csv file via SheetJS's csv output type.
 */
export function exportToCSV(tasks: Task[]): void {
  const dateLogged = todayDateString();

  const rows = tasks.map((t) => ({
    'Task Name':    t.name,
    'Category':     t.category,
    'Priority':     t.priority,
    'Status':       t.status,
    'Est. Hours':   t.estHours,
    'Actual Hours': t.actualHours,
    'Created At':   new Date(t.createdAt).toLocaleString(),
    'Date Logged':  dateLogged,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csv       = XLSX.utils.sheet_to_csv(worksheet);

  // Create a temporary anchor element and simulate a click to download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Daily_Archive_${dateLogged}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
