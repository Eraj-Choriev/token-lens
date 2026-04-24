import { useState } from 'react';
import {
  LayoutDashboard, Zap, DollarSign, BarChart3,
  Clock, Settings, ChevronRight, Activity, Menu, X,
} from 'lucide-react';

const NAV = [
  { id: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard'    },
  { id: 'usage',      icon: Zap,             label: 'Token Usage'  },
  { id: 'spending',   icon: DollarSign,      label: 'Spending'     },
  { id: 'analytics',  icon: BarChart3,       label: 'Analytics'    },
  { id: 'history',    icon: Clock,           label: 'History'      },
  { id: 'activity',   icon: Activity,        label: 'Live Feed'    },
];

export default function Sidebar({ active, onChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const Content = () => (
    <div className="flex flex-col h-full py-5 px-3">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#00C48C] flex items-center justify-center flex-shrink-0">
          <Zap size={16} fill="white" stroke="none" />
        </div>
        <span className="font-display text-white font-bold text-lg tracking-tight">TokenLens</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#3D4A60] px-3 mb-2">Menu</p>
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

      {/* Footer */}
      <div className="mt-auto border-t border-[#1E2537] pt-4">
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
          <p className="text-[11px] text-[#4A5568] leading-snug">Refreshes every 60s from Claude API</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-sidebar text-white p-2 rounded-xl shadow-lg"
        onClick={() => setMobileOpen(v => !v)}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`fixed top-0 left-0 h-full w-[220px] bg-sidebar z-50 lg:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Content />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] min-h-screen bg-sidebar flex-shrink-0">
        <Content />
      </aside>
    </>
  );
}
