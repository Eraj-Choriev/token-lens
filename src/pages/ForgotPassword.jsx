import { useState } from 'react';
import { Mail, ArrowLeft, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import { resetPassword, firebaseErrorMessage } from '../lib/firebase';

const FONT   = "'Inter', ui-sans-serif, system-ui";
const PURPLE = '#7C5CFC';

export default function ForgotPassword({ onGoSignIn }) {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = async ev => {
    ev.preventDefault();
    if (!email) { setError('Email address is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address'); return; }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(firebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthBackground />
      <div style={{ position:'relative', zIndex:1, width:'100%', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', fontFamily:FONT }}>
        <div style={{
          width:'100%', maxWidth:400,
          background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          borderRadius:18, border:'1px solid rgba(255,255,255,0.95)',
          boxShadow:'0 24px 64px rgba(124,92,252,0.10), 0 2px 16px rgba(0,0,0,0.06)',
          padding:36, animation:'cardIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>

          {/* Brand */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:28 }}>
            <div style={{
              width:50, height:50, borderRadius:14,
              background:`linear-gradient(135deg,${PURPLE},#A78BFA)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 6px 20px rgba(124,92,252,0.32)', marginBottom:14,
            }}>
              <Zap size={22} strokeWidth={2.5} color="#fff" />
            </div>
            <h1 style={{ fontSize:20, fontWeight:700, color:'#0F172A', letterSpacing:'-0.03em', margin:'0 0 6px', textAlign:'center', fontFamily:FONT }}>
              {sent ? 'Check your email' : 'Reset your password'}
            </h1>
            <p style={{ fontSize:13, color:'#6B7280', margin:0, textAlign:'center', lineHeight:1.6, fontFamily:FONT }}>
              {sent
                ? <>We sent a reset link to <strong style={{ color:'#374151' }}>{email}</strong>.<br/>Click the link in the email to set a new password.</>
                : "Enter your account email and we'll send you a reset link."
              }
            </p>
          </div>

          {sent ? (
            /* ── Success state ── */
            <div>
              <div style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:12,
                padding:'24px 20px', background:'#F0FDF4', borderRadius:14,
                border:'1px solid #BBF7D0', marginBottom:20,
              }}>
                <CheckCircle2 size={36} color="#16A34A" strokeWidth={1.8} />
                <p style={{ fontSize:13, color:'#166534', textAlign:'center', margin:0, lineHeight:1.6, fontFamily:FONT }}>
                  Didn't receive it? Check your spam folder or{' '}
                  <button
                    onClick={() => { setSent(false); setEmail(''); }}
                    style={{ color:PURPLE, fontWeight:700, background:'none', border:'none', cursor:'pointer', padding:0, fontSize:13, fontFamily:FONT }}
                  >
                    try a different email
                  </button>.
                </p>
              </div>

              <button onClick={onGoSignIn} style={{
                width:'100%', padding:'12px 20px',
                background:`linear-gradient(135deg,${PURPLE},#5B21B6)`,
                color:'#fff', border:'none', borderRadius:10,
                fontSize:14, fontWeight:600, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                boxShadow:'0 4px 16px rgba(124,92,252,0.38)', fontFamily:FONT,
              }}>
                Back to Sign In
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#FEF2F2', border:'1px solid #FCA5A5', borderRadius:10, marginBottom:16 }}>
                  <AlertCircle size={14} color="#DC2626" style={{ flexShrink:0 }} />
                  <span style={{ fontSize:12.5, color:'#DC2626', fontFamily:FONT }}>{error}</span>
                </div>
              )}

              {/* Email field */}
              <div style={{ marginBottom:20 }}>
                <label htmlFor="fp-email" style={{ display:'block', marginBottom:6, fontSize:12.5, fontWeight:600, color:'#374151', fontFamily:FONT, letterSpacing:'0.01em' }}>
                  Email address
                </label>
                <div style={{
                  display:'flex', alignItems:'center',
                  border:`1.5px solid ${error ? '#FCA5A5' : focused ? PURPLE : '#E5E7EB'}`,
                  borderRadius:10, background:focused ? '#FDFCFF' : '#F9FAFB',
                  boxShadow:focused ? '0 0 0 3px rgba(124,92,252,0.10)' : 'none',
                  transition:'border-color 0.15s,box-shadow 0.15s,background 0.15s', overflow:'hidden',
                }}>
                  <span style={{ width:40, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:focused ? PURPLE : error ? '#F87171' : '#9CA3AF', transition:'color 0.15s' }}>
                    <Mail size={14} strokeWidth={2} />
                  </span>
                  <input
                    id="fp-email" type="email" placeholder="you@example.com"
                    value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                    autoComplete="email"
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{ flex:1, border:'none', outline:'none', background:'transparent', padding:'12px 0', fontSize:13.5, color:'#111827', fontFamily:FONT }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'12px 20px',
                background:`linear-gradient(135deg,${PURPLE},#5B21B6)`,
                color:'#fff', border:'none', borderRadius:10,
                fontSize:14, fontWeight:600, letterSpacing:'-0.01em',
                cursor:loading ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                boxShadow:loading ? 'none' : '0 4px 16px rgba(124,92,252,0.38)',
                opacity:loading ? 0.8 : 1, transition:'opacity 0.15s', fontFamily:FONT,
                marginBottom:16,
              }}>
                {loading ? <><Spinner />Sending…</> : 'Send Reset Link'}
              </button>

              <button type="button" onClick={onGoSignIn} style={{
                width:'100%', padding:'10px 16px', border:'1.5px solid #E5E7EB',
                borderRadius:10, background:'#F9FAFB', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                fontSize:13.5, fontWeight:600, color:'#374151', fontFamily:FONT,
                transition:'border-color 0.12s,background 0.12s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = PURPLE; e.currentTarget.style.background = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; }}
              >
                <ArrowLeft size={14} strokeWidth={2.5} /> Back to Sign In
              </button>
            </form>
          )}

          <p style={{ textAlign:'center', fontSize:11.5, color:'#9CA3AF', marginTop:20, marginBottom:0, fontFamily:FONT }}>
            © 2025 TokenLens · All rights reserved
          </p>
        </div>
      </div>
      <style>{`
        @keyframes tlSpin{to{transform:rotate(360deg)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(18px) scale(0.98)}to{opacity:1;transform:none}}
      `}</style>
    </>
  );
}

function Spinner() {
  return <span style={{ width:15,height:15,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',flexShrink:0,animation:'tlSpin 0.7s linear infinite',marginRight:4 }} />;
}
