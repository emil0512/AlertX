import React, { useState } from 'react';
import { ShieldAlert, MapPin, Filter, Search, Eye, CheckCircle, Radio, Siren, Sparkles, Layers, UserCheck, PhoneCall, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { RESPONSE_UNITS } from '../data/mockData';

export default function AdminDashboard({ reports, onUpdateReportStatus, onAssignUnit }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'map' | 'units'

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchesPriority = filterPriority === 'All' || r.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch = !searchQuery ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesStatus && matchesSearch;
  });

  const criticalCount = reports.filter(r => r.priority === 'Critical').length;
  const dispatchedCount = reports.filter(r => r.status === 'Dispatched').length;
  const pendingCount = reports.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-red-500/30 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Critical SOS & Alerts</div>
            <div className="text-3xl font-black font-mono text-white mt-1">{criticalCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40 animate-pulse">
            <Siren className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Units Dispatched</div>
            <div className="text-3xl font-black font-mono text-white mt-1">{dispatchedCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Pending Review</div>
            <div className="text-3xl font-black font-mono text-white mt-1">{pendingCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Active Patrol Units</div>
            <div className="text-3xl font-black font-mono text-white mt-1">4 Units</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Control Panel Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" /> Emergency Dispatch Command Center
            </h2>
            <p className="text-xs text-slate-400">Monitor live threats, review AI classification ratings, inspect sketches & dispatch tactical units.</p>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'queue' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Incident Stream ({filteredReports.length})
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'map' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Radar Map
            </button>
            <button
              onClick={() => setActiveTab('units')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'units' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Response Units
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-800">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, location, or keyword..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="All">Priority: All</option>
              <option value="Critical">Critical Threat</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div className="sm:col-span-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="All">Status: All</option>
              <option value="Pending">Pending Review</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View Tab Content */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center text-slate-500 text-sm">
              No emergency incidents match the current filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map(report => (
                <div
                  key={report.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all ${
                    report.priority === 'Critical' ? 'border-red-500/40 bg-red-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-red-400 px-2 py-0.5 rounded bg-slate-900 border border-red-500/30">
                          {report.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                          report.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' :
                          report.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                          report.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {report.priority} ({report.priorityScore}/100)
                        </span>

                        <span className="text-xs text-slate-400 font-medium">
                          Category: <span className="text-slate-200">{report.category}</span>
                        </span>

                        <span className="text-xs text-slate-500">{report.timestamp}</span>
                      </div>

                      <h3 className="text-base font-bold text-white">{report.title}</h3>
                      <p className="text-xs text-slate-300 line-clamp-2">{report.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-red-400" /> {report.location}
                        </span>
                        <span>Reporter: <strong className="text-slate-200">{report.reporter}</strong></span>
                        {report.suspectSketch && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold text-[10px] flex items-center gap-1">
                            <UserCheck className="w-3 h-3" /> Sketch Attached
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dispatch & Inspector Trigger */}
                    <div className="flex items-center gap-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 justify-between lg:justify-end">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">STATUS</div>
                        <select
                          value={report.status}
                          onChange={(e) => onUpdateReportStatus(report.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-200 focus:outline-none focus:border-red-500 mt-0.5"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>

                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700 flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4 text-red-400" /> Inspect Report
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Map Radar Tab */}
      {activeTab === 'map' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Live Emergency Radar Map</h3>
              <p className="text-xs text-slate-400">Coordinates of incoming panic SOS alerts and crime reports.</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-red-400"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" /> Critical</span>
              <span className="flex items-center gap-1 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> High</span>
              <span className="flex items-center gap-1 text-blue-400"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Medium</span>
            </div>
          </div>

          <div className="w-full h-96 bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
            {/* Interactive Custom Radar Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 pointer-events-none" />

            {/* Radar Circle */}
            <div className="w-72 h-72 rounded-full border border-red-500/20 relative flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full border border-red-500/20" />
              <div className="w-24 h-24 rounded-full border border-red-500/20" />
              <div className="absolute w-full h-full rounded-full border border-red-500/10 animate-radar origin-center" />
            </div>

            {/* Simulated Live Incident Pins */}
            {reports.map((r, i) => {
              const topOffset = 25 + (i * 15) % 60;
              const leftOffset = 20 + (i * 22) % 65;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  style={{ top: `${topOffset}%`, left: `${leftOffset}%` }}
                  className="absolute cursor-pointer group z-20"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border shadow-lg transform group-hover:scale-125 transition ${
                    r.priority === 'Critical' ? 'bg-red-600 border-red-300 animate-bounce' :
                    r.priority === 'High' ? 'bg-amber-600 border-amber-300' :
                    'bg-blue-600 border-blue-300'
                  }`}>
                    {r.priority === 'Critical' ? '🚨' : '📍'}
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap border border-slate-700">
                    {r.id}: {r.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Response Units Tab */}
      {activeTab === 'units' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESPONSE_UNITS.map(unit => (
            <div key={unit.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-red-400">{unit.id}</span>
                  <h4 className="text-base font-bold text-white">{unit.name}</h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  unit.status === 'On Route' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {unit.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">Assigned Vehicle: <strong className="text-slate-200">{unit.vehicle}</strong></p>
              <p className="text-xs text-slate-400">Current Sector: <strong className="text-slate-200">{unit.location}</strong></p>
            </div>
          ))}
        </div>
      )}

      {/* Inspector Modal Drawer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative shadow-2xl">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-900/80 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-400 px-2 py-0.5 rounded bg-slate-900 border border-red-500/30">
                    {selectedReport.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                    selectedReport.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {selectedReport.priority} Priority
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-heading text-white mt-2">{selectedReport.title}</h2>
                <p className="text-xs text-slate-400 mt-1">Logged {selectedReport.timestamp} by {selectedReport.reporter}</p>
              </div>

              {/* AI Priority Breakdown */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> AI Classification Assessment
                  </span>
                  <span className="text-amber-400 font-mono">Score: {selectedReport.priorityScore}/100</span>
                </div>
                <p className="text-xs text-slate-300 italic">{selectedReport.aiReasoning}</p>
              </div>

              {/* Description & Location */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Incident Brief</h4>
                <p className="text-sm text-slate-200 bg-slate-900/50 p-4 rounded-xl border border-slate-800 leading-relaxed">
                  {selectedReport.description}
                </p>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>Location: <strong className="text-white">{selectedReport.location}</strong></span>
                </div>
              </div>

              {/* Suspect Sketch Display if present */}
              {selectedReport.suspectSketch && (
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> Attached Composite Suspect Profile
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Face Shape</span>
                      <strong className="text-slate-200">{selectedReport.suspectSketch.faceShape}</strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Hair Style</span>
                      <strong className="text-slate-200">{selectedReport.suspectSketch.hairStyle}</strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Eye Profile</span>
                      <strong className="text-slate-200">{selectedReport.suspectSketch.eyes}</strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Accessories</span>
                      <strong className="text-slate-200">{selectedReport.suspectSketch.accessories}</strong>
                    </div>
                  </div>
                  {selectedReport.suspectSketch.notes && (
                    <p className="text-xs text-slate-400 font-mono">Notes: {selectedReport.suspectSketch.notes}</p>
                  )}
                </div>
              )}

              {/* Dispatch Action */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 font-medium">Assign Response Unit:</span>
                  <select
                    value={selectedReport.assignedUnit || 'Unassigned'}
                    onChange={(e) => onAssignUnit(selectedReport.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {RESPONSE_UNITS.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white transition"
                >
                  Done Inspecting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
