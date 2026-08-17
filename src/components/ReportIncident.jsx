import React, { useState } from 'react';
import { AlertTriangle, Upload, MapPin, Sparkles, CheckCircle2, Shield, Camera, FileText, UserPlus, X, HelpCircle } from 'lucide-react';
import { classifyIncident } from '../services/aiClassifier';
import SuspectSketchBuilder from './SuspectSketchBuilder';

const CATEGORIES = [
  'Armed Robbery',
  'Assault & Violence',
  'Fire Emergency',
  'Severe Accident / Medical',
  'Kidnapping / Missing Person',
  'Cyber Crime / Financial Fraud',
  'Suspicious Activity',
  'Vandalism / Property Damage',
  'Harassment / Stalking',
  'Other Crime'
];

export default function ReportIncident({ onSubmitReport, currentUser }) {
  const [formData, setFormData] = useState({
    category: 'Armed Robbery',
    title: '',
    description: '',
    location: '',
    hasWeapons: false,
    hasCasualties: false,
    isHappeningNow: true,
    reporterName: currentUser ? currentUser.name : 'Anonymous Reporter',
    reporterContact: currentUser ? currentUser.phone : '+1 555-0199'
  });

  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [attachedSketch, setAttachedSketch] = useState(null);
  const [showSketchModal, setShowSketchModal] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [createdReportId, setCreatedReportId] = useState(null);

  // Live AI Classification
  const aiResult = classifyIncident({
    category: formData.category,
    title: formData.title,
    description: formData.description,
    hasWeapons: formData.hasWeapons,
    hasCasualties: formData.hasCasualties,
    isHappeningNow: formData.isHappeningNow
  });

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type
    }));
    setEvidenceFiles(prev => [...prev, ...newFiles]);
  };

  const removeEvidence = (index) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      alert('Please fill in the title and location of the incident.');
      return;
    }

    const reportId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReport = {
      id: reportId,
      type: 'Crime Report',
      category: formData.category,
      title: formData.title,
      description: formData.description || 'No detailed description provided.',
      location: formData.location,
      coords: { lat: 37.7749 + (Math.random() - 0.5) * 0.04, lng: -122.4194 + (Math.random() - 0.5) * 0.04 },
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      reporter: formData.reporterName + (formData.reporterContact ? ` (${formData.reporterContact})` : ''),
      userRole: currentUser ? currentUser.role : 'Citizen',
      priority: aiResult.priority,
      priorityScore: aiResult.score,
      confidence: aiResult.confidence,
      aiReasoning: aiResult.reasoning,
      status: aiResult.priority === 'Critical' ? 'Dispatched' : 'Pending',
      assignedUnit: aiResult.priority === 'Critical' ? 'Squad 104 - Tactical Command' : 'Unassigned',
      hasWeapons: formData.hasWeapons,
      hasCasualties: formData.hasCasualties,
      isHappeningNow: formData.isHappeningNow,
      evidenceUrls: evidenceFiles.map(f => f.url),
      suspectSketch: attachedSketch
    };

    onSubmitReport(newReport);
    setCreatedReportId(reportId);
    setSubmittedSuccess(true);
  };

  const resetForm = () => {
    setFormData({
      category: 'Armed Robbery',
      title: '',
      description: '',
      location: '',
      hasWeapons: false,
      hasCasualties: false,
      isHappeningNow: true,
      reporterName: currentUser ? currentUser.name : 'Anonymous Reporter',
      reporterContact: currentUser ? currentUser.phone : '+1 555-0199'
    });
    setEvidenceFiles([]);
    setAttachedSketch(null);
    setSubmittedSuccess(false);
  };

  if (submittedSuccess) {
    return (
      <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto border border-emerald-500/30 text-center my-8 shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold font-heading text-white">Emergency Report Submitted</h2>
        <p className="text-sm text-slate-300 mt-2">
          Your report has been logged and assigned tracking ID <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 bg-slate-900 rounded border border-emerald-500/30">{createdReportId}</span>.
        </p>

        <div className="my-6 p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Assigned AI Priority:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[11px] ${
              aiResult.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              aiResult.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {aiResult.priority} ({aiResult.score}/100)
            </span>
          </div>
          <p className="text-xs text-slate-300 italic">{aiResult.reasoning}</p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={resetForm}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700"
          >
            File Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Suspect Sketch Modal overlay */}
      {showSketchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-4xl relative">
            <button
              onClick={() => setShowSketchModal(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white p-2 rounded-full bg-slate-900/80 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <SuspectSketchBuilder
              initialSketch={attachedSketch}
              onSaveSketch={(sketch) => {
                setAttachedSketch(sketch);
                setShowSketchModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Form Box */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-xs text-red-400 font-mono font-semibold uppercase tracking-wider">AlertX Smart Incident Desk</span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white mt-1">Submit Incident or Crime Report</h2>
            <p className="text-xs text-slate-400">Fill out details below. The AI classifier will automatically assess threat severity.</p>
          </div>

          {/* AI Priority Realtime Preview Box */}
          <div className="hidden sm:flex flex-col items-end bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> AI Threat Score
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-black font-mono text-white">{aiResult.score}</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                aiResult.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                aiResult.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                aiResult.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-slate-700 text-slate-300'
              }`}>
                {aiResult.priority}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Category & Title */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Incident Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-200 focus:outline-none focus:border-red-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Short Incident Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Armed robbery at gas station on 5th street"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Incident Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Detailed Description & Suspect Info
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what happened, weapon details, suspect count, vehicle model, license plate, direction of travel..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Incident Flags & Location */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Location / Address *
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-red-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Street name, landmark, or campus building"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Danger Indicators Toggles */}
            <div className="md:col-span-5 flex flex-col justify-center bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Emergency Flags</span>
              <div className="flex items-center justify-between gap-2 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasWeapons}
                    onChange={(e) => handleInputChange('hasWeapons', e.target.checked)}
                    className="w-4 h-4 accent-red-500 rounded"
                  />
                  <span>Weapons Involved</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasCasualties}
                    onChange={(e) => handleInputChange('hasCasualties', e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Casualties / Injured</span>
                </label>
              </div>
            </div>
          </div>

          {/* Suspect Sketch Section */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Suspect Sketch Generator</h4>
                <p className="text-xs text-slate-400">
                  {attachedSketch
                    ? `Attached: ${attachedSketch.faceShape} face, ${attachedSketch.hairStyle} hair, ${attachedSketch.accessories} accessories`
                    : 'Optionally compose facial features of suspect.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSketchModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              {attachedSketch ? 'Edit Suspect Sketch' : 'Create Suspect Sketch'}
            </button>
          </div>

          {/* Photo & Video Evidence Upload Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Photo / Media Evidence Upload
            </label>
            <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:border-slate-700 transition bg-slate-900/40">
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-medium">Click to select evidence images or drag files here</p>
              <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, MP4 up to 25MB</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="evidence-input"
              />
              <label
                htmlFor="evidence-input"
                className="inline-block mt-3 px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer border border-slate-700"
              >
                Browse Media
              </label>

              {/* Uploaded Thumbnails */}
              {evidenceFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-800/80 justify-center">
                  {evidenceFiles.map((file, idx) => (
                    <div key={idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                      <img src={file.url} alt="Evidence" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeEvidence(idx)}
                        className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400 inline mr-1" /> Encrypted & Sent directly to Central Command
            </div>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-xl shadow-red-900/30 transition flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> Broadcast Report Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
