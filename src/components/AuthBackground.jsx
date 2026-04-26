import { useState, useEffect, useRef } from 'react';

const C = {
  purple: '#7C5CFC',
  blue:   '#0098FF',
  mint:   '#00C48C',
  orange: '#F97316',
  rose:   '#FF3D71',
  sky:    '#38BDF8',
};

/* Animated counter that counts up from 0 to `to` */
function Counter({ to, prefix = '', suffix = '', delay = 0 }) {
  const [val, setVal] = useState(0);
  const frame = useRef();
  useEffect(() => {
    const t = setTimeout(() => {
      let start = null;
      const dur = 2400;
      const tick = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const ease = 1 - (1 - p) ** 3;
        setVal(Math.round(to * ease));
        if (p < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(frame.current); };
  }, [to, delay]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

/* Bar data: height, animation min scale, duration, delay */
const BARS = [
  { h: 50, min: 0.28, dur: 2.1, d: 0.0  },
  { h: 78, min: 0.50, dur: 2.6, d: 0.25 },
  { h: 42, min: 0.35, dur: 2.9, d: 0.5  },
  { h: 90, min: 0.55, dur: 2.3, d: 0.15 },
  { h: 58, min: 0.32, dur: 3.0, d: 0.7  },
  { h: 95, min: 0.60, dur: 2.5, d: 0.35 },
  { h: 66, min: 0.42, dur: 2.8, d: 0.55 },
  { h: 80, min: 0.48, dur: 2.2, d: 0.1  },
];

const BARS2 = [
  { h: 60, min: 0.40, dur: 2.4, d: 0.2  },
  { h: 38, min: 0.30, dur: 2.7, d: 0.0  },
  { h: 72, min: 0.52, dur: 2.1, d: 0.45 },
  { h: 45, min: 0.35, dur: 3.1, d: 0.6  },
  { h: 85, min: 0.58, dur: 2.3, d: 0.15 },
  { h: 55, min: 0.38, dur: 2.9, d: 0.75 },
];

const PILLS = [
  { counter: 128400, prefix: '', suffix: '', label: 'tokens today',  color: C.purple, pos: { top: '10%',    right: '7%'    }, delay: 0   },
  { counter: 247,    prefix: '', suffix: '',  label: 'API requests',  color: C.blue,   pos: { top: '38%',    left: '3%'     }, delay: 300 },
  { counter: 98,     prefix: '', suffix: '%', label: 'efficiency',    color: C.mint,   pos: { bottom: '22%', right: '4%'    }, delay: 150 },
  { counter: 84,     prefix: '$', suffix: '', label: "today's spend", color: C.orange, pos: { bottom: '12%', left: '5%'     }, delay: 450 },
];

/* Build per-bar keyframe CSS */
const barKeyframes = [...BARS, ...BARS2].map((b, i) => `
  @keyframes ab${i} {
    0%,100% { transform: scaleY(1); }
    50%     { transform: scaleY(${b.min}); }
  }
`).join('');

export default function AuthBackground() {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>

      {/* ── Rich gradient base ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(145deg,#EEF2FF 0%,#F0EEFF 18%,#E8F5FF 36%,#EDFFF8 55%,#FFF5EB 75%,#FFF0F8 100%)',
      }} />

      {/* ── 4 large colorful orbs ── */}
      <div style={{ position:'absolute', top:'-18%',   left:'-10%', width:640, height:640, borderRadius:'50%', background:`radial-gradient(circle,${C.purple}28 0%,transparent 62%)`, animation:'ao1 18s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:'-14%', right:'-8%', width:580, height:580, borderRadius:'50%', background:`radial-gradient(circle,${C.blue}22 0%,transparent 62%)`,   animation:'ao2 22s ease-in-out infinite' }} />
      <div style={{ position:'absolute', top:'35%',    right:'-6%', width:440, height:440, borderRadius:'50%', background:`radial-gradient(circle,${C.mint}20 0%,transparent 62%)`,   animation:'ao3 16s ease-in-out infinite 2s' }} />
      <div style={{ position:'absolute', bottom:'2%',  left:'-4%',  width:380, height:380, borderRadius:'50%', background:`radial-gradient(circle,${C.orange}16 0%,transparent 62%)`, animation:'ao4 20s ease-in-out infinite 1s' }} />

      {/* ── Animated bar chart — bottom right (purple/blue gradient bars) ── */}
      <svg style={{ position:'absolute', right:'7%', bottom:'6%', opacity:0.28 }} width="220" height="130" viewBox="0 0 220 130">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.purple}/><stop offset="100%" stopColor={C.blue}/>
          </linearGradient>
          <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.mint}/><stop offset="100%" stopColor={C.sky}/>
          </linearGradient>
        </defs>
        {BARS.map((b, i) => (
          <rect
            key={i}
            x={i * 26 + 3}
            y={130 - b.h}
            width="18"
            height={b.h}
            rx="5"
            fill={i % 2 === 0 ? 'url(#bg1)' : 'url(#bg2)'}
            style={{ transformBox:'fill-box', transformOrigin:'bottom center', animation:`ab${i} ${b.dur}s ease-in-out infinite ${b.d}s` }}
          />
        ))}
        <line x1="0" y1="129" x2="220" y2="129" stroke={C.purple} strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4,4"/>
      </svg>

      {/* ── Animated bar chart — top left (orange/rose) ── */}
      <svg style={{ position:'absolute', left:'4%', bottom:'8%', opacity:0.22 }} width="160" height="100" viewBox="0 0 160 100">
        <defs>
          <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.orange}/><stop offset="100%" stopColor={C.rose}/>
          </linearGradient>
        </defs>
        {BARS2.map((b, i) => (
          <rect
            key={i}
            x={i * 24 + 3}
            y={100 - b.h}
            width="16"
            height={b.h}
            rx="4"
            fill="url(#bg3)"
            style={{ transformBox:'fill-box', transformOrigin:'bottom center', animation:`ab${BARS.length + i} ${b.dur}s ease-in-out infinite ${b.d}s` }}
          />
        ))}
      </svg>

      {/* ── Animated line / area chart — top left ── */}
      <svg style={{ position:'absolute', left:'3%', top:'6%', opacity:0.22 }} width="280" height="110" viewBox="0 0 280 110">
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.purple} stopOpacity="0.45"/>
            <stop offset="100%" stopColor={C.purple} stopOpacity="0.03"/>
          </linearGradient>
          <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.mint} stopOpacity="0.35"/>
            <stop offset="100%" stopColor={C.mint} stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {/* Purple area line */}
        <path d="M0,82 C35,65 55,42 90,50 C125,58 145,18 195,22 C225,25 252,38 280,30"
          fill="none" stroke={C.purple} strokeWidth="2.8" strokeLinecap="round"
          style={{ animation: 'lineFloat 5s ease-in-out infinite' }}
        />
        <path d="M0,82 C35,65 55,42 90,50 C125,58 145,18 195,22 C225,25 252,38 280,30 L280,110 L0,110 Z"
          fill="url(#lg1)" style={{ animation: 'lineFloat 5s ease-in-out infinite' }}
        />
        {/* Mint secondary line */}
        <path d="M0,90 C40,72 62,58 95,62 C128,66 148,34 200,38 C230,41 255,50 280,44"
          fill="none" stroke={C.mint} strokeWidth="2" strokeLinecap="round"
          style={{ animation: 'lineFloat 6.5s ease-in-out infinite 1.2s' }}
        />
        <path d="M0,90 C40,72 62,58 95,62 C128,66 148,34 200,38 C230,41 255,50 280,44 L280,110 L0,110 Z"
          fill="url(#lg2)" style={{ animation: 'lineFloat 6.5s ease-in-out infinite 1.2s' }}
        />
        {/* Data points */}
        {[{x:90,y:50},{x:145,y:18},{x:195,y:22},{x:252,y:38}].map((p,i)=>(
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={C.purple} opacity="0.6"
            style={{ animation:`dotPulse 2.5s ease-in-out infinite ${i*0.4}s` }}
          />
        ))}
      </svg>

      {/* ── Second line chart — top right ── */}
      <svg style={{ position:'absolute', right:'5%', top:'6%', opacity:0.18 }} width="200" height="80" viewBox="0 0 200 80">
        <defs>
          <linearGradient id="lg3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.blue} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={C.blue} stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        <path d="M0,62 C25,50 40,32 65,38 C90,44 108,14 145,18 C168,21 185,30 200,24"
          fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round"
          style={{ animation: 'lineFloat 4.5s ease-in-out infinite 0.8s' }}
        />
        <path d="M0,62 C25,50 40,32 65,38 C90,44 108,14 145,18 C168,21 185,30 200,24 L200,80 L0,80 Z"
          fill="url(#lg3)" style={{ animation: 'lineFloat 4.5s ease-in-out infinite 0.8s' }}
        />
      </svg>

      {/* ── Mini donut ring ── */}
      <svg style={{ position:'absolute', top:'28%', left:'3%', opacity:0.28 }} width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="34" fill="none" stroke={C.purple} strokeWidth="12" strokeOpacity="0.15"/>
        <circle cx="50" cy="50" r="34" fill="none" stroke={C.purple} strokeWidth="12"
          strokeDasharray="213" strokeDashoffset="55" strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ animation:'ringAnim 3s ease-in-out infinite' }}
        />
        <circle cx="50" cy="50" r="21" fill="none" stroke={C.mint} strokeWidth="9" strokeOpacity="0.15"/>
        <circle cx="50" cy="50" r="21" fill="none" stroke={C.mint} strokeWidth="9"
          strokeDasharray="132" strokeDashoffset="40" strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ animation:'ringAnim 3.8s ease-in-out infinite 0.6s' }}
        />
        <circle cx="50" cy="50" r="8" fill="none" stroke={C.orange} strokeWidth="6" strokeOpacity="0.15"/>
        <circle cx="50" cy="50" r="8" fill="none" stroke={C.orange} strokeWidth="6"
          strokeDasharray="50" strokeDashoffset="18" strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ animation:'ringAnim 4.5s ease-in-out infinite 1.2s' }}
        />
      </svg>

      {/* ── Floating metric cards with animated counters ── */}
      {PILLS.map((pill, i) => (
        <div key={i} style={{
          position: 'absolute', ...pill.pos,
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.96)',
          borderRadius: 13, padding: '9px 16px 9px 20px',
          boxShadow: `0 6px 28px ${pill.color}1A, 0 2px 8px rgba(0,0,0,0.06)`,
          animation: `floatCard ${12 + i * 2.5}s ease-in-out infinite ${i * 1.4}s`,
          minWidth: 110,
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
            background: pill.color, borderRadius: '13px 0 0 13px',
          }} />
          <p style={{
            fontSize: 16, fontWeight: 800, color: pill.color, margin: 0,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.025em',
            fontFamily: 'ui-monospace, monospace',
          }}>
            <Counter to={pill.counter} prefix={pill.prefix} suffix={pill.suffix} delay={pill.delay} />
          </p>
          <p style={{ fontSize: 10.5, color: '#8B95A8', margin: 0, fontWeight: 500, marginTop: 1 }}>
            {pill.label}
          </p>
        </div>
      ))}

      {/* ── Dot grid ── */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.045 }}>
        <defs>
          <pattern id="authGrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#7C5CFC"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#authGrid)"/>
      </svg>

      {/* ── Diagonal accent line ── */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.04 }}>
        <line x1="0" y1="100%" x2="100%" y2="0" stroke={C.purple} strokeWidth="1.5" strokeDasharray="8,12"/>
        <line x1="-5%" y1="110%" x2="95%" y2="-10%" stroke={C.blue} strokeWidth="1" strokeDasharray="6,16"/>
      </svg>

      <style>{`
        @keyframes ao1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(25px,-30px) scale(1.06)} 66%{transform:translate(-18px,20px) scale(0.96)} }
        @keyframes ao2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-20px,25px) scale(1.04)} 66%{transform:translate(15px,-18px) scale(0.97)} }
        @keyframes ao3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-22px,-20px) scale(1.05)} }
        @keyframes ao4 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-15px) scale(1.03)} }
        @keyframes lineFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes dotPulse {
          0%,100% { r: 4; opacity: 0.6; }
          50%      { r: 6; opacity: 1;   }
        }
        @keyframes ringAnim {
          0%,100% { stroke-dashoffset: 55; }
          50%      { stroke-dashoffset: 150; }
        }
        @keyframes floatCard {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%      { transform: translateY(-10px) rotate(0.4deg); }
          75%      { transform: translateY(-5px) rotate(-0.4deg); }
        }
        @keyframes cardIn { from{opacity:0;transform:translateY(22px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes orbA   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
        @keyframes tlSpin { to{transform:rotate(360deg)} }
        ${barKeyframes}
      `}</style>
    </div>
  );
}
