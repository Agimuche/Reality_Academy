import React, { useState } from 'react';
import { BRAND } from './constants';
import { RealityLogo, DotBorder, FormField, Icon } from './components';
import { useStore } from './store';

export default function LoginPage() {
  const { login, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const demoLogins = [
    { label: 'Student', email: 'chidera@email.com', pass: 'student123', color: BRAND.blue, icon: 'grad' },
    { label: 'Instructor', email: 'samuel@reality.edu', pass: 'instructor123', color: BRAND.purple, icon: 'book' },
    { label: 'Admin', email: 'admin@reality.edu', pass: 'admin123', color: BRAND.red, icon: 'shield' },
  ];

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const user = login(email, password);
    setLoading(false);
    if (!user) {
      setError('Invalid email or password. Try one of the demo accounts below.');
    } else {
      showToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: BRAND.gray50 }}>
      <DotBorder />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>

          {/* Hero Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex' }}>
              <RealityLogo scale={1.5} />
            </div>
            <p style={{ fontSize: 12, color: BRAND.gray400, marginTop: 12, fontWeight: 500, letterSpacing: '0.04em' }}>
              UNLOCKING TOMORROW'S OPPORTUNITIES
            </p>
          </div>

          <div className="card" style={{ padding: '34px 36px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Welcome Back 👋</h2>
            <p style={{ fontSize: 13, color: BRAND.gray400, marginBottom: 26 }}>Sign in to continue your learning journey</p>

            {error && (
              <div style={{ background: BRAND.redLight, border: `1px solid ${BRAND.red}33`, borderRadius: 9, padding: '10px 14px', marginBottom: 18, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <Icon name="alert" size={15} color={BRAND.red} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: BRAND.red, lineHeight: 1.4 }}>{error}</span>
              </div>
            )}

            <FormField label="Email Address" required>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </FormField>
            <FormField label="Password" required>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingRight: 40 }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: BRAND.gray400, display: 'flex' }}>
                  <Icon name="eye" size={16} />
                </button>
              </div>
            </FormField>

            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{ marginTop: 26, borderTop: `1px dashed ${BRAND.gray200}`, paddingTop: 22 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: BRAND.gray400, marginBottom: 12, textAlign: 'center', letterSpacing: '0.06em' }}>QUICK DEMO LOGIN</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {demoLogins.map(d => (
                  <button key={d.label} onClick={() => { setEmail(d.email); setPassword(d.pass); setError(''); }}
                    style={{ padding: '10px 6px', borderRadius: 10, border: `2px solid ${d.color}25`, background: `${d.color}08`, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${d.color}15`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${d.color}08`; }}>
                    <Icon name={d.icon} size={16} color={d.color} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: d.color }}>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: BRAND.gray300, marginTop: 20 }}>
            © 2024 The Reality Academy. All rights reserved.
          </p>
        </div>
      </div>
      <DotBorder color={BRAND.red} opacity={0.35} />
    </div>
  );
}
