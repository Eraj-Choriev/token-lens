import { MODEL_META } from '../data/mockData';

function timeAgo(mins) {
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function RecentRequests({ data, loading }) {
  if (loading) {
    return (
      <div className="card-solid rounded-3xl p-5">
        <div className="shimmer-bg h-4 w-32 rounded mb-4" />
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex gap-3 mb-3">
            <div className="shimmer-bg h-8 w-8 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <div className="shimmer-bg h-3 w-3/4 rounded mb-1" />
              <div className="shimmer-bg h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.45s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[#1A1E2E]">Recent Requests</p>
        <span className="text-xs text-muted font-medium">{data?.length} shown</span>
      </div>
      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[340px] pr-1 custom-scroll">
        {data?.map((req, i) => {
          const meta = MODEL_META[req.model];
          return (
            <div
              key={req.id}
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#F8F9FC] transition-colors duration-150 cursor-default"
            >
              {/* Task color dot */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: req.task.bg }}>
                <div className="w-2 h-2 rounded-full" style={{ background: req.task.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#1A1E2E] truncate">{req.task.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                        style={{ background: meta?.bg, color: meta?.color }}>
                    {meta?.short}
                  </span>
                </div>
                <p className="text-[11px] text-muted mt-0.5 font-mono">
                  {(req.total / 1000).toFixed(1)}K tok · ${req.cost.toFixed(4)}
                </p>
              </div>

              <span className="text-[11px] text-muted flex-shrink-0">{timeAgo(req.minsAgo)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
