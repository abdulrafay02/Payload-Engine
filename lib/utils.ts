import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AuditEntry } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportAuditToCSV(entries: AuditEntry[]) {
  if (entries.length === 0) return;

  const headers = [
    'ID', 'Timestamp', 'Origin', 'Destination', 'Loaded Miles',
    'Deadhead Miles', 'Weight (lbs)', 'Base Pay', 'Fuel Surcharge',
    'Deadhead Cost', 'Total Bid', 'CPM', 'Status', 'AI Note'
  ];

  const csvRows = [headers.join(',')];

  for (const entry of entries) {
    const date = new Date(entry.timestamp).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const row = [
      escapeCSV(entry.id),
      escapeCSV(date),
      escapeCSV(entry.origin),
      escapeCSV(entry.destination),
      escapeCSV(entry.loadedMiles),
      escapeCSV(entry.deadheadMiles),
      escapeCSV(entry.weight),
      escapeCSV(entry.quote.basePay),
      escapeCSV(entry.quote.fuelSurcharge),
      escapeCSV(entry.quote.deadheadCost),
      escapeCSV(entry.quote.recommendedBid),
      escapeCSV(entry.quote.cpm),
      escapeCSV(entry.status),
      escapeCSV(entry.aiNote || '')
    ];
    csvRows.push(row.join(','));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `payload_audit_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
