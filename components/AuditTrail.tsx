'use client';

import React from 'react';
import { AuditEntry } from '@/lib/types';
import { History, X, TrendingUp, TrendingDown } from 'lucide-react';
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
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-industrial-black border-l-4 border-[#888] z-[70] flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b-4 border-[#888] flex justify-between items-center bg-industrial-grey/20">
              <div className="flex items-center gap-2">
                <History className="text-safety-orange" size={18} />
                <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white">Audit_Log_Stream</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto flex flex-col">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-20 gap-4">
                  <History size={48} />
                  <span className="text-[10px] font-bold tracking-[0.4em] uppercase">No_Records</span>
                </div>
              ) : (
                entries.map((entry, idx) => (
                  <div key={entry.id} className={`p-4 flex flex-col gap-3 bg-black/20 ${idx !== entries.length - 1 ? 'border-b-2 border-[#888]' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-safety-orange uppercase tracking-tight">
                          {entry.origin || 'LOC_A'} → {entry.destination || 'LOC_B'}
                        </span>
                        <span className="text-[8px] text-gray-600 font-bold font-mono">
                          {new Date(entry.timestamp).toISOString().replace('T', ' ').split('.')[0]}
                        </span>
                      </div>
                      <span className="text-2xl font-bold tracking-tighter text-white">
                        ${entry.quote.recommendedBid.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 border-t border-[#444] pt-3">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Miles</span>
                        <span className="text-[11px] font-bold text-gray-300">{entry.loadedMiles}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Weight</span>
                        <span className="text-[11px] font-bold text-gray-300">{entry.weight} LB</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Status</span>
                        <div className="flex items-center gap-2">
                          {entry.status === 'pending' ? (
                            <div className="flex gap-1">
                              <button 
                                onClick={() => onStatusChange(entry.id, 'won')}
                                className="text-[8px] px-1.5 py-0.5 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green hover:text-black transition-all font-bold uppercase"
                              >
                                WON
                              </button>
                              <button 
                                onClick={() => onStatusChange(entry.id, 'lost')}
                                className="text-[8px] px-1.5 py-0.5 bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-black transition-all font-bold uppercase"
                              >
                                LOST
                              </button>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                              entry.status === 'won' ? 'text-terminal-green' : 'text-red-500'
                            }`}>
                              [{entry.status}]
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t-4 border-[#888] bg-industrial-grey/10">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Performance_Index</span>
                  <span className="text-2xl font-bold text-terminal-green">{winRate.toFixed(1)}%</span>
                </div>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-gray-600 font-bold uppercase mb-1">Won</span>
                    <div className="flex items-center gap-1 text-terminal-green">
                      <TrendingUp size={14} />
                      <span className="text-sm font-bold">{wonCount.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-gray-600 font-bold uppercase mb-1">Lost</span>
                    <div className="flex items-center gap-1 text-red-500">
                      <TrendingDown size={14} />
                      <span className="text-sm font-bold">{lostCount.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
