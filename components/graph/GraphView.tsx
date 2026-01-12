'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { forceCollide } from 'd3-force';
import type { NodeDTO, EdgeDTO } from '@/lib/graph/types';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-text-muted">Loading graph...</div>
    </div>
  ),
});

interface GraphViewProps {
  nodes: NodeDTO[];
  edges: EdgeDTO[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onNodeClick: (node: NodeDTO) => void;
  onEdgeClick: (edge: EdgeDTO) => void;
  onBackgroundClick: () => void;
}

interface GraphNode {
  id: string;
  name: string;
  slug: string;
  val: number;
  color: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface GraphLink {
  id: string;
  source: string;
  target: string;
  edgeData: EdgeDTO;
  color: string;
  width: number;
  curvature: number;
}

const flowColors: Record<string, string> = {
  MONEY: '#4ADE80',
  COMPUTE_HARDWARE: '#F472B6',
  SERVICE: '#60A5FA',
  EQUITY: '#A78BFA',
};

const nodeColors: Record<string, string> = {
  openai: '#10B981',
  microsoft: '#3B82F6',
  nvidia: '#84CC16',
};

export function GraphView({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  onNodeClick,
  onEdgeClick,
  onBackgroundClick,
}: GraphViewProps) {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Prepare graph data with initial positions spread out
  const positions: Record<string, { x: number; y: number }> = {
    openai: { x: 0, y: -150 },      // Top
    microsoft: { x: -150, y: 100 }, // Bottom left
    nvidia: { x: 150, y: 100 },     // Bottom right
  };

  const graphNodes: GraphNode[] = nodes.map(node => ({
    id: node.id,
    name: node.name,
    slug: node.slug,
    val: 30,
    color: nodeColors[node.slug] || '#4C8DFF',
    // Set initial positions
    fx: undefined, // Don't fix position, just initial
    fy: undefined,
    x: positions[node.slug]?.x || 0,
    y: positions[node.slug]?.y || 0,
  }));

  // Handle multiple edges between same nodes with curvature
  const edgePairs = new Map<string, number>();
  const graphLinks: GraphLink[] = edges.map(edge => {
    const pairKey = [edge.from, edge.to].sort().join('-');
    const count = edgePairs.get(pairKey) || 0;
    edgePairs.set(pairKey, count + 1);
    
    // Alternate curvature direction for multiple edges
    const curvature = count === 0 ? 0.2 : count % 2 === 0 ? 0.3 : -0.3;

    return {
      id: edge.id,
      source: edge.from,
      target: edge.to,
      edgeData: edge,
      color: flowColors[edge.flowType] || '#4C8DFF',
      width: edge.totalAmountUSD ? Math.min(Math.log10(edge.totalAmountUSD / 1e9) + 3, 8) : 3,
      curvature,
    };
  });

  const graphData = { nodes: graphNodes, links: graphLinks };

  // Node canvas rendering
  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isSelected = node.id === selectedNodeId;
    const label = node.name;
    const fontSize = 14 / globalScale;
    const nodeRadius = 35;

    // Node circle
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeRadius, 0, 2 * Math.PI);
    
    if (isSelected) {
      ctx.fillStyle = node.color;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3 / globalScale;
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = node.color;
      ctx.fill();
    }

    // Glow effect for selected
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, nodeRadius + 8, 0, 2 * Math.PI);
      ctx.strokeStyle = node.color + '40';
      ctx.lineWidth = 6 / globalScale;
      ctx.stroke();
    }

    // Label
    ctx.font = `${isSelected ? 'bold' : 'normal'} ${fontSize}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#E6EDF3';
    ctx.fillText(label, node.x || 0, (node.y || 0) + nodeRadius + fontSize + 4);
  }, [selectedNodeId]);

  // Link rendering
  const paintLink = useCallback((link: GraphLink, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isSelected = link.id === selectedEdgeId;
    
    ctx.strokeStyle = isSelected ? '#fff' : link.color;
    ctx.lineWidth = (isSelected ? link.width + 2 : link.width) / globalScale;
    ctx.globalAlpha = isSelected ? 1 : 0.7;

    // Draw arrow
    const source = link.source as unknown as { x: number; y: number };
    const target = link.target as unknown as { x: number; y: number };
    
    if (source?.x !== undefined && target?.x !== undefined) {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const angle = Math.atan2(dy, dx);
      
      // Arrow at target
      const arrowLength = 12 / globalScale;
      const arrowX = target.x - Math.cos(angle) * 40; // Offset from node
      const arrowY = target.y - Math.sin(angle) * 40;
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
        arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
        arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  }, [selectedEdgeId]);

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    const originalNode = nodes.find(n => n.id === node.id);
    if (originalNode) {
      onNodeClick(originalNode);
    }
  }, [nodes, onNodeClick]);

  // Handle link click
  const handleLinkClick = useCallback((link: GraphLink) => {
    onEdgeClick(link.edgeData);
  }, [onEdgeClick]);

  // Handle background click
  const handleBackgroundClick = useCallback(() => {
    onBackgroundClick();
  }, [onBackgroundClick]);

  // Configure forces on mount
  useEffect(() => {
    const fg = graphRef.current;
    if (!fg) return;
    
    // Wait for graph to initialize
    const timer = setTimeout(() => {
      // Very strong repulsion to push nodes apart
      fg.d3Force('charge')?.strength(-3000);
      
      // Long link distance
      fg.d3Force('link')?.distance(300);
      
      // Collision detection with large radius
      fg.d3Force('collision', forceCollide().radius(80));
      
      // Weak center force
      fg.d3Force('center')?.strength(0.02);
      
      // Reheat
      fg.d3ReheatSimulation();
      
      // Zoom to fit after settling
      setTimeout(() => fg.zoomToFit(500, 100), 2000);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full graph-container">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="transparent"
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, 40, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkColor={(link: GraphLink) => link.color}
        linkWidth={(link: GraphLink) => link.width}
        linkCurvature={(link: GraphLink) => link.curvature}
        linkDirectionalArrowLength={12}
        linkDirectionalArrowRelPos={0.75}
        linkDirectionalArrowColor={(link: GraphLink) => link.color}
        onNodeClick={handleNodeClick}
        onLinkClick={handleLinkClick}
        onBackgroundClick={handleBackgroundClick}
        cooldownTicks={200}
        d3VelocityDecay={0.2}
        d3AlphaDecay={0.01}
        d3AlphaMin={0.001}
        dagMode={undefined}
        dagLevelDistance={150}
        onEngineStop={() => graphRef.current?.zoomToFit(400, 80)}
        minZoom={0.5}
        maxZoom={4}
        nodeRelSize={8}
        linkLineDash={(link: GraphLink) => selectedEdgeId === link.id ? [] : []}
      />
    </div>
  );
}
