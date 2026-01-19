/**
 * Graph data types for API and UI
 */

import { DealType, FlowType, DataStatus, PartyRole, SourceType } from '@prisma/client';

// ============================================================================
// NODE (Company)
// ============================================================================

export interface NodeDTO {
  id: string;
  name: string;
  slug: string;
  ticker?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  valuationUSD?: number | null;
}

// ============================================================================
// EDGE (Aggregated from Deals)
// ============================================================================

export interface EdgeDTO {
  id: string;                    // Generated: `${fromId}-${toId}-${edgeType}`
  from: string;                  // Company ID
  to: string;                    // Company ID
  edgeType: DealType;
  flowType: FlowType;
  isDirectional: boolean;
  totalAmountUSD: number | null; // Sum of known amounts
  amountText: string | null;     // Aggregated text or "mixed/unknown"
  avgConfidence: number;
  dealIds: string[];
}

// ============================================================================
// SUPER-EDGE (Bundled edges between node pair)
// ============================================================================

export interface FlowBreakdown {
  flowType: FlowType;
  amount: number | null;
  dealCount: number;
  edgeIds: string[];
}

export interface SuperEdgeDTO {
  id: string;                    // "nodeA--nodeB" (sorted alphabetically)
  from: string;                  // Company ID (first alphabetically)
  to: string;                    // Company ID (second alphabetically)
  totalAmountUSD: number | null;
  edgeCount: number;             // Number of individual edges bundled
  dealCount: number;             // Total deals across all edges
  flowBreakdown: FlowBreakdown[];
  edges: EdgeDTO[];              // Original edges for drill-down
  importance: number;            // 0-1 score for visual weight
}

// ============================================================================
// DEAL (Full details)
// ============================================================================

export interface DealPartyDTO {
  companyId: string;
  companyName: string;
  companySlug: string;
  role: PartyRole;
  direction: string;
  notes?: string | null;
}

export interface SourceDTO {
  id: string;
  sourceType: SourceType;
  publisher: string;
  url: string;
  publishedAt: string | null;
  excerpt?: string | null;
  reliability: number;
  confidence: number;
}

export interface DealDTO {
  id: string;
  title: string;
  summary: string;
  dealType: DealType;
  flowType: FlowType;
  announcedAt: string;
  amountUSD: number | null;
  amountUSDMin: number | null;
  amountUSDMax: number | null;
  amountText: string | null;
  dataStatus: DataStatus;
  tags: string[];
  parties: DealPartyDTO[];
  sources: SourceDTO[];
}

// ============================================================================
// LOOP (Circular Flow Detection)
// ============================================================================

export interface LoopDTO {
  id: string;                    // "companyA--companyB" (sorted alphabetically)
  company1: { id: string; name: string; slug: string };
  company2: { id: string; name: string; slug: string };

  // The two edges forming the loop
  edge1: EdgeDTO;                // company1 → company2
  edge2: EdgeDTO;                // company2 → company1

  // Metrics
  totalCirculation: number;      // Sum of both edge amounts in USD
  balanceRatio: number;          // 0-1 (1 = perfectly balanced)
  flowDiversity: boolean;        // true if different flow types
  loopScore: number;             // 0-1 composite metric
}

// ============================================================================
// HUB SCORE (Company-Level Circularity)
// ============================================================================

export interface HubScoreDTO {
  companyId: string;
  companyName: string;
  companySlug: string;

  // Core metrics
  hubScore: number;           // Sum of loop scores
  normalizedHubScore: number; // 0-1 normalized

  // Supporting data
  loopCount: number;          // Number of loops involved in
  avgLoopScore: number;       // Average loop score
  totalCirculation: number;   // Total USD in company's loops
  loopIds: string[];          // IDs of loops this company is in
}

// ============================================================================
// GRAPH RESPONSE
// ============================================================================

export interface GraphResponse {
  nodes: NodeDTO[];
  edges: EdgeDTO[];
  dealsById: Record<string, DealDTO>;
  loops: LoopDTO[];              // Detected loops with scores
  hubScores: HubScoreDTO[];      // Company-level circularity scores
}

// ============================================================================
// FILTER OPTIONS
// ============================================================================

export interface GraphFilters {
  dealTypes?: DealType[];
  flowTypes?: FlowType[];
  minConfidence?: number;
  dateFrom?: string;
  dateTo?: string;
}
