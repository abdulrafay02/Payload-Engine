'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { LoadData, QuoteResult, AuditEntry, VehicleConfig } from '@/lib/types';
import { DEFAULT_VEHICLE, DEFAULT_LOAD_DATA, STORAGE_KEYS } from '@/lib/constants';
import { calculateQuote } from '@/lib/pricingEngine';

export function usePayload() {
  const [loadData, setLoadData] = useState<LoadData>(DEFAULT_LOAD_DATA);
  const [vehicle, setVehicle] = useState<VehicleConfig>(DEFAULT_VEHICLE);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  // Initialize from storage
  useEffect(() => {
    setMounted(true);
    const savedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT_TRAIL);
    if (savedAudit) {
      try {
        setAuditEntries(JSON.parse(savedAudit));
      } catch (e) {
        console.error('Failed to load audit trail', e);
      }
    }
  }, []);

  // Persist audit trail
  useEffect(() => {
    if (auditEntries.length > 0) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_TRAIL, JSON.stringify(auditEntries));
    }
  }, [auditEntries]);

  const quote = useMemo(() => {
    if (loadData.loadedMiles > 0 && loadData.weight > 0) {
      return calculateQuote(loadData, vehicle);
    }
    return null;
  }, [loadData, vehicle]);

  const handleDataExtracted = useCallback((data: LoadData, note: string) => {
    setLoadData(data);
    setAiNote(note);
  }, []);

  const handleManualChange = useCallback((updates: Partial<LoadData>) => {
    setLoadData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleReset = useCallback(() => {
    setLoadData(DEFAULT_LOAD_DATA);
    setAiNote(null);
  }, []);

  const handleCommit = useCallback(() => {
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
  }, [loadData, quote, aiNote]);

  const handleStatusChange = useCallback((id: string, status: 'won' | 'lost') => {
    setAuditEntries(prev => prev.map(entry =>
      entry.id === id ? { ...entry, status } : entry
    ));
  }, []);

  const clearAudit = useCallback(() => {
    setAuditEntries([]);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_TRAIL);
  }, []);

  return {
    loadData,
    vehicle,
    setVehicle,
    aiNote,
    setAiNote,
    auditEntries,
    quote,
    mounted,
    handleDataExtracted,
    handleManualChange,
    handleReset,
    handleCommit,
    handleStatusChange,
    clearAudit,
  };
}
