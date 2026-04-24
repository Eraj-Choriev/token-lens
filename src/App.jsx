import { useState, useCallback } from 'react';
import { Zap, DollarSign, Hash, TrendingUp, BarChart2, MessageSquare, BellRing } from 'lucide-react';
import Sidebar               from './components/Sidebar';
import Header                from './components/Header';
import StatCard              from './components/StatCard';
import SessionCard           from './components/SessionCard';
import TaskBreakdown         from './components/TaskBreakdown';
import RecentRequests        from './components/RecentRequests';
import PlanLimits            from './components/PlanLimits';
import AnalyticsView         from './views/AnalyticsView';
import ToastNotifications, { useToasts } from './components/ToastNotifications';
import { WeeklyUsageChart, HourlyChart, CostBarChart } from './components/Charts';
import { useTokenData }      from './hooks/useTokenData';
import { useNotifications }  from './hooks/useNotifications';
import { MODEL_META }        from './data/mockData';

function fmt(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}


export default function App() {
  const [activeNav, setActiveNav]       = useState('dashboard');
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifPermission, setNotifPermission] = useState('granted'); // in-app, no browser permission needed

  const { data, loading, refreshing, lastUpdated, refresh } = useTokenData();
  const { toasts, addToast, removeToast } = useToasts();

  // In-app: no browser permission needed — just use the addToast callback
  const handleRequestNotif = useCallback(async () => {
    setNotifPermission('granted');
    setNotifEnabled(true);
    addToast({ title: 'Notifications enabled', body: 'You\'ll be alerted at 50%, 75%, 90% and 100% of plan limits.', urgency: 'info' });
  }, [addToast]);

  const handleToggleNotif = useCallback(() => {
    const next = !notifEnabled;
    setNotifEnabled(next);
    addToast({
      title:   next ? 'Notifications on' : 'Notifications muted',
      body:    next ? 'You will receive in-app alerts and voice notifications.' : 'All alerts are silenced. Toggle the bell to re-enable.',
      urgency: next ? 'info' : 'warning',
    });
  }, [notifEnabled, addToast]);

  useNotifications(data?.planUsage, notifEnabled, addToast);

  const s = data?.stats;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar
        active={activeNav}
        onChange={setActiveNav}
        planUsage={data?.planUsage}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Global in-app toast portal */}
      <ToastNotifications toasts={toasts} onDismiss={removeToast} />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 min-w-0">
        <div className="max-w-[1200px] mx-auto">
          <Header
            lastUpdated={lastUpdated}
            refreshing={refreshing}
            onRefresh={refresh}
            notifPermission={notifPermission}
            notifEnabled={notifEnabled}
            onToggleNotif={handleToggleNotif}
            onRequestNotif={handleRequestNotif}
            activeView={activeNav}
            data={data}
            onMenuOpen={() => setMobileOpen(true)}
          />

          {/* Analytics view */}
          {activeNav === 'analytics' && (
            <AnalyticsView data={data} loading={loading} />
          )}

          {/* Dashboard view */}
          {activeNav === 'dashboard' && <>

          {/* Row 1: Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-5">
            <StatCard label="Tokens Today"    value={s?.today?.tokens ?? 0}       valueType="tokens"   icon={Zap}          accent="lavender" delta={12} sub="vs yesterday" delay={0.05} loading={loading} />
            <StatCard label="Weekly Tokens"   value={s?.week?.tokens ?? 0}        valueType="tokens"   icon={TrendingUp}   accent="sky"      delta={8}  sub="this week"    delay={0.10} loading={loading} />
            <StatCard label="Today's Spend"   value={s?.today?.cost ?? 0}         valueType="currency" icon={DollarSign}   accent="peach"    delta={-3} sub="vs yesterday" delay={0.15} loading={loading} />
            <StatCard label="Requests Today"  value={s?.today?.requests ?? 0}     valueType="requests" icon={Hash}         accent="mint"     delta={5}  sub="API calls"    delay={0.20} loading={loading} />
          </div>

          {/* Row 2: More stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-5">
            <StatCard label="Avg Tokens/Req"  value={s?.avgTokensPerRequest ?? 0} valueType="tokens"   icon={MessageSquare} accent="yellow" sub="per request"  delay={0.25} loading={loading} />
            <StatCard label="Weekly Spend"    value={s?.week?.cost ?? 0}          valueType="currency" icon={DollarSign}   accent="rose"     delta={-7} sub="7-day total" delay={0.30} loading={loading} />
            <StatCard label="All-Time Tokens" value={s?.allTime?.tokens ?? 0}     valueType="tokens"   icon={BarChart2}    accent="sky"               sub="lifetime"    delay={0.35} loading={loading} />
            <StatCard label="Efficiency"      value={s?.efficiency ?? 0}          valueType="requests" icon={TrendingUp}   accent="mint"     delta={2}  sub="output ratio" delay={0.40} loading={loading} />
          </div>

          {/* Row 3: Weekly chart + Session */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 mb-4 lg:mb-5">
            <div className="lg:col-span-7 card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-[#1A1E2E]">Weekly Token Usage</p>
                  <p className="text-xs text-muted mt-0.5">Input vs Output · last 7 days</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted"><span className="w-3 h-1.5 rounded-full bg-[#7C5CFC] inline-block" />Input</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted"><span className="w-3 h-1.5 rounded-full bg-[#00C48C] inline-block" />Output</span>
                </div>
              </div>
              <div className="h-[220px]">
                <WeeklyUsageChart data={data?.weekly} loading={loading} />
              </div>
            </div>
            <div className="lg:col-span-5">
              <SessionCard session={data?.session} loading={loading} />
            </div>
          </div>

          {/* Row 4: Hourly + Task breakdown + Recent */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 mb-4 lg:mb-5">
            <div className="lg:col-span-5 card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-[#1A1E2E]">Today by Hour</p>
                <span className="text-xs text-muted">06:00 – 22:00</span>
              </div>
              <div className="h-[200px]">
                <HourlyChart data={data?.hourly} loading={loading} />
              </div>
            </div>
            <div className="lg:col-span-4">
              <TaskBreakdown data={data?.taskBreakdown} loading={loading} />
            </div>
            <div className="lg:col-span-3">
              <RecentRequests data={data?.recentRequests?.slice(0, 6)} loading={loading} />
            </div>
          </div>

          {/* Row 5: Daily cost + Plan limits */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 mb-4 lg:mb-5">
            <div className="lg:col-span-7 card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.40s', opacity: 0, animationFillMode: 'forwards' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-[#1A1E2E]">Daily Spend</p>
                <p className="text-xs text-muted">7-day cost breakdown</p>
              </div>
              <div className="h-[200px]">
                <CostBarChart data={data?.weekly} loading={loading} />
              </div>
            </div>
            <div className="lg:col-span-5">
              <PlanLimits planUsage={data?.planUsage} loading={loading} />
            </div>
          </div>

          {/* Row 6: Full request table */}
          <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.50s', opacity: 0, animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#1A1E2E]">Request History</p>
              <span className="text-xs text-muted">Last {data?.recentRequests?.length ?? '—'} requests</span>
            </div>
            {loading ? (
              <div className="flex flex-col gap-2">{[1,2,3,4,5].map(i=><div key={i} className="shimmer-bg h-10 rounded-xl"/>)}</div>
            ) : (
              <div className="overflow-x-auto -mx-1">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="text-muted text-xs font-semibold">
                      {['Task','Model','Input','Output','Total','Cost','Time'].map(h=>(
                        <th key={h} className="text-left py-2 px-3 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentRequests?.map((req, i) => {
                      const meta = MODEL_META[req.model];
                      return (
                        <tr key={req.id} className={`border-t border-border/50 hover:bg-[#F8F9FC] transition-colors duration-100 ${i%2===0?'':'bg-[#FAFBFC]'}`}>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: req.task.color }} />
                              <span className="font-medium text-[#1A1E2E] truncate max-w-[120px]">{req.task.label}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: meta?.bg, color: meta?.color }}>{meta?.short}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-muted">{fmt(req.input)}</td>
                          <td className="py-2.5 px-3 font-mono text-muted">{fmt(req.output)}</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-[#1A1E2E]">{fmt(req.total)}</td>
                          <td className="py-2.5 px-3 font-mono text-[#00C48C] font-medium">${req.cost.toFixed(4)}</td>
                          <td className="py-2.5 px-3 text-muted text-xs">{req.minsAgo < 1 ? 'just now' : `${req.minsAgo}m ago`}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted mt-6 pb-4">
            TokenLens · Powered by Claude API · Auto-refreshes every 60s
          </p>
          </> }{/* end dashboard */}
        </div>
      </main>
    </div>
  );
}
