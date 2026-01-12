/**
 * Graph API Route
 * 
 * GET /api/graph?caseStudy=triangle&flowTypes=MONEY,SERVICE&minConfidence=3
 * 
 * Returns nodes, edges, and deal details for visualization
 */

import { NextRequest, NextResponse } from 'next/server';
import { deriveGraph } from '@/lib/graph/deriveGraph';
import { DealType, FlowType } from '@prisma/client';
import type { GraphFilters } from '@/lib/graph/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const caseStudy = searchParams.get('caseStudy') || 'triangle';
    
    // Parse filters
    const filters: GraphFilters = {};

    const dealTypesParam = searchParams.get('dealTypes');
    if (dealTypesParam) {
      filters.dealTypes = dealTypesParam.split(',').filter(t => 
        Object.values(DealType).includes(t as DealType)
      ) as DealType[];
    }

    const flowTypesParam = searchParams.get('flowTypes');
    if (flowTypesParam) {
      filters.flowTypes = flowTypesParam.split(',').filter(t => 
        Object.values(FlowType).includes(t as FlowType)
      ) as FlowType[];
    }

    const minConfidence = searchParams.get('minConfidence');
    if (minConfidence) {
      filters.minConfidence = parseInt(minConfidence, 10);
    }

    const dateFrom = searchParams.get('dateFrom');
    if (dateFrom) {
      filters.dateFrom = dateFrom;
    }

    const dateTo = searchParams.get('dateTo');
    if (dateTo) {
      filters.dateTo = dateTo;
    }

    const graphData = await deriveGraph(caseStudy, filters);

    return NextResponse.json(graphData);
  } catch (error) {
    console.error('Graph API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch graph data' },
      { status: 500 }
    );
  }
}
