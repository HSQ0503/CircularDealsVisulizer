import Link from 'next/link';
import { CASE_STUDIES } from '@/lib/caseStudies';

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border-subtle bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-text-muted hover:text-text transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-text">Case Studies</h1>
                <p className="text-sm text-text-muted">Explore key deal relationships in the AI ecosystem</p>
              </div>
            </div>
            <Link href="/graph" className="btn btn-ghost btn-sm">
              View All Companies
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Featured Section */}
        {CASE_STUDIES.filter(cs => cs.featured).length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-6">
              Featured
            </h2>
            <div className="grid gap-6">
              {CASE_STUDIES.filter(cs => cs.featured).map(caseStudy => (
                <FeaturedCaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
              ))}
            </div>
          </section>
        )}

        {/* All Case Studies */}
        <section>
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-6">
            All Case Studies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map(caseStudy => (
              <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
            ))}
          </div>

          {CASE_STUDIES.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">No case studies available yet.</p>
            </div>
          )}
        </section>

        {/* Coming Soon Placeholder */}
        {CASE_STUDIES.length < 3 && (
          <section className="mt-12">
            <div className="border border-dashed border-border rounded-lg p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text mb-2">More Case Studies Coming</h3>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                We&apos;re adding more case studies to highlight interesting deal relationships
                across the AI industry. Check back soon!
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// Featured Case Study Card (larger, more prominent)
function FeaturedCaseStudyCard({ caseStudy }: { caseStudy: typeof CASE_STUDIES[0] }) {
  const companiesParam = caseStudy.companySlugs.join(',');

  return (
    <Link
      href={`/graph?companies=${companiesParam}`}
      className="group block"
    >
      <div className="card card-hover overflow-hidden">
        {/* Gradient Header */}
        <div className={`h-2 bg-gradient-to-r ${caseStudy.highlightColor}`} />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge bg-primary/10 text-primary">Featured</span>
              </div>
              <h3 className="text-xl font-semibold text-text group-hover:text-primary transition-colors">
                {caseStudy.title}
              </h3>
              <p className="text-sm text-text-muted mt-1">{caseStudy.subtitle}</p>
            </div>

            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <svg className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <p className="text-sm text-text-muted mt-4 leading-relaxed">
            {caseStudy.description}
          </p>

          {/* Stats */}
          {caseStudy.stats && caseStudy.stats.length > 0 && (
            <div className="flex gap-6 mt-6 pt-6 border-t border-border-subtle">
              {caseStudy.stats.map(stat => (
                <div key={stat.label}>
                  <div className="text-lg font-semibold text-text">{stat.value}</div>
                  <div className="text-xs text-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Company Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {caseStudy.companySlugs.map(slug => (
              <span
                key={slug}
                className="px-2 py-1 text-xs bg-surface-2 text-text-muted rounded capitalize"
              >
                {slug}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Regular Case Study Card
function CaseStudyCard({ caseStudy }: { caseStudy: typeof CASE_STUDIES[0] }) {
  const companiesParam = caseStudy.companySlugs.join(',');

  return (
    <Link
      href={`/graph?companies=${companiesParam}`}
      className="group block"
    >
      <div className="card card-hover h-full">
        {/* Gradient Header */}
        <div className={`h-1 bg-gradient-to-r ${caseStudy.highlightColor}`} />

        <div className="p-5">
          <h3 className="text-base font-semibold text-text group-hover:text-primary transition-colors">
            {caseStudy.title}
          </h3>
          <p className="text-sm text-text-muted mt-1">{caseStudy.subtitle}</p>

          <p className="text-sm text-text-muted mt-3 line-clamp-2">
            {caseStudy.description}
          </p>

          {/* Company Pills */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {caseStudy.companySlugs.map(slug => (
              <span
                key={slug}
                className="px-2 py-0.5 text-xs bg-surface-2 text-text-muted rounded capitalize"
              >
                {slug}
              </span>
            ))}
          </div>

          {/* View Link */}
          <div className="flex items-center gap-1 mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>View case study</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
