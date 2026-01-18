import Link from 'next/link';
import { AnimatedGraphPreview } from '@/components/graph/AnimatedGraphPreview';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-muted/20 via-bg to-bg -z-10" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border-subtle bg-bg/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-gradient">
            AI Bubble Map
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/case-studies"
              className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors"
            >
              Case Studies
            </Link>
            <Link
              href="/research"
              className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors"
            >
              Research
            </Link>
            <Link
              href="/graph"
              className="ml-2 btn btn-primary btn-sm"
            >
              Explore Graph
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div className="space-y-6 text-center md:text-left animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text">
                Follow the money in AI
              </h1>
              <p className="text-lg text-text-muted">
                The biggest names in AI are investing in each other, buying from each other,
                and betting billions on each other&apos;s success. We mapped the money.
                The same dollars keep changing hands.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/graph"
                  className="btn btn-primary text-base px-6 py-3"
                >
                  Explore the Graph
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <p className="text-sm text-text-faint">
                $350 billion+ flowing between just three companies. Where does it actually come from?
              </p>
            </div>

            {/* Right: Animated graph preview */}
            <div className="order-first md:order-last">
              <AnimatedGraphPreview />
            </div>
          </div>
        </div>
      </section>

      {/* The Pattern Section */}
      <section className="py-16 px-6 border-t border-border-subtle">
        <div className="max-w-4xl mx-auto">
          <p className="section-header text-center mb-3">The Pattern</p>
          <p className="text-center text-text-muted mb-8 max-w-xl mx-auto">
            No one&apos;s talking about how the money actually flows
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="how-it-works-card">
              <div className="how-it-works-icon bg-flow-money/10">
                <svg className="w-6 h-6 text-flow-money" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-text mb-2">A Invests in B</h3>
              <p className="text-sm text-text-muted">
                Microsoft pours $13B+ into OpenAI, buying a stake in the company
              </p>
            </div>

            {/* Step 2 */}
            <div className="how-it-works-card">
              <div className="how-it-works-icon bg-flow-service/10">
                <svg className="w-6 h-6 text-flow-service" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-text mb-2">B Spends It on C</h3>
              <p className="text-sm text-text-muted">
                OpenAI commits billions to Azure cloud and NVIDIA GPUs
              </p>
            </div>

            {/* Step 3 */}
            <div className="how-it-works-card">
              <div className="how-it-works-icon bg-flow-equity/10">
                <svg className="w-6 h-6 text-flow-equity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-text mb-2">C Sells Back to A</h3>
              <p className="text-sm text-text-muted">
                NVIDIA sells chips to Microsoft&apos;s data centers. The circle closes.
              </p>
            </div>
          </div>
          <p className="text-center text-text-muted mt-8 text-sm max-w-lg mx-auto">
            The money goes in circles. Each company&apos;s growth depends on the others.
            What happens if one link breaks?
          </p>
        </div>
      </section>

      {/* The Scale Section */}
      <section className="py-16 px-6 border-t border-border-subtle">
        <div className="max-w-3xl mx-auto">
          <p className="section-header text-center mb-3">The Scale</p>
          <p className="text-center text-text-muted mb-8">
            What the deals say vs. what the numbers show
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="text-xs text-text-faint uppercase tracking-wide mb-1">The Deal</p>
                <p className="text-text font-medium">Microsoft invested $13B+ in OpenAI</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-text-faint uppercase tracking-wide mb-1">The Reality</p>
                <p className="text-text font-medium">OpenAI 2024 revenue: ~$3.7B</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="text-xs text-text-faint uppercase tracking-wide mb-1">The Valuation</p>
                <p className="text-text font-medium">OpenAI valued at $150B</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-text-faint uppercase tracking-wide mb-1">The Multiple</p>
                <p className="text-text font-medium">That&apos;s 40x revenue</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="text-xs text-text-faint uppercase tracking-wide mb-1">The Growth</p>
                <p className="text-text font-medium">NVIDIA AI revenue doubled</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-text-faint uppercase tracking-wide mb-1">The Concentration</p>
                <p className="text-text font-medium">~80% from a handful of buyers</p>
              </div>
            </div>
          </div>
          <p className="text-center text-text-muted mt-8 text-sm max-w-lg mx-auto">
            In the dot-com boom, companies bought ads from each other with VC money.
            Today, AI companies buy compute from each other with investment money.
            The pattern rhymes.
          </p>
        </div>
      </section>

      {/* Key Questions Section */}
      <section className="py-16 px-6 border-t border-border-subtle">
        <div className="max-w-3xl mx-auto">
          <p className="section-header text-center mb-3">Key Questions</p>
          <p className="text-center text-text-muted mb-8">
            What you should be asking
          </p>
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-text mb-2">&quot;Where&apos;s the outside money?&quot;</h3>
              <p className="text-sm text-text-muted">
                Most AI revenue comes from other AI companies. Microsoft pays OpenAI, OpenAI pays Microsoft.
                NVIDIA sells to the hyperscalers who are also their investors. Who&apos;s the end customer?
              </p>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-text mb-2">&quot;What&apos;s the real demand?&quot;</h3>
              <p className="text-sm text-text-muted">
                Consumer AI products aren&apos;t profitable yet. ChatGPT costs more to run than it earns.
                Enterprise adoption is growing, but is it growing fast enough to justify these valuations?
              </p>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-text mb-2">&quot;Who&apos;s left holding the bag?&quot;</h3>
              <p className="text-sm text-text-muted">
                When circular flows stop, someone loses. The question is whether it&apos;s the companies,
                the investors, or the public markets that eventually absorb the correction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flow Legend Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="section-header text-center mb-6">Flow Types</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flow-legend-item">
              <div className="flow-legend-dot bg-flow-money" />
              <span className="text-sm text-text">Money</span>
            </div>
            <div className="flow-legend-item">
              <div className="flow-legend-dot bg-flow-compute" />
              <span className="text-sm text-text">Compute Hardware</span>
            </div>
            <div className="flow-legend-item">
              <div className="flow-legend-dot bg-flow-service" />
              <span className="text-sm text-text">Service</span>
            </div>
            <div className="flow-legend-item">
              <div className="flow-legend-dot bg-flow-equity" />
              <span className="text-sm text-text">Equity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Study Section */}
      <section className="py-16 px-6 border-t border-border-subtle">
        <div className="max-w-2xl mx-auto">
          <p className="section-header text-center mb-8">Featured Case Study</p>
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="badge badge-investment">Featured</span>
            </div>
            <h2 className="text-xl font-semibold">
              The OpenAI ↔ Microsoft ↔ NVIDIA Triangle
            </h2>
            <p className="text-text-muted text-sm">
              Microsoft invests billions in OpenAI. OpenAI spends it on Microsoft Azure
              and NVIDIA GPUs. NVIDIA sells to Microsoft. The same money flows in circles.
              Trace the loop yourself.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="badge badge-money">$13B+ Investment</span>
              <span className="badge badge-service">Azure Commitment</span>
              <span className="badge badge-compute">GPU Supply</span>
            </div>
            <Link
              href="/graph?companies=openai,microsoft,nvidia&caseStudy=triangle"
              className="btn btn-primary mt-4"
            >
              View This Case Study
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border-subtle">
        <p className="text-center text-xs text-text-faint max-w-lg mx-auto">
          Deal figures are estimates compiled from SEC filings, press releases, and reporting.
          The exact numbers are often undisclosed—which is part of the story.
        </p>
      </footer>
    </main>
  );
}
