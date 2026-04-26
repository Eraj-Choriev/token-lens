import { useState } from 'react';
import {
  LayoutDashboard, BarChart3, ChevronLeft, ChevronRight,
  Zap, X, User, Settings,
} from 'lucide-react';
import { t } from '../lib/i18n';

/* All nav items unified at the top */
const ALL_NAV = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard', iconGrad: ['#7C5CFC', '#A78BFA'] },
  { id: 'analytics', icon: BarChart3,       labelKey: 'analytics', iconGrad: ['#0098FF', '#38BDF8'] },
  { id: 'profile',   icon: User,            labelKey: 'profile',   iconGrad: ['#EC4899', '#F472B6'] },
  { id: 'settings',  icon: Settings,        labelKey: 'settings',  iconGrad: ['#6B7280', '#9CA3AF'] },
];

function Tooltip({ label }) {
  return (
    <div style={{
      position: 'absolute', left: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)',
      background: '#1A1E2E', color: '#fff', fontSize: 12, fontWeight: 600,
      padding: '5px 10px', borderRadius: 7, whiteSpace: 'nowrap', pointerEvents: 'none',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)', zIndex: 1000,
      opacity: 0, transition: 'opacity 0.15s',
    }} className="sidebar-tooltip">
      {label}
      <div style={{
        position: 'absolute', left: -4, top: '50%', transform: 'translateY(-50%)',
        width: 8, height: 8, background: '#1A1E2E', borderRadius: 2, rotate: '45deg',
      }} />
    </div>
  );
}

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
          className="h-full rounded-full progress-bar-inner"
          style={{ width: `${Math.min(pct, 100)}%`, background: warn }}
        />
      </div>
      {resetLabel && <p className="text-[9.5px] text-[#2D3A50] mt-0.5">Resets in {resetLabel}</p>}
    </div>
  );
}

function PlanMiniWidget({ planUsage, collapsed }) {
  if (!planUsage || collapsed) return null;
  const { plan, weeklyPct, sessionPct, resetLabel } = planUsage;
  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1F2A3C] px-3 py-2.5 mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A5568]">Plan</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#7C5CFC]/15 text-[#A78BFA]">{plan}</span>
      </div>
      <div className="flex flex-col gap-2">
        <PlanBar label="Weekly"  pct={weeklyPct}  color="#7C5CFC" resetLabel={resetLabel} />
        <PlanBar label="Session" pct={sessionPct} color="#00C48C" />
      </div>
    </div>
  );
}

function NavBtn({ item, active, onChange, onMobileClose, collapsed, lang }) {
  const { id, icon: Icon, labelKey, iconGrad } = item;
  const label = t(labelKey, lang);
  const isActive = active === id;

  return (
    <button
      key={id}
      onClick={() => { onChange(id); onMobileClose?.(); }}
      title={collapsed ? label : undefined}
      style={{
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : 10,
        padding: collapsed ? '8px 0' : '8px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 12, width: '100%', textAlign: 'left',
        background: isActive ? 'rgba(124,92,252,0.14)' : 'transparent',
        border: isActive ? '1px solid rgba(124,92,252,0.18)' : '1px solid transparent',
        cursor: 'pointer',
        transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
        position: 'relative',
        transform: 'scale(1)',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.transform = 'scale(1.01)';
        }
        const tip = e.currentTarget.querySelector('.sidebar-tooltip');
        if (tip) tip.style.opacity = '1';
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.transform = 'scale(1)';
        }
        const tip = e.currentTarget.querySelector('.sidebar-tooltip');
        if (tip) tip.style.opacity = '0';
      }}
    >
      <span style={{
        width: 30, height: 30, borderRadius: 9,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: isActive
          ? `linear-gradient(135deg,${iconGrad[0]},${iconGrad[1]})`
          : 'rgba(255,255,255,0.04)',
        transition: 'background 0.2s ease',
        boxShadow: isActive ? `0 4px 12px ${iconGrad[0]}40` : 'none',
      }}>
        <Icon size={14} strokeWidth={isActive ? 2.5 : 1.75} style={{ color: isActive ? '#fff' : '#4A5568' }} />
      </span>

      {!collapsed && (
        <span style={{
          fontSize: 13, fontWeight: isActive ? 600 : 500, flex: 1,
          color: isActive ? '#E5E7EB' : '#6B7A99',
          whiteSpace: 'nowrap', overflow: 'hidden',
          transition: 'color 0.2s ease',
        }}>
          {label}
        </span>
      )}

      {!collapsed && isActive && (
        <ChevronRight size={12} strokeWidth={2.5} style={{ color: iconGrad[0], flexShrink: 0 }} />
      )}

      {collapsed && <Tooltip label={label} />}
    </button>
  );
}

