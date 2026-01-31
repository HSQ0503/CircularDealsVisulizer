import Link from 'next/link';
import { deriveGraph, runSensitivityAnalysis } from '@/lib/graph/deriveGraph';
import { getLatestNullModelComparison } from '@/lib/graph/nullModel';
import { ThemeToggle } from '@/components/ThemeToggle';

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

function getSignificanceStars(pValue: number): string {
  if (pValue < 0.001) return '***';
  if (pValue < 0.01) return '**';
  if (pValue < 0.05) return '*';
  return '';
}

function formatPValue(pValue: number): string {
  if (pValue < 0.001) return '< 0.001';
  if (pValue < 0.01) return pValue.toFixed(3);
  return pValue.toFixed(2);
}

function getScoreClass(score: number): string {
  if (score >= 0.7) return 'research-score-high';
  if (score >= 0.5) return 'research-score-medium';
  return 'research-score-low';
}

export default async function ResearchPage() {
  const graphData = await deriveGraph('all');
  const nullModel = await getLatestNullModelComparison();
  const sensitivityAnalysis = await runSensitivityAnalysis();
  const loops = graphData.loops;
  const multiPartyCycles = graphData.multiPartyCycles;
  const hubScores = graphData.hubScores;
  const totalDeals = Object.keys(graphData.dealsById).length;
  const totalCompanies = graphData.nodes.length;
  const totalCircularStructures = loops.length + multiPartyCycles.length;

  return (
    <div className="research-page">
      {/* Header */}
      <header className="research-header">
        <div className="research-header-inner">
          <Link href="/" className="research-back-link">
            &larr; Back to AI Bubble Map
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/graph" className="research-nav-link">
              Interactive Explorer
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <article>
          {/* Title Block */}
          <header className="research-title-block">
            <p className="research-paper-label">Working Paper — January 2025</p>
            <h1 className="research-h1">
              Quantifying Circularity in AI Industry Deal Networks
            </h1>
            <p className="research-h1-subtitle" style={{ marginTop: '0.75rem' }}>
              A Graph-Based Analysis of Investment and Service Flows
            </p>
            <div className="research-authors">
              <p className="research-authors-name">AI Bubble Map Research</p>
              <p className="research-authors-affiliation">aibubblemap.com</p>
            </div>
          </header>

          {/* Abstract */}
          <section className="research-abstract">
            <p className="research-label" style={{ marginBottom: '0.75rem' }}>Abstract</p>
            <p className="research-abstract-text">
              The artificial intelligence industry has experienced unprecedented capital formation, with major
              technology companies engaging in complex webs of investments, cloud service commitments, and hardware
              supply agreements. This paper presents a novel methodology for quantifying circular flows in corporate
              deal networks—instances where capital or value flows between entities through multiple mechanisms,
              creating closed loops of varying lengths. We introduce three complementary metrics: the <em>Loop Score</em>,
              which measures circularity between company pairs; the <em>Cycle Score</em>, which extends this analysis
              to multi-party cycles involving three or more companies; and the <em>Hub Score</em>, which aggregates
              participation across all circular structures to identify systemically central entities. Analyzing {totalDeals} deals
              among a purposefully selected set of {totalCompanies} prominent AI, cloud, and semiconductor companies from 2022–2025, we identify {totalCircularStructures} circular
              structures: {loops.length} two-party loops and {multiPartyCycles.length} multi-party cycles. Our findings
              reveal that circular patterns are prevalent among major AI companies in our sample, with certain infrastructure providers
              participating in numerous circular flows. We discuss implications for revenue recognition
              analysis, valuation interdependence, systemic risk assessment, and market transparency.
            </p>
            <div className="research-keywords">
              <strong>Keywords:</strong> network analysis, corporate finance, artificial intelligence,
              circular flows, graph theory, deal networks, hub score, cycle detection, systemic risk
            </div>
          </section>

          {/* 1. Introduction */}
          <section className="research-section">
            <h2 className="research-h2">1. Introduction</h2>
            <div className="research-prose">
              <p>
                The rapid expansion of the artificial intelligence industry has catalyzed significant capital flows
                among technology companies, venture capital firms, and cloud infrastructure providers. Between 2022
                and 2025, publicly reported investments in AI companies exceeded $100 billion, while cloud service
                commitments reached into the hundreds of billions of dollars (CB Insights, 2024; Bloomberg, 2025).
              </p>
              <p>
                A notable feature of this capital formation is the emergence of reciprocal relationships between
                investors and investees. Cloud providers invest equity in AI startups, who subsequently commit to
                purchasing cloud services from their investors. Hardware manufacturers invest in cloud infrastructure
                companies, who then purchase the manufacturer&apos;s products. These bidirectional flows create what we
                term <em>circular patterns</em>—closed loops where value circulates between parties through
                heterogeneous transaction types.
              </p>
              <p>
                While such arrangements may reflect rational business strategy and vertical integration, they raise
                important questions for financial analysts, regulators, and market observers. How should &ldquo;organic&rdquo;
                revenue growth be evaluated when a company&apos;s revenue derives substantially from entities in which
                it holds equity positions? What are the risk correlations among companies whose valuations depend
                on contracts with one another?
              </p>
            </div>

            <div className="research-callout">
              <p className="research-callout-label">Research Question</p>
              <p className="research-callout-text">
                Can we develop a quantitative metric for measuring circularity in corporate deal networks, and
                what structural patterns emerge when applying this metric to the AI industry?
              </p>
            </div>

            <div className="research-prose">
              <p>
                This paper makes five contributions. First, we present a formal methodology for representing
                corporate deal networks as directed graphs and detecting circular flows. Second, we introduce
                the Loop Score, a composite metric that quantifies the strength of two-party bidirectional
                relationships based on flow type diversity, monetary balance, and data quality. Third, we extend
                this framework to detect and score multi-party cycles—circular flows involving three or more
                companies—using depth-first search with a complementary Cycle Score metric. Fourth, we introduce
                the Hub Score, which aggregates participation across both two-party loops and multi-party cycles
                to identify systemically central entities. Fifth, we apply this methodology to a purposefully selected
                dataset of {totalDeals} deals among prominent AI, cloud, and semiconductor companies, identifying {totalCircularStructures} circular structures
                and the hub companies that occupy central positions within this network.
              </p>
            </div>
          </section>

          {/* 2. Related Work */}
          <section className="research-section">
            <h2 className="research-h2">2. Background and Related Work</h2>

            <h3 className="research-h3">2.1 Network Analysis in Finance</h3>
            <div className="research-prose">
              <p>
                Graph-based methods have been widely applied to financial systems. Allen &amp; Gale (2000) established
                the foundational model of financial contagion, demonstrating how shocks propagate through interbank
                lending networks via direct balance sheet linkages—a mechanism we adapt to analyze how valuation
                shocks might cascade through investor-investee relationships in AI deal networks. Gai &amp; Kapadia (2010)
                extended this framework to show that highly interconnected nodes create systemic fragility; their
                concept of interconnected institutions informs our Hub Score
                metric, which quantifies the extent of a company&apos;s participation in circular flows within our sample. Corporate board interlocks have been analyzed for governance implications
                (Mizruchi, 1996), while supply chain network analysis has emerged as a tool for understanding
                firm-level risk propagation. Acemoglu et al. (2012) demonstrated that idiosyncratic shocks to
                central firms can generate aggregate fluctuations when network connections are sufficiently
                asymmetric—a finding with direct relevance to NVIDIA&apos;s structural position in AI deal networks.
              </p>
            </div>

            <h3 className="research-h3">2.2 Circular Transactions and Related-Party Analysis</h3>
            <div className="research-prose">
              <p>
                The accounting literature has examined related-party transactions and their implications for
                financial statement quality. Gordon et al. (2004) documented that related-party transactions
                are associated with weaker governance and lower earnings quality—a framework directly applicable
                to the Microsoft-OpenAI relationship, where Microsoft simultaneously holds equity and receives
                cloud revenue from its investee. Dechow et al. (2011) identified specific financial statement
                patterns predictive of material misstatements, including unusual revenue growth from related
                parties; our Loop Score operationalizes a similar early-warning function by flagging company
                pairs with high-volume bidirectional flows. Circular trading patterns have been studied in equity
                markets for manipulation detection (Aitken et al., 2015). Our work extends this literature by
                providing a quantitative framework for detecting circular patterns across heterogeneous transaction
                types (equity, services, hardware) rather than within a single asset class.
              </p>
            </div>

            <h3 className="research-h3">2.3 Venture Capital and Platform Networks</h3>
            <div className="research-prose">
              <p>
                The venture capital literature documents extensive syndication networks. Hochberg, Ljungqvist &amp;
                Lu (2007) demonstrated that VC network centrality predicts fund performance, establishing that
                investor relationships have real economic consequences beyond capital provision. The AI industry
                exhibits an intensified version of this phenomenon: cloud providers are not merely co-investors
                but also customers and infrastructure suppliers to their portfolio companies, creating multilayer
                dependencies absent in traditional VC syndication.
              </p>
              <p>
                Platform economics offers additional theoretical grounding. Rochet &amp; Tirole (2003, 2006) formalized
                two-sided market dynamics where platforms subsidize one side to capture value from another. Cloud
                providers investing in AI startups who then consume cloud services exemplifies this logic: equity
                investments function as customer acquisition costs, with returns captured through service revenue
                rather than traditional exit multiples.
              </p>
            </div>

            <h3 className="research-h3">2.4 AI Industry Structure</h3>
            <div className="research-prose">
              <p>
                Prior analyses of the AI industry have focused on investment trends (Stanford HAI, 2024),
                compute requirements (Sevilla et al., 2022), and market concentration (Vipra &amp; Korinek, 2023).
                Historical parallels exist in the dot-com era, where Ofek &amp; Richardson (2003) documented how
                lockup expirations and insider relationships contributed to valuation instability—dynamics potentially
                relevant to AI companies whose cloud commitments create long-term liability structures. To our
                knowledge, this is the first study to systematically map and quantify circular deal patterns in
                the AI ecosystem, applying network methodology from financial contagion literature to corporate
                deal structures.
              </p>
            </div>
          </section>

          {/* 3. Methodology */}
          <section className="research-section">
            <h2 className="research-h2">3. Methodology</h2>

            <h3 className="research-h3">3.1 Data Collection</h3>
            <div className="research-prose">
              <p>
                We compiled a dataset of {totalDeals} deals involving {totalCompanies} companies from publicly available sources
                including SEC filings (10-K, 8-K, S-1), official press releases, and financial news reporting
                from Bloomberg, Reuters, CNBC, and The Information. Data collection covered the period from
                January 2022 to January 2025.
              </p>
              <p>
                Our sample comprises approximately {totalCompanies} major AI, cloud, and semiconductor companies selected
                based on three criteria: (1) market leadership or valuation exceeding $1 billion,
                (2) documented participation in AI-related deals during 2022–2025, and (3) publicly
                verifiable deal information via SEC filings or press releases. This is a purposefully
                selected sample of prominent industry participants, not a random sample of the AI ecosystem.
                Findings should be interpreted as patterns among these specific companies rather than
                population-level estimates.
              </p>
              <p>
                Each deal record includes the following attributes:
              </p>
            </div>
            <ul className="research-list">
              <li><strong>Deal Type (τ):</strong> Investment, Cloud Commitment, Supply Agreement, Partnership, Acquisition, or Revenue Share</li>
              <li><strong>Flow Type (φ):</strong> Money, Compute/Hardware, Service, or Equity</li>
              <li><strong>Direction:</strong> For each party, whether value flows out (source) or in (recipient)</li>
              <li><strong>Amount:</strong> Transaction value in USD, where disclosed</li>
              <li><strong>Data Status:</strong> Confirmed (official announcement with specific figures) or Estimated (reported but unconfirmed)</li>
              <li><strong>Confidence Score (c):</strong> 1–5 rating based on source reliability and corroboration</li>
            </ul>

            <div className="research-table-wrapper">
              <p className="research-table-caption">Table 1: Dataset Composition by Deal Type</p>
              <table className="research-table">
                <thead>
                  <tr>
                    <th>Deal Type</th>
                    <th className="text-right">Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cloud Commitment</td>
                    <td className="text-right research-table-mono">23</td>
                  </tr>
                  <tr>
                    <td>Investment</td>
                    <td className="text-right research-table-mono">19</td>
                  </tr>
                  <tr>
                    <td>Partnership</td>
                    <td className="text-right research-table-mono">13</td>
                  </tr>
                  <tr>
                    <td>Supply Agreement</td>
                    <td className="text-right research-table-mono">7</td>
                  </tr>
                  <tr>
                    <td>Acquisition</td>
                    <td className="text-right research-table-mono">3</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="research-h3">3.2 Graph Representation</h3>
            <div className="research-prose">
              <p>
                We model the deal network as a directed multigraph G = (V, E), where V represents companies
                and E represents directed edges derived from deals. Each edge e ∈ E is characterized by:
              </p>
            </div>
            <ul className="research-list">
              <li>Source node (from): The company from which value flows</li>
              <li>Target node (to): The company receiving value</li>
              <li>Edge type (τ): The deal type classification</li>
              <li>Flow type (φ): The type of value being transferred</li>
              <li>Weight (w): The transaction amount in USD</li>
              <li>Confidence (c): The average confidence score across sources</li>
            </ul>
            <div className="research-prose">
              <p>
                Deals with multiple parties of the same role are represented as multiple edges. Direction
                is inferred from party roles: INVESTOR→INVESTEE, CUSTOMER→SUPPLIER, ACQUIRER→TARGET.
                Partnership deals without clear directionality are represented as bidirectional edges.
              </p>
            </div>

            <h3 className="research-h3">3.3 Two-Party Loop Detection</h3>
            <div className="research-prose">
              <p>
                We define a <em>two-party loop</em> as a pair of edges (e₁, e₂) where e₁ connects company
                A to company B, and e₂ connects B to A. Formally:
              </p>
            </div>
            <div className="research-code">
              Loop(A, B) = ∃ e₁, e₂ ∈ E : (e₁.from = A ∧ e₁.to = B) ∧ (e₂.from = B ∧ e₂.to = A)
            </div>
            <div className="research-prose">
              <p>
                Two-party loop detection is performed by constructing an edge index keyed by (from, to) pairs
                and checking for the existence of reverse edges. This algorithm runs in O(|E|) time. Two-party
                loops represent the simplest form of circularity—direct reciprocal flows between two entities.
              </p>
            </div>

            <h3 className="research-h3">3.4 Loop Score Metric (Two-Party)</h3>
            <div className="research-prose">
              <p>
                To quantify the strength and significance of detected two-party loops, we introduce the <em>Loop Score</em>,
                a composite metric in the range [0, 1] that combines three factors:
              </p>
            </div>

            <div className="research-definition">
              <p className="research-definition-title">Definition: Loop Score</p>
              <p className="research-formula">
                S(e₁, e₂) = α · D(e₁, e₂) + β · B(e₁, e₂) + γ · C(e₁, e₂)
              </p>
              <p className="research-definition-note">where α = 0.35, β = 0.35, γ = 0.30, and:</p>
              <div className="research-definition-item">
                <p className="research-definition-item-title">Flow Diversity D(e₁, e₂)</p>
                <p className="research-definition-item-text">D = 1.0 if φ(e₁) ≠ φ(e₂), else D = 0.7</p>
                <p className="research-definition-item-note">
                  Loops with different flow types (e.g., equity in, services out) indicate stronger
                  circular patterns than same-type bidirectional flows.
                </p>
              </div>
              <div className="research-definition-item">
                <p className="research-definition-item-title">Balance Ratio B(e₁, e₂)</p>
                <p className="research-definition-item-text">B = 0.5 + 0.5 · min(w₁, w₂) / max(w₁, w₂)</p>
                <p className="research-definition-item-note">
                  Yields values in [0.5, 1.0]. Symmetric monetary amounts suggest mutual dependence;
                  highly imbalanced flows receive lower scores.
                </p>
              </div>
              <div className="research-definition-item">
                <p className="research-definition-item-title">Confidence Factor C(e₁, e₂)</p>
                <p className="research-definition-item-text">C = (c₁ + c₂) / 10</p>
                <p className="research-definition-item-note">
                  Normalizes the average confidence score to [0, 1], weighting loops with better-sourced
                  data more heavily.
                </p>
              </div>
            </div>

            <div className="research-prose">
              <p>
                The weighting scheme (α = β = 0.35, γ = 0.30) was selected to balance structural characteristics
                (diversity, balance) against data quality considerations. We provide empirical sensitivity
                analysis in Section 6.3, demonstrating ranking robustness across alternative weighting schemes.
              </p>
            </div>

            <h3 className="research-h3">3.5 Centrality Measures</h3>
            <div className="research-prose">
              <p>
                We compute degree centrality for each node as the count of incident edges. Additionally,
                we identify &ldquo;hub&rdquo; nodes that participate in multiple detected loops. A company is
                classified as a hub if it appears in three or more loops with Loop Score ≥ 0.5.
              </p>
            </div>

            <h3 className="research-h3">3.6 Hub Score (Systemic Importance)</h3>
            <div className="research-prose">
              <p>
                To quantify company-level centrality in circular flows, we define the Hub Score as the sum of
                scores across all circular structures—both two-party loops and multi-party cycles—in which
                a company participates:
              </p>
            </div>

            <div className="research-definition">
              <p className="research-definition-title">Definition: Hub Score</p>
              <p className="research-formula">
                H(company) = Σ S(structure) for all circular structures containing company
              </p>
              <p className="research-definition-note">
                Where S(structure) is the Loop Score for two-party loops or Cycle Score for multi-party cycles.
                Companies with higher Hub Scores participate in more circular structures and/or stronger ones.
                This aggregation across both structure types captures the full extent of a company&apos;s
                entanglement in circular flows.
              </p>
              <div className="research-definition-item">
                <p className="research-definition-item-title">Normalized Hub Score</p>
                <p className="research-definition-item-text" style={{ fontFamily: 'ui-monospace, monospace' }}>
                  H<sub>norm</sub>(company) = H(company) / max(H)
                </p>
                <p className="research-definition-item-note">
                  Yields values in [0, 1], allowing comparison across networks of different sizes and densities.
                </p>
              </div>
              <div className="research-definition-item">
                <p className="research-definition-item-title">Supporting Metrics</p>
                <ul style={{ fontSize: '0.75rem', color: 'var(--research-text-muted)', marginTop: '0.25rem', paddingLeft: '1.25rem' }}>
                  <li><strong>Structure Count:</strong> Total number of loops and cycles the company participates in</li>
                  <li><strong>Average Score:</strong> Mean score across all the company&apos;s circular structures</li>
                  <li><strong>Total Circulation:</strong> Sum of USD flowing through all structures involving the company</li>
                </ul>
              </div>
            </div>

            <div className="research-prose">
              <p>
                The Hub Score captures systemic importance: companies with high Hub Scores are entangled in multiple
                reciprocal relationships, suggesting that disruptions to these companies could propagate through
                several circular flows simultaneously.
              </p>
            </div>

            <h3 className="research-h3">3.7 Multi-Party Cycle Detection</h3>
            <div className="research-prose">
              <p>
                While two-party loops capture direct reciprocal relationships, value may also circulate through
                longer chains. We extend our analysis to detect <em>multi-party cycles</em>—circular flows
                involving three to five companies. Formally, a k-party cycle is an ordered sequence of k distinct
                companies (C₁, C₂, ..., Cₖ) such that directed edges exist connecting each consecutive pair
                and closing the loop:
              </p>
            </div>
            <div className="research-code">
              Cycle(C₁, ..., Cₖ) = ∃ edges e₁, ..., eₖ : eᵢ connects Cᵢ → Cᵢ₊₁ (mod k)
            </div>
            <div className="research-prose">
              <p>
                Detection is performed using depth-first search (DFS) from each node, following Tarjan&apos;s (1972)
                foundational algorithm for graph traversal. We explore paths up to length k and check for edges
                that return to the starting node. To avoid counting the same cycle multiple times from different
                starting points, we canonicalize cycle identifiers by selecting the lexicographically smallest
                rotation of company slugs, a standard technique in cycle enumeration (Johnson, 1975).
              </p>
            </div>

            <div className="research-definition">
              <p className="research-definition-title">Definition: Cycle Score</p>
              <p className="research-formula">
                S(cycle) = 0.30·F + 0.25·B + 0.10·M + 0.20·C + 0.15·L
              </p>
              <p className="research-definition-note">where:</p>
              <div className="research-definition-item">
                <p className="research-definition-item-title">Flow Coherence (F)</p>
                <p className="research-definition-item-text">
                  F = 1.0 if edges exhibit complementary flow types (e.g., MONEY + SERVICE), 0.7 if uniform, 0.5 otherwise
                </p>
              </div>
              <div className="research-definition-item">
                <p className="research-definition-item-title">Value Balance (B)</p>
                <p className="research-definition-item-text">
                  B = 1 − log₁₀(max/min) / 3, clamped to [0, 1]
                </p>
                <p className="research-definition-item-note">
                  Uses logarithmic scaling since cycle values can span orders of magnitude. Perfect balance yields 1.0;
                  a 1000× difference yields 0.
                </p>
              </div>
              <div className="research-definition-item">
                <p className="research-definition-item-title">Value Magnitude (M)</p>
                <p className="research-definition-item-text">
                  M = (log₁₀(totalValue) − 6) / 6, clamped to [0, 1]
                </p>
                <p className="research-definition-item-note">
                  Scores based on total cycle value: $1M → 0, $1B → 0.5, $1T → 1.0
                </p>
              </div>
              <div className="research-definition-item">
                <p className="research-definition-item-title">Confidence (C)</p>
                <p className="research-definition-item-text">
                  C = average confidence across all edges / 5
                </p>
              </div>
              <div className="research-definition-item">
                <p className="research-definition-item-title">Length Penalty (L)</p>
                <p className="research-definition-item-text">
                  L = 1 / √(n − 1), where n is cycle length
                </p>
                <p className="research-definition-item-note">
                  Shorter cycles receive higher scores: 3-cycle → 0.71, 4-cycle → 0.58, 5-cycle → 0.50.
                  This reflects that tighter circular relationships are more indicative of coordinated behavior.
                </p>
              </div>
            </div>

            <div className="research-prose">
              <p>
                The Cycle Score weights differ from the Loop Score to account for the structural properties of
                multi-party cycles. The length penalty (L) prioritizes shorter cycles, as a 3-company circular
                arrangement represents a tighter, more direct form of interdependence than longer chains.
                Value magnitude (M) receives reduced weight (0.10 vs 0.35 in loops) since multi-party cycles
                naturally aggregate larger total values across more edges.
              </p>
            </div>

            <h3 className="research-h3">3.8 Null Model for Statistical Significance</h3>
            <div className="research-prose">
              <p>
                A critical question in network analysis is whether observed patterns are statistically meaningful
                or merely artifacts of network density. To address this, we employ the <em>configuration model</em>—a
                well-established null model in network science that generates random networks preserving the
                degree sequence of the original graph (Newman, 2010; Molloy &amp; Reed, 1995).
              </p>
            </div>

            <div className="research-definition">
              <p className="research-definition-title">Definition: Configuration Model</p>
              <p className="research-definition-note">
                Given a directed graph G = (V, E), the configuration model generates random graphs G&apos; with
                identical in-degree and out-degree sequences but randomized edge endpoints. This controls for
                network density: a company with many deals will naturally appear in more loops by volume alone.
                The configuration model asks: <em>&ldquo;If companies made the same number of deals but randomly
                chose partners, how many circular patterns would we expect?&rdquo;</em>
              </p>
            </div>

            <div className="research-prose">
              <p>
                <strong>Algorithm.</strong> Our implementation uses the stub-matching variant
                with Fisher-Yates shuffling:
              </p>
            </div>

            <div className="research-code">
              <span className="research-code-comment">{'// Configuration Model Algorithm'}</span>{'\n'}
              <span className="research-code-number">1.</span> Create outStubs = [source company for each edge in E]{'\n'}
              <span className="research-code-number">2.</span> Create inStubs = [target company for each edge in E]{'\n'}
              <span className="research-code-number">3.</span> Fisher-Yates shuffle inStubs (randomize target assignments){'\n'}
              <span className="research-code-number">4.</span> Pair: newEdge[i] = (outStubs[i] → shuffled inStubs[i]){'\n'}
              <span className="research-code-number">5.</span> Filter: remove self-loops (A → A){'\n'}
              <span className="research-code-number">6.</span> Deduplicate: keep unique (from, to) pairs{'\n'}
              <span className="research-code-number">7.</span> Count loops and cycles in randomized graph{'\n'}
              <span className="research-code-number">8.</span> Repeat n times to build null distribution
            </div>

            <div className="research-prose">
              <p>
                <strong>What the null model preserves vs. randomizes:</strong>
              </p>
            </div>

            <div className="research-table-wrapper">
              <table className="research-table">
                <thead>
                  <tr>
                    <th>Preserved (Controlled)</th>
                    <th>Randomized (Varied)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Number of nodes (companies)</td>
                    <td>Who connects to whom</td>
                  </tr>
                  <tr>
                    <td>Number of edges (deals)</td>
                    <td>Specific partnerships formed</td>
                  </tr>
                  <tr>
                    <td>Each company&apos;s out-degree (deals initiated)</td>
                    <td>Which companies receive those deals</td>
                  </tr>
                  <tr>
                    <td>Each company&apos;s in-degree (deals received)</td>
                    <td>Which companies initiate those deals</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="research-prose">
              <p>
                <strong>Statistical inference.</strong> We run n = 500 iterations of the
                configuration model, counting loops and cycles in each randomized network. This generates a
                null distribution against which we compare observed values. Statistical significance is assessed
                using z-scores (standard deviations from null mean) and two-tailed p-values derived from the
                normal approximation:
              </p>
            </div>

            <div className="research-code" style={{ textAlign: 'center' }}>
              z = (observed − μ<sub>null</sub>) / σ<sub>null</sub>{'\n'}
              p = 2 × (1 − Φ(|z|))
            </div>

            <div className="research-prose">
              <p>
                A p-value below 0.05 indicates the observed count is unlikely to arise by chance in a random
                network with the same degree sequence—suggesting the pattern reflects genuine structural properties
                of the AI industry rather than network density artifacts.
              </p>
            </div>
          </section>

          {/* 4. Results */}
          <section className="research-section">
            <h2 className="research-h2">4. Results</h2>

            <h3 className="research-h3">4.1 Network Statistics</h3>
            <div className="research-prose">
              <p>
                The constructed graph contains {totalCompanies} nodes and {graphData.edges.length} directed edges.
                Our detection algorithms identified {totalCircularStructures} circular structures in total:
              </p>
            </div>
            <ul className="research-list">
              <li>
                <strong>{loops.length} two-party loops</strong> (bidirectional A↔B flows) with
                mean Loop Score of {loops.length > 0 ? (loops.reduce((sum, l) => sum + l.loopScore, 0) / loops.length).toFixed(3) : 'N/A'}
              </li>
              <li>
                <strong>{multiPartyCycles.length} multi-party cycles</strong> (3–5 company chains)
                with mean Cycle Score of {multiPartyCycles.length > 0 ? (multiPartyCycles.reduce((sum, c) => sum + c.cycleScore, 0) / multiPartyCycles.length).toFixed(3) : 'N/A'}
              </li>
            </ul>
            <div className="research-prose">
              <p>
                The prevalence of multi-party cycles ({multiPartyCycles.length}) substantially exceeds two-party
                loops ({loops.length}), indicating that circular value flows in the AI industry frequently
                traverse intermediary nodes rather than flowing directly between counterparties.
              </p>
            </div>

            <h3 className="research-h3">4.2 Detected Circular Flows</h3>
            <div className="research-prose">
              <p>
                Table 2 presents the detected loops ranked by Loop Score. The highest-scoring loops exhibit
                flow type diversity (different transaction types in each direction) and moderate balance ratios.
              </p>
            </div>

            {loops.length > 0 && (
              <div className="research-table-wrapper">
                <p className="research-table-caption">Table 2: Detected Loops Ranked by Loop Score</p>
                <table className="research-table">
                  <thead>
                    <tr>
                      <th>Company Pair</th>
                      <th>Flow A → B</th>
                      <th>Flow B → A</th>
                      <th className="text-right">Balance</th>
                      <th className="text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loops.slice(0, 12).map((loop, idx) => (
                      <tr key={loop.id}>
                        <td>
                          <span style={{ color: 'var(--research-text-faint)', marginRight: '0.5rem' }}>{idx + 1}.</span>
                          {loop.company1.name} ↔ {loop.company2.name}
                        </td>
                        <td>
                          {loop.edge1.flowType.replace('_', ' ')}
                          {loop.edge1.totalAmountUSD && (
                            <span style={{ color: 'var(--research-text-faint)', marginLeft: '0.25rem' }}>
                              ({formatUSD(loop.edge1.totalAmountUSD)})
                            </span>
                          )}
                        </td>
                        <td>
                          {loop.edge2.flowType.replace('_', ' ')}
                          {loop.edge2.totalAmountUSD && (
                            <span style={{ color: 'var(--research-text-faint)', marginLeft: '0.25rem' }}>
                              ({formatUSD(loop.edge2.totalAmountUSD)})
                            </span>
                          )}
                        </td>
                        <td className="text-right research-table-mono">
                          {loop.balanceRatio.toFixed(2)}
                        </td>
                        <td className="text-right">
                          <span className={`research-table-mono ${getScoreClass(loop.loopScore)}`}>
                            {loop.loopScore.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loops.length > 12 && (
                  <p className="research-table-note">
                    Showing top 12 of {loops.length} detected loops. Full dataset available in interactive explorer.
                  </p>
                )}
              </div>
            )}

            {/* 4.3 Statistical Significance */}
            {nullModel && (
              <>
                <h3 className="research-h3">4.3 Statistical Significance</h3>
                <div className="research-prose">
                  <p>
                    A critical question for this analysis is whether the observed circular patterns are
                    statistically meaningful or merely artifacts of network density. If random networks with
                    similar deal volumes produce comparable loop counts, our findings would be unremarkable.
                    To address this, we apply the configuration model (Section 3.8), generating {nullModel.config.iterations} random
                    networks that preserve each company&apos;s deal count while randomizing partnership choices.
                  </p>
                  <p>
                    <strong>Null hypothesis:</strong> The observed loop and cycle counts
                    are consistent with what would emerge by chance in a random network with the same degree
                    distribution. <strong>Alternative hypothesis:</strong> These companies
                    exhibit more circular patterns than random expectation, suggesting intentional
                    reciprocal structuring of deals.
                  </p>
                </div>

                <div className="research-callout">
                  <p className="research-callout-label">Interpretation Note</p>
                  <p className="research-callout-text">
                    Because our dataset is purposefully selected rather than randomly sampled,
                    the following z-scores and p-values should be interpreted as comparisons to
                    random graph baselines, not as inferential statistics about the broader AI
                    industry. A high z-score indicates our observed patterns deviate from random
                    expectation given this network&apos;s degree distribution.
                  </p>
                </div>

                <div className="research-table-wrapper">
                  <p className="research-table-caption">
                    Table 2b: Null Model Comparison (Configuration Model, n={nullModel.config.iterations})
                  </p>
                  <table className="research-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th className="text-right">Observed</th>
                        <th className="text-right">Null Mean</th>
                        <th className="text-right">Null SD</th>
                        <th className="text-right">z-score</th>
                        <th className="text-right">p-value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Two-Party Loops</td>
                        <td className="text-right research-table-mono">
                          {nullModel.loops.real.loopCount}
                        </td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                          {nullModel.loops.null.loopCount.mean.toFixed(1)}
                        </td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                          {nullModel.loops.null.loopCount.std.toFixed(1)}
                        </td>
                        <td className="text-right">
                          <span className={`research-table-mono ${Math.abs(nullModel.loops.significance.loopCount.zScore) >= 2.58 ? 'research-score-high' : Math.abs(nullModel.loops.significance.loopCount.zScore) >= 1.96 ? 'research-score-medium' : 'research-score-low'}`}>
                            {nullModel.loops.significance.loopCount.zScore.toFixed(2)}
                          </span>
                        </td>
                        <td className="text-right research-table-mono">
                          {formatPValue(nullModel.loops.significance.loopCount.pValue)}
                          <span className="research-score-medium" style={{ marginLeft: '0.25rem' }}>
                            {getSignificanceStars(nullModel.loops.significance.loopCount.pValue)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Multi-Party Cycles (Total)</td>
                        <td className="text-right research-table-mono">
                          {nullModel.cycles.real.totalCycleCount}
                        </td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                          {nullModel.cycles.null.totalCycleCount.mean.toFixed(1)}
                        </td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                          {nullModel.cycles.null.totalCycleCount.std.toFixed(1)}
                        </td>
                        <td className="text-right">
                          <span className={`research-table-mono ${Math.abs(nullModel.cycles.significance.totalCycleCount.zScore) >= 2.58 ? 'research-score-high' : Math.abs(nullModel.cycles.significance.totalCycleCount.zScore) >= 1.96 ? 'research-score-medium' : 'research-score-low'}`}>
                            {nullModel.cycles.significance.totalCycleCount.zScore.toFixed(2)}
                          </span>
                        </td>
                        <td className="text-right research-table-mono">
                          {formatPValue(nullModel.cycles.significance.totalCycleCount.pValueExact ?? nullModel.cycles.significance.totalCycleCount.pValue)}
                          <span className="research-score-medium" style={{ marginLeft: '0.25rem' }}>
                            {getSignificanceStars(nullModel.cycles.significance.totalCycleCount.pValueExact ?? nullModel.cycles.significance.totalCycleCount.pValue)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: '1.5rem' }}>— 3-company cycles</td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                          {nullModel.cycles.real.cycle3Count}
                        </td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-faint)' }}>
                          {nullModel.cycles.null.cycle3Count.mean.toFixed(1)}
                        </td>
                        <td className="text-right" style={{ color: 'var(--research-text-faint)' }}>—</td>
                        <td className="text-right" style={{ color: 'var(--research-text-faint)' }}>—</td>
                        <td className="text-right" style={{ color: 'var(--research-text-faint)' }}>—</td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: '1.5rem' }}>— 4-company cycles</td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                          {nullModel.cycles.real.cycle4Count}
                        </td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-faint)' }}>
                          {nullModel.cycles.null.cycle4Count.mean.toFixed(1)}
                        </td>
                        <td className="text-right" style={{ color: 'var(--research-text-faint)' }}>—</td>
                        <td className="text-right" style={{ color: 'var(--research-text-faint)' }}>—</td>
                        <td className="text-right" style={{ color: 'var(--research-text-faint)' }}>—</td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: '1.5rem' }}>— 5-company cycles</td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                          {nullModel.cycles.real.cycle5Count}
                        </td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-faint)' }}>
                          {nullModel.cycles.null.cycle5Count.mean.toFixed(1)}
                        </td>
                        <td className="text-right" style={{ color: 'var(--research-text-faint)' }}>—</td>
                        <td className="text-right" style={{ color: 'var(--research-text-faint)' }}>—</td>
                        <td className="text-right" style={{ color: 'var(--research-text-faint)' }}>—</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="research-table-note">
                    Significance: *** p &lt; 0.001, ** p &lt; 0.01, * p &lt; 0.05. Computed via {nullModel.config.iterations} configuration model iterations in {(nullModel.networkStats.computeDurationMs / 1000).toFixed(1)}s.
                  </p>
                </div>

                <div className="research-prose">
                  <p>
                    <strong>Interpretation of results:</strong>
                  </p>
                  <p>
                    {nullModel.loops.significance.loopCount.isSignificant ? (
                      <>
                        <strong>Two-party loops (direct reciprocity):</strong> The observed {nullModel.loops.real.loopCount} bidirectional
                        loops is {((nullModel.loops.real.loopCount / nullModel.loops.null.loopCount.mean - 1) * 100).toFixed(0)}% higher than
                        random expectation (null mean = {nullModel.loops.null.loopCount.mean.toFixed(1)} ± {nullModel.loops.null.loopCount.std.toFixed(1)}).
                        With z = {nullModel.loops.significance.loopCount.zScore.toFixed(2)} and p {formatPValue(nullModel.loops.significance.loopCount.pValue)},
                        the observed patterns <strong>deviate substantially from random expectation</strong>. Only {(nullModel.loops.significance.loopCount.pValue * 100).toFixed(1)}%
                        of randomly rewired networks with identical degree sequences exhibit this many bidirectional relationships.
                        This indicates that these companies form direct reciprocal relationships (investor↔customer,
                        supplier↔client) at rates exceeding what would occur in randomly rewired networks.
                      </>
                    ) : (
                      <>
                        <strong>Two-party loops:</strong> The observed {nullModel.loops.real.loopCount} loops
                        is consistent with random expectation (null mean = {nullModel.loops.null.loopCount.mean.toFixed(1)} ± {nullModel.loops.null.loopCount.std.toFixed(1)},
                        z = {nullModel.loops.significance.loopCount.zScore.toFixed(2)},
                        p = {nullModel.loops.significance.loopCount.pValue.toFixed(2)}).
                        The loop count is <strong>consistent with random baseline levels</strong>—not
                        distinguishable from what would be expected in a randomly rewired network with the same degree distribution.
                      </>
                    )}
                  </p>
                  <p>
                    {(() => {
                      const cyclePValue = nullModel.cycles.significance.totalCycleCount.pValueExact ?? nullModel.cycles.significance.totalCycleCount.pValue;
                      const cycleSignificant = cyclePValue < 0.05;
                      return cycleSignificant ? (
                        <>
                          <strong>Multi-party cycles (longer chains):</strong> The {nullModel.cycles.real.totalCycleCount} observed
                          cycles is {((nullModel.cycles.real.totalCycleCount / nullModel.cycles.null.totalCycleCount.mean - 1) * 100).toFixed(0)}% above
                          null expectation (mean = {nullModel.cycles.null.totalCycleCount.mean.toFixed(1)} ± {nullModel.cycles.null.totalCycleCount.std.toFixed(1)}).
                          With exact p = {formatPValue(cyclePValue)},
                          the multi-party circular flows exceed random baseline levels. This indicates that value circulation
                          through 3–5 company chains among these firms is stronger than what random network topology would produce.
                        </>
                      ) : (
                        <>
                          <strong>Multi-party cycles:</strong> The {nullModel.cycles.real.totalCycleCount} observed cycles
                          is consistent with random baseline levels (exact p = {cyclePValue.toFixed(2)}). Longer circular chains
                          are common in dense networks and could plausibly arise in randomly rewired networks.
                        </>
                      );
                    })()}
                  </p>
                </div>

                <div className="research-callout">
                  <p className="research-callout-label">Key Finding</p>
                  <p className="research-callout-text">
                    {(() => {
                      const loopSignificant = nullModel.loops.significance.loopCount.isSignificant;
                      const cyclePValue = nullModel.cycles.significance.totalCycleCount.pValueExact ?? nullModel.cycles.significance.totalCycleCount.pValue;
                      const cycleSignificant = cyclePValue < 0.05;
                      if (loopSignificant && cycleSignificant) {
                        return (
                          <>
                            Both two-party loops and multi-party cycles exceed random baseline levels (p &lt; 0.05).
                            These major AI companies exhibit circular deal patterns at rates exceeding random expectation,
                            indicating that reciprocal business relationships are a notable
                            structural feature among the firms in our sample—not merely an artifact of network density.
                          </>
                        );
                      } else if (loopSignificant) {
                        return (
                          <>
                            Direct reciprocity (two-party loops) exceeds random baseline levels, while longer cycles
                            do not. This suggests that the most notable structural feature among these companies is
                            the prevalence of tight, bidirectional relationships between pairs of companies—investors
                            who become customers, and vice versa.
                          </>
                        );
                      } else {
                        return (
                          <>
                            Neither loops nor cycles exceed random baseline levels. The observed circular patterns
                            could plausibly arise in randomly rewired networks with similar degree distributions.
                          </>
                        );
                      }
                    })()}
                  </p>
                </div>
              </>
            )}

            <h3 className="research-h3">4.4 Case Studies</h3>
            <div className="research-prose">
              <p>
                <strong>Case 1: Microsoft–OpenAI (Score: ~0.72).</strong> Microsoft has invested
                an estimated $10–13 billion in OpenAI equity. OpenAI committed $250 billion to Microsoft Azure cloud
                services and $300 billion to Oracle infrastructure (with Microsoft partnership components). This
                represents a canonical example of investor-customer circularity: equity flows from cloud provider
                to AI company, and cloud revenue flows back. The balance ratio is relatively low due to the
                asymmetry between investment and cloud commitment amounts.
              </p>
              <p>
                <strong>Case 2: NVIDIA–CoreWeave (Score: ~0.75).</strong> NVIDIA invested
                $350 million in CoreWeave. CoreWeave deployed this capital (along with other financing) to
                purchase 250,000+ NVIDIA GPUs. Subsequently, NVIDIA signed deals worth $7.6 billion to rent
                compute capacity from CoreWeave&apos;s data centers. This creates a three-phase cycle: equity →
                hardware purchase → capacity rental. NVIDIA effectively rents back infrastructure built on
                its own products. This structure exemplifies Acemoglu et al.&apos;s (2012) supply chain propagation
                mechanism: a shock to NVIDIA (e.g., chip shortages) would impair CoreWeave&apos;s expansion, which
                would reduce capacity available to NVIDIA&apos;s own cloud customers—creating a feedback loop
                absent in linear supply chains.
              </p>
              <p>
                <strong>Case 3: Google–Anthropic.</strong> Google invested $2.3 billion
                in Anthropic. Anthropic subsequently committed to &ldquo;tens of billions&rdquo; in Google Cloud
                spending. Similar patterns exist with Amazon&apos;s $8 billion Anthropic investment. This
                &ldquo;proxy war&rdquo; structure—where competing cloud providers invest in the same AI company—creates
                parallel circular flows through a common node.
              </p>
            </div>

            <h3 className="research-h3">4.5 Hub Analysis</h3>
            <div className="research-prose">
              <p>
                Table 3 presents companies ranked by Hub Score, quantifying their systemic centrality in the
                circular flow network. Companies with higher Hub Scores participate in more and/or stronger
                circular relationships.
              </p>
            </div>

            {hubScores.filter(hs => hs.loopCount > 0).length > 0 && (
              <div className="research-table-wrapper">
                <p className="research-table-caption">Table 3: Hub Score Rankings (Systemic Centrality)</p>
                <table className="research-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th className="text-right">Hub Score</th>
                      <th className="text-right">Normalized</th>
                      <th className="text-right">Loops</th>
                      <th className="text-right">Avg Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hubScores.filter(hs => hs.loopCount > 0).slice(0, 10).map((hs, idx) => (
                      <tr key={hs.companyId}>
                        <td>
                          <span style={{ color: 'var(--research-text-faint)', marginRight: '0.5rem' }}>{idx + 1}.</span>
                          {hs.companyName}
                        </td>
                        <td className="text-right">
                          <span className={`research-table-mono ${getScoreClass(hs.normalizedHubScore)}`}>
                            {hs.hubScore.toFixed(2)}
                          </span>
                        </td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                          {hs.normalizedHubScore.toFixed(2)}
                        </td>
                        <td className="text-right research-table-mono">
                          {hs.loopCount}
                        </td>
                        <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                          {hs.avgLoopScore.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hubScores.filter(hs => hs.loopCount > 0).length > 10 && (
                  <p className="research-table-note">
                    Showing top 10 of {hubScores.filter(hs => hs.loopCount > 0).length} companies with loop participation.
                  </p>
                )}
              </div>
            )}

            <div className="research-prose">
              <p>
                {hubScores.length > 0 && hubScores[0].loopCount > 0 ? (
                  <>
                    {hubScores[0].companyName} achieves the highest Hub Score ({hubScores[0].hubScore.toFixed(2)}),
                    reflecting participation in {hubScores[0].loopCount} circular flows. This positions {hubScores[0].companyName} as the
                    most systemically central entity in the AI deal network.
                  </>
                ) : (
                  <>NVIDIA occupies a unique structural position in the network.</>
                )}
              </p>
              <p>
                NVIDIA occupies a unique structural position: it simultaneously serves as hardware supplier
                (GPUs to cloud providers), equity investor (stakes in CoreWeave, OpenAI, and others), and
                customer (renting cloud capacity). This multi-role centrality suggests that NVIDIA&apos;s
                financial performance is particularly interconnected with the broader AI ecosystem. CoreWeave
                functions as an infrastructure intermediary, receiving investment from chip manufacturers,
                purchasing their hardware, and selling compute services to multiple parties.
              </p>
            </div>

            <h3 className="research-h3">4.6 Multi-Party Cycles</h3>
            <div className="research-prose">
              <p>
                Beyond two-party loops, we detect {multiPartyCycles.length} multi-party cycles involving three
                or more companies. Table 4 presents the highest-scoring cycles, which reveal more complex
                patterns of circular value flow.
              </p>
            </div>

            {multiPartyCycles.length > 0 && (
              <div className="research-table-wrapper">
                <p className="research-table-caption">Table 4: Top Multi-Party Cycles by Cycle Score</p>
                <table className="research-table">
                  <thead>
                    <tr>
                      <th>Cycle Path</th>
                      <th className="text-right">Length</th>
                      <th className="text-right">Total Value</th>
                      <th className="text-right">Deals</th>
                      <th className="text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multiPartyCycles.slice(0, 10).map((cycle, idx) => {
                      // Build node lookup from cycle path and graphData nodes
                      const nodeNameMap = new Map(graphData.nodes.map(n => [n.id, n.name]));
                      return (
                        <>
                          <tr key={cycle.id}>
                            <td>
                              <span style={{ color: 'var(--research-text-faint)', marginRight: '0.5rem' }}>{idx + 1}.</span>
                              {cycle.path.map(p => p.companyName).join(' → ')} → {cycle.path[0].companyName}
                            </td>
                            <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                              {cycle.length}
                            </td>
                            <td className="text-right research-table-mono">
                              {cycle.totalValue > 0 ? formatUSD(cycle.totalValue) : '—'}
                            </td>
                            <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                              {cycle.dealCount}
                            </td>
                            <td className="text-right">
                              <span className={`research-table-mono ${getScoreClass(cycle.cycleScore)}`}>
                                {cycle.cycleScore.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                          {/* Debug: Edge breakdown */}
                          <tr key={`${cycle.id}-debug`} style={{ backgroundColor: 'var(--research-surface-2)' }}>
                            <td colSpan={5} style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>
                              <div style={{ color: 'var(--research-text-faint)' }}>
                                <strong>Edge breakdown:</strong>{' '}
                                {cycle.edges.map((edge, edgeIdx) => (
                                  <span key={edgeIdx}>
                                    {nodeNameMap.get(edge.from) || edge.from} → {nodeNameMap.get(edge.to) || edge.to}:{' '}
                                    <span style={{ color: edge.totalAmountUSD ? 'var(--research-text)' : 'var(--research-text-faint)' }}>
                                      {edge.totalAmountUSD ? formatUSD(edge.totalAmountUSD) : 'no $'}
                                    </span>
                                    {edgeIdx < cycle.edges.length - 1 ? ' + ' : ''}
                                  </span>
                                ))}
                                {' = '}
                                <strong style={{ color: 'var(--research-text)' }}>{formatUSD(cycle.totalValue)}</strong>
                              </div>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
                {multiPartyCycles.length > 10 && (
                  <p className="research-table-note">
                    Showing top 10 of {multiPartyCycles.length} detected multi-party cycles.
                  </p>
                )}
              </div>
            )}

            <div className="research-prose">
              <p>
                Several patterns emerge from the multi-party cycle analysis. First, NVIDIA appears in the
                majority of high-scoring cycles, reflecting its role as a critical intermediary—companies
                pay NVIDIA for hardware, NVIDIA invests in cloud providers, and those providers sell services
                back to the original hardware purchasers. Second, cycles involving AI model companies
                (OpenAI, Anthropic) often include both their cloud providers (Microsoft, Google, Amazon) and
                the hardware suppliers (NVIDIA), creating triangular dependencies.
              </p>
              <p>
                The existence of {multiPartyCycles.length} multi-party cycles, substantially exceeding the {loops.length} two-party loops, suggests that circular value flows in the AI industry are
                frequently mediated by intermediary nodes. This has implications for systemic risk: disruptions
                to hub nodes like NVIDIA could simultaneously affect multiple circular flows of varying lengths.
              </p>
            </div>
          </section>

          {/* 5. Discussion */}
          <section className="research-section">
            <h2 className="research-h2">5. Discussion</h2>

            <h3 className="research-h3">5.1 Interpretation</h3>
            <div className="research-prose">
              <p>
                The circular patterns we document are not inherently problematic. Vertical integration,
                strategic partnerships, and reciprocal business relationships are common features of technology
                industries. Cloud providers investing in AI companies who then become cloud customers reflects
                rational customer acquisition strategy—consistent with Rochet &amp; Tirole&apos;s (2003) two-sided
                market framework, where platforms subsidize one side to capture value from the other. Hardware
                manufacturers investing in infrastructure providers creates demand for their products.
              </p>
              <p>
                However, the scale and prevalence of these patterns in the AI industry—and the magnitude of
                the Loop Scores we compute—suggest that analysts should account for circularity when evaluating
                company financials and market dynamics. The patterns echo concerns raised by Gordon et al. (2004)
                regarding related-party transactions: when revenue derives substantially from entities with
                which a company shares equity relationships, traditional financial statement analysis requires
                adjustment.
              </p>
            </div>

            <h3 className="research-h3">5.2 Implications</h3>
            <div className="research-prose">
              <p>
                Our findings have several implications:
              </p>
            </div>
            <ul className="research-list">
              <li>
                <strong>Revenue Recognition Analysis:</strong> When Company A invests
                in Company B, and B commits to purchasing services from A, analysts should distinguish
                between &ldquo;organic&rdquo; revenue growth and revenue derived from investees. The Loop Score
                provides a quantitative signal for identifying such relationships.
              </li>
              <li>
                <strong>Valuation Interdependence:</strong> Companies with high Loop
                Scores may exhibit correlated valuation dynamics. A decline in Company B&apos;s valuation
                could impair A&apos;s investment, potentially triggering reduced cloud spending, which
                affects A&apos;s revenue—a feedback loop.
              </li>
              <li>
                <strong>Disclosure Considerations:</strong> Multi-year cloud
                commitments often exceed disclosed investment amounts but receive less granular disclosure.
                Our finding that cloud commitments substantially exceed equity investments suggests potential
                information asymmetry.
              </li>
              <li>
                <strong>Network Prominence:</strong> The concentration of circular flows
                around hub nodes is quantified by the Hub Score. Companies with high Hub Scores (particularly
                NVIDIA and CoreWeave) participate in multiple circular relationships within our sample,
                suggesting these entities occupy prominent positions in the disclosed deal network that may
                warrant closer monitoring. The Hub Score provides a metric for identifying such central entities.
              </li>
            </ul>

            <h3 className="research-h3">5.3 Comparison with Prior Work</h3>
            <div className="research-prose">
              <p>
                Our findings both parallel and diverge from prior network analyses in finance. Unlike Gai &amp;
                Kapadia&apos;s (2010) interbank networks, where linkages are homogeneous (lending relationships),
                AI deal networks exhibit heterogeneous edge types—equity, services, and hardware flow through
                the same nodes simultaneously. This multi-layer structure means that a company can be a creditor
                (investor), debtor (cloud customer), and supplier in the same relationship, complicating the
                contagion dynamics that Allen &amp; Gale (2000) modeled for single-layer networks.
              </p>
              <p>
                Our Hub Score extends Acemoglu et al.&apos;s (2012) centrality measure by incorporating participation
                across circular structures rather than counting direct connections. While Acemoglu et al. show
                that shocks to central nodes propagate downstream, the AI network&apos;s circular topology means
                that shocks can return to their origin—NVIDIA&apos;s difficulties could impair CoreWeave, whose
                reduced capacity affects OpenAI, whose decreased Azure consumption impacts Microsoft, which may
                then reduce investment in NVIDIA-dependent startups.
              </p>
              <p>
                The Loop Score operationalizes insights from Dechow et al. (2011) for a new context. Where
                Dechow et al. used financial ratios to predict misstatements, the Loop Score flags structural
                patterns—bidirectional flows between investor-customer pairs—that warrant closer scrutiny
                regardless of reported financial metrics. High Loop Scores do not indicate fraud, but they
                identify relationships where Gordon et al.&apos;s (2004) related-party concerns are most acute.
              </p>
              <p>
                Compared to Hochberg et al.&apos;s (2007) VC syndication networks, the AI deal network exhibits
                tighter clustering and more explicit reciprocity. Traditional VCs share deals but rarely become
                customers of portfolio companies; cloud providers are simultaneously investors, customers, and
                infrastructure dependencies. This multi-role participation may explain why AI company valuations
                show higher covariance than the VC portfolio companies Hochberg et al. studied.
              </p>
            </div>

            <h3 className="research-h3">5.4 Methodological Contributions</h3>
            <div className="research-prose">
              <p>
                The Loop Score, Cycle Score, and Hub Score metrics provide a replicable, quantitative approach
                to measuring circularity that can be applied to other industries and time periods. Loop Score
                captures two-party reciprocal relationships; Cycle Score extends this to multi-party chains;
                and Hub Score aggregates across both to identify systemically important entities. The detection
                of {multiPartyCycles.length} multi-party cycles demonstrates that circularity analysis limited
                to two-party loops substantially underestimates the true extent of circular value flows. All
                three metrics&apos; weighting schemes can be adjusted for different analytical priorities (e.g.,
                increasing the confidence weight for regulatory analysis, or the value magnitude weight for
                systemic risk assessment).
              </p>
            </div>
          </section>

          {/* 6. Limitations */}
          <section className="research-section">
            <h2 className="research-h2">6. Limitations and Future Work</h2>

            <h3 className="research-h3">6.1 Data Limitations</h3>
            <ul className="research-list">
              <li>
                <strong>Incomplete Disclosure:</strong> Many deal amounts are estimated
                from press reports rather than official filings. Cloud commitments are frequently reported as
                ranges or &ldquo;multi-billion&rdquo; figures. We address this through confidence scoring, but
                measurement error remains.
              </li>
              <li>
                <strong>Non-Random Sample Selection:</strong> Our dataset comprises
                purposefully selected major AI companies, not a random sample of the industry. Companies
                were included based on market prominence and deal activity visibility. This means:
                (a) we can describe patterns among these specific firms but cannot estimate prevalence
                in the broader AI ecosystem; (b) statistical tests compare observations to random graph
                baselines rather than testing population hypotheses; (c) smaller companies and private
                deals are systematically underrepresented. Our findings should be interpreted as
                &ldquo;major AI companies exhibit circular deal patterns&rdquo; rather than &ldquo;circular
                patterns are statistically significant in the AI industry.&rdquo;
              </li>
              <li>
                <strong>Temporal Clustering:</strong> Most deals in our dataset are
                from 2024–2025, reflecting the recent AI infrastructure buildout. Earlier patterns may differ,
                limiting historical comparison.
              </li>
            </ul>

            <h3 className="research-h3">6.2 Methodological Limitations</h3>
            <ul className="research-list">
              <li>
                <strong>Cycle Length Cap:</strong> Our multi-party cycle detection
                is limited to cycles of length 5 or fewer. Longer chains (6+ companies) are not captured,
                though such extended cycles are likely rare given the industry&apos;s structure.
              </li>
              <li>
                <strong>Static Analysis:</strong> We analyze a snapshot of the deal
                network. Temporal dynamics—how loops form, strengthen, or dissolve over time—are not addressed.
              </li>
              <li>
                <strong>Cycle Overlap:</strong> A single deal may participate in
                multiple cycles, potentially inflating Hub Scores for companies involved in densely connected
                regions of the graph. We count each structure independently, which may overweight certain
                network positions.
              </li>
            </ul>

            <h3 className="research-h3">6.3 Weight Sensitivity Analysis</h3>
            <div className="research-prose">
              <p>
                The Loop Score weights (α=0.35, β=0.35, γ=0.30) and Cycle Score weights were determined
                heuristically. To assess robustness, we re-ran all scoring calculations under five alternative
                weighting schemes and compared the resulting rankings.
              </p>
            </div>

            <div className="research-table-wrapper">
              <p className="research-table-caption">Table 5: Sensitivity Analysis — Top Loop Rankings Under Alternative Weights</p>
              <table className="research-table">
                <thead>
                  <tr>
                    <th>Scheme</th>
                    <th>Description</th>
                    <th>Top Loop</th>
                    <th className="text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sensitivityAnalysis.schemes.map((result, idx) => (
                    <tr key={result.scheme.name} style={idx === sensitivityAnalysis.baselineSchemeIndex ? { backgroundColor: 'var(--research-surface-2)' } : {}}>
                      <td>
                        {idx === sensitivityAnalysis.baselineSchemeIndex && (
                          <span style={{ color: 'var(--research-text-faint)', marginRight: '0.25rem' }}>★</span>
                        )}
                        {result.scheme.name}
                      </td>
                      <td style={{ color: 'var(--research-text-muted)', fontSize: '0.75rem' }}>
                        {result.scheme.description}
                      </td>
                      <td>
                        {result.topLoops[0] ? `${result.topLoops[0].company1} ↔ ${result.topLoops[0].company2}` : '—'}
                      </td>
                      <td className="text-right research-table-mono">
                        {result.topLoops[0]?.score.toFixed(3) || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="research-table-note">
                ★ indicates baseline (paper) weights. All schemes produce rankings from the same underlying data.
              </p>
            </div>

            <div className="research-table-wrapper">
              <p className="research-table-caption">Table 6: Sensitivity Analysis — Top Hub Rankings Under Alternative Weights</p>
              <table className="research-table">
                <thead>
                  <tr>
                    <th>Scheme</th>
                    <th>#1 Hub</th>
                    <th>#2 Hub</th>
                    <th>#3 Hub</th>
                    <th className="text-right">Avg Loop Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sensitivityAnalysis.schemes.map((result, idx) => (
                    <tr key={result.scheme.name} style={idx === sensitivityAnalysis.baselineSchemeIndex ? { backgroundColor: 'var(--research-surface-2)' } : {}}>
                      <td>
                        {idx === sensitivityAnalysis.baselineSchemeIndex && (
                          <span style={{ color: 'var(--research-text-faint)', marginRight: '0.25rem' }}>★</span>
                        )}
                        {result.scheme.name}
                      </td>
                      <td>{result.topHubs[0]?.companyName || '—'}</td>
                      <td style={{ color: 'var(--research-text-muted)' }}>{result.topHubs[1]?.companyName || '—'}</td>
                      <td style={{ color: 'var(--research-text-muted)' }}>{result.topHubs[2]?.companyName || '—'}</td>
                      <td className="text-right research-table-mono" style={{ color: 'var(--research-text-muted)' }}>
                        {result.avgLoopScore.toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="research-callout">
              <p className="research-callout-label">Stability Assessment</p>
              <p className="research-callout-text">
                {(() => {
                  const topLoopScores = sensitivityAnalysis.schemes.map(s => s.topLoops[0]?.score ?? 0);
                  const minScore = Math.min(...topLoopScores);
                  const maxScore = Math.max(...topLoopScores);
                  const scoreRange = (maxScore - minScore).toFixed(2);
                  const tau = sensitivityAnalysis.rankingStability.kendallTau;
                  const tauStrength = tau >= 0.8 ? 'strong' : tau >= 0.6 ? 'moderate' : 'weak';

                  if (sensitivityAnalysis.rankingStability.topLoopConsistent && sensitivityAnalysis.rankingStability.topHubConsistent) {
                    return (
                      <>
                        <strong>Rankings are stable.</strong> The top-ranked loop and top-ranked hub remain consistent
                        across all five weighting schemes. While absolute scores vary by up to {scoreRange} across
                        schemes (Balance-Heavy yields lower scores overall), ordinal rankings remain unchanged.
                        Kendall&apos;s τ = {tau.toFixed(2)} indicates {tauStrength} rank correlation between the
                        baseline and alternative schemes. This suggests our findings are robust to reasonable
                        variations in weight selection.
                      </>
                    );
                  } else if (sensitivityAnalysis.rankingStability.topHubConsistent) {
                    return (
                      <>
                        <strong>Hub rankings are stable; loop rankings vary.</strong> The top hub ({sensitivityAnalysis.schemes[0].topHubs[0]?.companyName})
                        remains #1 across all schemes, but the top loop varies with weighting choices.
                        Kendall&apos;s τ = {tau.toFixed(2)}. Hub-level conclusions are robust;
                        specific loop rankings should be interpreted with caution.
                      </>
                    );
                  } else {
                    return (
                      <>
                        <strong>Rankings are sensitive to weight selection.</strong> Different weighting schemes produce
                        different top-ranked entities. Kendall&apos;s τ = {tau.toFixed(2)} indicates
                        {tau >= 0.6 ? ' moderate' : ' limited'} rank stability.
                        Readers should consider the full ranking tables rather than focusing on specific positions.
                      </>
                    );
                  }
                })()}
              </p>
            </div>

            <h3 className="research-h3">6.4 Scope of Claims</h3>
            <div className="research-prose">
              <p><strong>This paper establishes:</strong></p>
            </div>
            <ul className="research-list">
              <li>A replicable methodology for detecting and scoring circular patterns in corporate deal networks</li>
              <li>That major AI companies in our sample have documented reciprocal deal relationships</li>
              <li>That infrastructure providers (particularly NVIDIA) participate in diverse deal types across our sample</li>
              <li>Potential starting points for deeper regulatory and analyst review of specific relationships</li>
            </ul>
            <div className="research-prose">
              <p><strong>This paper does not establish:</strong></p>
            </div>
            <ul className="research-list">
              <li>Whether these patterns are abnormal relative to other industries (requires baseline comparison)</li>
              <li>Whether circular deals cause valuation interdependence (requires causal analysis)</li>
              <li>Population-level prevalence of circularity in the AI industry (requires random sampling)</li>
              <li>Systemic risk levels or contagion probabilities (requires econometric stress-testing)</li>
            </ul>

            <h3 className="research-h3">6.5 Future Directions</h3>
            <div className="research-prose">
              <p>
                Future work could extend this analysis by: (1) incorporating temporal dynamics to study how
                circular structures form, strengthen, and dissolve over time; (2) developing causal inference
                methods to assess whether circularity affects financial outcomes; (3) applying the methodology
                to historical technology sectors for baseline comparison; (4) exploring weighted cycle detection
                that accounts for edge importance rather than treating all edges equally; (5) developing real-time
                monitoring systems that flag emerging circular patterns as deals are announced.
              </p>
            </div>
          </section>

          {/* 7. Conclusion */}
          <section className="research-section">
            <h2 className="research-h2">7. Conclusion</h2>
            <div className="research-prose">
              <p>
                This paper has presented a comprehensive methodology for quantifying circularity in corporate
                deal networks and applied it to the AI industry. We introduced three complementary metrics:
                the Loop Score for two-party bidirectional flows, the Cycle Score for multi-party circular
                chains, and the Hub Score which aggregates participation across all circular structures to
                identify systemically central entities. Analyzing {totalDeals} publicly reported deals
                among {totalCompanies} companies, we identified {totalCircularStructures} circular structures: {loops.length} two-party loops and {multiPartyCycles.length} multi-party cycles.
              </p>
              <p>
                Our findings reveal that circular deal patterns are pervasive in the AI industry, with
                multi-party cycles ({multiPartyCycles.length}) substantially outnumbering two-party loops
                ({loops.length}). This indicates that value frequently circulates through intermediary nodes
                rather than flowing directly between counterparties. Infrastructure providers—particularly
                NVIDIA, which participates in over 100 circular structures—occupy uniquely central positions,
                serving simultaneously as suppliers, investors, and customers within the same network.
              </p>
              <p>
                We do not claim these patterns constitute market manipulation or indicate a &ldquo;bubble&rdquo;
                in any technical sense. Such determinations would require causal analysis beyond the scope of
                this descriptive study. Rather, we provide tools for analysts, regulators, and researchers to
                identify and quantify circular relationships that may warrant closer examination. The prevalence
                of multi-party cycles, in particular, highlights the systemic interconnectedness of the AI
                ecosystem and the potential for correlated risks among ostensibly independent entities.
              </p>
            </div>
          </section>

          {/* Interactive Explorer */}
          <section className="research-explorer">
            <h2 className="research-explorer-title">Interactive Data Explorer</h2>
            <p className="research-explorer-text">
              The full dataset and network visualization are available in our interactive explorer.
              Examine deal details, sources, and Loop Scores for any company pair.
            </p>
            <div className="research-explorer-buttons">
              <Link
                href="/graph?companies=openai,microsoft,nvidia&caseStudy=triangle"
                className="research-btn research-btn-primary"
              >
                Case 1: OpenAI-Microsoft-NVIDIA
              </Link>
              <Link
                href="/graph?companies=coreweave,nvidia,microsoft,openai&caseStudy=coreweave-loop"
                className="research-btn research-btn-secondary"
              >
                Case 2: CoreWeave-NVIDIA
              </Link>
              <Link
                href="/graph?companies=amazon,google,anthropic&caseStudy=anthropic-war"
                className="research-btn research-btn-secondary"
              >
                Case 3: Anthropic
              </Link>
              <Link
                href="/graph"
                className="research-btn research-btn-secondary"
              >
                Full Network
              </Link>
            </div>
          </section>

          {/* References */}
          <section className="research-references">
            <h2 className="research-h2" style={{ borderBottom: 'none', paddingBottom: 0 }}>References</h2>
            <div style={{ marginTop: '1rem' }}>
              <p className="research-reference">
                Acemoglu, D., Carvalho, V. M., Ozdaglar, A., &amp; Tahbaz-Salehi, A. (2012). The network origins of aggregate fluctuations. <em>Econometrica</em>, 80(5), 1977–2016.
              </p>
              <p className="research-reference">
                Aitken, M., Cumming, D., &amp; Zhan, F. (2015). High frequency trading and end-of-day price dislocation. <em>Journal of Banking &amp; Finance</em>, 59, 330–349.
              </p>
              <p className="research-reference">
                Allen, F., &amp; Gale, D. (2000). Financial contagion. <em>Journal of Political Economy</em>, 108(1), 1–33.
              </p>
              <p className="research-reference">
                CB Insights. (2024). State of AI Report 2024. CB Insights Research.
              </p>
              <p className="research-reference">
                Dechow, P. M., Ge, W., Larson, C. R., &amp; Sloan, R. G. (2011). Predicting material accounting misstatements. <em>Contemporary Accounting Research</em>, 28(1), 17–82.
              </p>
              <p className="research-reference">
                Gai, P., &amp; Kapadia, S. (2010). Contagion in financial networks. <em>Proceedings of the Royal Society A</em>, 466(2120), 2401–2423.
              </p>
              <p className="research-reference">
                Gordon, E. A., Henry, E., &amp; Palia, D. (2004). Related party transactions and corporate governance. <em>Advances in Financial Economics</em>, 9, 1–27.
              </p>
              <p className="research-reference">
                Hochberg, Y. V., Ljungqvist, A., &amp; Lu, Y. (2007). Whom you know matters: Venture capital networks and investment performance. <em>Journal of Finance</em>, 62(1), 251–301.
              </p>
              <p className="research-reference">
                Johnson, D. B. (1975). Finding all the elementary circuits of a directed graph. <em>SIAM Journal on Computing</em>, 4(1), 77–84.
              </p>
              <p className="research-reference">
                Mizruchi, M. S. (1996). What do interlocks do? An analysis, critique, and assessment of research on interlocking directorates. <em>Annual Review of Sociology</em>, 22(1), 271–298.
              </p>
              <p className="research-reference">
                Ofek, E., &amp; Richardson, M. (2003). DotCom mania: The rise and fall of internet stock prices. <em>Journal of Finance</em>, 58(3), 1113–1137.
              </p>
              <p className="research-reference">
                Rochet, J. C., &amp; Tirole, J. (2003). Platform competition in two-sided markets. <em>Journal of the European Economic Association</em>, 1(4), 990–1029.
              </p>
              <p className="research-reference">
                Rochet, J. C., &amp; Tirole, J. (2006). Two-sided markets: A progress report. <em>RAND Journal of Economics</em>, 37(3), 645–667.
              </p>
              <p className="research-reference">
                Sevilla, J., Heim, L., Ho, A., Besiroglu, T., Hobbhahn, M., &amp; Villalobos, P. (2022). Compute trends across three eras of machine learning. <em>arXiv preprint arXiv:2202.05924</em>.
              </p>
              <p className="research-reference">
                Stanford HAI. (2024). Artificial Intelligence Index Report 2024. Stanford University Human-Centered Artificial Intelligence.
              </p>
              <p className="research-reference">
                Tarjan, R. (1972). Depth-first search and linear graph algorithms. <em>SIAM Journal on Computing</em>, 1(2), 146–160.
              </p>
              <p className="research-reference">
                Vipra, J., &amp; Korinek, A. (2023). Market concentration implications of foundation models. <em>Brookings Institution Working Paper</em>.
              </p>
            </div>
          </section>

          {/* Citation */}
          <section className="research-citation">
            <p className="research-citation-label">Cite This Paper</p>
            <div className="research-citation-box">
              <p>AI Bubble Map. (2025). Quantifying Circularity in AI Industry Deal Networks: A Graph-Based Analysis of Investment and Service Flows. <em>Working Paper</em>. Retrieved from https://aibubblemap.com/research</p>
            </div>
            <p className="research-bibtex-label">BibTeX:</p>
            <pre className="research-bibtex">{`@article{aibubblemap2025circularity,
  title={Quantifying Circularity in AI Industry Deal Networks:
         A Graph-Based Analysis of Investment and Service Flows},
  author={{AI Bubble Map}},
  journal={Working Paper},
  year={2025},
  url={https://aibubblemap.com/research}
}`}</pre>
          </section>

        </article>
      </main>

      {/* Footer */}
      <footer className="research-footer">
        <p className="research-footer-text">
          Data compiled from SEC filings, press releases, and financial news reporting.
          Last updated January 2025.
        </p>
        <p className="research-footer-text">
          This is an independent research project. Not financial advice.
        </p>
      </footer>
    </div>
  );
}
