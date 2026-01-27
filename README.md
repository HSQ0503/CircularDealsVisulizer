# AI Bubble Map

An interactive visualization tool for exploring circular financial flows between AI companies. Reveals how investments, cloud commitments, and supply deals create interconnected loops among major tech players.

## The Story

The AI industry has a circularity problem. Microsoft invests $13B in OpenAI. OpenAI commits $100B back to Azure. Microsoft buys NVIDIA GPUs. NVIDIA invests in CoreWeave. CoreWeave supplies compute to OpenAI. The same dollars flow in circles.

This tool visualizes these patterns, helping answer: **Are these real value-creating partnerships, or financial engineering?**

## Features

- **Interactive Force Graph** - Explore companies as nodes and deals as directed edges
- **Circular Flow Detection** - Automatically identifies 2-party loops and multi-party cycles (3-5 companies)
- **Deal Aggregation** - Groups related transactions into aggregated edges with total amounts
- **Filtering** - Filter by deal type, flow type, date range, and confidence level
- **Case Studies** - Pre-configured views highlighting notable patterns:
  - The AI Triangle (OpenAI ↔ Microsoft ↔ NVIDIA)
  - Project Stargate (OpenAI × SoftBank × Oracle × NVIDIA)
  - Anthropic Proxy War (Amazon vs Google)
  - GPU Cloud Loop (CoreWeave × NVIDIA × OpenAI × Microsoft)
- **Source Attribution** - Every deal backed by citations (SEC filings, press releases, news)
- **Statistical Testing** - Null model analysis to determine if circular patterns are significant

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [PostgreSQL](https://www.postgresql.org/) | Database (via Supabase) |
| [Prisma 5](https://www.prisma.io/) | ORM |
| [react-force-graph-2d](https://github.com/vasturiano/react-force-graph) | Graph visualization |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Supabase](https://supabase.com/) account)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aibubvis.git
cd aibubvis

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URLs
```

### Environment Variables

```
DATABASE_URL=       # Supabase pooled connection string
DIRECT_URL=         # Supabase direct connection string
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed demo data
npx prisma db seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── graph/page.tsx           # Main visualization
├── case-studies/page.tsx    # Case studies listing
├── research/page.tsx        # Research insights
└── api/
    ├── graph/route.ts       # Graph data API
    ├── companies/route.ts   # Company list API
    └── deals/route.ts       # Deal management API

components/graph/
├── GraphView.tsx            # Force-graph canvas
├── Sidebar.tsx              # Detail panel
├── GraphFilters.tsx         # Filter controls
└── DealCard.tsx             # Deal display

lib/graph/
├── types.ts                 # TypeScript definitions
├── deriveGraph.ts           # Graph derivation logic
└── nullModel.ts             # Statistical analysis

prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Demo data
```

## Data Model

### Core Entities

- **Company** - Tech companies (OpenAI, Microsoft, NVIDIA, etc.)
- **Deal** - Business transactions with amounts, types, and dates
- **DealParty** - Links companies to deals with roles and flow direction
- **Source** - Citations for deal data

### Deal Types

| Type | Description |
|------|-------------|
| `INVESTMENT` | Equity investment |
| `CLOUD_COMMITMENT` | Cloud services contract |
| `SUPPLY` | Hardware/product supply agreement |
| `PARTNERSHIP` | Strategic partnership |
| `ACQUISITION` | Company acquisition |
| `REVENUE_SHARE` | Revenue sharing arrangement |

### Flow Types

| Type | Description |
|------|-------------|
| `MONEY` | Cash/investment |
| `COMPUTE_HARDWARE` | GPUs, chips, servers |
| `SERVICE` | Cloud services, SaaS |
| `EQUITY` | Stock/ownership |

## API Reference

### GET /api/graph

Returns graph data for visualization.

**Query Parameters:**
- `companies` - Comma-separated company slugs (optional, defaults to all)
- `dealTypes` - Filter by deal types
- `flowTypes` - Filter by flow types
- `minConfidence` - Minimum confidence score (1-5)

**Response:**
```json
{
  "nodes": [{ "id": "openai", "name": "OpenAI", ... }],
  "edges": [{ "from": "microsoft", "to": "openai", "amount": 13000000000, ... }],
  "dealsById": { "deal-1": { ... } },
  "loops": [...],
  "cycles": [...]
}
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run start        # Start production server
npx prisma studio    # Open database browser
npx prisma db seed   # Seed demo data
```

## Contributing

Contributions are welcome. When adding new deals:

1. Add company to `COMPANIES` array in `prisma/seed.ts`
2. Add node color to `nodeColors` in `components/graph/GraphView.tsx`
3. Add deal with sources to `DEALS` array in `prisma/seed.ts`
4. Run `npm run build` to verify
5. Run `npx prisma db seed` to update database

See `CLAUDE.md` for detailed instructions on the data model and adding companies/deals.

## License

MIT
