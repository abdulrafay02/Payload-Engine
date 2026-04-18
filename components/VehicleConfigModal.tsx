'use client';

import React from 'react';
import { VehicleConfig } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface VehicleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleConfig;
  onVehicleChange: (vehicle: VehicleConfig) => void;
}

export default function VehicleConfigModal({ isOpen, onClose, vehicle, onVehicleChange }: VehicleConfigModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-industrial-black/80 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-industrial-black border-2 border-safety-orange w-full max-w-sm flex flex-col p-4 relative shadow-2xl"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-safety-orange font-black text-lg tracking-widest uppercase">[VEHICLE_CONFIGURATION]</h2>
          <button suppressHydrationWarning onClick={onClose} className="text-text-muted hover:text-safety-orange transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col gap-3">
          <label className="text-xs text-text-muted font-bold uppercase tracking-widest flex flex-col">
            <span>Loadout Name</span>
            <input 
              type="text" 
              value={vehicle.name} 
              onChange={e => onVehicleChange({ ...vehicle, name: e.target.value })} 
              className="w-full mt-1 bg-industrial-grey/30 border-b border-safety-orange p-2 text-text-main outline-none focus:bg-industrial-grey/50 transition-colors" 
            />
          </label>
          <label className="text-xs text-text-muted font-bold uppercase tracking-widest flex flex-col">
            <span>Max Weight (LBs)</span>
            <input 
              type="number" 
              value={vehicle.maxWeight} 
              onChange={e => onVehicleChange({ ...vehicle, maxWeight: Number(e.target.value) })} 
              className="w-full mt-1 bg-industrial-grey/30 border-b border-safety-orange p-2 text-text-main outline-none focus:bg-industrial-grey/50 transition-colors" 
            />
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs text-text-muted font-bold uppercase tracking-widest flex flex-col">
              <span>Length&quot;</span>
              <input 
                type="number" 
                value={vehicle.maxLength} 
                onChange={e => onVehicleChange({ ...vehicle, maxLength: Number(e.target.value) })} 
                className="w-full mt-1 bg-industrial-grey/30 border-b border-safety-orange p-2 text-text-main outline-none focus:bg-industrial-grey/50 transition-colors" 
              />
            </label>
            <label className="text-xs text-text-muted font-bold uppercase tracking-widest flex flex-col">
              <span>Width&quot;</span>
              <input 
                type="number" 
                value={vehicle.maxWidth} 
                onChange={e => onVehicleChange({ ...vehicle, maxWidth: Number(e.target.value) })} 
                className="w-full mt-1 bg-industrial-grey/30 border-b border-safety-orange p-2 text-text-main outline-none focus:bg-industrial-grey/50 transition-colors" 
              />
            </label>
            <label className="text-xs text-text-muted font-bold uppercase tracking-widest flex flex-col">
              <span>Height&quot;</span>
              <input 
                type="number" 
                value={vehicle.maxHeight} 
                onChange={e => onVehicleChange({ ...vehicle, maxHeight: Number(e.target.value) })} 
                className="w-full mt-1 bg-industrial-grey/30 border-b border-safety-orange p-2 text-text-main outline-none focus:bg-industrial-grey/50 transition-colors" 
              />
            </label>
          </div>
        </div>
        
        <button 
          onClick={onClose} 
          className="mt-6 w-full py-2 bg-safety-orange text-black font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
        >
          [CONFIRM_SPECS]
        </button>
        
        <div className="absolute inset-y-0 left-0 w-[2px] bg-border-main rugged-line pointer-events-none" />
      </motion.div>
    </div>
  );
}
