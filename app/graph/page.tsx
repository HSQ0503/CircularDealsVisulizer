'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GraphView } from '@/components/graph/GraphView';
import { Sidebar } from '@/components/graph/Sidebar';
import { GraphFilters } from '@/components/graph/GraphFilters';
import { CompanySelector } from '@/components/graph/CompanySelector';
import { getCaseStudyById } from '@/lib/caseStudies';
import type { GraphResponse, NodeDTO, EdgeDTO } from '@/lib/graph/types';
import { FlowType, DealType } from '@prisma/client';

interface Company {
  id: string;
  name: string;
  slug: string;
  ticker: string | null;
  logoUrl: string | null;
}

export default function GraphPage() {
  return (
    <Suspense fallback={<GraphPageLoading />}>
      <GraphPageContent />
    </Suspense>
  );
}

function GraphPageLoading() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg">
      <header className="flex-shrink-0 h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-sm flex items-center px-6">
        <span className="text-lg font-bold text-gradient">AI Bubble Map</span>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    </div>
  );
}

function GraphPageContent() {
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Has user made initial company selection?
  const [hasSelectedCompanies, setHasSelectedCompanies] = useState(false);

  // Available companies for selection screen
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Selection state
  const [selectedNode, setSelectedNode] = useState<NodeDTO | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<EdgeDTO | null>(null);

  // Company selection state
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Filter state
  const [selectedFlowTypes, setSelectedFlowTypes] = useState<FlowType[]>([]);
  const [selectedDealTypes, setSelectedDealTypes] = useState<DealType[]>([]);
  const [minConfidence, setMinConfidence] = useState(1);

  // Show/hide filters panel
  const [showFilters, setShowFilters] = useState(false);

  // Preset positions from case study (for neat geometric layouts)
  const [presetPositions, setPresetPositions] = useState<Record<string, { x: number; y: number }> | undefined>(undefined);

  // Read URL parameters
  const searchParams = useSearchParams();

  // Read companies and case study from URL on mount
  useEffect(() => {
    const companiesParam = searchParams.get('companies');
    const caseStudyParam = searchParams.get('caseStudy');

    if (companiesParam) {
      const companySlugs = companiesParam.split(',').filter(Boolean);
      if (companySlugs.length > 0) {
        setSelectedCompanies(companySlugs);
        setHasSelectedCompanies(true);

        // If a case study is specified, use its preset positions
        if (caseStudyParam) {
          const caseStudy = getCaseStudyById(caseStudyParam);
          if (caseStudy?.nodePositions) {
            setPresetPositions(caseStudy.nodePositions);
          }
        }
      }
    }
  }, [searchParams]);

  // Fetch available companies on mount
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch('/api/companies');
        if (res.ok) {
          const data = await res.json();
          setAvailableCompanies(data);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    }
    fetchCompanies();
  }, []);

  // Fetch graph data
  const fetchGraph = useCallback(async () => {
    if (selectedCompanies.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('companies', selectedCompanies.join(','));

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

  // Only fetch graph after initial selection
  useEffect(() => {
    if (hasSelectedCompanies) {
      fetchGraph();
    }
  }, [fetchGraph, hasSelectedCompanies]);

  // Handle "View Graph" button click
  const handleViewGraph = () => {
    if (selectedCompanies.length === 0) return;
    setHasSelectedCompanies(true);
  };

  // Toggle company selection in selection screen
  const toggleCompany = (slug: string) => {
    if (selectedCompanies.includes(slug)) {
      setSelectedCompanies(selectedCompanies.filter(s => s !== slug));
    } else {
      setSelectedCompanies([...selectedCompanies, slug]);
    }
  };

  // Select all companies
  const selectAllCompanies = () => {
    setSelectedCompanies(availableCompanies.map(c => c.slug));
  };

  // Clear all companies
  const clearAllCompanies = () => {
    setSelectedCompanies([]);
  };

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

  // Company selection screen (shown before graph loads)
  if (!hasSelectedCompanies) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-bg">
        {/* Header */}
        <header className="flex-shrink-0 h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-sm flex items-center justify-between px-6 relative z-20">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-lg font-bold text-gradient">AI Bubble Map</span>
          </Link>
        </header>

        {/* Selection screen */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-text mb-2">Select Companies to Visualize</h1>
                <p className="text-text-muted">
                  Choose which companies you want to see in the graph. You can select multiple companies to explore their interconnected deals.
                </p>
              </div>

              {loadingCompanies ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Quick actions */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-text-muted">
                      {selectedCompanies.length} of {availableCompanies.length} selected
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllCompanies}
                        className="text-sm text-primary hover:text-primary-hover"
                      >
                        Select All
                      </button>
                      <span className="text-text-faint">|</span>
                      <button
                        onClick={clearAllCompanies}
                        className="text-sm text-text-muted hover:text-text"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Company grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableCompanies.map(company => {
                      const isSelected = selectedCompanies.includes(company.slug);
                      return (
                        <button
                          key={company.id}
                          onClick={() => toggleCompany(company.slug)}
                          className={`
                            p-4 rounded-lg border-2 text-left transition-all
                            ${isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-border-subtle hover:bg-surface-2'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                              ${isSelected ? 'bg-primary border-primary' : 'border-border'}
                            `}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-text">{company.name}</div>
                              {company.ticker && (
                                <div className="text-xs text-text-faint">{company.ticker}</div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Fixed footer with View Graph button */}
          {!loadingCompanies && (
            <div className="flex-shrink-0 border-t border-border-subtle bg-surface/80 backdrop-blur-sm p-4">
              <div className="flex justify-center">
                <button
                  onClick={handleViewGraph}
                  disabled={selectedCompanies.length === 0}
                  className={`
                    btn btn-primary btn-lg px-8
                    ${selectedCompanies.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  View Graph
                  {selectedCompanies.length > 0 && (
                    <span className="ml-2 text-sm opacity-80">
                      ({selectedCompanies.length} companies)
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg">
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-sm flex items-center justify-between px-6 relative z-20">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-lg font-bold text-gradient">AI Bubble Map</span>
          {graphData && (
            <span className="text-xs text-text-faint bg-surface-2 px-2.5 py-1 rounded-full">
              {graphData.nodes.length} companies · {graphData.edges.length} connections
            </span>
          )}
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Back to selection */}
          <button
            onClick={() => setHasSelectedCompanies(false)}
            className="btn btn-ghost btn-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change Companies
          </button>

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
              presetPositions={presetPositions}
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
              selectedSuperEdge={null}
              edges={graphData.edges}
              dealsById={graphData.dealsById}
              nodes={graphData.nodes}
              loops={graphData.loops}
              onClose={handleClearSelection}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
