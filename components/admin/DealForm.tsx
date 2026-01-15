'use client';

import { useState, useEffect } from 'react';
import { DealType, FlowType, DataStatus, PartyRole, FlowDirection, SourceType } from '@prisma/client';
import { PartyInput, type PartyFormState } from './PartyInput';
import { SourceInput, type SourceFormState } from './SourceInput';

type Company = {
  id: string;
  name: string;
  slug: string;
};

const defaultParty: PartyFormState = {
  companyId: '',
  role: 'PARTNER' as PartyRole,
  direction: 'NONE' as FlowDirection,
  notes: '',
};

const defaultSource: SourceFormState = {
  sourceType: 'NEWS' as SourceType,
  publisher: '',
  url: '',
  publishedAt: '',
  excerpt: '',
  reliability: 3,
  confidence: 3,
};

const dealTypeOptions: { value: DealType; label: string }[] = [
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'CLOUD_COMMITMENT', label: 'Cloud Commitment' },
  { value: 'SUPPLY', label: 'Supply Agreement' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'ACQUISITION', label: 'Acquisition' },
  { value: 'REVENUE_SHARE', label: 'Revenue Share' },
  { value: 'OTHER', label: 'Other' },
];

const flowTypeOptions: { value: FlowType; label: string }[] = [
  { value: 'MONEY', label: 'Money' },
  { value: 'COMPUTE_HARDWARE', label: 'Compute/Hardware' },
  { value: 'SERVICE', label: 'Service' },
  { value: 'EQUITY', label: 'Equity' },
];

const dataStatusOptions: { value: DataStatus; label: string }[] = [
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'ESTIMATED', label: 'Estimated' },
  { value: 'RUMORED', label: 'Rumored' },
  { value: 'UNKNOWN', label: 'Unknown' },
];

export function DealForm() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [dealType, setDealType] = useState<DealType>('INVESTMENT');
  const [flowType, setFlowType] = useState<FlowType>('MONEY');
  const [announcedAt, setAnnouncedAt] = useState('');
  const [dataStatus, setDataStatus] = useState<DataStatus>('CONFIRMED');
  const [amountUSD, setAmountUSD] = useState('');
  const [amountUSDMin, setAmountUSDMin] = useState('');
  const [amountUSDMax, setAmountUSDMax] = useState('');
  const [amountText, setAmountText] = useState('');
  const [tags, setTags] = useState('');
  const [parties, setParties] = useState<PartyFormState[]>([{ ...defaultParty }, { ...defaultParty }]);
  const [sources, setSources] = useState<SourceFormState[]>([]);

  useEffect(() => {
    fetch('/api/companies')
      .then((res) => res.json())
      .then(setCompanies)
      .catch(console.error);
  }, []);

  const addParty = () => setParties([...parties, { ...defaultParty }]);
  const removeParty = (index: number) => setParties(parties.filter((_, i) => i !== index));
  const updateParty = (index: number, party: PartyFormState) => {
    const updated = [...parties];
    updated[index] = party;
    setParties(updated);
  };

  const addSource = () => setSources([...sources, { ...defaultSource }]);
  const removeSource = (index: number) => setSources(sources.filter((_, i) => i !== index));
  const updateSource = (index: number, source: SourceFormState) => {
    const updated = [...sources];
    updated[index] = source;
    setSources(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const payload = {
      title,
      summary,
      dealType,
      flowType,
      announcedAt,
      dataStatus,
      amountUSD: amountUSD ? parseFloat(amountUSD) : null,
      amountUSDMin: amountUSDMin ? parseFloat(amountUSDMin) : null,
      amountUSDMax: amountUSDMax ? parseFloat(amountUSDMax) : null,
      amountText: amountText || null,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      parties: parties.map((p) => ({
        companyId: p.companyId,
        role: p.role,
        direction: p.direction,
        notes: p.notes || undefined,
      })),
      sources: sources.length > 0 ? sources.map((s) => ({
        sourceType: s.sourceType,
        publisher: s.publisher,
        url: s.url,
        publishedAt: s.publishedAt || undefined,
        excerpt: s.excerpt || undefined,
        reliability: s.reliability,
        confidence: s.confidence,
      })) : undefined,
    };

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create deal');
        return;
      }

      setSuccess(true);
      // Reset form
      setTitle('');
      setSummary('');
      setDealType('INVESTMENT');
      setFlowType('MONEY');
      setAnnouncedAt('');
      setDataStatus('CONFIRMED');
      setAmountUSD('');
      setAmountUSDMin('');
      setAmountUSDMax('');
      setAmountText('');
      setTags('');
      setParties([{ ...defaultParty }, { ...defaultParty }]);
      setSources([]);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-success/10 border border-success/30 rounded-lg text-success text-sm">
          Deal created successfully!{' '}
          <a href="/graph" className="underline">View in graph</a>
        </div>
      )}

      {/* Basic Info */}
      <div className="card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text">Basic Info</h3>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Microsoft Investment in OpenAI"
            required
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
            Summary *
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief description of the deal..."
            required
            rows={3}
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              Deal Type *
            </label>
            <select
              value={dealType}
              onChange={(e) => setDealType(e.target.value as DealType)}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
            >
              {dealTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              Flow Type *
            </label>
            <select
              value={flowType}
              onChange={(e) => setFlowType(e.target.value as FlowType)}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
            >
              {flowTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              Announced Date *
            </label>
            <input
              type="date"
              value={announcedAt}
              onChange={(e) => setAnnouncedAt(e.target.value)}
              required
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              Data Status *
            </label>
            <select
              value={dataStatus}
              onChange={(e) => setDataStatus(e.target.value as DataStatus)}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
            >
              {dataStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text">Amount</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              Exact (USD)
            </label>
            <input
              type="number"
              value={amountUSD}
              onChange={(e) => setAmountUSD(e.target.value)}
              placeholder="e.g., 10000000000"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              Min (USD)
            </label>
            <input
              type="number"
              value={amountUSDMin}
              onChange={(e) => setAmountUSDMin(e.target.value)}
              placeholder="e.g., 10000000000"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              Max (USD)
            </label>
            <input
              type="number"
              value={amountUSDMax}
              onChange={(e) => setAmountUSDMax(e.target.value)}
              placeholder="e.g., 13000000000"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              Text Description
            </label>
            <input
              type="text"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              placeholder="e.g., $10-13B investment"
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Parties */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Parties *</h3>
          <button
            type="button"
            onClick={addParty}
            className="btn btn-ghost btn-sm"
          >
            + Add Party
          </button>
        </div>
        <p className="text-xs text-text-muted">At least 2 parties required</p>

        <div className="space-y-2">
          {parties.map((party, index) => (
            <PartyInput
              key={index}
              party={party}
              companies={companies}
              onChange={(p) => updateParty(index, p)}
              onRemove={() => removeParty(index)}
              canRemove={parties.length > 2}
            />
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Sources</h3>
          <button
            type="button"
            onClick={addSource}
            className="btn btn-ghost btn-sm"
          >
            + Add Source
          </button>
        </div>
        <p className="text-xs text-text-muted">Optional: Add sources to support the deal data</p>

        {sources.length === 0 ? (
          <p className="text-sm text-text-faint italic">No sources added</p>
        ) : (
          <div className="space-y-2">
            {sources.map((source, index) => (
              <SourceInput
                key={index}
                source={source}
                onChange={(s) => updateSource(index, s)}
                onRemove={() => removeSource(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text">Tags</h3>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., ai, investment, compute (comma-separated)"
          className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary px-8 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Deal'}
        </button>
      </div>
    </form>
  );
}
