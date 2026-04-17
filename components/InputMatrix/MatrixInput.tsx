'use client';

import React from 'react';
import { Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatrixInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  unit?: string;
  error?: boolean;
  errorLabel?: string;
  className?: string;
  showDivider?: boolean;
}

export default function MatrixInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  unit,
  error,
  errorLabel,
  className,
  showDivider = true
}: MatrixInputProps) {
  return (
    <div className={cn("flex flex-col gap-0.5 bg-industrial-black p-2 relative", className)}>
      <label className="text-[7px] text-text-muted font-bold uppercase tracking-widest flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Keyboard size={7} className="text-safety-orange drop-shadow-[0_0_4px_#ff6600]" /> {label}
        </span>
        {error && errorLabel && (
          <span className="text-[6px] text-red-500 animate-pulse bg-red-950/40 px-1 py-0.5">{errorLabel}</span>
        )}
      </label>
      <div className="flex items-baseline gap-1.5">
        <input
          suppressHydrationWarning
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "bg-transparent p-0 font-bold focus:text-safety-orange outline-none transition-colors w-full placeholder:text-text-muted/50",
            type === "text" ? "text-base uppercase" : "text-xl",
            error ? "text-red-500" : "text-text-main"
          )}
          placeholder={placeholder}
        />
        {unit && <span className="text-[8px] font-bold text-text-muted">{unit}</span>}
      </div>
      {showDivider && (
        <div className="absolute inset-y-0 right-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
      )}
    </div>
  );
}
