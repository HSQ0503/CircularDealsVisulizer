'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { GraphView } from '@/components/graph/GraphView';
import { Sidebar } from '@/components/graph/Sidebar';
import { GraphFilters } from '@/components/graph/GraphFilters';
import { CompanySelector } from '@/components/graph/CompanySelector';
import type { GraphResponse, NodeDTO, EdgeDTO } from '@/lib/graph/types';
import { FlowType, DealType } from '@prisma/client';

export default function GraphPage() {
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection state
  const [selectedNode, setSelectedNode] = useState<NodeDTO | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<EdgeDTO | null>(null);

  // Company selection state (empty = all companies)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Filter state
  const [selectedFlowTypes, setSelectedFlowTypes] = useState<FlowType[]>([]);
  const [selectedDealTypes, setSelectedDealTypes] = useState<DealType[]>([]);
  const [minConfidence, setMinConfidence] = useState(1);

  // Show/hide filters panel
  const [showFilters, setShowFilters] = useState(false);

  // Fetch graph data
  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Companies filter
      if (selectedCompanies.length > 0) {
        params.set('companies', selectedCompanies.join(','));
      } else {
        params.set('companies', 'all');
      }

      if (selectedFlowTypes.length > 0) {
        params.set('flowTypes', selectedFlowTypes.join(','));
      }
      if (selectedDealTypes.length > 0) {
        params.set('dealTypes', selectedDealTypes.join(','));
      }
      if (minConfidence > 1) {
        params.set('minConfidence', minConfidence.toString());
      }

      const res = await fetch(`/api/graph?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch graph data');

      const data: GraphResponse = await res.json();
      setGraphData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [selectedCompanies, selectedFlowTypes, selectedDealTypes, minConfidence]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  // Handlers
  const handleNodeClick = (node: NodeDTO) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };

  const handleEdgeClick = (edge: EdgeDTO) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  };

  const handleClearSelection = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  // Sidebar open state
  const sidebarOpen = selectedNode !== null || selectedEdge !== null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg">
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-sm flex items-center justify-between px-6 relative z-20">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-lg font-bold text-gradient">AI Circular Deals</span>
          {graphData && (
            <span className="text-xs text-text-faint bg-surface-2 px-2.5 py-1 rounded-full">
              {graphData.nodes.length} companies · {graphData.edges.length} connections
            </span>
          )}
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Company selector */}
          <CompanySelector
            selectedSlugs={selectedCompanies}
            onChange={setSelectedCompanies}
          />

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-ghost btn-sm ${showFilters ? 'bg-surface-2' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {(selectedFlowTypes.length > 0 || selectedDealTypes.length > 0 || minConfidence > 1) && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-surface-2 rounded-md">
            <span className="text-xs text-text-faint">Flow:</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-flow-money" />
              <span className="text-xs text-text-muted">Money</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-flow-compute" />
              <span className="text-xs text-text-muted">Compute</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-flow-service" />
              <span className="text-xs text-text-muted">Service</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Filters panel */}
        {showFilters && (
          <div className="absolute top-4 left-4 z-10 w-72 animate-fade-in">
            <GraphFilters
              selectedFlowTypes={selectedFlowTypes}
              selectedDealTypes={selectedDealTypes}
              minConfidence={minConfidence}
              onFlowTypesChange={setSelectedFlowTypes}
              onDealTypesChange={setSelectedDealTypes}
              onConfidenceChange={setMinConfidence}
            />
          </div>
        )}

        {/* Graph */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-96' : ''}`}>
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-text-muted">Loading graph...</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="card p-6 text-center max-w-sm">
                <p className="text-danger mb-4">{error}</p>
                <button onClick={fetchGraph} className="btn btn-primary">
                  Retry
                </button>
              </div>
            </div>
          ) : graphData ? (
            <GraphView
              nodes={graphData.nodes}
              edges={graphData.edges}
              selectedNodeId={selectedNode?.id || null}
              selectedEdgeId={selectedEdge?.id || null}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              onBackgroundClick={handleClearSelection}
            />
          ) : null}
        </div>

        {/* Sidebar */}
        <aside 
          className={`
            absolute right-0 top-0 bottom-0 w-96 bg-surface border-l border-border-subtle
            transition-transform duration-300 overflow-hidden
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {graphData && (
            <Sidebar
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
              edges={graphData.edges}
              dealsById={graphData.dealsById}
              nodes={graphData.nodes}
              onClose={handleClearSelection}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
