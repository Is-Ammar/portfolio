import React, { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { EXPERIENCE } from '../constants';
import type { Experience as ExperienceItem } from '../types';
import { CONTAINER_CLASS, SECTION_CLASS, SectionHeading } from '../components/SectionHeading';
import { fadeInUp, staggerContainer } from '../utils/motion';

export const Experience = () => (
  <section id="experience" className={SECTION_CLASS}>
    <m.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.05 }}
      className={CONTAINER_CLASS}
    >
      <SectionHeading index="04" title="Experience" />
      <ExperienceTimeline />
    </m.div>
  </section>
);

const ExperienceTimeline = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const [height, setHeight] = useState(0);
  const [itemOffsets, setItemOffsets] = useState<number[]>(() => EXPERIENCE.map(() => 1_000_000));

  useEffect(() => {
    if (!listRef.current) return undefined;
    const updateMeasurements = () => {
      if (!listRef.current) return;
      setHeight(listRef.current.getBoundingClientRect().height);
      setItemOffsets(itemRefs.current.map((item) => (item?.offsetTop ?? 0) + 28));
    };
    updateMeasurements();
    const observer = new ResizeObserver(updateMeasurements);
    observer.observe(listRef.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 15%', 'end 60%'],
  });

  // Pixel position of the line tip. Only used to time each entry's reveal;
  // the line itself is drawn with scaleY so scrolling never triggers layout.
  const lineTip = useTransform(scrollYProgress, [0, 1], [0, height]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      <div ref={listRef} className="relative pb-10">
        {EXPERIENCE.map((exp, index) => (
          <ExperienceEntry
            key={exp.id}
            exp={exp}
            triggerOffset={itemOffsets[index] ?? 1_000_000}
            reduceMotion={!!reduceMotion}
            lineTip={lineTip}
            setRef={(node) => {
              itemRefs.current[index] = node;
            }}
          />
        ))}

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-5 top-0 w-px overflow-hidden bg-gradient-to-b from-transparent via-line-strong/70 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <m.div
            style={reduceMotion ? undefined : { scaleY: scrollYProgress, opacity: lineOpacity }}
            className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-transparent via-accent to-accent-2"
          />
        </div>
      </div>
    </div>
  );
};

const ExperienceEntry = ({
  exp,
  triggerOffset,
  reduceMotion,
  lineTip,
  setRef,
}: {
  exp: ExperienceItem;
  triggerOffset: number;
  reduceMotion: boolean;
  lineTip: MotionValue<number>;
  setRef: (node: HTMLDivElement | null) => void;
}) => {
  const revealStart = triggerOffset + 10;
  const revealEnd = triggerOffset + 90;
  const reveal = useTransform(lineTip, [revealStart, revealEnd], [0.35, 1]);
  const lift = useTransform(lineTip, [revealStart, revealEnd], [14, 0]);
  const dotScale = useTransform(lineTip, [revealStart, revealEnd], [0.6, 1]);
  const revealStyle = reduceMotion ? undefined : { opacity: reveal, y: lift };

  return (
    <m.div ref={setRef} variants={fadeInUp} className="group relative flex pt-12 md:gap-10 md:pt-24">
      <div className="absolute left-0 top-12 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-bg-elev-1 shadow-[0_0_0_6px_rgba(3,3,3,0.6)] md:top-24">
        <m.div
          style={reduceMotion ? undefined : { scale: dotScale, opacity: reveal }}
          className="h-3 w-3 rounded-full bg-accent shadow-glow"
        />
      </div>

      <div className="sticky top-32 hidden w-full max-w-xs shrink-0 self-start pl-14 md:block">
        <m.div
          style={revealStyle}
          className="inline-flex items-center gap-2 rounded-full border border-accent-3/30 bg-accent-3/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-accent-3"
        >
          <Calendar size={12} />
          {exp.period}
        </m.div>
        <m.div style={revealStyle} className="mt-3 text-base font-semibold text-text-strong">
          {exp.company}
        </m.div>
      </div>

      <div className="relative w-full min-w-0 pl-14 md:pl-0">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 md:hidden">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-3/30 bg-accent-3/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent-3">
            <Calendar size={12} />
            {exp.period}
          </span>
          <span className="text-base font-semibold text-text-strong">{exp.company}</span>
        </div>

        <div className="relative rounded-[28px] border border-white/10 bg-bg-elev-1/80 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset]">
          <div className="absolute right-0 top-0 h-2 w-2 border-r border-t border-accent/50 opacity-0 transition-opacity group-hover:opacity-100" />

          <h3 className="mb-2 font-display text-xl font-semibold text-text-strong">{exp.role}</h3>
          <p className="mb-6 text-sm leading-relaxed text-text-muted">{exp.description}</p>

          {exp.highlights && (
            <div className="mb-6 space-y-2">
              {exp.highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 text-sm text-text/90">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          )}

          {exp.tech && (
            <div className="flex flex-wrap gap-2 border-t border-dashed border-white/10 pt-4">
              {exp.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-bg/60 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </m.div>
  );
};
