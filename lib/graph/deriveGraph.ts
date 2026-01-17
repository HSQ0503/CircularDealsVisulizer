/**
 * Graph derivation logic
 * Fetches deals and derives nodes/edges for visualization
 */

import { prisma } from '@/lib/prisma';
import { DealType, FlowType, FlowDirection, PartyRole, Prisma } from '@prisma/client';
import type { GraphResponse, NodeDTO, EdgeDTO, DealDTO, GraphFilters, SuperEdgeDTO, FlowBreakdown } from './types';

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export async function deriveGraph(
  companySlugs: string[] | 'all' = 'all',
  filters: GraphFilters = {}
): Promise<GraphResponse> {
  // Fetch companies - either specific slugs or all
  const companies = companySlugs === 'all'
    ? await prisma.company.findMany()
    : await prisma.company.findMany({
        where: { slug: { in: companySlugs } },
      });

  const companyIds = companies.map(c => c.id);
  const companyMap = new Map(companies.map(c => [c.id, c]));

  // Build deal query with filters
  const dealWhere: Prisma.DealWhereInput = {
    parties: {
      some: { companyId: { in: companyIds } },
    },
  };

  if (filters.dealTypes?.length) {
    dealWhere.dealType = { in: filters.dealTypes };
  }

  if (filters.flowTypes?.length) {
    dealWhere.flowType = { in: filters.flowTypes };
  }

  if (filters.dateFrom || filters.dateTo) {
    dealWhere.announcedAt = {};
    if (filters.dateFrom) dealWhere.announcedAt.gte = new Date(filters.dateFrom);
    if (filters.dateTo) dealWhere.announcedAt.lte = new Date(filters.dateTo);
  }

  // Fetch deals with parties and sources
  const deals = await prisma.deal.findMany({
    where: dealWhere,
    include: {
      parties: {
        include: { company: true },
      },
      sources: true,
    },
    orderBy: { announcedAt: 'desc' },
  });

  // Filter by confidence if specified
  const filteredDeals = filters.minConfidence
    ? deals.filter(deal => {
        const avgConfidence = deal.sources.length > 0
          ? deal.sources.reduce((sum, s) => sum + s.confidence, 0) / deal.sources.length
          : 3;
        return avgConfidence >= filters.minConfidence!;
      })
    : deals;

  // ============================================================================
  // BUILD NODES
  // ============================================================================

  const nodes: NodeDTO[] = companies.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    ticker: c.ticker,
    description: c.description,
    logoUrl: c.logoUrl,
  }));

  // ============================================================================
  // BUILD EDGES (Aggregated from Deals)
  // ============================================================================

  // Group deals by (from, to, dealType, flowType)
  const edgeMap = new Map<string, {
    from: string;
    to: string;
    dealType: DealType;
    flowType: FlowType;
    isDirectional: boolean;
    dealIds: string[];
    amounts: number[];
    amountTexts: string[];
    confidences: number[];
  }>();

  for (const deal of filteredDeals) {
    const { from, to, isDirectional } = inferDirection(deal.parties);
    
    if (!from || !to) continue; // Skip if we can't determine direction
    if (!companyIds.includes(from) || !companyIds.includes(to)) continue; // Skip external parties

    const edgeKey = `${from}-${to}-${deal.dealType}-${deal.flowType}`;
    
    if (!edgeMap.has(edgeKey)) {
      edgeMap.set(edgeKey, {
        from,
        to,
        dealType: deal.dealType,
        flowType: deal.flowType,
        isDirectional,
        dealIds: [],
        amounts: [],
        amountTexts: [],
        confidences: [],
      });
    }

    const edge = edgeMap.get(edgeKey)!;
    edge.dealIds.push(deal.id);

    // Collect amounts
    if (deal.amountUSD) {
      edge.amounts.push(Number(deal.amountUSD));
    } else if (deal.amountUSDMax) {
      edge.amounts.push(Number(deal.amountUSDMax));
    }

    if (deal.amountText) {
      edge.amountTexts.push(deal.amountText);
    }

    // Collect confidences from sources
    const avgConfidence = deal.sources.length > 0
      ? deal.sources.reduce((sum, s) => sum + s.confidence, 0) / deal.sources.length
      : 3;
    edge.confidences.push(avgConfidence);
  }

  const edges: EdgeDTO[] = Array.from(edgeMap.entries()).map(([key, data]) => ({
    id: key,
    from: data.from,
    to: data.to,
    edgeType: data.dealType,
    flowType: data.flowType,
    isDirectional: data.isDirectional,
    totalAmountUSD: data.amounts.length > 0 ? data.amounts.reduce((a, b) => a + b, 0) : null,
    amountText: aggregateAmountText(data.amountTexts),
    avgConfidence: data.confidences.length > 0
      ? data.confidences.reduce((a, b) => a + b, 0) / data.confidences.length
      : 3,
    dealIds: data.dealIds,
  }));

  // ============================================================================
  // BUILD DEALS MAP
  // ============================================================================

  const dealsById: Record<string, DealDTO> = {};

  for (const deal of filteredDeals) {
    dealsById[deal.id] = {
      id: deal.id,
      title: deal.title,
      summary: deal.summary,
      dealType: deal.dealType,
      flowType: deal.flowType,
      announcedAt: deal.announcedAt.toISOString(),
      amountUSD: deal.amountUSD ? Number(deal.amountUSD) : null,
      amountUSDMin: deal.amountUSDMin ? Number(deal.amountUSDMin) : null,
      amountUSDMax: deal.amountUSDMax ? Number(deal.amountUSDMax) : null,
      amountText: deal.amountText,
      dataStatus: deal.dataStatus,
      tags: deal.tags,
      parties: deal.parties.map(p => ({
        companyId: p.companyId,
        companyName: p.company.name,
        companySlug: p.company.slug,
        role: p.role,
        direction: p.direction,
        notes: p.notes,
      })),
      sources: deal.sources.map(s => ({
        id: s.id,
        sourceType: s.sourceType,
        publisher: s.publisher,
        url: s.url,
        publishedAt: s.publishedAt?.toISOString() ?? null,
        excerpt: s.excerpt,
        reliability: s.reliability,
        confidence: s.confidence,
      })),
    };
  }

  return { nodes, edges, dealsById };
}

