'use client';

import type { NodeDTO, EdgeDTO, DealDTO, SuperEdgeDTO, LoopDTO, HubScoreDTO, MultiPartyCycleDTO } from '@/lib/graph/types';
import { DealCard } from './DealCard';

interface SidebarProps {
  selectedNode: NodeDTO | null;
  selectedEdge: EdgeDTO | null;
  selectedSuperEdge: SuperEdgeDTO | null;
  edges: EdgeDTO[];
  dealsById: Record<string, DealDTO>;
  nodes: NodeDTO[];
  loops?: LoopDTO[];
  multiPartyCycles?: MultiPartyCycleDTO[];
  hubScores?: HubScoreDTO[];
  onClose: () => void;
}

const flowTypeColors: Record<string, string> = {
  MONEY: 'text-flow-money',
  COMPUTE_HARDWARE: 'text-flow-compute',
  SERVICE: 'text-flow-service',
  EQUITY: 'text-flow-equity',
};

export function Sidebar({ selectedNode, selectedEdge, edges, dealsById, nodes, loops = [], multiPartyCycles = [], hubScores = [], onClose }: SidebarProps) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const hubScoreMap = new Map(hubScores.map(hs => [hs.companyId, hs]));

  // Find if the selected edge is part of a 2-party loop
  const findLoopForEdge = (edge: EdgeDTO): LoopDTO | undefined => {
    return loops.find(loop =>
      (loop.edge1.id === edge.id || loop.edge2.id === edge.id)
    );
  };

  // Find multi-party cycles that include this edge
  const findMultiPartyCyclesForEdge = (edge: EdgeDTO): MultiPartyCycleDTO[] => {
    return multiPartyCycles.filter(cycle =>
      cycle.edges.some(e => e.id === edge.id)
    );
  };

  // Find multi-party cycles that include this node
  const findMultiPartyCyclesForNode = (node: NodeDTO): MultiPartyCycleDTO[] => {
    return multiPartyCycles.filter(cycle =>
      cycle.path.some(p => p.companyId === node.id)
    );
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-text">Select a node or edge</h3>
        <p className="text-sm text-text-muted mt-2">
          Click on a company node to see its connections, or click on an edge to see the underlying deals.
        </p>
      </div>
    );
  }

  // ============================================================================
  // NODE SELECTED
  // ============================================================================

  if (selectedNode) {
    const connectedEdges = edges.filter(
      e => e.from === selectedNode.id || e.to === selectedNode.id
    );

    const outgoingEdges = connectedEdges.filter(e => e.from === selectedNode.id);
    const incomingEdges = connectedEdges.filter(e => e.to === selectedNode.id);
    const hubScore = hubScoreMap.get(selectedNode.id);

    return (
      <div className="h-full flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-border-subtle flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text">{selectedNode.name}</h2>
              {selectedNode.ticker && (
                <span className="badge bg-surface-3 text-text-muted">{selectedNode.ticker}</span>
              )}
            </div>
            {selectedNode.description && (
              <p className="text-sm text-text-muted mt-1">{selectedNode.description}</p>
            )}
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Hub Score */}
          {hubScore && hubScore.loopCount > 0 && (
            <div className="p-4 bg-surface-2 rounded-lg border border-border-subtle">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-semibold text-text">Hub Score</span>
                </div>
                <span className={`font-mono text-xl font-bold ${hubScore.normalizedHubScore >= 0.7 ? 'text-success' : hubScore.normalizedHubScore >= 0.4 ? 'text-warning' : 'text-text-muted'}`}>
                  {hubScore.hubScore.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-text-muted mb-3">
                Measures systemic centrality in circular flows. Higher scores indicate participation in more/stronger loops.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-surface rounded">
                  <p className="text-lg font-semibold text-text">{hubScore.loopCount}</p>
                  <p className="text-xs text-text-faint">Loops</p>
                </div>
                <div className="p-2 bg-surface rounded">
                  <p className="text-lg font-semibold text-text">{hubScore.avgLoopScore.toFixed(2)}</p>
                  <p className="text-xs text-text-faint">Avg Score</p>
                </div>
                <div className="p-2 bg-surface rounded">
                  <p className="text-lg font-semibold text-text">{hubScore.totalCirculation > 0 ? formatUSD(hubScore.totalCirculation) : '—'}</p>
                  <p className="text-xs text-text-faint">Circulation</p>
                </div>
              </div>
            </div>
          )}

          {/* Multi-Party Cycles */}
          {(() => {
            const nodeCycles = findMultiPartyCyclesForNode(selectedNode);
            if (nodeCycles.length === 0) return null;
            return (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Multi-Party Cycles ({nodeCycles.length})
                </h3>
                {nodeCycles.slice(0, 5).map(cycle => (
                  <CycleSummary key={cycle.id} cycle={cycle} />
                ))}
                {nodeCycles.length > 5 && (
                  <p className="text-xs text-text-faint">+{nodeCycles.length - 5} more cycles</p>
                )}
              </div>
            );
          })()}

          {/* Outgoing */}
          {outgoingEdges.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                Outgoing ({outgoingEdges.length})
              </h3>
              {outgoingEdges.map(edge => (
                <EdgeSummary key={edge.id} edge={edge} nodeMap={nodeMap} direction="to" />
              ))}
            </div>
          )}

          {/* Incoming */}
          {incomingEdges.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Incoming ({incomingEdges.length})
              </h3>
              {incomingEdges.map(edge => (
                <EdgeSummary key={edge.id} edge={edge} nodeMap={nodeMap} direction="from" />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // EDGE SELECTED
  // ============================================================================

  if (selectedEdge) {
    const fromNode = nodeMap.get(selectedEdge.from);
    const toNode = nodeMap.get(selectedEdge.to);
    const deals = selectedEdge.dealIds.map(id => dealsById[id]).filter(Boolean);
    const loop = findLoopForEdge(selectedEdge);
    const otherEdge = loop ? (loop.edge1.id === selectedEdge.id ? loop.edge2 : loop.edge1) : null;

    return (
      <div className="h-full flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-border-subtle">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span className="text-text">{fromNode?.name || 'Unknown'}</span>
                <svg className="w-5 h-5 text-text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="text-text">{toNode?.name || 'Unknown'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`badge ${getFlowBadge(selectedEdge.flowType)}`}>
                  {selectedEdge.flowType.replace('_', ' ')}
                </span>
                <span className="badge bg-surface-3 text-text-muted">
                  {selectedEdge.edgeType.replace('_', ' ')}
                </span>
                {selectedEdge.totalAmountUSD && (
                  <span className="badge bg-success/20 text-success">
                    {formatUSD(selectedEdge.totalAmountUSD)}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-sm p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Loop Score indicator */}
          {loop && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm font-medium text-primary">Part of 2-Party Loop</span>
                </div>
                <span className={`font-mono text-lg font-bold ${loop.loopScore >= 0.7 ? 'text-success' : loop.loopScore >= 0.5 ? 'text-warning' : 'text-text-muted'}`}>
                  {loop.loopScore.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Return flow: <span className="text-text">{otherEdge?.flowType.replace('_', ' ')}</span>
                {otherEdge?.totalAmountUSD && (
                  <span className="text-text-faint ml-1">({formatUSD(otherEdge.totalAmountUSD)})</span>
                )}
              </p>
              {loop.totalCirculation > 0 && (
                <p className="text-xs text-text-muted mt-1">
                  Total circulation: <span className="text-text">{formatUSD(loop.totalCirculation)}</span>
                </p>
              )}
            </div>
          )}

          {/* Multi-Party Cycles */}
          {(() => {
            const edgeCycles = findMultiPartyCyclesForEdge(selectedEdge);
            if (edgeCycles.length === 0) return null;
            return (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-warning">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Part of {edgeCycles.length} Multi-Party Cycle{edgeCycles.length > 1 ? 's' : ''}
                </div>
                {edgeCycles.slice(0, 3).map(cycle => (
                  <CycleSummary key={cycle.id} cycle={cycle} compact />
                ))}
              </div>
            );
          })()}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 bg-surface-2 rounded-lg">
              <p className="text-xs text-text-faint uppercase">Deals</p>
              <p className="text-lg font-semibold text-text">{deals.length}</p>
            </div>
            <div className="p-3 bg-surface-2 rounded-lg">
              <p className="text-xs text-text-faint uppercase">Avg Confidence</p>
              <p className="text-lg font-semibold text-text">{selectedEdge.avgConfidence.toFixed(1)}/5</p>
            </div>
          </div>
        </div>

        {/* Deals */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
            Underlying Deals
          </h3>
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface EdgeSummaryProps {
  edge: EdgeDTO;
  nodeMap: Map<string, NodeDTO>;
  direction: 'from' | 'to';
}

function EdgeSummary({ edge, nodeMap, direction }: EdgeSummaryProps) {
  const targetId = direction === 'to' ? edge.to : edge.from;
  const target = nodeMap.get(targetId);
  const flowColor = flowTypeColors[edge.flowType] || 'text-text-muted';

  return (
    <div className="p-3 bg-surface-2 rounded-lg border border-border-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${flowColor}`}>
            {direction === 'to' ? '→' : '←'}
          </span>
          <span className="text-sm font-medium text-text">{target?.name || 'Unknown'}</span>
        </div>
        <span className="text-xs text-text-muted">
          {edge.dealIds.length} deal{edge.dealIds.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-xs ${flowColor}`}>{edge.flowType.replace('_', ' ')}</span>
        {edge.totalAmountUSD && (
          <span className="text-xs text-text-muted">• {formatUSD(edge.totalAmountUSD)}</span>
        )}
      </div>
    </div>
  );
}

interface CycleSummaryProps {
  cycle: MultiPartyCycleDTO;
  compact?: boolean;
}

function CycleSummary({ cycle, compact = false }: CycleSummaryProps) {
  // Build the path string: A → B → C → A
  const pathString = [...cycle.path, cycle.path[0]]
    .map(p => p.companyName)
    .join(' → ');

  if (compact) {
    return (
      <div className="p-2 bg-warning/10 border border-warning/30 rounded text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-text">{cycle.length}-Party Cycle</span>
          <span className="font-mono text-warning">{cycle.cycleScore.toFixed(2)}</span>
        </div>
        <p className="text-text-muted truncate">{pathString}</p>
      </div>
    );
  }

  return (
    <div className="p-3 bg-surface-2 rounded-lg border border-warning/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`badge ${getFlowBadge(cycle.dominantFlowType)}`}>
            {cycle.dominantFlowType.replace('_', ' ')}
          </span>
          <span className="text-xs text-text-muted">{cycle.length} companies</span>
        </div>
        <span className={`font-mono text-sm font-bold ${cycle.cycleScore >= 0.7 ? 'text-success' : cycle.cycleScore >= 0.5 ? 'text-warning' : 'text-text-muted'}`}>
          {cycle.cycleScore.toFixed(2)}
        </span>
      </div>
      <p className="text-sm text-text mb-2">{pathString}</p>
      <div className="flex items-center gap-4 text-xs text-text-muted">
        {cycle.totalValue > 0 && (
          <span>Total: <span className="text-text">{formatUSD(cycle.totalValue)}</span></span>
        )}
        <span>{cycle.dealCount} deals</span>
      </div>
      {cycle.curatedNarrative && (
        <p className="text-xs text-text-muted mt-2 italic">{cycle.curatedNarrative}</p>
      )}
    </div>
  );
}

// ============================================================================
// UTILITIES
// ============================================================================

function getFlowBadge(flowType: string): string {
  const badges: Record<string, string> = {
    MONEY: 'badge-money',
    COMPUTE_HARDWARE: 'badge-compute',
    SERVICE: 'badge-service',
    EQUITY: 'badge-equity',
  };
  return badges[flowType] || 'badge-money';
}

function formatUSD(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(0)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  }
  return `$${amount.toLocaleString()}`;
}
