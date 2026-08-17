import React from 'react';
import { Siren } from 'lucide-react';

export default function SOSButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative group flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(239,68,68,0.6)] hover:shadow-[0_0_40px_rgba(239,68,68,0.9)] hover:scale-105 active:scale-95 transition-all duration-200 border border-red-400/40 animate-sos-pulse"
      title="Tap for Emergency SOS Signal"
    >
      <div className="w-8 h-8 rounded-full bg-red-950/60 border border-red-400/50 flex items-center justify-center group-hover:bg-red-900/80 transition">
        <Siren className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '4s' }} />
      </div>
      <div className="text-left">
        <div className="text-[10px] uppercase font-mono tracking-widest text-red-200">1-TAP DISTRESS</div>
        <div className="text-sm font-heading font-black leading-none">TRIGGER SOS</div>
      </div>
    </button>
  );
}
