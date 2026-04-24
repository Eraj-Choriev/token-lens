import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ProjectBreakdown({ data, loading }) {
  if (loading) return (
    <div className="card-solid rounded-3xl p-5">
      <div className="shimmer-bg h-4 w-40 rounded mb-4" />
      <div className="shimmer-bg h-48 rounded-2xl" />
    </div>
  );

  const sorted = [...(data || [])].sort((a, b) => b.tokens - a.tokens);
  const total  = sorted.reduce((s, d) => s + d.tokens, 0);

  return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[#1A1E2E]">Tokens by Project Type</p>
          <p className="text-xs text-muted mt-0.5">What you use AI for most</p>
        </div>
        <span className="text-xs text-muted font-medium">
          {(total/1000).toFixed(0)}K total
        </span>
      </div>

      {/* Horizontal stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-0.5">
        {sorted.map(p => (
          <div key={p.id} className="h-full transition-all duration-700"
               style={{ width: `${p.pct}%`, background: p.color, borderRadius: 2 }}
               title={`${p.label}: ${p.pct}%`} />
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2.5">
        {sorted.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="text-xs text-muted w-4 text-right font-mono">{i+1}</span>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-sm text-[#1A1E2E] font-medium flex-1 truncate">{p.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-[#F0F2F7] rounded-full overflow-hidden">
                <div className="h-full rounded-full progress-bar-inner"
                     style={{ width: `${p.pct}%`, background: p.color }} />
              </div>
              <span className="text-xs font-mono font-bold text-[#1A1E2E] w-7 text-right">{p.pct}%</span>
              <span className="text-xs text-muted w-12 text-right font-mono">{(p.tokens/1000).toFixed(0)}K</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
