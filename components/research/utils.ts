export function formatUSD(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  }
  return `$${amount.toLocaleString()}`;
}

export function getSignificanceStars(pValue: number): string {
  if (pValue < 0.001) return '***';
  if (pValue < 0.01) return '**';
  if (pValue < 0.05) return '*';
  return '';
}

export function formatPValue(pValue: number): string {
  if (pValue < 0.001) return '< 0.001';
  if (pValue < 0.01) return pValue.toFixed(3);
  return pValue.toFixed(2);
}

export function getScoreClass(score: number): string {
  if (score >= 0.7) return 'research-score-high';
  if (score >= 0.5) return 'research-score-medium';
  return 'research-score-low';
}
