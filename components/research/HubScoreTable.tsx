import { getResearchData } from '@/lib/graph/getResearchData';
import { getScoreClass } from './utils';

export async function HubScoreTable() {
  const { hubScores } = await getResearchData();
  const filtered = hubScores.filter(hs => hs.loopCount > 0);

  if (filtered.length === 0) return null;

  return (
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
          {filtered.slice(0, 10).map((hs, idx) => (
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
      {filtered.length > 10 && (
        <p className="research-table-note">
          Showing top 10 of {filtered.length} companies with loop participation.
        </p>
      )}
    </div>
  );
}

export async function TopHubProse() {
  const { hubScores } = await getResearchData();

  if (hubScores.length > 0 && hubScores[0].loopCount > 0) {
    return (
      <p>
        {hubScores[0].companyName} achieves the highest Hub Score ({hubScores[0].hubScore.toFixed(2)}),
        reflecting participation in {hubScores[0].loopCount} circular flows. This positions {hubScores[0].companyName} as the
        most systemically central entity in the AI deal network.
      </p>
    );
  }

  return <p>NVIDIA occupies a unique structural position in the network.</p>;
}
