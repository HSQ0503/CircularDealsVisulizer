/**
 * Null Model Comparison for Statistical Significance Testing
 *
 * Uses the configuration model (degree-preserving randomization) to generate
 * null distributions for loop/cycle counts, allowing statistical comparison
 * of observed network metrics against random expectation.
 */

import { prisma } from '@/lib/prisma';
import type {
  EdgeDTO,
  NodeDTO,
  LoopDTO,
  MultiPartyCycleDTO,
  HubScoreDTO,
  NullModelComparison,
  NullModelConfig,
  DistributionStats,
  SignificanceMetrics,
} from './types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: NullModelConfig = {
  iterations: 500,
  algorithm: 'configuration_model',
  maxCycleLength: 5,
};

// ============================================================================
// CONFIGURATION MODEL: EDGE RANDOMIZATION
// ============================================================================

type SimpleEdge = { from: string; to: string };

/**
 * Randomize edges using the configuration model (stub-matching).
 * Preserves in-degree and out-degree of each node.
 *
 * Algorithm:
 * 1. Create outStubs = [e.from for e in edges]
 * 2. Create inStubs = [e.to for e in edges]
 * 3. Fisher-Yates shuffle inStubs
 * 4. Pair: newEdges[i] = (outStubs[i], inStubs[i])
 * 5. Filter self-loops (from === to)
 * 6. Deduplicate (keep unique from->to pairs)
 */
function randomizeEdgesConfigurationModel(edges: SimpleEdge[]): SimpleEdge[] {
  const outStubs = edges.map(e => e.from);
  const inStubs = edges.map(e => e.to);

  // Fisher-Yates shuffle of inStubs
  for (let i = inStubs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [inStubs[i], inStubs[j]] = [inStubs[j], inStubs[i]];
  }

  // Pair stubs to create new edges
  const newEdges: SimpleEdge[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < outStubs.length; i++) {
    const from = outStubs[i];
    const to = inStubs[i];

    // Filter self-loops
    if (from === to) continue;

    // Deduplicate
    const key = `${from}->${to}`;
    if (seen.has(key)) continue;
    seen.add(key);

    newEdges.push({ from, to });
  }

  return newEdges;
}

// ============================================================================
// FAST LOOP COUNTING (O(E) for null iterations)
// ============================================================================

/**
 * Count bidirectional loops (A↔B pairs) in a set of edges.
 * Returns the count of unique node pairs with edges in both directions.
 */
function countLoops(edges: SimpleEdge[]): number {
  const edgeSet = new Set<string>();
  for (const e of edges) {
    edgeSet.add(`${e.from}->${e.to}`);
  }

  let loopCount = 0;
  const counted = new Set<string>();

  for (const e of edges) {
    const pairKey = [e.from, e.to].sort().join('--');
    if (counted.has(pairKey)) continue;

    const reverseKey = `${e.to}->${e.from}`;
    if (edgeSet.has(reverseKey)) {
      loopCount++;
      counted.add(pairKey);
    }
  }

  return loopCount;
}

// ============================================================================
// FAST CYCLE COUNTING (DFS for null iterations)
// ============================================================================

type CycleCounts = {
  total: number;
  length3: number;
  length4: number;
  length5: number;
};

/**
 * Count cycles of length 3, 4, and 5 using DFS.
 * Returns counts by length and total.
 */
function countCyclesByLength(
  edges: SimpleEdge[],
  nodeIds: string[],
  maxLength: number = 5
): CycleCounts {
  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  for (const nodeId of nodeIds) {
    adjacency.set(nodeId, []);
  }
  for (const edge of edges) {
    adjacency.get(edge.from)?.push(edge.to);
  }

  const foundCycles = new Set<string>();

  // DFS from each node
  for (const startNode of nodeIds) {
    const path: string[] = [];

    function dfs(current: string): void {
      // Found cycle back to start (min length 3)
      if (path.length >= 3 && current === startNode) {
        // Canonicalize: lexicographically smallest rotation
        const n = path.length;
        let minStr = path.join('--');
        for (let i = 1; i < n; i++) {
          const rotation = [...path.slice(i), ...path.slice(0, i)];
          const rotStr = rotation.join('--');
          if (rotStr < minStr) minStr = rotStr;
        }
        foundCycles.add(minStr);
        return;
      }

      if (path.length >= maxLength) return;

      const neighbors = adjacency.get(current) || [];
      for (const next of neighbors) {
        // Can revisit startNode to close, skip other visited
        if (next !== startNode && path.includes(next)) continue;

        path.push(next);
        dfs(next);
        path.pop();
      }
    }

    dfs(startNode);
  }

  // Count by length
  let length3 = 0;
  let length4 = 0;
  let length5 = 0;

  for (const cycleId of foundCycles) {
    const len = cycleId.split('--').length;
    if (len === 3) length3++;
    else if (len === 4) length4++;
    else if (len === 5) length5++;
  }

  return {
    total: foundCycles.size,
    length3,
    length4,
    length5,
  };
}

