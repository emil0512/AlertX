import React, { useState, useEffect } from 'react';
import { Siren, MapPin, PhoneCall, Volume2, VolumeX, ShieldAlert, CheckCircle, X, AlertOctagon } from 'lucide-react';
import { playEmergencySiren, stopEmergencySiren } from '../services/soundEffects';

export default function SOSModal({ isOpen, onClose, onTriggerSOS, userLocation }) {
  const [countdown, setCountdown] = useState(3);
  const [isActivated, setIsActivated] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    let timer;
    if (isOpen && !isActivated) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            activateSOS();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  const activateSOS = () => {
    setIsActivated(true);
    if (soundOn) {
      playEmergencySiren();
    }

    const sosPayload = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'SOS Panic Trigger',
      category: 'Armed Robbery',
      title: '🚨 CRITICAL: Immediate SOS Distress Panic Signal',
      description: 'Panic SOS button activated by citizen. Live GPS broadcast initiated.',
      location: userLocation ? userLocation.address : 'Downtown Tech Quad (37.7749, -122.4194)',
      coords: userLocation ? userLocation.coords : { lat: 37.7749, lng: -122.4194 },
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      reporter: 'Emergency Citizen (+1 555-911-00)',
      userRole: 'Citizen',
      priority: 'Critical',
      priorityScore: 99,
      confidence: '99%',
      aiReasoning: 'Manual SOS Panic Triggered - Highest Emergency Protocol.',
      status: 'Dispatched',
      assignedUnit: 'Squad 104 - Tactical Command (En Route)',
      hasWeapons: true,
      hasCasualties: false,
      isHappeningNow: true,
      evidenceUrls: [],
      suspectSketch: null
    };

    onTriggerSOS(sosPayload);
  };

  const toggleSound = () => {
    if (soundOn) {
      stopEmergencySiren();
      setSoundOn(false);
    } else {
      playEmergencySiren();
      setSoundOn(true);
    }
  };

  const handleClose = () => {
    stopEmergencySiren();
    setIsActivated(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-red-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel-alert rounded-3xl p-6 sm:p-8 text-center relative border border-red-500/50 shadow-[0_0_80px_rgba(239,68,68,0.4)] animate-sos-pulse">
        {/* Cancel / Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-red-200 hover:text-white p-2 rounded-full bg-slate-900/60 border border-red-500/30"
        >
          <X className="w-5 h-5" />
        </button>

        {!isActivated ? (
          /* Countdown State */
          <div className="space-y-6">
            <div className="w-24 h-24 bg-red-600/30 text-red-400 rounded-full flex items-center justify-center mx-auto border-2 border-red-500 animate-ping">
              <AlertOctagon className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold font-heading text-white tracking-wide">Broadcasting SOS Alert</h2>
              <p className="text-sm text-red-200/80 mt-1">Sending distress call to emergency responders in...</p>
            </div>

            <div className="text-6xl font-black font-mono text-white tracking-wider my-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
              00:0{countdown}
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 rounded-xl font-bold bg-slate-900 text-slate-200 hover:bg-slate-800 transition border border-slate-700"
            >
              Cancel SOS (Accidental Press)
            </button>
          </div>
        ) : (
          /* Active Distress Broadcast State */
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/50 animate-bounce">
              <Siren className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 uppercase tracking-widest inline-block mb-2">
                CRITICAL SOS ACTIVE
              </span>
              <h2 className="text-2xl font-bold font-heading text-white">Emergency Units Dispatched</h2>
              <p className="text-xs text-red-200 mt-1">
                Your live GPS coordinates have been broadcast to Squad 104 Tactical Command. Stay calm and head to a safe location.
              </p>
            </div>

            {/* GPS Tracker Badge */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-red-500/30 text-left space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                  <MapPin className="w-4 h-4" /> Live GPS Transmitting
                </span>
                <span className="font-mono text-[11px] text-slate-400">ACCURACY: 4m</span>
              </div>
              <p className="text-xs font-mono text-white truncate">
                {userLocation ? userLocation.address : 'Downtown Central Tech Quad (37.7749, -122.4194)'}
              </p>
            </div>

            {/* Audio Siren Toggle & Emergency Call */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSound}
                className={`flex-1 py-3 rounded-xl font-semibold text-xs border transition flex items-center justify-center gap-2 ${
                  soundOn
                    ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {soundOn ? 'Siren Alarm ON' : 'Siren Muted'}
              </button>

              <a
                href="tel:911"
                className="flex-1 py-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Call 911 Direct
              </a>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl font-medium text-xs bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800"
            >
              Dismiss / Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
