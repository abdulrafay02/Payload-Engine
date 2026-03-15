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
    <main suppressHydrationWarning className="min-h-screen bg-black flex flex-col items-center justify-center p-1 md:p-2 font-sans selection:bg-safety-orange selection:text-black">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Main Content Box */}
      <div className="w-full max-w-xl z-10 flex flex-col brutalist-border bg-industrial-black shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <TelemetryBar />
        
        <div className="flex flex-col">
          <InputMatrix 
            onDataExtracted={handleDataExtracted}
            manualData={loadData}
            onManualChange={handleManualChange}
            onAiNoteUpdate={setAiNote}
          />
          
          <OutputDisplay 
            quote={quote}
            aiNote={aiNote}
            onCommit={handleCommit}
          />
        </div>

        {/* Footer / Actions */}
        <footer className="thick-divider bg-industrial-grey/20 p-4 flex justify-between items-center">
          <div className="flex gap-4">
            <button 
              suppressHydrationWarning
              onClick={() => setIsAuditOpen(true)}
              className="text-[9px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              [VIEW_LOGS]
            </button>
            <button 
              suppressHydrationWarning
              onClick={() => setAuditEntries([])}
              className="text-[9px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              [CLEAR_CACHE]
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-safety-orange animate-pulse rounded-full" />
            <span className="text-[9px] font-bold text-safety-orange uppercase tracking-[0.2em]">SYSTEM_READY</span>
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
