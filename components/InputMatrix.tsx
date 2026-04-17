'use client';

import React, { useState } from 'react';
import { LoadData, VehicleConfig } from '@/lib/types';
import { parseLoadText, parseLoadImage, getMarketInsight } from '@/lib/aiService';
import { Camera, FileText, Keyboard, Loader2, Sparkles, Info, X } from 'lucide-react';

import { motion, Variants } from 'motion/react';

interface InputMatrixProps {
  onDataExtracted: (data: LoadData, aiNote: string) => void;
  manualData: LoadData;
  onManualChange: (data: Partial<LoadData>) => void;
  onAiNoteUpdate: (note: string) => void;
  onReset: () => void;
  vehicle: VehicleConfig;
}

export default function InputMatrix({ onDataExtracted, manualData, onManualChange, onAiNoteUpdate, onReset, vehicle }: InputMatrixProps) {
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIngestInfo, setShowIngestInfo] = useState(false);
  const [showVisionInfo, setShowVisionInfo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Animation variants
  const rowVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: 1.2 + (i * 0.1),
        duration: 0.4,
        ease: "easeOut" as const
      }
    })
  };

  const handleGetInsights = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const insight = await getMarketInsight(manualData, vehicle);
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
      const result = await parseLoadText(pastedText, vehicle);
      onDataExtracted(result.data, result.aiNote);
      setPastedText('');
    } catch (err) {
      console.error('Text parse error:', err);
      setError('FAILED TO PARSE LOAD DATA');
    } finally {
      setIsProcessing(false);
    }
  };

  const processImageFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const result = await parseLoadImage(base64, vehicle);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    } else if (file) {
      setError('INVALID FILE TYPE: VISION REQUIRES IMAGE DATA');
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
      <motion.div
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        custom={0}
        className="grid grid-cols-2 relative"
      >
        <div className="flex flex-col gap-0.5 bg-industrial-black p-2 relative">
          <label className="text-[7px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Keyboard size={7} className="text-safety-orange drop-shadow-[0_0_4px_#ff6600]" /> Origin
          </label>
          <input
            suppressHydrationWarning
            type="text"
            value={manualData.origin || ''}
            onChange={(e) => onManualChange({ origin: e.target.value })}
            className="bg-transparent p-0 text-base font-bold focus:text-safety-orange outline-none transition-colors text-text-main uppercase placeholder:text-text-muted/50"
            placeholder="CITY, ST"
          />
          <div className="absolute inset-y-0 right-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
        </div>
        <div className="flex flex-col gap-0.5 bg-industrial-black p-2 relative">
          <label className="text-[7px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Keyboard size={7} className="text-safety-orange drop-shadow-[0_0_4px_#ff6600]" /> Destination
          </label>
          <input
            suppressHydrationWarning
            type="text"
            value={manualData.destination || ''}
            onChange={(e) => onManualChange({ destination: e.target.value })}
            className="bg-transparent p-0 text-base font-bold focus:text-safety-orange outline-none transition-colors text-text-main uppercase placeholder:text-text-muted/50"
            placeholder="CITY, ST"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
      </motion.div>

      {/* Row 1: Manual Inputs */}
      <motion.div
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        custom={1}
        className="grid grid-cols-3 relative"
      >
        <div className="flex flex-col gap-0.5 bg-industrial-black p-2 relative">
          <label className="text-[7px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Keyboard size={7} className="text-safety-orange drop-shadow-[0_0_4px_#ff6600]" /> Loaded_Miles
          </label>
          <input
            suppressHydrationWarning
            type="number"
            value={manualData.loadedMiles || ''}
            onChange={(e) => onManualChange({ loadedMiles: Number(e.target.value) })}
            className="bg-transparent p-0 text-xl font-bold focus:text-safety-orange outline-none transition-colors text-text-main placeholder:text-text-muted/50"
            placeholder="0"
          />
          <div className="absolute inset-y-0 right-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
        </div>
        <div className="flex flex-col gap-0.5 bg-industrial-black p-2 relative">
          <label className="text-[7px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Keyboard size={7} className="text-safety-orange drop-shadow-[0_0_4px_#ff6600]" /> Dead_Miles
          </label>
          <input
            suppressHydrationWarning
            type="number"
            value={manualData.deadheadMiles || ''}
            onChange={(e) => onManualChange({ deadheadMiles: Number(e.target.value) })}
            className="bg-transparent p-0 text-xl font-bold focus:text-safety-orange outline-none transition-colors text-text-main placeholder:text-text-muted/50"
            placeholder="0"
          />
          <div className="absolute inset-y-0 right-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
        </div>
        <div className="flex flex-col gap-0.5 bg-industrial-black p-2 relative">
          <label className="text-[7px] font-bold uppercase tracking-widest flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-text-muted"><Keyboard size={7} className="text-safety-orange drop-shadow-[0_0_4px_#ff6600]" /> Load_Weight</span>
            {manualData.weight > vehicle.maxWeight && <span className="text-[6px] text-red-500 animate-pulse bg-red-950/40 px-1 py-0.5">OVERWEIGHT</span>}
          </label>
          <div className="flex items-baseline gap-1.5">
            <input
              suppressHydrationWarning
              type="number"
              value={manualData.weight || ''}
              onChange={(e) => onManualChange({ weight: Number(e.target.value) })}
              className={`bg-transparent p-0 text-xl font-bold focus:text-safety-orange outline-none transition-colors w-full placeholder:text-text-muted/50 ${manualData.weight > vehicle.maxWeight ? 'text-red-500' : 'text-text-main'}`}
              placeholder="0"
            />
            <span className="text-[8px] font-bold text-text-muted">LBS</span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
      </motion.div>

      {/* Row 2: AI Ingest & Vision side by side */}
      <motion.div
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        custom={2}
        className="grid grid-cols-1 md:grid-cols-2 relative"
      >
        {isProcessing && (
          <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-safety-orange drop-shadow-[0_0_6px_#ff6600]" size={40} />
            <span className="text-[10px] font-bold text-safety-orange animate-pulse uppercase tracking-[0.3em] [text-shadow:_0_0_8px_currentColor]">ANALYZING_PAYLOAD...</span>
          </div>
        )}

        {/* Text Ingest */}
        <div className="flex flex-col bg-industrial-black relative">
          <div className="px-2 py-2 flex justify-between items-center relative">
            <label className="text-[8px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-2">
              <FileText size={9} className="text-safety-orange drop-shadow-[0_0_4px_#ff6600]" /> Data_Ingest
            </label>
            <button
              suppressHydrationWarning
              onClick={() => setShowIngestInfo(!showIngestInfo)}
              className="text-text-muted hover:text-safety-orange transition-colors"
            >
              <Info size={10} />
            </button>
          </div>

          {showIngestInfo && (
            <div className="absolute top-8 left-2 right-2 z-30 bg-industrial-grey border-2 border-safety-orange p-2 shadow-2xl">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[7px] font-bold text-safety-orange uppercase tracking-widest [text-shadow:_0_0_8px_currentColor]">Module_Info</span>
                <button suppressHydrationWarning onClick={() => setShowIngestInfo(false)}><X size={8} className="text-text-muted" /></button>
              </div>
              <p className="text-[9px] text-text-muted leading-tight uppercase">
                Paste raw text from load boards, emails, or messages. The AI will automatically extract origin, destination, miles, and weight to populate the matrix.
              </p>
            </div>
          )}

          <div className="flex flex-col">
            <textarea
              suppressHydrationWarning
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full h-16 bg-black/10 border-y border-border-main p-2 text-[10px] font-mono uppercase focus:border-safety-orange outline-none resize-none text-text-muted placeholder:text-text-muted/95"
              placeholder="[PASTE_PAYLOAD_DATA...]"
            />
            <div>
              <button
                suppressHydrationWarning
                onClick={handleTextParse}
                disabled={!pastedText.trim()}
                className="w-full py-2 bg-industrial-grey border border-border-main text-text-main font-bold text-[9px] tracking-[0.2em] uppercase hover:bg-industrial-black disabled:opacity-30 transition-all"
              >
                [EXTRACT]
              </button>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 w-[2px] bg-border-main rugged-line pointer-events-none hidden md:block" />
        </div>

        {/* Vision Uplink */}
        <div className="flex flex-col bg-industrial-black relative">
          <div className="px-2 py-2 flex justify-between items-center relative">
            <label className="text-[8px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-2">
              <Camera size={9} className="text-safety-orange drop-shadow-[0_0_4px_#ff6600]" /> Vision_Uplink
            </label>
            <button
              suppressHydrationWarning
              onClick={() => setShowVisionInfo(!showVisionInfo)}
              className="text-text-muted hover:text-safety-orange transition-colors"
            >
              <Info size={10} />
            </button>
          </div>

          {showVisionInfo && (
            <div className="absolute top-8 left-2 right-2 z-30 bg-industrial-grey border-2 border-safety-orange p-2 shadow-2xl">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[7px] font-bold text-safety-orange uppercase tracking-widest [text-shadow:_0_0_8px_currentColor]">Module_Info</span>
                <button suppressHydrationWarning onClick={() => setShowVisionInfo(false)}><X size={8} className="text-text-muted" /></button>
              </div>
              <p className="text-[9px] text-text-muted leading-tight uppercase">
                Upload a screenshot of a load board or rate confirmation. The AI vision system will scan the image and extract all relevant payload parameters automatically.
              </p>
            </div>
          )}

          <div
            className="h-full relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className={`flex flex-col items-center justify-center cursor-pointer group w-full h-full border-y border-dashed transition-all p-4 ${isDragging ? 'bg-safety-orange/10 border-safety-orange' : 'bg-black/20 border-border-main hover:border-safety-orange'}`}>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              <Camera size={24} className={`mb-1 transition-transform ${isDragging ? 'text-safety-orange scale-110 animate-pulse' : 'text-safety-orange group-hover:scale-110'}`} />
              <div className="text-text-main font-bold text-[8px] tracking-[0.2em] uppercase text-center leading-tight mt-1">
                {isDragging ? '>> DROP_PAYLOAD_DATA <<' : '[UPLOAD_OR_DROP_SCREENSHOT]'}
              </div>
            </label>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
      </motion.div>

      {/* AI Intel Action Bar */}
      <motion.div
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        custom={3}
        className="bg-industrial-black relative"
      >
        <button
          suppressHydrationWarning
          onClick={handleGetInsights}
          className="w-full py-3 flex items-center justify-center gap-2 bg-industrial-grey text-text-main font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-safety-orange hover:text-white transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <Sparkles size={12} /> [AI_MARKET_INTEL]
        </button>
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
      </motion.div>
    </section>
  );
}
