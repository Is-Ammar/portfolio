import React from 'react';
import { m } from 'framer-motion';
import { fadeInUp, revealLine } from '../utils/motion';

export const SECTION_CLASS = 'section-shell px-5 py-24 sm:px-6 md:py-28 lg:px-12';
export const CONTAINER_CLASS = 'relative z-10 mx-auto max-w-[1600px]';

export const SectionHeading = ({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children?: React.ReactNode;
}) => (
  <div className="mb-10 flex flex-col gap-6 md:mb-12 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <m.span variants={fadeInUp} className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
        {index}
      </m.span>
      <m.h2 variants={fadeInUp} className="font-display text-3xl font-semibold text-text-strong md:text-4xl">
        {title}
      </m.h2>
      <m.div
        variants={revealLine}
        className="h-px min-w-8 flex-grow bg-gradient-to-r from-line via-accent-3/40 to-line"
      />
    </div>
    {children}
  </div>
);
