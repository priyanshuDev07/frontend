import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sendContact } from '../Api.js';
import { SOCIALS } from '../data/site.js';

const MAX = 1000;
const REASONS = ['General question', 'Report a problem', 'Collaboration', 'Service inquiry', 'Feedback'];

export default function Contact({ data }) {
  const [params] = useSearchParams();
  const blank = { name: '', email: '', reason: params.get('subject') || REASONS[0], message: '', consent: false, website: '' };
  const [form, setForm] = useState(blank);
  const [state, setState] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const set = k => e => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const email = data.settings?.contactEmail;

  const submit = async e => {
    e.preventDefault();
    if (form.website) return;                                  // honeypot field: only bots fill it
    if (form.message.trim().length < 10) return setState({ type: 'error', text: 'Please write at least 10 characters in your message.' });
    if (!form.consent) return setState({ type: 'error', text: 'Please tick the consent box so we can store your message.' });
    setBusy(true); setState({ type: '', text: '' });
    try {
      await sendContact({ name: form.name, email: form.email, mobile: '', message: `[${form.reason}] ${form.message}` });
      setForm({ ...blank, reason: form.reason });
      setState({ type: 'ok', text: 'Message sent. Thank you, we will read it soon.' });
    } catch (err) {
      setState({ type: 'error', text: 'Could not send your message right now. Please try again in a moment.' });
    } finally { setBusy(false); }
  };

  return (
    <main className="page-shell">
      <div className="container contact-grid">
        <div>
          <h1>{data.pages.contact.title}</h1>
          <p className="lead">{data.pages.contact.description}</p>
          <div className="card">
            <h3>Official contact</h3>
            {email ? <p><a href={`mailto:${email}`}>{email}</a></p> : <p>Use the form and we will reply by email.</p>}
            {SOCIALS.filter(s => s.href).map(s => <p key={s.label}><a href={s.href} target="_blank" rel="noreferrer">{s.label}</a></p>)}
          </div>
          <div className="card spaced-sm"><h3>Lost money to online fraud?</h3><p>Call <a href="tel:1930">1930</a> or report at cybercrime.gov.in as soon as possible.</p></div>
        </div>

        <form className="form-card" onSubmit={submit}>
          <label>Name<input required maxLength={80} autoComplete="name" value={form.name} onChange={set('name')} /></label>
          <label>Email<input required type="email" maxLength={120} autoComplete="email" value={form.email} onChange={set('email')} /></label>
          <label>Reason
            <select value={form.reason} onChange={set('reason')}>
              {[...new Set([form.reason, ...REASONS])].map(r => <option key={r}>{r}</option>)}
            </select></label>
          <label>Message<textarea required rows="6" maxLength={MAX} value={form.message} onChange={set('message')} /><span className="hint">{form.message.length}/{MAX}</span></label>
          <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} />
          <label className="check"><input type="checkbox" checked={form.consent} onChange={set('consent')} />
            <span>I agree that my name, email and message are stored so you can reply to me.</span></label>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
          <p className={`status ${state.type}`} role="status">{state.text}</p>
        </form>
      </div>
    </main>
  );
}
