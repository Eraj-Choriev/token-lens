import { useState, useRef, useEffect } from 'react';
import { Download, Loader2, CheckCircle2, FileDown } from 'lucide-react';
import { generatePDF } from '../lib/generatePDF';

// States: idle → generating → downloading → success → idle (after 3s)
const STATES = {
  idle:        { label: 'Export PDF',    Icon: Download,      bg: 'linear-gradient(135deg,#7C5CFC,#0098FF)', border: 'transparent', textColor: '#fff', showBar: false },
  generating:  { label: 'Building…',    Icon: Loader2,        bg: 'linear-gradient(135deg,#3A2F7A,#00528A)', border: 'transparent', textColor: '#fff', showBar: true  },
  downloading: { label: 'Downloading…', Icon: FileDown,       bg: 'linear-gradient(135deg,#3A2F7A,#00528A)', border: 'transparent', textColor: '#fff', showBar: true  },
  success:     { label: 'Downloaded!',  Icon: CheckCircle2,   bg: 'linear-gradient(135deg,#00C48C,#00A870)', border: 'transparent', textColor: '#fff', showBar: false },
};

export default function DownloadButton({ data, disabled }) {
  const [phase, setPhase]     = useState('idle');
  const [barPct, setBarPct]   = useState(0);
  const timerRef              = useRef(null);

  // Cleanup on unmount
  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleClick = async () => {
    if (phase !== 'idle' || !data) return;

    // Phase 1: generating
    setPhase('generating');
    setBarPct(0);

    // Animate bar from 0 → 40% while PDF is built
    let pct = 0;
    timerRef.current = setInterval(() => {
      pct = Math.min(pct + 2, 40);
      setBarPct(pct);
    }, 30);

    try {
      await new Promise(r => setTimeout(r, 50)); // let React repaint
      generatePDF(data);
    } catch (e) {
      console.error('PDF generation failed', e);
      clearInterval(timerRef.current);
      setPhase('idle');
      setBarPct(0);
      return;
    }

    // Phase 2: downloading animation (bar 40 → 100%)
    clearInterval(timerRef.current);
    setPhase('downloading');

    const KEYFRAMES = [
      { target: 55, delay: 120 },
      { target: 72, delay: 180 },
      { target: 88, delay: 200 },
      { target: 100, delay: 150 },
    ];

    let cur = 40;
    for (const { target, delay } of KEYFRAMES) {
      await new Promise(r => setTimeout(r, delay));
      cur = target;
      setBarPct(cur);
    }

    // Phase 3: success — log to export history
    setPhase('success');
    setBarPct(100);
    try {
      const existing = JSON.parse(localStorage.getItem('tl_exports') || '[]');
      localStorage.setItem('tl_exports', JSON.stringify([
        { id: Date.now(), date: new Date().toISOString(), label: 'Analytics Report', pages: 6 },
        ...existing,
      ].slice(0, 100)));
    } catch { /* ignore storage errors */ }

    // Phase 4: reset after 2.5s
    setTimeout(() => {
      setPhase('idle');
      setBarPct(0);
    }, 2500);
  };

  const cfg     = STATES[phase];
  const Icon    = cfg.Icon;
  const spin    = phase === 'generating';
  const isIdle  = phase === 'idle';

  return (
    <button
      onClick={handleClick}
      disabled={disabled || phase !== 'idle'}
      title="Download full analytics report as PDF"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        padding: '0 16px',
        height: '36px',
        borderRadius: '12px',
        border: 'none',
        cursor: phase === 'idle' ? 'pointer' : 'default',
        background: cfg.bg,
        color: cfg.textColor,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.01em',
        overflow: 'hidden',
        outline: 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.2s ease',
        boxShadow: isIdle ? '0 4px 14px rgba(124,92,252,0.35)' : phase === 'success' ? '0 4px 14px rgba(0,196,140,0.35)' : '0 2px 8px rgba(0,0,0,0.2)',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        minWidth: 140,
        justifyContent: 'center',
      }}
      onMouseEnter={e => { if (isIdle) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      onMouseDown={e  => { if (isIdle) e.currentTarget.style.transform = 'translateY(1px)'; }}
      onMouseUp={e    => { if (isIdle) e.currentTarget.style.transform = 'translateY(-1px)'; }}
    >
      {/* Progress bar overlay */}
      {cfg.showBar && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.18)',
            width: `${barPct}%`,
            transition: 'width 0.18s cubic-bezier(0.67,0.13,0.1,0.81)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Ripple flash on success */}
      {phase === 'success' && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.25)',
            animation: 'successFlash 0.5s ease forwards',
            pointerEvents: 'none',
            borderRadius: 'inherit',
          }}
        />
      )}

      {/* Icon */}
      <Icon
        size={15}
        strokeWidth={2}
        style={{
          flexShrink: 0,
          position: 'relative', zIndex: 1,
          animation: spin ? 'spin 1s linear infinite' : phase === 'success' ? 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
        }}
      />

      {/* Label */}
      <span style={{ position: 'relative', zIndex: 1, whiteSpace: 'nowrap' }}>
        {cfg.label}
      </span>

      <style>{`
        @keyframes successFlash {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes popIn {
          0%   { transform: scale(0.5) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.25) rotate(5deg);  opacity: 1; }
          100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
