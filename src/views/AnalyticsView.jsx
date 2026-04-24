import StatCard        from '../components/StatCard';
import MonthlyChart    from '../components/MonthlyChart';
import ProjectBreakdown from '../components/ProjectBreakdown';
import SkillsCard      from '../components/SkillsCard';
import EfficiencyAdvisor from '../components/EfficiencyAdvisor';
import PlanLimits      from '../components/PlanLimits';
import { MODEL_META }  from '../data/mockData';
import { BarChart2, DollarSign, Hash, TrendingUp } from 'lucide-react';

export default function AnalyticsView({ data, loading }) {
  const s = data?.stats;

  return (
    <div>
      {/* Month summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-5">
        <StatCard label="Month Tokens"   value={s?.month?.tokens ?? 0} valueType="tokens"   icon={BarChart2}  accent="lavender" sub="30-day total"  delay={0.05} loading={loading} />
        <StatCard label="Month Spend"    value={s?.month?.cost   ?? 0} valueType="currency" icon={DollarSign} accent="peach"    sub="30-day total"  delay={0.10} loading={loading} />
        <StatCard label="Month Requests" value={s?.month?.requests ?? 0} valueType="requests" icon={Hash}    accent="sky"      sub="API calls"      delay={0.15} loading={loading} />
        <StatCard label="Avg / Request"  value={s?.avgTokensPerRequest ?? 0} valueType="tokens" icon={TrendingUp} accent="mint" sub="avg tokens"   delay={0.20} loading={loading} />
      </div>

      {/* Monthly chart — full width */}
      <div className="mb-5">
        <MonthlyChart data={data?.monthly} loading={loading} />
      </div>

      {/* Project breakdown + Model deep dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 mb-5">
        <ProjectBreakdown data={data?.projects} loading={loading} />

        {/* Model comparison */}
        <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}>
          <p className="text-sm font-semibold text-[#1A1E2E] mb-1">Model Usage Breakdown</p>
          <p className="text-xs text-muted mb-4">Which models you rely on most</p>

          {loading ? (
            <div className="flex flex-col gap-3">{[1,2,3].map(i => <div key={i} className="shimmer-bg h-16 rounded-2xl" />)}</div>
          ) : (
            <div className="flex flex-col gap-3">
              {[
                { key: 'claude-sonnet-4-6', pct: 58, tokens: '4.2M', calls: 312, note: 'Most balanced & cost-effective' },
                { key: 'claude-opus-4-7',   pct: 28, tokens: '2.0M', calls: 89,  note: 'Complex reasoning & architecture' },
                { key: 'claude-haiku-4-5',  pct: 14, tokens: '1.0M', calls: 201, note: 'Fast completions & triaging' },
              ].map(item => {
                const meta = MODEL_META[item.key];
                return (
                  <div key={item.key} className="p-3 rounded-2xl border border-border hover:bg-[#F8F9FC] transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                           style={{ background: meta.bg }}>
                        <div className="w-3 h-3 rounded-full" style={{ background: meta.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#1A1E2E]">{meta.label}</p>
                          <span className="text-xs font-mono font-bold" style={{ color: meta.color }}>{item.pct}%</span>
                        </div>
                        <p className="text-[11px] text-muted">{item.note}</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#F0F2F7] rounded-full overflow-hidden mb-1.5">
                      <div className="h-full rounded-full progress-bar-inner"
                           style={{ width: `${item.pct}%`, background: meta.color }} />
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[11px] text-muted">{item.tokens} tokens</span>
                      <span className="text-[11px] text-muted">·</span>
                      <span className="text-[11px] text-muted">{item.calls} calls</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Skills + Plan limits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 mb-5">
        <SkillsCard skills={data?.skills} loading={loading} />
        <PlanLimits planUsage={data?.planUsage} loading={loading} />
      </div>

      {/* Efficiency advisor — full width */}
      <div className="mb-5">
        <EfficiencyAdvisor tips={data?.efficiencyTips} loading={loading} />
      </div>
    </div>
  );
}
