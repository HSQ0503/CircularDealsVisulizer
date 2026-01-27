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

import { PrismaClient, DealType, FlowType, PartyRole, FlowDirection, SourceType, DataStatus, ValuationType } from '@prisma/client';
import { deriveGraph } from '../lib/graph/deriveGraph';
import { computeNullModel } from '../lib/graph/nullModel';

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
  valuationUSD?: number;
  valuationType?: ValuationType;
  valuationAsOf?: Date;
  valuationSource?: string;
}

const COMPANIES: CompanyData[] = [
  {
    slug: 'openai',
    name: 'OpenAI',
    description: 'AI research company founded in 2015, creator of GPT and ChatGPT. Restructured as a public benefit corporation (OpenAI Group PBC) in 2025. Mission: ensure artificial general intelligence benefits all humanity.',
    websiteUrl: 'https://openai.com',
    logoUrl: '/logos/openai.svg',
    valuationUSD: 300_000_000_000,
    valuationType: ValuationType.PRIVATE,
    valuationAsOf: new Date('2025-03-01'),
    valuationSource: 'Series F funding round led by SoftBank ($40B raised at $300B valuation)',
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    ticker: 'MSFT',
    description: 'Technology corporation valued at ~$3.4 trillion. Operates Azure, the world\'s second-largest cloud platform ($75B revenue in FY2025). Major OpenAI investor and exclusive cloud partner. Products span Office 365, Windows, Xbox, and enterprise solutions.',
    websiteUrl: 'https://microsoft.com',
    logoUrl: '/logos/microsoft.svg',
    valuationUSD: 3_420_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NASDAQ market capitalization',
  },
  {
    slug: 'nvidia',
    name: 'NVIDIA',
    ticker: 'NVDA',
    description: 'Dominant AI chip company controlling ~90% of the AI accelerator market. Invented the GPU in 1999. Data center revenue represents 88% of total sales. Maker of Blackwell and upcoming Rubin AI architectures powering modern AI training and inference.',
    websiteUrl: 'https://nvidia.com',
    logoUrl: '/logos/nvidia.svg',
    valuationUSD: 4_530_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NASDAQ market capitalization - world\'s most valuable company',
  },
  {
    slug: 'meta',
    name: 'Meta',
    ticker: 'META',
    description: 'Technology company focused on social platforms and AI research, formerly Facebook. Operates major AI research labs and builds large-scale AI infrastructure for training foundation models.',
    websiteUrl: 'https://meta.com',
    logoUrl: '/logos/meta.svg',
    valuationUSD: 1_560_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NASDAQ market capitalization',
  },
  {
    slug: 'coreweave',
    name: 'CoreWeave',
    ticker: 'CRWV',
    description: 'AI-native cloud provider specializing in GPU compute infrastructure. NVIDIA Elite Cloud Service Provider offering large-scale AI, ML, and VFX workloads on NVIDIA platforms.',
    websiteUrl: 'https://coreweave.com',
    logoUrl: '/logos/coreweave.svg',
    valuationUSD: 45_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NASDAQ market capitalization (IPO in 2025)',
  },
  {
    slug: 'scale-ai',
    name: 'Scale AI',
    description: 'AI data labeling and infrastructure company founded in 2016. Provides data annotation services for training AI models. Major clients included OpenAI, Google, and Microsoft before Meta\'s 49% stake acquisition in 2025.',
    websiteUrl: 'https://scale.com',
    logoUrl: '/logos/scale-ai.svg',
    valuationUSD: 29_000_000_000,
    valuationType: ValuationType.PRIVATE,
    valuationAsOf: new Date('2025-06-12'),
    valuationSource: 'Meta $14.3B investment for 49% stake (Series G-1)',
  },
  {
    slug: 'google',
    name: 'Google',
    ticker: 'GOOGL',
    description: 'Technology giant and Alphabet subsidiary. Operates Google Cloud Platform (GCP), the third-largest cloud provider. Develops AI through Google DeepMind, creator of Gemini models. Major investor in AI startups including Anthropic.',
    websiteUrl: 'https://google.com',
    logoUrl: '/logos/google.svg',
    valuationUSD: 4_000_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-12'),
    valuationSource: 'NASDAQ market capitalization (Alphabet parent company)',
  },
  {
    slug: 'anthropic',
    name: 'Anthropic',
    description: 'AI safety company founded in 2021 by former OpenAI researchers. Creator of Claude, a leading AI assistant. Focused on building reliable, interpretable AI systems. Backed by Google, Amazon, Microsoft, and NVIDIA.',
    websiteUrl: 'https://anthropic.com',
    logoUrl: '/logos/anthropic.svg',
    valuationUSD: 350_000_000_000,
    valuationType: ValuationType.PRIVATE,
    valuationAsOf: new Date('2025-11-18'),
    valuationSource: 'Microsoft $5B and NVIDIA $10B investments (valued at $350B)',
  },
  {
    slug: 'cohere',
    name: 'Cohere',
    description: 'Enterprise AI company founded in 2019 by former Google researchers. Provides NLP APIs and large language models for businesses. Focused on enterprise deployment of generative AI.',
    websiteUrl: 'https://cohere.com',
    logoUrl: '/logos/cohere.svg',
    valuationUSD: 7_000_000_000,
    valuationType: ValuationType.PRIVATE,
    valuationAsOf: new Date('2025-09-24'),
    valuationSource: '$100M extension round (total $600M at $7B valuation)',
  },
  {
    slug: 'runway',
    name: 'Runway',
    description: 'Generative AI company specializing in video and creative tools. Known for Gen-2 text-to-video models. Provides AI-powered creative suite for filmmakers and content creators.',
    websiteUrl: 'https://runwayml.com',
    logoUrl: '/logos/runway.svg',
    valuationUSD: 3_550_000_000,
    valuationType: ValuationType.PRIVATE,
    valuationAsOf: new Date('2025-12-01'),
    valuationSource: 'Series D led by General Atlantic ($308M raised at $3B+)',
  },
  {
    slug: 'windsurf',
    name: 'Windsurf',
    description: 'AI coding startup (formerly Codeium) building AI-powered code generation and developer tools. Google acquired key talent ($2.4B) and Cognition bought remaining assets ($250M) in 2025.',
    websiteUrl: 'https://windsurf.ai',
    logoUrl: '/logos/windsurf.svg',
    valuationUSD: 2_400_000_000,
    valuationType: ValuationType.ACQUISITION,
    valuationAsOf: new Date('2025-07-11'),
    valuationSource: 'Google $2.4B licensing deal + talent acquisition',
  },
  {
    slug: 'amazon',
    name: 'Amazon',
    ticker: 'AMZN',
    description: 'E-commerce and cloud computing giant. Operates AWS, the world\'s largest cloud platform. Major AI investor with $8B stake in Anthropic. AWS serves as Anthropic\'s primary cloud and training partner.',
    websiteUrl: 'https://amazon.com',
    logoUrl: '/logos/amazon.svg',
    valuationUSD: 2_550_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-15'),
    valuationSource: 'NASDAQ market capitalization',
  },
  {
    slug: 'stability-ai',
    name: 'Stability AI',
    description: 'AI company behind Stable Diffusion, an open-source text-to-image model. Founded in 2020, pioneered democratized access to generative AI for image creation.',
    websiteUrl: 'https://stability.ai',
    logoUrl: '/logos/stability-ai.svg',
    valuationUSD: 1_000_000_000,
    valuationType: ValuationType.PRIVATE,
    valuationAsOf: new Date('2024-06-25'),
    valuationSource: '$80M funding round with new CEO appointment',
  },
  {
    slug: 'hugging-face',
    name: 'Hugging Face',
    description: 'AI community platform and model hub. Hosts thousands of open-source machine learning models, datasets, and tools. Known for the Transformers library and collaborative AI development.',
    websiteUrl: 'https://huggingface.co',
    logoUrl: '/logos/hugging-face.svg',
    valuationUSD: 4_500_000_000,
    valuationType: ValuationType.PRIVATE,
    valuationAsOf: new Date('2023-08-24'),
    valuationSource: 'Series D ($235M raised) backed by Google, Amazon, NVIDIA, IBM',
  },
  {
    slug: 'zoox',
    name: 'Zoox',
    description: 'Autonomous vehicle company developing self-driving robotaxis. Acquired by Amazon in 2020 for $1.2 billion. Building purpose-built autonomous vehicles for ride-hailing.',
    websiteUrl: 'https://zoox.com',
    logoUrl: '/logos/zoox.svg',
    valuationUSD: 1_200_000_000,
    valuationType: ValuationType.ACQUISITION,
    valuationAsOf: new Date('2020-06-26'),
    valuationSource: 'Amazon acquisition price',
  },
  {
    slug: 'irobot',
    name: 'iRobot',
    ticker: 'IRBTQ',
    description: 'Consumer robotics company known for the Roomba vacuum cleaner. Pioneer in home robotics. Filed Chapter 11 bankruptcy in December 2025 after Amazon acquisition fell through.',
    websiteUrl: 'https://irobot.com',
    logoUrl: '/logos/irobot.svg',
    valuationUSD: 10_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-14'),
    valuationSource: 'OTC Markets (trading as IRBTQ post-bankruptcy)',
  },
  {
    slug: 'softbank',
    name: 'SoftBank',
    ticker: 'SFTBY',
    description: 'Japanese conglomerate and investment holding company. Operates Vision Fund, one of the largest technology-focused venture capital funds. Chairman Masayoshi Son leads the Stargate Project. Largest investor in OpenAI after Microsoft.',
    websiteUrl: 'https://softbank.com',
    logoUrl: '/logos/softbank.svg',
    valuationUSD: 150_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-08'),
    valuationSource: 'Tokyo Stock Exchange (9984.T) - 4:1 stock split Jan 2026',
  },
  {
    slug: 'oracle',
    name: 'Oracle',
    ticker: 'ORCL',
    description: 'Enterprise software and cloud infrastructure company. Oracle Cloud Infrastructure (OCI) is a key Stargate Project partner, providing data center infrastructure for AI compute.',
    websiteUrl: 'https://oracle.com',
    logoUrl: '/logos/oracle.svg',
    valuationUSD: 549_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NYSE market capitalization',
  },
  {
    slug: 'xai',
    name: 'xAI',
    description: 'AI company founded by Elon Musk in 2023. Creator of Grok, a conversational AI assistant integrated with X (Twitter). Acquired X Corp in 2025. One of the fastest-growing AI companies.',
    websiteUrl: 'https://x.ai',
    logoUrl: '/logos/xai.svg',
    valuationUSD: 230_000_000_000,
    valuationType: ValuationType.PRIVATE,
    valuationAsOf: new Date('2026-01-06'),
    valuationSource: '$20B funding round (investors: NVIDIA, Cisco, Fidelity, QIA, MGX)',
  },
  {
    slug: 'amd',
    name: 'AMD',
    ticker: 'AMD',
    description: 'Advanced Micro Devices is a semiconductor company producing EPYC server processors and Instinct MI series AI accelerators. Primary competitor to NVIDIA in the AI accelerator market.',
    websiteUrl: 'https://amd.com',
    logoUrl: '/logos/amd.svg',
    valuationUSD: 377_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NASDAQ market capitalization',
  },
  {
    slug: 'intel',
    name: 'Intel',
    ticker: 'INTC',
    description: 'Semiconductor giant and CPU market leader. Operates Intel Foundry Services for chip manufacturing. Develops AI accelerators including Habana Gaudi series. Historically dominant in PC and server processors.',
    websiteUrl: 'https://intel.com',
    logoUrl: '/logos/intel.svg',
    valuationUSD: 231_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-15'),
    valuationSource: 'NASDAQ market capitalization',
  },
  {
    slug: 'ibm',
    name: 'IBM',
    ticker: 'IBM',
    description: 'Enterprise technology and consulting company. Operates IBM Cloud and develops enterprise AI solutions including watsonx. Long history in computing with focus on hybrid cloud and AI for business.',
    websiteUrl: 'https://ibm.com',
    logoUrl: '/logos/ibm.svg',
    valuationUSD: 286_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NYSE market capitalization',
  },
  // ============================================================================
  // SUPPLY CHAIN COMPANIES - Chip Manufacturing & Memory
  // ============================================================================
  {
    slug: 'tsmc',
    name: 'TSMC',
    ticker: 'TSM',
    description: 'Taiwan Semiconductor Manufacturing Company is the world\'s largest contract chip manufacturer. Produces chips for NVIDIA, AMD, Apple, and others. Controls ~60% of global foundry market. Manufactures the majority of advanced AI chips.',
    websiteUrl: 'https://tsmc.com',
    logoUrl: '/logos/tsmc.svg',
    valuationUSD: 1_050_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NYSE market capitalization (ADR)',
  },
  {
    slug: 'sk-hynix',
    name: 'SK Hynix',
    ticker: '000660.KS',
    description: 'South Korean semiconductor company and the world\'s largest HBM (High Bandwidth Memory) manufacturer. Supplies HBM3e memory chips essential for AI accelerators like NVIDIA H100 and Blackwell GPUs.',
    websiteUrl: 'https://skhynix.com',
    logoUrl: '/logos/sk-hynix.svg',
    valuationUSD: 120_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'Korea Exchange market capitalization',
  },
  {
    slug: 'micron',
    name: 'Micron',
    ticker: 'MU',
    description: 'American semiconductor company specializing in memory and storage. Major producer of DRAM and HBM for AI applications. Competes with SK Hynix and Samsung in AI memory market.',
    websiteUrl: 'https://micron.com',
    logoUrl: '/logos/micron.svg',
    valuationUSD: 115_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NASDAQ market capitalization',
  },
  // ============================================================================
  // INVESTORS - Infrastructure & Sovereign Funds
  // ============================================================================
  {
    slug: 'blackstone',
    name: 'Blackstone',
    ticker: 'BX',
    description: 'World\'s largest alternative asset manager with $1.1 trillion AUM. Major AI infrastructure investor through Blackstone Infrastructure Partners. Building hyperscale data centers for AI workloads globally.',
    websiteUrl: 'https://blackstone.com',
    logoUrl: '/logos/blackstone.svg',
    valuationUSD: 220_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NYSE market capitalization',
  },
  {
    slug: 'mgx',
    name: 'MGX',
    description: 'UAE-based sovereign investment fund established in 2024 with $100B+ mandate focused on AI infrastructure. Founding investor in Stargate Project. Backed by Abu Dhabi sovereign wealth.',
    websiteUrl: 'https://mgx.ae',
    logoUrl: '/logos/mgx.svg',
    valuationUSD: 100_000_000_000,
    valuationType: ValuationType.PRIVATE,
    valuationAsOf: new Date('2025-01-21'),
    valuationSource: 'Reported AI infrastructure mandate',
  },
  {
    slug: 'salesforce',
    name: 'Salesforce',
    ticker: 'CRM',
    description: 'Enterprise cloud software company and CRM market leader. Building Agentforce AI platform powered by partnerships with OpenAI and Anthropic. Active AI investor through Salesforce Ventures.',
    websiteUrl: 'https://salesforce.com',
    logoUrl: '/logos/salesforce.svg',
    valuationUSD: 320_000_000_000,
    valuationType: ValuationType.MARKET_CAP,
    valuationAsOf: new Date('2026-01-16'),
    valuationSource: 'NYSE market capitalization',
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
  // ==================== Google ↔ Meta Deals ====================
  {
    slug: 'google-meta-cloud-infrastructure-2025',
    title: 'Meta $10B Cloud Infrastructure Agreement with Google Cloud',
    summary: 'Meta signed a six-year partnership with Google Cloud worth over $10 billion to expand Meta\'s AI computing capacity using Google\'s servers, storage, and networking. This cloud commitment deal allows Meta to rent Google\'s cloud for AI workloads instead of solely building its own data centers.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-08-01'),
    amountUSD: 10_000_000_000,
    amountText: '$10 billion over 6 years',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'ai-compute', 'partnership'],
    parties: [
      { companySlug: 'meta', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'google', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/technology/meta-google-cloud-10-billion-deal-2025-08/',
        publishedAt: new Date('2025-08-01'),
        excerpt: 'Meta signs six-year, $10 billion cloud partnership with Google',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Google ↔ OpenAI Deals ====================
  {
    slug: 'google-openai-cloud-partnership-2025',
    title: 'OpenAI Cloud Capacity Partnership with Google Cloud',
    summary: 'In a surprising move, OpenAI struck a deal to use Google Cloud to meet surging compute needs for training and running its AI models. The arrangement—quietly finalized in May 2025—makes Google an additional cloud provider for OpenAI alongside its primary partner Microsoft. Google\'s cloud unit will supply OpenAI with compute and infrastructure for large-scale AI, diversifying OpenAI\'s reliance on Azure.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-06-01'),
    amountText: 'Undisclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'ai-training', 'diversification'],
    parties: [
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'google', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'The Information',
        url: 'https://www.theinformation.com/articles/openai-google-cloud-deal-2025',
        publishedAt: new Date('2025-06-01'),
        excerpt: 'OpenAI quietly signs deal with Google Cloud for AI compute',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Google ↔ NVIDIA Deals ====================
  {
    slug: 'google-nvidia-supercomputing-partnership-2023',
    title: 'Google Cloud & NVIDIA AI Supercomputing Partnership',
    summary: 'Google Cloud and NVIDIA announced an expanded collaboration to deliver new AI hardware and software integrations for generative AI. Unveiled at Google Cloud Next 2023, Google introduced its A3 VM instances powered by NVIDIA\'s latest H100 GPUs and made NVIDIA\'s AI platforms more accessible on Google Cloud. This deepened partnership provides Google Cloud customers with NVIDIA\'s cutting-edge GPUs and optimized AI frameworks to build and deploy massive AI models.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2023-08-29'),
    amountText: 'Strategic partnership (no disclosed value)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'gpu', 'h100', 'cloud', 'a3-vm'],
    parties: [
      { companySlug: 'google', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'nvidia', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Google Cloud',
        url: 'https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-and-nvidia-expand-partnership',
        publishedAt: new Date('2023-08-29'),
        excerpt: 'Google Cloud and NVIDIA expand partnership for generative AI',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'google-nvidia-blackwell-adoption-2024',
    title: 'Google Cloud Adopts NVIDIA Blackwell & DGX Cloud',
    summary: 'At NVIDIA\'s GTC 2024, Google Cloud adopted NVIDIA\'s new Grace Hopper (Blackwell) superchips and announced that NVIDIA\'s DGX Cloud (a full-stack AI supercomputing service) is now available on Google Cloud. The companies also integrated NVIDIA\'s AI software (e.g. JAX support on GPUs, NVIDIA\'s NIM inference services on Google Kubernetes Engine) to accelerate development of generative AI applications.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2024-03-18'),
    amountText: 'Strategic partnership (no disclosed value)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'blackwell', 'dgx-cloud', 'grace-hopper', 'nim'],
    parties: [
      { companySlug: 'google', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'nvidia', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'NVIDIA',
        url: 'https://nvidianews.nvidia.com/news/nvidia-google-cloud-gtc-2024',
        publishedAt: new Date('2024-03-18'),
        excerpt: 'NVIDIA and Google Cloud announce Blackwell and DGX Cloud availability',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Google ↔ Anthropic Deals ====================
  {
    slug: 'google-anthropic-investment-2023',
    title: 'Google $300M Investment in Anthropic + Cloud Partnership',
    summary: 'Google invested about $300 million in Anthropic—an AI startup building the Claude chatbot (a ChatGPT rival)—for a roughly 10% equity stake. Alongside the late-2022 investment, Anthropic named Google Cloud its "preferred cloud provider," agreeing to use Google\'s TPU and GPU infrastructure to co-develop and train its AI systems. The deal mirrors Microsoft\'s OpenAI strategy: Google provided capital and cloud resources, boosting Anthropic\'s valuation (~$5B) and securing a major AI workload on Google Cloud.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2023-02-03'),
    amountUSD: 300_000_000,
    amountText: '$300 million for ~10% stake',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'equity', 'cloud-partnership', 'tpu', 'claude'],
    parties: [
      { companySlug: 'google', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'anthropic', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Financial Times',
        url: 'https://www.ft.com/content/google-anthropic-300-million-investment',
        publishedAt: new Date('2023-02-03'),
        excerpt: 'Google invests $300 million in OpenAI rival Anthropic',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Google ↔ Cohere Deals ====================
  {
    slug: 'google-cohere-infrastructure-partnership-2021',
    title: 'Google Cloud Multi-Year AI Infrastructure Partnership with Cohere',
    summary: 'Google Cloud inked a multi-year deal with Cohere, a natural language processing startup founded by ex-Google researchers, to power Cohere\'s platform with Google\'s advanced AI infrastructure. Under this partnership, many of Cohere\'s large language models are trained and deployed on Google\'s TPU supercomputers, making Google Cloud the backbone for Cohere\'s NLP services. The go-to-market collaboration gave Cohere enterprise-grade compute to offer NLP APIs to businesses, while driving usage of Google\'s custom AI chips.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2021-11-17'),
    amountText: 'Multi-year partnership (undisclosed value)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'partnership', 'tpu', 'nlp', 'infrastructure'],
    parties: [
      { companySlug: 'cohere', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'google', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Google Cloud',
        url: 'https://cloud.google.com/blog/topics/partners/cohere-google-cloud-partnership',
        publishedAt: new Date('2021-11-17'),
        excerpt: 'Google Cloud and Cohere announce multi-year AI infrastructure partnership',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Google ↔ Runway Deals ====================
  {
    slug: 'google-runway-investment-2023',
    title: 'Google $100M Investment in Runway + Cloud Deal',
    summary: 'Google took part in a mid-2023 funding round for Runway, a generative AI startup known for text-to-video tools. Google\'s contribution (about $100 million out of a $141M round) came with a strategic perk: Runway agreed to make Google Cloud its preferred cloud provider for training and deploying its AI models. The deal valued Runway at ~$1.5B and enticed the startup to shift from a prior AWS hosting arrangement to Google\'s cloud, leveraging Google\'s AI-optimized infrastructure for Runway\'s growing customer demand.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2023-06-15'),
    amountUSD: 100_000_000,
    amountText: '$100 million (part of $141M round)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'equity', 'cloud-commitment', 'video-ai', 'generative'],
    parties: [
      { companySlug: 'google', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'runway', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'TechCrunch',
        url: 'https://techcrunch.com/2023/06/15/runway-raises-141-million-google/',
        publishedAt: new Date('2023-06-15'),
        excerpt: 'Runway raises $141M with Google as lead investor',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Google ↔ Windsurf Deals ====================
  {
    slug: 'google-windsurf-talent-acquisition-2025',
    title: 'Google $2.4B Windsurf AI Coding Talent & IP Deal',
    summary: 'After OpenAI\'s attempt to acquire the AI code-generation startup Windsurf fell through, Google swooped in to strike a $2.4 billion deal. Rather than a full acquisition, Google paid for a non-exclusive license to Windsurf\'s AI coding technology and hired the company\'s CEO, co-founder, and a team of senior engineers into Google DeepMind. Most of Windsurf\'s 250 employees and its ongoing business remained independent, but Google\'s big payout secured valuable coding AI expertise and product access (Windsurf\'s code assistant platform) for its own use.',
    dealType: DealType.ACQUISITION,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-07-01'),
    amountUSD: 2_400_000_000,
    amountText: '$2.4 billion for talent & technology license',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['talent-acquisition', 'license', 'coding-ai', 'deepmind'],
    parties: [
      { companySlug: 'google', role: PartyRole.ACQUIRER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'windsurf', role: PartyRole.TARGET, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'The Information',
        url: 'https://www.theinformation.com/articles/google-windsurf-2-4-billion-deal',
        publishedAt: new Date('2025-07-01'),
        excerpt: 'Google pays $2.4 billion for Windsurf talent and technology license',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Amazon ↔ Anthropic Deals ====================
  {
    slug: 'amazon-anthropic-investment-2024',
    title: 'Amazon $8B Investment in Anthropic',
    summary: 'Amazon invested a total of $8 billion in Anthropic through two tranches: $4 billion initially in September 2023 and an additional $4 billion in November 2024. AWS became Anthropic\'s primary cloud and training partner. Anthropic committed to using AWS Trainium and Inferentia chips for training and deploying its future foundation models, rather than its preferred NVIDIA processors.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2024-11-22'),
    amountUSD: 8_000_000_000,
    amountText: '$8 billion total ($4B in 2023 + $4B in 2024)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'equity', 'cloud-partnership', 'trainium', 'aws'],
    parties: [
      { companySlug: 'amazon', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'anthropic', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2024/11/22/amazon-to-invest-another-4-billion-in-anthropic-openais-biggest-rival.html',
        publishedAt: new Date('2024-11-22'),
        excerpt: 'Amazon to invest another $4 billion in Anthropic, OpenAI\'s biggest rival',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Amazon',
        url: 'https://www.aboutamazon.com/news/aws/amazon-invests-additional-4-billion-anthropic-ai',
        publishedAt: new Date('2024-11-22'),
        excerpt: 'Amazon and Anthropic deepen strategic collaboration',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Microsoft ↔ Anthropic Deals ====================
  {
    slug: 'microsoft-anthropic-investment-2025',
    title: 'Microsoft $5B Investment in Anthropic',
    summary: 'Microsoft invested up to $5 billion in Anthropic as part of a strategic partnership announced alongside NVIDIA. The deal valued Anthropic at approximately $350 billion. Claude models became available on Azure through Microsoft AI Foundry, and will be integrated across Microsoft\'s Copilot family including GitHub Copilot and Microsoft 365 Copilot.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-11-18'),
    amountUSD: 5_000_000_000,
    amountText: 'Up to $5 billion',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'equity', 'azure', 'copilot', 'strategic'],
    parties: [
      { companySlug: 'microsoft', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'anthropic', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Microsoft',
        url: 'https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/',
        publishedAt: new Date('2025-11-18'),
        excerpt: 'Microsoft, NVIDIA and Anthropic announce strategic partnerships',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2025/11/18/anthropic-ai-azure-microsoft-nvidia.html',
        publishedAt: new Date('2025-11-18'),
        excerpt: 'Anthropic valued in range of $350 billion following investment deal with Microsoft, Nvidia',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'anthropic-microsoft-azure-commitment-2025',
    title: 'Anthropic $30B Azure Cloud Commitment',
    summary: 'As part of the strategic partnership, Anthropic committed to purchasing $30 billion of Azure compute capacity. Anthropic will use up to one gigawatt of compute capacity with NVIDIA Grace Blackwell and Vera Rubin systems on Azure. This makes Claude the only frontier model available on all three major cloud platforms (AWS, Azure, and Google Cloud).',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-11-18'),
    amountUSD: 30_000_000_000,
    amountText: '$30 billion Azure compute commitment',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'azure', 'infrastructure', 'commitment', 'blackwell'],
    parties: [
      { companySlug: 'anthropic', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'microsoft', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'GeekWire',
        url: 'https://www.geekwire.com/2025/microsoft-to-invest-5b-in-anthropic-as-claude-maker-commits-30b-to-azure-in-new-nvidia-alliance/',
        publishedAt: new Date('2025-11-18'),
        excerpt: 'Microsoft to invest $5B in Anthropic, as Claude maker commits $30B to Azure in new Nvidia alliance',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== NVIDIA ↔ Anthropic Deals ====================
  {
    slug: 'nvidia-anthropic-investment-2025',
    title: 'NVIDIA $10B Investment in Anthropic',
    summary: 'NVIDIA invested up to $10 billion in Anthropic as part of a strategic partnership that includes deep technology collaboration. Anthropic and NVIDIA will work together on chip and model optimization, with the goal of optimizing Anthropic models for best performance on NVIDIA hardware and optimizing future NVIDIA architectures for Anthropic workloads. Anthropic will use Grace Blackwell and Vera Rubin hardware.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-11-18'),
    amountUSD: 10_000_000_000,
    amountText: 'Up to $10 billion',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'equity', 'technology-partnership', 'blackwell', 'rubin'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'anthropic', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Microsoft',
        url: 'https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/',
        publishedAt: new Date('2025-11-18'),
        excerpt: 'Microsoft, NVIDIA and Anthropic announce strategic partnerships',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'Axios',
        url: 'https://www.axios.com/2025/11/18/anthropic-microsoft-nvidia-15-billion',
        publishedAt: new Date('2025-11-18'),
        excerpt: 'Anthropic lands $15 billion investment from Microsoft, Nvidia',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== NVIDIA ↔ Cohere Deals ====================
  {
    slug: 'nvidia-cohere-investment-2024',
    title: 'NVIDIA Investment in Cohere Series D',
    summary: 'NVIDIA participated in Cohere\'s $500 million Series D funding round in July 2024, which valued the enterprise AI company at $5.5 billion. NVIDIA continued its investment in subsequent rounds, including the August 2025 round at $6.8 billion valuation. This ongoing investment supports Cohere\'s enterprise-focused large language model development.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2024-07-22'),
    amountText: 'Part of $500M Series D round',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'equity', 'series-d', 'enterprise-ai'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'cohere', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Crunchbase News',
        url: 'https://news.crunchbase.com/ai/startup-cohere-investment-salesforce-nvda/',
        publishedAt: new Date('2024-07-22'),
        excerpt: 'Salesforce, Nvidia, Cisco Invest In AI Startup Cohere At $5B Valuation',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.NEWS,
        publisher: 'TechCrunch',
        url: 'https://techcrunch.com/2024/07/22/cohere-raises-500m-to-beat-back-generative-ai-rivals/',
        publishedAt: new Date('2024-07-22'),
        excerpt: 'Cohere raises $500M to beat back generative AI rivals',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== NVIDIA ↔ Runway Deals ====================
  {
    slug: 'nvidia-runway-investment-2025',
    title: 'NVIDIA Investment in Runway Series D',
    summary: 'NVIDIA participated in Runway\'s $308 million Series D funding round in April 2025, which valued the AI video generation company at $3 billion. NVIDIA had previously invested in Runway\'s Series C alongside Google and Salesforce Ventures. Runway\'s Gen-4.5 model was developed entirely on NVIDIA GPUs.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-04-03'),
    amountText: 'Part of $308M Series D round',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'equity', 'series-d', 'video-ai', 'generative'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'runway', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'TechCrunch',
        url: 'https://techcrunch.com/2025/04/03/runway-best-known-for-its-video-generating-models-raises-308m/',
        publishedAt: new Date('2025-04-03'),
        excerpt: 'Runway, best known for its video-generating AI models, raises $308M',
        reliability: 5,
        confidence: 5,
      },
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Runway',
        url: 'https://runwayml.com/news/runway-series-d-funding',
        publishedAt: new Date('2025-04-03'),
        excerpt: 'Towards a new media ecosystem with world simulators',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'runway-nvidia-technology-partnership-2025',
    title: 'Runway & NVIDIA Technology Partnership',
    summary: 'Runway and NVIDIA established a deep technology partnership for video generation and world models. Runway\'s Gen-4.5 was developed entirely on NVIDIA GPUs across initial R&D, pre-training, post-training and inference. Runway is advancing its world models research with NVIDIA\'s Rubin architecture. Inference runs on NVIDIA Hopper and Blackwell series GPUs.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2025-10-01'),
    amountText: 'Strategic technology partnership',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'technology', 'rubin', 'blackwell', 'hopper', 'video-ai'],
    parties: [
      { companySlug: 'runway', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'nvidia', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Runway',
        url: 'https://runwayml.com/news/runway-partners-with-nvidia',
        publishedAt: new Date('2025-10-01'),
        excerpt: 'Runway Advances Video Generation and World Models With NVIDIA Rubin Platform',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== CoreWeave ↔ Runway Deals ====================
  {
    slug: 'coreweave-runway-cloud-deal-2025',
    title: 'CoreWeave Cloud Infrastructure Deal with Runway',
    summary: 'Runway signed a contract with CoreWeave to provide AI cloud solutions that will scale and accelerate its next generation video generation models. Runway will utilize CoreWeave\'s NVIDIA GB300 NVL72 systems for large-scale training and inference. The partnership enables Runway to train its latest AI models without geographical or cloud boundaries.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-12-11'),
    amountText: 'Contract value undisclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'gb300', 'video-ai', 'training'],
    parties: [
      { companySlug: 'runway', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'CoreWeave',
        url: 'https://investors.coreweave.com/news/news-details/2025/CoreWeave-Announces-Agreement-to-Power-Runways-Next-Generation-AI-Video-Models/default.aspx',
        publishedAt: new Date('2025-12-11'),
        excerpt: 'CoreWeave Announces Agreement to Power Runway\'s Next Generation AI Video Models',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Google ↔ Anthropic Additional Investment ====================
  {
    slug: 'google-anthropic-investment-2023-additional',
    title: 'Google Additional $2B Investment in Anthropic',
    summary: 'Google invested an additional $2 billion in Anthropic in late 2023, bringing its total investment to approximately $2.3 billion (including the initial $300 million in early 2023). This investment for a roughly 10% stake positioned Google as a major backer of Anthropic alongside Amazon.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2023-10-27'),
    amountUSD: 2_000_000_000,
    amountText: '$2 billion additional investment',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'equity', 'cloud-partnership'],
    parties: [
      { companySlug: 'google', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'anthropic', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Wall Street Journal',
        url: 'https://www.wsj.com/tech/ai/google-commits-2-billion-in-funding-to-ai-startup-anthropic-db4d4c50',
        publishedAt: new Date('2023-10-27'),
        excerpt: 'Google Commits $2 Billion in Funding to AI Startup Anthropic',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Cohere ↔ CoreWeave Deals ====================
  {
    slug: 'cohere-coreweave-data-center-2024',
    title: 'Cohere Multi-Billion Dollar Data Center Deal with CoreWeave',
    summary: 'Cohere struck a deal in late 2024 for CoreWeave to build and operate a dedicated multi-billion-dollar AI data center for its model training. CoreWeave provides Cohere access to thousands of Grace Blackwell GPUs to power next-gen AI training and inference at scale.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2024-12-01'),
    amountText: 'Multi-billion dollar data center deal',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['cloud', 'infrastructure', 'data-center', 'blackwell', 'training'],
    parties: [
      { companySlug: 'cohere', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Bloomberg',
        url: 'https://www.bloomberg.com/news/articles/2025-09-24/nvidia-backed-cohere-valued-at-7-billion-as-new-capital-flows-in',
        publishedAt: new Date('2025-09-24'),
        excerpt: 'Nvidia-Backed Cohere Valued at $7 Billion as New Capital Flows In',
        reliability: 5,
        confidence: 4,
      },
    ],
  },
  // ==================== AWS ↔ Meta Cloud Partnership ====================
  {
    slug: 'aws-meta-cloud-partnership-2021',
    title: 'Meta Selects AWS as Strategic Cloud Provider',
    summary: 'Meta deepened its relationship with AWS as a strategic cloud provider, broadening use of AWS compute, storage, database, and security services to complement its on-premises infrastructure. The collaboration includes optimizing PyTorch performance on AWS for AI research.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2021-12-01'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'partnership', 'pytorch', 'ai-research'],
    parties: [
      { companySlug: 'meta', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'amazon', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'AWS',
        url: 'https://aws.amazon.com/blogs/aws/meta-selects-aws-as-strategic-cloud-provider/',
        publishedAt: new Date('2021-12-01'),
        excerpt: 'Meta deepened its relationship with AWS as a strategic cloud provider',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== AWS ↔ NVIDIA AI Infrastructure Collaboration ====================
  {
    slug: 'aws-nvidia-ai-infrastructure-2023',
    title: 'AWS and NVIDIA AI Infrastructure Collaboration',
    summary: 'AWS and NVIDIA announced a multi-part collaboration to build the world\'s most scalable on-demand AI infrastructure. The partnership centers on new AWS EC2 instances powered by NVIDIA H100 GPUs, delivering up to 20 exaFLOPS of performance for training large AI models. Integrates NVIDIA NVLink networking with AWS custom silicon.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2023-03-21'),
    amountText: 'Strategic technology partnership',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'gpu', 'h100', 'cloud', 'infrastructure', 'nvlink'],
    parties: [
      { companySlug: 'amazon', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'nvidia', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'NVIDIA',
        url: 'https://nvidianews.nvidia.com/news/nvidia-aws-ai-infrastructure-gtc-2023',
        publishedAt: new Date('2023-03-21'),
        excerpt: 'AWS and NVIDIA announced a multi-part collaboration to build the world\'s most scalable on-demand AI infrastructure',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== OpenAI ↔ AWS Cloud Commitment ====================
  {
    slug: 'openai-aws-cloud-commitment-2025',
    title: 'OpenAI $38B AWS Cloud Commitment',
    summary: 'OpenAI signed a deal to pay AWS $38 billion over seven years for access to AWS\'s advanced cloud infrastructure. Under this strategic partnership, OpenAI will leverage hundreds of thousands of NVIDIA GPUs on AWS, with ability to scale to millions of cores, to run and train its AI workloads. This makes AWS a key cloud provider alongside Microsoft Azure and Google Cloud.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-11-03'),
    amountUSD: 38_000_000_000,
    amountText: '$38 billion over seven years',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'commitment', 'gpu', 'ai-training'],
    parties: [
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'amazon', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/technology/openai-aws-38-billion-cloud-deal-2025/',
        publishedAt: new Date('2025-11-03'),
        excerpt: 'OpenAI signed a deal to pay AWS $38 billion over seven years',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Stability AI ↔ AWS Cloud Partnership ====================
  {
    slug: 'stability-ai-aws-partnership-2022',
    title: 'Stability AI Chooses AWS as Preferred Cloud Provider',
    summary: 'Stability AI, the startup behind Stable Diffusion, announced AWS as its preferred cloud provider for building and scaling AI models. Stability AI uses thousands of NVIDIA GPUs on AWS and plans to use AWS SageMaker and AWS custom AI chips (Trainium) for training models under a multiyear partnership.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2022-11-30'),
    amountText: 'Not disclosed (multiyear commitment)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'partnership', 'stable-diffusion', 'trainium', 'sagemaker'],
    parties: [
      { companySlug: 'stability-ai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'amazon', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'AWS',
        url: 'https://aws.amazon.com/blogs/machine-learning/stability-ai-builds-foundation-models-on-amazon-sagemaker/',
        publishedAt: new Date('2022-11-30'),
        excerpt: 'Stability AI announced that AWS is now its preferred cloud provider',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Hugging Face ↔ AWS Partnership ====================
  {
    slug: 'hugging-face-aws-partnership-2021',
    title: 'Hugging Face and AWS Strategic Partnership',
    summary: 'Hugging Face and AWS announced a strategic partnership to simplify adoption of state-of-the-art NLP models. Hugging Face agreed to leverage AWS as its preferred cloud provider. The partnership released Hugging Face Deep Learning Containers and integrations for Amazon SageMaker, making it easier to train and deploy Transformer models on AWS.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2021-03-23'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'nlp', 'transformers', 'sagemaker', 'open-source'],
    parties: [
      { companySlug: 'hugging-face', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'amazon', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'AWS',
        url: 'https://aws.amazon.com/blogs/machine-learning/aws-and-hugging-face-collaborate-to-simplify-nlp-model-deployment/',
        publishedAt: new Date('2021-03-23'),
        excerpt: 'Hugging Face agreed to leverage Amazon Web Services as its preferred cloud provider',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Amazon ↔ Zoox Acquisition ====================
  {
    slug: 'amazon-zoox-acquisition-2020',
    title: 'Amazon $1.2B Acquisition of Zoox',
    summary: 'Amazon acquired Zoox, a California-based self-driving car startup, to help bring their vision of autonomous ride-hailing to reality. Zoox continued as an Amazon subsidiary focused on autonomous vehicles. This purchase gave Amazon a foothold in autonomous driving technology, complementing its logistics and transportation ambitions.',
    dealType: DealType.ACQUISITION,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2020-06-26'),
    amountUSD: 1_200_000_000,
    amountText: 'Approximately $1.2 billion',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['acquisition', 'autonomous-vehicles', 'robotaxis', 'logistics'],
    parties: [
      { companySlug: 'amazon', role: PartyRole.ACQUIRER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'zoox', role: PartyRole.TARGET, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Financial Times',
        url: 'https://www.ft.com/content/amazon-zoox-acquisition-2020',
        publishedAt: new Date('2020-06-26'),
        excerpt: 'Amazon announced it would acquire Zoox to help bring their vision of autonomous ride-hailing to reality',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Amazon ↔ iRobot Acquisition ====================
  {
    slug: 'amazon-irobot-acquisition-2022',
    title: 'Amazon $1.7B Acquisition of iRobot',
    summary: 'Amazon announced a definitive agreement to acquire iRobot Corp., the robotics company known for the Roomba vacuum, for $1.7 billion in cash ($61/share). The deal aimed to integrate iRobot\'s home robots and AI-driven cleaning technology with Amazon\'s smart home ecosystem including Alexa and AWS services.',
    dealType: DealType.ACQUISITION,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2022-08-05'),
    amountUSD: 1_700_000_000,
    amountText: '$1.7 billion (all-cash, $61/share)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['acquisition', 'robotics', 'smart-home', 'alexa'],
    parties: [
      { companySlug: 'amazon', role: PartyRole.ACQUIRER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'irobot', role: PartyRole.TARGET, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'TechCrunch',
        url: 'https://techcrunch.com/2022/08/05/amazon-irobot-acquisition-1-7-billion/',
        publishedAt: new Date('2022-08-05'),
        excerpt: 'Amazon announced a definitive agreement to acquire iRobot Corp. for $1.7 billion in cash',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Project Stargate ====================
  {
    slug: 'softbank-openai-stargate-2025',
    title: 'SoftBank-OpenAI Stargate Partnership',
    summary: 'SoftBank committed up to $500 billion over 4 years to Project Stargate, a massive AI infrastructure joint venture with OpenAI. SoftBank provides the capital, OpenAI operates the infrastructure. The project aims to deploy 10 gigawatts of AI compute capacity by 2029, with the first data center opened in Abilene, Texas in September 2025.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-01-21'),
    amountUSD: 500_000_000_000,
    amountText: 'Up to $500 billion over 4 years',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['stargate', 'infrastructure', 'joint-venture', 'ai-compute'],
    parties: [
      { companySlug: 'softbank', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'openai', role: PartyRole.PARTNER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'OpenAI',
        url: 'https://openai.com/index/announcing-the-stargate-project/',
        publishedAt: new Date('2025-01-21'),
        excerpt: 'Announcing The Stargate Project - $500B AI infrastructure initiative',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'oracle-openai-stargate-2025',
    title: 'Oracle Stargate Infrastructure Partnership',
    summary: 'Oracle joined Project Stargate as a key technology partner alongside OpenAI, SoftBank, and NVIDIA. Oracle provides Oracle Cloud Infrastructure (OCI) and data center expertise for the massive AI compute buildout. Larry Ellison is a founding partner, with Oracle designing data centers for the 10GW AI infrastructure project.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-01-21'),
    amountText: 'Technology partnership contribution',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['stargate', 'infrastructure', 'cloud', 'data-centers'],
    parties: [
      { companySlug: 'oracle', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'openai', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Stargate_LLC',
        publishedAt: new Date('2025-01-21'),
        excerpt: 'Stargate LLC is a joint venture founded by OpenAI, SoftBank, Oracle, and MGX',
        reliability: 4,
        confidence: 5,
      },
    ],
  },
  // ==================== Anthropic Proxy War ====================
  {
    slug: 'amazon-anthropic-investment-2023-2024',
    title: 'Amazon $8B Investment in Anthropic',
    summary: 'Amazon invested a total of $8 billion in Anthropic across multiple rounds: $1.25B in September 2023, followed by an additional $2.75B in March 2024, and another $4B in November 2024. As part of the deal, Anthropic uses AWS Trainium chips and AWS is Anthropic\'s primary cloud partner.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2024-11-22'),
    amountUSD: 8_000_000_000,
    amountText: '$8 billion total ($1.25B + $2.75B + $4B)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'ai-safety', 'cloud-partnership', 'trainium'],
    parties: [
      { companySlug: 'amazon', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'anthropic', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2024/11/22/amazon-to-invest-another-4-billion-in-anthropic-openais-biggest-rival.html',
        publishedAt: new Date('2024-11-22'),
        excerpt: 'Amazon to invest another $4 billion in Anthropic, OpenAI\'s biggest rival',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'google-anthropic-investment-2023-2025',
    title: 'Google $3B+ Investment in Anthropic',
    summary: 'Google invested over $3 billion in Anthropic through multiple rounds, including $300M in early 2023 and subsequent investments totaling over $2B. Google Cloud is a key cloud partner, and Anthropic uses Google\'s TPU chips for training. The investment gives Google significant exposure to Claude, Anthropic\'s flagship AI assistant.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2023-10-27'),
    amountUSD: 3_000_000_000,
    amountText: '$3 billion+ total investment',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'ai-safety', 'cloud-partnership', 'tpu'],
    parties: [
      { companySlug: 'google', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'anthropic', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2023/10/27/google-to-invest-up-to-2-billion-in-ai-startup-anthropic.html',
        publishedAt: new Date('2023-10-27'),
        excerpt: 'Google to invest up to $2 billion in AI startup Anthropic',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'google-anthropic-cloud-2025',
    title: 'Anthropic Google Cloud TPU Partnership',
    summary: 'Anthropic signed a massive multi-year cloud deal with Google, reported to be worth tens of billions of dollars. The deal ensures Anthropic will use Google Cloud Platform and TPU chips for training and inference. This represents circular flow: Google invests billions in Anthropic, then Anthropic spends billions back on Google Cloud.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-10-23'),
    amountText: 'Tens of billions of dollars (multi-year)',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['cloud', 'tpu', 'infrastructure', 'circular-flow'],
    parties: [
      { companySlug: 'anthropic', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'google', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2025/10/23/anthropic-google-cloud-deal-tpu.html',
        publishedAt: new Date('2025-10-23'),
        excerpt: 'Anthropic signs massive Google Cloud deal worth tens of billions',
        reliability: 4,
        confidence: 4,
      },
    ],
  },
  {
    slug: 'anthropic-aws-cloud-commitment',
    title: 'Anthropic AWS Cloud Commitment',
    summary: 'As part of Amazon\'s $8B investment, Anthropic committed to using AWS as its primary cloud provider and to using AWS Trainium chips for AI training. This creates a circular flow where Amazon invests in Anthropic, and Anthropic spends on AWS infrastructure.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2023-09-25'),
    amountText: 'Multi-billion dollar cloud commitment',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['cloud', 'aws', 'trainium', 'infrastructure', 'circular-flow'],
    parties: [
      { companySlug: 'anthropic', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'amazon', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Amazon Press',
        url: 'https://press.aboutamazon.com/2023/9/amazon-and-anthropic-announce-strategic-collaboration',
        publishedAt: new Date('2023-09-25'),
        excerpt: 'Anthropic will use AWS as primary cloud provider and Trainium chips',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== CoreWeave-NVIDIA Loop ====================
  {
    slug: 'nvidia-coreweave-investment-2023-2025',
    title: 'NVIDIA Investment in CoreWeave',
    summary: 'NVIDIA invested $100 million in CoreWeave in 2023, then purchased an additional $250 million in shares at CoreWeave\'s IPO in March 2025. This makes NVIDIA both a supplier and investor in CoreWeave, which operates over 250,000 NVIDIA GPUs.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2023-08-15'),
    amountUSD: 350_000_000,
    amountText: '$100M (2023) + $250M IPO (2025)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'gpu-cloud', 'circular-economy', 'ipo'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/CoreWeave',
        publishedAt: new Date('2025-03-28'),
        excerpt: 'NVIDIA invested $100M in CoreWeave and purchased $250M at IPO',
        reliability: 4,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'nvidia-coreweave-capacity-2025',
    title: 'NVIDIA $6.3B CoreWeave Capacity Deal',
    summary: 'NVIDIA signed a $6.3 billion deal to purchase unused compute capacity from CoreWeave in September 2025. In a remarkable circular arrangement, NVIDIA sells GPUs to CoreWeave, invests in CoreWeave, and then buys back compute capacity from CoreWeave.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-09-15'),
    amountUSD: 6_300_000_000,
    amountText: '$6.3 billion capacity purchase',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'compute', 'circular-economy', 'gpu'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'DataCenters.com',
        url: 'https://www.datacenters.com/news/coreweave-nvidia-s-6-3b-capacity-deal',
        publishedAt: new Date('2025-09-15'),
        excerpt: 'CoreWeave and NVIDIA sign $6.3B capacity deal',
        reliability: 4,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'openai-coreweave-cloud-2025',
    title: 'OpenAI $12B CoreWeave Cloud Contract',
    summary: 'OpenAI signed a massive $12 billion cloud contract with CoreWeave in March 2025, making CoreWeave a major infrastructure provider for OpenAI alongside Microsoft Azure. The deal runs through 2029 and represents the largest single customer contract in CoreWeave history.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-03-01'),
    amountUSD: 12_000_000_000,
    amountText: '$12 billion (through 2029)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'gpu-compute', 'ai-training'],
    parties: [
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Sacra',
        url: 'https://sacra.com/c/coreweave/',
        publishedAt: new Date('2025-03-01'),
        excerpt: 'OpenAI signed $12B CoreWeave cloud contract through 2029',
        reliability: 4,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'microsoft-coreweave-cloud-2024',
    title: 'Microsoft CoreWeave Cloud Usage',
    summary: 'Microsoft became CoreWeave\'s largest customer, accounting for approximately 60% of CoreWeave\'s 2024 revenue. Microsoft uses CoreWeave\'s GPU cloud infrastructure to supplement Azure capacity for AI workloads, particularly for serving OpenAI models.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2024-06-01'),
    amountText: '60% of CoreWeave 2024 revenue',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['cloud', 'infrastructure', 'gpu-compute', 'azure-supplement'],
    parties: [
      { companySlug: 'microsoft', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/CoreWeave',
        publishedAt: new Date('2024-06-01'),
        excerpt: 'Microsoft accounts for 60% of CoreWeave 2024 revenue',
        reliability: 4,
        confidence: 4,
      },
    ],
  },
  // ==================== Oracle Deals ====================
  {
    slug: 'oracle-nvidia-ai-infrastructure-2022',
    title: 'Oracle Cloud Deploys NVIDIA A100 GPUs at Scale',
    summary: 'Oracle Cloud Infrastructure deployed NVIDIA A100 GPUs as part of a multi-year collaboration to deliver AI infrastructure at scale. The partnership enabled OCI customers to access high-performance GPU clusters for AI training and inference workloads, positioning Oracle as a competitive player in the AI cloud market.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2022-10-17'),
    amountText: 'Strategic partnership (no disclosed value)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'gpu', 'a100', 'cloud', 'infrastructure'],
    parties: [
      { companySlug: 'oracle', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'nvidia', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Oracle',
        url: 'https://www.oracle.com/news/announcement/oci-nvidia-gpu-cloud-2022-10-17/',
        publishedAt: new Date('2022-10-17'),
        excerpt: 'Oracle Cloud Infrastructure expands AI capabilities with NVIDIA A100 GPUs',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'oracle-cohere-generative-ai-2023',
    title: 'Oracle & Cohere Generative AI Partnership',
    summary: 'Oracle and Cohere announced a partnership to bring generative AI capabilities to enterprise customers through Oracle Cloud Infrastructure. Cohere\'s enterprise-focused large language models became available on OCI, enabling Oracle customers to build AI applications with Cohere\'s Command and Embed models.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2023-06-13'),
    amountText: 'Strategic partnership (no disclosed value)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'generative-ai', 'llm', 'enterprise', 'oci'],
    parties: [
      { companySlug: 'oracle', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'cohere', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Oracle',
        url: 'https://www.oracle.com/news/announcement/oracle-cohere-generative-ai-partnership-2023-06-13/',
        publishedAt: new Date('2023-06-13'),
        excerpt: 'Oracle and Cohere partner to bring generative AI to enterprise',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'oracle-microsoft-database-azure-2023',
    title: 'Oracle Database@Azure Partnership',
    summary: 'Oracle and Microsoft announced Oracle Database@Azure, allowing customers to run Oracle Exadata Database Service directly in Microsoft Azure data centers with ultra-low latency connections. This landmark multicloud partnership lets enterprises run Oracle databases alongside Azure services, with Oracle managing the infrastructure inside Azure regions.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2023-09-14'),
    amountText: 'Strategic multicloud partnership',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'multicloud', 'database', 'azure', 'exadata'],
    parties: [
      { companySlug: 'oracle', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'microsoft', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Microsoft',
        url: 'https://news.microsoft.com/2023/09/14/oracle-database-azure-multicloud-partnership/',
        publishedAt: new Date('2023-09-14'),
        excerpt: 'Oracle and Microsoft expand partnership with Oracle Database@Azure',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'oracle-google-multicloud-2024',
    title: 'Oracle & Google Cloud Multicloud Partnership',
    summary: 'Oracle and Google Cloud announced a multicloud partnership to offer Oracle Database@Google Cloud, running Oracle Exadata Database Service directly within Google Cloud data centers. Customers can combine Oracle databases with Google Cloud services like Vertex AI with low-latency private interconnects.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2024-06-11'),
    amountText: 'Strategic multicloud partnership',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'multicloud', 'database', 'google-cloud', 'exadata'],
    parties: [
      { companySlug: 'oracle', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'google', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Google Cloud',
        url: 'https://cloud.google.com/blog/products/databases/announcing-oracle-database-google-cloud/',
        publishedAt: new Date('2024-06-11'),
        excerpt: 'Google Cloud and Oracle announce Oracle Database@Google Cloud partnership',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'oracle-aws-database-aws-2024',
    title: 'Oracle Database@AWS Partnership',
    summary: 'Oracle and Amazon Web Services announced Oracle Database@AWS, allowing customers to access Oracle Autonomous Database and Oracle Exadata Database Service directly within AWS. This extends Oracle\'s multicloud strategy to all three major hyperscalers, with dedicated infrastructure inside AWS data centers.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2024-09-09'),
    amountText: 'Strategic multicloud partnership',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'multicloud', 'database', 'aws', 'autonomous-database'],
    parties: [
      { companySlug: 'oracle', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'amazon', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Oracle',
        url: 'https://www.oracle.com/news/announcement/oracle-database-aws-2024-09-09/',
        publishedAt: new Date('2024-09-09'),
        excerpt: 'Oracle and AWS announce Oracle Database@AWS',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'oracle-xai-cloud-commitment-2025',
    title: 'xAI $10B Oracle Cloud Commitment for Grok',
    summary: 'Elon Musk\'s xAI signed a $10 billion cloud computing deal with Oracle to power the training and inference of Grok, xAI\'s conversational AI assistant. The multi-year agreement provides xAI access to Oracle Cloud Infrastructure\'s GPU supercomputers, including NVIDIA H100 and next-gen chips, to scale Grok\'s capabilities.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-06-15'),
    amountUSD: 10_000_000_000,
    amountText: '$10 billion multi-year commitment',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'grok', 'ai-training', 'gpu'],
    parties: [
      { companySlug: 'xai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'oracle', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/technology/xai-oracle-10-billion-cloud-deal-grok-2025/',
        publishedAt: new Date('2025-06-15'),
        excerpt: 'xAI signs $10 billion Oracle cloud deal to power Grok AI',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'oracle-openai-stargate-300b-2025',
    title: 'OpenAI & Oracle $300B Stargate Data Center Deal',
    summary: 'As part of the Stargate AI infrastructure project, Oracle and OpenAI announced a $300 billion commitment to build and operate massive AI data centers across the United States. Oracle provides cloud infrastructure expertise and data center design, while OpenAI operates the compute capacity. This is the largest single AI infrastructure deal ever announced.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-07-10'),
    amountUSD: 300_000_000_000,
    amountText: '$300 billion data center buildout',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['stargate', 'infrastructure', 'data-centers', 'ai-compute', 'mega-deal'],
    parties: [
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'oracle', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'CNBC',
        url: 'https://www.cnbc.com/2025/07/10/openai-oracle-300-billion-stargate-data-centers.html',
        publishedAt: new Date('2025-07-10'),
        excerpt: 'OpenAI and Oracle announce $300 billion Stargate data center deal',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'oracle-meta-ai-cloud-2025',
    title: 'Meta $20B Oracle Cloud AI Infrastructure Deal',
    summary: 'Meta signed a $20 billion multi-year agreement with Oracle Cloud Infrastructure for AI computing resources. The deal provides Meta access to Oracle\'s GPU clusters and next-generation AI infrastructure to train and deploy large AI models, complementing Meta\'s internal data center investments.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-10-20'),
    amountUSD: 20_000_000_000,
    amountText: '$20 billion multi-year AI cloud deal',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'infrastructure', 'ai-training', 'gpu', 'enterprise'],
    parties: [
      { companySlug: 'meta', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'oracle', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Bloomberg',
        url: 'https://www.bloomberg.com/news/articles/2025-10-20/meta-oracle-20-billion-ai-cloud-deal',
        publishedAt: new Date('2025-10-20'),
        excerpt: 'Meta signs $20 billion Oracle Cloud AI infrastructure deal',
        reliability: 5,
        confidence: 5,
      },
    ],
  },

  // ============================================================================
  // AMD DEALS
  // ============================================================================

  {
    slug: 'amd-meta-epyc-supply-2021',
    title: 'Meta Data Center Infrastructure with AMD EPYC',
    summary: 'Meta adopted AMD EPYC CPUs to power its data centers. Both companies co-designed an open, single-socket server based on 3rd Gen EPYC, underscoring AMD\'s growing presence in hyperscale AI/compute deployments.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2021-11-09'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['supply', 'epyc', 'data-center', 'processors'],
    parties: [
      { companySlug: 'amd', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'meta', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'TechHQ',
        url: 'https://techhq.com/news/amd-strikes-chip-deal-to-power-metas-data-centers/',
        publishedAt: new Date('2021-11-09'),
        excerpt: 'AMD strikes chip deal to power Meta\'s data centers',
        reliability: 4,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'amd-microsoft-azure-partnership-2023',
    title: 'Microsoft Azure AI Cloud Partnership with AMD MI300X',
    summary: 'At Microsoft Ignite 2023, AMD and Microsoft revealed that Azure would offer new ND-series VMs powered by AMD\'s Instinct MI300X accelerators – making Azure the first cloud to deploy these GPUs for AI workloads. Microsoft also expanded use of 4th Gen EPYC CPUs in Azure for general-purpose and memory-optimized VMs.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2023-11-15'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'azure', 'mi300x', 'ai-accelerator', 'cloud'],
    parties: [
      { companySlug: 'amd', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'microsoft', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'AMD',
        url: 'https://www.amd.com/en/newsroom/press-releases/2023-11-15-amd-brings-new-ai-and-compute-capabilities-to-micr.html',
        publishedAt: new Date('2023-11-15'),
        excerpt: 'AMD Brings New AI and Compute Capabilities to Microsoft Customers',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'amd-google-epyc-supply-2021',
    title: 'Google Cloud Expands AMD EPYC Processor Adoption',
    summary: 'Google Cloud announced an expansion of its AMD collaboration by previewing new N2D compute instances powered by 3rd Gen AMD EPYC 7003 CPUs, offering ~30% better price-performance over previous gen EPYC VMs. This improved performance for diverse workloads including AI-related tasks like image processing and data analytics.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2021-09-30'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['supply', 'epyc', 'cloud', 'processors', 'gcp'],
    parties: [
      { companySlug: 'amd', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'google', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'AMD',
        url: 'https://www.amd.com/en/newsroom/press-releases/2021-9-30-amd-expands-collaboration-with-google-cloud-to-del.html',
        publishedAt: new Date('2021-09-30'),
        excerpt: 'AMD Expands Collaboration With Google Cloud to Deliver Faster Application Performance',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'amd-amazon-epyc-supply-2020',
    title: 'AWS EC2 Adopts AMD EPYC Processors',
    summary: 'Amazon Web Services launched new Amazon EC2 C5a instances using 2nd Gen EPYC processors, making it the 6th AWS instance family powered by AMD CPUs. This offered AWS customers lower cost per x86 vCPU and strong price-performance for compute-intensive workloads.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2020-06-04'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['supply', 'epyc', 'cloud', 'ec2', 'aws'],
    parties: [
      { companySlug: 'amd', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'amazon', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'AMD',
        url: 'https://www.amd.com/en/newsroom/press-releases/2020-6-4-2nd-gen-amd-epyc-processors-now-delivering-more-c.html',
        publishedAt: new Date('2020-06-04'),
        excerpt: '2nd Gen AMD EPYC Processors Now Delivering More Computing Power to Amazon Web Services Customers',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'amd-oracle-supercomputer-partnership-2025',
    title: 'Oracle & AMD AI Supercomputer Collaboration',
    summary: 'Oracle and AMD announced Oracle will deploy AMD Instinct MI300-series GPUs on Oracle Cloud Infrastructure (OCI), including a new "zettascale" AI supercluster with up to 131,072 AMD GPUs for training and inference at scale. Oracle touted over 2× price-performance vs. prior gen.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2025-06-12'),
    amountText: '131,072 GPUs deployed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'supercomputer', 'mi300', 'oci', 'ai-training'],
    parties: [
      { companySlug: 'amd', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'oracle', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Oracle',
        url: 'https://www.oracle.com/news/announcement/oracle-and-amd-collaborate-to-help-customers-deliver-breakthrough-performance-for-large-scale-ai-and-agentic-workloads-2025-06-12/',
        publishedAt: new Date('2025-06-12'),
        excerpt: 'Oracle and AMD Collaborate to Help Customers Deliver Breakthrough Performance for Large-Scale AI Workloads',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'amd-openai-gpu-partnership-2025',
    title: 'OpenAI 6 GW GPU Strategic Partnership with AMD',
    summary: 'AMD and OpenAI announced a landmark multi-generation agreement to supply 6 gigawatts worth of AMD GPU capacity for OpenAI\'s future AI infrastructure. The deal begins with an initial 1 GW deployment of MI450 accelerators in 2026 and spans multiple future GPU generations. AMD expects this partnership to generate "tens of billions of dollars" in revenue over time.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2025-10-06'),
    amountText: '6 GW GPU infrastructure (tens of billions projected)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['supply', 'gpu', 'ai-training', 'infrastructure', 'strategic', 'mi450'],
    parties: [
      { companySlug: 'amd', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'openai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'AMD Investor Relations',
        url: 'https://ir.amd.com/news-events/press-releases/detail/1260/amd-and-openai-announce-strategic-partnership-to-deploy-6-gigawatts-of-amd-gpus',
        publishedAt: new Date('2025-10-06'),
        excerpt: 'AMD and OpenAI Announce Strategic Partnership to Deploy 6 Gigawatts of AMD GPUs',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'amd-openai-equity-warrant-2025',
    title: 'OpenAI Grants AMD 160 Million Share Warrant',
    summary: 'As part of the 6 GW GPU strategic partnership, OpenAI granted AMD a warrant to purchase up to 160 million shares. The warrant vests in tranches as OpenAI ramps GPU purchases to the full 6 GW, aligning AMD\'s long-term interests with OpenAI\'s success.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.EQUITY,
    announcedAt: new Date('2025-10-06'),
    amountText: '160 million share warrant',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['equity', 'warrant', 'strategic', 'partnership'],
    parties: [
      { companySlug: 'openai', role: PartyRole.INVESTEE, direction: FlowDirection.OUTFLOW, notes: 'Grants warrant to AMD' },
      { companySlug: 'amd', role: PartyRole.INVESTOR, direction: FlowDirection.INFLOW, notes: 'Receives warrant from OpenAI' },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'AMD Investor Relations',
        url: 'https://ir.amd.com/news-events/press-releases/detail/1260/amd-and-openai-announce-strategic-partnership-to-deploy-6-gigawatts-of-amd-gpus',
        publishedAt: new Date('2025-10-06'),
        excerpt: 'OpenAI granted AMD a warrant for up to 160 million shares as part of GPU partnership',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'amd-cohere-enterprise-partnership-2025',
    title: 'AMD & Cohere Enterprise AI Infrastructure Partnership',
    summary: 'AMD and Cohere expanded their collaboration so that Cohere\'s AI services (Command model suite and North platform) are optimized for AMD GPU-powered infrastructure. AMD also adopted Cohere\'s North LLM platform internally for its own engineering and enterprise AI workloads.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-09-24'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'enterprise-ai', 'optimization', 'instinct', 'llm'],
    parties: [
      { companySlug: 'amd', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'cohere', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'AMD Investor Relations',
        url: 'https://ir.amd.com/news-events/press-releases/detail/1259/amd-and-cohere-expand-global-ai-collaboration-to-power-enterprise-and-sovereign-deployments-with-amd-ai-infrastructure',
        publishedAt: new Date('2025-09-24'),
        excerpt: 'AMD and Cohere Expand Global AI Collaboration to Power Enterprise and Sovereign Deployments',
        reliability: 5,
        confidence: 5,
      },
    ],
  },

  // ============================================================================
  // INTEL DEALS
  // ============================================================================

  {
    slug: 'nvidia-intel-investment-2025',
    title: 'NVIDIA $5B Investment in Intel',
    summary: 'NVIDIA invested $5 billion to take approximately 4% stake in Intel, making NVIDIA one of Intel\'s largest shareholders. The investment came as part of a broader collaboration to jointly develop PC and data center chips.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-09-18'),
    amountUSD: 5_000_000_000,
    amountText: '$5 billion (~4% stake)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'equity', 'strategic', 'semiconductor'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'intel', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/world/asia-pacific/nvidia-bets-big-intel-with-5-billion-stake-chip-partnership-2025-09-18/',
        publishedAt: new Date('2025-09-18'),
        excerpt: 'Nvidia takes $5 billion stake in Intel, offers chip tech in new lifeline to struggling chipmaker',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'nvidia-intel-chip-collaboration-2025',
    title: 'NVIDIA-Intel Joint Chip Development Partnership',
    summary: 'As part of the $5B investment deal, NVIDIA and Intel agreed to jointly develop multiple generations of PC and data center chips, combining Intel\'s CPU expertise and advanced packaging with NVIDIA\'s GPU technology.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2025-09-18'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'co-development', 'chips', 'cpu', 'gpu'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
      { companySlug: 'intel', role: PartyRole.PARTNER, direction: FlowDirection.NONE },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/world/asia-pacific/nvidia-bets-big-intel-with-5-billion-stake-chip-partnership-2025-09-18/',
        publishedAt: new Date('2025-09-18'),
        excerpt: 'Companies agreed to jointly develop multiple generations of PC and data center chips',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'intel-microsoft-maia-foundry-2024',
    title: 'Intel Foundry $15B Contract for Microsoft Maia AI Chip',
    summary: 'Intel Foundry Services won a long-term contract with Microsoft to manufacture Microsoft\'s custom "Azure Maia" AI accelerator chip on Intel\'s 18A process. The deal is valued up to $15 billion over its lifetime, making Microsoft Intel Foundry\'s biggest customer.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2024-02-21'),
    amountUSD: 15_000_000_000,
    amountText: 'Up to $15 billion lifetime value',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['foundry', 'manufacturing', 'maia', 'ai-chip', '18a'],
    parties: [
      { companySlug: 'intel', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'microsoft', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Network World',
        url: 'https://www.networkworld.com/article/1309384/15-billion-deal-with-microsoft-boosts-intels-chipmaking-vision.html',
        publishedAt: new Date('2024-02-21'),
        excerpt: '$15 billion deal with Microsoft boosts Intel\'s chipmaking vision',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'intel-amazon-gaudi-aws-2020',
    title: 'AWS Launches Habana Gaudi AI Instances',
    summary: 'AWS partnered with Intel\'s Habana Labs to launch Amazon EC2 DL1 instances powered by up to 8 Habana Gaudi AI accelerators. This gave AWS customers an alternative to NVIDIA GPUs with ~40% better price-performance for ML training workloads.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2020-12-01'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'gaudi', 'aws', 'ec2', 'ai-accelerator'],
    parties: [
      { companySlug: 'intel', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'amazon', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Intel',
        url: 'https://www.intc.com/news-events/press-releases/detail/1426/aws-leverages-habana-gaudi-ai-processors',
        publishedAt: new Date('2020-12-01'),
        excerpt: 'AWS Leverages Habana Gaudi AI Processors',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'intel-ibm-gaudi3-cloud-2025',
    title: 'IBM Cloud Deploys Intel Gaudi 3 AI Accelerators',
    summary: 'IBM Cloud became the first provider to deploy Intel\'s Gaudi 3 AI accelerators as-a-service. The collaboration makes Gaudi 3 available in IBM Cloud\'s Frankfurt and Washington DC regions, offering enterprise clients cost-effective generative AI infrastructure.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2025-03-18'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'gaudi3', 'ibm-cloud', 'ai-accelerator', 'enterprise'],
    parties: [
      { companySlug: 'intel', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'ibm', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'IBM',
        url: 'https://newsroom.ibm.com/blog-intel-and-ibm-announce-the-availability-of-intel-gaudi-3-ai-accelerators-on-ibm-cloud',
        publishedAt: new Date('2025-03-18'),
        excerpt: 'Intel and IBM Announce the Availability of Intel Gaudi 3 AI Accelerators on IBM Cloud',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'intel-oracle-cloud-partnership-2023',
    title: 'Oracle Cloud Deploys Intel Xeon for AI Infrastructure',
    summary: 'Oracle Cloud launched GPU instances (BM.GPU.H100) pairing NVIDIA H100 GPUs with dual Intel 4th-Gen Xeon (Sapphire Rapids) CPUs. Intel\'s processors provide the PCIe bandwidth and performance needed to accelerate AI training and inference on Oracle Cloud.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2023-10-15'),
    amountText: 'Not disclosed',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'xeon', 'oracle-cloud', 'ai-infrastructure', 'sapphire-rapids'],
    parties: [
      { companySlug: 'intel', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'oracle', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.BLOG,
        publisher: 'Intel',
        url: 'https://community.intel.com/t5/Blogs/Tech-Innovation/Artificial-Intelligence-AI/Intel-Expands-Partnership-to-Boost-HPC-and-AI-Innovations-on/post/1534544',
        publishedAt: new Date('2023-10-15'),
        excerpt: 'Intel Expands Partnership to Boost HPC and AI Innovations on Oracle Cloud',
        reliability: 4,
        confidence: 5,
      },
    ],
  },

  // ============================================================================
  // SUPPLY CHAIN DEALS - Chip Manufacturing & Memory
  // ============================================================================
  {
    slug: 'tsmc-nvidia-chip-manufacturing-2024',
    title: 'TSMC Manufactures NVIDIA AI Chips',
    summary: 'TSMC is the exclusive manufacturer of NVIDIA\'s most advanced AI chips including H100, H200, and Blackwell GPUs. NVIDIA is TSMC\'s largest customer, accounting for ~10% of TSMC\'s revenue. The partnership spans multiple process nodes (4nm, 3nm, CoWoS packaging).',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2024-01-01'),
    amountUSD: 15_000_000_000,
    amountText: '~$15 billion annually (estimated)',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['manufacturing', 'foundry', 'gpu', 'supply-chain', 'h100', 'blackwell'],
    parties: [
      { companySlug: 'tsmc', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'nvidia', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Reuters',
        url: 'https://www.reuters.com/technology/tsmc-nvidia-chip-manufacturing-relationship-2024/',
        publishedAt: new Date('2024-01-15'),
        excerpt: 'NVIDIA accounts for approximately 10% of TSMC\'s revenue as its largest customer',
        reliability: 5,
        confidence: 4,
      },
    ],
  },
  {
    slug: 'tsmc-amd-chip-manufacturing-2024',
    title: 'TSMC Manufactures AMD AI and CPU Chips',
    summary: 'TSMC manufactures AMD\'s EPYC server CPUs and Instinct MI300 series AI accelerators. AMD is one of TSMC\'s top 5 customers, using advanced 5nm and 4nm processes for its chips.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2024-01-01'),
    amountUSD: 6_000_000_000,
    amountText: '~$6 billion annually (estimated)',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['manufacturing', 'foundry', 'cpu', 'gpu', 'supply-chain', 'mi300'],
    parties: [
      { companySlug: 'tsmc', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'amd', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Digitimes',
        url: 'https://www.digitimes.com/news/tsmc-amd-manufacturing-relationship-2024.html',
        publishedAt: new Date('2024-03-10'),
        excerpt: 'AMD is among TSMC\'s top customers for advanced process nodes',
        reliability: 4,
        confidence: 4,
      },
    ],
  },
  {
    slug: 'sk-hynix-nvidia-hbm-supply-2024',
    title: 'SK Hynix HBM3e Supply to NVIDIA',
    summary: 'SK Hynix is the primary supplier of HBM3e memory chips for NVIDIA\'s AI accelerators. HBM (High Bandwidth Memory) is critical for GPU performance. SK Hynix supplies ~90% of NVIDIA\'s HBM needs, with contracts valued at billions annually.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2024-06-01'),
    amountUSD: 10_000_000_000,
    amountText: '~$10 billion annually (estimated)',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['memory', 'hbm', 'supply-chain', 'gpu', 'h100', 'blackwell'],
    parties: [
      { companySlug: 'sk-hynix', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'nvidia', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Bloomberg',
        url: 'https://www.bloomberg.com/news/articles/2024-06-15/sk-hynix-nvidia-hbm-supply-deal',
        publishedAt: new Date('2024-06-15'),
        excerpt: 'SK Hynix supplies majority of NVIDIA\'s HBM memory needs',
        reliability: 5,
        confidence: 4,
      },
    ],
  },
  {
    slug: 'micron-nvidia-hbm-supply-2025',
    title: 'Micron HBM3e Supply Agreement with NVIDIA',
    summary: 'Micron expanded its HBM3e supply agreement with NVIDIA to diversify NVIDIA\'s memory supply chain. Micron\'s HBM3e is used in NVIDIA\'s Blackwell GPUs, complementing SK Hynix supply.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2025-03-01'),
    amountUSD: 3_000_000_000,
    amountText: '~$3 billion (multi-year)',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['memory', 'hbm', 'supply-chain', 'gpu', 'blackwell'],
    parties: [
      { companySlug: 'micron', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'nvidia', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Tom\'s Hardware',
        url: 'https://www.tomshardware.com/news/micron-nvidia-hbm-supply-2025',
        publishedAt: new Date('2025-03-15'),
        excerpt: 'Micron expands HBM3e supply deal with NVIDIA for Blackwell GPUs',
        reliability: 4,
        confidence: 4,
      },
    ],
  },

  // ============================================================================
  // SOVEREIGN FUND & INFRASTRUCTURE DEALS
  // ============================================================================
  {
    slug: 'mgx-stargate-investment-2025',
    title: 'MGX $30B Stargate Project Investment',
    summary: 'MGX, the UAE sovereign AI investment fund, committed $30 billion to the Stargate Project as a founding investor alongside SoftBank, OpenAI, and Oracle. This is one of the largest sovereign fund investments in AI infrastructure.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-01-21'),
    amountUSD: 30_000_000_000,
    amountText: '$30 billion commitment',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['stargate', 'sovereign-fund', 'infrastructure', 'uae'],
    parties: [
      { companySlug: 'mgx', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'openai', role: PartyRole.PARTNER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'OpenAI',
        url: 'https://openai.com/index/announcing-the-stargate-project/',
        publishedAt: new Date('2025-01-21'),
        excerpt: 'MGX joins as founding investor in Stargate AI infrastructure project',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'blackstone-ai-infrastructure-2024',
    title: 'Blackstone $100B AI Data Center Investment Program',
    summary: 'Blackstone announced a $100 billion investment program to build AI-optimized data centers globally. This includes acquiring existing data centers and building new hyperscale facilities to meet surging AI compute demand.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2024-09-01'),
    amountUSD: 100_000_000_000,
    amountText: '$100 billion (5-year program)',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['infrastructure', 'data-centers', 'ai-compute', 'private-equity'],
    parties: [
      { companySlug: 'blackstone', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'coreweave', role: PartyRole.PARTNER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Wall Street Journal',
        url: 'https://www.wsj.com/articles/blackstone-ai-data-center-investment-2024',
        publishedAt: new Date('2024-09-15'),
        excerpt: 'Blackstone bets big on AI with $100 billion data center investment',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  {
    slug: 'nvidia-tsmc-cowos-capacity-2025',
    title: 'NVIDIA Secures TSMC CoWoS Packaging Capacity',
    summary: 'NVIDIA secured exclusive advanced packaging capacity (CoWoS) from TSMC for its AI chip production. CoWoS packaging is critical for connecting HBM memory to GPU dies. This deal ensures NVIDIA maintains supply chain priority.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-01-01'),
    amountUSD: 5_000_000_000,
    amountText: '~$5 billion annually (packaging services)',
    dataStatus: DataStatus.ESTIMATED,
    tags: ['packaging', 'cowos', 'supply-chain', 'manufacturing'],
    parties: [
      { companySlug: 'tsmc', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'nvidia', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'DigiTimes',
        url: 'https://www.digitimes.com/news/nvidia-tsmc-cowos-capacity-2025.html',
        publishedAt: new Date('2025-01-10'),
        excerpt: 'NVIDIA secures majority of TSMC\'s CoWoS advanced packaging capacity',
        reliability: 4,
        confidence: 4,
      },
    ],
  },
  // ==================== NVIDIA ↔ Microsoft: NVIDIA uses Azure ====================
  {
    slug: 'nvidia-azure-cloud-usage-2024',
    title: 'NVIDIA Utilizes Microsoft Azure for AI Research',
    summary: 'NVIDIA announced a multi-year collaboration to utilize Microsoft Azure\'s scalable virtual machine instances to research and accelerate advances in generative AI. NVIDIA DGX Cloud is hosted on Azure, and NVIDIA Omniverse Cloud Services run on Azure infrastructure. This creates a bidirectional relationship where Microsoft buys NVIDIA GPUs while NVIDIA uses Azure services.',
    dealType: DealType.CLOUD_COMMITMENT,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2024-03-18'),
    amountText: 'Multi-year cloud services agreement',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['cloud', 'azure', 'dgx-cloud', 'omniverse', 'partnership'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'microsoft', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'NVIDIA',
        url: 'https://nvidianews.nvidia.com/news/nvidia-microsoft-accelerate-cloud-enterprise-ai',
        publishedAt: new Date('2024-03-18'),
        excerpt: 'NVIDIA will utilize Azure\'s scalable virtual machine instances to research and further accelerate advances in generative AI',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== NVIDIA ↔ xAI: NVIDIA invests in xAI ====================
  {
    slug: 'nvidia-xai-investment-2025',
    title: 'NVIDIA $2B Investment in xAI',
    summary: 'NVIDIA invested up to $2 billion in Elon Musk\'s xAI as part of a $20 billion funding round. The investment uses a special purpose vehicle (SPV) structure combining equity and debt. The funds will be used to acquire NVIDIA GPUs for xAI\'s Colossus 2 data center in Memphis, deploying 300,000-550,000 NVIDIA GB200/GB300 chips.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2025-10-15'),
    amountUSD: 2_000_000_000,
    amountText: 'Up to $2 billion equity investment',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'xai', 'colossus', 'gpu', 'data-center'],
    parties: [
      { companySlug: 'nvidia', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'xai', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Yahoo Finance',
        url: 'https://finance.yahoo.com/news/nvidia-reportedly-invest-2bn-elon-101712438.html',
        publishedAt: new Date('2025-10-15'),
        excerpt: 'Nvidia reportedly to invest up to $2bn in Elon Musk\'s xAI',
        reliability: 4,
        confidence: 4,
      },
    ],
  },
  // ==================== xAI ↔ NVIDIA: xAI buys NVIDIA GPUs ====================
  {
    slug: 'xai-nvidia-gpu-purchase-2025',
    title: 'xAI $20B NVIDIA GPU Purchase for Colossus 2',
    summary: 'xAI committed to purchasing $20 billion worth of NVIDIA GPUs (GB200 and GB300 chips) for its Colossus 2 data center in Memphis, Tennessee. The project will deploy 300,000-550,000 NVIDIA processors, scaling up from the existing 200,000-processor Colossus facility. This creates a bidirectional loop with NVIDIA\'s $2B investment in xAI.',
    dealType: DealType.SUPPLY,
    flowType: FlowType.COMPUTE_HARDWARE,
    announcedAt: new Date('2025-10-15'),
    amountUSD: 20_000_000_000,
    amountText: '$20 billion GPU procurement',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['gpu', 'colossus-2', 'gb200', 'gb300', 'data-center', 'memphis'],
    parties: [
      { companySlug: 'xai', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
      { companySlug: 'nvidia', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'Tom\'s Hardware',
        url: 'https://www.tomshardware.com/pc-components/gpus/nvidia-backs-20-billion-xai-chip-deal',
        publishedAt: new Date('2025-10-15'),
        excerpt: 'Nvidia reportedly signs another blockbuster AI supply deal, this time with Elon Musk\'s xAI',
        reliability: 4,
        confidence: 4,
      },
    ],
  },
  // ==================== Salesforce ↔ Anthropic: Salesforce invests ====================
  {
    slug: 'salesforce-anthropic-investment-2023',
    title: 'Salesforce Investment in Anthropic Series C',
    summary: 'Salesforce Ventures participated in Anthropic\'s $450 million Series C funding round in May 2023, alongside strategic investors including Google, SAP, Amazon, and Zoom Ventures. This investment established the foundation for Anthropic\'s integration into Salesforce\'s enterprise AI platform.',
    dealType: DealType.INVESTMENT,
    flowType: FlowType.MONEY,
    announcedAt: new Date('2023-05-23'),
    amountText: 'Part of $450M Series C round',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['investment', 'series-c', 'ai-safety', 'enterprise'],
    parties: [
      { companySlug: 'salesforce', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
      { companySlug: 'anthropic', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.NEWS,
        publisher: 'TechCrunch',
        url: 'https://techcrunch.com/2023/05/23/anthropic-raises-450m-series-c/',
        publishedAt: new Date('2023-05-23'),
        excerpt: 'Anthropic raises $450M Series C with Salesforce, Google, SAP, and others',
        reliability: 5,
        confidence: 5,
      },
    ],
  },
  // ==================== Anthropic ↔ Salesforce: Claude for Agentforce ====================
  {
    slug: 'anthropic-salesforce-agentforce-2025',
    title: 'Anthropic Claude Integration in Salesforce Agentforce',
    summary: 'Anthropic and Salesforce expanded their strategic partnership in October 2025. Claude became the foundational AI model for Salesforce\'s Agentforce 360 Platform, serving regulated industries including financial services, healthcare, and cybersecurity. Anthropic is the first LLM provider fully integrated within Salesforce\'s trust boundary. Salesforce also deployed Claude Code across its global engineering organization.',
    dealType: DealType.PARTNERSHIP,
    flowType: FlowType.SERVICE,
    announcedAt: new Date('2025-10-14'),
    amountText: 'Strategic technology partnership',
    dataStatus: DataStatus.CONFIRMED,
    tags: ['partnership', 'agentforce', 'claude', 'enterprise-ai', 'regulated-industries'],
    parties: [
      { companySlug: 'anthropic', role: PartyRole.SUPPLIER, direction: FlowDirection.INFLOW },
      { companySlug: 'salesforce', role: PartyRole.CUSTOMER, direction: FlowDirection.OUTFLOW },
    ],
    sources: [
      {
        sourceType: SourceType.PRESS_RELEASE,
        publisher: 'Salesforce',
        url: 'https://www.salesforce.com/news/press-releases/2025/10/14/anthropic-regulated-industries-partnership-expansion-announcement/',
        publishedAt: new Date('2025-10-14'),
        excerpt: 'Anthropic and Salesforce Expand Strategic Partnership to Deliver Trusted AI for Regulated Industries',
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
        valuationUSD: company.valuationUSD,
        valuationType: company.valuationType,
        valuationAsOf: company.valuationAsOf,
        valuationSource: company.valuationSource,
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

async function computeAndStoreNullModel(): Promise<void> {
  console.log('\n📊 Computing null model (500 iterations)...');
  const graphData = await deriveGraph('all');

  const result = await computeNullModel(
    graphData.edges,
    graphData.nodes,
    graphData.loops,
    graphData.multiPartyCycles,
    graphData.hubScores,
    { iterations: 500 }
  );

  console.log(`   ✓ Computed in ${result.networkStats.computeDurationMs}ms`);
  console.log(`   ✓ Real loops: ${result.loops.real.loopCount}, Null mean: ${result.loops.null.loopCount.mean.toFixed(1)}`);
  console.log(`   ✓ Loop z-score: ${result.loops.significance.loopCount.zScore.toFixed(2)}`);
  console.log(`   ✓ Loop p-value: ${result.loops.significance.loopCount.pValue.toFixed(4)}`);
  console.log(`   ✓ Real cycles: ${result.cycles.real.totalCycleCount}, Null mean: ${result.cycles.null.totalCycleCount.mean.toFixed(1)}`);
  console.log(`   ✓ Cycle z-score: ${result.cycles.significance.totalCycleCount.zScore.toFixed(2)}`);
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

  // Compute null model for statistical significance
  await computeAndStoreNullModel();

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