// ============================================================================
// HELPERS
// ============================================================================

interface DirectionResult {
  from: string | null;
  to: string | null;
  isDirectional: boolean;
}

function inferDirection(parties: Array<{ companyId: string; role: PartyRole; direction: FlowDirection }>): DirectionResult {
  // Find OUTFLOW party (from) and INFLOW party (to)
  const outflowParty = parties.find(p => p.direction === FlowDirection.OUTFLOW);
  const inflowParty = parties.find(p => p.direction === FlowDirection.INFLOW);

  if (outflowParty && inflowParty) {
    return {
      from: outflowParty.companyId,
      to: inflowParty.companyId,
      isDirectional: true,
    };
  }

  // Fallback: use roles
  const investor = parties.find(p => p.role === PartyRole.INVESTOR);
  const investee = parties.find(p => p.role === PartyRole.INVESTEE);
  if (investor && investee) {
    return { from: investor.companyId, to: investee.companyId, isDirectional: true };
  }

  const customer = parties.find(p => p.role === PartyRole.CUSTOMER);
  const supplier = parties.find(p => p.role === PartyRole.SUPPLIER);
  if (customer && supplier) {
    return { from: customer.companyId, to: supplier.companyId, isDirectional: true };
  }

  const acquirer = parties.find(p => p.role === PartyRole.ACQUIRER);
  const target = parties.find(p => p.role === PartyRole.TARGET);
  if (acquirer && target) {
    return { from: acquirer.companyId, to: target.companyId, isDirectional: true };
  }

  // Partners: non-directional, pick first two
  const partners = parties.filter(p => p.role === PartyRole.PARTNER);
  if (partners.length >= 2) {
    return { from: partners[0].companyId, to: partners[1].companyId, isDirectional: false };
  }

  // Last resort: first two parties
  if (parties.length >= 2) {
    return { from: parties[0].companyId, to: parties[1].companyId, isDirectional: false };
  }

  return { from: null, to: null, isDirectional: false };
}

function aggregateAmountText(texts: string[]): string | null {
  if (texts.length === 0) return null;
  if (texts.length === 1) return texts[0];
  
  // If all the same, return one
  const unique = [...new Set(texts)];
  if (unique.length === 1) return unique[0];
  
  return 'Multiple amounts';
}
