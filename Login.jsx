import { useState } from 'react';
import { scorePassword } from '../utils/password.js';

const TABS = [['login', 'Login'], ['register', 'Register'], ['forgot', 'Forgot password']];

export default function Login() {
  const [tab, setTab] = useState('login');
  const [f, setF] = useState({ email: '', password: '', confirm: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const s = scorePassword(f.password);
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = e => {
    e.preventDefault(); setMsg({ type: '', text: '' });
    if (tab === 'register' && f.password !== f.confirm) return setMsg({ type: 'error', text: 'Passwords do not match.' });
    if (tab === 'register' && s.level < 3) return setMsg({ type: 'error', text: 'Please choose a stronger password.' });
    setBusy(true);
    setTimeout(() => {          // no user backend yet: be honest and send nothing
      setBusy(false);
      setMsg({ type: 'info', text: 'User accounts are not open yet. Nothing was sent or stored. Please check back soon.' });
    }, 700);
  };

  return (
    <main className="page-shell center-page">
      <div className="auth-card form-card">
        <h1>Welcome</h1>
        <div className="tabs" role="tablist">{TABS.map(([id, l]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => { setTab(id); setMsg({ type: '', text: '' }); }}>{l}</button>)}</div>
        <form onSubmit={submit} className="stack">
          <label>Email<input type="email" required autoComplete="email" value={f.email} onChange={set('email')} /></label>
          {tab !== 'forgot' && <label>Password<input type="password" required autoComplete={tab === 'login' ? 'current-password' : 'new-password'} value={f.password} onChange={set('password')} /></label>}
          {tab === 'register' && <>
            <div className="meter" data-level={s.level}><i style={{ width: `${s.level * 20}%` }} /></div><span className="hint">Strength: {s.label}</span>
            <label>Confirm password<input type="password" required autoComplete="new-password" value={f.confirm} onChange={set('confirm')} /></label></>}
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Please wait…' : tab === 'login' ? 'Login' : tab === 'register' ? 'Create account' : 'Send reset link'}</button>
          <p className={`status ${msg.type}`} role="status">{msg.text}</p>
        </form>
      </div>
    </main>
  );
}
