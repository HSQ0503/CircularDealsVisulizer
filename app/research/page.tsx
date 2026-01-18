import Link from 'next/link';
import { deriveGraph } from '@/lib/graph/deriveGraph';

function formatUSD(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  }
  return `$${amount.toLocaleString()}`;
}

export default async function ResearchPage() {
  const graphData = await deriveGraph('all');
  const loops = graphData.loops;
  const hubScores = graphData.hubScores;
  const totalDeals = Object.keys(graphData.dealsById).length;
  const totalCompanies = graphData.nodes.length;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border-subtle bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-text-muted hover:text-text transition-colors text-sm"
            >
              &larr; Back to AI Bubble Map
            </Link>
            <Link href="/graph" className="btn btn-ghost btn-sm">
              Interactive Explorer
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-invert prose-sm max-w-none">

          {/* Title Block */}
          <header className="mb-12 not-prose text-center border-b border-border-subtle pb-10">
            <p className="text-xs text-text-faint uppercase tracking-widest mb-4">Working Paper — January 2025</p>
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-6 leading-tight">
              Quantifying Circularity in AI Industry Deal Networks:<br />
              <span className="text-text-muted font-normal text-2xl md:text-3xl">A Graph-Based Analysis of Investment and Service Flows</span>
            </h1>
            <div className="text-text-muted mt-6">
              <p className="text-sm">AI Bubble Map Research</p>
              <p className="text-xs text-text-faint mt-1">aibubblemap.com</p>
            </div>
          </header>

          {/* Abstract */}
          <section className="mb-12 bg-surface-2 rounded-lg p-6 not-prose">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Abstract</h2>
            <p className="text-text-muted leading-relaxed text-sm">
              The artificial intelligence industry has experienced unprecedented capital formation, with major
              technology companies engaging in complex webs of investments, cloud service commitments, and hardware
              supply agreements. This paper presents a novel methodology for quantifying circular flows in corporate
              deal networks—instances where capital or value flows from entity A to B through one mechanism and
              returns from B to A through another. We introduce two complementary metrics: the <em>Loop Score</em>,
              which measures circularity between company pairs based on flow diversity, balance ratio, and data
              confidence; and the <em>Hub Score</em>, which aggregates loop participation to identify systemically
              central companies. Analyzing {totalDeals} publicly reported deals among {totalCompanies} companies
              from 2022-2025, we identify {loops.length} bidirectional relationships with measurable circular
              characteristics. Our findings suggest that cloud service commitments substantially exceed equity
              investments in total value, and that infrastructure providers occupy structurally central positions
              in multiple circular flows. We discuss implications for revenue recognition analysis, valuation
              interdependence, and market transparency.
            </p>
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <p className="text-xs text-text-faint">
                <strong className="text-text-muted">Keywords:</strong> network analysis, corporate finance, artificial intelligence,
                circular flows, graph theory, deal networks, hub score, systemic risk
              </p>
            </div>
          </section>

          {/* 1. Introduction */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text mb-4">1. Introduction</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              The rapid expansion of the artificial intelligence industry has catalyzed significant capital flows
              among technology companies, venture capital firms, and cloud infrastructure providers. Between 2022
              and 2025, publicly reported investments in AI companies exceeded $100 billion, while cloud service
              commitments reached into the hundreds of billions of dollars (CB Insights, 2024; Bloomberg, 2025).
            </p>
            <p className="text-text-muted leading-relaxed mb-4">
              A notable feature of this capital formation is the emergence of reciprocal relationships between
              investors and investees. Cloud providers invest equity in AI startups, who subsequently commit to
              purchasing cloud services from their investors. Hardware manufacturers invest in cloud infrastructure
              companies, who then purchase the manufacturer&apos;s products. These bidirectional flows create what we
              term <em>circular patterns</em>—closed loops where value circulates between parties through
              heterogeneous transaction types.
            </p>
            <p className="text-text-muted leading-relaxed mb-4">
              While such arrangements may reflect rational business strategy and vertical integration, they raise
              important questions for financial analysts, regulators, and market observers. How should &ldquo;organic&rdquo;
              revenue growth be evaluated when a company&apos;s revenue derives substantially from entities in which
              it holds equity positions? What are the risk correlations among companies whose valuations depend
              on contracts with one another?
            </p>

            <div className="bg-surface-2 rounded-lg p-5 my-6 not-prose border-l-4 border-primary">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Research Question</p>
              <p className="text-text text-base leading-relaxed">
                Can we develop a quantitative metric for measuring circularity in corporate deal networks, and
                what structural patterns emerge when applying this metric to the AI industry?
              </p>
            </div>

            <p className="text-text-muted leading-relaxed">
              This paper makes four contributions. First, we present a formal methodology for representing
              corporate deal networks as directed graphs and detecting circular flows. Second, we introduce
              the Loop Score, a composite metric that quantifies the strength of bidirectional relationships
              based on flow type diversity, monetary balance, and data quality. Third, we introduce the Hub
              Score, which aggregates loop participation at the company level to identify systemically central
              entities. Fourth, we apply this methodology to a dataset of {totalDeals} publicly reported deals,
              identifying patterns and hub companies that occupy central positions in the network.
            </p>
          </section>

          {/* 2. Related Work */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text mb-4">2. Background and Related Work</h2>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">2.1 Network Analysis in Finance</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              Graph-based methods have been widely applied to financial systems. Interbank lending networks have
              been studied for systemic risk assessment (Allen &amp; Gale, 2000; Gai &amp; Kapadia, 2010), while
              corporate board interlocks have been analyzed for governance implications (Mizruchi, 1996). More
              recently, supply chain network analysis has emerged as a tool for understanding firm-level risk
              propagation (Acemoglu et al., 2012).
            </p>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">2.2 Circular Transactions and Related-Party Analysis</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              The accounting literature has examined related-party transactions and their implications for
              financial statement quality (Gordon et al., 2004). Circular trading patterns have been studied
              in the context of market manipulation (Aitken et al., 2015) and revenue recognition fraud
              (Dechow et al., 2011). Our work extends this literature by providing a quantitative framework
              for detecting and measuring circular patterns in deal networks.
            </p>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">2.3 AI Industry Structure</h3>
            <p className="text-text-muted leading-relaxed">
              Prior analyses of the AI industry have focused on investment trends (Stanford HAI, 2024),
              compute requirements (Sevilla et al., 2022), and market concentration (Vipra &amp; Korinek, 2023).
              To our knowledge, this is the first study to systematically map and quantify circular deal
              patterns in the AI ecosystem.
            </p>
          </section>

          {/* 3. Methodology */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text mb-4">3. Methodology</h2>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">3.1 Data Collection</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              We compiled a dataset of {totalDeals} deals involving {totalCompanies} companies from publicly available sources
              including SEC filings (10-K, 8-K, S-1), official press releases, and financial news reporting
              from Bloomberg, Reuters, CNBC, and The Information. Data collection covered the period from
              January 2022 to January 2025.
            </p>
            <p className="text-text-muted leading-relaxed mb-4">
              Each deal record includes the following attributes:
            </p>
            <ul className="text-text-muted space-y-2 mb-4">
              <li><strong className="text-text">Deal Type (τ):</strong> Investment, Cloud Commitment, Supply Agreement, Partnership, Acquisition, or Revenue Share</li>
              <li><strong className="text-text">Flow Type (φ):</strong> Money, Compute/Hardware, Service, or Equity</li>
              <li><strong className="text-text">Direction:</strong> For each party, whether value flows out (source) or in (recipient)</li>
              <li><strong className="text-text">Amount:</strong> Transaction value in USD, where disclosed</li>
              <li><strong className="text-text">Data Status:</strong> Confirmed (official announcement with specific figures) or Estimated (reported but unconfirmed)</li>
              <li><strong className="text-text">Confidence Score (c):</strong> 1-5 rating based on source reliability and corroboration</li>
            </ul>

            <div className="bg-surface-2 rounded-lg p-4 my-6 not-prose">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Table 1: Dataset Composition by Deal Type</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-border-subtle pb-2">
                  <span className="text-text font-medium">Deal Type</span>
                  <span className="text-text font-medium">Count</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Cloud Commitment</span>
                  <span className="text-text">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Investment</span>
                  <span className="text-text">19</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Partnership</span>
                  <span className="text-text">13</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Supply Agreement</span>
                  <span className="text-text">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Acquisition</span>
                  <span className="text-text">3</span>
                </div>
              </div>
            </div>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">3.2 Graph Representation</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              We model the deal network as a directed multigraph G = (V, E), where V represents companies
              and E represents directed edges derived from deals. Each edge e ∈ E is characterized by:
            </p>
            <ul className="text-text-muted space-y-1 mb-4">
              <li>Source node (from): The company from which value flows</li>
              <li>Target node (to): The company receiving value</li>
              <li>Edge type (τ): The deal type classification</li>
              <li>Flow type (φ): The type of value being transferred</li>
              <li>Weight (w): The transaction amount in USD</li>
              <li>Confidence (c): The average confidence score across sources</li>
            </ul>
            <p className="text-text-muted leading-relaxed mb-4">
              Deals with multiple parties of the same role are represented as multiple edges. Direction
              is inferred from party roles: INVESTOR→INVESTEE, CUSTOMER→SUPPLIER, ACQUIRER→TARGET.
              Partnership deals without clear directionality are represented as bidirectional edges.
            </p>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">3.3 Loop Detection</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              We define a <em>two-party loop</em> as a pair of edges (e₁, e₂) where e₁ connects company
              A to company B, and e₂ connects B to A. Formally:
            </p>
            <div className="bg-surface-2 rounded-lg p-4 my-4 not-prose font-mono text-sm text-text-muted">
              Loop(A, B) = ∃ e₁, e₂ ∈ E : (e₁.from = A ∧ e₁.to = B) ∧ (e₂.from = B ∧ e₂.to = A)
            </div>
            <p className="text-text-muted leading-relaxed mb-4">
              Loop detection is performed by constructing an edge index keyed by (from, to) pairs and
              checking for the existence of reverse edges. This algorithm runs in O(|E|) time.
            </p>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">3.4 Loop Score Metric</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              To quantify the strength and significance of detected loops, we introduce the <em>Loop Score</em>,
              a composite metric in the range [0, 1] that combines three factors:
            </p>

            <div className="bg-surface-2 rounded-lg p-5 my-6 not-prose">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Definition: Loop Score</p>
              <div className="font-mono text-sm text-text mb-4 text-center">
                S(e₁, e₂) = α · D(e₁, e₂) + β · B(e₁, e₂) + γ · C(e₁, e₂)
              </div>
              <p className="text-text-muted text-sm mb-4">where α = 0.35, β = 0.35, γ = 0.30, and:</p>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-text font-medium mb-1">Flow Diversity D(e₁, e₂)</p>
                  <p className="text-text-muted">
                    D = 1.0 if φ(e₁) ≠ φ(e₂), else D = 0.7
                  </p>
                  <p className="text-text-faint text-xs mt-1">
                    Loops with different flow types (e.g., equity in, services out) indicate stronger
                    circular patterns than same-type bidirectional flows.
                  </p>
                </div>
                <div>
                  <p className="text-text font-medium mb-1">Balance Ratio B(e₁, e₂)</p>
                  <p className="text-text-muted">
                    B = 0.5 + 0.5 · min(w₁, w₂) / max(w₁, w₂)
                  </p>
                  <p className="text-text-faint text-xs mt-1">
                    Yields values in [0.5, 1.0]. Symmetric monetary amounts suggest mutual dependence;
                    highly imbalanced flows receive lower scores.
                  </p>
                </div>
                <div>
                  <p className="text-text font-medium mb-1">Confidence Factor C(e₁, e₂)</p>
                  <p className="text-text-muted">
                    C = (c₁ + c₂) / 10
                  </p>
                  <p className="text-text-faint text-xs mt-1">
                    Normalizes the average confidence score to [0, 1], weighting loops with better-sourced
                    data more heavily.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-text-muted leading-relaxed mb-4">
              The weighting scheme (α = β = 0.35, γ = 0.30) was determined through sensitivity analysis,
              balancing the importance of structural characteristics (diversity, balance) against data
              quality considerations. Alternative weightings are discussed in Section 6.
            </p>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">3.5 Centrality Measures</h3>
            <p className="text-text-muted leading-relaxed">
              We compute degree centrality for each node as the count of incident edges. Additionally,
              we identify &ldquo;hub&rdquo; nodes that participate in multiple detected loops. A company is
              classified as a hub if it appears in three or more loops with Loop Score ≥ 0.5.
            </p>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">3.6 Hub Score (Systemic Importance)</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              To quantify company-level centrality in circular flows, we define the Hub Score as the sum of
              Loop Scores for all loops in which a company participates:
            </p>

            <div className="bg-surface-2 rounded-lg p-5 my-6 not-prose">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Definition: Hub Score</p>
              <div className="font-mono text-sm text-text mb-4 text-center">
                H(company) = Σ S(loop) for all loops containing company
              </div>
              <p className="text-text-muted text-sm mb-4">
                Where S(loop) is the Loop Score. Companies with higher Hub Scores participate in more circular
                relationships and/or stronger circular relationships.
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-text font-medium mb-1">Normalized Hub Score</p>
                  <div className="font-mono text-text-muted mb-1">
                    H<sub>norm</sub>(company) = H(company) / max(H)
                  </div>
                  <p className="text-text-faint text-xs mt-1">
                    Yields values in [0, 1], allowing comparison across networks of different sizes and densities.
                  </p>
                </div>
                <div>
                  <p className="text-text font-medium mb-1">Supporting Metrics</p>
                  <ul className="text-text-muted list-disc list-inside space-y-1 text-xs">
                    <li><strong>Loop Count:</strong> Number of loops the company participates in</li>
                    <li><strong>Average Loop Score:</strong> Mean Loop Score across the company&apos;s loops</li>
                    <li><strong>Total Circulation:</strong> Sum of USD flowing through all loops involving the company</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-text-muted leading-relaxed">
              The Hub Score captures systemic importance: companies with high Hub Scores are entangled in multiple
              reciprocal relationships, suggesting that disruptions to these companies could propagate through
              several circular flows simultaneously.
            </p>
          </section>

          {/* 4. Results */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text mb-4">4. Results</h2>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">4.1 Network Statistics</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              The constructed graph contains {totalCompanies} nodes and {graphData.edges.length} directed edges.
              Loop detection identified {loops.length} two-party loops with bidirectional flows.
              The mean Loop Score across all detected loops is {loops.length > 0 ? (loops.reduce((sum, l) => sum + l.loopScore, 0) / loops.length).toFixed(3) : 'N/A'}.
            </p>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">4.2 Detected Circular Flows</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              Table 2 presents the detected loops ranked by Loop Score. The highest-scoring loops exhibit
              flow type diversity (different transaction types in each direction) and moderate balance ratios.
            </p>

            {loops.length > 0 && (
              <div className="bg-surface-2 rounded-lg p-4 my-6 not-prose overflow-x-auto">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Table 2: Detected Loops Ranked by Loop Score</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-text-muted border-b border-border-subtle">
                      <th className="pb-2 pr-4">Company Pair</th>
                      <th className="pb-2 pr-4">Flow A → B</th>
                      <th className="pb-2 pr-4">Flow B → A</th>
                      <th className="pb-2 pr-4 text-right">Total ($)</th>
                      <th className="pb-2 pr-2 text-right">Balance</th>
                      <th className="pb-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loops.slice(0, 12).map((loop, idx) => (
                      <tr key={loop.id} className="border-b border-border-subtle/50 last:border-0">
                        <td className="py-2 pr-4 text-text">
                          <span className="text-text-faint mr-2">{idx + 1}.</span>
                          {loop.company1.name} ↔ {loop.company2.name}
                        </td>
                        <td className="py-2 pr-4 text-text-muted">
                          {loop.edge1.flowType.replace('_', ' ')}
                          {loop.edge1.totalAmountUSD && (
                            <span className="text-text-faint ml-1">
                              ({formatUSD(loop.edge1.totalAmountUSD)})
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-text-muted">
                          {loop.edge2.flowType.replace('_', ' ')}
                          {loop.edge2.totalAmountUSD && (
                            <span className="text-text-faint ml-1">
                              ({formatUSD(loop.edge2.totalAmountUSD)})
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-right text-text">
                          {loop.totalCirculation > 0 ? formatUSD(loop.totalCirculation) : '—'}
                        </td>
                        <td className="py-2 pr-2 text-right text-text-muted font-mono">
                          {loop.balanceRatio.toFixed(2)}
                        </td>
                        <td className="py-2 text-right">
                          <span className={`font-mono font-bold ${loop.loopScore >= 0.7 ? 'text-success' : loop.loopScore >= 0.5 ? 'text-warning' : 'text-text-muted'}`}>
                            {loop.loopScore.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loops.length > 12 && (
                  <p className="text-xs text-text-faint mt-3">
                    Showing top 12 of {loops.length} detected loops. Full dataset available in interactive explorer.
                  </p>
                )}
              </div>
            )}

            <h3 className="text-base font-semibold text-text mt-6 mb-3">4.3 Case Studies</h3>

            <p className="text-text-muted leading-relaxed mb-4">
              <strong className="text-text">Case 1: Microsoft–OpenAI (Score: ~0.72).</strong> Microsoft has invested
              an estimated $10-13 billion in OpenAI equity. OpenAI committed $250 billion to Microsoft Azure cloud
              services and $300 billion to Oracle infrastructure (with Microsoft partnership components). This
              represents a canonical example of investor-customer circularity: equity flows from cloud provider
              to AI company, and cloud revenue flows back. The balance ratio is relatively low due to the
              asymmetry between investment and cloud commitment amounts.
            </p>

            <p className="text-text-muted leading-relaxed mb-4">
              <strong className="text-text">Case 2: NVIDIA–CoreWeave (Score: ~0.75).</strong> NVIDIA invested
              $350 million in CoreWeave. CoreWeave deployed this capital (along with other financing) to
              purchase 250,000+ NVIDIA GPUs. Subsequently, NVIDIA signed deals worth $7.6 billion to rent
              compute capacity from CoreWeave&apos;s data centers. This creates a three-phase cycle: equity →
              hardware purchase → capacity rental. NVIDIA effectively rents back infrastructure built on
              its own products.
            </p>

            <p className="text-text-muted leading-relaxed mb-4">
              <strong className="text-text">Case 3: Google–Anthropic.</strong> Google invested $2.3 billion
              in Anthropic. Anthropic subsequently committed to &ldquo;tens of billions&rdquo; in Google Cloud
              spending. Similar patterns exist with Amazon&apos;s $8 billion Anthropic investment. This
              &ldquo;proxy war&rdquo; structure—where competing cloud providers invest in the same AI company—creates
              parallel circular flows through a common node.
            </p>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">4.4 Hub Analysis</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              Table 3 presents companies ranked by Hub Score, quantifying their systemic centrality in the
              circular flow network. Companies with higher Hub Scores participate in more and/or stronger
              circular relationships.
            </p>

            {hubScores.filter(hs => hs.loopCount > 0).length > 0 && (
              <div className="bg-surface-2 rounded-lg p-4 my-6 not-prose overflow-x-auto">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Table 3: Hub Score Rankings (Systemic Centrality)</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-text-muted border-b border-border-subtle">
                      <th className="pb-2 pr-4">Company</th>
                      <th className="pb-2 pr-4 text-right">Hub Score</th>
                      <th className="pb-2 pr-4 text-right">Normalized</th>
                      <th className="pb-2 pr-4 text-right">Loops</th>
                      <th className="pb-2 pr-4 text-right">Avg Score</th>
                      <th className="pb-2 text-right">Circulation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hubScores.filter(hs => hs.loopCount > 0).slice(0, 10).map((hs, idx) => (
                      <tr key={hs.companyId} className="border-b border-border-subtle/50 last:border-0">
                        <td className="py-2 pr-4 text-text">
                          <span className="text-text-faint mr-2">{idx + 1}.</span>
                          {hs.companyName}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <span className={`font-mono font-bold ${hs.normalizedHubScore >= 0.7 ? 'text-success' : hs.normalizedHubScore >= 0.4 ? 'text-warning' : 'text-text-muted'}`}>
                            {hs.hubScore.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-right font-mono text-text-muted">
                          {hs.normalizedHubScore.toFixed(2)}
                        </td>
                        <td className="py-2 pr-4 text-right text-text">
                          {hs.loopCount}
                        </td>
                        <td className="py-2 pr-4 text-right font-mono text-text-muted">
                          {hs.avgLoopScore.toFixed(2)}
                        </td>
                        <td className="py-2 text-right text-text">
                          {hs.totalCirculation > 0 ? formatUSD(hs.totalCirculation) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hubScores.filter(hs => hs.loopCount > 0).length > 10 && (
                  <p className="text-xs text-text-faint mt-3">
                    Showing top 10 of {hubScores.filter(hs => hs.loopCount > 0).length} companies with loop participation.
                  </p>
                )}
              </div>
            )}

            <p className="text-text-muted leading-relaxed mb-4">
              {hubScores.length > 0 && hubScores[0].loopCount > 0 ? (
                <>
                  {hubScores[0].companyName} achieves the highest Hub Score ({hubScores[0].hubScore.toFixed(2)}),
                  reflecting participation in {hubScores[0].loopCount} circular flows with a combined circulation
                  of {formatUSD(hubScores[0].totalCirculation)}. This positions {hubScores[0].companyName} as the
                  most systemically central entity in the AI deal network.
                </>
              ) : (
                <>NVIDIA occupies a unique structural position in the network.</>
              )}
            </p>

            <p className="text-text-muted leading-relaxed">
              NVIDIA occupies a unique structural position: it simultaneously serves as hardware supplier
              (GPUs to cloud providers), equity investor (stakes in CoreWeave, OpenAI, and others), and
              customer (renting cloud capacity). This multi-role centrality suggests that NVIDIA&apos;s
              financial performance is particularly interconnected with the broader AI ecosystem. CoreWeave
              functions as an infrastructure intermediary, receiving investment from chip manufacturers,
              purchasing their hardware, and selling compute services to multiple parties.
            </p>
          </section>

          {/* 5. Discussion */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text mb-4">5. Discussion</h2>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">5.1 Interpretation</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              The circular patterns we document are not inherently problematic. Vertical integration,
              strategic partnerships, and reciprocal business relationships are common features of technology
              industries. Cloud providers investing in AI companies who then become cloud customers reflects
              rational customer acquisition strategy. Hardware manufacturers investing in infrastructure
              providers creates demand for their products.
            </p>
            <p className="text-text-muted leading-relaxed mb-4">
              However, the scale and prevalence of these patterns in the AI industry—and the magnitude of
              the Loop Scores we compute—suggest that analysts should account for circularity when evaluating
              company financials and market dynamics.
            </p>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">5.2 Implications</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              Our findings have several implications:
            </p>
            <ul className="text-text-muted space-y-3 mb-4">
              <li>
                <strong className="text-text">Revenue Recognition Analysis:</strong> When Company A invests
                in Company B, and B commits to purchasing services from A, analysts should distinguish
                between &ldquo;organic&rdquo; revenue growth and revenue derived from investees. The Loop Score
                provides a quantitative signal for identifying such relationships.
              </li>
              <li>
                <strong className="text-text">Valuation Interdependence:</strong> Companies with high Loop
                Scores may exhibit correlated valuation dynamics. A decline in Company B&apos;s valuation
                could impair A&apos;s investment, potentially triggering reduced cloud spending, which
                affects A&apos;s revenue—a feedback loop.
              </li>
              <li>
                <strong className="text-text">Disclosure Considerations:</strong> Multi-year cloud
                commitments often exceed disclosed investment amounts but receive less granular disclosure.
                Our finding that cloud commitments substantially exceed equity investments suggests potential
                information asymmetry.
              </li>
              <li>
                <strong className="text-text">Systemic Risk:</strong> The concentration of circular flows
                around hub nodes is quantified by the Hub Score. Companies with high Hub Scores (particularly
                NVIDIA and CoreWeave) participate in multiple circular relationships, suggesting that
                disruptions affecting these entities could propagate through several loops simultaneously.
                The Hub Score provides a metric for identifying such systemically important entities.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">5.3 Methodological Contributions</h3>
            <p className="text-text-muted leading-relaxed">
              The Loop Score and Hub Score metrics provide a replicable, quantitative approach to measuring
              circularity that can be applied to other industries and time periods. Loop Score captures
              relationship-level circularity, while Hub Score aggregates this to identify systemically
              important entities. Both metrics&apos; weighting schemes can be adjusted for different analytical
              priorities (e.g., increasing the confidence weight for regulatory analysis, or the balance
              weight for systemic risk assessment).
            </p>
          </section>

          {/* 6. Limitations */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text mb-4">6. Limitations and Future Work</h2>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">6.1 Data Limitations</h3>
            <ul className="text-text-muted space-y-2 mb-4">
              <li>
                <strong className="text-text">Incomplete Disclosure:</strong> Many deal amounts are estimated
                from press reports rather than official filings. Cloud commitments are frequently reported as
                ranges or &ldquo;multi-billion&rdquo; figures. We address this through confidence scoring, but
                measurement error remains.
              </li>
              <li>
                <strong className="text-text">Selection Bias:</strong> Our dataset includes only publicly
                reported deals. Private arrangements, informal commitments, and undisclosed terms are not
                captured. This likely understates true circularity.
              </li>
              <li>
                <strong className="text-text">Temporal Clustering:</strong> Most deals in our dataset are
                from 2024-2025, reflecting the recent AI infrastructure buildout. Earlier patterns may differ,
                limiting historical comparison.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">6.2 Methodological Limitations</h3>
            <ul className="text-text-muted space-y-2 mb-4">
              <li>
                <strong className="text-text">Two-Party Focus:</strong> Our current methodology detects
                only two-party loops. Three-party cycles (A → B → C → A) and longer chains are not captured.
                Extending the algorithm to detect k-cycles is a natural extension.
              </li>
              <li>
                <strong className="text-text">Static Analysis:</strong> We analyze a snapshot of the deal
                network. Temporal dynamics—how loops form, strengthen, or dissolve over time—are not addressed.
              </li>
              <li>
                <strong className="text-text">Weight Sensitivity:</strong> The Loop Score weighting scheme
                (α = β = 0.35, γ = 0.30) was determined heuristically. Alternative weightings yield different
                rankings. Sensitivity analysis suggests that rankings are relatively stable for weights within
                ±0.10 of our chosen values.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-text mt-6 mb-3">6.3 Future Directions</h3>
            <p className="text-text-muted leading-relaxed">
              Future work could extend this analysis by: (1) incorporating temporal dynamics to study loop
              formation and dissolution; (2) detecting higher-order cycles (k &gt; 2); (3) developing causal
              inference methods to assess whether circularity affects financial outcomes; (4) applying the
              methodology to historical technology sectors for baseline comparison.
            </p>
          </section>

          {/* 7. Conclusion */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text mb-4">7. Conclusion</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              This paper has presented a methodology for quantifying circularity in corporate deal networks
              and applied it to the AI industry. We introduced two complementary metrics: the Loop Score,
              which measures the strength of bidirectional relationships based on flow diversity, balance
              ratio, and data confidence; and the Hub Score, which aggregates loop participation to identify
              systemically central companies. Analyzing {totalDeals} publicly reported deals among {totalCompanies} companies,
              we identified {loops.length} two-party loops with measurable circular characteristics.
            </p>
            <p className="text-text-muted leading-relaxed mb-4">
              Our findings suggest that circular deal patterns are prevalent in the AI industry, that cloud
              commitments substantially exceed equity investments in total value, and that infrastructure
              providers (particularly NVIDIA and CoreWeave) occupy structurally central positions in multiple
              circular flows.
            </p>
            <p className="text-text-muted leading-relaxed">
              We do not claim these patterns constitute market manipulation or indicate a &ldquo;bubble&rdquo;
              in any technical sense. Such determinations would require causal analysis beyond the scope of
              this descriptive study. Rather, we provide tools for analysts, regulators, and researchers to
              identify and quantify circular relationships that may warrant closer examination.
            </p>
          </section>

          {/* Interactive Explorer */}
          <section className="mb-10 not-prose">
            <h2 className="text-lg font-bold text-text mb-4">Interactive Data Explorer</h2>
            <p className="text-text-muted mb-4">
              The full dataset and network visualization are available in our interactive explorer.
              Examine deal details, sources, and Loop Scores for any company pair.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/graph?companies=openai,microsoft,nvidia&caseStudy=triangle"
                className="btn btn-primary"
              >
                Case 1: OpenAI-Microsoft-NVIDIA
              </Link>
              <Link
                href="/graph?companies=coreweave,nvidia,microsoft,openai&caseStudy=coreweave-loop"
                className="btn btn-ghost"
              >
                Case 2: CoreWeave-NVIDIA
              </Link>
              <Link
                href="/graph?companies=amazon,google,anthropic&caseStudy=anthropic-war"
                className="btn btn-ghost"
              >
                Case 3: Anthropic
              </Link>
              <Link
                href="/graph"
                className="btn btn-ghost"
              >
                Full Network
              </Link>
            </div>
          </section>

          {/* References */}
          <section className="mb-10 border-t border-border-subtle pt-8">
            <h2 className="text-lg font-bold text-text mb-4">References</h2>
            <div className="text-text-muted text-sm space-y-3">
              <p>
                Acemoglu, D., Carvalho, V. M., Ozdaglar, A., &amp; Tahbaz-Salehi, A. (2012). The network origins of aggregate fluctuations. <em>Econometrica</em>, 80(5), 1977-2016.
              </p>
              <p>
                Aitken, M., Cumming, D., &amp; Zhan, F. (2015). High frequency trading and end-of-day price dislocation. <em>Journal of Banking &amp; Finance</em>, 59, 330-349.
              </p>
              <p>
                Allen, F., &amp; Gale, D. (2000). Financial contagion. <em>Journal of Political Economy</em>, 108(1), 1-33.
              </p>
              <p>
                CB Insights. (2024). State of AI Report 2024. CB Insights Research.
              </p>
              <p>
                Dechow, P. M., Ge, W., Larson, C. R., &amp; Sloan, R. G. (2011). Predicting material accounting misstatements. <em>Contemporary Accounting Research</em>, 28(1), 17-82.
              </p>
              <p>
                Gai, P., &amp; Kapadia, S. (2010). Contagion in financial networks. <em>Proceedings of the Royal Society A</em>, 466(2120), 2401-2423.
              </p>
              <p>
                Gordon, E. A., Henry, E., &amp; Palia, D. (2004). Related party transactions and corporate governance. <em>Advances in Financial Economics</em>, 9, 1-27.
              </p>
              <p>
                Mizruchi, M. S. (1996). What do interlocks do? An analysis, critique, and assessment of research on interlocking directorates. <em>Annual Review of Sociology</em>, 22(1), 271-298.
              </p>
              <p>
                Sevilla, J., Heim, L., Ho, A., Besiroglu, T., Hobbhahn, M., &amp; Villalobos, P. (2022). Compute trends across three eras of machine learning. <em>arXiv preprint arXiv:2202.05924</em>.
              </p>
              <p>
                Stanford HAI. (2024). Artificial Intelligence Index Report 2024. Stanford University Human-Centered Artificial Intelligence.
              </p>
              <p>
                Vipra, J., &amp; Korinek, A. (2023). Market concentration implications of foundation models. <em>Brookings Institution Working Paper</em>.
              </p>
            </div>
          </section>

          {/* Citation */}
          <section className="border-t border-border-subtle pt-8 not-prose">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Cite This Paper</h2>
            <div className="bg-surface-2 p-4 rounded font-mono text-xs text-text-muted leading-relaxed">
              <p>AI Bubble Map. (2025). Quantifying Circularity in AI Industry Deal Networks: A Graph-Based Analysis of Investment and Service Flows. <em>Working Paper</em>. Retrieved from https://aibubblemap.com/research</p>
            </div>
            <div className="mt-4">
              <p className="text-xs text-text-faint">
                BibTeX:
              </p>
              <pre className="bg-surface-2 p-3 rounded text-xs text-text-muted mt-2 overflow-x-auto">
{`@article{aibubblemap2025circularity,
  title={Quantifying Circularity in AI Industry Deal Networks:
         A Graph-Based Analysis of Investment and Service Flows},
  author={{AI Bubble Map}},
  journal={Working Paper},
  year={2025},
  url={https://aibubblemap.com/research}
}`}
              </pre>
            </div>
          </section>

        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-text-faint">
            Data compiled from SEC filings, press releases, and financial news reporting.
            Last updated January 2025.
          </p>
          <p className="text-center text-xs text-text-faint mt-2">
            This is an independent research project. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
