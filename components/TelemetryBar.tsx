'use client';

import React, { useState, useEffect } from 'react';
import { VehicleConfig } from '@/lib/types';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Settings } from 'lucide-react';

import { motion } from 'motion/react';

interface TelemetryBarProps {
  vehicle: VehicleConfig;
  onConfigClick: () => void;
}

export default function TelemetryBar({ vehicle, onConfigClick }: TelemetryBarProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [location, setLocation] = useState('DETECTING...');
  const [dateStr, setDateStr] = useState('');
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setDateStr(new Date().toISOString().split('T')[0]);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/', {
          signal: AbortSignal.timeout(3000) // 3s timeout
        });
        if (!response.ok) throw new Error('Response not OK');
        const data = await response.json();
        if (data.city && data.region_code) {
          setLocation(`${data.city.toUpperCase()}, ${data.region_code}`);
        } else {
          setLocation('UNKNOWN');
        }
      } catch (err) {
        // Silent fail to avoid dev error portal
        setLocation('OFFLINE');
      }
    };

    fetchLocation();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      className="w-full border-border-main flex items-stretch bg-industrial-black h-12 overflow-hidden relative"
    >
      {/* Left: Net Status Bar */}
      <div className={`w-6 shrink-0 flex items-center justify-center overflow-hidden transition-colors duration-300 relative ${isOffline ? 'bg-red-600' : 'bg-safety-orange'}`}>
        <span className="text-[7px] font-black text-black tracking-widest uppercase [writing-mode:vertical-rl] rotate-180">
          {isOffline ? 'OFFLINE' : 'ONLINE'}
        </span>
        <div className="absolute inset-y-0 right-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
      </div>

      {/* Middle: Main Text */}
      <div className="flex flex-col justify-center px-3 shrink-0 bg-black/20 relative">
        <h2 className="text-sm font-black tracking-tighter text-text-main leading-[0.8]">PAYLOAD</h2>
        <h2 className="text-sm font-black tracking-tighter text-text-main leading-[0.8] mt-0.5">ENGINE</h2>
        <div className="absolute inset-y-0 right-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
      </div>

      {/* Status Section */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Row: System Info */}
        <div className="h-[30%] flex items-center px-3 justify-between overflow-hidden bg-black/10">
          <div className="flex gap-3 items-center">
            <span className="text-[7px] font-mono text-gray-500 whitespace-nowrap">
              DATE: {mounted ? dateStr : '----/--/--'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[7px] font-mono text-safety-orange whitespace-nowrap">
              [LOC: {mounted ? location : 'DETECTING...'}]
            </span>
            <button
              suppressHydrationWarning
              onClick={toggleTheme}
              className="text-gray-500 hover:text-safety-orange transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={10} /> : <Moon size={10} />}
            </button>
          </div>
        </div>

        {/* Bottom Row: Main Telemetry */}
        <div className="flex-grow flex items-center px-3 bg-industrial-grey justify-between group cursor-pointer hover:bg-industrial-black transition-colors" onClick={onConfigClick}>
          <span className="text-[9px] font-mono text-text-main tracking-[0.05em] uppercase font-black truncate group-hover:text-safety-orange transition-colors">
            {`[${vehicle.name} // ${vehicle.maxWeight}LB // ${vehicle.maxLength}"L x ${vehicle.maxWidth}"W x ${vehicle.maxHeight}"H]`}
          </span>
          <Settings size={10} className="text-text-muted group-hover:text-safety-orange transition-colors" />
        </div>
      </div>

      {/* Right: Logo */}
      <div className="w-12 flex items-center justify-center p-1.5 shrink-0 relative">
        <div className="relative w-7 h-7">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className={`object-contain ${theme === 'dark' ? 'brightness-125 contrast-125' : 'brightness-75 contrast-125'}`}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-y-0 left-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-border-main rugged-line pointer-events-none" />
    </motion.header>
  );
}
