import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Reveal } from '../components/Reveal.jsx';
import { TOPICS } from '../data/awareness.js';

const BLOCKS = [['what', 'What it is', 'b-what'], ['signs', 'Warning signs', 'b-signs'], ['safe', 'Safe practices', 'b-safe'], ['help', 'If you are affected', 'b-help']];

export default function CyberAwareness({ data }) {
  const [params, setParams] = useSearchParams();
  const current = TOPICS.find(t => t.id === params.get('topic')) || TOPICS[0];
  const [q, setQ] = useState(''), [cat, setCat] = useState('All');

  const all = useMemo(() => data.alerts.filter(a => a.published).sort((a, b) => (b.date || '').localeCompare(a.date || '')), [data.alerts]);
  const cats = ['All', ...new Set(all.map(a => a.category).filter(Boolean))];
  const list = all.filter(a => (cat === 'All' || a.category === cat) && `${a.title} ${a.description}`.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <main className="page-shell">
      <div className="container">
        <header className="page-head"><h1>Cyber Awareness</h1><p className="lead">Practical security knowledge in easy language. Pick a topic to see the warning signs and what to do.</p></header>

        <div className="topic-layout">
          <div className="topic-list" role="tablist" aria-label="Topics">
            {TOPICS.map(t => (
              <button key={t.id} role="tab" aria-selected={t.id === current.id} className={`topic-btn ${t.id === current.id ? 'on' : ''}`}
                onClick={() => setParams({ topic: t.id }, { replace: true })}><span>{t.icon}</span>{t.title}</button>
            ))}
          </div>
          <div className="topic-panel" key={current.id}>
            <h2><span className="icon-tile">{current.icon}</span>{current.title}</h2>
            <div className="blocks">
              {BLOCKS.map(([k, label, cls], i) => (
                <section key={k} className={`block ${cls}`} style={{ '--i': i }}>
                  <h3>{label}</h3>
                  {Array.isArray(current[k]) ? <ul className="dots">{current[k].map((x, n) => <li key={n}>{x}</li>)}</ul> : <p>{current[k]}</p>}
                </section>
              ))}
            </div>
            <div className="actions"><Link className="btn btn-primary" to="/learning">Start Learning</Link><Link className="btn btn-secondary" to="/tools">Explore Tools</Link></div>
          </div>
        </div>

        <section className="spaced" id="alerts">
          <Reveal><h2>Latest fraud alerts</h2></Reveal>
          <div className="toolbar">
            <input className="search" type="search" placeholder="Search alerts, e.g. UPI or KYC" aria-label="Search alerts" value={q} onChange={e => setQ(e.target.value)} />
            <div className="chips" role="group" aria-label="Filter by category">
              {cats.map(c => <button key={c} type="button" className={`chip ${c === cat ? 'on' : ''}`} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
            </div>
          </div>
          {list.length ? <div className="card-grid cols-3">{list.map(a => (
            <article className="card alert-card" key={a.id}>
              <div className="meta"><span className="tag">{a.category}</span><time>{a.date}</time></div>
              <h3>{a.title}</h3><p>{a.description}</p>
            </article>))}</div>
            : <div className="empty"><strong>No alerts match your search.</strong><p>Try a shorter word or choose "All".</p></div>}
        </section>
      </div>
    </main>
  );
}
