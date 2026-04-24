import { RefreshCw, Bell, Search } from 'lucide-react';

export default function Header({ lastUpdated, refreshing, onRefresh }) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  return (
    <header className="flex items-center justify-between mb-6 lg:mb-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#1A1E2E] tracking-tight leading-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted mt-0.5">
          AI token usage & spend analytics
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Last updated */}
        <div className="hidden sm:flex items-center gap-1.5 bg-surface rounded-2xl px-3 py-2 border border-border text-xs text-muted">
          <div className={`dot-live ${refreshing ? '' : 'opacity-50'}`} style={{ background: refreshing ? '#F5A623' : '#00C48C' }} />
          <span className="font-mono">
            {refreshing ? 'Refreshing…' : `Updated ${timeStr}`}
          </span>
        </div>

        {/* Search */}
        <button className="w-9 h-9 rounded-2xl bg-surface border border-border flex items-center justify-center hover:border-[#7C5CFC] transition-colors duration-200">
          <Search size={15} className="text-muted" />
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="w-9 h-9 rounded-2xl bg-surface border border-border flex items-center justify-center hover:border-[#7C5CFC] transition-colors duration-200 disabled:opacity-50"
        >
          <RefreshCw size={15} className={`text-muted ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-2xl bg-surface border border-border flex items-center justify-center hover:border-[#7C5CFC] transition-colors duration-200">
          <Bell size={15} className="text-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4D7E]" />
        </button>
      </div>
    </header>
  );
}
