import Link from 'next/link';

type NavKey = 'paper' | 'cases' | 'methodology' | 'about' | 'explore';

export function SiteHeader({ active }: { active?: NavKey }) {
  const cls = (k: NavKey) => (active === k ? 'active' : undefined);
  return (
    <header className="ed-topbar">
      <div className="ed-topbar-inner">
        <Link href="/" className="ed-brand">
          <div className="ed-brand-mark">∮</div>
          <div className="ed-brand-text">
            AI Deal Network <em>— a research project</em>
          </div>
        </Link>
        <nav className="ed-nav">
          <Link href="/research" className={cls('paper')}>Paper</Link>
          <Link href="/case-studies" className={cls('cases')}>Case Studies</Link>
          <Link href="/methodology" className={cls('methodology')}>Methodology</Link>
          <Link href="/about" className={cls('about')}>About</Link>
          <Link
            href="/graph"
            className={`ed-btn ghost ${active === 'explore' ? 'active' : ''}`}
            style={{ padding: '7px 14px', fontSize: 13 }}
          >
            Explore the Graph →
          </Link>
        </nav>
      </div>
    </header>
  );
}
