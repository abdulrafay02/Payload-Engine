'use client';

import React, { useState, useEffect } from 'react';
import { QuoteResult } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';

import { motion } from 'motion/react';

interface OutputDisplayProps {
  quote: QuoteResult | null;
  aiNote: string | null;
  onCommit: () => void;
}

export default function OutputDisplay({ quote, aiNote, onCommit }: OutputDisplayProps) {
  const hasCriticalWarnings = quote?.isOverweight || quote?.isOverSize;

  const [animatedBid, setAnimatedBid] = useState(0);

  useEffect(() => {
    if (!quote) {
      setAnimatedBid(0);
      return;
    }
    const targetBid = quote.recommendedBid;
    let startTime: number;
    const duration = 800; // roll duration

    // start from a lower baseline for dramatic effect
    const baseline = targetBid * 0.3;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setAnimatedBid(baseline + ((targetBid - baseline) * easeProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [quote]);

  const [displayedAiNote, setDisplayedAiNote] = useState('');

  useEffect(() => {
    if (!aiNote) {
      setDisplayedAiNote('');
      return;
    }

    setDisplayedAiNote('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedAiNote(aiNote.substring(0, i + 1));
      i++;
      if (i >= aiNote.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [aiNote]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.5 }}
      className="flex flex-col"
    >
      {/* Primary Output */}
      <div className={`p-3 flex items-center justify-between transition-colors relative ${hasCriticalWarnings ? 'bg-red-600/20' : 'bg-text-main'}`}>
        <div className="flex flex-col">
          <span className={`text-[7px] font-bold mb-0.5 tracking-[0.3em] uppercase ${hasCriticalWarnings ? 'text-red-500' : 'text-industrial-black opacity-60'}`}>
            {hasCriticalWarnings ? 'VALUATION_CRITICAL_WARNING' : 'VALUATION_RECOMMENDED'}
          </span>
          <h1 className={`text-2xl md:text-4xl font-bold tracking-tighter ${hasCriticalWarnings ? 'text-red-500 [text-shadow:_0_0_12px_currentColor]' : 'text-industrial-black'}`}>
            BID: ${animatedBid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
        </div>
        {quote && (
          <button
            suppressHydrationWarning
            onClick={onCommit}
            className={`px-4 py-1.5 font-bold text-base border-2 transition-all active:scale-95 ${hasCriticalWarnings ? 'bg-industrial-black text-red-500 border-red-500' : 'bg-industrial-black text-main border-black hover:bg-industrial-grey'}`}
          >
            COMMIT
          </button>
        )}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
      </div>

      {/* Warnings & AI Notes */}
      {(quote && (quote.warnings.length > 0 || aiNote)) && (
        <div className="flex flex-col relative">
          {quote.warnings.length > 0 && (
            <div className="bg-red-950/20 p-2 flex flex-col gap-1 relative">
              <span className="text-[6px] text-red-500 font-bold uppercase tracking-widest mb-1">Alert_Status</span>
              {quote.warnings.map((warning, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[12px] text-red-500 font-bold uppercase tracking-wider">
                  <AlertTriangle size={8} /> {warning}
                </div>
              ))}
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
            </div>
          )}

          {aiNote && (
            <div className="bg-safety-orange/5 p-2 flex flex-col gap-1">
              <span className="text-[6px] text-safety-orange font-bold uppercase tracking-widest mb-1">AI_Intelligence</span>
              <div className="flex items-start gap-2">
                <div className="bg-safety-orange text-black font-bold text-[6px] px-1 py-0.5 tracking-widest mt-0.5 shadow-[0_0_4px_#ff6600]">LOG</div>
                <p className="text-md text-safety-orange leading-tight font-bold uppercase tracking-tight opacity-80 flex-1 min-h-[2.5rem]">
                  {displayedAiNote}
                  {aiNote && displayedAiNote.length < aiNote.length && <span className="inline-block w-2 h-3 bg-safety-orange animate-pulse ml-0.5 align-middle" />}
                </p>
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
        </div>
      )}

      {/* Stats Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-industrial-grey/10 relative">
        <div className="flex flex-col p-2 relative">
          <span className="text-[7px] text-safety-orange font-bold uppercase tracking-widest">Est_CPM</span>
          <span className="text-sm font-bold text-safety-orange">${quote ? quote.cpm.toFixed(2) : '0.00'}</span>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none md:hidden" />
          <div className="absolute inset-y-0 right-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
        </div>
        <div className="flex flex-col p-2 relative">
          <span className="text-[7px] text-text-muted font-bold uppercase tracking-widest">Base_Pay</span>
          <span className="text-sm font-bold text-text-main">${quote ? quote.basePay.toFixed(2) : '0.00'}</span>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none md:hidden" />
          <div className="absolute inset-y-0 right-0 w-[2px] bg-border-main rugged-line pointer-events-none hidden md:block" />
        </div>
        <div className="flex flex-col p-2 relative">
          <span className="text-[7px] text-text-muted font-bold uppercase tracking-widest">Fuel_SC</span>
          <span className="text-sm font-bold text-text-main">${quote ? quote.fuelSurcharge.toFixed(2) : '0.00'}</span>
          <div className="absolute inset-y-0 right-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
        </div>
        <div className="flex flex-col p-2">
          <span className="text-[7px] text-text-muted font-bold uppercase tracking-widest">DH_Cost</span>
          <span className="text-sm font-bold text-text-main">${quote ? quote.deadheadCost.toFixed(2) : '0.00'}</span>
        </div>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
      </div>
    </motion.section>
  );
}
