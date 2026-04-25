import { useState, useRef } from 'react';
import { Camera, Save, User, Mail, FileText, Globe, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const FONT = "'Inter', ui-sans-serif, system-ui";

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
      border: '1px solid #F0F0F5', padding: 28,
      boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
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

export default function Profile({ user, onUpdateUser }) {
  const fileRef = useRef(null);

  const [avatar, setAvatar] = useState(() => {
    try { return localStorage.getItem('tl_avatar') || ''; } catch { return ''; }
  });
  const [name,     setName]     = useState(user?.name     || '');
  const [email,    setEmail]    = useState(user?.email    || '');
  const [username, setUsername] = useState(user?.username || email?.split('@')[0] || '');
  const [bio,      setBio]      = useState(user?.bio      || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');
  const [language, setLanguage] = useState(user?.language || 'English');

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

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    const updated = { ...user, name, email, username, bio, timezone, language };
    localStorage.setItem('tl_auth', JSON.stringify(updated));
    onUpdateUser(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', fontFamily: FONT }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em', margin: '0 0 4px', fontFamily: FONT }}>
          My Profile
        </h1>
        <p style={{ fontSize: 13.5, color: '#6B7280', margin: 0 }}>
          Manage your personal information and preferences
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Avatar section */}
        <Section title="Profile Photo" subtitle="Upload a photo to personalize your account">
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
        <Section title="Personal Information" subtitle="Your name and contact details">
          <FormField
            label="Full Name" icon={User} value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Doe"
          />
          <FormField
            label="Email Address" icon={Mail} type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            hint="Your email is used for sign-in and notifications"
          />
          <FormField
            label="Username" icon={User} value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="johndoe"
            hint="Used as your display handle"
          />
          <FormField
            label="Bio" icon={FileText} type="textarea" value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself…"
          />
        </Section>

        {/* Preferences */}
        <Section title="Preferences" subtitle="Localization and display settings">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: FONT, letterSpacing: '0.01em' }}>
                Language
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 0,
                border: '1.5px solid #E5E7EB', borderRadius: 10, overflow: 'hidden',
                background: '#F9FAFB',
              }}>
                <span style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                  <Globe size={14} strokeWidth={2} />
                </span>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    padding: '11px 8px 11px 0', fontSize: 13.5, color: '#111827', fontFamily: FONT,
                    cursor: 'pointer',
                  }}
                >
                  {['English','Spanish','French','German','Japanese','Chinese','Portuguese'].map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: FONT, letterSpacing: '0.01em' }}>
                Timezone
              </label>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '1.5px solid #E5E7EB', borderRadius: 10, overflow: 'hidden',
                background: '#F9FAFB',
              }}>
                <span style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                  <Clock size={14} strokeWidth={2} />
                </span>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    padding: '11px 8px 11px 0', fontSize: 13.5, color: '#111827', fontFamily: FONT,
                    cursor: 'pointer',
                  }}
                >
                  {['UTC','UTC-5 (EST)','UTC-8 (PST)','UTC+1 (CET)','UTC+3 (MSK)','UTC+5:30 (IST)','UTC+8 (CST)','UTC+9 (JST)'].map(tz => (
                    <option key={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Section>

        {/* Save bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', borderRadius: 16, padding: '16px 24px',
          border: '1px solid #F0F0F5', boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        }}>
          {saved ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#10B981', fontSize: 13.5, fontWeight: 600, fontFamily: FONT }}>
              <CheckCircle2 size={16} /> Changes saved successfully
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, fontFamily: FONT }}>
              Unsaved changes will be lost
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
              ? <><Spinner /> Saving…</>
              : <><Save size={14} strokeWidth={2.5} /> Save Changes</>
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
