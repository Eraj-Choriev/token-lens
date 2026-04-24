import { useState, useEffect } from 'react';
import { Clock, Cpu, Zap, Hash } from 'lucide-react';
import { MODEL_META } from '../data/mockData';

function useElapsed(isoTime) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!isoTime) return;
    const start = new Date(isoTime).getTime();
    const tick  = () => setSecs(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isoTime]);
  return secs;
}

function fmtTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function SessionCard({ session, loading }) {
  const elapsed = useElapsed(session?.startTime);

  if (loading) {
    return (
      <div className="card-solid rounded-3xl p-5">
        <div className="shimmer-bg h-4 w-28 rounded mb-4" />
        <div className="shimmer-bg h-8 w-40 rounded mb-3" />
        <div className="shimmer-bg h-3 w-full rounded mb-2" />
        <div className="shimmer-bg h-3 w-3/4 rounded" />
      </div>
    );
  }

  const meta  = MODEL_META[session?.model] || MODEL_META['claude-sonnet-4-6'];
  const pct   = Math.min(100, Math.round(session.totalTokens / 200000 * 100));

  return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="dot-live" />
          <span className="text-sm font-semibold text-[#1A1E2E]">Current Session</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#F0F2F7] rounded-full px-3 py-1">
          <Clock size={11} className="text-muted" />
          <span className="text-xs font-mono text-muted">{fmtTime(elapsed)}</span>
        </div>
      </div>

      {/* Model badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: meta.bg, color: meta.color }}>
          {meta.label}
        </span>
      </div>

      {/* Big number */}
      <p className="font-display text-4xl font-bold text-[#1A1E2E] tracking-tight leading-none mb-1">
        {(session.totalTokens / 1000).toFixed(1)}K
      </p>
      <p className="text-sm text-muted mb-4">tokens this session</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted">Context window</span>
          <span className="text-xs font-semibold text-[#1A1E2E]">{pct}%</span>
        </div>
        <div className="h-2 bg-[#F0F2F7] rounded-full overflow-hidden">
          <div className="h-full rounded-full progress-bar-inner"
               style={{ width: `${pct}%`, background: `linear-gradient(90deg, #7C5CFC, #00C48C)` }} />
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Hash,  label: 'Requests', val: session.requests },
          { icon: Zap,   label: 'In / Out',  val: `${(session.inputTokens/1000).toFixed(0)}K / ${(session.outputTokens/1000).toFixed(0)}K` },
          { icon: Cpu,   label: 'Cost',      val: `$${session.cost.toFixed(3)}` },
        ].map(({ icon: Icon, label, val }) => (
          <div key={label} className="bg-[#F8F9FC] rounded-2xl p-2.5 text-center">
            <Icon size={13} className="text-muted mx-auto mb-1" />
            <p className="text-[11px] font-mono font-semibold text-[#1A1E2E] leading-tight">{val}</p>
            <p className="text-[10px] text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
