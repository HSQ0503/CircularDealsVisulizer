import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-muted/20 via-bg to-bg -z-10" />
      
      <div className="max-w-2xl text-center space-y-8 animate-slide-up">
        {/* Logo / Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-gradient">AI Circular Deals</span>
          </h1>
          <p className="text-lg text-text-muted max-w-lg mx-auto">
            Visualizing the interconnected investments, partnerships, and commitments 
            shaping the AI industry. Follow the money. See the loops.
          </p>
        </div>

        {/* Case Study Preview */}
        <div className="card p-6 text-left space-y-4">
          <div className="flex items-center gap-2">
            <span className="badge badge-investment">Featured Case Study</span>
          </div>
          <h2 className="text-xl font-semibold">
            The OpenAI ↔ Microsoft ↔ NVIDIA Triangle
          </h2>
          <p className="text-text-muted text-sm">
            A circular flow of investments, cloud commitments, and GPU infrastructure 
            deals worth hundreds of billions of dollars. NVIDIA funds OpenAI → OpenAI 
            spends on Azure → Azure spends on NVIDIA systems.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="badge badge-money">$100B+ NVIDIA Investment</span>
            <span className="badge badge-service">$250B Azure Commitment</span>
            <span className="badge badge-compute">10GW GPU Deployment</span>
          </div>
        </div>

        {/* CTA */}
        <Link 
          href="/graph" 
          className="btn btn-primary text-base px-8 py-3 inline-flex"
        >
          Explore the Graph
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {/* Footer note */}
        <p className="text-xs text-text-faint pt-8">
          Data sourced from public filings, press releases, and verified reporting.
          <br />
          This is an MVP demonstration with representative deal data.
        </p>
      </div>
    </main>
  );
}
