import { INSTALLED_SKILLS } from '../data/mockData';
import { TrendingUp } from 'lucide-react';

export default function ProjectsSkills({ loading }) {
  if (loading) {
    return (
      <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.50s', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="shimmer-bg h-4 w-32 rounded mb-4" />
        {Array(4).fill(0).map((_, i) => (
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

  const sorted = [...INSTALLED_SKILLS].sort((a, b) => b.tokensUsed - a.tokensUsed);

  return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.50s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[#1A1E2E]">Projects & Skills</p>
          <p className="text-xs text-muted mt-0.5">Top installed tools</p>
        </div>
        <TrendingUp size={16} className="text-[#7C5CFC]" />
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-1 custom-scroll">
        {sorted.map((skill, i) => {
          const totalTokens = INSTALLED_SKILLS.reduce((sum, s) => sum + s.tokensUsed, 0);
          const pct = Math.round((skill.tokensUsed / totalTokens) * 100);

          return (
            <div
              key={skill.id}
              className="group p-3 rounded-2xl bg-[#F8F9FC] hover:bg-[#F0F2F7] transition-all duration-200 animate-fade-in"
              style={{
                animationDelay: `${i * 50}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="text-xl flex-shrink-0 mt-1">{skill.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#1A1E2E] truncate">{skill.name}</p>
                    <span className="text-[10px] font-mono font-bold text-[#7C5CFC] flex-shrink-0">{pct}%</span>
                  </div>
                  <p className="text-[11px] text-muted mt-1">
                    {(skill.tokensUsed / 1000).toFixed(1)}K tokens · {skill.calls} calls
                  </p>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-white/60 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#00C48C] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[10px] text-muted mt-4 pt-3 border-t border-border/50">
        {INSTALLED_SKILLS.length} tools installed
      </p>
    </div>
  );
}
