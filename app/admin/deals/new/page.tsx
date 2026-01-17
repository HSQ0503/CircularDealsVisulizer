import Link from 'next/link';
import { DealForm } from '@/components/admin/DealForm';

export const metadata = {
  title: 'Add New Deal | AI Bubble Map',
};

export default function NewDealPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/graph"
            className="text-sm text-text-muted hover:text-text transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Graph
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-text mb-2">Add New Deal</h1>
        <p className="text-text-muted mb-8">
          Create a new deal between companies to add to the visualization.
        </p>

        <DealForm />
      </div>
    </div>
  );
}
