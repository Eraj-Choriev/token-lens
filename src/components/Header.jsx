import { useState, useRef, useEffect } from 'react';
import { RefreshCw, Bell, BellOff, BellRing, Menu, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import DownloadButton from './DownloadButton';
import { t } from '../lib/i18n';

const VIEW_LABELS = { dashboard: 'overview', analytics: 'analytics', profile: 'profile', settings: 'settings' };

const LANG_OPTIONS = [
  { value: 'en', flag: '🇬🇧', label: 'EN' },
  { value: 'ru', flag: '🇷🇺', label: 'RU' },
];

function LangSwitcher({ lang, onLanguageChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2,
      background: '#F0F2F7', borderRadius: 10, padding: 2,
      border: '1px solid #E4E8F0',
    }}>
      {LANG_OPTIONS.map(({ value, flag, label }) => {
        const active = lang === value;
        return (
          <button
            key={value}
            onClick={() => onLanguageChange(value)}
            title={value === 'en' ? 'English' : 'Русский'}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: active ? 'linear-gradient(135deg,#7C5CFC,#6D28D9)' : 'transparent',
              color: active ? '#fff' : '#8B95A8',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
              transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow: active ? '0 2px 8px rgba(124,92,252,0.35)' : 'none',
              transform: active ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: 13, lineHeight: 1 }}>{flag}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function UserAvatar({ src, initials, size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: src ? 'transparent' : 'linear-gradient(135deg,#7C5CFC,#A78BFA)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      {src
        ? <img src={src} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ color: '#fff', fontSize: size * 0.38, fontWeight: 700 }}>{initials}</span>
      }
    </div>
  );
}

