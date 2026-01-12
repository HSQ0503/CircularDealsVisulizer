'use client';

import { FlowType, DealType } from '@prisma/client';

interface GraphFiltersProps {
  selectedFlowTypes: FlowType[];
  selectedDealTypes: DealType[];
  minConfidence: number;
  onFlowTypesChange: (types: FlowType[]) => void;
  onDealTypesChange: (types: DealType[]) => void;
  onConfidenceChange: (value: number) => void;
}

const flowTypeOptions: { value: FlowType; label: string; color: string }[] = [
  { value: 'MONEY', label: 'Money', color: 'bg-flow-money' },
  { value: 'COMPUTE_HARDWARE', label: 'Compute', color: 'bg-flow-compute' },
  { value: 'SERVICE', label: 'Service', color: 'bg-flow-service' },
  { value: 'EQUITY', label: 'Equity', color: 'bg-flow-equity' },
];

const dealTypeOptions: { value: DealType; label: string }[] = [
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'CLOUD_COMMITMENT', label: 'Cloud' },
  { value: 'SUPPLY', label: 'Supply' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'ACQUISITION', label: 'Acquisition' },
  { value: 'REVENUE_SHARE', label: 'Revenue Share' },
  { value: 'OTHER', label: 'Other' },
];

export function GraphFilters({
  selectedFlowTypes,
  selectedDealTypes,
  minConfidence,
  onFlowTypesChange,
  onDealTypesChange,
  onConfidenceChange,
}: GraphFiltersProps) {
  const toggleFlowType = (type: FlowType) => {
    if (selectedFlowTypes.includes(type)) {
      onFlowTypesChange(selectedFlowTypes.filter(t => t !== type));
    } else {
      onFlowTypesChange([...selectedFlowTypes, type]);
    }
  };

  const toggleDealType = (type: DealType) => {
    if (selectedDealTypes.includes(type)) {
      onDealTypesChange(selectedDealTypes.filter(t => t !== type));
    } else {
      onDealTypesChange([...selectedDealTypes, type]);
    }
  };

  return (
    <div className="card p-4 space-y-4">
      {/* Flow Types */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Flow Type
        </label>
        <div className="flex flex-wrap gap-2">
          {flowTypeOptions.map(option => {
            const isSelected = selectedFlowTypes.length === 0 || selectedFlowTypes.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleFlowType(option.value)}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all
                  ${isSelected 
                    ? 'bg-surface-3 text-text border border-border' 
                    : 'bg-surface text-text-faint border border-border-subtle opacity-50 hover:opacity-75'
                  }
                `}
              >
                <span className={`w-2 h-2 rounded-full ${option.color}`} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deal Types */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Deal Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {dealTypeOptions.map(option => {
            const isSelected = selectedDealTypes.length === 0 || selectedDealTypes.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleDealType(option.value)}
                className={`
                  px-2 py-1 rounded text-xs font-medium transition-all
                  ${isSelected 
                    ? 'bg-primary-muted/40 text-primary border border-primary/30' 
                    : 'bg-surface text-text-faint border border-border-subtle opacity-50 hover:opacity-75'
                  }
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confidence */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
            Min Confidence
          </label>
          <span className="text-xs text-text-muted">{minConfidence}/5</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          value={minConfidence}
          onChange={(e) => onConfidenceChange(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-surface-3 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
          "
        />
      </div>
    </div>
  );
}
