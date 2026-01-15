/**
 * Companies API Route
 *
 * GET /api/companies - Returns list of all companies
 * POST /api/companies - Create a new company
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface CompanyListItem {
  id: string;
  name: string;
  slug: string;
  ticker: string | null;
  logoUrl: string | null;
}

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        ticker: true,
        logoUrl: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Companies API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

type CreateCompanyRequest = {
  name: string;
  slug: string;
  ticker?: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<CreateCompanyRequest>;

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!body.slug || typeof body.slug !== 'string') {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await prisma.company.findUnique({
      where: { slug: body.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: `Company with slug "${body.slug}" already exists` },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name: body.name,
        slug: body.slug,
        ticker: body.ticker ?? null,
        description: body.description ?? null,
        websiteUrl: body.websiteUrl ?? null,
        logoUrl: body.logoUrl ?? null,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Create company error:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
