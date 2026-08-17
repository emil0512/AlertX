import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import SOSModal from './components/SOSModal';
import ReportIncident from './components/ReportIncident';
import SuspectSketchBuilder from './components/SuspectSketchBuilder';
import AuthModal from './components/AuthModal';
import { INITIAL_REPORTS } from './data/mockData';
import { Shield, ShieldAlert, LogIn, X, Siren, Lock } from 'lucide-react';

export default function App() {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('alertx_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [activeRole, setActiveRole] = useState('citizen');
  const [currentUser, setCurrentUser] = useState(null);

  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSketchModalOpen, setIsSketchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [adminAccessDenied, setAdminAccessDenied] = useState(false);

  // Always start logged out
  useEffect(() => {
    localStorage.removeItem('alertx_user');
  }, []);

  useEffect(() => {
    localStorage.setItem('alertx_reports', JSON.stringify(reports));
  }, [reports]);

  // ── Auth handler ─────────────────────────────────────────────────────────
  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user?.role === 'Admin Dispatcher') {
      setActiveRole('admin');
    } else {
      setActiveRole('citizen');
    }
    setAdminAccessDenied(false);
  };

  // ── Role switcher (admin gated) ───────────────────────────────────────────
  const handleToggleRole = (role) => {
    if (role === 'admin') {
      if (currentUser?.role === 'Admin Dispatcher') {
        setActiveRole('admin');
      } else {
        setAdminAccessDenied(true);
        setIsAuthModalOpen(true);
      }
    } else {
      setActiveRole('citizen');
    }
  };

  // ── Feature guards — open auth if not logged in ──────────────────────────
  const requireAuth = (action) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      action();
    }
  };

  // ── Report handlers ───────────────────────────────────────────────────────
  const handleAddReport = (newReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  const handleUpdateReportStatus = (id, newStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleAssignUnit = (id, unitName) => {
    setReports(prev => prev.map(r =>
      r.id === id ? { ...r, assignedUnit: unitName, status: r.status === 'Pending' ? 'Dispatched' : r.status } : r
    ));
  };

  // ══════════════════════════════════════════════════════════════════════════
  // NOT LOGGED IN — show login gate
  // ══════════════════════════════════════════════════════════════════════════
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
        {/* Minimal header with SOS always accessible */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-900/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black font-heading text-white tracking-tight">
                  Alert<span className="text-red-500">X</span>
                </span>
                <p className="text-[10px] text-slate-400 font-mono hidden md:block">Smart Emergency &amp; Crime Reporting System</p>
              </div>
            </div>

            {/* SOS — always accessible, no login needed */}
            <button
              onClick={() => setIsSOSOpen(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/50 transition animate-pulse"
            >
              <Siren className="w-4 h-4" /> EMERGENCY SOS
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
            >
              <LogIn className="w-3.5 h-3.5 text-red-400" />
              Sign In / Register
            </button>
          </div>

          {/* Mobile SOS bar */}
          <div className="sm:hidden px-4 pb-3">
            <button
              onClick={() => setIsSOSOpen(true)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/50"
            >
              <Siren className="w-4 h-4" /> TRIGGER 1-TAP EMERGENCY SOS
            </button>
          </div>
        </header>

        {/* Ticker */}
        <div className="bg-red-950/60 border-b border-red-500/20 px-4 py-1.5 text-[11px] font-mono text-red-300 flex items-center justify-between overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>ALERTX EMERGENCY GRID ONLINE • AI THREAT SEVERITY MATRIX ACTIVE • SYSTEM MONITORING</span>
          </div>
          <span className="hidden md:inline text-slate-400">STATUS: ALL RESPONSE UNITS SYNCED</span>
        </div>

        {/* Login gate content */}
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-lg">
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-red-600/20 to-amber-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(239,68,68,0.2)]">
              <Lock className="w-12 h-12 text-red-400" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-black font-heading text-white mb-3 tracking-tight">
              Sign in to <span className="text-red-500">AlertX</span>
            </h1>
            <p className="text-slate-400 text-sm mb-2">
              You must have a valid account to access the emergency reporting system.
            </p>
            <p className="text-slate-500 text-xs mb-10">
              Don't have an account? Register in seconds — it's free.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-900/40 transition"
              >
                Sign In / Create Account
              </button>
              <button
                onClick={() => setIsSOSOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <Siren className="w-4 h-4 text-red-400" />
                Emergency SOS (No login needed)
              </button>
            </div>

            {/* Feature hints */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {[
                { icon: '🚨', title: 'Report Incidents', desc: 'File crime & emergency reports with AI priority scoring' },
                { icon: '🗺️', title: 'Live Map Tracking', desc: 'View real-time incident locations across the city' },
                { icon: '🖊️', title: 'Suspect Sketch', desc: 'Build composite sketches of suspects with the visual editor' },
              ].map((f) => (
                <div key={f.title} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-xs font-bold text-white mb-1">{f.title}</div>
                  <div className="text-[11px] text-slate-500">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* SOS Modal — always accessible */}
        <SOSModal
          isOpen={isSOSOpen}
          onClose={() => setIsSOSOpen(false)}
          onTriggerSOS={handleAddReport}
          userLocation={{ address: 'Downtown Campus Quad, 4th Ave', coords: { lat: 37.7749, lng: -122.4194 } }}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => { setIsAuthModalOpen(false); setAdminAccessDenied(false); }}
          onLogin={handleLogin}
          currentUser={null}
          adminAccessDenied={adminAccessDenied}
        />

        <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              <span className="font-heading font-bold text-slate-300">AlertX Emergency Response System</span>
            </div>
            <p>© 2026 AlertX Hackathon Demo Project. Built for rapid emergency reporting &amp; dispatch.</p>
          </div>
        </footer>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // LOGGED IN — full dashboard
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      <Navbar
        activeRole={activeRole}
        onToggleRole={handleToggleRole}
        onOpenSOS={() => setIsSOSOpen(true)}
        user={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Ticker Bar */}
      <div className="bg-red-950/60 border-b border-red-500/20 px-4 py-1.5 text-[11px] font-mono text-red-300 flex items-center justify-between overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>ALERTX EMERGENCY GRID ONLINE • AI THREAT SEVERITY MATRIX ACTIVE • SYSTEM MONITORING</span>
        </div>
        <span className="hidden md:inline text-slate-400">STATUS: ALL RESPONSE UNITS SYNCED</span>
      </div>

      {/* Main Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeRole === 'citizen' ? (
          <CitizenDashboard
            reports={reports}
            onOpenReportModal={() => requireAuth(() => setIsReportModalOpen(true))}
            onOpenSketchModal={() => requireAuth(() => setIsSketchModalOpen(true))}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        ) : (
          <AdminDashboard
            reports={reports}
            onUpdateReportStatus={handleUpdateReportStatus}
            onAssignUnit={handleAssignUnit}
          />
        )}
      </main>

      {/* SOS Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onTriggerSOS={handleAddReport}
        userLocation={{ address: 'Downtown Campus Quad, 4th Ave', coords: { lat: 37.7749, lng: -122.4194 } }}
      />

      {/* File Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-4xl relative">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white p-2 rounded-full bg-slate-900/80 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <ReportIncident
              currentUser={currentUser}
              onSubmitReport={(report) => {
                handleAddReport(report);
                setIsReportModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Suspect Sketch Builder Modal */}
      {isSketchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-5xl relative">
            <button
              onClick={() => setIsSketchModalOpen(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white p-2 rounded-full bg-slate-900/80 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <SuspectSketchBuilder
              onSaveSketch={() => {
                alert('Suspect composite sketch saved! Attach it when submitting an Incident Report.');
                setIsSketchModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => { setIsAuthModalOpen(false); setAdminAccessDenied(false); }}
        onLogin={handleLogin}
        currentUser={currentUser}
        adminAccessDenied={adminAccessDenied}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="font-heading font-bold text-slate-300">AlertX Emergency Response System</span>
          </div>
          <p>© 2026 AlertX Hackathon Demo Project. Built for rapid emergency reporting &amp; dispatch.</p>
        </div>
      </footer>
    </div>
  );
}
