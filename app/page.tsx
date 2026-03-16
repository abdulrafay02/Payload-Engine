'use client';

import React, { useState, useEffect, useMemo } from 'react';
import TelemetryBar from '@/components/TelemetryBar';
import InputMatrix from '@/components/InputMatrix';
import OutputDisplay from '@/components/OutputDisplay';
import AuditTrail from '@/components/AuditTrail';
import { LoadData, QuoteResult, AuditEntry } from '@/lib/types';
import { calculateQuote } from '@/lib/pricingEngine';
import { History, Save } from 'lucide-react';

export default function PayloadApp() {
  const [loadData, setLoadData] = useState<LoadData>({
    origin: '',
    destination: '',
    loadedMiles: 0,
    deadheadMiles: 0,
    weight: 0,
  });

  const [aiNote, setAiNote] = useState<string | null>(null);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load audit trail from localStorage on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem('payload_audit_trail');
    if (saved) {
      try {
        setAuditEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load audit trail', e);
      }
    }
  }, []);

  // Save audit trail to localStorage when it changes
  useEffect(() => {
    if (auditEntries.length > 0) {
      localStorage.setItem('payload_audit_trail', JSON.stringify(auditEntries));
    }
  }, [auditEntries]);

  const quote = useMemo(() => {
    if (loadData.loadedMiles > 0 && loadData.weight > 0) {
      return calculateQuote(loadData);
    }
    return null;
  }, [loadData]);

  const handleDataExtracted = (data: LoadData, note: string) => {
    setLoadData(data);
    setAiNote(note);
  };

  const handleManualChange = (updates: Partial<LoadData>) => {
    setLoadData(prev => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setLoadData({
      origin: '',
      destination: '',
      loadedMiles: 0,
      deadheadMiles: 0,
      weight: 0,
    });
    setAiNote(null);
  };

  const handleCommit = () => {
    if (!quote) return;

    const newEntry: AuditEntry = {
      ...loadData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      quote,
      aiNote: aiNote || undefined,
      status: 'pending',
    };

    setAuditEntries(prev => [newEntry, ...prev]);
  };

  const handleStatusChange = (id: string, status: 'won' | 'lost') => {
    setAuditEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, status } : entry
    ));
  };

  return (
    <main suppressHydrationWarning className="min-h-screen bg-industrial-black flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-safety-orange selection:text-black">
      {/* Main Content Box */}
      <div className="w-full max-w-xl z-10 flex flex-col border-1 border-gray-600 bg-industrial-black">
        <TelemetryBar />
        
        <div className="flex flex-col">
          <InputMatrix 
            onDataExtracted={handleDataExtracted}
            manualData={loadData}
            onManualChange={handleManualChange}
            onAiNoteUpdate={setAiNote}
            onReset={handleReset}
          />
          
          <OutputDisplay 
            quote={quote}
            aiNote={aiNote}
            onCommit={handleCommit}
          />
        </div>

        {/* Footer / Actions */}
        <footer className="thick-divider bg-industrial-grey/20 p-4 flex justify-between items-center relative">
          <div className="absolute inset-x-0 top-0 h-px border-t-1 border-gray-600 rugged-line pointer-events-none" />
          <div className="flex gap-2 md:gap-4">
            <button 
              suppressHydrationWarning
              onClick={handleReset}
              className="text-[8px] md:text-[9px] font-bold text-gray-500 hover:text-safety-orange transition-colors uppercase tracking-widest"
            >
              [RESET]
            </button>
            <button 
              suppressHydrationWarning
              onClick={() => setIsAuditOpen(true)}
              className="text-[8px] md:text-[9px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              [LOGS]
            </button>
            <button 
              suppressHydrationWarning
              onClick={() => setAuditEntries([])}
              className="text-[8px] md:text-[9px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              [CLEAR]
            </button>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <div className="w-1.5 h-1.5 bg-safety-orange animate-pulse rounded-full" />
            <span className="text-[8px] md:text-[9px] font-bold text-safety-orange uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap">SYS_READY</span>
          </div>
        </footer>
      </div>

      <AuditTrail 
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        entries={auditEntries}
        onStatusChange={handleStatusChange}
      />
    </main>
  );
}
