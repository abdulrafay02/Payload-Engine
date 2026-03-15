'use client';

import React, { useState, useEffect } from 'react';
import { VEHICLE_LIMITS } from '@/lib/types';
import Image from 'next/image';

export default function TelemetryBar() {
  const [isOffline, setIsOffline] = useState(false);
  const [location, setLocation] = useState('DETECTING...');
  const [dateStr] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.city && data.region_code) {
          setLocation(`${data.city.toUpperCase()}, ${data.region_code}`);
        } else {
          setLocation('UNKNOWN');
        }
      } catch (error) {
        console.error('Failed to fetch location', error);
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
    <header className="w-full border-b-2 border-[#888] flex items-stretch bg-industrial-black h-12 overflow-hidden">
      {/* Left: Net Status Bar */}
      <div className={`w-6 border-r-2 border-[#888] shrink-0 flex items-center justify-center overflow-hidden transition-colors duration-300 ${isOffline ? 'bg-red-600' : 'bg-safety-orange'}`}>
        <span className="text-[7px] font-black text-black tracking-widest uppercase [writing-mode:vertical-rl] rotate-180">
          {isOffline ? 'OFFLINE' : 'ONLINE'}
        </span>
      </div>

      {/* Middle: Main Text */}
      <div className="flex flex-col justify-center px-3 border-r-2 border-[#888] shrink-0 bg-black/20">
        <h2 className="text-sm font-black tracking-tighter text-white leading-[0.8]">PAYLOAD</h2>
        <h2 className="text-sm font-black tracking-tighter text-white leading-[0.8] mt-0.5">ENGINE</h2>
      </div>

      {/* Status Section */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Row: System Info */}
        <div className="h-[30%] flex items-center px-3 justify-between overflow-hidden bg-black/10">
          <div className="flex gap-3 items-center">
            <span className="text-[7px] font-mono text-gray-500 whitespace-nowrap">
              DATE: {dateStr}
            </span>
          </div>
          <span className="text-[7px] font-mono text-safety-orange whitespace-nowrap">
            [LOC: {location}]
          </span>
        </div>

        {/* Middle Row: Grey Dithered Bar */}
        <div className="h-1 border-y border-[#888] bg-[#444] relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ 
            backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', 
            backgroundSize: '2px 2px' 
          }} />
        </div>

        {/* Bottom Row: Main Telemetry */}
        <div className="flex-grow flex items-center px-3 bg-black/30">
          <span className="text-[9px] font-mono text-safety-orange tracking-[0.05em] uppercase font-black truncate">
            [VAN: T-250 // {VEHICLE_LIMITS.MAX_WEIGHT}LB // 132&quot;L x 72&quot;W x 53&quot;H]
          </span>
        </div>
      </div>

      {/* Right: Logo */}
      <div className="w-12 border-l-2 border-[#888] flex items-center justify-center p-1.5 shrink-0 bg-black/40">
        <div className="relative w-7 h-7">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            fill 
            className="object-contain brightness-125 contrast-125"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
