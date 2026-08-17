import React, { useState } from 'react';
import { UserCheck, Sparkles, RefreshCw, Download, Layers, Check, ShieldAlert } from 'lucide-react';

const FACE_SHAPES = [
  { id: 'Oval', label: 'Oval', path: 'M 100,50 C 155,50 175,90 175,145 C 175,200 145,230 100,230 C 55,230 25,200 25,145 C 25,90 45,50 100,50 Z' },
  { id: 'Square', label: 'Square', path: 'M 100,45 C 150,45 170,80 170,135 C 170,195 160,225 100,225 C 40,225 30,195 30,135 C 30,80 50,45 100,45 Z' },
  { id: 'Round', label: 'Round', path: 'M 100,45 C 165,45 175,95 175,140 C 175,190 155,225 100,225 C 45,225 25,190 25,140 C 25,95 35,45 100,45 Z' },
  { id: 'Heart', label: 'Heart Pointed', path: 'M 100,45 C 160,45 175,85 170,140 C 165,185 130,225 100,235 C 70,225 35,185 30,140 C 25,85 40,45 100,45 Z' }
];

const SKIN_TONES = [
  { id: 'mono', label: 'Police Sketch Gray', color: '#CBD5E1', border: '#475569' },
  { id: 'fair', label: 'Fair Tone', color: '#FCD34D', border: '#D97706' },
  { id: 'medium', label: 'Medium Tone', color: '#E0AC69', border: '#B45309' },
  { id: 'tan', label: 'Tan Tone', color: '#C58C85', border: '#9A3412' },
  { id: 'dark', label: 'Dark Tone', color: '#78350F', border: '#451A03' }
];

const HAIR_STYLES = [
  { id: 'Short Crop', label: 'Short Crop' },
  { id: 'Curly Afro', label: 'Curly' },
  { id: 'Bald', label: 'Bald / Shaved' },
  { id: 'Long Wavy', label: 'Long Wavy' },
  { id: 'Slick Back', label: 'Slick Back' },
  { id: 'Cap / Beanie', label: 'Cap / Beanie' }
];

const EYES = [
  { id: 'Narrow / Stern', label: 'Narrow / Stern' },
  { id: 'Round / Wide', label: 'Round Alert' },
  { id: 'Heavy Eyebrows', label: 'Heavy Eyebrows' },
  { id: 'Monolid', label: 'Monolid' }
];

const NOSES = [
  { id: 'Sharp Straight', label: 'Sharp Straight' },
  { id: 'Wide Flat', label: 'Wide Flat' },
  { id: 'Button', label: 'Small Button' },
  { id: 'Hooked', label: 'Aquiline / Hooked' }
];

const MOUTHS = [
  { id: 'Neutral Line', label: 'Neutral Line' },
  { id: 'Thin Lips', label: 'Thin Lips' },
  { id: 'Full Lips', label: 'Full Lips' },
  { id: 'Mask Covered', label: 'Tactical Mask' }
];

const FACIAL_HAIR = [
  { id: 'Clean Shaved', label: 'Clean Shaved' },
  { id: 'Stubble', label: '5 o\'clock Stubble' },
  { id: 'Goatee', label: 'Goatee' },
  { id: 'Full Beard', label: 'Full Beard' },
  { id: 'Mustache', label: 'Mustache' }
];

const ACCESSORIES = [
  { id: 'None', label: 'None' },
  { id: 'Dark Sunglasses', label: 'Dark Sunglasses' },
  { id: 'Reading Glasses', label: 'Glasses' },
  { id: 'Cap', label: 'Baseball Cap' }
];

