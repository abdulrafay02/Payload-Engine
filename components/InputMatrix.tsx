'use client';

import React, { useState } from 'react';
import { LoadData } from '@/lib/types';
import { parseLoadText, parseLoadImage, getMarketInsight } from '@/lib/aiService';
import { Camera, FileText, Keyboard, Loader2, Sparkles, Info, X, RotateCcw } from 'lucide-react';

interface InputMatrixProps {
  onDataExtracted: (data: LoadData, aiNote: string) => void;
  manualData: LoadData;
  onManualChange: (data: Partial<LoadData>) => void;
  onAiNoteUpdate: (note: string) => void;
  onReset: () => void;
}

export default function InputMatrix({ onDataExtracted, manualData, onManualChange, onAiNoteUpdate, onReset }: InputMatrixProps) {
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIngestInfo, setShowIngestInfo] = useState(false);
  const [showVisionInfo, setShowVisionInfo] = useState(false);

  const handleGetInsights = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const insight = await getMarketInsight(manualData);
      onAiNoteUpdate(insight);
    } catch (err) {
      console.error('Insight error:', err);
      setError('FAILED TO RETRIEVE MARKET INSIGHTS');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextParse = async () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await parseLoadText(pastedText);
      onDataExtracted(result.data, result.aiNote);
      setPastedText('');
    } catch (err) {
      console.error('Text parse error:', err);
      setError('FAILED TO PARSE LOAD DATA');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const result = await parseLoadImage(base64);
          onDataExtracted(result.data, result.aiNote);
        } catch (err) {
          console.error('Image parse error:', err);
          setError('VISION UPLINK FAILED: UNABLE TO SCAN IMAGE');
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error:', err);
      setError('FILE READ ERROR');
      setIsProcessing(false);
    }
  };

  return (
    <section className="flex flex-col relative">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-600 text-black font-black text-[10px] p-2 flex justify-between items-center tracking-[0.2em] uppercase">
          <span>[ERROR: {error}]</span>
          <button suppressHydrationWarning onClick={() => setError(null)}><X size={12} /></button>
        </div>
      )}
      {/* Row 0: Location Inputs */}
      <div className="grid grid-cols-2 border-b-1 border-gray-600 relative">
        <div className="absolute inset-x-0 bottom-0 h-px border-b-1 border-gray-600 rugged-line pointer-events-none" />
        <div className="flex flex-col gap-0.5 bg-industrial-black p-2 border-r-1 border-gray-600 relative">
          <div className="absolute inset-y-0 right-0 w-px border-r-1 border-gray-600 rugged-line pointer-events-none" />
          <label className="text-[7px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Keyboard size={7} className="text-safety-orange" /> Origin
          </label>
          <input
            suppressHydrationWarning
            type="text"
            value={manualData.origin || ''}
            onChange={(e) => onManualChange({ origin: e.target.value })}
            className="bg-transparent p-0 text-base font-bold focus:text-safety-orange outline-none transition-colors text-white uppercase"
            placeholder="CITY, ST"
          />
        </div>
        <div className="flex flex-col gap-0.5 bg-industrial-black p-2 relative">
          <label className="text-[7px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Keyboard size={7} className="text-safety-orange" /> Destination
          </label>
          <input
            suppressHydrationWarning
            type="text"
            value={manualData.destination || ''}
            onChange={(e) => onManualChange({ destination: e.target.value })}
            className="bg-transparent p-0 text-base font-bold focus:text-safety-orange outline-none transition-colors text-white uppercase"
            placeholder="CITY, ST"
          />
        </div>
      </div>

      {/* Row 1: Manual Inputs */}
      <div className="grid grid-cols-3 border-b-1 border-gray-600 relative">
        <div className="absolute inset-x-0 bottom-0 h-px border-b-1 border-gray-600 rugged-line pointer-events-none" />
        <div className="flex flex-col gap-0.5 bg-industrial-black p-2 border-r-1 border-gray-600 relative">
          <div className="absolute inset-y-0 right-0 w-px border-r-1 border-gray-600 rugged-line pointer-events-none" />
          <label className="text-[7px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Keyboard size={7} className="text-safety-orange" /> Loaded_Miles
          </label>
          <input
            suppressHydrationWarning
            type="number"
            value={manualData.loadedMiles || ''}
            onChange={(e) => onManualChange({ loadedMiles: Number(e.target.value) })}
            className="bg-transparent p-0 text-xl font-bold focus:text-safety-orange outline-none transition-colors text-white"
            placeholder="0"
          />
        </div>
        <div className="flex flex-col gap-0.5 bg-industrial-black p-2 border-r-1 border-gray-600 relative">
          <div className="absolute inset-y-0 right-0 w-px border-r-1 border-gray-600 rugged-line pointer-events-none" />
          <label className="text-[7px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Keyboard size={7} className="text-safety-orange" /> Dead_Miles
          </label>
          <input
            suppressHydrationWarning
            type="number"
            value={manualData.deadheadMiles || ''}
            onChange={(e) => onManualChange({ deadheadMiles: Number(e.target.value) })}
            className="bg-transparent p-0 text-xl font-bold focus:text-safety-orange outline-none transition-colors text-white"
            placeholder="0"
          />
        </div>
        <div className="flex flex-col gap-0.5 bg-industrial-black p-2 relative">
          <label className="text-[7px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Keyboard size={7} className="text-safety-orange" /> Load_Weight
          </label>
          <div className="flex items-baseline gap-1.5">
            <input
              suppressHydrationWarning
              type="number"
              value={manualData.weight || ''}
              onChange={(e) => onManualChange({ weight: Number(e.target.value) })}
              className="bg-transparent p-0 text-xl font-bold focus:text-safety-orange outline-none transition-colors text-white w-full"
              placeholder="0"
            />
            <span className="text-[8px] font-bold text-gray-600">LBS</span>
          </div>
        </div>
      </div>

      {/* Row 2: AI Ingest & Vision side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 relative border-b-1 border-gray-600">
        <div className="absolute inset-x-0 bottom-0 h-px border-b-1 border-gray-600 rugged-line pointer-events-none" />
        {isProcessing && (
          <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-safety-orange" size={40} />
            <span className="text-[10px] font-bold text-safety-orange animate-pulse uppercase tracking-[0.3em]">ANALYZING_PAYLOAD...</span>
          </div>
        )}

        {/* Text Ingest */}
        <div className="flex flex-col bg-industrial-black border-r-1 border-gray-600 relative">
          <div className="absolute inset-y-0 right-0 w-px border-r-1 border-gray-600 rugged-line pointer-events-none" />
          <div className="px-2 py-2 flex justify-between items-center relative">
            <label className="text-[8px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <FileText size={9} className="text-safety-orange" /> Data_Ingest
            </label>
            <button 
              suppressHydrationWarning
              onClick={() => setShowIngestInfo(!showIngestInfo)}
              className="text-gray-500 hover:text-safety-orange transition-colors"
            >
              <Info size={10} />
            </button>
          </div>

          {showIngestInfo && (
            <div className="absolute top-8 left-2 right-2 z-30 bg-industrial-grey border-2 border-safety-orange p-2 shadow-2xl">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[7px] font-bold text-safety-orange uppercase tracking-widest">Module_Info</span>
                <button suppressHydrationWarning onClick={() => setShowIngestInfo(false)}><X size={8} className="text-gray-500" /></button>
              </div>
              <p className="text-[9px] text-gray-300 leading-tight uppercase">
                Paste raw text from load boards, emails, or messages. The AI will automatically extract origin, destination, miles, and weight to populate the matrix.
              </p>
            </div>
          )}

          <div className="flex flex-col">
            <textarea
              suppressHydrationWarning
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full h-16 bg-black/40 border-y border-[#444] p-2 text-[10px] font-mono uppercase focus:border-safety-orange outline-none resize-none text-gray-400"
              placeholder="[PASTE_PAYLOAD_DATA...]"
            />
            <div>
              <button
                suppressHydrationWarning
                onClick={handleTextParse}
                disabled={!pastedText.trim()}
                className="w-full py-2 bg-industrial-grey border border-[#666] text-white font-bold text-[9px] tracking-[0.2em] uppercase hover:bg-gray-800 disabled:opacity-30 transition-all"
              >
                [EXTRACT]
              </button>
            </div>
          </div>
        </div>

        {/* Vision Uplink */}
        <div className="flex flex-col bg-industrial-black relative">
          <div className="px-2 py-2 flex justify-between items-center relative">
            <label className="text-[8px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Camera size={9} className="text-safety-orange" /> Vision_Uplink
            </label>
            <button 
              suppressHydrationWarning
              onClick={() => setShowVisionInfo(!showVisionInfo)}
              className="text-gray-500 hover:text-safety-orange transition-colors"
            >
              <Info size={10} />
            </button>
          </div>

          {showVisionInfo && (
            <div className="absolute top-8 left-2 right-2 z-30 bg-industrial-grey border-2 border-safety-orange p-2 shadow-2xl">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[7px] font-bold text-safety-orange uppercase tracking-widest">Module_Info</span>
                <button suppressHydrationWarning onClick={() => setShowVisionInfo(false)}><X size={8} className="text-gray-500" /></button>
              </div>
              <p className="text-[9px] text-gray-300 leading-tight uppercase">
                Upload a screenshot of a load board or rate confirmation. The AI vision system will scan the image and extract all relevant payload parameters automatically.
              </p>
            </div>
          )}

          <div className="h-full">
            <label className="flex flex-col items-center justify-center cursor-pointer group w-full h-full border-y border-dashed border-[#444] hover:border-safety-orange transition-all p-4 bg-black/20">
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              <Camera size={24} className="text-safety-orange mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-white font-bold text-[8px] tracking-[0.2em] uppercase text-center">[UPLOAD_PAYLOAD_SCREENSHOT]</span>
            </label>
          </div>
        </div>
      </div>

      {/* AI Intel Action Bar */}
      <div className="border-b-2 border-gray-600 bg-industrial-black">
        <button
          suppressHydrationWarning
          onClick={handleGetInsights}
          className="w-full py-3 flex items-center justify-center gap-2 bg-white text-black font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-safety-orange transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <Sparkles size={12} /> [ACTIVATE_AI_MARKET_INTELLIGENCE]
        </button>
      </div>
    </section>
  );
}
