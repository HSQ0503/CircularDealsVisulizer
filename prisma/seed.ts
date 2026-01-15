/**
 * Seed script for AI Circular Deals
 *
 * This script is ADDITIVE - it will not delete existing data.
 * Companies and deals are upserted based on unique identifiers.
 *
 * Run: npx prisma db seed
 *
 * To add new companies/deals, add them to the COMPANIES and DEALS arrays below.
 */

import { PrismaClient, DealType, FlowType, PartyRole, FlowDirection, SourceType, DataStatus } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// ============================================================================
// COMPANY DATA - Add new companies here
// ============================================================================

interface CompanyData {
  slug: string;
  name: string;
  ticker?: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
}

const COMPANIES: CompanyData[] = [
  {
    slug: 'openai',
    name: 'OpenAI',
    description: 'AI research and deployment company, creator of GPT and ChatGPT',
    websiteUrl: 'https://openai.com',
    logoUrl: '/logos/openai.svg',
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    ticker: 'MSFT',
    description: 'Technology corporation, Azure cloud provider, major OpenAI investor',
    websiteUrl: 'https://microsoft.com',
    logoUrl: '/logos/microsoft.svg',
  },
  {
    slug: 'nvidia',
    name: 'NVIDIA',
    ticker: 'NVDA',
    description: 'GPU and AI chip manufacturer, dominant in AI training hardware',
    websiteUrl: 'https://nvidia.com',
    logoUrl: '/logos/nvidia.svg',
  },
];

// ============================================================================
// DEAL DATA - Add new deals here
// ============================================================================

interface DealPartyData {
  companySlug: string;
  role: PartyRole;
  direction: FlowDirection;
  notes?: string;
}

interface SourceData {
  sourceType: SourceType;
  publisher: string;
  url: string;
  publishedAt?: Date;
  excerpt?: string;
  reliability?: number;
  confidence?: number;
}

interface DealData {
  slug: string; // Unique identifier for upsert
  title: string;
  summary: string;
  dealType: DealType;
  flowType: FlowType;
  announcedAt: Date;
  amountUSD?: number;
  amountUSDMin?: number;
  amountUSDMax?: number;
  amountText?: string;
  dataStatus: DataStatus;
  tags: string[];
  parties: DealPartyData[];
  sources: SourceData[];
}

const DEALS: DealData[] = [
  {
    slug: 'microsoft-openai-investment-2023',
    title: 'Microsoft Strategic Partnership & Investment in OpenAI',
    summary: 'Microsoft has made cumulative investments in OpenAI totaling billions of dollars, securing exclusive cloud provider status and API access rights. The partnership includes revenue sharing arrangements and technology collaboration.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2023-01-23'),
    amountUSDMin: 10_000_000_000,
    amountUSDMax: 13_000_000_000,
    amountText: '$10-13 billion cumulative investment',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['investment', 'partnership', 'exclusive'],
    parties: [
      { companySlug: 'microsoft', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'openai', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'The New York Times',
        url: 'https://www.nytimes.com/2023/01/23/business/microsoft-chatgpt-artificial-intelligence.html',
        publishedAt: new Date('2023-01-23'),
        excerpt: 'Microsoft to invest billions in ChatGPT maker OpenAI',
        reliability: 5,
        confidence: 4,
      },
    ],
  },
  {
    slug: 'openai-azure-commitment-2025',
    title: 'OpenAI Azure Cloud Services Commitment',
    summary: 'OpenAI has committed to purchasing up to $250 billion in Azure cloud services from Microsoft, representing a massive long-term cloud infrastructure agreement.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-01-01'),
    amountUSDMax: 250_000_000_000,
    amountText: 'Up to $250 billion in Azure services',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'commitment'],
    parties: [
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'microsoft', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Microsoft',
        url: 'https://news.microsoft.com/openai-azure-partnership',
        publishedAt: new Date('2025-01-01'),
        excerpt: 'OpenAI commits to Azure infrastructure for AI workloads',
        reliability: 5,
        confidence: 4,
      },
    ],
  },
  {
    slug: 'nvidia-openai-investment-2025',
    title: 'NVIDIA Investment in OpenAI',
    summary: 'NVIDIA intends to invest up to $100 billion in OpenAI, with funding deployed progressively as OpenAI scales its infrastructure deployment.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-01-01'),
    amountUSDMax: 100_000_000_000,
    amountText: 'Up to $100 billion (progressive)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'progressive', 'infrastructure'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'openai', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://reuters.com/nvidia-openai-investment',
        publishedAt: new Date('2025-01-01'),
        excerpt: 'NVIDIA announces major investment commitment in OpenAI',
        reliability: 4,
        confidence: 4,
      },
    ],
  },
  {
    slug: 'openai-nvidia-gpu-deployment-2025',
    title: 'OpenAI NVIDIA Systems Deployment Commitment',
    summary: 'OpenAI commits to deploying at least 10GW of NVIDIA systems, representing millions of GPUs for AI training and inference infrastructure.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2025-01-01'),
    amountText: '10GW of NVIDIA systems (millions of GPUs)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['hardware', 'gpu', 'infrastructure', 'commitment'],
    parties: [
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'nvidia', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'OpenAI',
        url: 'https://openai.com/infrastructure-announcement',
        publishedAt: new Date('2025-01-01'),
        excerpt: 'OpenAI announces massive GPU infrastructure expansion',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'microsoft-nvidia-gpu-infrastructure-2024',
    title: 'Microsoft Azure NVIDIA GPU Infrastructure',
    summary: 'Microsoft Azure adopts and deploys NVIDIA platforms including Blackwell and Rubin architectures. Azure GPU infrastructure is predominantly NVIDIA-based.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2024-03-18'),
    amountText: 'Multi-billion dollar ongoing relationship',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['hardware', 'cloud', 'gpu', 'blackwell', 'rubin'],
    parties: [
      { companySlug: 'microsoft', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'nvidia', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'NVIDIA',
        url: 'https://nvidianews.nvidia.com/azure-partnership',
        publishedAt: new Date('2024-03-18'),
        excerpt: 'Microsoft Azure to deploy NVIDIA Blackwell platforms',
        reliability: 5,
        confidence: 4,
      },
    ],
  },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedCompanies(): Promise<Map<string, string>> {
  console.log('📦 Seeding companies...');
  const slugToId = new Map<string, string>();

  for (const company of COMPANIES) {
    const result = await prisma.company.upsert({
      where: { slug: company.slug },
      update: {
        name: company.name,
        ticker: company.ticker,
        description: company.description,
        websiteUrl: company.websiteUrl,
        logoUrl: company.logoUrl,
      },
      create: company,
    });
    slugToId.set(company.slug, result.id);
    console.log(`  ✓ ${result.name}`);
  }

  return slugToId;
}

