import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { Layers, Eye, EyeOff, Mail, Lock, User, ArrowRight, ShieldCheck, Activity, Zap, CheckCircle } from 'lucide-react';

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '#475569' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { score: 0, label: '', color: '#475569' },
    { score: 1, label: 'Weak', color: '#F87171' },
    { score: 2, label: 'Fair', color: '#FB923C' },
    { score: 3, label: 'Good', color: '#FACC15' },
    { score: 4, label: 'Strong', color: '#22C55E' },
  ];
  return levels[score];
};

export const Register = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      await register({ fullName: form.fullName, email: form.email, password: form.password });
      navigate('/login?registered=true');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '12px 14px 12px 42px',
    background: 'rgba(11,16,32,0.6)',
    border: `1px solid ${hasError ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 10, color: '#F1F5F9', fontSize: 14,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

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
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)', top: '-100px', right: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,140,255,0.08) 0%, transparent 70%)', bottom: '-80px', left: '-80px', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', width: '100%', maxWidth: 960, borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.07)' }}>

        {/* LEFT: Branding Panel */}
        <div style={{
          flex: '0 0 400px',
          background: 'linear-gradient(160deg, #10172A 0%, #0d1426 60%, #0B1020 100%)',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }} className="auth-branding">
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

            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 16 }}>
              Create your<br />TaskPulse account
            </h1>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, marginBottom: 36 }}>
              Start managing scheduled jobs, monitoring distributed workers, and tracking task execution from one dashboard.
            </p>

            {[
              { icon: <Activity size={14} />, label: 'Monitor worker heartbeats' },
              { icon: <Zap size={14} />, label: 'Intelligent job dispatching' },
              { icon: <CheckCircle size={14} />, label: 'Execution history & audit logs' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE', flexShrink: 0 }}>
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
          padding: '44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#F1F5F9', marginBottom: 6, letterSpacing: '-0.02em' }}>Create your account</h2>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 28 }}>Fill in the details below to get started.</p>

          {apiError && (
            <div style={{
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 10, padding: '12px 16px', color: '#F87171', fontSize: 13, marginBottom: 20,
            }}>
              ⚠ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 7 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type="text" value={form.fullName} onChange={handleChange('fullName')} placeholder="Jane Smith" autoComplete="name"
                  style={inputStyle(errors.fullName)}
                  onFocus={e => e.target.style.borderColor = '#4F8CFF'}
                  onBlur={e => e.target.style.borderColor = errors.fullName ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}
                />
              </div>
              {errors.fullName && <p style={{ fontSize: 12, color: '#F87171', marginTop: 5 }}>{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 7 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type="email" value={form.email} onChange={handleChange('email')} placeholder="you@example.com" autoComplete="email"
                  style={inputStyle(errors.email)}
                  onFocus={e => e.target.style.borderColor = '#4F8CFF'}
                  onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}
                />
              </div>
              {errors.email && <p style={{ fontSize: 12, color: '#F87171', marginTop: 5 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 7 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange('password')} placeholder="Min. 8 characters" autoComplete="new-password"
                  style={{ ...inputStyle(errors.password), paddingRight: 42 }}
                  onFocus={e => e.target.style.borderColor = '#4F8CFF'}
                  onBlur={e => e.target.style.borderColor = errors.password ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: strength.color, marginTop: 4 }}>
                    {strength.label} — use uppercase, numbers & symbols for a strong password
                  </p>
                </div>
              )}
              {errors.password && <p style={{ fontSize: 12, color: '#F87171', marginTop: 5 }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 7 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="Re-enter password" autoComplete="new-password"
                  style={{ ...inputStyle(errors.confirmPassword), paddingRight: 42 }}
                  onFocus={e => e.target.style.borderColor = '#4F8CFF'}
                  onBlur={e => e.target.style.borderColor = errors.confirmPassword ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, display: 'flex' }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p style={{ fontSize: 12, color: '#F87171', marginTop: 5 }}>{errors.confirmPassword}</p>}
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
                fontFamily: 'inherit',
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Login link */}
          <div style={{ marginTop: 28, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
            <span style={{ fontSize: 14, color: '#94A3B8' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#4F8CFF', fontWeight: 600, textDecoration: 'none' }}
                onMouseOver={e => e.target.style.textDecoration = 'underline'}
                onMouseOut={e => e.target.style.textDecoration = 'none'}>
                Login
              </Link>
            </span>
          </div>

          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
            <ShieldCheck size={13} style={{ color: '#22C55E' }} /> Passwords encrypted with BCrypt
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

export default Register;
