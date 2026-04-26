import { useState, useEffect } from 'react';
import { Bell, Download, Trash2, Shield, RefreshCw, AlertTriangle, CheckCircle2, FileText, BarChart3 } from 'lucide-react';
import { t } from '../lib/i18n';

const FONT = "'Inter', ui-sans-serif, system-ui";

/* ── localStorage helpers ─────────────────────────────────────── */
function getSettings() {
  try {
    return {
      notifEnabled:   true,
      threshold50:    true,
      threshold75:    true,
      threshold90:    true,
      threshold100:   true,
      refreshInterval: 60,
      ...JSON.parse(localStorage.getItem('tl_settings') || '{}'),
    };
  } catch { return { notifEnabled: true, threshold50: true, threshold75: true, threshold90: true, threshold100: true, refreshInterval: 60 }; }
}

function saveSettings(s) {
  localStorage.setItem('tl_settings', JSON.stringify(s));
}

function getExports() {
  try { return JSON.parse(localStorage.getItem('tl_exports') || '[]'); } catch { return []; }
}

function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

/* ── Toggle switch ────────────────────────────────────────────── */
function Toggle({ checked, onChange, label, sub, accent = '#7C5CFC' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: '1px solid #F5F5F8',
    }}>
      <div>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2937', margin: 0, fontFamily: FONT }}>{label}</p>
        {sub && <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', fontFamily: FONT }}>{sub}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 42, height: 24, borderRadius: 99, border: 'none',
          background: checked ? accent : '#E5E7EB',
          cursor: 'pointer', position: 'relative', flexShrink: 0,
          transition: 'background 0.2s',
          boxShadow: checked ? `0 0 0 3px ${accent}22` : 'none',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
          transition: 'left 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </button>
    </div>
  );
}