async function seedDeals(companySlugToId: Map<string, string>): Promise<void> {
  console.log('📋 Seeding deals...');

  for (const deal of DEALS) {
    // Check if deal already exists by looking for a deal with matching title and date
    const existingDeal = await prisma.deal.findFirst({
      where: {
        title: deal.title,
        announcedAt: deal.announcedAt,
      },
    });

    if (existingDeal) {
      console.log(`  ⏭ Skipping existing: ${deal.title.slice(0, 50)}...`);
      continue;
    }

    // Resolve company slugs to IDs
    const partiesWithIds = deal.parties.map(p => {
      const companyId = companySlugToId.get(p.companySlug);
      if (!companyId) {
        throw new Error(`Company not found: ${p.companySlug}`);
      }
      return {
        companyId,
        role: p.role,
        direction: p.direction,
        notes: p.notes,
      };
    });

    await prisma.deal.create({
      data: {
        title: deal.title,
        summary: deal.summary,
        dealType: deal.dealType,
        flowType: deal.flowType,
        announcedAt: deal.announcedAt,
        amountUSD: deal.amountUSD,
        amountUSDMin: deal.amountUSDMin,
        amountUSDMax: deal.amountUSDMax,
        amountText: deal.amountText,
        dataStatus: deal.dataStatus,
        tags: deal.tags,
        parties: {
          create: partiesWithIds,
        },
        sources: {
          create: deal.sources.map(s => ({
            sourceType: s.sourceType,
            publisher: s.publisher,
            url: s.url,
            publishedAt: s.publishedAt,
            excerpt: s.excerpt,
            reliability: s.reliability ?? 3,
            confidence: s.confidence ?? 3,
          })),
        },
      },
    });

    console.log(`  ✓ ${deal.title.slice(0, 50)}...`);
  }
}

async function main() {
  console.log('🌱 Seeding database (additive mode)...\n');

  // Seed companies first, get slug->id mapping
  const companySlugToId = await seedCompanies();

  // Also fetch any existing companies not in COMPANIES array
  const allCompanies = await prisma.company.findMany();
  for (const company of allCompanies) {
    if (!companySlugToId.has(company.slug)) {
      companySlugToId.set(company.slug, company.id);
    }
  }

  console.log('');

  // Seed deals
  await seedDeals(companySlugToId);

  console.log('\n🎉 Seeding complete!');
  console.log(`Total companies: ${companySlugToId.size}`);
  console.log('Run the app and visit /graph to see the visualization.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
