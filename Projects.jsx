import { useEffect, useState } from 'react';
import { Reveal } from '../components/Reveal.jsx';

const DETAIL = [['problem', 'Problem'], ['solution', 'Solution'], ['features', 'Features'], ['security', 'Security considerations'], ['learned', 'What was learned']];

export default function Projects({ data }) {
  const page = data.pages.projects;
  const list = data.projects.filter(p => p.published);
  const [open, setOpen] = useState(null);
  useEffect(() => {
    if (!open) return;
    const k = e => e.key === 'Escape' && setOpen(null);
    addEventListener('keydown', k); document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open]);
  const tech = p => (p.technology || '').split(',').map(t => t.trim()).filter(Boolean);

  return (
    <main className="page-shell">
      <div className="container">
        <header className="page-head"><h1>{page.title}</h1><p className="lead">{page.description}</p></header>
        {list.length ? <div className="card-grid cols-3">{list.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 80}>
            <article className="card project">
              <div className="thumb" style={{ '--h': (p.title.length * 37) % 360 }}><span>{p.title.slice(0, 2).toUpperCase()}</span></div>
              <div className="meta"><span className={`badge ${p.link ? 'ok' : 'soon'}`}>{p.link ? 'Live' : 'In progress'}</span></div>
              <h3>{p.title}</h3><p>{p.description}</p>
              <div className="chips small">{tech(p).map(t => <span className="tag" key={t}>{t}</span>)}</div>
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(p)}>View details</button>
            </article>
          </Reveal>))}</div>
          : <div className="empty"><strong>No projects published yet.</strong><p>Add one from the admin panel.</p></div>}
      </div>

      {open && (
        <div className="modal" onClick={() => setOpen(null)}>
          <div className="dialog" role="dialog" aria-modal="true" aria-label={open.title} onClick={e => e.stopPropagation()}>
            <button className="close" aria-label="Close" onClick={() => setOpen(null)}>✕</button>
            <h2>{open.title}</h2><p>{open.description}</p>
            <div className="chips small">{tech(open).map(t => <span className="tag" key={t}>{t}</span>)}</div>
            {DETAIL.filter(([k]) => open[k]).map(([k, l]) => <section key={k} className="block b-what"><h3>{l}</h3><p>{open[k]}</p></section>)}
            <div className="actions">
              {open.link && <a className="btn btn-primary" href={open.link} target="_blank" rel="noreferrer noopener">Live demo ↗</a>}
              {open.github && <a className="btn btn-secondary" href={open.github} target="_blank" rel="noreferrer noopener">GitHub ↗</a>}
            </div>
          </div>
        </div>)}
    </main>
  );
}
