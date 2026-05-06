import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

export default function Home() {
  return (
    <main className="ed-page">
      <SiteHeader />

      {/* MASTHEAD */}
      <div className="ed-container-wide">
        <div className="masthead">
          <div className="masthead-inner">
            <div className="masthead-left">
              <span className="live">Working Paper</span>
              <span>Vol. 01 · No. 01</span>
            </div>
            <div className="masthead-center">A working paper on financial circularity in artificial-intelligence markets.</div>
            <div className="masthead-right">
              <span>May 2026</span>
              <span>32 pp.</span>
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="ed-container-wide">
          <div className="hero-grid">
            <div>
              <div className="kicker">
                <span>WP / 2026.05 · Network Finance</span>
                <span>JEL · G32 · L86 · D85</span>
              </div>
              <h1>
                <span className="small">A study of financial circularity, 2022–2025</span>
                <span>Capital that returns to its <span className="accent-word">source</span>.</span>
              </h1>
              <p className="hero-lede">
                Measuring capital that flows in loops across the AI industry.
              </p>
              <dl className="byline">
                <dt>Author</dt>
                <dd>Shouqi Han</dd>
                <dt>Sample</dt>
                <dd>28 firms · 90 deals · 2022–2025</dd>
                <dt>Findings</dt>
                <dd>35 circular structures (7 two-party loops, 28 multi-party cycles)</dd>
              </dl>
              <div className="hero-actions">
                <Link href="/research" className="ed-btn">Read the paper →</Link>
                <Link href="/graph" className="ed-btn ghost">Explore the graph</Link>
                <Link href="/research#cite" className="ed-btn ghost">Cite</Link>
              </div>
            </div>

            {/* Right: figure */}
            <figure className="hero-figure">
              <div className="hero-figure-head">
                <span>Figure 01</span>
                <span className="title">Sample network — featured cycle C-01</span>
              </div>
              <svg className="graph-svg" viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" aria-label="Network of circular AI deals">
                <defs>
                  <marker id="arr-money" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7ed957" /></marker>
                  <marker id="arr-compute" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ff4f8a" /></marker>
                  <marker id="arr-service" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#4f8eff" /></marker>
                </defs>
                <g stroke="#ffffff08" strokeWidth="0.5">
                  <line x1="0" y1="120" x2="720" y2="120" />
                  <line x1="0" y1="240" x2="720" y2="240" />
                  <line x1="0" y1="360" x2="720" y2="360" />
                  <line x1="180" y1="0" x2="180" y2="480" />
                  <line x1="360" y1="0" x2="360" y2="480" />
                  <line x1="540" y1="0" x2="540" y2="480" />
                </g>
                <g stroke="#5e5d57" strokeWidth="0.6" fill="none" opacity="0.32">
                  <line x1="60" y1="80" x2="200" y2="120" />
                  <line x1="200" y1="120" x2="160" y2="240" />
                  <line x1="160" y1="240" x2="80" y2="320" />
                  <line x1="500" y1="60" x2="640" y2="120" />
                  <line x1="640" y1="120" x2="600" y2="280" />
                  <line x1="600" y1="280" x2="640" y2="380" />
                  <line x1="200" y1="120" x2="500" y2="60" />
                  <line x1="80" y1="320" x2="640" y2="380" />
                  <line x1="160" y1="240" x2="600" y2="280" />
                  <line x1="60" y1="80" x2="500" y2="60" />
                  <line x1="640" y1="120" x2="700" y2="240" />
                  <line x1="40" y1="240" x2="160" y2="240" />
                </g>
                <g fill="#5e5d57" opacity="0.45">
                  <circle cx="60" cy="80" r="2.5" />
                  <circle cx="200" cy="120" r="2.5" />
                  <circle cx="160" cy="240" r="2.5" />
                  <circle cx="80" cy="320" r="2.5" />
                  <circle cx="500" cy="60" r="2.5" />
                  <circle cx="640" cy="120" r="2.5" />
                  <circle cx="600" cy="280" r="2.5" />
                  <circle cx="640" cy="380" r="2.5" />
                  <circle cx="100" cy="200" r="2" />
                  <circle cx="540" cy="180" r="2" />
                  <circle cx="700" cy="240" r="2" />
                  <circle cx="40" cy="240" r="2" />
                </g>
                <g fill="none" strokeWidth="1.6">
                  <path d="M 540 320 Q 430 200 380 130" stroke="#7ed957" markerEnd="url(#arr-money)" />
                  <path d="M 410 130 Q 490 220 560 310" stroke="#4f8eff" markerEnd="url(#arr-service)" />
                  <path d="M 340 130 Q 240 230 215 320" stroke="#ff4f8a" markerEnd="url(#arr-compute)" />
                  <path d="M 220 340 L 530 340" stroke="#ff4f8a" markerEnd="url(#arr-compute)" />
                  <path d="M 530 320 Q 380 270 220 320" stroke="#7ed957" strokeDasharray="3 4" markerEnd="url(#arr-money)" opacity="0.7" />
                </g>
                <g>
                  <circle cx="375" cy="100" r="22" fill="#0c1118" stroke="#ecebe6" strokeWidth="1.4" />
                  <circle cx="375" cy="100" r="6" fill="#7ed957" />
                  <text x="375" y="62" textAnchor="middle" fontFamily="Inter Tight" fontSize="13" fontWeight="500" fill="#ecebe6">OpenAI</text>
                  <text x="375" y="48" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5" fill="#8e8d85">N1</text>

                  <circle cx="200" cy="340" r="24" fill="#0c1118" stroke="#ecebe6" strokeWidth="1.4" />
                  <circle cx="200" cy="340" r="7" fill="#ff4f8a" />
                  <text x="200" y="394" textAnchor="middle" fontFamily="Inter Tight" fontSize="13" fontWeight="500" fill="#ecebe6">NVIDIA</text>
                  <text x="200" y="408" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5" fill="#8e8d85">N2</text>

                  <circle cx="560" cy="340" r="23" fill="#0c1118" stroke="#ecebe6" strokeWidth="1.4" />
                  <circle cx="560" cy="340" r="6.5" fill="#4f8eff" />
                  <text x="560" y="394" textAnchor="middle" fontFamily="Inter Tight" fontSize="13" fontWeight="500" fill="#ecebe6">Microsoft</text>
                  <text x="560" y="408" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5" fill="#8e8d85">N3</text>
                </g>
                <g fontFamily="JetBrains Mono" fontSize="9" fill="#8e8d85" letterSpacing="0.5">
                  <text x="465" y="200" textAnchor="middle">e1 · $13B equity</text>
                  <text x="510" y="232" textAnchor="middle">e2 · cloud commit</text>
                  <text x="248" y="222" textAnchor="middle">e3 · GPU supply</text>
                  <text x="380" y="332" textAnchor="middle">e4 · DC silicon</text>
                  <text x="380" y="290" textAnchor="middle">e5 · capex transfer</text>
                </g>
              </svg>
              <div className="hero-figure-foot">
                <div className="legend-row">
                  <div className="item"><span className="swatch" style={{ background: '#7ed957' }} />Capital / equity</div>
                  <div className="item"><span className="swatch" style={{ background: '#ff4f8a' }} />Compute hardware</div>
                  <div className="item"><span className="swatch" style={{ background: '#4f8eff' }} />Cloud service</div>
                </div>
                <div>n = 28 · m = 90</div>
              </div>
            </figure>
          </div>

          {/* Run-of-numbers */}
          <div className="runstrip">
            <div className="ed-stat stat">
              <div className="ed-stat-num">28</div>
              <div className="ed-stat-label">Companies in sample</div>
              <div className="ed-stat-sub">AI · cloud · semiconductor</div>
            </div>
            <div className="ed-stat stat">
              <div className="ed-stat-num">90</div>
              <div className="ed-stat-label">Deals analyzed</div>
              <div className="ed-stat-sub">2022 – 2025</div>
            </div>
            <div className="ed-stat stat">
              <div className="ed-stat-num"><em>35</em></div>
              <div className="ed-stat-label">Circular structures</div>
              <div className="ed-stat-sub">7 loops · 28 cycles</div>
            </div>
            <div className="ed-stat stat">
              <div className="ed-stat-num">3</div>
              <div className="ed-stat-label">Quantitative metrics</div>
              <div className="ed-stat-sub">Loop · Cycle · Hub</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABSTRACT */}
      <section className="abstract-section">
        <div className="ed-container">
          <div className="abstract-grid">
            <aside className="abstract-side">
              <span className="label">Abstract</span>
              <dl>
                <dt>Author</dt>
                <dd>Shouqi Han</dd>
                <dt>Date</dt>
                <dd>May 2026</dd>
                <dt>Keywords</dt>
                <dd>circular finance · AI industry · network analysis · systemic risk · revenue recognition</dd>
                <dt>JEL Classification</dt>
                <dd>G32 · L86 · D85</dd>
              </dl>
              <Link href="/research" className="ed-btn ghost" style={{ padding: '9px 16px', fontSize: 13, marginTop: 24 }}>Full paper →</Link>
            </aside>
            <div className="abstract-body">
              <p className="ed-dropcap">
                The artificial-intelligence industry has experienced unprecedented levels of capital growth,
                with major technology companies participating in complex webs of investments, cloud-service
                commitments, and hardware supply agreements. This paper presents a novel methodology to
                measure and quantify the flow of <em>circular deals</em> in corporate ecosystems — instances
                where capital or value flows between companies through different mechanisms, creating loops
                of different lengths.
              </p>
              <p>
                Three complementary metrics are introduced: the <strong>Loop Score</strong>, which measures
                circularity between company pairs; the <strong>Cycle Score</strong>, which tracks multi-party
                cycles involving three or more companies; and the <strong>Hub Score</strong>, which
                aggregates participation across all circular structures to identify systemically central
                entities.
              </p>
              <p>
                Across 90 deals among a curated set of 28 prominent AI, cloud, and semiconductor companies
                from 2022–2025, we identify <strong>35 total circular structures</strong> consisting of 7
                two-party loops and 28 multi-party cycles. Findings show that circular patterns are common
                among major AI companies in the sample, with certain infrastructure providers participating
                in numerous circular flows.
              </p>
              <p className="ed-muted" style={{ fontSize: 16 }}>
                Implications are discussed for revenue recognition, valuation interdependence, systemic-risk
                assessment, and market transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THREE METRICS */}
      <section className="three-metrics">
        <div className="ed-container-wide">
          <div className="ed-section-head">
            <div className="num">§ 02 / METHODOLOGY</div>
            <div>
              <div className="ed-eyebrow">Three complementary metrics</div>
              <h2 style={{ marginTop: 8 }}>How we measure money that flows in circles.</h2>
              <p className="desc">
                Every circular structure has a length and a set of participants. The metrics decompose the
                network into pairwise loops, multi-party cycles, and a per-firm centrality measure derived
                from both.
              </p>
            </div>
          </div>

          <div className="three-metrics-grid">
            <article className="metric-card">
              <div className="mark">METRIC i.</div>
              <h3>Loop Score</h3>
              <div className="formula">L(a,b) = Σ wᵢ·wⱼ&nbsp;<span style={{ color: 'var(--ink-mute)' }}>∀&nbsp;i:a→b, j:b→a</span></div>
              <p>
                Pairwise circularity between two companies. Captures the canonical
                <em> &ldquo;A invests in B, B buys from A&rdquo;</em> relationship, summed over deal weight in
                both directions.
              </p>
              <svg className="glyph" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="lm1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ecebe6" /></marker>
                  <marker id="lm2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8e8d85" /></marker>
                </defs>
                <circle cx="50" cy="50" r="11" fill="none" stroke="#ecebe6" strokeWidth="1.2" />
                <circle cx="150" cy="50" r="11" fill="none" stroke="#ecebe6" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="3" fill="#ecebe6" />
                <circle cx="150" cy="50" r="3" fill="#ecebe6" />
                <path d="M 60 42 Q 100 12 140 42" fill="none" stroke="#ecebe6" strokeWidth="1.2" markerEnd="url(#lm1)" />
                <path d="M 140 58 Q 100 88 60 58" fill="none" stroke="#8e8d85" strokeWidth="1.2" markerEnd="url(#lm2)" />
                <text x="50" y="95" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#8e8d85">A</text>
                <text x="150" y="95" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#8e8d85">B</text>
              </svg>
            </article>

            <article className="metric-card">
              <div className="mark">METRIC ii.</div>
              <h3>Cycle Score</h3>
              <div className="formula">C(k) = Σ ∏ wₑ&nbsp;<span style={{ color: 'var(--ink-mute)' }}>over directed cycles of length k ≥ 3</span></div>
              <p>
                Multi-party cycles. Tracks loops where capital moves through three or more
                firms before returning. Length-weighted product of edge magnitudes preserves
                the strength of long indirect paths.
              </p>
              <svg className="glyph" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="cm1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ecebe6" /></marker>
                </defs>
                <circle cx="100" cy="22" r="10" fill="none" stroke="#ecebe6" strokeWidth="1.2" />
                <circle cx="40" cy="78" r="10" fill="none" stroke="#ecebe6" strokeWidth="1.2" />
                <circle cx="160" cy="78" r="10" fill="none" stroke="#ecebe6" strokeWidth="1.2" />
                <circle cx="100" cy="22" r="3" fill="#ecebe6" />
                <circle cx="40" cy="78" r="3" fill="#ecebe6" />
                <circle cx="160" cy="78" r="3" fill="#ecebe6" />
                <path d="M 92 30 L 48 70" fill="none" stroke="#ecebe6" strokeWidth="1.2" markerEnd="url(#cm1)" />
                <path d="M 50 80 L 150 80" fill="none" stroke="#ecebe6" strokeWidth="1.2" markerEnd="url(#cm1)" />
                <path d="M 152 70 L 108 30" fill="none" stroke="#ecebe6" strokeWidth="1.2" markerEnd="url(#cm1)" />
              </svg>
            </article>

            <article className="metric-card" style={{ borderRight: 0 }}>
              <div className="mark">METRIC iii.</div>
              <h3>Hub Score</h3>
              <div className="formula">H(v) = Σ&nbsp;1{'{v ∈ s}'}&nbsp;·&nbsp;score(s)&nbsp;<span style={{ color: 'var(--ink-mute)' }}>∀ structures s</span></div>
              <p>
                Per-firm centrality. Aggregates a company&apos;s participation across every loop and
                cycle it belongs to. Identifies infrastructure providers that sit at the center of
                many independent circular flows.
              </p>
              <svg className="glyph" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="50" r="14" fill="#d4a85a" />
                <circle cx="30" cy="22" r="5" fill="none" stroke="#8e8d85" strokeWidth="1" />
                <circle cx="30" cy="78" r="5" fill="none" stroke="#8e8d85" strokeWidth="1" />
                <circle cx="170" cy="22" r="5" fill="none" stroke="#8e8d85" strokeWidth="1" />
                <circle cx="170" cy="78" r="5" fill="none" stroke="#8e8d85" strokeWidth="1" />
                <circle cx="100" cy="10" r="4" fill="none" stroke="#8e8d85" strokeWidth="1" />
                <circle cx="100" cy="92" r="4" fill="none" stroke="#8e8d85" strokeWidth="1" />
                <g stroke="#8e8d85" strokeWidth="0.8" fill="none">
                  <line x1="36" y1="24" x2="92" y2="46" />
                  <line x1="36" y1="76" x2="92" y2="54" />
                  <line x1="164" y1="24" x2="108" y2="46" />
                  <line x1="164" y1="76" x2="108" y2="54" />
                  <line x1="100" y1="14" x2="100" y2="38" />
                  <line x1="100" y1="86" x2="100" y2="62" />
                </g>
              </svg>
            </article>
          </div>

          <p className="ed-marginalia" style={{ marginTop: 28, maxWidth: '60ch' }}>
            Formal definitions, edge-weighting scheme, and treatment of bidirectional deals
            appear in <Link href="/methodology">§ 2 of the methodology</Link>.
          </p>
        </div>
      </section>

      {/* FINDINGS */}
      <section className="findings">
        <div className="ed-container-wide">
          <div className="findings-grid">
            <div>
              <div className="ed-eyebrow">§ 04 / FINDINGS</div>
              <h2 style={{ fontSize: 42, marginTop: 12, marginBottom: 20, letterSpacing: '-0.022em' }}>Summary of results.</h2>
              <p className="ed-muted" style={{ fontSize: 15, maxWidth: '32ch', fontFamily: 'var(--serif)' }}>
                Selected results from the 28-company, 90-deal sample. Full tables and sensitivity
                analyses appear in the paper.
              </p>
            </div>
            <div>
              <div className="finding">
                <div className="num">i.</div>
                <div>
                  <h4>Two-party loops are concentrated among hyperscalers and model labs.</h4>
                  <p>All seven identified two-party loops involve at least one cloud provider on one side and an AI model lab or chip manufacturer on the other.</p>
                </div>
                <div className="right">7<small>two-party loops</small></div>
              </div>
              <div className="finding">
                <div className="num">ii.</div>
                <div>
                  <h4>Multi-party cycles dominate the network.</h4>
                  <p>80% of identified circular structures are 3+ company cycles, suggesting risk is harder to detect by examining bilateral relationships alone.</p>
                </div>
                <div className="right">28<small>multi-party cycles</small></div>
              </div>
              <div className="finding">
                <div className="num">iii.</div>
                <div>
                  <h4>Hub Score is heavily skewed.</h4>
                  <p>The top three firms by Hub Score participate in over half of all circular structures in the sample, indicating systemically central infrastructure providers.</p>
                </div>
                <div className="right">3<small>firms · 50%+ share</small></div>
              </div>
              <div className="finding">
                <div className="num">iv.</div>
                <div>
                  <h4>Cycle length grows with valuation.</h4>
                  <p>Average cycle length increases monotonically with combined participant valuation — longer cycles surround the most-valued firms.</p>
                </div>
                <div className="right">4.2<small>avg. cycle length</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="featured">
        <div className="ed-container-wide">
          <div className="featured-grid">
            <div className="featured-text">
              <div className="ed-eyebrow">FEATURED CASE / C-01</div>
              <h2 style={{ marginTop: 12 }}>The OpenAI · Microsoft · NVIDIA triangle.</h2>
              <p className="ed-lede lede" style={{ marginBottom: 28, maxWidth: '26ch' }}>
                A worked example of a length-3 cycle. Microsoft&apos;s equity in OpenAI returns as Azure
                commitments; OpenAI&apos;s GPU spend returns to Microsoft via NVIDIA&apos;s data-center sales.
              </p>
              <div className="meta">
                <div><span className="label">Investment</span><strong>$13B+</strong></div>
                <div><span className="label">Companies</span><strong>3</strong></div>
                <div><span className="label">Key deals</span><strong>5</strong></div>
                <div><span className="label">Cycle score</span><strong>3.4</strong></div>
              </div>
              <Link href="/case-study" className="ed-btn">Read case study →</Link>
            </div>
            <figure className="triangle-fig">
              <div className="ed-figure-num" style={{ marginBottom: 18 }}>FIG. 02 / CYCLE C-01</div>
              <svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
                <defs>
                  <marker id="tar-money" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7ed957" /></marker>
                  <marker id="tar-compute" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ff4f8a" /></marker>
                  <marker id="tar-service" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#4f8eff" /></marker>
                </defs>
                <g fill="none" strokeWidth="1.5">
                  <path d="M 240 90 L 130 250" stroke="#ff4f8a" markerEnd="url(#tar-compute)" />
                  <path d="M 130 260 L 350 260" stroke="#4f8eff" markerEnd="url(#tar-service)" />
                  <path d="M 350 250 L 240 90" stroke="#7ed957" markerEnd="url(#tar-money)" />
                </g>
                <g fontFamily="JetBrains Mono" fontSize="10" fill="#8e8d85" letterSpacing="0.5">
                  <text x="170" y="170" transform="rotate(-55 170 170)">e1 · GPU spend</text>
                  <text x="240" y="280" textAnchor="middle">e2 · DC silicon</text>
                  <text x="320" y="170" transform="rotate(55 320 170)">e3 · $13B equity</text>
                </g>
                <g>
                  <circle cx="240" cy="70" r="24" fill="#0c1118" stroke="#ecebe6" strokeWidth="1.4" />
                  <circle cx="240" cy="70" r="6" fill="#7ed957" />
                  <text x="240" y="32" textAnchor="middle" fontFamily="Inter Tight" fontSize="14" fontWeight="500" fill="#ecebe6">OpenAI</text>

                  <circle cx="120" cy="260" r="24" fill="#0c1118" stroke="#ecebe6" strokeWidth="1.4" />
                  <circle cx="120" cy="260" r="6" fill="#ff4f8a" />
                  <text x="120" y="316" textAnchor="middle" fontFamily="Inter Tight" fontSize="14" fontWeight="500" fill="#ecebe6">NVIDIA</text>

                  <circle cx="360" cy="260" r="24" fill="#0c1118" stroke="#ecebe6" strokeWidth="1.4" />
                  <circle cx="360" cy="260" r="6" fill="#4f8eff" />
                  <text x="360" y="316" textAnchor="middle" fontFamily="Inter Tight" fontSize="14" fontWeight="500" fill="#ecebe6">Microsoft</text>
                </g>
              </svg>
              <div className="ed-fig-caption">
                <strong>FIG. 02</strong> Schematic of cycle C-01. Edge color indicates flow type:
                green for capital, pink for compute hardware, blue for cloud service.
                Edge weights omitted; see Table 4 in the paper.
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-strip">
        <div className="ed-container-wide">
          <div className="inner">
            <h2>Explore the full graph.</h2>
            <div style={{ display: 'flex', gap: 14 }}>
              <Link href="/graph" className="ed-btn">Open the visualizer →</Link>
              <Link href="/research" className="ed-btn ghost">Download paper (PDF)</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .masthead { border-bottom: 1px solid var(--rule); padding: 32px 0 18px; }
        .masthead-inner {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 40px;
          font-family: var(--mono-ed);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }
        .masthead-left, .masthead-right { display: flex; gap: 24px; }
        .masthead-right { justify-content: flex-end; }
        .masthead-center {
          font-family: var(--serif);
          font-size: 13px;
          font-style: italic;
          text-transform: none;
          letter-spacing: 0;
          color: var(--ink-soft);
        }
        .masthead .live::before {
          content: "";
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--ed-accent);
          margin-right: 8px;
          vertical-align: middle;
        }

        .hero { padding: 64px 0 80px; border-bottom: 1px solid var(--rule); }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .kicker {
          font-family: var(--mono-ed);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-soft);
          padding-bottom: 14px;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--rule);
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }
        .kicker span:last-child { color: var(--ink-mute); }

        .hero h1 {
          font-family: var(--sans-ed);
          font-size: 78px;
          line-height: 0.96;
          font-weight: 400;
          letter-spacing: -0.028em;
          margin-bottom: 36px;
          color: var(--ink);
        }
        .hero h1 .accent-word { color: var(--ed-accent); font-weight: 400; }
        .hero h1 .small {
          display: block;
          font-size: 0.42em;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin-bottom: 18px;
          font-family: var(--mono-ed);
          line-height: 1;
        }

        .hero-lede {
          font-family: var(--serif);
          font-size: 22px;
          line-height: 1.45;
          color: var(--ink-2);
          margin-bottom: 36px;
          font-weight: 400;
          max-width: 44ch;
          letter-spacing: -0.005em;
        }

        .byline {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 16px 20px;
          padding: 20px 0;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          margin-bottom: 28px;
          align-items: baseline;
        }
        .byline dt {
          font-family: var(--mono-ed);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }
        .byline dd { margin: 0; font-family: var(--sans-ed); font-size: 14px; color: var(--ink); }

        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

        .hero-figure { border: 1px solid var(--rule); background: var(--bg-2); padding: 0; position: relative; }
        .hero-figure-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid var(--rule);
          font-family: var(--mono-ed);
          font-size: 10.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }
        .hero-figure-head .title { color: var(--ink); }
        .graph-svg { width: 100%; height: 480px; display: block; }
        .hero-figure-foot {
          padding: 16px 24px;
          border-top: 1px solid var(--rule);
          display: flex;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          font-family: var(--mono-ed);
          font-size: 10.5px;
          letter-spacing: 0.06em;
          color: var(--ink-soft);
          text-transform: uppercase;
        }
        .legend-row { display: flex; gap: 18px; flex-wrap: wrap; }
        .legend-row .item { display: flex; align-items: center; gap: 7px; }
        .legend-row .swatch { width: 16px; height: 2px; }

        .runstrip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          padding: 32px 0;
          margin-top: 64px;
        }
        .runstrip .stat { padding: 0 32px; border-right: 1px solid var(--rule); }
        .runstrip .stat:last-child { border-right: 0; }

        .abstract-section { padding: 96px 0; }
        .abstract-section .ed-container { max-width: 1100px; }
        .abstract-grid { display: grid; grid-template-columns: 240px 1fr; gap: 80px; }
        .abstract-side dl { margin: 0; border-top: 1px solid var(--rule); }
        .abstract-side dt {
          font-family: var(--mono-ed);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          padding-top: 16px;
          margin-bottom: 4px;
        }
        .abstract-side dd {
          margin: 0 0 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--rule);
          font-size: 14px;
          color: var(--ink);
          font-family: var(--sans-ed);
        }
        .abstract-side dd:last-child { border-bottom: 0; }
        .abstract-body p {
          font-family: var(--serif);
          font-size: 19px;
          line-height: 1.65;
          margin-bottom: 1.1em;
          color: var(--ink-2);
        }
        .abstract-body p:first-child { font-size: 21px; line-height: 1.55; color: var(--ink); }
        .abstract-body strong { color: var(--ink); font-weight: 500; }
        .abstract-side .label {
          font-family: var(--mono-ed);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink);
          margin-bottom: 4px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--ink);
          display: block;
        }

        .three-metrics {
          padding: 96px 0;
          background: var(--bg-2);
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }
        .three-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border-top: 1px solid var(--rule);
        }
        .metric-card {
          padding: 36px 32px;
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          position: relative;
        }
        .metric-card .mark {
          font-family: var(--mono-ed);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
          margin-bottom: 24px;
        }
        .metric-card h3 {
          font-size: 30px;
          margin-bottom: 12px;
          font-family: var(--sans-ed);
          font-weight: 500;
          letter-spacing: -0.015em;
        }
        .metric-card .formula {
          font-family: var(--mono-ed);
          font-size: 12.5px;
          color: var(--ink-2);
          background: #0c1118;
          padding: 12px 14px;
          margin: 18px 0 20px;
          border-left: 2px solid var(--ed-accent);
        }
        .metric-card p {
          font-family: var(--serif);
          font-size: 16px;
          color: var(--ink-2);
          line-height: 1.55;
        }
        .metric-card .glyph { width: 100%; height: 110px; margin-top: 24px; }

        .findings { padding: 96px 0; }
        .findings-grid { display: grid; grid-template-columns: 280px 1fr; gap: 60px; }
        .finding {
          display: grid;
          grid-template-columns: 50px 1fr 200px;
          gap: 24px;
          padding: 28px 0;
          border-top: 1px solid var(--rule);
          align-items: baseline;
        }
        .finding:last-child { border-bottom: 1px solid var(--rule); }
        .finding .num {
          font-family: var(--mono-ed);
          font-size: 11px;
          color: var(--ink-mute);
          letter-spacing: 0.1em;
        }
        .finding h4 {
          font-family: var(--sans-ed);
          font-size: 19px;
          line-height: 1.3;
          margin-bottom: 8px;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .finding p {
          font-family: var(--serif);
          font-size: 15.5px;
          color: var(--ink-2);
          margin: 0;
          max-width: 60ch;
          line-height: 1.5;
        }
        .finding .right {
          font-family: var(--sans-ed);
          font-size: 40px;
          text-align: right;
          color: var(--ink);
          font-feature-settings: "lnum", "tnum";
          line-height: 1;
          letter-spacing: -0.025em;
          font-weight: 400;
        }
        .finding .right small {
          display: block;
          font-family: var(--mono-ed);
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-mute);
          margin-top: 8px;
          font-weight: 400;
        }

        .featured {
          padding: 96px 0;
          background: var(--bg-2);
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }
        .featured-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .featured-text h2 { margin-bottom: 20px; font-size: 44px; }
        .featured-text .meta {
          font-family: var(--sans-ed);
          font-size: 13px;
          color: var(--ink-soft);
          display: flex;
          gap: 32px;
          margin: 28px 0;
          padding: 20px 0;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }
        .featured-text .meta div { display: flex; flex-direction: column; gap: 4px; }
        .featured-text .meta strong {
          color: var(--ink);
          font-weight: 400;
          font-size: 26px;
          font-family: var(--sans-ed);
          letter-spacing: -0.02em;
        }
        .featured-text .meta .label {
          font-family: var(--mono-ed);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }
        .triangle-fig { background: #0c1118; border: 1px solid var(--rule); padding: 32px; }

        .cta-strip { padding: 72px 0; border-top: 1px solid var(--rule); }
        .cta-strip .inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .cta-strip h2 {
          font-family: var(--sans-ed);
          font-size: 44px;
          font-weight: 500;
          max-width: 16ch;
          letter-spacing: -0.022em;
          line-height: 1.05;
        }

        @media (max-width: 980px) {
          .hero-grid, .featured-grid, .abstract-grid, .findings-grid { grid-template-columns: 1fr; gap: 40px; }
          .three-metrics-grid { grid-template-columns: 1fr; }
          .metric-card { border-right: 0; }
          .runstrip { grid-template-columns: repeat(2, 1fr); }
          .runstrip .stat { padding: 16px; border-bottom: 1px solid var(--rule); }
          .finding { grid-template-columns: 40px 1fr; }
          .finding .right { grid-column: 2; text-align: left; }
          .hero h1 { font-size: 44px; }
          .cta-strip .inner { flex-direction: column; align-items: flex-start; }
          .masthead-inner { grid-template-columns: 1fr; gap: 8px; }
          .featured-text .meta { flex-wrap: wrap; gap: 20px; }
        }
      `}</style>
    </main>
  );
}
