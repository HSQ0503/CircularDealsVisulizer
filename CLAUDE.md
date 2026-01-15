# AI Circular Deals (aibubvis)

## Project Overview

An interactive visualization tool for exploring interconnected investments, partnerships, and financial commitments in the AI industry. The app displays companies as nodes and deals (investments, cloud commitments, supply agreements) as directed edges, revealing circular flows of money, compute, and services between major tech players.

**Featured Case Study:** The OpenAI ↔ Microsoft ↔ NVIDIA triangle - showing circular flows of investments, Azure cloud commitments, and GPU infrastructure deals.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma 5
- **Styling:** Tailwind CSS 4
- **Visualization:** react-force-graph-2d (d3-force based)
- **Package Manager:** npm

## Project Structure

```
app/
├── page.tsx                    # Landing page with featured case study
├── graph/page.tsx              # Main graph visualization page
├── case-studies/page.tsx       # Case studies listing
├── api/
│   ├── graph/route.ts          # GET /api/graph - returns nodes, edges, deals
│   └── companies/route.ts      # GET /api/companies - company list

components/graph/
├── GraphView.tsx               # Force-graph canvas rendering
├── Sidebar.tsx                 # Deal/company details panel
├── GraphFilters.tsx            # Filter controls (flow type, deal type, confidence)
├── CompanySelector.tsx         # Company multi-select dropdown
├── DealCard.tsx                # Deal detail card

lib/
├── prisma.ts                   # Prisma client singleton
├── caseStudies.ts              # Case study definitions
├── graph/
│   ├── types.ts                # GraphResponse, NodeDTO, EdgeDTO, DealDTO
│   └── deriveGraph.ts          # Core logic: fetches deals, derives graph structure

prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Seed data for MVP demo
```

## Data Model

### Core Entities (Prisma)

- **Company** - Tech companies (OpenAI, Microsoft, NVIDIA, etc.)
- **Deal** - Business transactions with amount, type, date, tags
- **DealParty** - Junction table linking companies to deals with role/direction
- **Source** - Citations for deal data (SEC filings, press releases, etc.)

### Key Enums

- **DealType:** INVESTMENT, CLOUD_COMMITMENT, SUPPLY, PARTNERSHIP, ACQUISITION, REVENUE_SHARE
- **FlowType:** MONEY, COMPUTE_HARDWARE, SERVICE, EQUITY
- **PartyRole:** INVESTOR, INVESTEE, CUSTOMER, SUPPLIER, PARTNER, ACQUIRER, TARGET
- **FlowDirection:** OUTFLOW, INFLOW, NONE

### Graph DTOs

- **NodeDTO** - Company node for visualization
- **EdgeDTO** - Aggregated edge (from/to/type/amount) with dealIds
- **DealDTO** - Full deal details with parties and sources
- **GraphResponse** - `{ nodes, edges, dealsById }`

## Key Flows

### Graph Data Flow

1. `/graph` page loads → fetches `/api/graph?companies=...`
2. API calls `deriveGraph()` with company slugs and filters
3. `deriveGraph()` queries Prisma for companies and deals
4. Deals are processed to infer edge direction (OUTFLOW→INFLOW)
5. Edges are aggregated by (from, to, dealType, flowType)
6. Returns `{ nodes, edges, dealsById }` for visualization

### Edge Direction Inference

Direction is determined by:
1. Explicit `FlowDirection` on DealParty (OUTFLOW source, INFLOW target)
2. Fallback to role-based inference (INVESTOR→INVESTEE, CUSTOMER→SUPPLIER)
3. Partners are non-directional

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint check
npx prisma studio    # Database browser
npx prisma db seed   # Seed demo data
```

## Environment Variables

```
DATABASE_URL=        # Supabase pooled connection
DIRECT_URL=          # Supabase direct connection
```

## Verification (ALWAYS DO THIS)

Never mark a task as complete until you verify it works.

### After ANY code change:
1. Run `npm run lint` - fix any errors before continuing
2. Run `npm run build` - must compile with zero errors

### After changing Prisma schema:
1. Run `npx prisma generate`
2. Run `npx prisma db push` (for development)

### After UI changes:
1. Open http://localhost:3000 in the browser (use Chrome tool)
2. Navigate to the page you changed
3. Verify the UI looks correct and functions properly
4. Check the browser console for any errors
5. If something looks wrong or has errors, fix it and check again

### After API route changes:
1. Use the browser tool to test the endpoint
2. Or run a curl command to verify the response
3. Check for proper error handling

Do not tell me "done" until verification passes. If something fails, fix it and verify again.

## Adding Companies & Deals

This section explains how to add new companies and deals to the visualization.

### Current Companies (as of Jan 2025)

| Slug | Name | Color |
|------|------|-------|
| `openai` | OpenAI | `#10B981` (green) |
| `microsoft` | Microsoft | `#3B82F6` (blue) |
| `nvidia` | NVIDIA | `#84CC16` (lime) |
| `meta` | Meta | `#0668E1` (meta blue) |
| `coreweave` | CoreWeave | `#7C3AED` (purple) |
| `scale-ai` | Scale AI | `#E11D48` (rose) |

