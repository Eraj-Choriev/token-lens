import { useState, useCallback, useEffect } from 'react';
import { Zap, DollarSign, Hash, TrendingUp, BarChart2, MessageSquare } from 'lucide-react';
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
import SignIn                from './pages/SignIn';
import SignUp                from './pages/SignUp';
import Profile               from './pages/Profile';
import Settings              from './pages/Settings';
import { t }                 from './lib/i18n';
import { auth, onAuthStateChanged, logOut } from './lib/firebase';

function fmt(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}

function getStoredLang() {
  try { return localStorage.getItem('tl_lang') || 'en'; } catch { return 'en'; }
}

function fbUserToLocal(fbUser) {
  if (!fbUser) return null;
  return { email: fbUser.email, name: fbUser.displayName, photoURL: fbUser.photoURL, uid: fbUser.uid };
}

export default function App() {
  const [user, setUser]             = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authPage, setAuthPage]     = useState('signin');
  const [activeNav, setActiveNav]   = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifEnabled, setNotifEnabled]   = useState(true);
  const [notifPermission, setNotifPermission] = useState('granted');
  const [lang, setLang]             = useState(getStoredLang);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, fbUser => {
      setUser(fbUserToLocal(fbUser));
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const { data, loading, refreshing, lastUpdated, refresh } = useTokenData();
  const { toasts, addToast, removeToast } = useToasts();

  const handleLanguageChange = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem('tl_lang', newLang);
  }, []);

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
      body:    next ? 'You will receive in-app alerts.' : 'All alerts are silenced.',
      urgency: next ? 'info' : 'warning',
    });
  }, [notifEnabled, addToast]);

  const handleSignIn = useCallback(u => {
    addToast({ title: `Welcome back${u.name ? ', ' + u.name : ''}!`, body: 'You\'re now signed in to TokenLens.', urgency: 'info' });
  }, [addToast]);

  const handleSignUp = useCallback(u => {
    addToast({ title: 'Account created!', body: `Welcome to TokenLens, ${u.name || u.email}!`, urgency: 'info' });
  }, [addToast]);

  const handleSignOut = useCallback(async () => {
    await logOut();
    setAuthPage('signin');
  }, []);

  const handleUpdateUser = useCallback(updated => {
    setUser(updated);
    addToast({ title: 'Profile updated', body: 'Your changes have been saved.', urgency: 'info' });
  }, [addToast]);

  // Only fire plan-limit notifications when a user is actually signed in
  useNotifications(user ? data?.planUsage : null, notifEnabled, addToast);

  // ── Auth gate ──────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#EEF2FF,#F5EFFF,#EFF6FF)' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#7C5CFC,#A78BFA)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 20px rgba(124,92,252,0.32)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div style={{ width:28, height:28, border:'3px solid rgba(124,92,252,0.2)', borderTopColor:'#7C5CFC', borderRadius:'50%', animation:'tlSpin 0.7s linear infinite' }} />
        </div>
        <style>{`@keyframes tlSpin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {authPage === 'signin'
          ? <SignIn onSignIn={handleSignIn} onGoSignUp={() => setAuthPage('signup')} lang={lang} />
          : <SignUp onSignUp={handleSignUp} onGoSignIn={() => setAuthPage('signin')} lang={lang} />
        }
      </>
    );
  }

  const s = data?.stats;

  return (
    <div className="flex min-h-screen w-full" style={{ background: 'linear-gradient(135deg,#EEF2FF 0%,#F5EFFF 40%,#EFF6FF 75%,#F0FDF4 100%)', flex: 1 }}>
      <Sidebar
        active={activeNav}
        onChange={setActiveNav}
        planUsage={data?.planUsage}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        lang={lang}
      />

      <ToastNotifications toasts={toasts} onDismiss={removeToast} />

      <main className="flex-1 overflow-y-auto min-w-0" style={{ padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            user={user}
            onSignOut={handleSignOut}
            onNavigate={setActiveNav}
            lang={lang}
            onLanguageChange={handleLanguageChange}
          />

          <div key={activeNav} className="page-transition">

          {activeNav === 'profile' && (
            <Profile user={user} onUpdateUser={handleUpdateUser} lang={lang} onLanguageChange={handleLanguageChange} />
          )}

          {activeNav === 'settings' && (
            <Settings notifEnabled={notifEnabled} onToggleNotif={handleToggleNotif} lang={lang} />
          )}

          {activeNav === 'analytics' && (
            <AnalyticsView data={data} loading={loading} />
          )}

          {activeNav === 'dashboard' && <>

          {/* Row 1: Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-5">
            <StatCard label={t('tokens_today', lang)}   value={s?.today?.tokens ?? 0}       valueType="tokens"   icon={Zap}          accent="lavender" delta={12} sub={t('vs_yesterday', lang)} delay={0.05} loading={loading} />
            <StatCard label={t('weekly_tokens', lang)}  value={s?.week?.tokens ?? 0}        valueType="tokens"   icon={TrendingUp}   accent="sky"      delta={8}  sub={t('this_week', lang)}    delay={0.10} loading={loading} />
            <StatCard label={t('todays_spend', lang)}   value={s?.today?.cost ?? 0}         valueType="currency" icon={DollarSign}   accent="peach"    delta={-3} sub={t('vs_yesterday', lang)} delay={0.15} loading={loading} />
            <StatCard label={t('requests_today', lang)} value={s?.today?.requests ?? 0}     valueType="requests" icon={Hash}         accent="mint"     delta={5}  sub={t('api_calls', lang)}    delay={0.20} loading={loading} />
          </div>

          {/* Row 2: More stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-5">
            <StatCard label={t('avg_tokens', lang)}     value={s?.avgTokensPerRequest ?? 0} valueType="tokens"   icon={MessageSquare} accent="yellow" sub={t('per_request', lang)}    delay={0.25} loading={loading} />
            <StatCard label={t('weekly_spend', lang)}   value={s?.week?.cost ?? 0}          valueType="currency" icon={DollarSign}   accent="rose"     delta={-7} sub={t('seven_day_total', lang)} delay={0.30} loading={loading} />
            <StatCard label={t('alltime_tokens', lang)} value={s?.allTime?.tokens ?? 0}     valueType="tokens"   icon={BarChart2}    accent="sky"               sub={t('lifetime', lang)}     delay={0.35} loading={loading} />
            <StatCard label={t('efficiency', lang)}     value={s?.efficiency ?? 0}          valueType="requests" icon={TrendingUp}   accent="mint"     delta={2}  sub={t('output_ratio', lang)} delay={0.40} loading={loading} />
          </div>

          {/* Row 3: Weekly chart + Session */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 mb-4 lg:mb-5">
            <div className="lg:col-span-7 card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-[#1A1E2E]">{t('weekly_usage', lang)}</p>
                  <p className="text-xs text-muted mt-0.5">{t('weekly_sub', lang)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted"><span className="w-3 h-1.5 rounded-full bg-[#7C5CFC] inline-block" />{t('input', lang)}</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted"><span className="w-3 h-1.5 rounded-full bg-[#00C48C] inline-block" />{t('output', lang)}</span>
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
                <p className="text-sm font-semibold text-[#1A1E2E]">{t('today_by_hour', lang)}</p>
                <span className="text-xs text-muted">{t('hour_sub', lang)}</span>
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
                <p className="text-sm font-semibold text-[#1A1E2E]">{t('daily_spend', lang)}</p>
                <p className="text-xs text-muted">{t('seven_day', lang)}</p>
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
              <p className="text-sm font-semibold text-[#1A1E2E]">{t('request_history', lang)}</p>
              <span className="text-xs text-muted">{t('last_n', lang)} {data?.recentRequests?.length ?? '—'} {t('n_requests', lang)}</span>
            </div>
            {loading ? (
              <div className="flex flex-col gap-2">{[1,2,3,4,5].map(i=><div key={i} className="shimmer-bg h-10 rounded-xl"/>)}</div>
            ) : (
              <div className="overflow-x-auto -mx-1">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="text-muted text-xs font-semibold">
                      {[t('task',lang),t('model',lang),t('input',lang),t('output',lang),t('total',lang),t('cost',lang),t('time',lang)].map(h=>(
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

          <p className="text-center text-xs text-muted mt-6 pb-4">{t('footer', lang)}</p>
          </>}

          </div>{/* end page-transition */}
        </div>
      </main>
    </div>
  );
}
