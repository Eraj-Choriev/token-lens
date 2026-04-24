// Programmatic audio using Web Audio API — no external files needed

function makeCtx() {
  try {
    return new (window.AudioContext || window.webkitAudioContext)();
  } catch { return null; }
}

function tone(ctx, freq, type, start, duration, gain = 0.18) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.connect(env);
  env.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  env.gain.setValueAtTime(0, start);
  env.gain.linearRampToValueAtTime(gain, start + 0.01);
  env.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

// Four distinct chime patterns per urgency level
const CHIMES = {
  info: (ctx, t) => {
    // Soft single bell — C5
    tone(ctx, 523.25, 'sine',     t,        0.6, 0.14);
    tone(ctx, 1046.5, 'sine',     t + 0.01, 0.4, 0.05); // shimmer overtone
  },
  warning: (ctx, t) => {
    // Two ascending notes — C5 → E5
    tone(ctx, 523.25, 'sine',     t,        0.35, 0.16);
    tone(ctx, 659.25, 'sine',     t + 0.2,  0.45, 0.18);
  },
  danger: (ctx, t) => {
    // Descending tri-tone — G5 → E5 → C5
    tone(ctx, 783.99, 'sine',     t,        0.25, 0.20);
    tone(ctx, 659.25, 'sine',     t + 0.18, 0.25, 0.20);
    tone(ctx, 523.25, 'sine',     t + 0.36, 0.45, 0.22);
  },
  critical: (ctx, t) => {
    // Urgent 4-pulse alarm — uses triangle wave for edge
    [0, 0.18, 0.36, 0.54].forEach(offset => {
      tone(ctx, 880, 'triangle',  t + offset, 0.12, 0.22);
      tone(ctx, 440, 'sine',      t + offset, 0.12, 0.08);
    });
  },
};

export async function playChime(urgency = 'info') {
  const ctx = makeCtx();
  if (!ctx) return;
  await ctx.resume();
  const now = ctx.currentTime;
  (CHIMES[urgency] || CHIMES.info)(ctx, now);
  // close context after sound finishes
  setTimeout(() => ctx.close().catch(() => {}), 2000);
}

const VOICES = {
  info:     { rate: 0.92, pitch: 1.1, text: (pct, plan) => `Heads up — you've used ${pct} percent of your ${plan} plan.` },
  warning:  { rate: 0.95, pitch: 1.0, text: (pct, plan) => `Warning. ${pct} percent of your ${plan} plan limit used.` },
  danger:   { rate: 1.05, pitch: 0.95, text: (pct, plan) => `Alert! You've hit ${pct} percent. Only ${100 - pct} percent remaining.` },
  critical: { rate: 1.15, pitch: 0.88, text: (pct, plan) => `Critical! Token limit reached. Your ${plan} plan is fully used.` },
};

export function speak(urgency = 'info', pct = 50, plan = 'Pro') {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const cfg = VOICES[urgency] || VOICES.info;
  const utt = new SpeechSynthesisUtterance(cfg.text(pct, plan));
  utt.rate  = cfg.rate;
  utt.pitch = cfg.pitch;
  utt.volume = 0.85;
  // prefer a clear English voice
  const voices = window.speechSynthesis.getVoices();
  const en = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
          || voices.find(v => v.lang.startsWith('en'))
          || null;
  if (en) utt.voice = en;
  window.speechSynthesis.speak(utt);
}

export async function notify(urgency, pct, plan) {
  await playChime(urgency);
  // speak after the chime ends
  const delay = { info: 700, warning: 750, danger: 950, critical: 1200 }[urgency] ?? 700;
  setTimeout(() => speak(urgency, pct, plan), delay);
}
