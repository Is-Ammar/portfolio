import React, { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { EXPERIENCE } from '../constants';
import type { Experience as ExperienceItem } from '../types';
import { fadeInUp, staggerContainer, revealLine } from '../utils/motion';

  
export const Experience = () => {
  return (
    
    <section id="experience" className="section-shell px-6 py-28 lg:px-12">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto max-w-[1600px] mb-20"
      >
        <div className="mb-12 flex flex-wrap items-center gap-4">
          <motion.span variants={fadeInUp} className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">06</motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-semibold text-text-strong">Experience</motion.h2>
          <motion.div variants={revealLine} className="h-px flex-grow bg-gradient-to-r from-line via-accent-3/40 to-line" />
        </div>

        <ExperienceTimeline />
      </motion.div>
    </section>
  );
};

const ExperienceTimeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const [height, setHeight] = useState(0);
  const [itemOffsets, setItemOffsets] = useState<number[]>(
    () => EXPERIENCE.map(() => 1_000_000)
  );

  useEffect(() => {
    if (!ref.current) return;
    const updateMeasurements = () => {
      if (!ref.current) return;
      setHeight(ref.current.getBoundingClientRect().height);
      const offsets = itemRefs.current.map((item) => (item?.offsetTop ?? 0) + 28);
      setItemOffsets(offsets);
    };
    updateMeasurements();
    const observer = new ResizeObserver(updateMeasurements);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 15%', 'end 60%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      <div ref={ref} className="relative mx-auto max-w-[1600px] pb-10">
        {EXPERIENCE.map((exp, index) => (
          <ExperienceEntry
            key={exp.id}
            exp={exp}
            triggerOffset={itemOffsets[index] ?? 1_000_000}
            reduceMotion={reduceMotion}
            lineHeight={heightTransform}
            setRef={(node) => {
              itemRefs.current[index] = node;
            }}
          />
        ))}

        <div
          style={{ height: `${height}px` }}
          className="absolute left-5 top-0 w-px overflow-hidden bg-gradient-to-b from-transparent via-line-strong/70 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: reduceMotion ? height : heightTransform,
              opacity: reduceMotion ? 1 : opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-px rounded-full bg-gradient-to-t from-accent-2 via-accent to-transparent"
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
  lineHeight,
  setRef,
}: {
  exp: ExperienceItem;
  triggerOffset: number;
  reduceMotion: boolean;
  lineHeight: MotionValue<number>;
  setRef: (node: HTMLDivElement | null) => void;
}) => {
  const revealStart = triggerOffset + 10;
  const revealEnd = triggerOffset + 90;
  const reveal = useTransform(lineHeight, [revealStart, revealEnd], [0, 1]);
  const lift = useTransform(lineHeight, [revealStart, revealEnd], [14, 0]);
  const scale = useTransform(lineHeight, [revealStart, revealEnd], [0.96, 1]);

  return (
    <motion.div
      ref={setRef}
      variants={fadeInUp}
      className="flex justify-start pt-12 md:pt-28 md:gap-10 group"
    >
      <div className="sticky top-32 z-20 flex max-w-xs items-start self-start md:w-full">
        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-bg-elev-1/70 shadow-[0_0_0_6px_rgba(3,3,3,0.6)] backdrop-blur">
          <motion.div
            style={
              reduceMotion
                ? undefined
                : {
                    scale,
                    opacity: reveal,
                  }
            }
            className="h-3 w-3 rounded-full bg-accent shadow-glow"
          />
        </div>
        <div className="pl-14">
          <motion.div
            style={
              reduceMotion
                ? undefined
                : {
                    opacity: reveal,
                    y: lift,
                  }
            }
            className="hidden md:flex items-center gap-2 rounded-full border border-accent-3/30 bg-accent-3/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-accent-3"
          >
            <Calendar size={12} />
            {exp.period}
          </motion.div>
          <motion.div
            style={reduceMotion ? undefined : { opacity: reveal, y: lift }}
            className="mt-3 hidden md:block text-base font-semibold text-text-strong"
          >
            {exp.company}
          </motion.div>
        </div>
      </div>

      <div className="relative w-full pl-14 md:pl-6">
        <motion.div
          style={reduceMotion ? undefined : { opacity: reveal, y: lift }}
          className="md:hidden mb-3 inline-flex items-center gap-2 rounded-full border border-accent-3/30 bg-accent-3/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent-3"
        >
          <Calendar size={12} />
          {exp.period}
        </motion.div>
        <motion.div
          style={reduceMotion ? undefined : { opacity: reveal, y: lift }}
          className="md:hidden mb-3 text-base font-semibold text-text-strong"
        >
          {exp.company}
        </motion.div>

        <div className="relative rounded-[28px] border border-white/10 bg-bg-elev-1/70 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500">
          <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-accent/50 opacity-0 transition-opacity group-hover:opacity-100" />

          <h3 className="mb-2 text-xl font-display font-semibold text-text-strong">
            {exp.role}
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-text-muted">{exp.description}</p>

          {exp.highlights && (
            <div className="mb-6 space-y-2">
              {exp.highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-text/90">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
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
                  className="rounded-full border border-white/10 bg-bg/60 px-2 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
