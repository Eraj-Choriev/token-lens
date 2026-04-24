import { Puzzle } from 'lucide-react';

export default function SkillsCard({ skills, loading }) {
  if (loading) return (
    <div className="card-solid rounded-3xl p-5">
      <div className="shimmer-bg h-4 w-32 rounded mb-4" />
      {[1,2,3,4].map(i => <div key={i} className="shimmer-bg h-12 rounded-2xl mb-2" />)}
    </div>
  );

  const totalTokens = skills?.reduce((s, sk) => s + sk.tokensUsed, 0) ?? 0;
  const sorted = [...(skills || [])].sort((a, b) => b.tokensUsed - a.tokensUsed);

  return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E5DCFF] flex items-center justify-center">
            <Puzzle size={15} className="text-[#7C5CFC]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1A1E2E]">Installed Skills</p>
            <p className="text-xs text-muted">{skills?.length} active skills</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono font-bold text-[#1A1E2E]">{(totalTokens/1000).toFixed(0)}K</p>
          <p className="text-[10px] text-muted">total used</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[280px]">
        {sorted.map((skill, i) => {
          const pct = Math.round(skill.tokensUsed / totalTokens * 100);
          return (
            <div key={skill.id} className="flex items-center gap-2.5 p-2 rounded-2xl hover:bg-[#F8F9FC] transition-colors duration-150">
              <div className="w-8 h-8 rounded-xl bg-[#F8F9FC] flex items-center justify-center text-base flex-shrink-0">
                {skill.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-xs font-semibold text-[#1A1E2E] truncate">{skill.name}</p>
                </div>
                <div className="h-1 bg-[#F0F2F7] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#0098FF] rounded-full progress-bar-inner"
                       style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[11px] font-mono font-bold text-[#1A1E2E]">{(skill.tokensUsed/1000).toFixed(0)}K</p>
                <p className="text-[10px] text-muted">{skill.calls} calls</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
