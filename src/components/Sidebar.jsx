import { useState } from 'react';
import {
  LayoutDashboard, BarChart3, ChevronLeft, ChevronRight,
  Zap, X, User, Settings,
} from 'lucide-react';

const NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard',  iconGrad: ['#7C5CFC', '#A78BFA'] },
  { id: 'analytics', icon: BarChart3,       label: 'Analytics',  iconGrad: ['#0098FF', '#38BDF8'] },
];

const NAV_BOTTOM = [
  { id: 'profile',  icon: User,     label: 'Profile',  iconGrad: ['#EC4899', '#F472B6'] },
  { id: 'settings', icon: Settings, label: 'Settings', iconGrad: ['#6B7280', '#9CA3AF'] },
];

function Tooltip({ label, collapsed }) {
  if (!collapsed) return null;
  return (
    <div style={{
      position: 'absolute', left: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)',
      background: '#1A1E2E', color: '#fff', fontSize: 12, fontWeight: 600,
      padding: '5px 10px', borderRadius: 7, whiteSpace: 'nowrap', pointerEvents: 'none',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      zIndex: 1000,
      opacity: 0, transition: 'opacity 0.15s',
    }} className="sidebar-tooltip">
      {label}
      <div style={{
        position: 'absolute', left: -4, top: '50%', transform: 'translateY(-50%)',
        width: 8, height: 8, background: '#1A1E2E', borderRadius: 2,
        rotate: '45deg',
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
          className="h-full rounded-full"
          style={{ width: `${Math.min(pct, 100)}%`, background: warn, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
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

function SidebarContent({ active, onChange, planUsage, onMobileClose, collapsed, onToggleCollapse, isMobile }) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ padding: collapsed ? '16px 8px' : '16px 12px', transition: 'padding 0.25s ease' }}
    >
      {/* Logo */}
      <div
        className="flex items-center mb-6"
        style={{ gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', overflow: 'hidden' }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'linear-gradient(135deg,#7C5CFC,#00C48C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Zap size={14} strokeWidth={2.5} style={{ color: '#fff' }} />
        </div>

        {!collapsed && (
          <span style={{
            color: '#fff', fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.3px',
            whiteSpace: 'nowrap', overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
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

      {/* Section label */}
      {!collapsed && (
        <p style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#2D3A50',
          paddingLeft: 8, marginBottom: 6,
        }}>
          Views
        </p>
      )}

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ id, icon: Icon, label, iconGrad }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => { onChange(id); onMobileClose?.(); }}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 10,
                padding: collapsed ? '8px 0' : '8px 8px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 12, width: '100%', textAlign: 'left',
                background: isActive ? 'rgba(124,92,252,0.12)' : 'transparent',
                border: 'none', cursor: 'pointer',
                transition: 'background 0.15s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                const tip = e.currentTarget.querySelector('.sidebar-tooltip');
                if (tip) tip.style.opacity = '1';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
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
                transition: 'background 0.15s',
              }}>
                <Icon size={14} strokeWidth={isActive ? 2.5 : 1.75} style={{ color: isActive ? '#fff' : '#4A5568' }} />
              </span>

              {!collapsed && (
                <span style={{
                  fontSize: 13, fontWeight: 500, flex: 1, color: isActive ? '#E5E7EB' : '#6B7A99',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                }}>
                  {label}
                </span>
              )}

              {!collapsed && isActive && (
                <ChevronRight size={12} strokeWidth={2.5} style={{ color: '#7C5CFC' }} />
              )}

              {collapsed && <Tooltip label={label} collapsed={collapsed} />}
            </button>
          );
        })}
      </nav>

      <PlanMiniWidget planUsage={planUsage} collapsed={collapsed} />

      <div className="flex-1" />

      {/* Bottom nav: Profile + Settings */}
      {!collapsed && (
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2D3A50', paddingLeft: 8, marginBottom: 6, marginTop: 12 }}>
          Account
        </p>
      )}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 8 }}>
        {NAV_BOTTOM.map(({ id, icon: Icon, label, iconGrad }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => { onChange(id); onMobileClose?.(); }}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
                padding: collapsed ? '8px 0' : '8px 8px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 12, width: '100%', textAlign: 'left',
                background: isActive ? 'rgba(124,92,252,0.12)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'background 0.15s', position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{
                width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: isActive ? `linear-gradient(135deg,${iconGrad[0]},${iconGrad[1]})` : 'rgba(255,255,255,0.04)',
              }}>
                <Icon size={14} strokeWidth={isActive ? 2.5 : 1.75} style={{ color: isActive ? '#fff' : '#4A5568' }} />
              </span>
              {!collapsed && (
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: isActive ? '#E5E7EB' : '#6B7A99' }}>
                  {label}
                </span>
              )}
              {!collapsed && isActive && <ChevronRight size={12} strokeWidth={2.5} style={{ color: '#7C5CFC' }} />}
            </button>
          );
        })}
      </nav>

      {/* Live indicator */}
      {!collapsed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingLeft: 8, marginBottom: 10 }}>
          <div className="dot-live" />
          <span style={{ fontSize: 10, color: '#2D3A50' }}>Live · 60s refresh</span>
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
            borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s',
            color: '#4A5568',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#9CABC4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#4A5568'; }}
        >
          {collapsed
            ? <ChevronRight size={14} strokeWidth={2} />
            : <ChevronLeft size={14} strokeWidth={2} />
          }
          {!collapsed && <span style={{ fontSize: 11.5, marginLeft: 6, fontWeight: 500 }}>Collapse</span>}
        </button>
      )}
    </div>
  );
}

export default function Sidebar({ active, onChange, planUsage, mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);

  const w = collapsed ? 64 : 210;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          className="lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer — always full width */}
      <div
        className="lg:hidden"
        style={{
          position: 'fixed', top: 0, left: 0, height: '100%', width: 210,
          background: '#0D0F14', zIndex: 50,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <SidebarContent
          active={active} onChange={onChange} planUsage={planUsage}
          onMobileClose={onMobileClose} collapsed={false} isMobile
        />
      </div>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block flex-shrink-0"
        style={{
          width: w, minHeight: '100vh', background: '#0D0F14',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
        }}
      >
        <SidebarContent
          active={active} onChange={onChange} planUsage={planUsage}
          onMobileClose={onMobileClose}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(c => !c)}
          isMobile={false}
        />
      </aside>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </>
  );
}
