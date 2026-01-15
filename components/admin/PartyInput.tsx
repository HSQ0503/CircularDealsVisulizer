'use client';

import { PartyRole, FlowDirection } from '@prisma/client';

type Company = {
  id: string;
  name: string;
  slug: string;
};

export type PartyFormState = {
  companyId: string;
  role: PartyRole;
  direction: FlowDirection;
  notes: string;
};

type PartyInputProps = {
  party: PartyFormState;
  companies: Company[];
  onChange: (party: PartyFormState) => void;
  onRemove: () => void;
  canRemove: boolean;
};

const roleOptions: { value: PartyRole; label: string }[] = [
  { value: 'INVESTOR', label: 'Investor' },
  { value: 'INVESTEE', label: 'Investee' },
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'SUPPLIER', label: 'Supplier' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'ACQUIRER', label: 'Acquirer' },
  { value: 'TARGET', label: 'Target' },
  { value: 'OTHER', label: 'Other' },
];

const directionOptions: { value: FlowDirection; label: string }[] = [
  { value: 'OUTFLOW', label: 'Outflow (gives value)' },
  { value: 'INFLOW', label: 'Inflow (receives value)' },
  { value: 'NONE', label: 'None (mutual)' },
];

export function PartyInput({ party, companies, onChange, onRemove, canRemove }: PartyInputProps) {
  return (
    <div className="flex flex-wrap gap-2 items-start p-3 bg-surface-2 rounded-lg border border-border-subtle">
      <select
        value={party.companyId}
        onChange={(e) => onChange({ ...party, companyId: e.target.value })}
        className="flex-1 min-w-[150px] px-3 py-2 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
      >
        <option value="">Select company...</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={party.role}
        onChange={(e) => onChange({ ...party, role: e.target.value as PartyRole })}
        className="w-[130px] px-3 py-2 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
      >
        {roleOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={party.direction}
        onChange={(e) => onChange({ ...party, direction: e.target.value as FlowDirection })}
        className="w-[180px] px-3 py-2 bg-surface border border-border rounded-md text-sm text-text focus:outline-none focus:border-primary"
      >
        {directionOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="px-2 py-2 text-text-faint hover:text-danger transition-colors"
          title="Remove party"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
