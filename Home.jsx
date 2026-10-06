import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NetworkBg from '../components/NetworkBg.jsx';
import { Reveal, Counter } from '../components/Reveal.jsx';
import { TOPICS } from '../data/awareness.js';
import { RESOURCES } from '../data/learning.js';

const TIPS = [
  'Banks never ask for your OTP, PIN or CVV. Not on a call, not by SMS.',
  'A long passphrase beats a short "complex" password.',
  'Check the full web address before you log in. Look-alike domains are common.',
  'Turn on two-step verification for your email first. It protects your other accounts.',
  'Unexpected link with an urgent tone? Stop, then verify in the official app.',
  'Update your phone and apps. Updates close security holes.',
];
const TOOLS = [
  ['password', 'Password strength', 'See how hard your password is to guess.'],
  ['url', 'URL inspector', 'Spot warning signs in a link before you click.'],
  ['hash', 'Hash generator', 'Learn how SHA hashes work on any text.'],
  ['checklist', 'Security checklist', 'Track the basics that keep you safe.'],
];

export default function Home({ data }) {
  const h = data.home;
  const lines = (h.title || 'Learn. Protect. Stay Secure.').split(/(?<=[.!?])\s+/);
  const [tip, setTip] = useState(0);
  useEffect(() => { const t = setInterval(() => setTip(i => (i + 1) % TIPS.length), 9000); return () => clearInterval(t); }, []);
  const projects = data.projects.filter(p => p.published).slice(0, 3);
  const services = data.services.filter(s => s.published).slice(0, 3);
  const alerts = data.alerts.filter(a => a.published).length;
  const stats = [[TOPICS.length, 'Awareness topics'], [TOOLS.length, 'Free tools'], [RESOURCES.length, 'Learning resources'], [alerts, 'Fraud alerts']];

  return (
    <main>
      <section className="hero">
        <NetworkBg />
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">{h.eyebrow || 'Cybersecurity awareness for everyone'}</p>
            <h1 className="hero-title">{lines.map((l, i) => <span className="line" key={i} style={{ '--i': i }}>{l}</span>)}</h1>
            <p className="lead">{h.description}</p>
            <div className="actions">
              <Link className="btn btn-primary" to="/cyber-awareness">Explore Cyber Awareness</Link>
              <Link className="btn btn-secondary" to="/learning">Start Learning</Link>
              <Link className="btn btn-ghost" to="/projects">View Projects →</Link>
            </div>
          </div>
          <aside className="sms-demo" aria-label="Example of a scam message">
            <p className="sms-caption">Can you spot what is wrong with this message?</p>
            <div className="sms-bubble">
              <small>VK-BANKKY · 10:42 AM</small>
              <p>Dear customer, your KYC <mark style={{ '--d': '1.4s' }}>expires today</mark>. Update now at <mark style={{ '--d': '2s' }}>http://bank-kyc-update.in/verify</mark> or your account will be <mark style={{ '--d': '2.6s' }}>blocked</mark>.</p>
            </div>
            <ul className="flags">
              <li>False urgency makes you act before thinking.</li>
              <li>The link is not your bank's official website.</li>
              <li>Real banks do not threaten you by SMS.</li>
            </ul>
          </aside>
        </div>
      </section>

      <div className="marquee" aria-hidden="true"><div className="track">{[...TOPICS, ...TOPICS].map((t, i) => <span key={i}>{t.icon} {t.title}</span>)}</div></div>

      <section className="section"><div className="container stats">
        {stats.map(([n, l], i) => <Reveal key={l} delay={i * 80} className="stat"><strong><Counter to={n} /></strong><span>{l}</span></Reveal>)}
      </div></section>

      <section className="section"><div className="container split">
        <Reveal>
          <h2>What is Cyber Awareness Hub?</h2>
          <p className="lead">A free place to understand online threats in plain language, practise with safe tools, and learn cybersecurity step by step.</p>
          <div className="actions"><Link className="btn btn-secondary" to="/about">About the platform</Link></div>
        </Reveal>
        <Reveal delay={120} className="card tip-card">
          <p className="tag">Tip of the moment</p>
          <p key={tip} className="tip-text">{TIPS[tip]}</p>
          <button type="button" className="btn btn-ghost" onClick={() => setTip((tip + 1) % TIPS.length)}>Next tip</button>
        </Reveal>
      </div></section>

      <section className="section alt"><div className="container">
        <Reveal><h2>Key cybersecurity topics</h2></Reveal>
        <div className="card-grid cols-4">
          {TOPICS.map((t, i) => (
            <Reveal key={t.id} delay={(i % 4) * 70}><Link to={`/cyber-awareness?topic=${t.id}`} className="card topic-card">
              <span className="icon-tile">{t.icon}</span><h3>{t.title}</h3><p>{t.what}</p>
            </Link></Reveal>
          ))}
        </div>
      </div></section>

      {projects.length > 0 && <section className="section"><div className="container">
        <Reveal><div className="section-head"><h2>Featured projects</h2><Link to="/projects">All projects →</Link></div></Reveal>
        <div className="card-grid cols-3">{projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 80}><Link to="/projects" className="card"><span className="tag">{p.technology}</span><h3>{p.title}</h3><p>{p.description}</p></Link></Reveal>
        ))}</div>
      </div></section>}

      <section className="section alt"><div className="container">
        <Reveal><div className="section-head"><h2>Learning highlights</h2><Link to="/learning">Open learning path →</Link></div></Reveal>
        <div className="card-grid cols-3">{[RESOURCES[0], RESOURCES[4], RESOURCES[8]].map((r, i) => (
          <Reveal key={r.id} delay={i * 80}><div className="card"><span className="tag">{r.level}</span><h3>{r.title}</h3><p>{r.description}</p></div></Reveal>
        ))}</div>
      </div></section>

      <section className="section"><div className="container">
        <Reveal><div className="section-head"><h2>Useful tools</h2><Link to="/tools">All tools →</Link></div></Reveal>
        <div className="card-grid cols-4">{TOOLS.map(([id, t, d], i) => (
          <Reveal key={id} delay={i * 70}><Link to={`/tools?tool=${id}`} className="card"><h3>{t}</h3><p>{d}</p></Link></Reveal>
        ))}</div>
      </div></section>

      {services.length > 0 && <section className="section alt"><div className="container">
        <Reveal><div className="section-head"><h2>Services preview</h2><span className="badge soon">Coming soon</span></div></Reveal>
        <div className="card-grid cols-3">{services.map((s, i) => (
          <Reveal key={s.id} delay={i * 80}><Link to="/services" className="card"><h3>{s.title}</h3><p>{s.description}</p></Link></Reveal>
        ))}</div>
      </div></section>}

      <section className="section"><div className="container">
        <Reveal className="card founder">
          <div className="avatar" aria-hidden="true">PS</div>
          <div>
            <h3>Built by Priyanshu Singh</h3>
            <p>Cyber Awareness Hub is a learning-in-public project. It grows alongside the founder's studies in cybersecurity and full-stack development, and aims to make safe online habits easy to understand.</p>
            <Link to="/about">Read the vision →</Link>
          </div>
        </Reveal>
      </div></section>

      <section className="section"><div className="container">
        <Reveal className="cta-band">
          <h2>Ready to stay a step ahead of scammers?</h2>
          <p>Start with the basics. It takes only a few minutes.</p>
          <div className="actions center"><Link className="btn btn-primary" to="/cyber-awareness">Start learning</Link><Link className="btn btn-secondary" to="/contact">Contact us</Link></div>
        </Reveal>
      </div></section>
    </main>
  );
}
