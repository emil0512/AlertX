import React, { useState } from 'react';
import { UserCheck, Shield, KeyRound, Mail, Phone, Lock, X, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, currentUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Citizen');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const userObj = {
      name: name || (isRegister ? 'Registered User' : email.split('@')[0] || 'User'),
      email: email || 'user@alertx.org',
      phone: phone || '+1 555-0199',
      role: role
    };
    onLogin(userObj);
    onClose();
  };

  const handleQuickDemo = (demoRole) => {
    if (demoRole === 'Citizen') {
      onLogin({
        name: 'Elena Rostova',
        email: 'elena.rostova@campus.edu',
        phone: '+1 555-0192',
        role: 'Citizen'
      });
    } else {
      onLogin({
        name: 'Captain Vance (Dispatch 05)',
        email: 'vance@police.alertx.org',
        phone: '+1 555-911-00',
        role: 'Admin Dispatcher'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-900/80 border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3 border border-red-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">
            {currentUser ? 'User Account Details' : isRegister ? 'Register AlertX Account' : 'Sign In to AlertX'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access citizen emergency distress reports or dispatcher controls.
          </p>
        </div>

        {/* Quick Demo Shortcuts */}
        {!currentUser && (
          <div className="mb-6 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-amber-400 font-mono uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Hackathon 1-Click Demo Logins
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('Citizen')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                Log as Citizen
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Admin')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-red-600/30 hover:bg-red-600/40 text-red-300 border border-red-500/40 transition"
              >
                Log as Admin
              </button>
            </div>
          </div>
        )}

        {currentUser ? (
          <div className="space-y-4 text-left">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div><span className="text-slate-400">Name:</span> <strong className="text-white">{currentUser.name}</strong></div>
              <div><span className="text-slate-400">Email:</span> <strong className="text-white">{currentUser.email}</strong></div>
              <div><span className="text-slate-400">Role:</span> <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">{currentUser.role}</span></div>
            </div>

            <button
              onClick={() => onLogin(null)}
              className="w-full py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@alertx.org"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 transition"
            >
              {isRegister ? 'Create AlertX Account' : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                {isRegister ? 'Already have an account? Sign In' : 'Need an account? Register'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
