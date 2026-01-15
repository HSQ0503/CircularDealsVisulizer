'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
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

// Tooltip state interface
interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: {
    flowType: string;
    amount: string;
    from: string;
    to: string;
  } | null;
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

const flowLabels: Record<string, string> = {
  MONEY: 'Money',
  COMPUTE_HARDWARE: 'Compute Hardware',
  SERVICE: 'Service',
  EQUITY: 'Equity',
};

const nodeColors: Record<string, string> = {
  openai: '#10B981',
  microsoft: '#3B82F6',
  nvidia: '#84CC16',
};

// Format currency amount
function formatAmount(amount: number | null): string {
  if (!amount) return 'Undisclosed';
  if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  return `$${amount.toLocaleString()}`;
}

// Color manipulation helpers
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

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
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

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

  // Generate positions dynamically based on number of nodes
  // Arrange nodes in a circle for consistent layout
  const generatePositions = (nodeCount: number): { x: number; y: number }[] => {
    const radius = Math.max(150, nodeCount * 40); // Scale radius with node count
    const positions: { x: number; y: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      // Start from top (-PI/2) and go clockwise
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / nodeCount;
      positions.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    }
    return positions;
  };

  // Known company colors for visual consistency
  const getNodeColor = (slug: string): string => {
    return nodeColors[slug] || generateColor(slug);
  };

  // Generate a consistent color from slug for unknown companies
  const generateColor = (slug: string): string => {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 55%)`;
  };

  const positions = generatePositions(nodes.length);

  const graphNodes: GraphNode[] = nodes.map((node, index) => {
    const pos = positions[index] || { x: 0, y: 0 };
    return {
      id: node.id,
      name: node.name,
      slug: node.slug,
      val: 30,
      color: getNodeColor(node.slug),
      // Fix positions so nodes don't move
      fx: pos.x,
      fy: pos.y,
      x: pos.x,
      y: pos.y,
    };
  });

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
      width: edge.totalAmountUSD ? Math.min(Math.log10(edge.totalAmountUSD / 1e9) + 4, 10) : 4,
      curvature,
    };
  });

  const graphData = { nodes: graphNodes, links: graphLinks };

  // Node canvas rendering with improved design
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node as GraphNode;
    const isSelected = n.id === selectedNodeId;
    const label = n.name;
    const fontSize = 14 / globalScale;
    const nodeRadius = 40;
    const x = n.x || 0;
    const y = n.y || 0;

    // Outer glow (always visible, stronger when selected)
    const glowRadius = nodeRadius + (isSelected ? 20 : 12);
    const glowGradient = ctx.createRadialGradient(x, y, nodeRadius * 0.8, x, y, glowRadius);
    glowGradient.addColorStop(0, n.color + (isSelected ? '60' : '30'));
    glowGradient.addColorStop(1, n.color + '00');
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, 2 * Math.PI);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Main node circle with gradient
    const mainGradient = ctx.createRadialGradient(
      x - nodeRadius * 0.3, y - nodeRadius * 0.3, 0,
      x, y, nodeRadius
    );
    mainGradient.addColorStop(0, lightenColor(n.color, 30));
    mainGradient.addColorStop(0.7, n.color);
    mainGradient.addColorStop(1, darkenColor(n.color, 20));

    ctx.beginPath();
    ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = mainGradient;
    ctx.fill();

    // Inner highlight (top-left shine)
    const highlightGradient = ctx.createRadialGradient(
      x - nodeRadius * 0.4, y - nodeRadius * 0.4, 0,
      x - nodeRadius * 0.2, y - nodeRadius * 0.2, nodeRadius * 0.6
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.beginPath();
    ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = highlightGradient;
    ctx.fill();

    // Border ring
    ctx.beginPath();
    ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = (isSelected ? 3 : 1.5) / globalScale;
    ctx.stroke();

    // Selection ring
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius + 6, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / globalScale;
      ctx.setLineDash([4 / globalScale, 4 / globalScale]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Label with shadow for better readability
    ctx.font = `${isSelected ? '600' : '500'} ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(label, x + 1, y + nodeRadius + fontSize + 6);

    // Main text
    ctx.fillStyle = isSelected ? '#ffffff' : '#E6EDF3';
    ctx.fillText(label, x, y + nodeRadius + fontSize + 5);
  }, [selectedNodeId]);

  // Handle node click
  const handleNodeClick = useCallback((node: any) => {
    const n = node as GraphNode;
    const originalNode = nodes.find(nd => nd.id === n.id);
    if (originalNode) {
      onNodeClick(originalNode);
    }
  }, [nodes, onNodeClick]);

  // Handle link click
  const handleLinkClick = useCallback((link: any) => {
    const l = link as GraphLink;
    onEdgeClick(l.edgeData);
  }, [onEdgeClick]);

  // Handle background click
  const handleBackgroundClick = useCallback(() => {
    onBackgroundClick();
  }, [onBackgroundClick]);

  // Handle link hover
  const handleLinkHover = useCallback((link: any, prevLink: any) => {
    if (link) {
      const l = link as GraphLink;
      setHoveredLinkId(l.id);

      // Get source and target node names
      const sourceNode = nodes.find(n => n.id === l.edgeData.from);
      const targetNode = nodes.find(n => n.id === l.edgeData.to);

      setTooltip({
        visible: true,
        x: 0, // Will be updated by mouse move
        y: 0,
        content: {
          flowType: flowLabels[l.edgeData.flowType] || l.edgeData.flowType,
          amount: formatAmount(l.edgeData.totalAmountUSD),
          from: sourceNode?.name || 'Unknown',
          to: targetNode?.name || 'Unknown',
        },
      });
    } else {
      setHoveredLinkId(null);
      setTooltip(prev => ({ ...prev, visible: false }));
    }
  }, [nodes]);

  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (tooltip.visible && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltip(prev => ({
          ...prev,
          x: e.clientX - rect.left + 15,
          y: e.clientY - rect.top + 15,
        }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [tooltip.visible]);

  // Custom link canvas rendering with hover/selection effects
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const l = link as GraphLink;
    const isHovered = l.id === hoveredLinkId;
    const isSelected = l.id === selectedEdgeId;

    // Get source and target positions
    const source = typeof l.source === 'object' ? l.source : graphNodes.find(n => n.id === l.source);
    const target = typeof l.target === 'object' ? l.target : graphNodes.find(n => n.id === l.target);

    if (!source || !target) return;

    const sx = source.x || 0;
    const sy = source.y || 0;
    const tx = target.x || 0;
    const ty = target.y || 0;

    // Calculate control point for curved link
    const midX = (sx + tx) / 2;
    const midY = (sy + ty) / 2;
    const dx = tx - sx;
    const dy = ty - sy;
    const normalX = -dy * l.curvature;
    const normalY = dx * l.curvature;
    const cpX = midX + normalX;
    const cpY = midY + normalY;

    // Draw glow effect for hovered/selected links
    if (isHovered || isSelected) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cpX, cpY, tx, ty);
      ctx.strokeStyle = l.color;
      ctx.lineWidth = (l.width + 12) / globalScale;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.restore();
    }

    // Draw main link
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(cpX, cpY, tx, ty);
    ctx.strokeStyle = l.color;
    ctx.lineWidth = (isHovered || isSelected ? l.width + 2 : l.width) / globalScale;
    ctx.globalAlpha = isHovered || isSelected ? 1 : 0.8;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw arrow
    const arrowPos = 0.65;
    const t = arrowPos;
    const arrowX = (1-t)*(1-t)*sx + 2*(1-t)*t*cpX + t*t*tx;
    const arrowY = (1-t)*(1-t)*sy + 2*(1-t)*t*cpY + t*t*ty;

    // Calculate arrow direction (tangent at arrow position)
    const tangentX = 2*(1-t)*(cpX-sx) + 2*t*(tx-cpX);
    const tangentY = 2*(1-t)*(cpY-sy) + 2*t*(ty-cpY);
    const angle = Math.atan2(tangentY, tangentX);

    const arrowLength = (isHovered || isSelected ? 28 : 25) / globalScale;
    const arrowWidth = arrowLength * 0.5;

    ctx.save();
    ctx.translate(arrowX, arrowY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowLength, arrowWidth / 2);
    ctx.lineTo(-arrowLength, -arrowWidth / 2);
    ctx.closePath();
    ctx.fillStyle = l.color;
    ctx.fill();
    ctx.restore();
  }, [hoveredLinkId, selectedEdgeId, graphNodes]);

  // Zoom to fit on mount (nodes are fixed, no simulation needed)
  useEffect(() => {
    const fg = graphRef.current;
    if (!fg) return;
    
    // Disable forces since nodes are fixed
    fg.d3Force('charge', null);
    fg.d3Force('center', null);
    fg.d3Force('collision', null);
    
    // Zoom to fit after a short delay
    const timer = setTimeout(() => {
      fg.zoomToFit(400, 100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full graph-container relative">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="transparent"
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, 45, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkCanvasObject={paintLink}
        linkPointerAreaPaint={(link: any, color: string, ctx: CanvasRenderingContext2D) => {
          // Create a much larger clickable area along the curved path
          const l = link as GraphLink;
          const source = typeof l.source === 'object' ? l.source : graphNodes.find(n => n.id === l.source);
          const target = typeof l.target === 'object' ? l.target : graphNodes.find(n => n.id === l.target);

          if (!source || !target) return;

          const sx = source.x || 0;
          const sy = source.y || 0;
          const tx = target.x || 0;
          const ty = target.y || 0;

          // Calculate control point for curved link
          const midX = (sx + tx) / 2;
          const midY = (sy + ty) / 2;
          const dx = tx - sx;
          const dy = ty - sy;
          const normalX = -dy * l.curvature;
          const normalY = dx * l.curvature;
          const cpX = midX + normalX;
          const cpY = midY + normalY;

          // Draw a thick invisible line for pointer detection
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(cpX, cpY, tx, ty);
          ctx.strokeStyle = color;
          ctx.lineWidth = 20; // Much larger hit area
          ctx.stroke();
        }}
        linkCurvature={(link: any) => (link as GraphLink).curvature}
        onNodeClick={handleNodeClick}
        onLinkClick={handleLinkClick}
        onLinkHover={handleLinkHover}
        onBackgroundClick={handleBackgroundClick}
        cooldownTicks={0}
        d3VelocityDecay={1}
        d3AlphaDecay={1}
        warmupTicks={0}
        minZoom={0.3}
        maxZoom={4}
        nodeRelSize={8}
        enableNodeDrag={false}
      />

      {/* Tooltip */}
      {tooltip.visible && tooltip.content && (
        <div
          className="absolute pointer-events-none z-50 bg-bg-secondary/95 backdrop-blur-sm border border-border-default rounded-lg px-3 py-2 shadow-xl"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: tooltip.x > dimensions.width - 200 ? 'translateX(-110%)' : 'none',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: flowColors[Object.keys(flowLabels).find(k => flowLabels[k] === tooltip.content!.flowType) || ''] }}
            />
            <span className="text-sm font-medium text-text-primary">{tooltip.content.flowType}</span>
          </div>
          <div className="text-xs text-text-muted">
            {tooltip.content.from} → {tooltip.content.to}
          </div>
          <div className="text-sm font-semibold text-text-primary mt-1">
            {tooltip.content.amount}
          </div>
        </div>
      )}
    </div>
  );
}
