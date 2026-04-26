import { useState, useRef } from 'react';
import { Camera, Save, User, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { t } from '../lib/i18n';

const FONT = "'Inter', ui-sans-serif, system-ui";

const LANG_OPTIONS = [
  { value: 'en', flag: '🇬🇧', label: 'English' },
  { value: 'ru', flag: '🇷🇺', label: 'Русский' },
];

function getSettings() {
  try { return JSON.parse(localStorage.getItem('tl_settings') || '{}'); } catch { return {}; }
}

function Avatar({ src, initials, size = 88 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: src ? 'transparent' : 'linear-gradient(135deg,#7C5CFC,#A78BFA)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', flexShrink: 0,
      boxShadow: '0 4px 20px rgba(124,92,252,0.28)',
    }}>
      {src
        ? <img src={src} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ color: '#fff', fontSize: size * 0.33, fontWeight: 700, fontFamily: FONT, letterSpacing: '-0.02em' }}>
            {initials}
          </span>
      }
    </div>
  );
}

function FormField({ label, icon: Icon, type = 'text', value, onChange, placeholder, hint, readOnly }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: FONT, letterSpacing: '0.01em' }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: type === 'textarea' ? 'flex-start' : 'center',
        border: `1.5px solid ${focused ? '#7C5CFC' : '#E5E7EB'}`,
        borderRadius: 10, background: readOnly ? '#F9FAFB' : focused ? '#FDFCFF' : '#F9FAFB',
        boxShadow: focused && !readOnly ? '0 0 0 3px rgba(124,92,252,0.10)' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        overflow: 'hidden', opacity: readOnly ? 0.7 : 1,
      }}>
        {Icon && (
          <span style={{
            width: 40, paddingTop: type === 'textarea' ? 12 : 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            color: focused ? '#7C5CFC' : '#9CA3AF', transition: 'color 0.15s',
          }}>
            <Icon size={14} strokeWidth={2} />
          </span>
        )}
        {type === 'textarea' ? (
          <textarea
            rows={3}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              padding: '11px 12px 11px 0', fontSize: 13.5, color: '#111827',
              fontFamily: FONT, resize: 'vertical', minHeight: 72,
            }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              padding: '11px 12px 11px 0', fontSize: 13.5, color: '#111827',
              fontFamily: FONT, letterSpacing: '-0.005em',
            }}
          />
        )}
      </div>
      {hint && <p style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 4, fontFamily: FONT }}>{hint}</p>}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      border: '1px solid rgba(124,92,252,0.1)', padding: 28,
      boxShadow: '0 4px 24px rgba(124,92,252,0.07), 0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px', fontFamily: FONT, letterSpacing: '-0.02em' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, fontFamily: FONT }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

