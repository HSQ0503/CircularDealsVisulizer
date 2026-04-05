import { getResearchData } from '@/lib/graph/getResearchData';

export async function SensitivityLoopTable() {
  const { sensitivityAnalysis } = await getResearchData();

  return (
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
  );
}

export async function SensitivityHubTable() {
  const { sensitivityAnalysis } = await getResearchData();

  return (
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
  );
}

export async function StabilityCallout() {
  const { sensitivityAnalysis } = await getResearchData();

  const topLoopScores = sensitivityAnalysis.schemes.map(s => s.topLoops[0]?.score ?? 0);
  const minScore = Math.min(...topLoopScores);
  const maxScore = Math.max(...topLoopScores);
  const scoreRange = (maxScore - minScore).toFixed(2);
  const tau = sensitivityAnalysis.rankingStability.kendallTau;
  const tauStrength = tau >= 0.8 ? 'strong' : tau >= 0.6 ? 'moderate' : 'weak';

  let content: React.ReactNode;

  if (sensitivityAnalysis.rankingStability.topLoopConsistent && sensitivityAnalysis.rankingStability.topHubConsistent) {
    content = (
      <>
        <strong>Rankings are stable.</strong> The top-ranked loop and top-ranked hub remain consistent
        across all five weighting schemes. While absolute scores vary by up to {scoreRange} across
        schemes (Balance-Heavy yields lower scores overall), ordinal rankings remain unchanged.
        Kendall&apos;s τ = {tau.toFixed(2)} indicates {tauStrength} rank correlation between the
        baseline and alternative schemes. This suggests the findings are robust to reasonable
        variations in weight selection.
      </>
    );
  } else if (sensitivityAnalysis.rankingStability.topHubConsistent) {
    content = (
      <>
        <strong>Hub rankings are stable; loop rankings vary.</strong> The top hub ({sensitivityAnalysis.schemes[0].topHubs[0]?.companyName})
        remains #1 across all schemes, but the top loop varies with weighting choices.
        Kendall&apos;s τ = {tau.toFixed(2)}. Hub-level conclusions are robust;
        specific loop rankings should be interpreted with caution.
      </>
    );
  } else {
    content = (
      <>
        <strong>Rankings are sensitive to weight selection.</strong> Different weighting schemes produce
        different top-ranked entities. Kendall&apos;s τ = {tau.toFixed(2)} indicates
        {tau >= 0.6 ? ' moderate' : ' limited'} rank stability.
        Readers should consider the full ranking tables rather than focusing on specific positions.
      </>
    );
  }

  return (
    <div className="research-callout">
      <p className="research-callout-label">Stability Assessment</p>
      <p className="research-callout-text">{content}</p>
    </div>
  );
}
