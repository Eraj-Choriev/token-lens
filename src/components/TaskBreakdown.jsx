import { TaskPieChart } from './Charts';

export default function TaskBreakdown({ data, loading }) {
  if (loading) {
    return (
      <div className="card-solid rounded-3xl p-5">
        <div className="shimmer-bg h-4 w-36 rounded mb-4" />
        <div className="shimmer-bg h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const sorted = [...(data || [])].sort((a, b) => b.pct - a.pct);

  return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards' }}>
      <p className="text-sm font-semibold text-[#1A1E2E] mb-4">Task Categories</p>

      <div className="flex gap-4">
        {/* Pie */}
        <div className="w-32 h-32 flex-shrink-0">
          <TaskPieChart data={data} loading={loading} />
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
          {sorted.slice(0, 5).map(item => (
            <div key={item.id} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-xs text-[#1A1E2E] truncate flex-1">{item.label}</span>
              <span className="text-xs font-semibold font-mono text-[#1A1E2E] flex-shrink-0">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bars */}
      <div className="mt-4 flex flex-col gap-2">
        {sorted.slice(0, 4).map(item => (
          <div key={item.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted">{item.label}</span>
              <span className="text-[11px] font-mono font-medium text-[#1A1E2E]">{item.pct}%</span>
            </div>
            <div className="h-1.5 bg-[#F0F2F7] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-bar-inner"
                style={{ width: `${item.pct}%`, background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
