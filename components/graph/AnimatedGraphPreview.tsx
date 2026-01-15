'use client';

// Animated preview of the OpenAI/Microsoft/NVIDIA circular deal triangle
// Used on the homepage to demonstrate the visualization concept

export function AnimatedGraphPreview() {
  // Node positions (triangle arrangement)
  const nodes = [
    { id: 'openai', name: 'OpenAI', x: 200, y: 60, color: '#10B981' },
    { id: 'microsoft', name: 'Microsoft', x: 340, y: 280, color: '#3B82F6' },
    { id: 'nvidia', name: 'NVIDIA', x: 60, y: 280, color: '#84CC16' },
  ];

  // Edges with flow types (curved paths between nodes)
  const edges = [
    { from: 0, to: 1, color: '#4ADE80', label: 'Investment' }, // OpenAI -> Microsoft (money)
    { from: 1, to: 2, color: '#60A5FA', label: 'Azure' }, // Microsoft -> NVIDIA (service)
    { from: 2, to: 0, color: '#F472B6', label: 'GPUs' }, // NVIDIA -> OpenAI (compute)
  ];

  // Generate curved path between two points
  const getCurvedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    // Control point offset perpendicular to the line
    const dx = x2 - x1;
    const dy = y2 - y1;
    const curvature = 0.2;
    const cpX = midX - dy * curvature;
    const cpY = midY + dx * curvature;
    return `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`;
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 400 360"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 0 20px rgba(76, 141, 255, 0.2))' }}
      >
        <defs>
          {/* Glow filters for nodes */}
          {nodes.map((node) => (
            <filter key={`glow-${node.id}`} id={`glow-${node.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood floodColor={node.color} floodOpacity="0.6" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}

          {/* Gradient definitions for edges */}
          {edges.map((edge, i) => (
            <linearGradient key={`grad-${i}`} id={`edge-gradient-${i}`}>
              <stop offset="0%" stopColor={edge.color} stopOpacity="0.3" />
              <stop offset="50%" stopColor={edge.color} stopOpacity="1" />
              <stop offset="100%" stopColor={edge.color} stopOpacity="0.3" />
            </linearGradient>
          ))}
        </defs>

        {/* Draw edges (curved paths) */}
        {edges.map((edge, i) => {
          const from = nodes[edge.from];
          const to = nodes[edge.to];
          const pathD = getCurvedPath(from.x, from.y, to.x, to.y);
          const pathId = `path-${i}`;

          return (
            <g key={i}>
              {/* Base path (subtle) */}
              <path
                d={pathD}
                fill="none"
                stroke={edge.color}
                strokeWidth="2"
                strokeOpacity="0.3"
              />

              {/* Define path for particle animation */}
              <path id={pathId} d={pathD} fill="none" stroke="none" />

              {/* Animated particles along the path */}
              {[0, 1, 2].map((particleIdx) => (
                <circle
                  key={particleIdx}
                  r="4"
                  fill={edge.color}
                  className="flow-particle"
                  style={{
                    offsetPath: `path('${pathD}')`,
                    animationDelay: `${particleIdx * 1.2}s`,
                  }}
                >
                  {/* Glow effect */}
                  <animate
                    attributeName="r"
                    values="3;5;3"
                    dur="1.5s"
                    repeatCount="indefinite"
                    begin={`${particleIdx * 0.5}s`}
                  />
                </circle>
              ))}

              {/* Arrow at midpoint */}
              <ArrowMarker
                pathD={pathD}
                color={edge.color}
                offset={0.6}
              />
            </g>
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node) => (
          <g key={node.id} filter={`url(#glow-${node.id})`}>
            {/* Outer glow ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r="32"
              fill={node.color}
              fillOpacity="0.15"
              className="node-pulse"
            />
            {/* Main node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r="24"
              fill={node.color}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            {/* Inner highlight */}
            <circle
              cx={node.x - 6}
              cy={node.y - 6}
              r="8"
              fill="rgba(255,255,255,0.25)"
            />
            {/* Node label */}
            <text
              x={node.x}
              y={node.y + 50}
              textAnchor="middle"
              fill="#E6EDF3"
              fontSize="13"
              fontWeight="500"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Arrow marker component positioned along a path
function ArrowMarker({ pathD, color, offset }: { pathD: string; color: string; offset: number }) {
  // Calculate position and angle at offset along quadratic bezier
  const match = pathD.match(/M ([\d.]+) ([\d.]+) Q ([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)/);
  if (!match) return null;

  const [, x1s, y1s, cpXs, cpYs, x2s, y2s] = match;
  const x1 = parseFloat(x1s);
  const y1 = parseFloat(y1s);
  const cpX = parseFloat(cpXs);
  const cpY = parseFloat(cpYs);
  const x2 = parseFloat(x2s);
  const y2 = parseFloat(y2s);

  // Point on quadratic bezier at t
  const t = offset;
  const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cpX + t * t * x2;
  const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cpY + t * t * y2;

  // Tangent direction
  const tx = 2 * (1 - t) * (cpX - x1) + 2 * t * (x2 - cpX);
  const ty = 2 * (1 - t) * (cpY - y1) + 2 * t * (y2 - cpY);
  const angle = Math.atan2(ty, tx) * (180 / Math.PI);

  return (
    <polygon
      points="0,-5 12,0 0,5"
      fill={color}
      transform={`translate(${px}, ${py}) rotate(${angle})`}
    />
  );
}
