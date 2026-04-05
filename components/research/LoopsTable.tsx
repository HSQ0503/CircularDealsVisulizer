import { getResearchData } from '@/lib/graph/getResearchData';
import { formatUSD, getScoreClass } from './utils';

export async function LoopsTable() {
  const { loops } = await getResearchData();

  if (loops.length === 0) return null;

  return (
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
      <p className="research-table-note">
        Amounts reflect disclosed totals or projected maximums; cloud commitments and staged investments span multiple years and are not annualized.
        {loops.length > 12 && <> Showing top 12 of {loops.length} detected loops. Full dataset available in interactive explorer.</>}
      </p>
    </div>
  );
}
