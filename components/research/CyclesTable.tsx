import { getResearchData } from '@/lib/graph/getResearchData';
import { formatUSD, getScoreClass } from './utils';

export async function CyclesTable() {
  const { multiPartyCycles, graphData } = await getResearchData();

  if (multiPartyCycles.length === 0) return null;

  const nodeNameMap = new Map(graphData.nodes.map(n => [n.id, n.name]));

  return (
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
          {multiPartyCycles.slice(0, 10).map((cycle, idx) => (
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
          ))}
        </tbody>
      </table>
      {multiPartyCycles.length > 10 && (
        <p className="research-table-note">
          Showing top 10 of {multiPartyCycles.length} detected multi-party cycles.
        </p>
      )}
    </div>
  );
}
