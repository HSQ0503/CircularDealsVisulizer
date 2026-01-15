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
    description: 'AI research company founded in 2015, creator of GPT and ChatGPT. Restructured as a public benefit corporation (OpenAI Group PBC) in 2025. Mission: ensure artificial general intelligence benefits all humanity.',
    websiteUrl: 'https://openai.com',
    logoUrl: '/logos/openai.svg',
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    ticker: 'MSFT',
    description: 'Technology corporation valued at ~$3.5 trillion. Operates Azure, the world\'s second-largest cloud platform ($75B revenue in FY2025). Major OpenAI investor and exclusive cloud partner. Products span Office 365, Windows, Xbox, and enterprise solutions.',
    websiteUrl: 'https://microsoft.com',
    logoUrl: '/logos/microsoft.svg',
  },
  {
    slug: 'nvidia',
    name: 'NVIDIA',
    ticker: 'NVDA',
    description: 'Dominant AI chip company controlling ~90% of the AI accelerator market. Invented the GPU in 1999. Data center revenue represents 88% of total sales. Maker of Blackwell and upcoming Rubin AI architectures powering modern AI training and inference.',
    websiteUrl: 'https://nvidia.com',
    logoUrl: '/logos/nvidia.svg',
  },
  {
    slug: 'meta',
    name: 'Meta',
    ticker: 'META',
    description: 'Technology company focused on social platforms and AI research, formerly Facebook. Operates major AI research labs and builds large-scale AI infrastructure for training foundation models.',
    websiteUrl: 'https://meta.com',
    logoUrl: '/logos/meta.svg',
  },
  {
    slug: 'coreweave',
    name: 'CoreWeave',
    ticker: 'CRWV',
    description: 'AI-native cloud provider specializing in GPU compute infrastructure. NVIDIA Elite Cloud Service Provider offering large-scale AI, ML, and VFX workloads on NVIDIA platforms.',
    websiteUrl: 'https://coreweave.com',
    logoUrl: '/logos/coreweave.svg',
  },
  {
    slug: 'scale-ai',
    name: 'Scale AI',
    description: 'AI data labeling and infrastructure company founded in 2016. Provides data annotation services for training AI models. Major clients included OpenAI, Google, and Microsoft before Meta\'s 49% stake acquisition in 2025.',
    websiteUrl: 'https://scale.com',
    logoUrl: '/logos/scale-ai.svg',
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
    summary: 'Microsoft invested $10 billion in OpenAI as part of a multiyear, multibillion-dollar partnership extension. This built on previous investments of $1B in 2019 and additional funding in 2021. The deal secured exclusive cloud provider status and API access rights, valuing OpenAI at $29 billion.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2023-01-23'),
    amountUSD: 10_000_000_000,
    amountText: '$10 billion investment (part of multiyear commitment)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'partnership', 'exclusive'],
    parties: [
      { companySlug: 'microsoft', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'openai', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2023/01/23/microsoft-announces-multibillion-dollar-investment-in-chatgpt-maker-openai.html',
        publishedAt: new Date('2023-01-23'),
        excerpt: 'Microsoft announces new multibillion-dollar investment in ChatGPT-maker OpenAI',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'openai-azure-commitment-2025',
    title: 'OpenAI Azure Cloud Services Commitment',
    summary: 'As part of the restructuring deal announced October 2025, OpenAI committed to purchasing an incremental $250 billion in Azure cloud services from Microsoft. Microsoft receives a 27% stake in the new OpenAI Group PBC valued at ~$135 billion, while retaining IP rights to OpenAI models through 2032.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-10-28'),
    amountUSD: 250_000_000_000,
    amountText: '$250 billion incremental Azure services commitment',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'commitment', 'restructuring'],
    parties: [
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'microsoft', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Microsoft',
        url: 'https://blogs.microsoft.com/blog/2025/10/28/the-next-chapter-of-the-microsoft-openai-partnership/',
        publishedAt: new Date('2025-10-28'),
        excerpt: 'The next chapter of the Microsoft-OpenAI partnership',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'nvidia-openai-investment-2025',
    title: 'NVIDIA Investment in OpenAI',
    summary: 'NVIDIA intends to invest up to $100 billion in OpenAI as part of the 10GW systems deployment deal. The initial $10 billion tranche is locked at a $500 billion valuation, with nine successive $10 billion rounds planned, each priced at then-current valuations as new capacity comes online.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-09-22'),
    amountUSDMax: 100_000_000_000,
    amountText: 'Up to $100 billion (ten $10B tranches)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'progressive', 'infrastructure', 'stargate'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'openai', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2025/09/22/nvidia-openai-data-center.html',
        publishedAt: new Date('2025-09-22'),
        excerpt: 'Nvidia plans to invest up to $100 billion in OpenAI as part of data center buildout',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'openai-nvidia-gpu-deployment-2025',
    title: 'OpenAI NVIDIA Systems Deployment Commitment',
    summary: 'OpenAI and NVIDIA signed a letter of intent for a landmark strategic partnership to deploy at least 10 gigawatts of NVIDIA systems—equivalent to 4-5 million GPUs. The first gigawatt will be deployed in H2 2026 on the NVIDIA Vera Rubin platform. Jensen Huang called it "the biggest AI infrastructure project in history."',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2025-09-22'),
    amountText: '10GW of NVIDIA systems (~4-5 million GPUs)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['hardware', 'gpu', 'infrastructure', 'stargate', 'vera-rubin'],
    parties: [
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'nvidia', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'NVIDIA',
        url: 'https://nvidianews.nvidia.com/news/openai-and-nvidia-announce-strategic-partnership-to-deploy-10gw-of-nvidia-systems',
        publishedAt: new Date('2025-09-22'),
        excerpt: 'OpenAI and NVIDIA Announce Strategic Partnership to Deploy 10 Gigawatts of NVIDIA Systems',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'microsoft-nvidia-gpu-infrastructure-2024',
    title: 'Microsoft Azure NVIDIA GPU Infrastructure',
    summary: 'Microsoft and NVIDIA announced major integrations at GTC 2024, bringing NVIDIA Grace Blackwell GB200 Superchips to Azure. Microsoft deployed the first at-scale GB300 NVL72 cluster with 4,600+ systems for OpenAI workloads. Azure now deploys hundreds of thousands of Blackwell GPUs across its AI Superfactory infrastructure.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2024-03-18'),
    amountText: 'Multi-billion dollar ongoing relationship',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['hardware', 'cloud', 'gpu', 'blackwell', 'gb200', 'gb300'],
    parties: [
      { companySlug: 'microsoft', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'nvidia', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Microsoft Azure',
        url: 'https://azure.microsoft.com/en-us/blog/microsoft-and-nvidia-accelerate-ai-development-and-performance/',
        publishedAt: new Date('2024-03-18'),
        excerpt: 'Microsoft and NVIDIA accelerate AI development and performance',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'meta-nvidia-rsc-2022',
    title: 'Meta AI Research SuperCluster (RSC) with NVIDIA DGX A100',
    summary: 'Meta collaborated with NVIDIA to build the AI Research SuperCluster (RSC) using NVIDIA DGX A100 systems and NVIDIA InfiniBand networking. At launch, it was the largest DGX A100 customer deployment, designed for large-scale AI training.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2022-01-24'),
    amountText: 'Thousands of A100 GPUs (largest DGX A100 deployment at time)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['hardware', 'gpu', 'supercomputer', 'dgx', 'a100', 'infiniband'],
    parties: [
      { companySlug: 'meta', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'nvidia', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.BLOG,
        publisher: 'NVIDIA',
        url: 'https://blogs.nvidia.com/blog/meta-ai-supercomputer-dgx/',
        publishedAt: new Date('2022-01-24'),
        excerpt: 'Meta builds AI Research SuperCluster with NVIDIA DGX A100',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.BLOG,
        publisher: 'Meta AI',
        url: 'https://ai.meta.com/blog/ai-rsc/',
        publishedAt: new Date('2022-01-24'),
        excerpt: 'Introducing the AI Research SuperCluster',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/technology/meta-introduces-fastest-ai-supercomputer-2022-01-24/',
        publishedAt: new Date('2022-01-24'),
        excerpt: 'Meta introduces fastest AI supercomputer',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'meta-nvidia-h100-buildout-2024',
    title: 'Meta H100 GPU Infrastructure Buildout',
    summary: 'Meta publicly announced plans to deploy approximately 350,000 NVIDIA H100 GPUs by end of 2024 to support its AI efforts, representing one of the largest H100 deployments globally.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2024-01-18'),
    amountText: '~350,000 H100 GPUs by end of 2024',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['hardware', 'gpu', 'h100', 'infrastructure'],
    parties: [
      { companySlug: 'meta', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'nvidia', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/technology/meta-bringing-together-ai-research-product-teams-2024-01-18/',
        publishedAt: new Date('2024-01-18'),
        excerpt: 'Meta plans to have ~350,000 H100 GPUs by end of 2024',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/technology/meta-deploy-in-house-custom-chips-this-year-power-ai-drive-memo-2024-02-01/',
        publishedAt: new Date('2024-02-01'),
        excerpt: 'Meta to deploy custom chips alongside NVIDIA GPUs',
        reliability: 5,
        confidence: 4,
      },
    ],
  },
  {
    slug: 'meta-nvidia-gpu-aggregate-2024',
    title: 'Meta NVIDIA GPU Aggregate Procurement (~1M GPUs)',
    summary: 'Reports indicate Meta has obtained approximately 1 million NVIDIA GPUs with an estimated value around $30 billion to train AI models, making it one of the largest GPU customers globally.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2024-05-01'),
    amountUSD: 30_000_000_000,
    amountText: '~$30B estimated for ~1M GPUs (aggregate)',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['hardware', 'gpu', 'procurement', 'aggregate'],
    parties: [
      { companySlug: 'meta', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'nvidia', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Business Insider',
        url: 'https://www.businessinsider.com/nvidia-impact-q1-earnings-season-ai-nvda-stock-price-capex-2024-5',
        publishedAt: new Date('2024-05-01'),
        excerpt: 'Meta among largest NVIDIA GPU customers',
        reliability: 4,
        confidence: 3,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'Analytics India Magazine',
        url: 'https://analyticsindiamag.com/news/yann-lecun/',
        publishedAt: new Date('2024-05-01'),
        excerpt: 'Yann LeCun discusses Meta AI infrastructure scale',
        reliability: 3,
        confidence: 3,
      },
    ],
  },
  {
    slug: 'meta-nvidia-spectrum-x-2025',
    title: 'Meta Adopts NVIDIA Spectrum-X Ethernet for AI Data Centers',
    summary: 'Meta will introduce switches built on NVIDIA Spectrum-X Ethernet platform for its FBOSS/Open Switching System, enabling high-performance AI cluster networking in Meta data centers.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2025-10-13'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['networking', 'spectrum-x', 'ethernet', 'infrastructure', 'fboss'],
    parties: [
      { companySlug: 'meta', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'nvidia', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'NVIDIA Investor Relations',
        url: 'https://investor.nvidia.com/news/press-release-details/2025/NVIDIA-Spectrum-X-Ethernet-Switches-Speed-Up-Networks-for-Meta-and-Oracle/default.aspx',
        publishedAt: new Date('2025-10-13'),
        excerpt: 'NVIDIA Spectrum-X Ethernet Switches Speed Up Networks for Meta and Oracle',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== CoreWeave ↔ NVIDIA Deals ====================
  {
    slug: 'coreweave-nvidia-partner-network-2020',
    title: 'CoreWeave Joins NVIDIA Partner Network as Preferred CSP',
    summary: 'CoreWeave joins the NVIDIA Partner Network (NPN) as a Preferred Cloud Service Provider, enabling access to NVIDIA GPU platforms for AI and accelerated computing workloads.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2020-09-05'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'cloud', 'gpu', 'csp'],
    parties: [
      { companySlug: 'coreweave', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'nvidia', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.BLOG,
        publisher: 'CoreWeave',
        url: 'https://www.coreweave.com/blog/coreweave-joins-nvidia-partner-network',
        publishedAt: new Date('2020-09-05'),
        excerpt: 'CoreWeave joins NVIDIA Partner Network',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'coreweave-nvidia-elite-csp-2021',
    title: 'CoreWeave Becomes NVIDIA First Elite Cloud Service Provider',
    summary: 'NVIDIA elevates CoreWeave to Elite Cloud Service Provider status—the highest tier—recognizing large-scale deployment of NVIDIA GPUs for AI, ML, and VFX workloads.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2021-07-14'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'elite', 'cloud', 'gpu', 'csp'],
    parties: [
      { companySlug: 'coreweave', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'nvidia', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.BLOG,
        publisher: 'CoreWeave',
        url: 'https://www.coreweave.com/blog/coreweave-achieves-nvidia-elite-cloud-service-provider-status',
        publishedAt: new Date('2021-07-14'),
        excerpt: 'CoreWeave achieves NVIDIA Elite Cloud Service Provider status',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'nvidia-coreweave-series-b-2023',
    title: 'NVIDIA Invests in CoreWeave Series B ($221M Round)',
    summary: 'NVIDIA participates as a strategic investor in CoreWeave\'s $221M Series B funding round, alongside Magnetar Capital, to accelerate AI-focused cloud infrastructure growth.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2023-04-20'),
    amountUSD: 221_000_000,
    amountText: '$221M total round (NVIDIA participation undisclosed portion)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'series-b', 'equity'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'TechCrunch',
        url: 'https://techcrunch.com/2023/04/20/coreweave-raises-221m-to-scale-its-ai-cloud/',
        publishedAt: new Date('2023-04-20'),
        excerpt: 'CoreWeave raises $221M to scale its AI cloud',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'nvidia-coreweave-project-osprey-2023',
    title: 'NVIDIA Rents GPU Cloud Capacity from CoreWeave (Project Osprey)',
    summary: 'Under an internal deal code-named Project Osprey, NVIDIA commits to renting large amounts of GPU cloud capacity from CoreWeave—effectively buying back compute powered by its own chips.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2023-04-10'),
    amountUSD: 1_300_000_000,
    amountText: '~$1.3 billion (multi-year through 2027)',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['cloud', 'compute', 'project-osprey', 'circular'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'The Information',
        url: 'https://www.theinformation.com/articles/nvidia-rents-1-3-billion-of-ai-compute-from-coreweave',
        publishedAt: new Date('2025-01-01'),
        excerpt: 'NVIDIA rents $1.3 billion of AI compute from CoreWeave',
        reliability: 4,
        confidence: 4,
      },
    ],
  },
  {
    slug: 'nvidia-coreweave-ipo-investment-2025',
    title: 'NVIDIA Anchors CoreWeave IPO with $250M Investment',
    summary: 'NVIDIA acts as a cornerstone investor in CoreWeave\'s IPO, committing $250M at the offering price to support long-term AI infrastructure expansion.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-03-27'),
    amountUSD: 250_000_000,
    amountText: '$250 million IPO investment',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'ipo', 'equity', 'cornerstone'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/world/us/nvidia-anchor-coreweave-ipo-with-250-million-investment-2025-03-27/',
        publishedAt: new Date('2025-03-27'),
        excerpt: 'NVIDIA to anchor CoreWeave IPO with $250 million investment',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'nvidia-coreweave-capacity-backstop-2025',
    title: 'NVIDIA $6.3B Cloud Capacity Backstop Agreement with CoreWeave',
    summary: 'NVIDIA signs a capacity backstop agreement, guaranteeing it will purchase unsold CoreWeave GPU cloud capacity, stabilizing CoreWeave\'s revenues and utilization.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-09-15'),
    amountUSD: 6_300_000_000,
    amountText: '$6.3 billion contracted capacity backstop',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'backstop', 'capacity', 'commitment', 'circular'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/technology/nvidia-coreweave-expand-ai-cloud-partnership-63-billion-deal-2025-09-15/',
        publishedAt: new Date('2025-09-15'),
        excerpt: 'NVIDIA, CoreWeave expand AI cloud partnership in $6.3 billion deal',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.SEC_FILING,
        publisher: 'SEC',
        url: 'https://www.sec.gov/ixviewer/documents/2025/coreweave-form-8k.htm',
        publishedAt: new Date('2025-09-15'),
        excerpt: 'CoreWeave Form 8-K filing',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Microsoft ↔ CoreWeave Deals ====================
  {
    slug: 'microsoft-coreweave-cloud-deal-2023',
    title: 'Microsoft Multi-Year Cloud Computing Deal with CoreWeave',
    summary: 'Microsoft signed a multi-year cloud computing infrastructure deal with CoreWeave to meet surging AI demand, particularly for OpenAI workloads. Microsoft committed to spend approximately $10 billion with CoreWeave from 2023 through the end of the decade. CoreWeave became a critical infrastructure partner, with Microsoft representing 62% of CoreWeave\'s revenue in 2024.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2023-06-01'),
    amountUSD: 10_000_000_000,
    amountText: '~$10 billion through end of decade',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'ai', 'openai-workloads'],
    parties: [
      { companySlug: 'microsoft', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2023/06/01/microsoft-inks-deal-with-coreweave-to-meet-openai-cloud-demand.html',
        publishedAt: new Date('2023-06-01'),
        excerpt: 'Microsoft signs deal for A.I. computing power with Nvidia-backed CoreWeave',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'The Information',
        url: 'https://www.theinformation.com/articles/microsoft-coreweave-10-billion',
        publishedAt: new Date('2025-04-01'),
        excerpt: 'Microsoft to spend $10B from 2023 to decade-end with CoreWeave',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== OpenAI ↔ CoreWeave Deals ====================
  {
    slug: 'openai-coreweave-infrastructure-2025',
    title: 'OpenAI Initial AI Infrastructure Agreement with CoreWeave',
    summary: 'CoreWeave announced a landmark deal to deliver AI infrastructure to OpenAI, expanding compute capacity for training and delivering its latest models at scale. As part of this deal, OpenAI invested $350 million in CoreWeave stock, becoming a strategic investor.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-03-10'),
    amountUSD: 11_900_000_000,
    amountText: 'Up to $11.9 billion contract value',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'ai-training', 'strategic'],
    parties: [
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'CoreWeave',
        url: 'https://www.coreweave.com/news/coreweave-announces-agreement-with-openai-to-deliver-ai-infrastructure',
        publishedAt: new Date('2025-03-10'),
        excerpt: 'CoreWeave Announces Agreement with OpenAI to Deliver AI Infrastructure',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'TechCrunch',
        url: 'https://techcrunch.com/2025/03/10/in-another-chess-move-with-microsoft-openai-is-pouring-12b-into-coreweave/',
        publishedAt: new Date('2025-03-10'),
        excerpt: 'OpenAI is pouring $12B into CoreWeave',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'openai-coreweave-equity-investment-2025',
    title: 'OpenAI Strategic Investment in CoreWeave ($350M)',
    summary: 'As part of the infrastructure agreement, OpenAI invested $350 million in CoreWeave stock, becoming a strategic investor in the AI cloud provider. This marked a significant shift in OpenAI diversifying its infrastructure beyond Microsoft Azure.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-03-10'),
    amountUSD: 350_000_000,
    amountText: '$350 million equity investment',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'equity', 'strategic'],
    parties: [
      { companySlug: 'openai', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'TechCrunch',
        url: 'https://techcrunch.com/2025/03/10/in-another-chess-move-with-microsoft-openai-is-pouring-12b-into-coreweave/',
        publishedAt: new Date('2025-03-10'),
        excerpt: 'OpenAI invested $350 million in CoreWeave stock',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'openai-coreweave-expansion-2025',
    title: 'OpenAI Expands CoreWeave Agreement by $6.5B',
    summary: 'CoreWeave announced an expanded agreement with OpenAI to power the training of its most advanced next-generation models. This expansion brought the total contract value with OpenAI to approximately $22.4 billion.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-09-25'),
    amountUSD: 6_500_000_000,
    amountText: '$6.5 billion expansion (total ~$22.4B)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'expansion', 'next-gen-models'],
    parties: [
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'CoreWeave Investor Relations',
        url: 'https://investors.coreweave.com/news/news-details/2025/CoreWeave-Expands-Agreement-with-OpenAI-by-up-to-6-5B/default.aspx',
        publishedAt: new Date('2025-09-25'),
        excerpt: 'CoreWeave Expands Agreement with OpenAI by up to $6.5B',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2025/09/25/coreweave-openai-6point5-billion-deal.html',
        publishedAt: new Date('2025-09-25'),
        excerpt: 'CoreWeave inks $6.5 billion deal with OpenAI',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Meta ↔ CoreWeave Deals ====================
  {
    slug: 'meta-coreweave-infrastructure-2025',
    title: 'Meta $14.2B AI Cloud Infrastructure Deal with CoreWeave',
    summary: 'CoreWeave signed a $14.2 billion AI cloud infrastructure deal with Meta, running through 2031 with an option to renew. The deal grants Meta access to NVIDIA\'s cutting-edge GB300 systems for accelerating AI model training and inference. This complements Meta\'s internal data center builds while hedging supply risk.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-09-30'),
    amountUSD: 14_200_000_000,
    amountText: '$14.2 billion through 2031',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'gb300', 'ai-training'],
    parties: [
      { companySlug: 'meta', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2025/09/30/coreweave-meta-deal-ai.html',
        publishedAt: new Date('2025-09-30'),
        excerpt: 'CoreWeave stock closes up 12% after company lands $14 billion deal with Meta',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'Bloomberg',
        url: 'https://www.bloomberg.com/news/articles/2025-09-30/coreweave-inks-14-billion-meta-deal-in-latest-sign-of-ai-demand',
        publishedAt: new Date('2025-09-30'),
        excerpt: 'CoreWeave Inks $14 Billion Meta Deal, Highlighting AI Demand',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Meta ↔ Microsoft Deals ====================
  {
    slug: 'meta-microsoft-llama2-partnership-2023',
    title: 'Meta-Microsoft Llama 2 AI Partnership',
    summary: 'Microsoft and Meta expanded their AI partnership with Microsoft becoming the preferred partner for Llama 2. The collaboration includes Llama 2 availability on Azure and Windows, integration with Azure AI Content Safety, and joint work on PyTorch optimization. This builds on their longstanding collaboration including ONNX Runtime integration and the PyTorch Foundation.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2023-07-18'),
    amountText: 'Strategic partnership (no disclosed value)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'llama', 'open-source', 'azure', 'pytorch'],
    parties: [
      { companySlug: 'meta', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'microsoft', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Microsoft',
        url: 'https://blogs.microsoft.com/blog/2023/07/18/microsoft-and-meta-expand-their-ai-partnership-with-llama-2-on-azure-and-windows/',
        publishedAt: new Date('2023-07-18'),
        excerpt: 'Microsoft and Meta expand their AI partnership with Llama 2 on Azure and Windows',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Meta',
        url: 'https://about.fb.com/news/2023/07/llama-2/',
        publishedAt: new Date('2023-07-18'),
        excerpt: 'Meta and Microsoft Introduce the Next Generation of Llama',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Meta ↔ Scale AI Deals ====================
  {
    slug: 'meta-scale-ai-investment-2025',
    title: 'Meta $14.3B Investment in Scale AI (49% Stake)',
    summary: 'Meta acquired a 49% non-voting stake in Scale AI for $14.3 billion, valuing the company at $29 billion. The deal brought Scale AI founder Alexandr Wang to Meta as Chief AI Officer to lead the new Superintelligence division. This is Meta\'s largest outside investment ever, driven by Zuckerberg\'s frustration with AI rivals like OpenAI appearing ahead.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-06-10'),
    amountUSD: 14_300_000_000,
    amountText: '$14.3 billion for 49% non-voting stake',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'acquisition', 'data-labeling', 'superintelligence', 'talent'],
    parties: [
      { companySlug: 'meta', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'scale-ai', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2025/06/10/zuckerberg-makes-metas-biggest-bet-on-ai-14-billion-scale-ai-deal.html',
        publishedAt: new Date('2025-06-10'),
        excerpt: 'A frustrated Zuckerberg makes his biggest AI bet as Meta nears $14 billion stake in Scale AI',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'Fortune',
        url: 'https://fortune.com/2025/06/22/inside-rise-scale-alexandr-wang-meta-zuckerberg-14-billion-deal-acquihire-ai-supremacy-race/',
        publishedAt: new Date('2025-06-22'),
        excerpt: 'The inside story of Scale AI cofounder Alexandr Wang\'s rise and the $14 billion Meta deal',
        reliability: 5,
        confidence: 5,
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