### Step 1: Add a New Company

Add to `COMPANIES` array in `prisma/seed.ts`:

```typescript
{
  slug: 'company-slug',        // lowercase, hyphens (used in URLs and nodeColors)
  name: 'Company Name',
  ticker: 'TICK',              // optional, for public companies
  description: 'Brief description of the company',
  websiteUrl: 'https://company.com',
  logoUrl: '/logos/company.svg',  // optional
},
```

### Step 2: Add Node Color

Add to `nodeColors` in `components/graph/GraphView.tsx`:

```typescript
const nodeColors: Record<string, string> = {
  // ... existing colors
  'company-slug': '#HEX_COLOR',  // use slug as key, pick distinct color
};
```

### Step 3: Add a Deal

Add to `DEALS` array in `prisma/seed.ts`:

```typescript
{
  slug: 'company-a-company-b-type-year',  // unique identifier
  title: 'Deal Title',
  summary: 'Detailed description of the deal...',
  dealType: DealType.INVESTMENT,          // see enum below
  flowType: FlowType.MONEY,               // see enum below
  announcedAt: new Date('YYYY-MM-DD'),
  amountUSD: 1_000_000_000,               // optional, use underscores
  amountText: '$1 billion description',   // human-readable
  dataStatus: DataStatus.CONFIRMED,       // or ESTIMATED
  tags: ['tag1', 'tag2'],
  parties: [
    { companySlug: 'company-a', role: PartyRole.INVESTOR, direction: FlowDirection.OUTFLOW },
    { companySlug: 'company-b', role: PartyRole.INVESTEE, direction: FlowDirection.INFLOW },
  ],
  sources: [
    {
      sourceType: SourceType.NEWS,
      publisher: 'Publisher Name',
      url: 'https://source-url.com',
      publishedAt: new Date('YYYY-MM-DD'),
      excerpt: 'Brief quote from source',
      reliability: 5,  // 1-5 scale
      confidence: 5,   // 1-5 scale
    },
  ],
},
```

### Enum Reference

**DealType:**
- `INVESTMENT` - Equity investment
- `CLOUD_COMMITMENT` - Cloud services contract
- `SUPPLY` - Hardware/product supply agreement
- `PARTNERSHIP` - Strategic partnership (often bidirectional)
- `ACQUISITION` - Company acquisition
- `REVENUE_SHARE` - Revenue sharing arrangement

**FlowType:**
- `MONEY` - Cash/investment
- `COMPUTE_HARDWARE` - GPUs, chips, servers
- `SERVICE` - Cloud services, SaaS
- `EQUITY` - Stock/ownership

**PartyRole & FlowDirection Patterns:**

| Role | Direction | Description |
|------|-----------|-------------|
| `INVESTOR` | `OUTFLOW` | Money flows out to investee |
| `INVESTEE` | `INFLOW` | Money flows in from investor |
| `CUSTOMER` | `OUTFLOW` | Payment flows out to supplier |
| `SUPPLIER` | `INFLOW` | Payment flows in from customer |
| `PARTNER` | `NONE` | Bidirectional, no directed flow |
| `ACQUIRER` | `OUTFLOW` | Money flows out to target |
| `TARGET` | `INFLOW` | Money flows in from acquirer |

**SourceType:**
- `NEWS` - News articles (CNBC, Reuters, Bloomberg)
- `PRESS_RELEASE` - Official company announcements
- `SEC_FILING` - SEC filings (10-K, 8-K, S-1)
- `BLOG` - Company blogs

**DataStatus:**
- `CONFIRMED` - Officially announced with specific numbers
- `ESTIMATED` - Reported but not officially confirmed

### Step 4: Verify Changes

```bash
npm run build        # Must compile without errors
npx prisma db seed   # Seed the database
```

Then check http://localhost:3000/graph to see new nodes/edges.

### Research Tips for Finding Deals

When researching deals between AI companies:
1. Search for "[Company A] [Company B] investment/partnership/deal"
2. Look for official sources: press releases, SEC filings, company blogs
3. Verify amounts and dates from multiple sources
4. Note if numbers are confirmed vs estimated
5. Include source URLs for citations