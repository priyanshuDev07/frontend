import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { scorePassword } from '../utils/password.js';

function Shell({ what, input, privacy, limits, children }) {
  return (
    <div className="tool-shell">
      <p className="lead">{what}</p>
      <p className="hint">{input}</p>
      {children}
      <div className="notes"><div><strong>Privacy note</strong><p>{privacy}</p></div><div><strong>Limitations</strong><p>{limits}</p></div></div>
    </div>
  );
}

function PasswordTool() {
  const [pw, setPw] = useState(''), [show, setShow] = useState(false);
  const s = scorePassword(pw);
  return (
    <Shell what="Estimates how hard a password is to guess and tells you how to improve it."
      input="Type a password you are thinking of using. Do not type one you already use."
      privacy="Everything runs in your browser. The password is never sent or stored."
      limits="This is an estimate. It cannot know if your password already leaked in a breach.">
      <div className="row"><input type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} placeholder="Try a passphrase" aria-label="Password" autoComplete="off" />
        <button className="btn btn-secondary" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button></div>
      <div className="meter" data-level={s.level}><i style={{ width: `${s.level * 20}%` }} /></div>
      <p className="result"><strong>{s.label}</strong>{s.bits > 0 && <span> · about {s.bits} bits</span>}</p>
      {s.tips.length > 0 && <ul className="dots">{s.tips.map(t => <li key={t}>{t}</li>)}</ul>}
    </Shell>
  );
}

const ALGOS = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'];
function HashTool() {
  const [text, setText] = useState(''), [algo, setAlgo] = useState('SHA-256'), [out, setOut] = useState(''), [copied, setCopied] = useState(false);
  useEffect(() => {
    let live = true;
    (async () => {
      if (!text || !crypto?.subtle) return setOut('');
      const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
      if (live) setOut([...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''));
    })();
    return () => { live = false; };
  }, [text, algo]);
  const copy = async () => { try { await navigator.clipboard.writeText(out); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard blocked */ } };
  return (
    <Shell what="Turns any text into a fixed-length fingerprint called a hash. Change one letter and the whole hash changes."
      input="Type or paste any text, then choose an algorithm."
      privacy="Hashing happens in your browser. Your text is never uploaded."
      limits="Hashing is not encryption and cannot be reversed. SHA-1 is outdated. Never store passwords with plain SHA, use a slow password hash such as bcrypt or Argon2.">
      <textarea rows="4" value={text} onChange={e => setText(e.target.value)} placeholder="Type some text" aria-label="Text to hash" />
      <div className="row"><select value={algo} onChange={e => setAlgo(e.target.value)} aria-label="Algorithm">{ALGOS.map(a => <option key={a}>{a}</option>)}</select>
        <button className="btn btn-secondary" disabled={!out} onClick={copy}>{copied ? 'Copied' : 'Copy'}</button></div>
      <code className="hash">{out || 'The hash appears here'}</code>
    </Shell>
  );
}

