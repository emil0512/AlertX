import React from 'react';
import { ShieldAlert, Radio, UserCheck, LogIn, Sparkles, Siren, User } from 'lucide-react';
import SOSButton from './SOSButton';

export default function Navbar({ activeRole, onToggleRole, onOpenSOS, user, onOpenAuth }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-900/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-heading text-white tracking-tight">Alert<span className="text-red-500">X</span></span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold font-mono bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-widest hidden sm:inline-block">
                v2.6 Hackathon Edition
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">Smart Emergency & Crime Reporting System</p>
          </div>
        </div>

        {/* SOS Emergency Trigger Button */}
        <div className="hidden sm:block">
          <SOSButton onClick={onOpenSOS} />
        </div>

        {/* Right Nav: Role Switcher & User Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Hackathon Mode Switcher */}
          <div className="bg-slate-900/90 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => onToggleRole('citizen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeRole === 'citizen'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Citizen</span>
            </button>

            <button
              onClick={() => onToggleRole('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeRole === 'admin'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-300" />
              <span>Admin</span>
            </button>
          </div>

          {/* User Auth Profile Button */}
          {user ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px]">
                {user.name.charAt(0)}
              </div>
              <span className="hidden md:inline">{user.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
            >
              <LogIn className="w-3.5 h-3.5 text-red-400" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile SOS Bar */}
      <div className="sm:hidden px-4 pb-3">
        <button
          onClick={onOpenSOS}
          className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/50"
        >
          <Siren className="w-4 h-4 animate-spin" /> TRIGGER 1-TAP EMERGENCY SOS
        </button>
      </div>
    </header>
  );
}