function UserMenu({ user, onSignOut, onNavigate, lang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const avatar = (() => { try { return localStorage.getItem('tl_avatar') || ''; } catch { return ''; } })();
  const initials = (user?.name || user?.email || 'U').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  const go = view => { setOpen(false); onNavigate(view); };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '4px 10px 4px 5px',
          background: open ? '#F0EDFF' : '#fff',
          border: `1px solid ${open ? '#C4B5FD' : '#E4E8F0'}`,
          borderRadius: 28, cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.borderColor = '#C4B5FD'; e.currentTarget.style.background = '#FAF9FF'; }}}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = '#E4E8F0'; e.currentTarget.style.background = '#fff'; }}}
      >
        <UserAvatar src={avatar} initials={initials} size={28} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1E2E', maxWidth: 90, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {displayName}
        </span>
        <ChevronDown size={13} strokeWidth={2} style={{ color: '#8B95A8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          background: '#fff', border: '1px solid #E4E8F0',
          borderRadius: 14, boxShadow: '0 8px 40px rgba(0,0,0,0.16)',
          minWidth: 210, zIndex: 9999, overflow: 'hidden',
          animation: 'fadeDown 0.15s ease',
        }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #F0F2F7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <UserAvatar src={avatar} initials={initials} size={36} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1E2E', margin: 0 }}>{displayName}</p>
                <p style={{ fontSize: 11.5, color: '#8B95A8', margin: 0 }}>{user?.email || ''}</p>
              </div>
            </div>
          </div>

          {[
            { icon: User,     label: t('profile', lang),  view: 'profile'  },
            { icon: Settings, label: t('settings', lang), view: 'settings' },
          ].map(({ icon: Icon, label, view }) => (
            <button key={view} onClick={() => go(view)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 13, color: '#3D4457', fontWeight: 500,
              transition: 'background 0.1s', textAlign: 'left',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F5F6FA'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
            >
              <Icon size={14} style={{ color: '#8B95A8' }} /> {label}
            </button>
          ))}

          <div style={{ height: 1, background: '#F0F2F7', margin: '4px 0' }} />

          <button onClick={() => { setOpen(false); onSignOut(); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 14px', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 13, color: '#EF4444', fontWeight: 500,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FFF5F5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            <LogOut size={14} style={{ color: '#EF4444' }} /> Sign Out
          </button>
        </div>
      )}
      <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

export default function Header({
  lastUpdated, refreshing, onRefresh,
  notifPermission, notifEnabled, onToggleNotif, onRequestNotif,
  activeView, data, onMenuOpen, user, onSignOut, onNavigate,
  lang, onLanguageChange,
}) {
  const [justToggled, setJustToggled] = useState(false);

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  const handleBellClick = async () => {
    if (notifPermission === 'default' || notifPermission === 'unsupported') {
      await onRequestNotif(); return;
    }
    setJustToggled(true);
    onToggleNotif();
    setTimeout(() => setJustToggled(false), 600);
  };

  const bellGranted = notifPermission === 'granted';
  const bellActive  = bellGranted && notifEnabled;
  const BellIcon    = bellActive ? BellRing : bellGranted ? BellOff : Bell;

  const viewKey = VIEW_LABELS[activeView] ?? 'overview';

  return (
    <header className="flex items-center justify-between mb-6 lg:mb-7 animate-fade-in" style={{
      background: 'rgba(255,255,255,0.97)',
      border: '1px solid rgba(124,92,252,0.12)',
      borderRadius: 18, padding: '12px 18px',
      boxShadow: '0 4px 24px rgba(124,92,252,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      position: 'relative', zIndex: 200,
    }}>
      <div className="flex items-center gap-3">
        <button className="lg:hidden w-9 h-9 rounded-2xl bg-surface border border-border flex items-center justify-center transition-all duration-200 flex-shrink-0"
          onClick={onMenuOpen} aria-label="Open menu">
          <Menu size={16} className="text-muted" />
        </button>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 20, color: '#1A1E2E', letterSpacing: '-0.4px', lineHeight: 1.1, margin: 0 }}>
            {t(viewKey, lang)}
          </h1>
          <p style={{ fontSize: 12.5, color: '#8B95A8', margin: 0, marginTop: 2 }}>
            {t('ai_subtitle', lang)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <DownloadButton data={data} disabled={!data} />

        {/* Now bar with language switcher */}
        <div className="hidden sm:flex items-center gap-2 rounded-2xl px-3 py-1.5 border"
          style={{ background: '#F5F6FA', borderColor: '#E4E8F0' }}>
          <div className="dot-live" style={{ background: refreshing ? '#F5A623' : '#00C48C', opacity: refreshing ? 1 : 0.7 }} />
          <span className="font-mono text-xs text-muted">{refreshing ? t('refreshing', lang) : `${t('updated', lang)} ${timeStr}`}</span>
          <div style={{ width: 1, height: 14, background: '#E4E8F0', margin: '0 2px' }} />
          <LangSwitcher lang={lang} onLanguageChange={onLanguageChange} />
        </div>

        <button onClick={onRefresh} disabled={refreshing} title="Refresh data" style={{
          width: 36, height: 36, borderRadius: 10, background: '#fff',
          border: '1px solid #E4E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: refreshing ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
          opacity: refreshing ? 0.4 : 1,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C5CFC'; e.currentTarget.style.background = '#F5F3FF'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4E8F0'; e.currentTarget.style.background = '#fff'; }}
        >
          <RefreshCw size={14} style={{ color: '#8B95A8', animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </button>

        <button onClick={handleBellClick} title={bellActive ? t('mute_alerts', lang) : t('enable_alerts', lang)} style={{
          width: 36, height: 36, borderRadius: 10, position: 'relative',
          background: bellActive ? '#E5DCFF' : 'white',
          border: `1px solid ${bellActive ? '#C4B5FD' : '#E4E8F0'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <BellIcon size={14} style={{
            color: bellActive ? '#7C5CFC' : '#8B95A8',
            transform: justToggled ? 'rotate(-20deg) scale(1.15)' : 'none', transition: 'transform 0.3s',
          }} />
          {bellActive && <span style={{
            position: 'absolute', top: 6, right: 7, width: 6, height: 6,
            borderRadius: '50%', background: '#7C5CFC', border: '1.5px solid #fff',
          }} />}
        </button>

        <UserMenu user={user} onSignOut={onSignOut} onNavigate={onNavigate} lang={lang} />
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </header>
  );
}
