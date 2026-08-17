/**
 * Web Audio API Emergency Siren and Sound Synthesizer
 * Provides realistic auditory alerts without external audio assets.
 */

let audioCtx = null;
let sirenOscillator = null;
let sirenLfo = null;
let sirenGain = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playEmergencySiren() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    // Stop if already running
    stopEmergencySiren();

    sirenOscillator = ctx.createOscillator();
    sirenLfo = ctx.createOscillator();
    sirenGain = ctx.createGain();

    const lfoGain = ctx.createGain();

    // Emergency Siren frequencies (sweeps between 600Hz and 1200Hz)
    sirenOscillator.type = 'sawtooth';
    sirenOscillator.frequency.value = 800;

    sirenLfo.type = 'sine';
    sirenLfo.frequency.value = 1.5; // 1.5 Hz modulation speed
    lfoGain.gain.value = 350; // Sweep range

    sirenLfo.connect(lfoGain);
    lfoGain.connect(sirenOscillator.frequency);

    sirenGain.gain.setValueAtTime(0.08, ctx.currentTime);

    sirenOscillator.connect(sirenGain);
    sirenGain.connect(ctx.destination);

    sirenOscillator.start();
    sirenLfo.start();

    return true;
  } catch (err) {
    console.error('Audio siren playback error:', err);
    return false;
  }
}

export function stopEmergencySiren() {
  try {
    if (sirenOscillator) {
      sirenOscillator.stop();
      sirenOscillator.disconnect();
      sirenOscillator = null;
    }
    if (sirenLfo) {
      sirenLfo.stop();
      sirenLfo.disconnect();
      sirenLfo = null;
    }
  } catch (e) {
    // Ignore cleanup errors
  }
}

export function playBeepAlert(freq = 880, duration = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // Ignore audio error
  }
}
