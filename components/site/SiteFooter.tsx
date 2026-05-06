import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="ed-footer">
      <div className="ed-footer-grid">
        <div>
          <div className="ed-brand" style={{ marginBottom: 14 }}>
            <div className="ed-brand-mark">∮</div>
            <div className="ed-brand-text">AI Deal Network</div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', maxWidth: '36ch', margin: 0 }}>
            Working paper companion site. Data and methodology open for review and replication.
          </p>
        </div>
        <div>
          <h5>Paper</h5>
          <ul>
            <li><Link href="/research">Abstract & full text</Link></li>
            <li><Link href="/methodology">Methodology</Link></li>
            <li><Link href="/research#cite">Citation (BibTeX)</Link></li>
          </ul>
        </div>
        <div>
          <h5>Data</h5>
          <ul>
            <li><Link href="/case-studies">Case studies</Link></li>
            <li><Link href="/graph">Explore the graph</Link></li>
          </ul>
        </div>
        <div>
          <h5>About</h5>
          <ul>
            <li><Link href="/about">Author</Link></li>
            <li><Link href="/about#contact">Contact</Link></li>
            <li><Link href="/about#acknowledgements">Acknowledgements</Link></li>
          </ul>
        </div>
      </div>
      <div className="ed-footer-bottom">
        <div>© 2026 Shouqi Han · CC BY-NC 4.0</div>
        <div>Last updated · May 2026</div>
      </div>
    </footer>
  );
}
