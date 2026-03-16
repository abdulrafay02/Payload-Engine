'use client';

import React from 'react';
import { QuoteResult } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';

interface OutputDisplayProps {
  quote: QuoteResult | null;
  aiNote: string | null;
  onCommit: () => void;
}

export default function OutputDisplay({ quote, aiNote, onCommit }: OutputDisplayProps) {
  const hasCriticalWarnings = quote?.isOverweight || quote?.isOverSize;
  const displayBid = quote ? quote.recommendedBid : 0;

  return (
    <section className="flex flex-col">
      {/* Primary Output */}
      <div className={`p-3 flex items-center justify-between transition-colors ${hasCriticalWarnings ? 'bg-red-600/20' : 'bg-safety-orange'}`}>
        <div className="flex flex-col">
          <span className={`text-[7px] font-bold mb-0.5 tracking-[0.3em] uppercase ${hasCriticalWarnings ? 'text-red-500' : 'text-black opacity-60'}`}>
            {hasCriticalWarnings ? 'VALUATION_CRITICAL_WARNING' : 'VALUATION_RECOMMENDED'}
          </span>
          <h1 className={`text-2xl md:text-4xl font-bold tracking-tighter ${hasCriticalWarnings ? 'text-red-500' : 'text-black'}`}>
            BID: ${displayBid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h1>
        </div>
        {quote && (
          <button 
            suppressHydrationWarning
            onClick={onCommit}
            className={`px-4 py-1.5 font-bold text-base border-2 transition-all active:scale-95 ${hasCriticalWarnings ? 'bg-black text-red-500 border-red-500' : 'bg-black text-safety-orange border-black hover:bg-gray-900'}`}
          >
            COMMIT
          </button>
        )}
      </div>

      {/* Warnings & AI Notes */}
      {(quote && (quote.warnings.length > 0 || aiNote)) && (
        <div className="flex flex-col border-t-2 border-gray-600 relative">
          <div className="absolute inset-x-0 top-0 h-px border-t-2 border-gray-600 rugged-line pointer-events-none" />
          {quote.warnings.length > 0 && (
            <div className="bg-red-950/20 p-2 flex flex-col gap-1 relative border-b-2 border-gray-600">
              <div className="absolute inset-x-0 bottom-0 h-px border-b-2 border-gray-600 rugged-line pointer-events-none" />
              <span className="text-[6px] text-red-500 font-bold uppercase tracking-widest mb-1">Alert_Status</span>
              {quote.warnings.map((warning, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[8px] text-red-500 font-bold uppercase tracking-wider">
                  <AlertTriangle size={8} /> {warning}
                </div>
              ))}
            </div>
          )}

          {aiNote && (
            <div className="bg-safety-orange/5 p-2 flex flex-col gap-1">
              <span className="text-[6px] text-safety-orange font-bold uppercase tracking-widest mb-1">AI_Intelligence</span>
              <div className="flex items-start gap-2">
                <div className="bg-safety-orange text-black font-bold text-[6px] px-1 py-0.5 tracking-widest">LOG</div>
                <p className="text-[9px] text-safety-orange leading-tight font-bold uppercase tracking-tight opacity-80">
                  {aiNote}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t-1 border-gray-600 bg-industrial-grey/10 relative">
        <div className="absolute inset-x-0 top-0 h-px border-t-1 border-gray-600 rugged-line pointer-events-none" />
        <div className="flex flex-col p-2 border-r-1 border-gray-600 relative">
          <div className="absolute inset-y-0 right-0 w-px border-r-1 border-gray-600 rugged-line pointer-events-none" />
          <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Base_Pay</span>
          <span className="text-sm font-bold text-white">${quote ? quote.basePay.toFixed(2) : '0.00'}</span>
        </div>
        <div className="flex flex-col p-2 border-r-1 border-gray-600 relative">
          <div className="absolute inset-y-0 right-0 w-px border-r-1 border-gray-600 rugged-line pointer-events-none" />
          <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Fuel_SC</span>
          <span className="text-sm font-bold text-white">${quote ? quote.fuelSurcharge.toFixed(2) : '0.00'}</span>
        </div>
        <div className="flex flex-col p-2 border-r-1 border-gray-600 relative">
          <div className="absolute inset-y-0 right-0 w-px border-r-1 border-gray-600 rugged-line pointer-events-none" />
          <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">DH_Cost</span>
          <span className="text-sm font-bold text-white">${quote ? quote.deadheadCost.toFixed(2) : '0.00'}</span>
        </div>
        <div className="flex flex-col p-2">
          <span className="text-[7px] text-safety-orange font-bold uppercase tracking-widest">Est_CPM</span>
          <span className="text-sm font-bold text-safety-orange">${quote ? quote.cpm.toFixed(2) : '0.00'}</span>
        </div>
      </div>
    </section>
  );
}
