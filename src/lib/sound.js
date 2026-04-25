// Programmatic audio using Web Audio API — ambient notifications with no voice

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

// Ambient pad sounds for gentle notification
function ambientPad(ctx, t, duration, freq = 261.63) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.connect(env);
  env.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, t);
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.12, t + 0.05);
  env.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration + 0.1);
}

// Whoosh-like effect using noise
function whoosh(ctx, t, duration = 0.4) {
  const bufLen = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);

  for (let i = 0; i < bufLen; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const env = ctx.createGain();

  src.buffer = buf;
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(800, t);
  filter.frequency.linearRampToValueAtTime(4000, t + duration);

  src.connect(filter);
  filter.connect(env);
  env.connect(ctx.destination);

  env.gain.setValueAtTime(0.15, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + duration);

  src.start(t);
  src.stop(t + duration);
}

// Four distinct ambient notification sounds per urgency level
const AMBIENTS = {
  info: (ctx, t) => {
    // Gentle ascending ambient pad
    ambientPad(ctx, t,          0.6, 392);    // G4
    ambientPad(ctx, t + 0.15,   0.6, 523.25); // C5
  },
  warning: (ctx, t) => {
    // Bright double-pad with subtle whoosh
    whoosh(ctx, t, 0.3);
    ambientPad(ctx, t + 0.05,   0.7, 587.33); // D5
    ambientPad(ctx, t + 0.2,    0.6, 659.25); // E5
  },
  danger: (ctx, t) => {
    // Tense stacked pads with sweeping whoosh
    whoosh(ctx, t, 0.5);
    ambientPad(ctx, t + 0.1,    0.8, 659.25); // E5
    ambientPad(ctx, t + 0.2,    0.8, 659.25); // E5 (doubled)
  },
  critical: (ctx, t) => {
    // Urgent multi-layer ambient alert
    whoosh(ctx, t, 0.6);
    ambientPad(ctx, t + 0.1,    1.0, 659.25); // E5
    ambientPad(ctx, t + 0.15,   1.0, 659.25); // E5 (thick)
    tone(ctx, 880, 'sine',      t + 0.3, 0.3, 0.12); // bright accent
  },
};

export async function playNotification(urgency = 'info') {
  const ctx = makeCtx();
  if (!ctx) return;
  await ctx.resume();
  const now = ctx.currentTime;
  (AMBIENTS[urgency] || AMBIENTS.info)(ctx, now);
  setTimeout(() => ctx.close().catch(() => {}), 1500);
}

export async function notify(urgency, pct, plan) {
  await playNotification(urgency);
}
