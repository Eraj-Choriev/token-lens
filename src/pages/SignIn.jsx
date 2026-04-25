import { useState } from 'react';
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle, Mail, Lock } from 'lucide-react';

const FONT = "'Inter', ui-sans-serif, system-ui";
const PURPLE = '#7C5CFC';

/* ── Analytical dashboard background ─────────────────────────── */
function Background() {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Very light warm base */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#FAF9FF 0%,#F5F3FF 35%,#F0F4FF 65%,#F5FBFF 100%)' }} />

      {/* Soft orbs */}
      <div style={{ position:'absolute', top:'-8%', right:'-4%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,92,252,0.10) 0%,transparent 68%)', animation:'orbA 14s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:'-10%', left:'-6%', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,152,255,0.08) 0%,transparent 68%)', animation:'orbA 18s ease-in-out infinite reverse' }} />

      {/* ── Decorative mini bar chart (bottom-right) ── */}
      <svg style={{ position:'absolute', right:'6%', bottom:'12%', opacity:0.10 }} width="180" height="110" viewBox="0 0 180 110">
        {[35,58,42,75,50,88,65,78,45,92].map((h,i) => (
          <rect key={i} x={i*17+4} y={110-h} width="11" height={h} rx="3" fill={PURPLE} />
        ))}
        <line x1="0" y1="109" x2="180" y2="109" stroke={PURPLE} strokeWidth="1" strokeDasharray="3,3" />
      </svg>

      {/* ── Decorative line chart (top-left) ── */}
      <svg style={{ position:'absolute', left:'4%', top:'8%', opacity:0.08 }} width="220" height="90" viewBox="0 0 220 90">
        <defs>
          <linearGradient id="siLG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.3" />
            <stop offset="100%" stopColor={PURPLE} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d="M0,70 C30,55 50,40 80,48 C110,56 130,18 180,22 L220,18" fill="none" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M0,70 C30,55 50,40 80,48 C110,56 130,18 180,22 L220,18 L220,90 L0,90 Z" fill="url(#siLG)" />
      </svg>

      {/* ── Floating stat pills ── */}
      {[
        { top:'14%', right:'18%', label:'128.4K', sub:'tokens today', color:'#7C5CFC' },
        { top:'62%', left:'5%',   label:'$0.84',  sub:'today\'s cost',  color:'#00C48C' },
        { bottom:'20%', right:'4%', label:'98.2%', sub:'efficiency',   color:'#0098FF' },
      ].map((p,i) => (
        <div key={i} style={{
          position:'absolute', ...p, sub:undefined, label:undefined, color:undefined,
          top: p.top, right: p.right, left: p.left, bottom: p.bottom,
          background:'rgba(255,255,255,0.72)', backdropFilter:'blur(8px)',
          border:'1px solid rgba(255,255,255,0.9)',
          borderRadius:10, padding:'8px 12px', opacity:0.55,
          animation:`orbA ${11+i*2}s ease-in-out infinite ${i}s`,
          boxShadow:'0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <p style={{ fontSize:15, fontWeight:700, color:p.color, margin:0, fontFamily:FONT, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>{p.label}</p>
          <p style={{ fontSize:10, color:'#9CA3AF', margin:0, fontFamily:FONT }}>{p.sub}</p>
        </div>
      ))}

      {/* Fine dot grid */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.025 }}>
        <defs><pattern id="siGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="#7C5CFC" />
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#siGrid)" />
      </svg>
    </div>
  );
}

function Field({ id, label, icon: Icon, type, placeholder, value, onChange, error, right, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display:'block', marginBottom:6, fontSize:12.5, fontWeight:600, color:'#374151', fontFamily:FONT, letterSpacing:'0.01em' }}>
        {label}
      </label>
      <div style={{
        display:'flex', alignItems:'center',
        border:`1.5px solid ${error ? '#FCA5A5' : focused ? PURPLE : '#E5E7EB'}`,
        borderRadius:10, background: focused ? '#FDFCFF' : '#F9FAFB',
        boxShadow: focused ? `0 0 0 3px rgba(124,92,252,0.10)` : 'none',
        transition:'border-color 0.15s,box-shadow 0.15s,background 0.15s', overflow:'hidden',
      }}>
        <span style={{ width:40, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color: focused ? PURPLE : error ? '#F87171' : '#9CA3AF', transition:'color 0.15s' }}>
          <Icon size={14} strokeWidth={2} />
        </span>
        <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex:1, border:'none', outline:'none', background:'transparent', padding:'12px 0', fontSize:13.5, color:'#111827', fontFamily:FONT, letterSpacing:'-0.005em' }}
        />
        {right && <span style={{ paddingRight:2 }}>{right}</span>}
      </div>
      {error && (
        <p style={{ display:'flex', alignItems:'center', gap:4, marginTop:5, color:'#DC2626', fontSize:11.5, fontFamily:FONT }}>
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

export default function SignIn({ onSignIn, onGoSignUp }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const validate = () => {
    const e = {};
    if (!email)                            e.email    = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = 'Enter a valid email';
    if (!password)                          e.password = 'Password is required';
    else if (password.length < 6)           e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    if (remember) localStorage.setItem('tl_auth', JSON.stringify({ email }));
    onSignIn({ email });
  };

  return (
    <>
      <Background />
      <div style={{ position:'relative', zIndex:1, width:'100%', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', fontFamily:FONT }}>
        <div style={{
          width:'100%', maxWidth:400,
          background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          borderRadius:18, border:'1px solid rgba(255,255,255,0.95)',
          boxShadow:`0 24px 64px rgba(124,92,252,0.10), 0 2px 16px rgba(0,0,0,0.06)`,
          padding:36, animation:'cardIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          {/* Brand */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:28 }}>
            <div style={{
              width:50, height:50, borderRadius:14,
              background:`linear-gradient(135deg,${PURPLE},#A78BFA)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 6px 20px rgba(124,92,252,0.32)`, marginBottom:14,
            }}>
              <Zap size={22} strokeWidth={2.5} color="#fff" />
            </div>
            <h1 style={{ fontSize:20, fontWeight:700, color:'#0F172A', letterSpacing:'-0.03em', margin:'0 0 5px', textAlign:'center', fontFamily:FONT }}>
              Sign in to TokenLens
            </h1>
            <p style={{ fontSize:13, color:'#6B7280', margin:0, textAlign:'center', fontFamily:FONT }}>
              New here?{' '}
              <button onClick={onGoSignUp} style={{ color:PURPLE, fontWeight:700, background:'none', border:'none', cursor:'pointer', padding:0, fontSize:13, fontFamily:FONT }}>
                Create an account
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <Field id="si-email" label="Email address" icon={Mail} type="email" placeholder="you@example.com"
              value={email} onChange={e => { setEmail(e.target.value); setErrors(r=>({...r,email:''})); }}
              error={errors.email} autoComplete="email" />
            <Field id="si-password" label="Password" icon={Lock} type={showPw?'text':'password'} placeholder="Your password"
              value={password} onChange={e => { setPassword(e.target.value); setErrors(r=>({...r,password:''})); }}
              error={errors.password} autoComplete="current-password"
              right={
                <button type="button" onClick={()=>setShowPw(s=>!s)} style={{ background:'none',border:'none',cursor:'pointer',padding:'8px 10px',color:'#9CA3AF',display:'flex',alignItems:'center' }}>
                  {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              }
            />

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, marginTop:-4 }}>
              <label style={{ display:'flex', alignItems:'center', gap:7, cursor:'pointer', userSelect:'none' }}>
                <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}
                  style={{ width:14, height:14, accentColor:PURPLE, cursor:'pointer' }} />
                <span style={{ fontSize:12.5, color:'#6B7280', fontFamily:FONT }}>Remember me</span>
              </label>
              <button type="button" style={{ fontSize:12.5, color:PURPLE, fontWeight:600, background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:FONT }}>
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              width:'100%', padding:'12px 20px',
              background:`linear-gradient(135deg,${PURPLE},#5B21B6)`,
              color:'#fff', border:'none', borderRadius:10,
              fontSize:14, fontWeight:600, letterSpacing:'-0.01em',
              cursor:loading?'not-allowed':'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:7,
              boxShadow:loading?'none':`0 4px 16px rgba(124,92,252,0.38)`,
              opacity:loading?0.8:1, transition:'opacity 0.15s', fontFamily:FONT,
            }}
              onMouseEnter={e=>{ if(!loading) e.currentTarget.style.opacity='0.88'; }}
              onMouseLeave={e=>{ e.currentTarget.style.opacity=loading?'0.8':'1'; }}
            >
              {loading ? <><Spinner/>Signing in…</> : <>Sign In <ArrowRight size={15} strokeWidth={2.5}/></>}
            </button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0' }}>
            <div style={{ flex:1, height:1, background:'#F3F4F6' }} />
            <span style={{ fontSize:11, color:'#9CA3AF', fontWeight:600, letterSpacing:'0.05em', fontFamily:FONT }}>OR</span>
            <div style={{ flex:1, height:1, background:'#F3F4F6' }} />
          </div>

          {/* Google only */}
          <button type="button" style={{
            width:'100%', padding:'10px 16px', border:`1.5px solid #E5E7EB`,
            borderRadius:10, background:'#F9FAFB', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            fontSize:13.5, fontWeight:600, color:'#374151', fontFamily:FONT,
            transition:'border-color 0.12s,box-shadow 0.12s,background 0.12s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=PURPLE; e.currentTarget.style.background='#fff'; e.currentTarget.style.boxShadow=`0 0 0 3px rgba(124,92,252,0.08)`; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.background='#F9FAFB'; e.currentTarget.style.boxShadow='none'; }}
          >
            <GoogleIcon /> Continue with Google
          </button>

          <p style={{ textAlign:'center', fontSize:11.5, color:'#9CA3AF', marginTop:20, marginBottom:0, fontFamily:FONT }}>
            © 2025 TokenLens · All rights reserved
          </p>
        </div>
      </div>
      <style>{`
        @keyframes cardIn { from{opacity:0;transform:translateY(20px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes orbA { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.04)} }
        @keyframes tlSpin { to{transform:rotate(360deg)} }
      `}</style>
    </>
  );
}

function Spinner() {
  return <span style={{ width:15,height:15,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',flexShrink:0,animation:'tlSpin 0.7s linear infinite',marginRight:4 }} />;
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
