import React from 'react';

export default function GeometricBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 text-text-muted opacity-[0.25]">
      {/* Top Left Corner */}
      <svg className="absolute top-6 left-6 w-32 h-32" xmlns="http://www.w3.org/2000/svg">
        {/* Crop mark */}
        <path d="M 0,20 L 0,0 L 20,0" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="40" cy="40" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 30,40 h 20 M 40,30 v 20" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 0,50 h 5 m 5,0 h 10 m 5,0 h 5" stroke="currentColor" strokeWidth="1" fill="none" />
        {/* Small scattered crosses */}
        <path d="M 80,10 h 8 m -4,-4 v 8 M 10,80 h 8 m -4,-4 v 8 M 110,30 h 8 m -4,-4 v 8" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      {/* Top Right Corner */}
      <svg className="absolute top-6 right-6 w-32 h-32" xmlns="http://www.w3.org/2000/svg">
        {/* Crop mark */}
        <path d="M 128,20 L 128,0 L 108,0" stroke="currentColor" strokeWidth="1.5" fill="none" />
        {/* Barcode-like stripes */}
        <rect x="70" y="20" width="2" height="30" fill="currentColor" />
        <rect x="76" y="20" width="4" height="30" fill="currentColor" />
        <rect x="84" y="20" width="1" height="30" fill="currentColor" />
        <rect x="89" y="20" width="3" height="30" fill="currentColor" />
        <rect x="96" y="20" width="2" height="30" fill="currentColor" />
        <rect x="102" y="20" width="5" height="30" fill="currentColor" />
        {/* Diagonal slash grid fragment */}
        <path d="M 30,100 l 10,-10 M 50,100 l 10,-10 M 70,100 l 10,-10" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 30,120 l 10,-10 M 50,120 l 10,-10 M 70,120 l 10,-10" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      {/* Bottom Left Corner */}
      <svg className="absolute bottom-6 left-6 w-32 h-32" xmlns="http://www.w3.org/2000/svg">
        {/* Crop mark */}
        <path d="M 0,108 L 0,128 L 20,128" stroke="currentColor" strokeWidth="1.5" fill="none" />
        {/* Measurement Ticks */}
        <path d="M 30,128 v -5 m 5,5 v -10 m 5,10 v -5 m 5,5 v -10 m 5,10 v -8 m 5,8 v -5" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="80" cy="100" r="15" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" />
        <path d="M 70,100 h 20 M 80,90 v 20" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      {/* Bottom Right Corner */}
      <svg className="absolute bottom-6 right-6 w-32 h-32" xmlns="http://www.w3.org/2000/svg">
        {/* Crop mark */}
        <path d="M 128,108 L 128,128 L 108,128" stroke="currentColor" strokeWidth="1.5" fill="none" />
        {/* Grid misaligned */}
        <path d="M 80,80 h 8 m -4,-4 v 8" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 100,79 h 8 m -4,-4 v 8" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 81,100 h 8 m -4,-4 v 8" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 100,100 h 8 m -4,-4 v 8" stroke="currentColor" strokeWidth="1" fill="none" />
        {/* Irregular lines */}
        <path d="M 30,110 h 20 m 5,0 h 10" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>

      {/* Full screen diffuse grids and large elements */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dashed-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="60" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" opacity="0.3" />
            <line x1="0" y1="0" x2="0" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" opacity="0.3" />
            <path d="M 28,30 h 4 m -2,-2 v 4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
          </pattern>
          <pattern id="diag-lines" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M -5,5 L 5,-5 M 0,20 L 20,0 M 15,25 L 25,15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
          </pattern>
          <pattern id="plus-scatter" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 20,20 h 6 m -3,-3 v 6 M 90,100 h 6 m -3,-3 v 6 M 100,40 h 4 m -2,-2 v 4 M 40,80 h 4 m -2,-2 v 4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
          </pattern>
        </defs>

        {/* Base scatter across whole screen */}
        <rect x="0" y="0" width="100%" height="100%" fill="url(#plus-scatter)" />

        {/* Scattered Patchy Grids */}
        <rect x="10%" y="20%" width="300" height="300" fill="url(#dashed-grid)" />
        <rect x="70%" y="65%" width="240" height="180" fill="url(#dashed-grid)" />

        {/* Diagonal Blocks */}
        <rect x="65%" y="15%" width="120" height="200" fill="url(#diag-lines)" />
        <rect x="15%" y="70%" width="180" height="200" fill="url(#diag-lines)" />

        {/* Long Measurement Lines extending randomly */}
        <line x1="0" y1="35%" x2="18%" y2="35%" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4 2 4" />
        <line x1="82%" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="1" strokeDasharray="16 4 4 4 2 4" />
        <line x1="25%" y1="0" x2="25%" y2="12%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="75%" y1="100%" x2="75%" y2="88%" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      </svg>

      {/* Some specific scattered absolute textual/SVG mix items */}
      <div className="absolute top-[45%] left-[8%] text-[10px] font-mono tracking-widest opacity-40 -rotate-90 origin-left">
        FRT_OPT // 894-A
      </div>
      <div className="absolute top-[55%] right-[8%] text-[10px] font-mono tracking-[0.2em] opacity-40 rotate-[90deg] origin-right">
        [SYS_ALIGN: NOMINAL]
      </div>
      <div className="absolute bottom-[25%] left-[28%] opacity-30">
        <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1" /></svg>
      </div>

      {/* Faded Watermark Logo Stamp */}
      <div className="absolute top-[15%] right-[30%] w-40 h-40 opacity-60 grayscale brightness-125 dark:brightness-100 mix-blend-overlay pointer-events-none select-none">
        <img src="/logo.png" alt="" className="w-full h-full object-contain opacity-50" />
      </div>
    </div>
  );
}
