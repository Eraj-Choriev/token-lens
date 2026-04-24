import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function useCountUp(target, duration = 900) {
  const [display, setDisplay] = useState(0);
  const frame = useRef(null);
  const prev  = useRef(0);

  useEffect(() => {
    if (target === null || target === undefined) return;
    cancelAnimationFrame(frame.current);
    const start     = performance.now();
    const fromValue = prev.current;

    const step = (now) => {
      const pct  = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setDisplay(fromValue + (target - fromValue) * ease);
      if (pct < 1) frame.current = requestAnimationFrame(step);
      else prev.current = target;
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return display;
}

function fmt(n, type) {
  if (type === 'currency') return `$${n.toFixed(2)}`;
  if (type === 'tokens') {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
    return Math.round(n).toString();
  }
  if (type === 'requests') return Math.round(n).toLocaleString();
  return Math.round(n).toString();
}

export default function StatCard({
  label, value, valueType = 'tokens', icon: Icon,
  accent = 'mint', delta, sub, delay = 0, loading = false,
}) {
  const animated = useCountUp(loading ? 0 : value);

  const accentMap = {
    mint:     { bg: '#C6F6E8', color: '#00C48C', text: '#007A5A' },
    sky:      { bg: '#C3E8FF', color: '#0098FF', text: '#005FA3' },
    peach:    { bg: '#FFE0CC', color: '#FF7A40', text: '#B34E1C' },
    lavender: { bg: '#E5DCFF', color: '#7C5CFC', text: '#4A2FC4' },
    yellow:   { bg: '#FFF0C2', color: '#F5A623', text: '#8A5A00' },
    rose:     { bg: '#FFD6E0', color: '#FF4D7E', text: '#A3002D' },
  };
  const a = accentMap[accent] || accentMap.mint;

  if (loading) {
    return (
      <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: `${delay}s` }}>
        <div className="shimmer-bg h-4 w-24 rounded mb-4" />
        <div className="shimmer-bg h-8 w-32 rounded mb-2" />
        <div className="shimmer-bg h-3 w-16 rounded" />
      </div>
    );
  }

  return (
    <div
      className="card-solid rounded-3xl p-5 group hover:shadow-card-hover transition-all duration-300 cursor-default animate-fade-up"
      style={{ animationDelay: `${delay}s`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-muted text-sm font-medium">{label}</p>
        {Icon && (
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
               style={{ background: a.bg }}>
            <Icon size={16} style={{ color: a.color }} />
          </div>
        )}
      </div>

      <p className="font-display text-3xl font-bold text-[#1A1E2E] tracking-tight leading-none mb-1">
        {fmt(animated, valueType)}
      </p>

      <div className="flex items-center gap-2 mt-2">
        {delta !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${delta >= 0 ? 'bg-[#C6F6E8] text-[#007A5A]' : 'bg-[#FFD6E0] text-[#A3002D]'}`}>
            {delta >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(delta)}%
          </span>
        )}
        {sub && <p className="text-xs text-muted">{sub}</p>}
      </div>
    </div>
  );
}
