import { Shield, RefreshCw } from 'lucide-react';

function Bar({ pct, color }) {
  const warn = pct >= 90 ? '#FF4D7E' : pct >= 75 ? '#F5A623' : color;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-[#F0F2F7] rounded-full overflow-hidden">
        <div className="h-full rounded-full progress-bar-inner"
             style={{ width: `${Math.min(pct, 100)}%`, background: warn }} />
      </div>
      <span className="text-xs font-mono font-bold w-10 text-right"
            style={{ color: warn }}>{pct}%</span>
    </div>
  );
}

export default function PlanLimits({ planUsage, loading }) {
  if (loading) return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      {[1,2,3].map(i => <div key={i} className="shimmer-bg h-12 rounded-2xl mb-3" />)}
    </div>
  );

  const { plan, limits, weeklyUsed, weeklyPct, sessionUsed, sessionPct, opusPct, resetLabel } = planUsage;
  const fmtM = n => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : `${(n/1000).toFixed(0)}K`;

  return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#E5DCFF' }}>
            <Shield size={15} style={{ color: '#7C5CFC' }} />
          </div>
          <p className="text-sm font-semibold text-[#1A1E2E]">Plan Usage Limits</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ background: limits.color }}>{plan}</span>
        </div>
      </div>

      {/* Current session */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <p className="text-sm font-medium text-[#1A1E2E]">Current session</p>
            <p className="text-xs text-muted">Resets on new session</p>
          </div>
          <p className="text-xs font-mono text-muted">{fmtM(sessionUsed)} / {fmtM(limits.sessionLimit)}</p>
        </div>
        <Bar pct={sessionPct} color="#00C48C" />
      </div>

      <div className="h-px bg-border mb-4" />

      {/* Weekly limits */}
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Weekly limits</p>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <p className="text-sm font-medium text-[#1A1E2E]">All models</p>
            <div className="flex items-center gap-1">
              <RefreshCw size={10} className="text-muted" />
              <p className="text-xs text-muted">Resets Sun 4:00 AM · {resetLabel} left</p>
            </div>
          </div>
          <p className="text-xs font-mono text-muted">{fmtM(weeklyUsed)} / {fmtM(limits.weeklyAll)}</p>
        </div>
        <Bar pct={weeklyPct} color="#7C5CFC" />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <p className="text-sm font-medium text-[#1A1E2E]">Claude Opus 4</p>
            <p className="text-xs text-muted">Premium model sub-limit</p>
          </div>
          <p className="text-xs font-mono text-muted">{opusPct}% used</p>
        </div>
        <Bar pct={opusPct} color="#FF6B9D" />
      </div>

      {weeklyPct >= 75 && (
        <div className="mt-3 rounded-2xl px-3 py-2.5 flex items-start gap-2"
             style={{ background: weeklyPct >= 90 ? '#FFD6E0' : '#FFF0C2' }}>
          <span className="text-base mt-0.5">{weeklyPct >= 90 ? '🚨' : '⚠️'}</span>
          <div>
            <p className="text-xs font-semibold" style={{ color: weeklyPct >= 90 ? '#A3002D' : '#8A5A00' }}>
              {weeklyPct >= 90 ? 'Critical: approaching limit' : 'Heads up: high weekly usage'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: weeklyPct >= 90 ? '#A3002D99' : '#8A5A0099' }}>
              Switch to Haiku for non-critical tasks to preserve budget.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
