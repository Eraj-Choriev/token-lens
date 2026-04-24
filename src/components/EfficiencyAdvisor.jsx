import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const IMPACT_STYLE = {
  High:   { bg: '#FFD6E0', color: '#A3002D', label: 'High impact' },
  Medium: { bg: '#FFF0C2', color: '#8A5A00', label: 'Medium impact' },
  Low:    { bg: '#C6F6E8', color: '#007A5A', label: 'Low impact' },
};

function TipCard({ tip, index }) {
  const [open, setOpen] = useState(index < 2);
  const impact = IMPACT_STYLE[tip.impact] || IMPACT_STYLE.Low;

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${tip.type === 'warning' ? 'border-[#FFD6E0]' : 'border-border'}`}
         style={{ background: tip.type === 'warning' ? '#FFFBFB' : '#FFFFFF' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-[#F8F9FC] transition-colors duration-150"
      >
        <span className="text-xl flex-shrink-0">{tip.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1A1E2E] truncate">{tip.title}</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: impact.bg, color: impact.color }}>
          {impact.label}
        </span>
        {open ? <ChevronUp size={14} className="text-muted flex-shrink-0" /> : <ChevronDown size={14} className="text-muted flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-3.5 pb-3.5">
          <p className="text-sm text-muted leading-relaxed pl-9">{tip.body}</p>
        </div>
      )}
    </div>
  );
}

export default function EfficiencyAdvisor({ tips, loading }) {
  if (loading) return (
    <div className="card-solid rounded-3xl p-5">
      <div className="shimmer-bg h-4 w-48 rounded mb-4" />
      {[1,2,3].map(i => <div key={i} className="shimmer-bg h-14 rounded-2xl mb-2" />)}
    </div>
  );

  return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#0098FF] flex items-center justify-center">
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1A1E2E]">Efficiency Advisor</p>
          <p className="text-xs text-muted">Personalized tips based on your usage</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {tips?.map((tip, i) => (
          <TipCard key={tip.id} tip={tip} index={i} />
        ))}
      </div>

      <p className="text-[11px] text-muted mt-3 text-center">
        Tips refresh with every data pull · based on real usage patterns
      </p>
    </div>
  );
}
