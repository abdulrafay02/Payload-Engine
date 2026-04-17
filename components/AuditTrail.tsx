'use client';

import React from 'react';
import { AuditEntry } from '@/lib/types';
import { History, X, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { exportAuditToCSV } from '@/lib/utils';

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
          />

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
                  <button suppressHydrationWarning onClick={() => exportAuditToCSV(entries)} className="p-2 hover:bg-white/10 transition-colors text-text-muted hover:text-safety-orange" title="Export Log to CSV">
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
                  <AuditEntryItem 
                    key={entry.id} 
                    entry={entry} 
                    onStatusChange={onStatusChange} 
                    isLast={idx === entries.length - 1} 
                  />
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
                  <StatSummary label="Won" count={wonCount} icon={<TrendingUp size={14} />} color="green" />
                  <StatSummary label="Lost" count={lostCount} icon={<TrendingDown size={14} />} color="red" />
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

function AuditEntryItem({ entry, onStatusChange, isLast }: { entry: AuditEntry; onStatusChange: (id: string, status: 'won' | 'lost') => void; isLast: boolean }) {
  return (
    <div className="p-4 flex flex-col gap-3 bg-black/20 relative">
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
        <EntryDetail label="Miles" value={entry.loadedMiles} />
        <EntryDetail label="Weight" value={`${entry.weight} LB`} />
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">Status</span>
          <div className="flex items-center gap-2">
            {entry.status === 'pending' ? (
              <div className="flex gap-1">
                <StatusButton label="WON" onClick={() => onStatusChange(entry.id, 'won')} type="won" />
                <StatusButton label="LOST" onClick={() => onStatusChange(entry.id, 'lost')} type="lost" />
              </div>
            ) : (
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${entry.status === 'won' ? 'text-terminal-green' : 'text-red-500'}`}>
                [{entry.status}]
              </span>
            )}
          </div>
        </div>
      </div>
      {!isLast && <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none" />}
    </div>
  );
}

function EntryDetail({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">{label}</span>
      <span className="text-[11px] font-bold text-text-muted">{value}</span>
    </div>
  );
}

function StatusButton({ label, onClick, type }: { label: string; onClick: () => void; type: 'won' | 'lost' }) {
  const styles = type === 'won' 
    ? "bg-terminal-green/20 text-terminal-green border-terminal-green/30 hover:bg-terminal-green" 
    : "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500";
  
  return (
    <button
      suppressHydrationWarning
      onClick={onClick}
      className={`text-[8px] px-1.5 py-0.5 border ${styles} hover:text-black transition-all font-bold uppercase`}
    >
      {label}
    </button>
  );
}

function StatSummary({ label, count, icon, color }: { label: string; count: number; icon: React.ReactNode; color: 'green' | 'red' }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] text-text-muted font-bold uppercase mb-1">{label}</span>
      <div className={`flex items-center gap-1 ${color === 'green' ? 'text-terminal-green' : 'text-red-500'}`}>
        {icon}
        <span className="text-sm font-bold">{count.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}
