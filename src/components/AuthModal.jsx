import React, { useState } from 'react';
import { Shield, Mail, Lock, User, Phone, X, ShieldCheck, AlertTriangle } from 'lucide-react';

// Hardcoded admin credentials (for demo — in production use a real backend)
const ADMIN_EMAIL = 'admin@alertx.org';
const ADMIN_PASSWORD = 'admin123';

// Simple in-memory user store (persisted to localStorage)
function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem('alertx_registered_users') || '[]');
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem('alertx_registered_users', JSON.stringify(users));
}

export default function AuthModal({ isOpen, onClose, onLogin, currentUser, adminAccessDenied }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setError('');
    setSuccess('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Admin check
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLogin({
        name: 'Admin Dispatcher',
        email: ADMIN_EMAIL,
        phone: '+1 555-911-00',
        role: 'Admin Dispatcher'
      });
      resetForm();
      onClose();
      return;
    }

    // Citizen login
    const users = getRegisteredUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (match) {
      onLogin({ name: match.name, email: match.email, phone: match.phone, role: 'Citizen' });
      resetForm();
      onClose();
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Full name is required.'); return; }
    if (!email.trim()) { setError('Email is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    // Block admin email from being registered
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      setError('This email address is reserved.');
      return;
    }

    const users = getRegisteredUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      setError('An account with this email already exists. Please sign in.');
      return;
    }

    const newUser = { name: name.trim(), email: email.trim().toLowerCase(), password, phone: phone.trim() || '' };
    saveRegisteredUsers([...users, newUser]);

    setSuccess('Account created! Signing you in...');
    setTimeout(() => {
      onLogin({ name: newUser.name, email: newUser.email, phone: newUser.phone, role: 'Citizen' });
      resetForm();
      onClose();
    }, 900);
  };

  const handleSignOut = () => {
    onLogin(null);
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

        {/* Admin access denied banner */}
        {adminAccessDenied && !currentUser && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Admin access only. Sign in with admin credentials to continue.
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3 border border-red-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">
            {currentUser ? 'Your Account' : isRegister ? 'Create AlertX Account' : 'Sign In to AlertX'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser ? `Logged in as ${currentUser.role}` : 'Emergency reporting & dispatch access'}
          </p>
        </div>

        {/* Logged-in view */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-white">{currentUser.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-slate-600" />
                <span>{currentUser.email}</span>
              </div>
              <div className="mt-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  currentUser.role === 'Admin Dispatcher'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {currentUser.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">

            {/* Error / Success banners */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-xs text-green-300">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            {/* Register-only fields */}
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone (optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555-0000"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
              {isRegister && (
                <p className="text-[10px] text-slate-500 mt-1">Minimum 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 transition"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