// ============================================================================
// HUB SCORE COMPUTATION (simplified for null model)
// ============================================================================

type HubScoreMap = Map<string, number>;

/**
 * Compute hub scores for each node based on loop/cycle participation.
 * Simplified version for null model: just count participations.
 */
function computeHubScores(
  edges: SimpleEdge[],
  nodeIds: string[]
): HubScoreMap {
  const scores = new Map<string, number>();
  for (const nodeId of nodeIds) {
    scores.set(nodeId, 0);
  }

  // Count loop participation (each loop contributes 1 to both nodes)
  const edgeSet = new Set(edges.map(e => `${e.from}->${e.to}`));
  const countedPairs = new Set<string>();

  for (const e of edges) {
    const pairKey = [e.from, e.to].sort().join('--');
    if (countedPairs.has(pairKey)) continue;

    const reverseKey = `${e.to}->${e.from}`;
    if (edgeSet.has(reverseKey)) {
      scores.set(e.from, (scores.get(e.from) || 0) + 1);
      scores.set(e.to, (scores.get(e.to) || 0) + 1);
      countedPairs.add(pairKey);
    }
  }

  return scores;
}

// ============================================================================
// STATISTICAL UTILITIES
// ============================================================================

function computeDistributionStats(values: number[]): DistributionStats {
  if (values.length === 0) {
    return { mean: 0, std: 0, min: 0, max: 0, p5: 0, p50: 0, p95: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const variance = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
  const std = Math.sqrt(variance);

  const percentile = (p: number) => {
    const idx = Math.floor(p * (n - 1));
    return sorted[idx];
  };

  return {
    mean,
    std,
    min: sorted[0],
    max: sorted[n - 1],
    p5: percentile(0.05),
    p50: percentile(0.5),
    p95: percentile(0.95),
  };
}

function computeSignificance(
  realValue: number,
  distribution: DistributionStats
): SignificanceMetrics {
  const { mean, std } = distribution;

  // Z-score
  const zScore = std > 0 ? (realValue - mean) / std : 0;

  // Two-tailed p-value using normal approximation
  const pValue = std > 0 ? 2 * (1 - normalCDF(Math.abs(zScore))) : 1;

  // Percentile (approximate from z-score)
  const percentile = normalCDF(zScore) * 100;

  // Significance at p < 0.05
  const isSignificant = pValue < 0.05;

  return { zScore, pValue, percentile, isSignificant };
}

/**
 * Standard normal CDF approximation (Abramowitz and Stegun)
 */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

// ============================================================================
// MAIN COMPUTATION
// ============================================================================

export async function computeNullModel(
  realEdges: EdgeDTO[],
  realNodes: NodeDTO[],
  realLoops: LoopDTO[],
  realCycles: MultiPartyCycleDTO[],
  realHubScores: HubScoreDTO[],
  config: Partial<NullModelConfig> = {}
): Promise<NullModelComparison> {
  const fullConfig: NullModelConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = Date.now();

  // Convert to simple edges
  const simpleEdges: SimpleEdge[] = realEdges.map(e => ({
    from: e.from,
    to: e.to,
  }));
  const nodeIds = realNodes.map(n => n.id);

  // Real metrics
  const realLoopCount = realLoops.length;
  const realAvgLoopScore =
    realLoopCount > 0
      ? realLoops.reduce((sum, l) => sum + l.loopScore, 0) / realLoopCount
      : 0;
  const realTotalCirculation = realLoops.reduce(
    (sum, l) => sum + l.totalCirculation,
    0
  );

  const realCycle3Count = realCycles.filter(c => c.length === 3).length;
  const realCycle4Count = realCycles.filter(c => c.length === 4).length;
  const realCycle5Count = realCycles.filter(c => c.length === 5).length;
  const realTotalCycleCount = realCycles.length;
  const realAvgCycleScore =
    realTotalCycleCount > 0
      ? realCycles.reduce((sum, c) => sum + c.cycleScore, 0) / realTotalCycleCount
      : 0;

  // Run null model iterations
  const nullLoopCounts: number[] = [];
  const nullCycle3Counts: number[] = [];
  const nullCycle4Counts: number[] = [];
  const nullCycle5Counts: number[] = [];
  const nullTotalCycleCounts: number[] = [];
  const nullHubScores: Map<string, number[]> = new Map();

  for (const nodeId of nodeIds) {
    nullHubScores.set(nodeId, []);
  }

  console.log(`   Running ${fullConfig.iterations} null model iterations...`);

  for (let i = 0; i < fullConfig.iterations; i++) {
    // Randomize edges
    const randomEdges = randomizeEdgesConfigurationModel(simpleEdges);

    // Count loops
    const loopCount = countLoops(randomEdges);
    nullLoopCounts.push(loopCount);

    // Count cycles
    const cycleCounts = countCyclesByLength(
      randomEdges,
      nodeIds,
      fullConfig.maxCycleLength
    );
    nullCycle3Counts.push(cycleCounts.length3);
    nullCycle4Counts.push(cycleCounts.length4);
    nullCycle5Counts.push(cycleCounts.length5);
    nullTotalCycleCounts.push(cycleCounts.total);

    // Hub scores
    const hubScores = computeHubScores(randomEdges, nodeIds);
    for (const [nodeId, score] of hubScores) {
      nullHubScores.get(nodeId)?.push(score);
    }

    // Progress indicator
    if ((i + 1) % 100 === 0) {
      console.log(`   ... ${i + 1}/${fullConfig.iterations} iterations complete`);
    }
  }

  const computeDurationMs = Date.now() - startTime;

  // Compute distributions
  const loopCountDist = computeDistributionStats(nullLoopCounts);
  const cycle3CountDist = computeDistributionStats(nullCycle3Counts);
  const cycle4CountDist = computeDistributionStats(nullCycle4Counts);
  const cycle5CountDist = computeDistributionStats(nullCycle5Counts);
  const totalCycleCountDist = computeDistributionStats(nullTotalCycleCounts);

  // Compute significance
  const loopCountSig = computeSignificance(realLoopCount, loopCountDist);
  const cycleCountSig = computeSignificance(realTotalCycleCount, totalCycleCountDist);

  // Hub significance for each company
  const hubResults = realHubScores
    .filter(hs => hs.loopCount > 0)
    .map(hs => {
      const nullScores = nullHubScores.get(hs.companyId) || [];
      const dist = computeDistributionStats(nullScores);
      const sig = computeSignificance(hs.loopCount, dist);

      return {
        companyId: hs.companyId,
        companySlug: hs.companySlug,
        companyName: hs.companyName,
        real: {
          hubScore: hs.hubScore,
          loopCount: hs.loopCount,
          normalizedScore: hs.normalizedHubScore,
        },
        null: { hubScore: dist },
        significance: sig,
      };
    });

  // Store results
  const result = await storeNullModelResults({
    config: fullConfig,
    networkStats: {
      computeDurationMs,
      nodeCount: nodeIds.length,
      edgeCount: simpleEdges.length,
    },
    loops: {
      real: {
        loopCount: realLoopCount,
        avgLoopScore: realAvgLoopScore,
        totalCirculation: realTotalCirculation,
      },
      null: { loopCount: loopCountDist },
      significance: { loopCount: loopCountSig },
    },
    cycles: {
      real: {
        cycle3Count: realCycle3Count,
        cycle4Count: realCycle4Count,
        cycle5Count: realCycle5Count,
        totalCycleCount: realTotalCycleCount,
        avgCycleScore: realAvgCycleScore,
      },
      null: {
        totalCycleCount: totalCycleCountDist,
        cycle3Count: cycle3CountDist,
        cycle4Count: cycle4CountDist,
        cycle5Count: cycle5CountDist,
      },
      significance: { totalCycleCount: cycleCountSig },
    },
    hubs: hubResults,
  });

  return result;
}

// ============================================================================
// DATABASE STORAGE
// ============================================================================

type NullModelInput = Omit<NullModelComparison, 'runId' | 'computedAt'>;

async function storeNullModelResults(
  data: NullModelInput
): Promise<NullModelComparison> {
  // Delete any existing null model runs (keep only latest)
  await prisma.nullModelRun.deleteMany({});

  // Create new run
  const run = await prisma.nullModelRun.create({
    data: {
      iterations: data.config.iterations,
      algorithm: data.config.algorithm,
      computeDurationMs: data.networkStats.computeDurationMs,
      edgeCount: data.networkStats.edgeCount,
      nodeCount: data.networkStats.nodeCount,
      loopStats: {
        create: {
          realLoopCount: data.loops.real.loopCount,
          realAvgLoopScore: data.loops.real.avgLoopScore,
          realTotalCirculation: data.loops.real.totalCirculation,
          nullLoopCountMean: data.loops.null.loopCount.mean,
          nullLoopCountStd: data.loops.null.loopCount.std,
          nullLoopCountMin: data.loops.null.loopCount.min,
          nullLoopCountMax: data.loops.null.loopCount.max,
          nullLoopCountP5: data.loops.null.loopCount.p5,
          nullLoopCountP50: data.loops.null.loopCount.p50,
          nullLoopCountP95: data.loops.null.loopCount.p95,
          loopCountZScore: data.loops.significance.loopCount.zScore,
          loopCountPValue: data.loops.significance.loopCount.pValue,
          loopCountPercentile: data.loops.significance.loopCount.percentile,
        },
      },
      cycleStats: {
        create: {
          realCycle3Count: data.cycles.real.cycle3Count,
          realCycle4Count: data.cycles.real.cycle4Count,
          realCycle5Count: data.cycles.real.cycle5Count,
          realTotalCycleCount: data.cycles.real.totalCycleCount,
          realAvgCycleScore: data.cycles.real.avgCycleScore,
          nullCycleCountMean: data.cycles.null.totalCycleCount.mean,
          nullCycleCountStd: data.cycles.null.totalCycleCount.std,
          nullCycleCountMin: data.cycles.null.totalCycleCount.min,
          nullCycleCountMax: data.cycles.null.totalCycleCount.max,
          nullCycleCountP5: data.cycles.null.totalCycleCount.p5,
          nullCycleCountP50: data.cycles.null.totalCycleCount.p50,
          nullCycleCountP95: data.cycles.null.totalCycleCount.p95,
          nullCycle3CountMean: data.cycles.null.cycle3Count.mean,
          nullCycle4CountMean: data.cycles.null.cycle4Count.mean,
          nullCycle5CountMean: data.cycles.null.cycle5Count.mean,
          cycleCountZScore: data.cycles.significance.totalCycleCount.zScore,
          cycleCountPValue: data.cycles.significance.totalCycleCount.pValue,
          cycleCountPercentile: data.cycles.significance.totalCycleCount.percentile,
        },
      },
      hubStats: {
        create: data.hubs.map(h => ({
          companyId: h.companyId,
          companySlug: h.companySlug,
          realHubScore: h.real.hubScore,
          realLoopCount: h.real.loopCount,
          realNormalizedScore: h.real.normalizedScore,
          nullHubScoreMean: h.null.hubScore.mean,
          nullHubScoreStd: h.null.hubScore.std,
          nullHubScoreP5: h.null.hubScore.p5,
          nullHubScoreP95: h.null.hubScore.p95,
          hubScoreZScore: h.significance.zScore,
          hubScorePValue: h.significance.pValue,
          hubScorePercentile: h.significance.percentile,
        })),
      },
    },
  });

  return {
    runId: run.id,
    computedAt: run.computedAt.toISOString(),
    config: data.config,
    networkStats: data.networkStats,
    loops: data.loops,
    cycles: data.cycles,
    hubs: data.hubs,
  };
}

// ============================================================================
// FETCH FROM DATABASE
// ============================================================================

export async function getLatestNullModelComparison(): Promise<NullModelComparison | null> {
  const run = await prisma.nullModelRun.findFirst({
    orderBy: { computedAt: 'desc' },
    include: {
      loopStats: true,
      cycleStats: true,
      hubStats: true,
    },
  });

  if (!run || !run.loopStats || !run.cycleStats) {
    return null;
  }

  const ls = run.loopStats;
  const cs = run.cycleStats;

  return {
    runId: run.id,
    computedAt: run.computedAt.toISOString(),
    config: {
      iterations: run.iterations,
      algorithm: run.algorithm as 'configuration_model',
      maxCycleLength: 5,
    },
    networkStats: {
      nodeCount: run.nodeCount,
      edgeCount: run.edgeCount,
      computeDurationMs: run.computeDurationMs,
    },
    loops: {
      real: {
        loopCount: ls.realLoopCount,
        avgLoopScore: ls.realAvgLoopScore,
        totalCirculation: ls.realTotalCirculation,
      },
      null: {
        loopCount: {
          mean: ls.nullLoopCountMean,
          std: ls.nullLoopCountStd,
          min: ls.nullLoopCountMin,
          max: ls.nullLoopCountMax,
          p5: ls.nullLoopCountP5,
          p50: ls.nullLoopCountP50,
          p95: ls.nullLoopCountP95,
        },
      },
      significance: {
        loopCount: {
          zScore: ls.loopCountZScore,
          pValue: ls.loopCountPValue,
          percentile: ls.loopCountPercentile,
          isSignificant: ls.loopCountPValue < 0.05,
        },
      },
    },
    cycles: {
      real: {
        cycle3Count: cs.realCycle3Count,
        cycle4Count: cs.realCycle4Count,
        cycle5Count: cs.realCycle5Count,
        totalCycleCount: cs.realTotalCycleCount,
        avgCycleScore: cs.realAvgCycleScore,
      },
      null: {
        totalCycleCount: {
          mean: cs.nullCycleCountMean,
          std: cs.nullCycleCountStd,
          min: cs.nullCycleCountMin,
          max: cs.nullCycleCountMax,
          p5: cs.nullCycleCountP5,
          p50: cs.nullCycleCountP50,
          p95: cs.nullCycleCountP95,
        },
        cycle3Count: {
          mean: cs.nullCycle3CountMean,
          std: 0,
          min: 0,
          max: 0,
          p5: 0,
          p50: cs.nullCycle3CountMean,
          p95: 0,
        },
        cycle4Count: {
          mean: cs.nullCycle4CountMean,
          std: 0,
          min: 0,
          max: 0,
          p5: 0,
          p50: cs.nullCycle4CountMean,
          p95: 0,
        },
        cycle5Count: {
          mean: cs.nullCycle5CountMean,
          std: 0,
          min: 0,
          max: 0,
          p5: 0,
          p50: cs.nullCycle5CountMean,
          p95: 0,
        },
      },
      significance: {
        totalCycleCount: {
          zScore: cs.cycleCountZScore,
          pValue: cs.cycleCountPValue,
          percentile: cs.cycleCountPercentile,
          isSignificant: cs.cycleCountPValue < 0.05,
        },
      },
    },
    hubs: run.hubStats.map(h => ({
      companyId: h.companyId,
      companySlug: h.companySlug,
      companyName: h.companySlug, // Will need to be enriched with real name
      real: {
        hubScore: h.realHubScore,
        loopCount: h.realLoopCount,
        normalizedScore: h.realNormalizedScore,
      },
      null: {
        hubScore: {
          mean: h.nullHubScoreMean,
          std: h.nullHubScoreStd,
          min: 0,
          max: 0,
          p5: h.nullHubScoreP5,
          p50: h.nullHubScoreMean,
          p95: h.nullHubScoreP95,
        },
      },
      significance: {
        zScore: h.hubScoreZScore,
        pValue: h.hubScorePValue,
        percentile: h.hubScorePercentile,
        isSignificant: h.hubScorePValue < 0.05,
      },
    })),
  };
}
