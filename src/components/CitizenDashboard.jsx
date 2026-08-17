import React from 'react';
import { Shield, AlertTriangle, PhoneCall, MapPin, UserPlus, FileText, CheckCircle2, Clock, ChevronRight, Navigation, Sparkles, Siren } from 'lucide-react';
import { EMERGENCY_HOTLINES, SAFE_ZONES } from '../data/mockData';

export default function CitizenDashboard({ reports, onOpenReportModal, onOpenSketchModal, onOpenSOS }) {
  const citizenReports = reports.filter(r => r.userRole === 'Citizen' || r.type === 'SOS Panic Trigger');

  return (
    <div className="space-y-8">
      {/* Top Banner SOS Hero Callout */}
      <div className="relative overflow-hidden glass-panel rounded-3xl p-6 sm:p-8 border border-red-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-widest flex items-center gap-1.5">
                <Siren className="w-3.5 h-3.5" /> Emergency SOS Ready
              </span>
              <span className="text-xs text-slate-400 font-mono">LIVE PROTECT ID: 9081</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-2 leading-tight">
              Smart Citizen Emergency Portal
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Instant 1-tap SOS distress signal, automated AI severity classification, incident reporting, and suspect composite sketch generator.
            </p>
          </div>

          {/* Large Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onOpenSOS}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-base shadow-xl shadow-red-900/40 transition flex items-center justify-center gap-3 border border-red-400/40"
            >
              <Siren className="w-6 h-6 animate-pulse" />
              <span>TRIGGER SOS DISTRESS</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="px-5 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Report Incident</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Submitted Reports & Status Stepper */}
        <div className="md:col-span-8 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" /> Live Tracked Incident Reports
                </h3>
                <p className="text-xs text-slate-400">Real-time status updates from Central Dispatch Command.</p>
              </div>

              <button
                onClick={onOpenReportModal}
                className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                + File New Report
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {citizenReports.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">No active reports logged yet.</div>
              ) : (
                citizenReports.map(report => (
                  <div key={report.id} className="glass-card rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">{report.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            report.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            report.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {report.priority} Priority
                          </span>
                          <span className="text-[11px] text-slate-500">{report.timestamp}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{report.title}</h4>
                      </div>

                      <div className="text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          report.status === 'Dispatched' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                          report.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          report.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{report.description}</p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-red-400" /> {report.location}
                      </span>
                      <span className="text-xs text-amber-400 font-medium">
                        Unit: {report.assignedUnit || 'Dispatching...'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Suspect Sketch Generator Trigger Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-heading text-white">Suspect Sketch Generator</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">HACKATHON FEATURE</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Select facial landmark shapes, eyes, hair & accessories to assemble a composite suspect profile.</p>
              </div>
            </div>

            <button
              onClick={onOpenSketchModal}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-2 shadow-lg shadow-amber-950/50 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" /> Open Sketch Tool
            </button>
          </div>
        </div>

        {/* Right Column: Hotlines & Safe Zones */}
        <div className="md:col-span-4 space-y-6">
          {/* Emergency Hotlines */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 className="text-base font-bold font-heading text-white mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-red-500" /> One-Tap Hotlines
            </h3>

            <div className="space-y-2.5">
              {EMERGENCY_HOTLINES.map(line => (
                <a
                  key={line.name}
                  href={`tel:${line.number}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{line.name}</div>
                    <div className="text-xs font-mono text-red-400 font-extrabold mt-0.5">{line.number}</div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Nearby Safe Zones */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 className="text-base font-bold font-heading text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Nearby Safe Havens
            </h3>

            <div className="space-y-3">
              {SAFE_ZONES.map(zone => (
                <div key={zone.name} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-start justify-between">
                    <div className="text-xs font-bold text-white">{zone.name}</div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {zone.distance}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-slate-500" /> {zone.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
