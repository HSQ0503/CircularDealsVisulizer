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