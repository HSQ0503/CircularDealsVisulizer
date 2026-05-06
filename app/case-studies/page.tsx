'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

type FilterType = 'all' | 'loops' | 'cycles';
type SortKey = 'score' | 'length' | 'recency';

type CaseRow = {
  id: string;
  href: string;
  title: string;
  titleEm?: string;
  sub: string;
  firms: string[];
  score: string;
  length: number;
  type: 'cycle' | 'loop';
};

const CYCLES: CaseRow[] = [
  { id: 'C—01', href: '/case-study', title: 'The OpenAI · Microsoft · NVIDIA ', titleEm: 'triangle', sub: 'Equity → cloud → compute → equity', firms: ['OpenAI', 'NVIDIA', 'Microsoft'], score: '3.41', length: 3, type: 'cycle' },
  { id: 'C—02', href: '/case-study', title: 'Project Stargate', sub: 'A $500B bet on AI infrastructure', firms: ['SoftBank', 'OpenAI', 'Oracle', 'NVIDIA'], score: '2.87', length: 4, type: 'cycle' },
  { id: 'C—03', href: '/case-study', title: 'The Anthropic ', titleEm: 'proxy war', sub: 'Two cloud giants invest in the same lab', firms: ['Amazon', 'Anthropic', 'Google'], score: '2.42', length: 3, type: 'cycle' },
  { id: 'C—04', href: '/case-study', title: 'The GPU cloud loop', sub: 'NVIDIA invests, then buys back compute', firms: ['NVIDIA', 'CoreWeave', 'NVIDIA'], score: '2.18', length: 3, type: 'cycle' },
  { id: 'C—05', href: '/case-study', title: 'The TSMC fabrication loop', sub: 'Foundry spend recycles into design partnerships', firms: ['NVIDIA', 'TSMC', 'AMD', 'Microsoft'], score: '1.94', length: 4, type: 'cycle' },
  { id: 'C—06', href: '/case-study', title: 'The Salesforce enterprise loop', sub: 'SaaS revenue funds underlying compute', firms: ['Salesforce', 'OpenAI', 'Microsoft'], score: '1.66', length: 3, type: 'cycle' },
  { id: 'C—07', href: '/case-study', title: 'The xAI · Oracle · NVIDIA arc', sub: 'A new entrant joins the infrastructure cycle', firms: ['xAI', 'Oracle', 'NVIDIA'], score: '1.41', length: 3, type: 'cycle' },
  { id: 'C—08', href: '/case-study', title: 'The MGX sovereign cycle', sub: 'Sovereign capital re-enters via cloud commitments', firms: ['MGX', 'OpenAI', 'Microsoft', 'MGX'], score: '1.22', length: 4, type: 'cycle' },
];

const LOOPS: CaseRow[] = [
  { id: 'L—01', href: '/case-study', title: 'NVIDIA ', titleEm: '↔ Microsoft', sub: 'Compute supply ↔ data-center deployment', firms: ['NVIDIA', 'Microsoft'], score: '4.12', length: 6, type: 'loop' },
  { id: 'L—02', href: '/case-study', title: 'OpenAI ', titleEm: '↔ Microsoft', sub: 'Equity ↔ Azure committed spend', firms: ['OpenAI', 'Microsoft'], score: '3.88', length: 5, type: 'loop' },
  { id: 'L—03', href: '/case-study', title: 'Anthropic ', titleEm: '↔ Amazon', sub: 'Equity ↔ AWS / Trainium commitments', firms: ['Anthropic', 'Amazon'], score: '2.71', length: 4, type: 'loop' },
  { id: 'L—04', href: '/case-study', title: 'NVIDIA ', titleEm: '↔ CoreWeave', sub: 'Equity ↔ GPU buyback contract', firms: ['NVIDIA', 'CoreWeave'], score: '2.04', length: 3, type: 'loop' },
];