const RISKY_TLD = ['zip', 'mov', 'top', 'xyz', 'click', 'country', 'gq', 'tk', 'work'];
const SHORT = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly'];
const WORDS = ['login', 'verify', 'secure', 'update', 'kyc', 'bank', 'wallet', 'free', 'prize', 'refund'];
function inspect(raw) {
  const s = raw.trim(); if (!s) return null;
  const hadScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(s);
  let u; try { u = new URL(hadScheme ? s : 'http://' + s); } catch { return { error: 'This does not look like a valid web address.' }; }
  const host = u.hostname.toLowerCase(), parts = host.split('.'), checks = [];
  const add = (level, text) => checks.push({ level, text });
  if (u.protocol === 'https:') add('ok', 'Uses HTTPS (encrypted connection).');
  else add('warn', hadScheme ? 'Does not use HTTPS.' : 'No https:// was given. Real login pages use HTTPS.');
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) add('bad', 'Uses a raw IP address instead of a domain name.');
  if (host.includes('xn--')) add('warn', 'Contains punycode, which can hide look-alike characters.');
  if (s.includes('@')) add('bad', 'Contains "@", which can hide the real destination.');
  if (parts.length >= 5) add('warn', 'Has many subdomains, a trick to look official.');
  if (RISKY_TLD.includes(parts.at(-1))) add('warn', `".${parts.at(-1)}" is often abused. Check carefully.`);
  if (SHORT.includes(host)) add('warn', 'This is a link shortener, so the real destination is hidden.');
  const kw = WORDS.filter(w => host.includes(w)); if (kw.length) add('warn', `The domain contains "${kw.join('", "')}", a word scammers like to use.`);
  if ((host.match(/-/g) || []).length >= 3) add('warn', 'Many hyphens in the domain name.');
  if (s.length > 100) add('warn', 'Very long address.');
  const bad = checks.filter(c => c.level === 'bad').length, warn = checks.filter(c => c.level === 'warn').length;
  const verdict = bad ? ['bad', 'Looks risky'] : warn >= 2 ? ['bad', 'Looks suspicious'] : warn ? ['warn', 'Be careful'] : ['ok', 'No obvious red flags'];
  return { host, protocol: u.protocol, path: u.pathname + u.search, checks, verdict };
}
function UrlTool() {
  const [url, setUrl] = useState('');
  const r = inspect(url);
  return (
    <Shell what="Checks a link for common warning signs before you click it."
      input="Paste a full link, for example one you received by SMS or email."
      privacy="The link is analysed only as text in your browser. It is never opened or sent anywhere."
      limits="This uses simple rules, not a threat database. A link with no red flags can still be unsafe, and a flagged link is not always malicious.">
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/login" aria-label="Link to inspect" autoComplete="off" />
      {r?.error && <p className="status error">{r.error}</p>}
      {r && !r.error && <>
        <p className={`verdict ${r.verdict[0]}`}>{r.verdict[1]}</p>
        <dl className="defs"><dt>Domain</dt><dd>{r.host}</dd><dt>Path</dt><dd>{r.path}</dd></dl>
        <ul className="checks">{r.checks.map((c, i) => <li key={i} className={c.level}>{c.text}</li>)}</ul></>}
    </Shell>
  );
}

const ITEMS = ['Use a unique password for every important account', 'Turn on two-step verification for email', 'Use a password manager', 'Keep phone and apps updated',
  'Install apps only from official stores', 'Never share OTP, PIN or CVV', 'Lock your phone with a PIN or biometrics', 'Back up important files',
  'Check links before you log in', 'Know the helpline: 1930'];
const KEY = 'cah_checklist';
function ChecklistTool() {
  const [on, setOn] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(on)); } catch { /* storage unavailable */ } }, [on]);
  const pct = on.length / ITEMS.length, C = 2 * Math.PI * 34;
  return (
    <Shell what="A short list of habits that block most everyday attacks. Tick what you already do."
      input="Tick each item you have done. Your progress is saved in this browser."
      privacy="Your ticks stay in this browser's storage. Nothing is sent to a server."
      limits="This is a starting point, not a full security audit.">
      <div className="ring-row">
        <svg className="ring" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34" /><circle className="val" cx="40" cy="40" r="34" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} /></svg>
        <strong>{on.length} of {ITEMS.length} done</strong>
      </div>
      <ul className="todo">{ITEMS.map((t, i) => (
        <li key={t}><label className="check"><input type="checkbox" checked={on.includes(i)} onChange={() => setOn(o => o.includes(i) ? o.filter(x => x !== i) : [...o, i])} /><span>{t}</span></label></li>))}</ul>
    </Shell>
  );
}

const TOOLS = [['password', 'Password strength', PasswordTool], ['url', 'URL inspector', UrlTool], ['hash', 'Hash generator', HashTool], ['checklist', 'Security checklist', ChecklistTool]];
export default function Tools() {
  const [params, setParams] = useSearchParams();
  const cur = TOOLS.find(t => t[0] === params.get('tool')) || TOOLS[0];
  const Cur = cur[2];
  return (
    <main className="page-shell">
      <div className="container narrow">
        <header className="page-head"><h1>Tools</h1><p className="lead">Small, safe tools that run entirely in your browser.</p></header>
        <div className="tabs" role="tablist">{TOOLS.map(([id, label]) => <button key={id} role="tab" aria-selected={id === cur[0]} className={id === cur[0] ? 'on' : ''} onClick={() => setParams({ tool: id }, { replace: true })}>{label}</button>)}</div>
        <div key={cur[0]} className="tool-card"><Cur /></div>
      </div>
    </main>
  );
}
