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
// GRAPH RESPONSE
// ============================================================================

export interface GraphResponse {
  nodes: NodeDTO[];
  edges: EdgeDTO[];
  dealsById: Record<string, DealDTO>;
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