function Section({ title, subtitle, icon: Icon, iconColor = '#7C5CFC', children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      border: '1px solid rgba(124,92,252,0.1)', padding: 28,
      boxShadow: '0 4px 24px rgba(124,92,252,0.07), 0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `${iconColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} strokeWidth={2} color={iconColor} />
        </div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 3px', fontFamily: FONT, letterSpacing: '-0.02em' }}>{title}</h2>
          {subtitle && <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: 0, fontFamily: FONT }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Settings({ notifEnabled: globalNotif, onToggleNotif, lang = 'en' }) {
  const [cfg, setCfg]       = useState(getSettings);
  const [exports, setExports] = useState(getExports);
  const [saved, setSaved]   = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  /* sync global notif state from header bell */
  useEffect(() => {
    setCfg(c => ({ ...c, notifEnabled: globalNotif }));
  }, [globalNotif]);

  const update = (key, val) => {
    const next = { ...cfg, [key]: val };
    setCfg(next);
    saveSettings(next);
    /* if toggling master notif, also fire the global toggle */
    if (key === 'notifEnabled') onToggleNotif?.();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const clearExports = () => {
    localStorage.removeItem('tl_exports');
    setExports([]);
    setClearConfirm(false);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', fontFamily: FONT }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em', margin: '0 0 4px', fontFamily: FONT }}>
          {t('settings_title', lang)}
        </h1>
        <p style={{ fontSize: 13.5, color: '#6B7280', margin: 0 }}>
          {t('settings_sub', lang)}
        </p>
      </div>

      {saved && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#F0FDF4', border: '1px solid #BBF7D0',
          borderRadius: 10, padding: '10px 16px', marginBottom: 16,
          fontSize: 13.5, fontWeight: 600, color: '#15803D', fontFamily: FONT,
          animation: 'fadeIn 0.2s ease',
        }}>
          <CheckCircle2 size={15} /> Settings saved automatically
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Notifications */}
        <Section title={t('notifications', lang)} subtitle={t('notif_sub', lang)} icon={Bell}>
          <Toggle
            label="Enable in-app notifications"
            sub="Show toast alerts inside the dashboard"
            checked={cfg.notifEnabled}
            onChange={v => update('notifEnabled', v)}
          />
          <Toggle
            label="Alert at 50% of plan limit"
            sub="Notify when weekly tokens reach 50%"
            checked={cfg.threshold50}
            onChange={v => update('threshold50', v)}
            accent="#F59E0B"
          />
          <Toggle
            label="Alert at 75% of plan limit"
            sub="Notify when weekly tokens reach 75%"
            checked={cfg.threshold75}
            onChange={v => update('threshold75', v)}
            accent="#F97316"
          />
          <Toggle
            label="Alert at 90% of plan limit"
            sub="Notify when weekly tokens reach 90%"
            checked={cfg.threshold90}
            onChange={v => update('threshold90', v)}
            accent="#EF4444"
          />
          <Toggle
            label="Alert at 100% — plan limit reached"
            sub="Critical alert when plan is fully used"
            checked={cfg.threshold100}
            onChange={v => update('threshold100', v)}
            accent="#DC2626"
          />
          <div style={{ borderBottom: 'none' }}>
            <Toggle
              label="Chime sound with alerts"
              sub="Play an audio chime with each notification"
              checked={cfg.chimeEnabled ?? false}
              onChange={v => update('chimeEnabled', v)}
              accent="#6366F1"
            />
          </div>
        </Section>

        {/* Data refresh */}
        <Section title={t('data_refresh', lang)} subtitle="Control how often data updates" icon={RefreshCw} iconColor="#0098FF">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2937', margin: 0, fontFamily: FONT }}>Auto-refresh interval</p>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', fontFamily: FONT }}>How often the dashboard fetches new data</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select
                value={cfg.refreshInterval}
                onChange={e => update('refreshInterval', Number(e.target.value))}
                style={{
                  padding: '7px 12px', borderRadius: 8,
                  border: '1.5px solid #E5E7EB', background: '#F9FAFB',
                  fontSize: 13.5, color: '#111827', fontFamily: FONT,
                  outline: 'none', cursor: 'pointer',
                }}
              >
                {[30,60,120,300].map(v => (
                  <option key={v} value={v}>{v}s</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Export history */}
        <Section title={t('export_history', lang)} subtitle={`${exports.length} PDF report${exports.length !== 1 ? 's' : ''} exported`} icon={Download} iconColor="#00C48C">
          {exports.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '32px 16px',
              border: '1.5px dashed #E5E7EB', borderRadius: 10,
            }}>
              <BarChart3 size={32} strokeWidth={1.5} style={{ color: '#D1D5DB', marginBottom: 10 }} />
              <p style={{ fontSize: 13.5, color: '#9CA3AF', margin: 0, fontFamily: FONT }}>No exports yet</p>
              <p style={{ fontSize: 12, color: '#C4C4CC', margin: '4px 0 0', fontFamily: FONT }}>
                Use the "Export PDF" button in the dashboard to generate reports
              </p>
            </div>
          ) : (
            <>
              {/* Summary row */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16,
              }}>
                {[
                  { label: 'Total exports', value: exports.length, color: '#7C5CFC' },
                  { label: 'This week',     value: exports.filter(e => Date.now() - new Date(e.date) < 7*864e5).length, color: '#0098FF' },
                  { label: 'This month',    value: exports.filter(e => Date.now() - new Date(e.date) < 30*864e5).length, color: '#00C48C' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{
                    background: '#F9FAFB', borderRadius: 10, padding: '12px 14px',
                    border: '1px solid #F0F0F5',
                  }}>
                    <p style={{ fontSize: 22, fontWeight: 700, color, margin: 0, fontFamily: FONT, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
                    <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: '2px 0 0', fontFamily: FONT }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Export list */}
              <div style={{ border: '1px solid #F0F0F5', borderRadius: 10, overflow: 'hidden' }}>
                {exports.slice(0, 10).map((ex, i) => (
                  <div key={ex.id || i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    borderBottom: i < Math.min(exports.length, 10) - 1 ? '1px solid #F5F5F8' : 'none',
                    background: i % 2 === 0 ? '#fff' : '#FAFAFA',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: '#F0EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FileText size={14} strokeWidth={2} color="#7C5CFC" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2937', margin: 0, fontFamily: FONT }}>
                        {ex.label || 'Analytics Report'}
                      </p>
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '1px 0 0', fontFamily: FONT }}>
                        {fmtDate(ex.date)} · {ex.pages || 6} pages
                      </p>
                    </div>
                    <span style={{
                      fontSize: 11.5, fontWeight: 600, padding: '3px 8px',
                      borderRadius: 99, background: '#F0FDF4', color: '#16A34A',
                    }}>
                      PDF
                    </span>
                  </div>
                ))}
                {exports.length > 10 && (
                  <div style={{ padding: '10px 14px', textAlign: 'center', fontSize: 12.5, color: '#9CA3AF', fontFamily: FONT }}>
                    + {exports.length - 10} more exports
                  </div>
                )}
              </div>

              {/* Clear */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                {clearConfirm ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: '#EF4444', fontFamily: FONT }}>Are you sure?</span>
                    <button onClick={clearExports} style={{
                      padding: '6px 12px', borderRadius: 7, border: 'none',
                      background: '#EF4444', color: '#fff', cursor: 'pointer',
                      fontSize: 12.5, fontWeight: 600, fontFamily: FONT,
                    }}>Yes, clear</button>
                    <button onClick={() => setClearConfirm(false)} style={{
                      padding: '6px 12px', borderRadius: 7, border: '1.5px solid #E5E7EB',
                      background: '#fff', color: '#6B7280', cursor: 'pointer',
                      fontSize: 12.5, fontWeight: 500, fontFamily: FONT,
                    }}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setClearConfirm(true)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '7px 14px', borderRadius: 8,
                    border: '1.5px solid #FEE2E2', background: '#FFF5F5',
                    color: '#EF4444', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, fontFamily: FONT,
                  }}>
                    <Trash2 size={12} /> Clear export history
                  </button>
                )}
              </div>
            </>
          )}
        </Section>

        {/* Privacy & Security */}
        <Section title={t('privacy', lang)} subtitle="Manage your data and account security" icon={Shield} iconColor="#F59E0B">
          <Toggle
            label="Store usage data locally"
            sub="Keep token history in your browser's localStorage"
            checked={cfg.storeLocal ?? true}
            onChange={v => update('storeLocal', v)}
            accent="#F59E0B"
          />
          <Toggle
            label="Analytics & error reporting"
            sub="Help improve TokenLens by sharing anonymous usage data"
            checked={cfg.analytics ?? false}
            onChange={v => update('analytics', v)}
            accent="#7C5CFC"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, paddingTop: 8, borderTop: '1px solid #F5F5F8' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              border: '1.5px solid #FEE2E2', background: '#FFF5F5',
              color: '#DC2626', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: FONT,
            }}>
              <AlertTriangle size={13} strokeWidth={2.5} /> Delete account
            </button>
          </div>
        </Section>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