function SidebarContent({ active, onChange, planUsage, onMobileClose, collapsed, onToggleCollapse, isMobile, lang }) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ padding: collapsed ? '16px 8px' : '16px 12px', transition: 'padding 0.25s ease' }}
    >
      {/* Logo */}
      <div
        className="flex items-center mb-5"
        style={{ gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', overflow: 'hidden' }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'linear-gradient(135deg,#7C5CFC,#00C48C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: '0 4px 14px rgba(124,92,252,0.4)',
        }}>
          <Zap size={14} strokeWidth={2.5} style={{ color: '#fff' }} />
        </div>

        {!collapsed && (
          <span style={{
            color: '#fff', fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.3px',
            whiteSpace: 'nowrap', overflow: 'hidden',
            animation: 'sbFadeIn 0.2s ease',
          }}>
            TokenLens
          </span>
        )}

        {!collapsed && (
          <button
            className="ml-auto lg:hidden w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
            onClick={onMobileClose}
            aria-label="Close sidebar"
          >
            <X size={14} strokeWidth={2} style={{ color: '#6B7A99' }} />
          </button>
        )}
      </div>

      {/* Thin divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', marginBottom: 10 }} />

      {/* All nav items at top */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {ALL_NAV.map(item => (
          <NavBtn
            key={item.id}
            item={item}
            active={active}
            onChange={onChange}
            onMobileClose={onMobileClose}
            collapsed={collapsed}
            lang={lang}
          />
        ))}
      </nav>

      <PlanMiniWidget planUsage={planUsage} collapsed={collapsed} />

      <div className="flex-1" />

      {/* Live indicator */}
      {!collapsed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingLeft: 8, marginBottom: 10 }}>
          <div className="dot-live" />
          <span style={{ fontSize: 10, color: '#2D3A50' }}>{t('live', lang)} · {t('refresh_interval', lang)}</span>
        </div>
      )}

      {/* Collapse toggle — desktop only */}
      {!isMobile && (
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', padding: '8px 0',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, cursor: 'pointer',
            transition: 'background 0.2s ease, color 0.2s ease',
            color: '#4A5568',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#9CABC4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#4A5568'; }}
        >
          {collapsed
            ? <ChevronRight size={14} strokeWidth={2} />
            : <ChevronLeft  size={14} strokeWidth={2} />
          }
          {!collapsed && <span style={{ fontSize: 11.5, marginLeft: 6, fontWeight: 500 }}>Collapse</span>}
        </button>
      )}
    </div>
  );
}

export default function Sidebar({ active, onChange, planUsage, mobileOpen, onMobileClose, lang }) {
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? 64 : 214;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 40, backdropFilter: 'blur(2px)' }}
          className="lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="lg:hidden"
        style={{
          position: 'fixed', top: 0, left: 0, height: '100%', width: 214,
          background: '#0D0F14', zIndex: 50,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <SidebarContent
          active={active} onChange={onChange} planUsage={planUsage}
          onMobileClose={onMobileClose} collapsed={false} isMobile lang={lang}
        />
      </div>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block flex-shrink-0"
        style={{
          width: w, minHeight: '100vh', background: '#0D0F14',
          transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
        }}
      >
        <SidebarContent
          active={active} onChange={onChange} planUsage={planUsage}
          onMobileClose={onMobileClose}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(c => !c)}
          isMobile={false}
          lang={lang}
        />
      </aside>

      <style>{`
        @keyframes sbFadeIn { from{opacity:0;transform:translateX(-4px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </>
  );
}
