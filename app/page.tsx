'use client';

import React, { useState } from 'react';
import TelemetryBar from '@/components/TelemetryBar';
import InputMatrix from '@/components/InputMatrix';
import OutputDisplay from '@/components/OutputDisplay';
import AuditTrail from '@/components/AuditTrail';
import GeometricBackground from '@/components/GeometricBackground';
import BootScreen from '@/components/BootScreen';
import VehicleConfigModal from '@/components/VehicleConfigModal';
import { usePayload } from '@/hooks/usePayload';

export default function PayloadApp() {
  const {
    loadData,
    vehicle,
    setVehicle,
    aiNote,
    setAiNote,
    auditEntries,
    quote,
    handleDataExtracted,
    handleManualChange,
    handleReset,
    handleCommit,
    handleStatusChange,
    clearAudit,
  } = usePayload();

  const [isVehicleConfigOpen, setIsVehicleConfigOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  return (
    <main suppressHydrationWarning className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-safety-orange selection:text-black">
      <GeometricBackground />
      <BootScreen />
      
      {/* Main Content Box */}
      <div className="w-full max-w-md z-10 flex flex-col bg-bg-main relative">
        <TelemetryBar 
          vehicle={vehicle} 
          onConfigClick={() => setIsVehicleConfigOpen(true)} 
        />

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
              onClick={clearAudit}
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

      <VehicleConfigModal 
        isOpen={isVehicleConfigOpen}
        onClose={() => setIsVehicleConfigOpen(false)}
        vehicle={vehicle}
        onVehicleChange={setVehicle}
      />
    </main>
  );
}
 