export default function SuspectSketchBuilder({ onSaveSketch, initialSketch = null }) {
  const [sketch, setSketch] = useState(initialSketch || {
    faceShape: 'Oval',
    skinTone: '#CBD5E1',
    hairStyle: 'Short Crop',
    eyes: 'Narrow / Stern',
    eyebrows: 'Thick Bushy',
    nose: 'Sharp Straight',
    mouth: 'Neutral Line',
    facialHair: 'Clean Shaved',
    accessories: 'None',
    notes: 'Estimated height: 5ft 10in, medium build, dark jacket'
  });

  const [activeTab, setActiveTab] = useState('head');
  const [isCopied, setIsCopied] = useState(false);

  const selectedFace = FACE_SHAPES.find(f => f.id === sketch.faceShape) || FACE_SHAPES[0];

  const handleSelect = (key, val) => {
    setSketch(prev => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setSketch({
      faceShape: 'Oval',
      skinTone: '#CBD5E1',
      hairStyle: 'Short Crop',
      eyes: 'Narrow / Stern',
      eyebrows: 'Thick Bushy',
      nose: 'Sharp Straight',
      mouth: 'Neutral Line',
      facialHair: 'Clean Shaved',
      accessories: 'None',
      notes: ''
    });
  };

  const handleSave = () => {
    if (onSaveSketch) {
      onSaveSketch(sketch);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Hackathon Feature
            </span>
            <span className="text-xs text-slate-400 font-mono">MODULE ID: S-SKETCH-2026</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading mt-1">Facial Suspect Sketch Generator</h2>
          <p className="text-sm text-slate-400">Assemble a composite suspect profile by picking key facial landmarks and characteristics.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleReset}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition flex items-center justify-center gap-2 border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            className="flex-1 md:flex-initial px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-500 hover:to-amber-500 transition shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <UserCheck className="w-4 h-4" />}
            {isCopied ? 'Attached to Report!' : 'Attach Sketch to Report'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: SVG Canvas Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-900/90 rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
          {/* Grid Background Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          <div className="relative z-10 w-full max-w-[280px] aspect-square flex items-center justify-center">
            <svg viewBox="0 0 200 250" className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
              {/* Defs / Gradients */}
              <defs>
                <filter id="sketch-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Ears */}
              <ellipse cx="25" cy="140" rx="8" ry="18" fill={sketch.skinTone} stroke="#334155" strokeWidth="2" />
              <ellipse cx="175" cy="140" rx="8" ry="18" fill={sketch.skinTone} stroke="#334155" strokeWidth="2" />

              {/* Head / Face Shape */}
              <path d={selectedFace.path} fill={sketch.skinTone} stroke="#1E293B" strokeWidth="2.5" />

              {/* Eyebrows */}
              <path d="M 60,110 Q 75,103 90,112" fill="none" stroke="#1E293B" strokeWidth={sketch.eyebrows === 'Heavy Eyebrows' ? "4" : "2.5"} strokeLinecap="round" />
              <path d="M 110,112 Q 125,103 140,110" fill="none" stroke="#1E293B" strokeWidth={sketch.eyebrows === 'Heavy Eyebrows' ? "4" : "2.5"} strokeLinecap="round" />

              {/* Eyes */}
              {sketch.eyes === 'Round / Wide' ? (
                <>
                  <circle cx="75" cy="122" r="8" fill="#FFF" stroke="#1E293B" strokeWidth="2" />
                  <circle cx="125" cy="122" r="8" fill="#FFF" stroke="#1E293B" strokeWidth="2" />
                  <circle cx="75" cy="122" r="3.5" fill="#0F172A" />
                  <circle cx="125" cy="122" r="3.5" fill="#0F172A" />
                </>
              ) : sketch.eyes === 'Monolid' ? (
                <>
                  <path d="M 65,123 Q 75,118 85,123" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 115,123 Q 125,118 135,123" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <ellipse cx="75" cy="123" rx="7" ry="4.5" fill="#FFF" stroke="#1E293B" strokeWidth="2" />
                  <ellipse cx="125" cy="123" rx="7" ry="4.5" fill="#FFF" stroke="#1E293B" strokeWidth="2" />
                  <circle cx="75" cy="123" r="3" fill="#0F172A" />
                  <circle cx="125" cy="123" r="3" fill="#0F172A" />
                </>
              )}

              {/* Nose */}
              {sketch.nose === 'Wide Flat' ? (
                <path d="M 100,128 L 98,155 Q 90,165 100,165 Q 110,165 102,155 Z" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              ) : sketch.nose === 'Hooked' ? (
                <path d="M 100,125 C 108,135 110,150 96,163 Q 102,165 106,161" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              ) : sketch.nose === 'Button' ? (
                <path d="M 96,155 Q 100,160 104,155" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              ) : (
                <path d="M 100,125 L 97,156 Q 100,162 103,156" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              )}

              {/* Mouth / Tactical Mask */}
              {sketch.mouth === 'Mask Covered' || sketch.accessories === 'Tactical Mask' ? (
                <path d="M 45,150 Q 100,140 155,150 L 145,210 Q 100,230 55,210 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              ) : sketch.mouth === 'Full Lips' ? (
                <g>
                  <path d="M 80,185 Q 100,178 120,185 Q 100,195 80,185 Z" fill="#94A3B8" opacity="0.3" stroke="#1E293B" strokeWidth="2" />
                </g>
              ) : sketch.mouth === 'Thin Lips' ? (
                <path d="M 82,185 L 118,185" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              ) : (
                <path d="M 80,185 Q 100,190 120,185" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              )}

              {/* Facial Hair */}
              {sketch.facialHair === 'Goatee' && (
                <path d="M 90,178 Q 100,175 110,178 L 112,215 Q 100,225 88,215 Z" fill="#0F172A" opacity="0.8" />
              )}
              {sketch.facialHair === 'Full Beard' && (
                <path d="M 40,140 C 40,210 60,232 100,235 C 140,232 160,210 160,140 Q 145,215 100,222 Q 55,215 40,140 Z" fill="#0F172A" opacity="0.85" />
              )}
              {sketch.facialHair === 'Mustache' && (
                <path d="M 75,178 Q 100,170 125,178 Q 100,184 75,178 Z" fill="#0F172A" opacity="0.9" />
              )}
              {sketch.facialHair === 'Stubble' && (
                <path d="M 45,150 C 45,200 65,225 100,228 C 135,225 155,200 155,150 Q 140,205 100,212 Q 60,205 45,150 Z" fill="#334155" opacity="0.35" />
              )}

              {/* Hair Styles */}
              {sketch.hairStyle === 'Short Crop' && (
                <path d="M 30,120 C 25,60 60,35 100,35 C 140,35 175,60 170,120 C 150,80 120,70 100,70 C 80,70 50,80 30,120 Z" fill="#0F172A" />
              )}
              {sketch.hairStyle === 'Curly Afro' && (
                <path d="M 20,130 C 0,80 40,20 100,20 C 160,20 200,80 180,130 C 160,140 140,65 100,65 C 60,65 40,140 20,130 Z" fill="#0F172A" />
              )}
              {sketch.hairStyle === 'Long Wavy' && (
                <path d="M 25,120 C 20,50 60,30 100,30 C 140,30 180,50 175,120 L 180,210 Q 165,180 160,120 C 140,75 100,70 60,120 L 20,210 Z" fill="#0F172A" />
              )}
              {sketch.hairStyle === 'Slick Back' && (
                <path d="M 32,100 C 35,45 65,40 100,40 C 135,40 165,45 168,100 C 155,75 130,68 100,68 C 70,68 45,75 32,100 Z" fill="#0F172A" />
              )}
              {sketch.hairStyle === 'Cap / Beanie' && (
                <g>
                  <path d="M 15,115 C 20,40 60,30 100,30 C 140,30 180,40 185,115 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                  <path d="M 10,115 Q 100,105 190,115 L 185,125 Q 100,115 15,125 Z" fill="#0F172A" />
                </g>
              )}

              {/* Accessories */}
              {sketch.accessories === 'Dark Sunglasses' && (
                <g>
                  <rect x="55" y="112" width="38" height="22" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                  <rect x="107" y="112" width="38" height="22" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                  <line x1="93" y1="120" x2="107" y2="120" stroke="#334155" strokeWidth="3" />
                  <line x1="25" y1="118" x2="55" y2="118" stroke="#334155" strokeWidth="2" />
                  <line x1="145" y1="118" x2="175" y2="118" stroke="#334155" strokeWidth="2" />
                </g>
              )}
              {sketch.accessories === 'Reading Glasses' && (
                <g>
                  <circle cx="74" cy="123" r="14" fill="none" stroke="#475569" strokeWidth="2.5" />
                  <circle cx="126" cy="123" r="14" fill="none" stroke="#475569" strokeWidth="2.5" />
                  <line x1="88" y1="123" x2="112" y2="123" stroke="#475569" strokeWidth="2.5" />
                </g>
              )}
              {sketch.accessories === 'Cap' && sketch.hairStyle !== 'Cap / Beanie' && (
                <g>
                  <path d="M 20,100 Q 100,20 180,100 Z" fill="#1E293B" />
                  <path d="M 10,100 L 190,100 L 180,112 L 20,112 Z" fill="#0F172A" />
                </g>
              )}
            </svg>
          </div>

          {/* Preset Skin Tone Bar */}
          <div className="mt-5 w-full flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium">Complexion:</span>
            <div className="flex items-center gap-2">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => handleSelect('skinTone', tone.color)}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    sketch.skinTone === tone.color ? 'ring-2 ring-red-500 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: tone.color, borderColor: tone.border }}
                  title={tone.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Feature Selector Tabs & Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Feature Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
              {[
                { id: 'head', label: 'Face Shape' },
                { id: 'hair', label: 'Hair & Beard' },
                { id: 'features', label: 'Eyes & Nose' },
                { id: 'mouth', label: 'Mouth & Mask' },
                { id: 'extras', label: 'Accessories' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Selector Options Content */}
            <div className="py-4 space-y-5">
              {activeTab === 'head' && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Head Structure & Jawline</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {FACE_SHAPES.map(f => (
                      <button
                        key={f.id}
                        onClick={() => handleSelect('faceShape', f.id)}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
                          sketch.faceShape === f.id
                            ? 'border-red-500 bg-red-500/10 text-white font-bold'
                            : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'hair' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Hair Style</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {HAIR_STYLES.map(h => (
                        <button
                          key={h.id}
                          onClick={() => handleSelect('hairStyle', h.id)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                            sketch.hairStyle === h.id
                              ? 'border-red-500 bg-red-500/10 text-white font-bold'
                              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {h.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Facial Hair</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {FACIAL_HAIR.map(fh => (
                        <button
                          key={fh.id}
                          onClick={() => handleSelect('facialHair', fh.id)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                            sketch.facialHair === fh.id
                              ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {fh.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Eye Shape & Expression</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {EYES.map(e => (
                        <button
                          key={e.id}
                          onClick={() => handleSelect('eyes', e.id)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                            sketch.eyes === e.id
                              ? 'border-red-500 bg-red-500/10 text-white font-bold'
                              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Nose Profile</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {NOSES.map(n => (
                        <button
                          key={n.id}
                          onClick={() => handleSelect('nose', n.id)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                            sketch.nose === n.id
                              ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {n.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'mouth' && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Mouth & Mask Concealment</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {MOUTHS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => handleSelect('mouth', m.id)}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
                          sketch.mouth === m.id
                            ? 'border-red-500 bg-red-500/10 text-white font-bold'
                            : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'extras' && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Eyewear & Accessories</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {ACCESSORIES.map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => handleSelect('accessories', acc.id)}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
                          sketch.accessories === acc.id
                            ? 'border-red-500 bg-red-500/10 text-white font-bold'
                            : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Distinguishing Features & Notes Input */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Additional Identifiers / Notes
                </label>
                <textarea
                  value={sketch.notes}
                  onChange={(e) => handleSelect('notes', e.target.value)}
                  placeholder="e.g. Scar on left cheek, approx 6ft tall, tattoo on neck, wearing dark navy jacket..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
