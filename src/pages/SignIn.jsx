import { useState } from 'react';
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle, Mail, Lock } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import { signInWithEmail, signInWithGoogle, firebaseErrorMessage } from '../lib/firebase';

const FONT = "'Inter', ui-sans-serif, system-ui";
const PURPLE = '#7C5CFC';

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

export default function SignIn({ onSignIn, onGoSignUp, onGoForgot }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email)                            e.email    = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = 'Enter a valid email';
    if (!password)                          e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const credential = await signInWithEmail(email, password);
      const fbUser = credential.user;
      if (remember) localStorage.setItem('tl_remember', '1');
      onSignIn({ email: fbUser.email, name: fbUser.displayName, photoURL: fbUser.photoURL, uid: fbUser.uid });
    } catch (err) {
      setErrors({ form: firebaseErrorMessage(err.code) });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setErrors({});
    try {
      const credential = await signInWithGoogle();
      const fbUser = credential.user;
      onSignIn({ email: fbUser.email, name: fbUser.displayName, photoURL: fbUser.photoURL, uid: fbUser.uid });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrors({ form: firebaseErrorMessage(err.code) });
      }
    } finally {
      setGoogleLoading(false);
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

          {errors.form && (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#FEF2F2', border:'1px solid #FCA5A5', borderRadius:10, marginBottom:16 }}>
              <AlertCircle size={14} color="#DC2626" style={{ flexShrink:0 }} />
              <span style={{ fontSize:12.5, color:'#DC2626', fontFamily:FONT }}>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Field id="si-email" label="Email address" icon={Mail} type="email" placeholder="you@example.com"
              value={email} onChange={e => { setEmail(e.target.value); setErrors(r=>({...r,email:'',form:''})); }}
              error={errors.email} autoComplete="email" />
            <Field id="si-password" label="Password" icon={Lock} type={showPw?'text':'password'} placeholder="Your password"
              value={password} onChange={e => { setPassword(e.target.value); setErrors(r=>({...r,password:'',form:''})); }}
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
              <button type="button" onClick={onGoForgot} style={{ fontSize:12.5, color:PURPLE, fontWeight:600, background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:FONT }}>
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading || googleLoading} style={{
              width:'100%', padding:'12px 20px',
              background:`linear-gradient(135deg,${PURPLE},#5B21B6)`,
              color:'#fff', border:'none', borderRadius:10,
              fontSize:14, fontWeight:600, letterSpacing:'-0.01em',
              cursor:(loading||googleLoading)?'not-allowed':'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:7,
              boxShadow:loading?'none':`0 4px 16px rgba(124,92,252,0.38)`,
              opacity:(loading||googleLoading)?0.8:1, transition:'opacity 0.15s', fontFamily:FONT,
            }}
              onMouseEnter={e=>{ if(!loading&&!googleLoading) e.currentTarget.style.opacity='0.88'; }}
              onMouseLeave={e=>{ e.currentTarget.style.opacity=(loading||googleLoading)?'0.8':'1'; }}
            >
              {loading ? <><Spinner/>Signing in…</> : <>Sign In <ArrowRight size={15} strokeWidth={2.5}/></>}
            </button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0' }}>
            <div style={{ flex:1, height:1, background:'#F3F4F6' }} />
            <span style={{ fontSize:11, color:'#9CA3AF', fontWeight:600, letterSpacing:'0.05em', fontFamily:FONT }}>OR</span>
            <div style={{ flex:1, height:1, background:'#F3F4F6' }} />
          </div>

          <button type="button" disabled={loading || googleLoading} onClick={handleGoogle} style={{
            width:'100%', padding:'10px 16px', border:`1.5px solid #E5E7EB`,
            borderRadius:10, background:'#F9FAFB', cursor:(loading||googleLoading)?'not-allowed':'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            fontSize:13.5, fontWeight:600, color:'#374151', fontFamily:FONT,
            opacity:(loading||googleLoading)?0.7:1,
            transition:'border-color 0.12s,box-shadow 0.12s,background 0.12s,opacity 0.12s',
          }}
            onMouseEnter={e=>{ if(!loading&&!googleLoading){ e.currentTarget.style.borderColor=PURPLE; e.currentTarget.style.background='#fff'; e.currentTarget.style.boxShadow=`0 0 0 3px rgba(124,92,252,0.08)`; }}}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.background='#F9FAFB'; e.currentTarget.style.boxShadow='none'; }}
          >
            {googleLoading ? <><Spinner dark />Connecting…</> : <><GoogleIcon /> Continue with Google</>}
          </button>

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

function Spinner({ dark }) {
  const c = dark ? 'rgba(100,100,100,0.3)' : 'rgba(255,255,255,0.3)';
  const tc = dark ? '#555' : '#fff';
  return <span style={{ width:15,height:15,border:`2px solid ${c}`,borderTopColor:tc,borderRadius:'50%',display:'inline-block',flexShrink:0,animation:'tlSpin 0.7s linear infinite',marginRight:4 }} />;
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
