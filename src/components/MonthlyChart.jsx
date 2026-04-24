import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AXIS_COLOR = '#8B95A8';
const GRID_COLOR = '#E4E8F0';

export default function MonthlyChart({ data, loading }) {
  if (loading) return <div className="shimmer-bg rounded-2xl h-full min-h-[220px]" />;

  const total = data?.reduce((s, d) => s + d.tokens, 0) ?? 0;
  const totalCost = data?.reduce((s, d) => s + d.cost, 0) ?? 0;
  const avgDaily = total / (data?.length || 1);

  return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[#1A1E2E]">Monthly Token Overview</p>
          <p className="text-xs text-muted mt-0.5">Last 30 days · all models</p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl font-bold text-[#1A1E2E]">
            {total >= 1_000_000 ? `${(total/1_000_000).toFixed(1)}M` : `${(total/1000).toFixed(0)}K`}
          </p>
          <p className="text-xs text-muted">total · ${totalCost.toFixed(2)}</p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { label: 'Daily avg', val: `${(avgDaily/1000).toFixed(0)}K tok` },
          { label: 'Peak day',  val: `${(Math.max(...(data?.map(d=>d.tokens)??[0]))/1000).toFixed(0)}K tok` },
          { label: 'Month cost', val: `$${totalCost.toFixed(2)}` },
        ].map(c => (
          <span key={c.label} className="text-[11px] bg-[#F0F2F7] rounded-full px-2.5 py-1 text-muted">
            <span className="font-medium text-[#1A1E2E]">{c.val}</span> {c.label}
          </span>
        ))}
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#7C5CFC" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: AXIS_COLOR, fontSize: 10 }} axisLine={false} tickLine={false}
                   interval={4} />
            <YAxis tick={{ fill: AXIS_COLOR, fontSize: 10 }} axisLine={false} tickLine={false}
                   tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                return (
                  <div className="bg-[rgba(13,15,20,0.92)] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
                    <p className="text-[#9CABC4] text-xs mb-1">{label}</p>
                    <p className="text-white text-sm">{(d.tokens/1000).toFixed(1)}K tokens</p>
                    <p className="text-[#00C48C] text-xs">${d.cost.toFixed(3)} cost</p>
                  </div>
                );
              }}
            />
            <Area type="monotone" dataKey="tokens" stroke="#7C5CFC" strokeWidth={2.5}
                  fill="url(#monthGrad)" dot={false} activeDot={{ r: 4, fill: '#7C5CFC' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
