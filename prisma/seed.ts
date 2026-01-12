/**
 * Seed script for AI Circular Deals MVP
 * 
 * This seeds the database with the OpenAI ↔ Microsoft ↔ NVIDIA triangle case study.
 * These are structured sample records representing real-world deals for MVP demonstration.
 * 
 * Run: npx prisma db seed
 */

import { PrismaClient, DealType, FlowType, PartyRole, FlowDirection, SourceType, DataStatus } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================================================
  // COMPANIES
  // ============================================================================
  
  const openai = await prisma.company.upsert({
    where: { slug: 'openai' },
    update: {},
    create: {
      name: 'OpenAI',
      slug: 'openai',
      description: 'AI research and deployment company, creator of GPT and ChatGPT',
      websiteUrl: 'https://openai.com',
      logoUrl: '/logos/openai.svg',
    },
  });

  const microsoft = await prisma.company.upsert({
    where: { slug: 'microsoft' },
    update: {},
    create: {
      name: 'Microsoft',
      slug: 'microsoft',
      ticker: 'MSFT',
      description: 'Technology corporation, Azure cloud provider, major OpenAI investor',
      websiteUrl: 'https://microsoft.com',
      logoUrl: '/logos/microsoft.svg',
    },
  });

  const nvidia = await prisma.company.upsert({
    where: { slug: 'nvidia' },
    update: {},
    create: {
      name: 'NVIDIA',
      slug: 'nvidia',
      ticker: 'NVDA',
      description: 'GPU and AI chip manufacturer, dominant in AI training hardware',
      websiteUrl: 'https://nvidia.com',
      logoUrl: '/logos/nvidia.svg',
    },
  });

  console.log('✅ Companies created:', openai.name, microsoft.name, nvidia.name);

  // ============================================================================
  // DEALS - The Triangle
  // ============================================================================

  // Clear existing deals for clean re-seed
  await prisma.dealParty.deleteMany({});
  await prisma.source.deleteMany({});
  await prisma.deal.deleteMany({});

  // Deal 1: Microsoft → OpenAI Partnership/Investment
  const deal1 = await prisma.deal.create({
    data: {
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
      parties: {
        create: [
          { companyId: microsoft.id, role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
          { companyId: openai.id, role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
        ],
      },
      sources: {
        create: [
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
    },
  });

  // Deal 2: OpenAI → Microsoft Azure Commitment
  const deal2 = await prisma.deal.create({
    data: {
      title: 'OpenAI Azure Cloud Services Commitment',
      summary: 'OpenAI has committed to purchasing up to $250 billion in Azure cloud services from Microsoft, representing a massive long-term cloud infrastructure agreement.',
      dealType: DealType.CLOUD_COMMITMENT,
      flowType: FlowType.SERVICE,
      announcedAt: new Date('2025-01-01'),
      amountUSDMax: 250_000_000_000,
      amountText: 'Up to $250 billion in Azure services',
      dataStatus: DataStatus.CONFIRMED,
      tags: ['cloud', 'infrastructure', 'commitment'],
      parties: {
        create: [
          { companyId: openai.id, role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
          { companyId: microsoft.id, role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
        ],
      },
      sources: {
        create: [
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
    },
  });

  // Deal 3: NVIDIA → OpenAI Investment
  const deal3 = await prisma.deal.create({
    data: {
      title: 'NVIDIA Investment in OpenAI',
      summary: 'NVIDIA intends to invest up to $100 billion in OpenAI, with funding deployed progressively as OpenAI scales its infrastructure deployment.',
      dealType: DealType.INVESTMENT,
      flowType: FlowType.MONEY,
      announcedAt: new Date('2025-01-01'),
      amountUSDMax: 100_000_000_000,
      amountText: 'Up to $100 billion (progressive)',
      dataStatus: DataStatus.CONFIRMED,
      tags: ['investment', 'progressive', 'infrastructure'],
      parties: {
        create: [
          { companyId: nvidia.id, role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
          { companyId: openai.id, role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
        ],
      },
      sources: {
        create: [
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
    },
  });

  // Deal 4: OpenAI → NVIDIA GPU Deployment Commitment
  const deal4 = await prisma.deal.create({
    data: {
      title: 'OpenAI NVIDIA Systems Deployment Commitment',
      summary: 'OpenAI commits to deploying at least 10GW of NVIDIA systems, representing millions of GPUs for AI training and inference infrastructure.',
      dealType: DealType.SUPPLY,
      flowType: FlowType.COMPUTE_HARDWARE,
      announcedAt: new Date('2025-01-01'),
      amountText: '10GW of NVIDIA systems (millions of GPUs)',
      dataStatus: DataStatus.CONFIRMED,
      tags: ['hardware', 'gpu', 'infrastructure', 'commitment'],
      parties: {
        create: [
          { companyId: openai.id, role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
          { companyId: nvidia.id, role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
        ],
      },
      sources: {
        create: [
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
    },
  });

  // Deal 5: Microsoft → NVIDIA GPU Infrastructure
  const deal5 = await prisma.deal.create({
    data: {
      title: 'Microsoft Azure NVIDIA GPU Infrastructure',
      summary: 'Microsoft Azure adopts and deploys NVIDIA platforms including Blackwell and Rubin architectures. Azure GPU infrastructure is predominantly NVIDIA-based.',
      dealType: DealType.SUPPLY,
      flowType: FlowType.COMPUTE_HARDWARE,
      announcedAt: new Date('2024-03-18'),
      amountText: 'Multi-billion dollar ongoing relationship',
      dataStatus: DataStatus.ESTIMATED,
      tags: ['hardware', 'cloud', 'gpu', 'blackwell', 'rubin'],
      parties: {
        create: [
          { companyId: microsoft.id, role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
          { companyId: nvidia.id, role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
        ],
      },
      sources: {
        create: [
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
    },
  });

  console.log('✅ Deals created:', deal1.title.slice(0, 40) + '...');
  console.log('✅ Deals created:', deal2.title.slice(0, 40) + '...');
  console.log('✅ Deals created:', deal3.title.slice(0, 40) + '...');
  console.log('✅ Deals created:', deal4.title.slice(0, 40) + '...');
  console.log('✅ Deals created:', deal5.title.slice(0, 40) + '...');

  console.log('\n🎉 Seeding complete!');
  console.log('Triangle case study: OpenAI ↔ Microsoft ↔ NVIDIA');
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
