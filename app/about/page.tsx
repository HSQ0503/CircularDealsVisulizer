import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

export default function AboutPage() {
  return (
    <main className="ed-page">
      <SiteHeader active="about" />

      <section className="a-head">
        <div className="ed-container">
          <div className="breadcrumb">Project · Author</div>
          <h1>About the <em>project</em>.</h1>
        </div>
      </section>

      <div className="ed-container">
        <section className="author">
          <div className="author-portrait">SH</div>
          <div>
            <h2 className="author-name">Shouqi Han</h2>
            <div className="author-role">Author · Sole investigator</div>
            <div className="author-bio">
              <p>
                Shouqi Han is the author and sole investigator of the AI Deal Network research project,
                which develops formal tools for measuring circular flows of capital, compute, and equity
                in concentrated technology markets. The project is independent and not affiliated with any
                firm in the sample.
              </p>
              <p>
                Prior work spans network economics, financial-market microstructure, and the empirical
                analysis of corporate disclosure. The current paper is the first publication in a planned
                working-paper series on infrastructure-led market structure.
              </p>
            </div>
            <div className="author-meta">
              <div><div className="key">Affiliation</div>Independent</div>
              <div><div className="key">Field</div>Network economics, market structure</div>
              <div><div className="key">First paper</div>WP–2026.01 · May 2026</div>
            </div>
          </div>
        </section>

        <section className="a-section">
          <h2><span className="num">§ 1</span>About this project</h2>
          <p>
            AI Deal Network is the companion site for a working paper that introduces three quantitative
            metrics for circularity in corporate ecosystems. Its purpose is twofold: to make the paper&apos;s
            data and case studies accessible to non-academic readers, and to serve as an open replication
            surface for researchers and journalists who wish to extend or contest the analysis.
          </p>
          <p>
            The site is intentionally structured like a working paper. The home page summarises findings;
            the research section reproduces the paper in full; the methodology section provides the long-form
            technical companion; the case studies decompose individual cycles; the explore page exposes the
            raw network for inspection.
          </p>
        </section>

        <section className="a-section" id="acknowledgements">
          <h2><span className="num">§ 2</span>Acknowledgements</h2>
          <p>The project benefited from comments, data leads, and review from a number of readers whose
            contributions did not constitute an endorsement of any of its conclusions.</p>
          <div className="ack-grid">
            <div className="ack-card"><h3>Data sources</h3><p>SEC EDGAR · audited 10-K and 10-Q filings · firm press releases · contemporaneous reporting in major financial outlets.</p></div>
            <div className="ack-card"><h3>Tools</h3><p>NetworkX for graph algorithms · pandas for data wrangling · Observable for prototype visualisations · this site is hand-coded HTML.</p></div>
            <div className="ack-card"><h3>Review</h3><p>Pre-publication review provided by anonymous readers in the network-economics community. Remaining errors are the author&apos;s alone.</p></div>
            <div className="ack-card"><h3>Disclosures</h3><p>The author holds no equity in any firm in the sample and has no consulting or paid advisory relationship with any of them.</p></div>
          </div>
        </section>

        <section className="a-section" id="contact">
          <h2><span className="num">§ 3</span>Contact</h2>
          <p>Corrections, additions, and replication notes are welcome. The fastest channel is email.</p>
          <div className="contact">
            <div className="contact-card">
              <div className="key">Correspondence</div>
              <div className="val"><a href="mailto:research@aidealnetwork.org">research@aidealnetwork.org</a></div>
            </div>
            <div className="contact-card">
              <div className="key">Data &amp; corrections</div>
              <div className="val"><a href="mailto:data@aidealnetwork.org">data@aidealnetwork.org</a></div>
            </div>
            <div className="contact-card">
              <div className="key">Press</div>
              <div className="val"><a href="mailto:press@aidealnetwork.org">press@aidealnetwork.org</a></div>
            </div>
          </div>
        </section>

        <section className="a-section">
          <h2><span className="num">§ 4</span>Citation &amp; license</h2>
          <p>The paper is released under CC BY-NC 4.0. Code and sample data are released under MIT.
            Standard academic citation is appreciated; the canonical form appears in the
            {' '}<Link href="/research#cite">research</Link> section.</p>
        </section>
      </div>

      <SiteFooter />

      <style>{`
        .a-head { padding: 56px 0 40px; border-bottom: 1px solid var(--ink); }
        .a-head .breadcrumb {
          font-family: var(--sans-ed);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          margin-bottom: 20px;
        }
        .a-head h1 { font-size: 56px; font-weight: 400; letter-spacing: -0.022em; margin-bottom: 18px; }
        .a-head h1 em { font-style: italic; color: var(--ed-accent); font-weight: 300; }

        .author {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 60px;
          padding: 60px 0;
          border-bottom: 1px solid var(--rule);
        }
        .author-portrait {
          width: 220px;
          height: 280px;
          background: var(--bg-3);
          border: 1px solid var(--rule-strong);
          display: grid;
          place-items: center;
          font-family: var(--serif);
          font-style: italic;
          font-size: 60px;
          color: var(--ink);
          position: relative;
          overflow: hidden;
        }
        .author-portrait::after {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(45deg, transparent 0 12px, rgba(26,23,20,0.04) 12px 13px);
        }
        .author-name { font-family: var(--serif); font-size: 36px; font-weight: 500; margin: 0 0 6px; letter-spacing: -0.014em; }
        .author-role {
          font-family: var(--sans-ed);
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-weight: 600;
          margin-bottom: 24px;
        }
        .author-bio { max-width: 56ch; }
        .author-bio p { font-size: 17px; line-height: 1.7; font-family: var(--serif); color: var(--ink-2); }
        .author-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
          font-family: var(--sans-ed);
          font-size: 13px;
          color: var(--ink-2);
        }
        .author-meta .key {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-mute);
          font-weight: 700;
          margin-bottom: 4px;
        }

        .a-section { padding: 60px 0; border-bottom: 1px solid var(--rule); }
        .a-section h2 { font-size: 30px; font-weight: 500; margin-bottom: 18px; letter-spacing: -0.012em; }
        .a-section .num { font-style: italic; color: var(--ink-mute); font-weight: 300; margin-right: 12px; font-family: var(--serif); }
        .a-section p { max-width: 64ch; font-size: 17px; line-height: 1.7; font-family: var(--serif); color: var(--ink-2); }

        .ack-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; margin-top: 24px; }
        .ack-card { padding: 20px 22px; border: 1px solid var(--rule-strong); background: var(--bg-3); }
        .ack-card h3 {
          font-family: var(--sans-ed);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          font-weight: 700;
          margin: 0 0 8px;
        }
        .ack-card p { font-size: 15px; margin: 0; font-family: var(--serif); color: var(--ink-2); }

        .contact { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 24px; }
        .contact-card {
          padding: 24px;
          border-top: 2px solid var(--ink);
          border-bottom: 1px solid var(--rule);
        }
        .contact-card .key {
          font-family: var(--sans-ed);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .contact-card .val { font-family: var(--serif); font-size: 18px; }
        .contact-card .val a { color: var(--ink); border-bottom: 1px solid var(--rule-strong); }

        @media (max-width: 980px) {
          .author { grid-template-columns: 1fr; gap: 32px; }
          .ack-grid, .contact { grid-template-columns: 1fr; }
          .author-meta { grid-template-columns: 1fr; gap: 16px; }
          .a-head h1 { font-size: 38px; }
        }
      `}</style>
    </main>
  );
}
