'use client';

import React from 'react';
import { AuditEntry } from '@/lib/types';
import { History, X, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuditTrailProps {
  isOpen: boolean;
  onClose: () => void;
  entries: AuditEntry[];
  onStatusChange: (id: string, status: 'won' | 'lost') => void;
}

export default function AuditTrail({ isOpen, onClose, entries, onStatusChange }: AuditTrailProps) {
  const wonCount = entries.filter(e => e.status === 'won').length;
  const lostCount = entries.filter(e => e.status === 'lost').length;
  const totalDecided = wonCount + lostCount;
  const winRate = totalDecided > 0 ? (wonCount / totalDecided) * 100 : 0;

  const handleExportCSV = () => {
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
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-industrial-black z-[70] flex flex-col shadow-2xl"
          >
            <div className="p-4 flex justify-between items-center bg-industrial-grey/20 relative">
              <div className="flex items-center gap-2">
                <History className="text-safety-orange" size={18} />
                <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-text-main">Audit_Log_Stream</h2>
              </div>
              <div className="flex items-center gap-1 relative z-10">
                {entries.length > 0 && (
                  <button suppressHydrationWarning onClick={handleExportCSV} className="p-2 hover:bg-white/10 transition-colors text-text-muted hover:text-safety-orange" title="Export Log to CSV">
                    <Download size={18} />
                  </button>
                )}
                <button suppressHydrationWarning onClick={onClose} className="p-2 hover:bg-white/10 transition-colors text-text-muted hover:text-text-main" title="Close Panel">
                  <X size={20} />
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
            </div>

            <div className="flex-grow overflow-y-auto flex flex-col">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-20 gap-4">
                  <History size={48} />
                  <span className="text-[10px] font-bold tracking-[0.4em] uppercase">No_Records</span>
                </div>
              ) : (
                entries.map((entry, idx) => (
                  <div key={entry.id} className="p-4 flex flex-col gap-3 bg-black/20 relative">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-safety-orange uppercase tracking-tight">
                          {entry.origin || 'LOC_A'} → {entry.destination || 'LOC_B'}
                        </span>
                        <span className="text-[8px] text-text-muted font-bold font-mono">
                          {new Date(entry.timestamp).toISOString().replace('T', ' ').split('.')[0]}
                        </span>
                      </div>
                      <span className="text-2xl font-bold tracking-tighter text-text-main">
                        ${entry.quote.recommendedBid.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 border-t border-border-main pt-3">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">Miles</span>
                        <span className="text-[11px] font-bold text-text-muted">{entry.loadedMiles}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">Weight</span>
                        <span className="text-[11px] font-bold text-text-muted">{entry.weight} LB</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">Status</span>
                        <div className="flex items-center gap-2">
                          {entry.status === 'pending' ? (
                            <div className="flex gap-1">
                              <button
                                suppressHydrationWarning
                                onClick={() => onStatusChange(entry.id, 'won')}
                                className="text-[8px] px-1.5 py-0.5 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green hover:text-black transition-all font-bold uppercase"
                              >
                                WON
                              </button>
                              <button
                                suppressHydrationWarning
                                onClick={() => onStatusChange(entry.id, 'lost')}
                                className="text-[8px] px-1.5 py-0.5 bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-black transition-all font-bold uppercase"
                              >
                                LOST
                              </button>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${entry.status === 'won' ? 'text-terminal-green' : 'text-red-500'
                              }`}>
                              [{entry.status}]
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {idx !== entries.length - 1 && <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none" />}
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-industrial-grey/10 relative">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">Performance_Index</span>
                  <span className="text-2xl font-bold text-terminal-green">{winRate.toFixed(1)}%</span>
                </div>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-text-muted font-bold uppercase mb-1">Won</span>
                    <div className="flex items-center gap-1 text-terminal-green">
                      <TrendingUp size={14} />
                      <span className="text-sm font-bold">{wonCount.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-text-muted font-bold uppercase mb-1">Lost</span>
                    <div className="flex items-center gap-1 text-red-500">
                      <TrendingDown size={14} />
                      <span className="text-sm font-bold">{lostCount.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-x-0 top-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
            </div>
            <div className="absolute inset-y-0 left-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
