/**
 * Deals API Route
 *
 * POST /api/deals - Create a new deal with parties and sources
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  DealType,
  FlowType,
  DataStatus,
  PartyRole,
  FlowDirection,
  SourceType,
} from '@prisma/client';

type CreateDealPartyInput = {
  companyId: string;
  role: PartyRole;
  direction: FlowDirection;
  notes?: string;
};

type CreateSourceInput = {
  sourceType: SourceType;
  publisher: string;
  url: string;
  publishedAt?: string;
  excerpt?: string;
  reliability?: number;
  confidence?: number;
};

type CreateDealRequest = {
  title: string;
  summary: string;
  dealType: DealType;
  flowType: FlowType;
  announcedAt: string;
  dataStatus: DataStatus;
  amountUSD?: number | null;
  amountUSDMin?: number | null;
  amountUSDMax?: number | null;
  amountText?: string | null;
  tags?: string[];
  parties: CreateDealPartyInput[];
  sources?: CreateSourceInput[];
};

function validateDealRequest(body: unknown): { data: CreateDealRequest; error: null } | { data: null; error: string } {
  if (!body || typeof body !== 'object') {
    return { data: null, error: 'Request body is required' };
  }

  const req = body as Record<string, unknown>;

  if (!req.title || typeof req.title !== 'string') {
    return { data: null, error: 'Title is required' };
  }
  if (!req.summary || typeof req.summary !== 'string') {
    return { data: null, error: 'Summary is required' };
  }
  if (!req.dealType || !Object.values(DealType).includes(req.dealType as DealType)) {
    return { data: null, error: `Invalid dealType. Must be one of: ${Object.values(DealType).join(', ')}` };
  }
  if (!req.flowType || !Object.values(FlowType).includes(req.flowType as FlowType)) {
    return { data: null, error: `Invalid flowType. Must be one of: ${Object.values(FlowType).join(', ')}` };
  }
  if (!req.announcedAt || typeof req.announcedAt !== 'string') {
    return { data: null, error: 'announcedAt date is required' };
  }
  if (!req.dataStatus || !Object.values(DataStatus).includes(req.dataStatus as DataStatus)) {
    return { data: null, error: `Invalid dataStatus. Must be one of: ${Object.values(DataStatus).join(', ')}` };
  }

  if (!Array.isArray(req.parties) || req.parties.length < 2) {
    return { data: null, error: 'At least 2 parties are required' };
  }

  for (const party of req.parties) {
    if (!party.companyId || typeof party.companyId !== 'string') {
      return { data: null, error: 'Each party must have a companyId' };
    }
    if (!party.role || !Object.values(PartyRole).includes(party.role as PartyRole)) {
      return { data: null, error: `Invalid party role. Must be one of: ${Object.values(PartyRole).join(', ')}` };
    }
    if (!party.direction || !Object.values(FlowDirection).includes(party.direction as FlowDirection)) {
      return { data: null, error: `Invalid party direction. Must be one of: ${Object.values(FlowDirection).join(', ')}` };
    }
  }

  if (req.sources && Array.isArray(req.sources)) {
    for (const source of req.sources) {
      if (!source.sourceType || !Object.values(SourceType).includes(source.sourceType as SourceType)) {
        return { data: null, error: `Invalid sourceType. Must be one of: ${Object.values(SourceType).join(', ')}` };
      }
      if (!source.publisher || typeof source.publisher !== 'string') {
        return { data: null, error: 'Source publisher is required' };
      }
      if (!source.url || typeof source.url !== 'string') {
        return { data: null, error: 'Source url is required' };
      }
    }
  }

  return {
    data: {
      title: req.title as string,
      summary: req.summary as string,
      dealType: req.dealType as DealType,
      flowType: req.flowType as FlowType,
      announcedAt: req.announcedAt as string,
      dataStatus: req.dataStatus as DataStatus,
      amountUSD: req.amountUSD as number | null | undefined,
      amountUSDMin: req.amountUSDMin as number | null | undefined,
      amountUSDMax: req.amountUSDMax as number | null | undefined,
      amountText: req.amountText as string | null | undefined,
      tags: Array.isArray(req.tags) ? req.tags : [],
      parties: req.parties as CreateDealPartyInput[],
      sources: req.sources as CreateSourceInput[] | undefined,
    },
    error: null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateDealRequest(body);

    if (validation.error || !validation.data) {
      return NextResponse.json({ error: validation.error || 'Invalid request' }, { status: 400 });
    }

    const data = validation.data;

    // Verify all companies exist
    const companyIds = data.parties.map(p => p.companyId);
    const companies = await prisma.company.findMany({
      where: { id: { in: companyIds } },
      select: { id: true },
    });

    const foundIds = new Set(companies.map(c => c.id));
    const missingIds = companyIds.filter(id => !foundIds.has(id));
    if (missingIds.length > 0) {
      return NextResponse.json(
        { error: `Companies not found: ${missingIds.join(', ')}` },
        { status: 400 }
      );
    }

    // Create deal with parties and sources in a transaction
    const deal = await prisma.$transaction(async (tx) => {
      const newDeal = await tx.deal.create({
        data: {
          title: data.title,
          summary: data.summary,
          dealType: data.dealType,
          flowType: data.flowType,
          announcedAt: new Date(data.announcedAt),
          dataStatus: data.dataStatus,
          amountUSD: data.amountUSD ?? null,
          amountUSDMin: data.amountUSDMin ?? null,
          amountUSDMax: data.amountUSDMax ?? null,
          amountText: data.amountText ?? null,
          tags: data.tags ?? [],
          parties: {
            create: data.parties.map(p => ({
              companyId: p.companyId,
              role: p.role,
              direction: p.direction,
              notes: p.notes ?? null,
            })),
          },
          sources: data.sources ? {
            create: data.sources.map(s => ({
              sourceType: s.sourceType,
              publisher: s.publisher,
              url: s.url,
              publishedAt: s.publishedAt ? new Date(s.publishedAt) : null,
              excerpt: s.excerpt ?? null,
              reliability: s.reliability ?? 3,
              confidence: s.confidence ?? 3,
            })),
          } : undefined,
        },
        include: {
          parties: {
            include: { company: true },
          },
          sources: true,
        },
      });

      return newDeal;
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error('Create deal error:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}
