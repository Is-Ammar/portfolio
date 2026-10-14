import React from 'react';

// Soft colored glow behind a section. A radial gradient gives the same look
// as a blurred circle without the cost of a big blur filter.
export const SectionBlob = ({ className, color }: { className: string; color: string }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute rounded-full ${className}`}
    style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }}
  />
);
