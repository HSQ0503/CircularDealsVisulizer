'use client';

import { useState, useEffect, useRef } from 'react';

interface Company {
  id: string;
  name: string;
  slug: string;
  ticker: string | null;
  logoUrl: string | null;
}

interface CompanySelectorProps {
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
}

export function CompanySelector({ selectedSlugs, onChange }: CompanySelectorProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch companies on mount
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch('/api/companies');
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCompany = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      onChange(selectedSlugs.filter(s => s !== slug));
    } else {
      onChange([...selectedSlugs, slug]);
    }
  };

  const selectAll = () => {
    onChange(companies.map(c => c.slug));
  };

  const clearAll = () => {
    onChange([]);
  };

  // Display text for the button
  const buttonText = loading
    ? 'Loading...'
    : selectedSlugs.length === 0
      ? 'All Companies'
      : selectedSlugs.length === companies.length
        ? 'All Companies'
        : `${selectedSlugs.length} Selected`;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm flex items-center gap-2"
        disabled={loading}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        {buttonText}
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !loading && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-xl z-50 animate-fade-in">
          {/* Header actions */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
            <span className="text-xs text-text-muted font-medium">Select Companies</span>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs text-primary hover:text-primary-hover"
              >
                All
              </button>
              <button
                onClick={clearAll}
                className="text-xs text-text-muted hover:text-text"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Company list */}
          <div className="max-h-64 overflow-y-auto py-1">
            {companies.map(company => {
              const isSelected = selectedSlugs.length === 0 || selectedSlugs.includes(company.slug);
              return (
                <button
                  key={company.id}
                  onClick={() => toggleCompany(company.slug)}
                  className={`
                    w-full px-3 py-2 flex items-center gap-3 text-left
                    hover:bg-surface-2 transition-colors
                    ${isSelected ? 'text-text' : 'text-text-muted'}
                  `}
                >
                  <div className={`
                    w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                    ${isSelected
                      ? 'bg-primary border-primary'
                      : 'border-border'
                    }
                  `}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{company.name}</div>
                    {company.ticker && (
                      <div className="text-xs text-text-faint">{company.ticker}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {companies.length === 0 && (
            <div className="px-3 py-4 text-center text-text-muted text-sm">
              No companies found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
