import { useState } from 'react';
import {
  LayoutDashboard, BarChart3, ChevronRight,
  Zap, X, Activity,
} from 'lucide-react';

const NAV = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    iconGrad: ['#7C5CFC', '#A78BFA'],
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
    iconGrad: ['#0098FF', '#38BDF8'],
  },
];

function PlanBar({ label, pct, color, resetLabel }) {
  const warn = pct >= 90 ? '#EF4444' : pct >= 75 ? '#F59E0B' : pct >= 50 ? '#F97316' : color;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-[#4A5568]">{label}</span>
        <span className="text-[10px] font-mono font-bold tabular-nums" style={{ color: warn }}>{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-[#0D0F14] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(pct, 100)}%`,
            background: warn,
            transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
      </div>
      {resetLabel && (
        <p className="text-[9.5px] text-[#2D3A50] mt-0.5">Resets in {resetLabel}</p>
      )}
    </div>
  );
}

function PlanMiniWidget({ planUsage }) {
  if (!planUsage) return null;
  const { plan, weeklyPct, sessionPct, resetLabel } = planUsage;

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1F2A3C] px-3 py-2.5 mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A5568]">Plan</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#7C5CFC]/15 text-[#A78BFA]">
          {plan}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <PlanBar label="Weekly"  pct={weeklyPct}  color="#7C5CFC" resetLabel={resetLabel} />
        <PlanBar label="Session" pct={sessionPct} color="#00C48C" />
      </div>
    </div>
  );
}

export default function Sidebar({ active, onChange, planUsage, mobileOpen, onMobileClose }) {
  const SidebarContent = () => (
    <div className="py-4 px-3">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#7C5CFC,#00C48C)' }}
        >
          <Zap size={14} strokeWidth={2.5} className="text-white" />
        </div>
        <span className="font-display text-white font-bold text-base tracking-tight">TokenLens</span>

        {/* Close button — mobile only, inside drawer */}
        <button
          className="ml-auto lg:hidden w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
          onClick={onMobileClose}
          aria-label="Close sidebar"
        >
          <X size={14} strokeWidth={2} className="text-[#6B7A99]" />
        </button>
      </div>

      {/* Nav */}
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#2D3A50] px-2 mb-1.5">Views</p>
      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ id, icon: Icon, label, iconGrad }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => { onChange(id); onMobileClose?.(); }}
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl w-full text-left transition-all duration-200"
              style={{
                background: isActive ? 'rgba(124,92,252,0.12)' : 'transparent',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg,${iconGrad[0]},${iconGrad[1]})`
                    : 'rgba(255,255,255,0.04)',
                }}
              >
                <Icon
                  size={14}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  className={isActive ? 'text-white' : 'text-[#4A5568]'}
                />
              </span>

              <span
                className="text-[13px] font-medium flex-1"
                style={{ color: isActive ? '#E5E7EB' : '#6B7A99' }}
              >
                {label}
              </span>

              {isActive && (
                <ChevronRight
                  size={12}
                  strokeWidth={2.5}
                  className="text-[#7C5CFC]"
                  style={{ animation: 'fade-in 0.2s ease' }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <PlanMiniWidget planUsage={planUsage} />

      <div className="flex items-center gap-2 px-2 mt-4">
        <div className="dot-live flex-shrink-0" />
        <span className="text-[10px] text-[#2D3A50]">Live · 60s refresh</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[210px] bg-sidebar z-50 lg:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[210px] min-h-screen bg-sidebar flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
