'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BOOT_LOGS = [
  "SCANNING_PE...",
  "AUTH_SIG_OK",
  "GRID_SYNC...",
  "HUD_INIT",
  "SYS_READY"
];

export default function BootScreen() {
  const [logs, setLogs] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if session has already booted
    const hasBooted = sessionStorage.getItem('payload_booted');
    if (hasBooted) return;

    setShow(true);
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShow(false);
          sessionStorage.setItem('payload_booted', 'true');
        }, 600);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center font-mono overflow-hidden"
      >
        {/* The Scanning Beam */}
        <motion.div
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 1.2, ease: "linear", repeat: 0 }}
          className="absolute left-0 right-0 h-[20vh] bg-gradient-to-b from-transparent via-safety-orange/20 to-transparent border-y border-safety-orange/30 z-20"
        >
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-safety-orange shadow-[0_0_15px_#ff6600]" />
        </motion.div>

        {/* Backdrop Tint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-industrial-black/40 backdrop-blur-[1px]"
        />

        {/* Floating Terminal Data */}
        <div className="z-30 w-full max-w-xs px-4">
          <div className="flex flex-col gap-1">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 bg-safety-orange" />
                <span className="text-[10px] font-black text-safety-orange uppercase tracking-[0.2em] [text-shadow:_0_0_8px_currentColor]">
                  {log}
                </span>
                <span className="text-[8px] text-white/40 ml-auto">DONE</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Corner Decals */}
        <div className="absolute top-12 left-12 border-l border-t border-safety-orange w-8 h-8 opacity-50" />
        <div className="absolute bottom-12 right-12 border-r border-b border-safety-orange w-8 h-8 opacity-50" />

        <div className="absolute top-12 right-12 text-[8px] text-safety-orange/60 font-black uppercase text-right leading-none">
          SECURE_BOOT<br />ACTIVE
        </div>

        <div className="absolute bottom-12 left-12 text-[8px] text-safety-orange/60 font-black uppercase leading-none">
          PRTCL_ID<br />894-ALPHA
        </div>

        {/* Randomized "Data Grain" noise overlay specifically for the scan */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </motion.div>
    </AnimatePresence>
  );
}
