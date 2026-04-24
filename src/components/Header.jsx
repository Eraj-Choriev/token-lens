import { useState } from 'react';
import { RefreshCw, Bell, BellOff, BellRing } from 'lucide-react';

export default function Header({
  lastUpdated, refreshing, onRefresh,
  notifPermission, notifEnabled, onToggleNotif, onRequestNotif,
  activeView,
}) {
  const [justToggled, setJustToggled] = useState(false);

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  const viewLabels = { dashboard: 'Dashboard', analytics: 'Analytics' };

  const handleBellClick = async () => {
    if (notifPermission === 'default' || notifPermission === 'unsupported') {
      await onRequestNotif();
      return;
    }
    setJustToggled(true);
    onToggleNotif();
    setTimeout(() => setJustToggled(false), 600);
  };

  // Bell appearance state
  const bellGranted = notifPermission === 'granted';
  const bellActive  = bellGranted && notifEnabled;
  const bellColor   = bellActive ? '#7C5CFC' : '#8B95A8';
  const bellBg      = bellActive ? '#E5DCFF' : 'white';
  const bellBorder  = bellActive ? '#C4B5FD' : '#E4E8F0';
  const BellIcon    = bellActive ? BellRing : bellGranted ? BellOff : Bell;

  return (
    <header className="flex items-center justify-between mb-6 lg:mb-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#1A1E2E] tracking-tight leading-tight">
          {viewLabels[activeView] ?? 'Dashboard'}
        </h1>
        <p className="text-sm text-muted mt-0.5">AI token usage &amp; spend analytics</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Last updated pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-surface rounded-2xl px-3 py-2 border border-border text-xs text-muted">
          <div className="dot-live" style={{ background: refreshing ? '#F5A623' : '#00C48C', opacity: refreshing ? 1 : 0.7 }} />
          <span className="font-mono">
            {refreshing ? 'Refreshing…' : `Updated ${timeStr}`}
          </span>
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          title="Refresh data"
          className="w-9 h-9 rounded-2xl bg-surface border border-border flex items-center justify-center hover:border-[#7C5CFC] hover:bg-[#F5F3FF] transition-all duration-200 disabled:opacity-40 group"
        >
          <RefreshCw
            size={15}
            className={`text-muted group-hover:text-[#7C5CFC] transition-colors duration-200 ${refreshing ? 'animate-spin' : ''}`}
          />
        </button>

        {/* Notification toggle bell */}
        <button
          onClick={handleBellClick}
          title={bellActive ? 'Notifications on — click to mute' : bellGranted ? 'Notifications muted — click to enable' : 'Enable notifications'}
          className="relative w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 group"
          style={{
            background: bellBg,
            border: `1px solid ${bellBorder}`,
            boxShadow: bellActive ? '0 0 0 0 rgba(124,92,252,0.3)' : 'none',
          }}
        >
          <BellIcon
            size={15}
            className="transition-all duration-300"
            style={{
              color: bellColor,
              transform: justToggled ? 'rotate(-20deg) scale(1.15)' : 'rotate(0deg) scale(1)',
            }}
          />
          {/* Active dot */}
          {bellActive && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00C48C] ring-2 ring-white"
              style={{ animation: 'livePulse 2s ease-in-out infinite' }}
            />
          )}
          {/* Permission-needed dot */}
          {!bellGranted && notifPermission !== 'denied' && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F5A623]" />
          )}
          {/* Tooltip on hover */}
          <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium bg-[#1A1E2E] text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            {bellActive ? 'Mute alerts' : bellGranted ? 'Unmute alerts' : 'Enable alerts'}
          </span>
        </button>
      </div>
    </header>
  );
}
