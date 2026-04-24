import { useState } from 'react';
import { LayoutDashboard, BarChart3, Settings, ChevronRight, Zap, Menu, X } from 'lucide-react';

const NAV = [
  { id: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
  { id: 'analytics',  icon: BarChart3,       label: 'Analytics'  },
];

function PlanMiniWidget({ planUsage }) {
  if (!planUsage) return null;
  const { plan, weeklyPct, sessionPct, resetLabel } = planUsage;
  const warnColor = weeklyPct >= 90 ? '#FF4D7E' : weeklyPct >= 75 ? '#F5A623' : '#7C5CFC';

  return (
    <div className="mx-1 rounded-2xl bg-[#161B24] border border-[#1E2537] p-3 mb-3">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-semibold text-[#9CABC4]">Plan Usage</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: '#7C5CFC22', color: '#A78BFA' }}>{plan}</span>
      </div>
      {/* Weekly */}
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-[#4A5568]">Weekly</span>
          <span className="text-[10px] font-mono font-bold" style={{ color: warnColor }}>{weeklyPct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#0D0F14] overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${Math.min(weeklyPct, 100)}%`, background: warnColor }} />
        </div>
      </div>
      {/* Session */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-[#4A5568]">Session</span>
          <span className="text-[10px] font-mono font-bold text-[#00C48C]">{sessionPct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#0D0F14] overflow-hidden">
          <div className="h-full rounded-full bg-[#00C48C] transition-all duration-700"
               style={{ width: `${Math.min(sessionPct, 100)}%` }} />
        </div>
      </div>
      <p className="text-[10px] text-[#3D4A60] mt-2">Resets in {resetLabel}</p>
    </div>
  );
}

export default function Sidebar({ active, onChange, planUsage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const Content = () => (
    <div className="flex flex-col h-full py-5 px-3">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-7">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#00C48C] flex items-center justify-center flex-shrink-0">
          <Zap size={16} fill="white" stroke="none" />
        </div>
        <span className="font-display text-white font-bold text-lg tracking-tight">TokenLens</span>
      </div>

      {/* Nav — only 2 real sections */}
      <nav className="flex flex-col gap-1 mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#3D4A60] px-3 mb-2">Views</p>
        {NAV.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => { onChange(id); setMobileOpen(false); }}
            className={`sidebar-item ${active === id ? 'active' : ''}`}
          >
            <span className={`icon-wrap ${active === id ? 'bg-[#7C5CFC]/20' : ''}`}>
              <Icon size={16} className={active === id ? 'text-[#A78BFA]' : 'text-[#6B7A99]'} />
            </span>
            <span>{label}</span>
            {active === id && <ChevronRight size={13} className="ml-auto text-[#A78BFA]" />}
          </button>
        ))}
      </nav>

      {/* Plan usage widget */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#3D4A60] px-3 mb-2">Plan</p>
      <PlanMiniWidget planUsage={planUsage} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="border-t border-[#1E2537] pt-4">
        <button className="sidebar-item w-full">
          <span className="icon-wrap">
            <Settings size={16} className="text-[#6B7A99]" />
          </span>
          Settings
        </button>
        <div className="mt-3 mx-1 rounded-2xl bg-[#161B24] p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="dot-live" />
            <span className="text-[11px] text-[#9CABC4] font-medium">Live Monitoring</span>
          </div>
          <p className="text-[11px] text-[#4A5568] leading-snug">Auto-refreshes every 60s</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-sidebar text-white p-2 rounded-xl shadow-lg"
        onClick={() => setMobileOpen(v => !v)}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`fixed top-0 left-0 h-full w-[220px] bg-sidebar z-50 lg:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Content />
      </div>
      <aside className="hidden lg:flex flex-col w-[220px] min-h-screen bg-sidebar flex-shrink-0">
        <Content />
      </aside>
    </>
  );
}
