import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

export default function MethodologyPage() {
  return (
    <main className="ed-page">
      <SiteHeader active="methodology" />

      <section className="m-head">
        <div className="ed-container-wide">
          <div className="breadcrumb">Supplement to § 2 of the paper</div>
          <h1>Methodology &amp; <em>data</em>.</h1>
          <p className="lede">A long-form companion to the formal definitions in the paper, including selection criteria, edge weighting, cycle enumeration, and known limitations.</p>
        </div>
      </section>

      <div className="m-body">
        <aside className="m-toc">
          <h5>Contents</h5>
          <ol>
            <li><a href="#scope">Scope</a></li>
            <li><a href="#sample">Sample selection</a></li>
            <li><a href="#deals">Deal taxonomy</a></li>
            <li><a href="#weights">Edge weighting</a></li>
            <li><a href="#enum">Cycle enumeration</a></li>
            <li><a href="#metrics">Metric definitions</a></li>
            <li><a href="#limits">Limitations</a></li>
            <li><a href="#repro">Reproducibility</a></li>
          </ol>
        </aside>

        <main className="m-text">
          <section id="scope">
            <h2><span className="num">§ 1</span>Scope</h2>
            <p className="ed-dropcap">The methodology is restricted to publicly disclosed deals among firms whose primary revenue is derived from AI model development, hyperscale cloud infrastructure, or semiconductor manufacturing. Private equity stakes below 5% are excluded unless they accompany a service or supply commitment material to either party.</p>
            <p>The corpus is constructed from SEC filings (10-K, 10-Q, 8-K), audited financial statements, official press releases, and contemporaneous reporting in the financial press. Where deal value is undisclosed, magnitude is estimated using the proxy method described in §&nbsp;4.</p>
          </section>

          <section id="sample">
            <h2><span className="num">§ 2</span>Sample selection</h2>
            <p>The 28-firm sample was constructed using a three-step procedure:</p>
            <p><strong>(i) Stratum definition.</strong> Firms were grouped into four strata: AI model labs, hyperscale cloud providers, semiconductor manufacturers, and capital providers (sovereign and private).</p>
            <p><strong>(ii) Inclusion threshold.</strong> Within each stratum, firms with at least one disclosed deal of $100M+ in the 2022–2025 window were included.</p>
            <p><strong>(iii) Adjacency closure.</strong> Firms that fell below threshold but appeared on at least three deal records with already-included firms were added to preserve cycle visibility.</p>
          </section>

          <section id="deals">
            <h2><span className="num">§ 3</span>Deal taxonomy</h2>
            <p>Each edge is classified into one of four flow types:</p>
            <p><span className="ed-tag money"><span className="dot" />money</span>&nbsp;Direct capital transfers, debt instruments, prepayments.</p>
            <p><span className="ed-tag compute"><span className="dot" />compute</span>&nbsp;Sale or supply of physical hardware (GPUs, accelerators, networking).</p>
            <p><span className="ed-tag service"><span className="dot" />service</span>&nbsp;Multi-year cloud, API, or compute-as-a-service commitments.</p>
            <p><span className="ed-tag equity"><span className="dot" />equity</span>&nbsp;Common, preferred, or convertible equity stakes.</p>
          </section>

          <section id="weights">
            <h2><span className="num">§ 4</span>Edge weighting</h2>
            <p>Each edge carries a normalized weight <em>wₑ ∈ (0, 1]</em>. The weighting function combines disclosed value with deal recency and confidence:</p>
            <div className="equation">wₑ = α · normValue(e) + β · recency(e) + γ · confidence(e) <span className="label">(eq. 4)</span></div>
            <p>with α + β + γ = 1, defaults α = 0.6, β = 0.25, γ = 0.15. Sensitivity analyses with alternate weightings are reported in Appendix&nbsp;B of the paper.</p>
          </section>

          <section id="enum">
            <h2><span className="num">§ 5</span>Cycle enumeration</h2>
            <p>Simple directed cycles are enumerated using Johnson&apos;s algorithm, which is polynomial in <em>(|V| + |E|)(c + 1)</em> where <em>c</em> is the number of elementary cycles. For the present sample the bound is comfortably tractable.</p>
            <pre className="code"><span className="c"># pseudocode</span>{'\n'}G = build_multigraph(deals){'\n'}<span className="k">for</span> cycle <span className="k">in</span> johnson(G):{'\n'}    <span className="k">if</span> 3 &lt;= len(cycle) &lt;= MAX_LEN:{'\n'}        score = product(weight[e] <span className="k">for</span> e <span className="k">in</span> cycle){'\n'}        record(cycle, score)</pre>
            <p>Cycles longer than length 6 are dropped to keep interpretation tractable; in the current sample no cycle of length 7+ would survive the inclusion threshold anyway.</p>
          </section>

          <section id="metrics">
            <h2><span className="num">§ 6</span>Metric definitions</h2>
            <p>The three metrics — Loop, Cycle, Hub — are defined in §&nbsp;2 of the paper. This section restates them with the implementation conventions used in the released code.</p>
            <div className="equation">L(a, b) = (Σ wᵢ : a→b) · (Σ wⱼ : b→a) <span className="label">(eq. 1)</span></div>
            <div className="equation">C(s) = ∏ wₑ : e ∈ s,&nbsp;&nbsp;|s| ≥ 3 <span className="label">(eq. 2)</span></div>
            <div className="equation">H(v) = Σₛ 1{'{v ∈ s}'} · score(s) <span className="label">(eq. 3)</span></div>
          </section>

          <section id="limits">
            <h2><span className="num">§ 7</span>Limitations</h2>
            <p><strong>Disclosure bias.</strong> Private contracts and undisclosed terms may systematically understate cycle density.</p>
            <p><strong>Stratum boundaries.</strong> Firms that span strata (e.g., NVIDIA&apos;s growing software footprint) introduce ambiguity in role assignment.</p>
            <p><strong>Temporal alignment.</strong> Deals that close years apart are treated as edges in a single graph; the methodology does not currently model time-varying weights.</p>
          </section>

          <section id="repro">
            <h2><span className="num">§ 8</span>Reproducibility</h2>
            <p>Source data (CSV) and analysis code (Python) are released alongside the paper. The released artifact reproduces every figure and table in the paper from raw inputs in a single command.</p>
            <p style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="#" className="ed-btn ghost" style={{ padding: '8px 14px' }}>Sample data (CSV) ↓</Link>
              <Link href="#" className="ed-btn ghost" style={{ padding: '8px 14px' }}>Analysis code (GitHub) →</Link>
            </p>
          </section>
        </main>
      </div>

      <SiteFooter />

      <style>{`
        .m-head { padding: 56px 0 40px; border-bottom: 1px solid var(--ink); }
        .m-head .breadcrumb {
          font-family: var(--sans-ed);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          margin-bottom: 20px;
        }
        .m-head h1 {
          font-size: 56px;
          font-weight: 400;
          letter-spacing: -0.022em;
          margin-bottom: 18px;
          max-width: 22ch;
        }
        .m-head h1 em { font-style: italic; color: var(--ed-accent); font-weight: 300; }
        .m-head .lede {
          max-width: 60ch;
          font-style: italic;
          color: var(--ink-soft);
          font-size: 20px;
          line-height: 1.5;
          font-weight: 300;
          font-family: var(--serif);
        }

        .m-body {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 80px;
          padding: 60px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .m-toc {
          position: sticky;
          top: 80px;
          align-self: start;
          font-family: var(--sans-ed);
          font-size: 13px;
        }
        .m-toc h5 {
          font-family: var(--sans-ed);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          font-weight: 700;
          margin-bottom: 14px;
        }
        .m-toc ol { list-style: none; padding: 0; margin: 0; counter-reset: section; }
        .m-toc ol li {
          counter-increment: section;
          padding: 7px 0;
          border-bottom: 1px solid var(--rule);
        }
        .m-toc ol li::before {
          content: "§ " counter(section, decimal-leading-zero) "  ";
          color: var(--ink-mute);
          font-family: var(--mono-ed);
          font-size: 11px;
        }
        .m-toc a { color: var(--ink-2); border: 0; }
        .m-toc a:hover { color: var(--ed-accent); border: 0; }

        .m-text { max-width: 64ch; }
        .m-text section { margin-bottom: 56px; }
        .m-text h2 {
          font-size: 28px;
          margin-bottom: 14px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
          font-weight: 500;
          letter-spacing: -0.012em;
        }
        .m-text h2 .num {
          font-style: italic;
          color: var(--ink-mute);
          font-weight: 300;
          margin-right: 12px;
          font-family: var(--serif);
        }
        .m-text h3 { font-size: 18px; margin: 28px 0 8px; }
        .m-text p {
          font-size: 17px;
          line-height: 1.7;
          margin-bottom: 1em;
          font-family: var(--serif);
          color: var(--ink-2);
        }
        .m-text strong { color: var(--ink); font-weight: 500; }

        .equation {
          font-family: var(--mono-ed);
          font-size: 14px;
          background: var(--bg-3);
          padding: 16px 20px;
          margin: 20px 0;
          border-left: 2px solid var(--ed-accent);
          line-height: 1.8;
          color: var(--ink-2);
        }
        .equation .label {
          float: right;
          color: var(--ink-mute);
          font-style: italic;
          font-family: var(--serif);
          font-size: 13px;
        }

        pre.code {
          font-family: var(--mono-ed);
          font-size: 13px;
          background: var(--bg-3);
          border: 1px solid var(--rule);
          padding: 16px;
          overflow-x: auto;
          line-height: 1.6;
          color: var(--ink-2);
        }
        pre.code .c { color: var(--ink-mute); }
        pre.code .k { color: var(--ed-accent); }

        @media (max-width: 980px) {
          .m-body { grid-template-columns: 1fr; gap: 32px; padding: 40px 20px; }
          .m-toc { position: static; }
          .m-head h1 { font-size: 38px; }
        }
      `}</style>
    </main>
  );
}
