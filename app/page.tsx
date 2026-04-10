'use client';

import React, { useState, useEffect, useMemo } from 'react';
import TelemetryBar from '@/components/TelemetryBar';
import InputMatrix from '@/components/InputMatrix';
import OutputDisplay from '@/components/OutputDisplay';
import AuditTrail from '@/components/AuditTrail';
import GeometricBackground from '@/components/GeometricBackground';
import { LoadData, QuoteResult, AuditEntry, VehicleConfig, DEFAULT_VEHICLE } from '@/lib/types';
import { calculateQuote } from '@/lib/pricingEngine';
import { History, Save, Terminal } from 'lucide-react';

export default function PayloadApp() {
  const [loadData, setLoadData] = useState<LoadData>({
    origin: '',
    destination: '',
    loadedMiles: 0,
    deadheadMiles: 0,
    weight: 0,
  });

  const [vehicle, setVehicle] = useState<VehicleConfig>(DEFAULT_VEHICLE);
  const [isVehicleConfigOpen, setIsVehicleConfigOpen] = useState(false);

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
      return calculateQuote(loadData, vehicle);
    }
    return null;
  }, [loadData, vehicle]);

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
    <main suppressHydrationWarning className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-safety-orange selection:text-black">
      <GeometricBackground />
      {/* Main Content Box */}
      <div className="w-full max-w-md z-10 flex flex-col bg-bg-main relative">
        <TelemetryBar vehicle={vehicle} onConfigClick={() => setIsVehicleConfigOpen(true)} />

        <div className="flex flex-col">
          <InputMatrix
            onDataExtracted={handleDataExtracted}
            manualData={loadData}
            onManualChange={handleManualChange}
            onAiNoteUpdate={setAiNote}
            onReset={handleReset}
            vehicle={vehicle}
          />

          <OutputDisplay
            quote={quote}
            aiNote={aiNote}
            onCommit={handleCommit}
          />
        </div>

        {/* Footer / Actions */}
        <footer className="bg-industrial-grey/20 p-4 flex justify-between items-center relative">
          <div className="flex gap-2 md:gap-4">
            <button
              suppressHydrationWarning
              onClick={handleReset}
              className="text-[8px] md:text-[9px] font-bold text-text-muted hover:text-safety-orange transition-colors uppercase tracking-widest"
            >
              [RESET]
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setIsAuditOpen(true)}
              className="text-[8px] md:text-[9px] font-bold text-text-muted hover:text-text-main transition-colors uppercase tracking-widest"
            >
              [LOGS]
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setAuditEntries([])}
              className="text-[8px] md:text-[9px] font-bold text-text-muted hover:text-text-main transition-colors uppercase tracking-widest"
            >
              [CLEAR]
            </button>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2 drop-shadow-[0_0_4px_#ff6600]">
            <div className="w-1.5 h-1.5 bg-safety-orange animate-pulse rounded-full shadow-[0_0_8px_#ff6600]" />
            <span className="text-[8px] md:text-[9px] font-bold text-safety-orange uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap [text-shadow:_0_0_8px_currentColor]">SYS_READY</span>
          </div>
          <div className="absolute inset-x-0 top-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
        </footer>
        <div className="absolute inset-0 border-[2px] border-border-main rugged-line pointer-events-none" />
      </div>

      <AuditTrail
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        entries={auditEntries}
        onStatusChange={handleStatusChange}
      />

      {isVehicleConfigOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-industrial-black border-2 border-safety-orange w-full max-w-sm flex flex-col p-4 relative shadow-2xl">
            <h2 className="text-safety-orange font-black text-lg tracking-widest uppercase mb-4">[VEHICLE_CONFIGURATION]</h2>
            <div className="flex flex-col gap-3">
              <label className="text-xs text-text-muted font-bold uppercase tracking-widest flex flex-col">
                <span>Loadout Name</span>
                <input type="text" value={vehicle.name} onChange={e => setVehicle(v => ({...v, name: e.target.value}))} className="w-full mt-1 bg-black/40 border-b border-safety-orange p-2 text-white outline-none" />
              </label>
              <label className="text-xs text-text-muted font-bold uppercase tracking-widest flex flex-col">
                <span>Max Weight (LBs)</span>
                <input type="number" value={vehicle.maxWeight} onChange={e => setVehicle(v => ({...v, maxWeight: Number(e.target.value)}))} className="w-full mt-1 bg-black/40 border-b border-safety-orange p-2 text-white outline-none" />
              </label>
              <div className="grid grid-cols-3 gap-2">
                <label className="text-xs text-text-muted font-bold uppercase tracking-widest flex flex-col">
                  <span>Length&quot;</span>
                  <input type="number" value={vehicle.maxLength} onChange={e => setVehicle(v => ({...v, maxLength: Number(e.target.value)}))} className="w-full mt-1 bg-black/40 border-b border-safety-orange p-2 text-white outline-none" />
                </label>
                <label className="text-xs text-text-muted font-bold uppercase tracking-widest flex flex-col">
                  <span>Width&quot;</span>
                  <input type="number" value={vehicle.maxWidth} onChange={e => setVehicle(v => ({...v, maxWidth: Number(e.target.value)}))} className="w-full mt-1 bg-black/40 border-b border-safety-orange p-2 text-white outline-none" />
                </label>
                <label className="text-xs text-text-muted font-bold uppercase tracking-widest flex flex-col">
                  <span>Height&quot;</span>
                  <input type="number" value={vehicle.maxHeight} onChange={e => setVehicle(v => ({...v, maxHeight: Number(e.target.value)}))} className="w-full mt-1 bg-black/40 border-b border-safety-orange p-2 text-white outline-none" />
                </label>
              </div>
            </div>
            <button onClick={() => setIsVehicleConfigOpen(false)} className="mt-6 w-full py-2 bg-safety-orange text-black font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
              [CONFIRM_SPECS]
            </button>
            <div className="absolute inset-y-0 left-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
          </div>
        </div>
      )}
    </main>
  );
}
