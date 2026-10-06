import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal.jsx';
import { SECTIONS, RESOURCES } from '../data/learning.js';

const KEY = 'cah_learning_done';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };

export default function Learning() {
  const [done, setDone] = useState(load);
  const [level, setLevel] = useState('All');
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch { /* storage unavailable */ } }, [done]);
  const toggle = id => setDone(d => d.includes(id) ? d.filter(x => x !== id) : [...d, id]);
  const pct = Math.round(done.length / RESOURCES.length * 100);

  return (
    <main className="page-shell">
      <div className="container">
        <header className="page-head"><h1>Learning</h1><p className="lead">A beginner-friendly path through cybersecurity. All resources are free and open in a new tab.</p></header>
        <div className="progress-card card">
          <div><strong>{done.length} of {RESOURCES.length} completed</strong><p>Progress is saved in this browser only.</p></div>
          <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"><i style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="chips" role="group" aria-label="Filter by level">
          {['All', 'Beginner', 'Intermediate'].map(l => <button key={l} className={`chip ${l === level ? 'on' : ''}`} aria-pressed={l === level} onClick={() => setLevel(l)}>{l}</button>)}
        </div>
        {SECTIONS.map(([title, id]) => {
          const items = RESOURCES.filter(r => r.section === id && (level === 'All' || r.level === level));
          if (!items.length) return null;
          return (
            <section key={id} className="spaced-sm">
              <Reveal><h2>{title}</h2></Reveal>
              <div className="card-grid cols-2">{items.map((r, i) => (
                <Reveal key={r.id} delay={i * 80}>
                  <article className={`card res ${done.includes(r.id) ? 'done' : ''}`}>
                    <div className="meta"><span className="tag">{r.level}</span><span className="tag">{r.topic}</span></div>
                    <h3>{r.title}</h3><p>{r.description}</p>
                    <div className="actions">
                      <a className="btn btn-secondary" href={r.link} target="_blank" rel="noreferrer noopener">Open resource ↗</a>
                      <button type="button" className="btn btn-ghost" aria-pressed={done.includes(r.id)} onClick={() => toggle(r.id)}>{done.includes(r.id) ? '✓ Done' : 'Mark as done'}</button>
                    </div>
                  </article>
                </Reveal>))}</div>
            </section>);
        })}
        <div className="actions spaced"><Link className="btn btn-primary" to="/projects">Explore Projects</Link></div>
      </div>
    </main>
  );
}