export default function CaseStudiesPage() {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [sortKey, setSortKey] = useState<SortKey>('score');

  const showCycles = typeFilter === 'all' || typeFilter === 'cycles';
  const showLoops = typeFilter === 'all' || typeFilter === 'loops';

  const sorter = (a: CaseRow, b: CaseRow) => {
    if (sortKey === 'score') return parseFloat(b.score) - parseFloat(a.score);
    if (sortKey === 'length') return b.length - a.length;
    return 0;
  };

  const cycles = [...CYCLES].sort(sorter);
  const loops = [...LOOPS].sort(sorter);

  return (
    <main className="ed-page">
      <SiteHeader active="cases" />

      <section className="page-head">
        <div className="ed-container-wide">
          <div className="breadcrumb">Catalog · § 4 supplement</div>
          <h1>Case <em>studies</em>.</h1>
          <p className="ed-lede" style={{ fontFamily: 'var(--serif)', maxWidth: '60ch' }}>
            Worked examples of the 35 circular structures identified in the sample. Each case traces
            one loop or cycle from primary deal disclosures, with edge weighting, score derivation, and
            the open questions raised by the structure.
          </p>
        </div>
      </section>

      <div className="ed-container-wide">
        <div className="filters">
          <span className="filter-label">Type</span>
          <div className="filter-group">
            <button className={`filter-pill ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => setTypeFilter('all')}>All · 35</button>
            <button className={`filter-pill ${typeFilter === 'loops' ? 'active' : ''}`} onClick={() => setTypeFilter('loops')}>Two-party loops · 7</button>
            <button className={`filter-pill ${typeFilter === 'cycles' ? 'active' : ''}`} onClick={() => setTypeFilter('cycles')}>Cycles · 28</button>
          </div>
          <span className="filter-label" style={{ marginLeft: 'auto' }}>Sort</span>
          <div className="filter-group">
            <button className={`filter-pill ${sortKey === 'score' ? 'active' : ''}`} onClick={() => setSortKey('score')}>Cycle Score ↓</button>
            <button className={`filter-pill ${sortKey === 'length' ? 'active' : ''}`} onClick={() => setSortKey('length')}>Length</button>
            <button className={`filter-pill ${sortKey === 'recency' ? 'active' : ''}`} onClick={() => setSortKey('recency')}>Recency</button>
          </div>
        </div>
      </div>

      <section className="featured-block">
        <div className="ed-container-wide">
          <div className="featured-grid">
            <div>
              <div className="ed-eyebrow accent">Featured · Cycle C-01</div>
              <h2>The OpenAI · Microsoft · NVIDIA triangle.</h2>
              <p className="ed-lede" style={{ fontFamily: 'var(--serif)' }}>
                The canonical length-3 cycle in the sample. Microsoft&apos;s $13B+ equity in OpenAI returns
                as Azure cloud commitments; OpenAI&apos;s GPU spend lands at NVIDIA, which sells to Microsoft&apos;s
                data centers. Closes the loop in roughly 18 months of disclosed deal flow.
              </p>
              <div className="stats">
                <div className="ed-stat"><div className="ed-stat-num"><em>3.4</em></div><div className="ed-stat-label">Cycle Score</div></div>
                <div className="ed-stat"><div className="ed-stat-num">3</div><div className="ed-stat-label">Firms</div></div>
                <div className="ed-stat"><div className="ed-stat-num">5</div><div className="ed-stat-label">Edges</div></div>
                <div className="ed-stat"><div className="ed-stat-num">$13B+</div><div className="ed-stat-label">Equity in cycle</div></div>
              </div>
              <Link href="/case-study" className="ed-btn">Read case study →</Link>
            </div>
            <figure className="mini-graph">
              <div className="ed-figure-num" style={{ marginBottom: 14 }}>Figure — C-01</div>
              <svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <defs>
                  <marker id="cs-ar1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ff4f8a" /></marker>
                  <marker id="cs-ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7ed957" /></marker>
                  <marker id="cs-ar3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#4f8eff" /></marker>
                </defs>
                <g fill="none" strokeWidth="1.4">
                  <path d="M 180 60 L 90 180" stroke="#ff4f8a" markerEnd="url(#cs-ar1)" />
                  <path d="M 90 188 L 270 188" stroke="#4f8eff" markerEnd="url(#cs-ar3)" />
                  <path d="M 270 180 L 180 60" stroke="#7ed957" markerEnd="url(#cs-ar2)" />
                </g>
                <g>
                  <circle cx="180" cy="44" r="20" fill="#0f0f1a" stroke="#f3f1ea" strokeWidth="1.5" />
                  <circle cx="180" cy="44" r="5" fill="#7ed957" />
                  <text x="180" y="22" textAnchor="middle" fontFamily="Newsreader" fontSize="13" fontWeight="600" fill="#f3f1ea">OpenAI</text>

                  <circle cx="80" cy="190" r="20" fill="#0f0f1a" stroke="#f3f1ea" strokeWidth="1.5" />
                  <circle cx="80" cy="190" r="5" fill="#ff4f8a" />
                  <text x="80" y="228" textAnchor="middle" fontFamily="Newsreader" fontSize="13" fontWeight="600" fill="#f3f1ea">NVIDIA</text>

                  <circle cx="280" cy="190" r="20" fill="#0f0f1a" stroke="#f3f1ea" strokeWidth="1.5" />
                  <circle cx="280" cy="190" r="5" fill="#4f8eff" />
                  <text x="280" y="228" textAnchor="middle" fontFamily="Newsreader" fontSize="13" fontWeight="600" fill="#f3f1ea">Microsoft</text>
                </g>
              </svg>
            </figure>
          </div>
        </div>
      </section>

      {showCycles && (
        <section className="case-list-section">
          <div className="ed-container-wide">
            <h2>Multi-party cycles <span className="count">28 structures, length 3 – 6</span></h2>
            <div className="table-head">
              <div>ID</div>
              <div>Title</div>
              <div>Firms involved</div>
              <div className="right">Cycle Score</div>
              <div className="right">Length</div>
              <div>Type</div>
              <div></div>
            </div>
            {cycles.map(c => <CaseRowItem key={c.id} row={c} />)}
            <p className="ed-muted" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', marginTop: 28, fontSize: 14 }}>
              Showing {cycles.length} of 28 cycles.
            </p>
          </div>
        </section>
      )}

      {showLoops && (
        <section className="case-list-section" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--rule)' }}>
          <div className="ed-container-wide">
            <h2>Two-party loops <span className="count">7 pairwise structures</span></h2>
            <div className="table-head">
              <div>ID</div>
              <div>Title</div>
              <div>Firms involved</div>
              <div className="right">Loop Score</div>
              <div className="right">Edges</div>
              <div>Type</div>
              <div></div>
            </div>
            {loops.map(l => <CaseRowItem key={l.id} row={l} />)}
            <p className="ed-muted" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', marginTop: 28, fontSize: 14 }}>
              Showing {loops.length} of 7 loops.
            </p>
          </div>
        </section>
      )}

      <SiteFooter />

      <style>{`
        .page-head { padding: 56px 0 40px; border-bottom: 1px solid var(--ink); }
        .page-head .breadcrumb {
          font-family: var(--sans-ed);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          margin-bottom: 20px;
        }
        .page-head h1 { font-size: 56px; font-weight: 400; letter-spacing: -0.022em; margin-bottom: 16px; }
        .page-head h1 em { font-style: italic; color: var(--ed-accent); font-weight: 300; }

        .filters {
          display: flex;
          gap: 28px;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid var(--rule);
          font-family: var(--sans-ed);
          font-size: 13px;
          flex-wrap: wrap;
        }
        .filter-label {
          color: var(--ink-mute);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 700;
        }
        .filter-group { display: flex; gap: 4px; }
        .filter-pill {
          border: 1px solid var(--rule-strong);
          padding: 5px 11px;
          cursor: pointer;
          background: transparent;
          font-family: var(--sans-ed);
          font-size: 12.5px;
          color: var(--ink-soft);
        }
        .filter-pill:hover { border-color: var(--ink); color: var(--ink); }
        .filter-pill.active { background: var(--ink); color: #0c1118; border-color: var(--ink); }

        .featured-block { padding: 48px 0; border-bottom: 1px solid var(--rule); }
        .featured-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 56px; align-items: center; }
        .featured-block h2 {
          font-size: 38px;
          font-weight: 400;
          letter-spacing: -0.018em;
          margin-bottom: 14px;
        }
        .featured-block .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          margin: 24px 0;
          padding: 16px 0;
        }
        .featured-block .stats .ed-stat-num { font-size: 28px; }
        .featured-block .stats .ed-stat { padding: 0 14px; border-right: 1px solid var(--rule); }
        .featured-block .stats .ed-stat:last-child { border-right: 0; }

        .case-list-section { padding: 48px 0; }
        .case-list-section h2 {
          font-size: 22px;
          font-family: var(--sans-ed);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink);
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--ink);
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .case-list-section h2 .count {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 300;
          text-transform: none;
          letter-spacing: 0;
          color: var(--ink-mute);
          font-size: 16px;
        }

        .case-row {
          display: grid;
          grid-template-columns: 100px 2.2fr 1.6fr 110px 110px 100px 40px;
          gap: 20px;
          padding: 22px 0;
          border-bottom: 1px solid var(--rule);
          align-items: center;
          transition: background .12s;
          cursor: pointer;
          font-family: var(--serif);
          border-left: 0;
          border-right: 0;
          border-top: 0;
        }
        .case-row:hover { background: var(--bg-3); }
        .case-row .ix {
          font-family: var(--mono-ed);
          font-size: 12px;
          color: var(--ink-mute);
          letter-spacing: 0.04em;
        }
        .case-row .title h3 {
          font-size: 19px;
          font-weight: 500;
          line-height: 1.25;
          margin: 0 0 4px;
          color: var(--ink);
        }
        .case-row .title h3 em { color: var(--ed-accent); font-style: italic; font-weight: 400; }
        .case-row .title .sub { font-family: var(--sans-ed); font-size: 12px; color: var(--ink-soft); }
        .case-row .firms { font-family: var(--sans-ed); font-size: 13px; color: var(--ink-2); line-height: 1.5; }
        .case-row .firms .arrow { color: var(--ink-mute); margin: 0 6px; }
        .case-row .num-cell {
          font-family: var(--serif);
          font-size: 22px;
          font-feature-settings: "lnum","tnum";
          color: var(--ink);
          text-align: right;
        }
        .case-row .num-cell small {
          display: block;
          font-family: var(--sans-ed);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-mute);
          margin-top: 2px;
          font-weight: 600;
        }
        .case-row .type-cell {
          font-family: var(--sans-ed);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-weight: 600;
        }
        .case-row .type-cell .typetag {
          border: 1px solid var(--rule-strong);
          padding: 3px 7px;
          display: inline-block;
        }
        .case-row .type-cell.cycle .typetag { background: var(--bg-3); }
        .case-row .type-cell.loop .typetag { background: var(--ink); color: #0c1118; border-color: var(--ink); }
        .case-row .arrow-go {
          font-family: var(--serif);
          font-size: 22px;
          color: var(--ink-mute);
          text-align: right;
        }
        .case-row:hover .arrow-go { color: var(--ed-accent); }

        .table-head {
          display: grid;
          grid-template-columns: 100px 2.2fr 1.6fr 110px 110px 100px 40px;
          gap: 20px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--ink);
          font-family: var(--sans-ed);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-mute);
          font-weight: 700;
        }
        .table-head .right { text-align: right; }

        .mini-graph { background: var(--bg-3); border: 1px solid var(--rule-strong); padding: 24px; }

        @media (max-width: 980px) {
          .featured-grid { grid-template-columns: 1fr; }
          .featured-block .stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .featured-block .stats .ed-stat { border-right: 0; border-bottom: 1px solid var(--rule); padding-bottom: 12px; }
          .case-row, .table-head { grid-template-columns: 60px 1fr 80px; gap: 12px; }
          .case-row .firms, .case-row .num-cell:not(:nth-of-type(4)), .case-row .type-cell, .table-head > :nth-child(n+3) { display: none; }
          .table-head > :nth-child(2) { display: block; }
          .page-head h1 { font-size: 38px; }
        }
      `}</style>
    </main>
  );
}

function CaseRowItem({ row }: { row: CaseRow }) {
  return (
    <Link href={row.href} className="case-row">
      <div className="ix">{row.id}</div>
      <div className="title">
        <h3>{row.title}{row.titleEm && <em>{row.titleEm}</em>}</h3>
        <div className="sub">{row.sub}</div>
      </div>
      <div className="firms">
        {row.firms.map((f, i) => (
          <span key={i}>
            {f}
            {i < row.firms.length - 1 ? <span className="arrow"> → </span> : <span className="arrow"> ↺</span>}
          </span>
        ))}
      </div>
      <div className="num-cell">{row.score}<small>{row.type === 'loop' ? 'L-score' : 'score'}</small></div>
      <div className="num-cell">{row.length}<small>edges</small></div>
      <div className={`type-cell ${row.type}`}><span className="typetag">{row.type === 'loop' ? 'Loop' : 'Cycle'}</span></div>
      <div className="arrow-go">→</div>
    </Link>
  );
}
