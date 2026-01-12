'use client';

import type { NodeDTO, EdgeDTO, DealDTO } from '@/lib/graph/types';
import { DealCard } from './DealCard';

interface SidebarProps {
  selectedNode: NodeDTO | null;
  selectedEdge: EdgeDTO | null;
  edges: EdgeDTO[];
  dealsById: Record<string, DealDTO>;
  nodes: NodeDTO[];
  onClose: () => void;
}

const flowTypeColors: Record<string, string> = {
  MONEY: 'text-flow-money',
  COMPUTE_HARDWARE: 'text-flow-compute',
  SERVICE: 'text-flow-service',
  EQUITY: 'text-flow-equity',
};

export function Sidebar({ selectedNode, selectedEdge, edges, dealsById, nodes, onClose }: SidebarProps) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

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
