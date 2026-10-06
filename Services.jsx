import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal.jsx';

const PLANNED = [
  ['Security awareness sessions', 'Students, colleges and small teams', 'Short talks on phishing, scams and safe habits', 'Slides, examples and a Q&A'],
  ['Website security review', 'Small websites and student projects', 'A basic, non-intrusive checklist review', 'A simple written summary'],
  ['Cybersecurity training', 'Beginners who want guided learning', 'Fundamentals, Linux and web basics', 'Learning plan and practice tasks'],
  ['Consultation', 'Anyone with a security question', 'Advice on safe practices', 'A one-to-one conversation'],
];

export default function Services({ data }) {
  const page = data.pages.services;
  const list = data.services.filter(s => s.published);
  return (
    <main className="page-shell">
      <div className="container">
        <header className="page-head"><h1>{page.title}</h1><p className="lead">{page.description}</p></header>
        <div className="notice"><span className="badge soon">Coming soon</span><p>These services are not launched yet. Nothing below is a guarantee, certification or testing authority. Send an inquiry and we will tell you honestly what is possible.</p></div>

        {list.length > 0 && <div className="card-grid cols-3">{list.map((s, i) => (
          <Reveal key={s.id} delay={(i % 3) * 80}><article className="card"><span className="badge soon">Coming soon</span><h3>{s.title}</h3><p>{s.description}</p>
            <Link className="btn btn-secondary" to={`/contact?subject=${encodeURIComponent(s.title)}`}>Send inquiry</Link></article></Reveal>))}</div>}

        <Reveal><h2 className="spaced-sm">Planned offerings</h2></Reveal>
        <div className="card-grid cols-2">{PLANNED.map(([t, who, scope, inc], i) => (
          <Reveal key={t} delay={(i % 2) * 90}><article className="card">
            <h3>{t}</h3>
            <dl className="defs"><dt>Who it is for</dt><dd>{who}</dd><dt>Scope</dt><dd>{scope}</dd><dt>Included</dt><dd>{inc}</dd></dl>
            <Link className="btn btn-secondary" to={`/contact?subject=${encodeURIComponent(t)}`}>Send inquiry</Link>
          </article></Reveal>))}</div>
      </div>
    </main>
  );
}
