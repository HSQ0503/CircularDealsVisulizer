'use client';

import type { DealDTO } from '@/lib/graph/types';

interface DealCardProps {
  deal: DealDTO;
  compact?: boolean;
}

const flowTypeColors: Record<string, string> = {
  MONEY: 'badge-money',
  COMPUTE_HARDWARE: 'badge-compute',
  SERVICE: 'badge-service',
  EQUITY: 'badge-equity',
};

const dealTypeLabels: Record<string, string> = {
  INVESTMENT: 'Investment',
  CLOUD_COMMITMENT: 'Cloud Commitment',
  SUPPLY: 'Supply',
  PARTNERSHIP: 'Partnership',
  ACQUISITION: 'Acquisition',
  REVENUE_SHARE: 'Revenue Share',
  OTHER: 'Other',
};

export function DealCard({ deal, compact = false }: DealCardProps) {
  const flowBadge = flowTypeColors[deal.flowType] || 'badge-money';
  
  const formatAmount = () => {
    if (deal.amountText) return deal.amountText;
    if (deal.amountUSD) return formatUSD(deal.amountUSD);
    if (deal.amountUSDMax) return `Up to ${formatUSD(deal.amountUSDMax)}`;
    if (deal.amountUSDMin && deal.amountUSDMax) {
      return `${formatUSD(deal.amountUSDMin)} - ${formatUSD(deal.amountUSDMax)}`;
    }
    return 'Undisclosed';
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (compact) {
    return (
      <div className="p-3 bg-surface-2 rounded-lg border border-border-subtle hover:border-border transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-text truncate">{deal.title}</h4>
            <p className="text-xs text-text-muted mt-0.5">{formatAmount()}</p>
          </div>
          <span className={`badge ${flowBadge} flex-shrink-0`}>
            {deal.flowType.replace('_', ' ')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4 space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-text">{deal.title}</h3>
          <p className="text-xs text-text-faint mt-1">{formatDate(deal.announcedAt)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`badge ${flowBadge}`}>
            {deal.flowType.replace('_', ' ')}
          </span>
          <span className="badge bg-surface-3 text-text-muted">
            {dealTypeLabels[deal.dealType] || deal.dealType}
          </span>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-text-muted leading-relaxed">{deal.summary}</p>

      {/* Amount */}
      <div className="flex items-center gap-2 py-2 px-3 bg-surface-2 rounded-md">
        <span className="text-xs text-text-faint uppercase tracking-wide">Amount</span>
        <span className="text-sm font-medium text-text">{formatAmount()}</span>
        {deal.dataStatus !== 'CONFIRMED' && (
          <span className="text-xs text-warning">({deal.dataStatus.toLowerCase()})</span>
        )}
      </div>

      {/* Parties */}
      <div className="space-y-1">
        <span className="text-xs text-text-faint uppercase tracking-wide">Parties</span>
        <div className="flex flex-wrap gap-2">
          {deal.parties.map((party, i) => (
            <div 
              key={i}
              className="text-xs px-2 py-1 bg-surface-3 rounded border border-border-subtle"
            >
              <span className="font-medium text-text">{party.companyName}</span>
              <span className="text-text-faint ml-1">({party.role.toLowerCase()})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      {deal.sources.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-border-subtle">
          <span className="text-xs text-text-faint uppercase tracking-wide">Sources</span>
          <div className="space-y-1">
            {deal.sources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-primary hover:text-primary-hover transition-colors"
              >
                <span>{source.publisher}</span>
                <span className="text-text-faint">• Confidence: {source.confidence}/5</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {deal.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2">
          {deal.tags.map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-primary-muted/30 text-primary rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function formatUSD(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(0)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  }
  return `$${amount.toLocaleString()}`;
}
