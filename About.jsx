import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal.jsx';

export default function About({ data }) {
  const p = data.pages.about;
  const blocks = [
    ['Vision', p.vision], ['Mission', p.mission],
    ['Why it exists', 'Many people lose money or data because online threats are explained in complicated language. This platform explains them simply and shows what to do next.'],
  ];
  return (
    <main className="page-shell">
      <div className="container">
        <header className="page-head"><h1>{p.title}</h1><p className="lead">{p.description}</p></header>
        <div className="card-grid cols-3">{blocks.map(([t, d], i) => (
          <Reveal key={t} delay={i * 90}><div className="card"><h3>{t}</h3><p>{d}</p></div></Reveal>
        ))}</div>

        <Reveal className="card founder spaced">
          <div className="avatar" aria-hidden="true">PS</div>
          <div>
            <h3>Founder: Priyanshu Singh</h3>
            <p>Priyanshu is building Cyber Awareness Hub while learning cybersecurity and full-stack development. Everything shown here reflects real work in progress, and claims are added only once they are earned.</p>
          </div>
        </Reveal>

        <div className="split spaced">
          <Reveal><h2>Current focus</h2><ul className="dots"><li>Cybersecurity awareness content</li><li>Full-stack development with React and ASP.NET</li><li>Small, safe, educational tools</li></ul></Reveal>
          <Reveal delay={100}><h2>Future direction</h2><ul className="dots"><li>More learning paths and practice resources</li><li>Blog, news and community features</li><li>Awareness sessions and training when ready</li></ul></Reveal>
        </div>
        <div className="actions spaced"><Link className="btn btn-primary" to="/projects">Explore Projects</Link><Link className="btn btn-secondary" to="/contact">Contact</Link></div>
      </div>
    </main>
  );
}
