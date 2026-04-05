import { getResearchData } from '@/lib/graph/getResearchData';
import { formatPValue, getSignificanceStars } from './utils';

export async function NullModelSection() {
  const { nullModel } = await getResearchData();

  if (!nullModel) return null;

  const cyclePValue = nullModel.cycles.significance.totalCycleCount.pValueExact ?? nullModel.cycles.significance.totalCycleCount.pValue;
  const cycleSignificant = cyclePValue < 0.05;
  const loopSignificant = nullModel.loops.significance.loopCount.isSignificant;

  return (
    <>
      <h3 className="research-h3">4.3 Statistical Significance</h3>
      <div className="research-prose">
        <p>
          A crucial question for this analysis is whether the observed circular loops are
          statistically meaningful or are simply caused due to network density. If a random network of companies with
          similar deal volumes produce similar loop counts, the findings would be unremarkable.
          To address this, the paper applies the configuration model (Section 3.7), generating {nullModel.config.iterations} random
          networks that preserve each company&apos;s deal count while randomizing the partners that each company constructs deals with.
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
          Because the dataset is purposefully selected rather than randomly sampled across the AI industry,
          the following z-scores and p-values should be interpreted as comparisons to
          random graph baselines, not as statistics that reflect the broader AI
          industry. A high z-score indicates that the observed patterns deviate from random
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
          Significance: *** p &lt; 0.001, ** p &lt; 0.01, * p &lt; 0.05. Computed via {nullModel.config.iterations} configuration model iterations.
        </p>
      </div>

      <div className="research-prose">
        <p>
          <strong>Interpretation of results:</strong>
        </p>
        <p>
          {loopSignificant ? (
            <>
              <strong>Two-party loops (direct reciprocity):</strong> The observed {nullModel.loops.real.loopCount} bidirectional
              loops is {((nullModel.loops.real.loopCount / nullModel.loops.null.loopCount.mean - 1) * 100).toFixed(1)}% higher than
              random expectation (null mean = {nullModel.loops.null.loopCount.mean.toFixed(1)} ± {nullModel.loops.null.loopCount.std.toFixed(1)}).
              With z = {nullModel.loops.significance.loopCount.zScore.toFixed(2)} and p {formatPValue(nullModel.loops.significance.loopCount.pValue)},
              the observed loop count <strong>is largely different from random expectation</strong>. A result
              this extreme would occur in fewer than {(nullModel.loops.significance.loopCount.pValue * 100).toFixed(1)}% of
              random networks under the null hypothesis. This indicates that these companies form direct
              reciprocal relationships (investor - customer, supplier - client) at rates that exceed what would
              occur in randomly rewired networks with the same degree sequences.
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
          {cycleSignificant ? (
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
              is consistent with random baseline levels (exact p = {cyclePValue.toFixed(2)}). The high variance
              in the cycle null distribution (SD = {nullModel.cycles.null.totalCycleCount.std.toFixed(1)}) reflects
              the combinatorial sensitivity of longer cycles to random edge placement, making statistical
              significance harder to establish for multi-party structures. Longer circular chains are common
              in dense networks and could plausibly arise in randomly rewired networks.
            </>
          )}
        </p>
      </div>

      <div className="research-callout">
        <p className="research-callout-label">Key Finding</p>
        <p className="research-callout-text">
          {loopSignificant && cycleSignificant ? (
            <>
              Both two-party loops and multi-party cycles exceed random baseline levels (p &lt; 0.05).
              These major AI companies exhibit circular deal patterns at rates exceeding random expectation,
              indicating that reciprocal business relationships are a notable
              structural feature among the firms in our sample—not merely an artifact of network density.
            </>
          ) : loopSignificant ? (
            <>
              Direct reciprocity (two-party loops) exceeds random baseline levels, while longer cycles
              do not. These companies form direct reciprocal relationships at rates exceeding random
              expectation, suggesting that tight, bidirectional relationships between pairs of
              companies—investors who become customers, and vice versa—are the most notable structural
              feature among the firms in our sample.
            </>
          ) : (
            <>
              Neither loops nor cycles exceed random baseline levels. The observed circular patterns
              could plausibly arise in randomly rewired networks with similar degree distributions.
            </>
          )}
        </p>
      </div>
    </>
  );
}
