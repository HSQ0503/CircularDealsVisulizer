'use client';

import { SourceType } from '@prisma/client';

export type SourceFormState = {
  sourceType: SourceType;
  publisher: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  reliability: number;
  confidence: number;
};

type SourceInputProps = {
  source: SourceFormState;
  onChange: (source: SourceFormState) => void;
  onRemove: () => void;
};

const sourceTypeOptions: { value: SourceType; label: string }[] = [
  { value: 'PRESS_RELEASE', label: 'Press Release' },
  { value: 'NEWS', label: 'News Article' },
  { value: 'SEC_FILING', label: 'SEC Filing' },
  { value: 'EARNINGS_CALL', label: 'Earnings Call' },
  { value: 'BLOG', label: 'Blog Post' },
  { value: 'OTHER', label: 'Other' },
];

export function SourceInput({ source, onChange, onRemove }: SourceInputProps) {
  return (
    <div className="p-3 bg-surface-2 rounded-lg border border-border-subtle space-y-3">
      <div className="flex gap-2 items-start">
        <select
          value={source.sourceType}
          onChange={(e) => onChange({ ...source, sourceType: e.target.value as SourceType })}
          className="w-[140px] px-3 py-2 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
        >
          {sourceTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Publisher"
          value={source.publisher}
          onChange={(e) => onChange({ ...source, publisher: e.target.value })}
          className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary"
        />

        <button
          type="button"
          onClick={onRemove}
          className="px-2 py-2 text-text-faint hover:text-danger transition-colors"
          title="Remove source"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <input
        type="url"
        placeholder="URL"
        value={source.url}
        onChange={(e) => onChange({ ...source, url: e.target.value })}
        className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary"
      />

      <div className="flex gap-2 items-center">
        <label className="text-xs text-text-muted w-[80px]">Confidence</label>
        <input
          type="range"
          min={1}
          max={5}
          value={source.confidence}
          onChange={(e) => onChange({ ...source, confidence: parseInt(e.target.value, 10) })}
          className="flex-1 h-1.5 bg-surface-3 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:cursor-pointer
          "
        />
        <span className="text-xs text-text-muted w-[20px]">{source.confidence}</span>
      </div>
    </div>
  );
}
