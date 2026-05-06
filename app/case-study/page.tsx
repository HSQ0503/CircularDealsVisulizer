import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

export default function CaseStudyPage() {
  return (
    <main className="ed-page">
      <SiteHeader active="cases" />

      <section className="cs-head">
        <div className="ed-container-wide">
          <div className="cs-breadcrumb">
            <Link href="/case-studies">← Case Studies</Link>
            <span>·</span>
            <span>Cycles</span>
            <span>·</span>
            <span>Length-3</span>
          </div>
          <div className="cs-id">CASE C—01 · CYCLE SCORE 3.41 · FIRST CLOSED 2024-Q1</div>
          <h1>The OpenAI · Microsoft · NVIDIA <em>triangle</em>.</h1>
          <p className="deck">
            A length-3 cycle in which Microsoft&apos;s equity in OpenAI returns as Azure commitments;
            OpenAI&apos;s GPU spend lands at NVIDIA; NVIDIA, in turn, sells its data-center silicon
            back to Microsoft. Five disclosed edges. One closed loop.
          </p>
          <div className="cs-meta-row">
            <div className="ed-stat"><div className="ed-stat-num"><em>3.41</em></div><div className="ed-stat-label">Cycle score</div></div>
            <div className="ed-stat"><div className="ed-stat-num">3</div><div className="ed-stat-label">Firms</div></div>
            <div className="ed-stat"><div className="ed-stat-num">5</div><div className="ed-stat-label">Edges</div></div>
            <div className="ed-stat"><div className="ed-stat-num">$13B+</div><div className="ed-stat-label">Equity in cycle</div></div>
            <div className="ed-stat"><div className="ed-stat-num">~18 mo</div><div className="ed-stat-label">Cycle period</div></div>
          </div>
        </div>
      </section>

      <div className="cs-body">
        <main className="cs-main">
          <p className="lede-graf">
            Each side of the triangle is a public deal. Read together, the three sides describe
            a closed loop in which the same dollars can be plausibly traced — through equity,
            cloud commitments, and data-center capex — back to roughly where they started.
          </p>

          <h2><span className="num">§ 1</span>The structure</h2>
          <p>
            Cycle C-01 is the simplest non-trivial circular structure in the sample: a directed
            triangle of length 3 with one edge of each major flow type. In the canonical
            direction it reads OpenAI → NVIDIA → Microsoft → OpenAI. In reverse, every edge has
            a counter-edge, making the underlying loop tightly coupled.
          </p>

          <figure className="cs-diagram">
            <div className="ed-figure-num" style={{ marginBottom: 18 }}>Figure 1 — Schematic of cycle C-01 with edge magnitudes</div>
            <svg viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="csb-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ff4f8a" /></marker>
                <marker id="csb-2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7ed957" /></marker>
                <marker id="csb-3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#4f8eff" /></marker>
              </defs>
              <g fill="none" strokeWidth="1.6">
                <path d="M 360 100 L 160 320" stroke="#ff4f8a" markerEnd="url(#csb-1)" />
                <path d="M 168 332 L 552 332" stroke="#4f8eff" markerEnd="url(#csb-3)" />
                <path d="M 552 320 L 380 100" stroke="#7ed957" markerEnd="url(#csb-2)" />
                <path d="M 552 308 Q 380 280 168 308" stroke="#ff4f8a" strokeDasharray="3 4" markerEnd="url(#csb-1)" opacity="0.6" />
                <path d="M 380 110 Q 480 220 552 308" stroke="#4f8eff" strokeDasharray="3 4" opacity="0.55" />
              </g>
              <g fontFamily="Inter Tight" fontSize="13" fill="#9a96a8">
                <text x="200" y="208" transform="rotate(-48 200 208)" fill="#f3f1ea">edge a · GPU spend · $5.2B/yr</text>
                <text x="360" y="354" textAnchor="middle" fill="#f3f1ea">edge b · data-center silicon · ~$8B/yr</text>
                <text x="525" y="208" transform="rotate(48 525 208)" fill="#7ed957">edge c · $13B equity</text>
                <text x="360" y="295" textAnchor="middle" fill="#ff4f8a" opacity="0.7">edge d · GPU resale (counter)</text>
              </g>
              <g>
                <circle cx="370" cy="80" r="32" fill="#0f0f1a" stroke="#f3f1ea" strokeWidth="1.5" />
                <circle cx="370" cy="80" r="8" fill="#7ed957" />
                <text x="370" y="50" textAnchor="middle" fontFamily="Newsreader" fontSize="17" fontWeight="600" fill="#f3f1ea">OpenAI</text>
                <text x="370" y="34" textAnchor="middle" fontFamily="Inter Tight" fontSize="10" letterSpacing="1.5" fill="#6a6680">MODEL LAB</text>

                <circle cx="150" cy="335" r="32" fill="#0f0f1a" stroke="#f3f1ea" strokeWidth="1.5" />
                <circle cx="150" cy="335" r="8" fill="#ff4f8a" />
                <text x="150" y="384" textAnchor="middle" fontFamily="Newsreader" fontSize="17" fontWeight="600" fill="#f3f1ea">NVIDIA</text>
                <text x="150" y="400" textAnchor="middle" fontFamily="Inter Tight" fontSize="10" letterSpacing="1.5" fill="#6a6680">SEMICONDUCTOR</text>

                <circle cx="570" cy="335" r="32" fill="#0f0f1a" stroke="#f3f1ea" strokeWidth="1.5" />
                <circle cx="570" cy="335" r="8" fill="#4f8eff" />
                <text x="570" y="384" textAnchor="middle" fontFamily="Newsreader" fontSize="17" fontWeight="600" fill="#f3f1ea">Microsoft</text>
                <text x="570" y="400" textAnchor="middle" fontFamily="Inter Tight" fontSize="10" letterSpacing="1.5" fill="#6a6680">HYPERSCALER</text>
              </g>
            </svg>
            <div className="ed-fig-caption">
              <strong>Figure 1.</strong> Solid edges form the canonical length-3 cycle. Dashed
              edges are observed counter-flows that strengthen the corresponding pairwise loop
              scores L(NVIDIA, Microsoft) and L(OpenAI, Microsoft). Colors indicate flow type:
              pink for compute, blue for cloud service, green for capital/equity.
            </div>
          </figure>

          <blockquote className="pull">
            Each side of the triangle is a public deal. Read together, they make one closed&nbsp;loop.
          </blockquote>

          <h2><span className="num">§ 2</span>Edge anatomy</h2>
          <p>
            The cycle decomposes into three primary edges and two counter-edges. Edge weights
            are normalized to an estimated annualized run-rate where deal magnitude is
            undisclosed; raw figures appear in the rightmost column.
          </p>

          <table className="edge-table">
            <thead>
              <tr><th style={{ width: '24%' }}>Edge</th><th style={{ width: '36%' }}>Description</th><th style={{ width: '12%' }}>Type</th><th style={{ width: '14%' }}>Weight wₑ</th><th style={{ textAlign: 'right' }}>Magnitude</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="from-to">OpenAI <span className="arr">→</span> NVIDIA</td>
                <td className="desc">GPU procurement contracted via cloud passthrough; estimated annualized.</td>
                <td><span className="ed-tag compute"><span className="dot" />compute</span></td>
                <td>0.78</td>
                <td>~$5.2B / yr</td>
              </tr>
              <tr>
                <td className="from-to">NVIDIA <span className="arr">→</span> Microsoft</td>
                <td className="desc">Data-center silicon shipments to Azure and OpenAI-dedicated capacity.</td>
                <td><span className="ed-tag compute"><span className="dot" />compute</span></td>
                <td>0.86</td>
                <td>~$8.0B / yr</td>
              </tr>
              <tr>
                <td className="from-to">Microsoft <span className="arr">→</span> OpenAI</td>
                <td className="desc">Equity tranches plus prepaid Azure credits, treated as combined capital flow.</td>
                <td><span className="ed-tag equity"><span className="dot" />equity</span></td>
                <td>0.92</td>
                <td>$13B+ disclosed</td>
              </tr>
              <tr>
                <td className="from-to">Microsoft <span className="arr">→</span> NVIDIA</td>
                <td className="desc">Counter-edge — chip purchase orders for Azure datacenter expansion.</td>
                <td><span className="ed-tag compute"><span className="dot" />compute</span></td>
                <td>0.62</td>
                <td>undisclosed</td>
              </tr>
              <tr>
                <td className="from-to">OpenAI <span className="arr">→</span> Microsoft</td>
                <td className="desc">Counter-edge — Azure committed spend tied to OpenAI workload.</td>
                <td><span className="ed-tag service"><span className="dot" />service</span></td>
                <td>0.81</td>
                <td>multi-year</td>
              </tr>
            </tbody>
          </table>

          <h2><span className="num">§ 3</span>Score derivation</h2>
          <p>Applying equation (2) from § 2.3 of the paper to the canonical 3-cycle:</p>
          <div className="equation">
            C(C-01)&nbsp;=&nbsp;0.78&nbsp;·&nbsp;0.86&nbsp;·&nbsp;0.92&nbsp;=&nbsp;<strong>0.617</strong>
          </div>
          <p>
            Length-normalized: <code>C(C-01)¹ᐟ³ ≈ 0.85</code>. The aggregate score reported in
            the index (3.41) sums this primary cycle with the two counter-edges that close
            shorter sub-loops L(OpenAI, Microsoft) and L(NVIDIA, Microsoft).
          </p>

          <h2><span className="num">§ 4</span>Timeline</h2>
          <div className="timeline">
            <div className="timeline-event accent">
              <div className="date">2023-01</div>
              <div className="what"><strong>Microsoft → OpenAI:</strong> $10B equity tranche announced; structured as multi-year capital plus Azure credits.</div>
            </div>
            <div className="timeline-event">
              <div className="date">2023-Q3</div>
              <div className="what"><strong>OpenAI → NVIDIA:</strong> first dedicated H100 cluster procurement, routed through Azure capacity.</div>
            </div>
            <div className="timeline-event">
              <div className="date">2024-Q1</div>
              <div className="what"><strong>NVIDIA → Microsoft:</strong> data-center revenue from MSFT enters NVIDIA top three customers; cycle closes.</div>
            </div>
            <div className="timeline-event accent">
              <div className="date">2024-Q4</div>
              <div className="what"><strong>Microsoft → OpenAI:</strong> follow-on capital contribution lifts cumulative investment past $13B.</div>
            </div>
            <div className="timeline-event">
              <div className="date">2025-Q2</div>
              <div className="what"><strong>OpenAI → Microsoft:</strong> long-dated Azure committed-spend agreement extends counter-edge through 2030.</div>
            </div>
          </div>

          <h2><span className="num">§ 5</span>Why it matters</h2>
          <p>
            Three implications follow from the structure. First, OpenAI&apos;s reported cloud
            spend is, in part, capital that originated as Microsoft equity — a fact that is
            orthogonal to whether either firm has done anything improper, but material to
            how revenue should be attributed. Second, NVIDIA&apos;s data-center growth is partly
            a derivative of capital that Microsoft chose to deploy through OpenAI rather
            than directly. Third, the three firms&apos; reported figures move together by
            construction.
          </p>

          <div className="open-q">
            <h3>Open questions</h3>
            <ol>
              <li>What share of OpenAI&apos;s cloud spend would persist if Microsoft&apos;s equity tranches were withdrawn?</li>
              <li>How sensitive is NVIDIA&apos;s data-center growth to the marginal Microsoft order driven by OpenAI workloads?</li>
              <li>Should consolidated revenue measures discount edges that close cycles within a single corporate cluster?</li>
            </ol>
          </div>

          <h2><span className="num">§ 6</span>Notes &amp; sources</h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)' }}>
            Magnitudes are estimates compiled from SEC filings, press releases, and reporting
            by major outlets through Q1 2026. Where deal value is undisclosed, weights are
            derived from the proxy method described in <Link href="/methodology#weights">§ 2.4 of the methodology</Link>.
            Counter-edge weights inherit the procurement-channel proxy.
          </p>

          <div className="cs-nav">
            <Link href="/case-studies">
              <span className="key">← Previous</span>
              Back to all case studies
            </Link>
            <Link href="/case-study" style={{ textAlign: 'right' }}>
              <span className="key">Next case</span>
              C-02 · Project Stargate →
            </Link>
          </div>
        </main>

        <aside className="cs-side">
          <div className="side-block">
            <h5>Contents</h5>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '6px 0', borderBottom: '1px solid var(--rule)' }}><a href="#">§ 1 The structure</a></li>
              <li style={{ padding: '6px 0', borderBottom: '1px solid var(--rule)' }}><a href="#">§ 2 Edge anatomy</a></li>
              <li style={{ padding: '6px 0', borderBottom: '1px solid var(--rule)' }}><a href="#">§ 3 Score derivation</a></li>
              <li style={{ padding: '6px 0', borderBottom: '1px solid var(--rule)' }}><a href="#">§ 4 Timeline</a></li>
              <li style={{ padding: '6px 0', borderBottom: '1px solid var(--rule)' }}><a href="#">§ 5 Why it matters</a></li>
            </ol>
          </div>
          <div className="side-block">
            <h5>Key Figures</h5>
            <div className="side-row"><span className="key">Cycle ID</span><span>C—01</span></div>
            <div className="side-row"><span className="key">Length</span><span>3</span></div>
            <div className="side-row"><span className="key">C-score</span><span>0.617</span></div>
            <div className="side-row"><span className="key">Hub contrib.</span><span>+1.42</span></div>
            <div className="side-row"><span className="key">First closed</span><span>2024-Q1</span></div>
          </div>
          <div className="side-block">
            <h5>Firms</h5>
            <div className="side-row"><span className="key">OpenAI</span><span>Model lab</span></div>
            <div className="side-row"><span className="key">Microsoft</span><span>Hyperscaler</span></div>
            <div className="side-row"><span className="key">NVIDIA</span><span>Semi</span></div>
          </div>
          <div className="side-block">
            <h5>Related</h5>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13 }}>
              <li style={{ padding: '6px 0' }}><Link href="/case-study">L-01 NVIDIA ↔ Microsoft</Link></li>
              <li style={{ padding: '6px 0' }}><Link href="/case-study">L-02 OpenAI ↔ Microsoft</Link></li>
              <li style={{ padding: '6px 0' }}><Link href="/case-study">C-04 NVIDIA · CoreWeave</Link></li>
            </ol>
          </div>
        </aside>
      </div>

      <SiteFooter />

      <style>{`
        .cs-head { padding: 56px 0 48px; border-bottom: 1px solid var(--ink); }
        .cs-breadcrumb {
          font-family: var(--sans-ed);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          margin-bottom: 22px;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .cs-breadcrumb a { color: var(--ink-mute); border: 0; }
        .cs-breadcrumb a:hover { color: var(--ink); border: 0; }
        .cs-id {
          font-family: var(--mono-ed);
          font-size: 12px;
          color: var(--ed-accent);
          letter-spacing: 0.06em;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .cs-head h1 {
          font-size: 60px;
          line-height: 1.04;
          font-weight: 400;
          letter-spacing: -0.024em;
          margin-bottom: 18px;
          max-width: 22ch;
        }
        .cs-head h1 em { font-style: italic; color: var(--ed-accent); font-weight: 300; }
        .cs-head .deck {
          font-size: 22px;
          line-height: 1.45;
          color: var(--ink-soft);
          font-weight: 300;
          max-width: 56ch;
          font-style: italic;
          margin-bottom: 28px;
          font-family: var(--serif);
        }
        .cs-meta-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          padding: 18px 0;
          gap: 24px;
        }
        .cs-meta-row .ed-stat-num { font-size: 32px; }
        .cs-meta-row .ed-stat { padding: 0 16px; border-right: 1px solid var(--rule); }
        .cs-meta-row .ed-stat:last-child { border-right: 0; }

        .cs-body {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 80px;
          padding: 60px 40px;
          max-width: 1300px;
          margin: 0 auto;
        }
        .cs-main { max-width: 64ch; }
        .cs-side {
          position: sticky;
          top: 80px;
          align-self: start;
          font-family: var(--sans-ed);
          font-size: 13px;
        }
        .cs-side h5 {
          font-family: var(--sans-ed);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          font-weight: 700;
          margin: 0 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--rule);
        }
        .cs-side .side-block { margin-bottom: 28px; }
        .cs-side .side-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid var(--rule);
          color: var(--ink-2);
        }
        .cs-side .side-row .key { color: var(--ink-mute); }

        .cs-main .lede-graf {
          font-size: 21px;
          line-height: 1.5;
          color: var(--ink-2);
          font-weight: 300;
          margin-bottom: 36px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--rule);
          font-family: var(--serif);
        }
        .cs-main h2 {
          font-size: 30px;
          margin: 48px 0 16px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
          font-weight: 500;
          letter-spacing: -0.014em;
        }
        .cs-main h2 .num {
          font-style: italic;
          color: var(--ink-mute);
          font-weight: 300;
          margin-right: 12px;
          font-family: var(--serif);
        }
        .cs-main h3 { font-size: 20px; margin: 28px 0 8px; }
        .cs-main p { font-size: 17px; line-height: 1.7; margin-bottom: 1em; font-family: var(--serif); color: var(--ink-2); }

        .cs-diagram {
          background: var(--bg-3);
          border: 1px solid var(--rule-strong);
          padding: 32px;
          margin: 16px 0 8px;
          width: 100%;
        }
        .cs-diagram svg { width: 100%; height: auto; display: block; }

        blockquote.pull {
          font-family: var(--serif);
          font-style: italic;
          font-size: 26px;
          line-height: 1.4;
          color: var(--ink);
          border-left: 2px solid var(--ed-accent);
          padding: 8px 0 8px 24px;
          margin: 32px 0;
          font-weight: 300;
          letter-spacing: -0.01em;
        }

        .edge-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--serif);
          font-size: 14.5px;
          margin: 16px 0 24px;
        }
        .edge-table thead th {
          font-family: var(--sans-ed);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-mute);
          text-align: left;
          padding: 10px 12px 10px 0;
          border-bottom: 2px solid var(--ink);
          font-weight: 700;
        }
        .edge-table tbody td {
          padding: 14px 12px 14px 0;
          border-bottom: 1px solid var(--rule);
          vertical-align: top;
          font-feature-settings: "lnum","tnum";
          color: var(--ink-2);
        }
        .edge-table .from-to { font-family: var(--serif); font-weight: 500; color: var(--ink); }
        .edge-table .from-to .arr { color: var(--ink-mute); margin: 0 6px; }
        .edge-table .desc { font-family: var(--sans-ed); font-size: 13px; color: var(--ink-soft); }

        .equation {
          font-family: var(--mono-ed);
          font-size: 14px;
          background: var(--bg-3);
          padding: 16px 20px;
          margin: 20px 0;
          border-left: 2px solid var(--ed-accent);
          color: var(--ink-2);
        }
        .equation strong { color: var(--ink); font-weight: 500; }

        .timeline {
          border-left: 1px solid var(--ink);
          padding: 4px 0 4px 24px;
          margin: 24px 0;
        }
        .timeline-event { margin-bottom: 18px; position: relative; }
        .timeline-event::before {
          content: "";
          position: absolute;
          left: -29px;
          top: 8px;
          width: 9px; height: 9px;
          border-radius: 50%;
          background: #0c1118;
          border: 1.5px solid var(--ink);
        }
        .timeline-event.accent::before { background: var(--ed-accent); border-color: var(--ed-accent); }
        .timeline-event .date {
          font-family: var(--mono-ed);
          font-size: 12px;
          color: var(--ink-mute);
          letter-spacing: 0.04em;
        }
        .timeline-event .what {
          font-family: var(--serif);
          font-size: 16px;
          color: var(--ink-2);
          margin-top: 2px;
          line-height: 1.45;
        }
        .timeline-event .what strong { font-weight: 600; color: var(--ink); }

        .open-q {
          background: var(--bg-3);
          border-top: 2px solid var(--ink);
          border-bottom: 1px solid var(--rule);
          padding: 24px 28px;
          margin: 28px 0;
        }
        .open-q h3 {
          font-family: var(--sans-ed);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          font-weight: 700;
          margin: 0 0 14px;
        }
        .open-q ol {
          padding-left: 22px;
          margin: 0;
          font-size: 17px;
          line-height: 1.6;
        }
        .open-q ol li { margin-bottom: 10px; padding-left: 4px; color: var(--ink-2); font-family: var(--serif); }
        .open-q ol li::marker { font-style: italic; color: var(--ed-accent); font-family: var(--serif); }

        .cs-nav {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--rule);
          padding: 32px 0;
          margin-top: 48px;
          font-family: var(--sans-ed);
          font-size: 14px;
        }
        .cs-nav a { color: var(--ink); border: 0; }
        .cs-nav .key {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-mute);
          font-weight: 700;
          display: block;
          margin-bottom: 4px;
        }

        @media (max-width: 980px) {
          .cs-body { grid-template-columns: 1fr; gap: 32px; padding: 40px 20px; }
          .cs-side { position: static; }
          .cs-meta-row { grid-template-columns: 1fr 1fr; gap: 12px; }
          .cs-meta-row .ed-stat { border-right: 0; border-bottom: 1px solid var(--rule); padding-bottom: 12px; }
          .cs-head h1 { font-size: 38px; }
        }
      `}</style>
    </main>
  );
}
