import { useState } from 'react';
import { MODEL_META, TASK_CATEGORIES } from '../data/mockData';
import { Code2, PenTool, BarChart3, Search, Wand2, Package, ChevronDown } from 'lucide-react';

const TASK_ICONS = {
  coding:   Code2,
  writing:  PenTool,
  analysis: BarChart3,
  research: Search,
  creative: Wand2,
  other:    Package,
};

function timeAgo(mins) {
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function getTaskIcon(taskId) {
  return TASK_ICONS[taskId] || Package;
}

export default function RecentRequests({ data, loading }) {
  const [period, setPeriod] = useState('today');
  const [selectedModels, setSelectedModels] = useState(new Set(['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5']));
  const [selectedCategories, setSelectedCategories] = useState(new Set(TASK_CATEGORIES.map(c => c.id)));
  const [showModelFilter, setShowModelFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const toggleModel = (model) => {
    const next = new Set(selectedModels);
    if (next.has(model)) next.delete(model);
    else next.add(model);
    setSelectedModels(next);
  };

  const toggleCategory = (catId) => {
    const next = new Set(selectedCategories);
    if (next.has(catId)) next.delete(catId);
    else next.add(catId);
    setSelectedCategories(next);
  };

  const filteredData = data?.filter(req => {
    const inPeriod =
      (period === 'today' && req.minsAgo <= 1440) ||
      (period === 'yesterday' && req.minsAgo > 1440 && req.minsAgo <= 2880) ||
      (period === 'week' && req.minsAgo <= 10080) ||
      (period === 'month' && req.minsAgo <= 43200);

    const inModel = selectedModels.has(req.model);
    const inCategory = selectedCategories.has(req.task.id);

    return inPeriod && inModel && inCategory;
  }) || [];

  if (loading) {
    return (
      <div className="card-solid rounded-3xl p-5">
        <div className="shimmer-bg h-4 w-32 rounded mb-4" />
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex gap-3 mb-3">
            <div className="shimmer-bg h-9 w-9 rounded-xl flex-shrink-0" />
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
        <span className="text-xs text-muted font-medium">{filteredData?.length} shown</span>
      </div>

      {/* Period filters */}
      <div className="flex gap-2 mb-3 pb-3 border-b border-border/50 flex-wrap">
        {[
          { id: 'today', label: 'Today' },
          { id: 'yesterday', label: 'Yesterday' },
          { id: 'week', label: 'Week' },
          { id: 'month', label: 'Month' },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
              period === p.id
                ? 'bg-[#7C5CFC] text-white shadow-sm'
                : 'bg-[#F0F2F7] text-[#6B7A99] hover:bg-[#E8EAEF]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="flex gap-2 mb-4 pb-3 border-b border-border/50 flex-wrap">
        {/* Model Filter */}
        <div className="relative">
          <button
            onClick={() => setShowModelFilter(!showModelFilter)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#F0F2F7] text-[#6B7A99] hover:bg-[#E8EAEF] transition-all duration-200 flex items-center gap-1"
          >
            Models {selectedModels.size < 3 && `(${selectedModels.size})`}
            <ChevronDown size={12} />
          </button>
          {showModelFilter && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-10 p-2 min-w-[180px] animate-fade-in">
              {Object.entries(MODEL_META).map(([modelId, meta]) => (
                <label key={modelId} className="flex items-center gap-2 p-1.5 hover:bg-[#F0F2F7] rounded cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedModels.has(modelId)}
                    onChange={() => toggleModel(modelId)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-xs">{meta.short}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#F0F2F7] text-[#6B7A99] hover:bg-[#E8EAEF] transition-all duration-200 flex items-center gap-1"
          >
            Categories {selectedCategories.size < 6 && `(${selectedCategories.size})`}
            <ChevronDown size={12} />
          </button>
          {showCategoryFilter && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-10 p-2 min-w-[200px] animate-fade-in">
              {TASK_CATEGORIES.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 p-1.5 hover:bg-[#F0F2F7] rounded cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-xs">{cat.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request items */}
      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[300px] pr-1 custom-scroll">
        {filteredData?.length > 0 ? (
          filteredData.map((req, i) => {
            const meta = MODEL_META[req.model];
            const TaskIcon = getTaskIcon(req.task.id);

            return (
              <div
                key={`${req.id}-${period}-${i}`}
                className="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#F8F9FC] transition-all duration-200 cursor-default animate-fade-in"
                style={{
                  animationDelay: `${i * 40}ms`,
                  animationFillMode: 'both',
                }}
              >
                {/* Task icon background */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: req.task.bg }}
                >
                  <TaskIcon
                    size={16}
                    strokeWidth={2.2}
                    style={{ color: req.task.color }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1A1E2E] truncate">{req.task.label}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 transition-all duration-200"
                      style={{ background: meta?.bg, color: meta?.color }}
                    >
                      {meta?.short}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-0.5 font-mono">
                    {(req.total / 1000).toFixed(1)}K tok · ${req.cost.toFixed(4)}
                  </p>
                </div>

                <span className="text-[11px] text-muted flex-shrink-0 transition-colors duration-200 group-hover:text-[#7C5CFC]">
                  {timeAgo(req.minsAgo)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-muted text-xs">
            No requests matching filters
          </div>
        )}
      </div>
    </div>
  );
}
