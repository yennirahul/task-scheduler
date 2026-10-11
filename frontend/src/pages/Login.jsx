import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { Layers, Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, Activity, Zap } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required.'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Password is required.'); return; }

    setLoading(true);
    try {
      const result = await login(email, password);
      // #region agent log
      fetch('http://127.0.0.1:7482/ingest/3ef88146-3d16-4a69-8345-55a8319eeccb',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1fc9a9'},body:JSON.stringify({sessionId:'1fc9a9',runId:'pre-fix',hypothesisId:'H4',location:'Login.jsx:handleSubmit',message:'login success',data:{hasToken:!!result?.token,role:result?.role},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      navigate('/');
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7482/ingest/3ef88146-3d16-4a69-8345-55a8319eeccb',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1fc9a9'},body:JSON.stringify({sessionId:'1fc9a9',runId:'pre-fix',hypothesisId:'H4',location:'Login.jsx:handleSubmit',message:'login failed',data:{status:err.response?.status,apiMessage:err.response?.data?.message,code:err.code,errMessage:err.message},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B1020',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,140,255,0.12) 0%, transparent 70%)', top: '-100px', left: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)', bottom: '-80px', right: '-80px', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', width: '100%', maxWidth: 960, minHeight: 560, borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.07)' }}>

        {/* LEFT: Branding Panel */}
        <div style={{
          flex: '0 0 420px',
          background: 'linear-gradient(160deg, #10172A 0%, #0d1426 60%, #0B1020 100%)',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }} className="auth-branding">
          {/* Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, #4F8CFF 0%, #22D3EE 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(79,140,255,0.35)',
              }}>
                <Layers size={22} color="white" />
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>TaskPulse</span>
            </div>

            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 16 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, marginBottom: 40 }}>
              Sign in to monitor your distributed tasks and worker health in real-time.
            </p>

            {/* Feature pills */}
            {[
              { icon: <Activity size={14} />, label: 'Real-time monitoring' },
              { icon: <Zap size={14} />, label: 'Automatic task recovery' },
              { icon: <ShieldCheck size={14} />, label: 'Role-based access control' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(79,140,255,0.12)', border: '1px solid rgba(79,140,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F8CFF', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 13, color: '#94A3B8' }}>{f.label}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: '#475569' }}>
            Reliable scheduling. Real-time monitoring. Automatic recovery.
          </div>
        </div>

        {/* RIGHT: Form Panel */}
        <div style={{
          flex: 1,
          background: '#151E32',
          padding: '48px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#F1F5F9', marginBottom: 8, letterSpacing: '-0.02em' }}>Sign in to your account</h2>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 32 }}>Enter your credentials to access the dashboard.</p>

          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 10, padding: '12px 16px', color: '#F87171', fontSize: 13, marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px',
                    background: 'rgba(11,16,32,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: '#F1F5F9', fontSize: 14,
                    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#4F8CFF'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '12px 42px 12px 42px',
                    background: 'rgba(11,16,32,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: '#F1F5F9', fontSize: 14,
                    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#4F8CFF'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 10,
                background: loading ? 'rgba(79,140,255,0.5)' : 'linear-gradient(135deg, #4F8CFF 0%, #3B7BEE 100%)',
                color: 'white', fontWeight: 700, fontSize: 15, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: loading ? 'none' : '0 4px 20px rgba(79,140,255,0.35)',
                transition: 'all 0.2s', fontFamily: 'inherit',
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Register link */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
            <span style={{ fontSize: 14, color: '#94A3B8' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{ color: '#4F8CFF', fontWeight: 600, textDecoration: 'none' }}
                onMouseOver={e => e.target.style.textDecoration = 'underline'}
                onMouseOut={e => e.target.style.textDecoration = 'none'}
              >
                Sign Up
              </Link>
            </span>
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
            <ShieldCheck size={13} style={{ color: '#22C55E' }} /> Secured with JWT & Spring Security
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) { .auth-branding { display: none !important; } }
        input::placeholder { color: #475569; }
      `}</style>
    </div>
  );
};

export default Login;
