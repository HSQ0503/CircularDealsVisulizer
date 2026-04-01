'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ScheduleButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors"
      >
        Schedule
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto rounded-lg border border-border-subtle bg-surface-1 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              src="/Schedual.jpg"
              alt="Schedule"
              width={1200}
              height={800}
              className="w-full h-auto rounded"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
