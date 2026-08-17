import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import SOSModal from './components/SOSModal';
import ReportIncident from './components/ReportIncident';
import SuspectSketchBuilder from './components/SuspectSketchBuilder';
import AuthModal from './components/AuthModal';
import { INITIAL_REPORTS } from './data/mockData';
import { Shield, Radio, Siren, X, AlertTriangle } from 'lucide-react';

export default function App() {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('alertx_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [activeRole, setActiveRole] = useState('citizen'); // 'citizen' | 'admin'
  const [currentUser, setCurrentUser] = useState({
    name: 'Elena Rostova',
    email: 'elena@campus.edu',
    phone: '+1 555-0192',
    role: 'Citizen'
  });

  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSketchModalOpen, setIsSketchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('alertx_reports', JSON.stringify(reports));
  }, [reports]);

  const handleAddReport = (newReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  const handleUpdateReportStatus = (id, newStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleAssignUnit = (id, unitName) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, assignedUnit: unitName, status: r.status === 'Pending' ? 'Dispatched' : r.status } : r));
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      {/* Navbar Header */}
      <Navbar
        activeRole={activeRole}
        onToggleRole={setActiveRole}
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
        <span className="hidden md:inline text-slate-400">STATUS: ALL RESPO UNITS SYNCED</span>
      </div>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeRole === 'citizen' ? (
          <CitizenDashboard
            reports={reports}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenSketchModal={() => setIsSketchModalOpen(true)}
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

      {/* SOS Trigger Modal */}
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
              }}
            />
          </div>
        </div>
      )}

      {/* Standalone Suspect Sketch Builder Modal */}
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
              onSaveSketch={(sketch) => {
                alert('Suspect composite sketch created successfully! You can attach it when submitting a new Incident Report.');
                setIsSketchModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={setCurrentUser}
        currentUser={currentUser}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="font-heading font-bold text-slate-300">AlertX Emergency Response System</span>
          </div>
          <p>© 2026 AlertX Hackathon Demo Project. Built for rapid emergency reporting & dispatch.</p>
        </div>
      </footer>
    </div>
  );
}
