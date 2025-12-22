import React from 'react';

export const SkillTag: React.FC<{ name: string }> = ({ name }) => (
  <span className="inline-block px-2 py-1 bg-transparent border border-line text-[11px] font-mono uppercase tracking-wider text-text-muted hover:border-accent hover:text-accent transition-colors cursor-default rounded-[2px]">
    {name}
  </span>
);