export default function Profile({ user, onUpdateUser, lang = 'en', onLanguageChange }) {
  const fileRef = useRef(null);

  const [avatar, setAvatar] = useState(() => {
    try { return localStorage.getItem('tl_avatar') || ''; } catch { return ''; }
  });
  const [name,     setName]     = useState(user?.name     || '');
  const [email,    setEmail]    = useState(user?.email    || '');
  const [username, setUsername] = useState(user?.username || email?.split('@')[0] || '');
  const [bio,      setBio]      = useState(user?.bio      || '');
  const [language, setLanguage] = useState(lang);

  const [saved,  setSaved]  = useState(false);
  const [saving, setSaving] = useState(false);

  const initials = (name || email || 'U').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  const handlePhotoChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      setAvatar(dataUrl);
      localStorage.setItem('tl_avatar', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    localStorage.removeItem('tl_avatar');
  };

  const handleLangSelect = (val) => {
    setLanguage(val);
    onLanguageChange?.(val);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    const updated = { ...user, name, email, username, bio, language };
    localStorage.setItem('tl_auth', JSON.stringify(updated));
    onUpdateUser(updated);
    onLanguageChange?.(language);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', fontFamily: FONT }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em', margin: '0 0 4px', fontFamily: FONT }}>
          {t('my_profile', lang)}
        </h1>
        <p style={{ fontSize: 13.5, color: '#6B7280', margin: 0 }}>
          {t('profile_sub', lang)}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Avatar section */}
        <Section title={t('profile_photo', lang)} subtitle={t('profile_photo_sub', lang)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Avatar src={avatar} initials={initials} size={80} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                JPG, PNG or GIF · Max 5MB
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 8,
                    background: 'linear-gradient(135deg,#7C5CFC,#6D28D9)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, fontFamily: FONT,
                    boxShadow: '0 2px 10px rgba(124,92,252,0.28)',
                  }}
                >
                  <Camera size={13} strokeWidth={2.5} /> Change Photo
                </button>
                {avatar && (
                  <button
                    onClick={handleRemovePhoto}
                    style={{
                      padding: '7px 14px', borderRadius: 8,
                      border: '1.5px solid #E5E7EB', background: '#F9FAFB',
                      color: '#6B7280', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: FONT,
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
        </Section>

        {/* Personal info */}
        <Section title={t('personal_info', lang)} subtitle={t('personal_info_sub', lang)}>
          <FormField
            label={t('full_name', lang)} icon={User} value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Doe"
          />
          <FormField
            label={t('email_address', lang)} icon={Mail} type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            hint="Your email is used for sign-in and notifications"
          />
          <FormField
            label={t('username', lang)} icon={User} value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="johndoe"
            hint="Used as your display handle"
          />
          <FormField
            label={t('bio', lang)} icon={FileText} type="textarea" value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself…"
          />
        </Section>

        {/* Preferences — language only */}
        <Section title={t('preferences', lang)} subtitle={t('preferences_sub', lang)}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 10, fontFamily: FONT, letterSpacing: '0.01em' }}>
              {t('language', lang)}
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {LANG_OPTIONS.map(({ value, flag, label: optLabel }) => {
                const active = language === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleLangSelect(value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
                      border: `2px solid ${active ? '#7C5CFC' : '#E5E7EB'}`,
                      background: active ? 'linear-gradient(135deg,rgba(124,92,252,0.08),rgba(167,139,250,0.06))' : '#F9FAFB',
                      color: active ? '#7C5CFC' : '#6B7280',
                      fontFamily: FONT, fontSize: 14, fontWeight: active ? 700 : 500,
                      boxShadow: active ? '0 0 0 3px rgba(124,92,252,0.12), 0 2px 8px rgba(124,92,252,0.15)' : 'none',
                      transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                      transform: active ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{flag}</span>
                    <span>{optLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Save bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', borderRadius: 16, padding: '16px 24px',
          border: '1px solid rgba(124,92,252,0.1)',
          boxShadow: '0 4px 24px rgba(124,92,252,0.07)',
        }}>
          {saved ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#10B981', fontSize: 13.5, fontWeight: 600, fontFamily: FONT }}>
              <CheckCircle2 size={16} /> {t('changes_saved', lang)}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, fontFamily: FONT }}>
              {t('unsaved', lang)}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 22px', borderRadius: 10,
              background: 'linear-gradient(135deg,#7C5CFC,#6D28D9)',
              color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: FONT,
              boxShadow: '0 4px 14px rgba(124,92,252,0.30)',
              opacity: saving ? 0.8 : 1, transition: 'opacity 0.15s',
              letterSpacing: '-0.01em',
            }}
          >
            {saving
              ? <><Spinner /> {t('saving', lang)}</>
              : <><Save size={14} strokeWidth={2.5} /> {t('save_changes', lang)}</>
            }
          </button>
        </div>
      </div>
      <style>{`@keyframes tlSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      width: 14, height: 14, border: '2px solid rgba(255,255,255,0.35)',
      borderTopColor: '#fff', borderRadius: '50%',
      display: 'inline-block', flexShrink: 0,
      animation: 'tlSpin 0.7s linear infinite',
    }} />
  );
}
