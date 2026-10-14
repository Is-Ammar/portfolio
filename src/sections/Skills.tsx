import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { m, useInView, useReducedMotion } from 'framer-motion';
import { GripVertical, Layers, Terminal } from 'lucide-react';
import { SKILLS } from '../constants';
import { CONTAINER_CLASS, SECTION_CLASS, SectionHeading } from '../components/SectionHeading';
import { SectionBlob } from '../components/SectionBlob';
import { fadeInUp, staggerContainer } from '../utils/motion';
import { DEFAULT_SKILL_TONE, SKILL_FALLBACK_ICON, SKILL_ICONS, SKILL_TONES } from './skillIcons';

const SkillReorderLists = lazy(() => import('./SkillReorderLists'));

const MOBILE_QUERY = '(max-width: 767px)';

type SkillItem = { skill: string; category: string };

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return isMobile;
};

const SkillTile = ({ skill, category }: SkillItem) => {
  const Icon = SKILL_ICONS[skill] ?? SKILL_FALLBACK_ICON;
  const tone = SKILL_TONES[category] ?? DEFAULT_SKILL_TONE;

  return (
    <div className="group relative flex h-16 min-w-[220px] items-center gap-3 overflow-hidden rounded-[20px] border border-white/10 bg-bg-elev-2/80 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-0.5">
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-bg/70">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg border ${tone.badge}`}>
          <Icon size={16} className={tone.icon} />
        </span>
      </div>
      <div className="relative z-10 flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-text-strong">{skill}</span>
        <span className={`font-mono text-[10px] uppercase tracking-[0.3em] ${tone.label}`}>{category}</span>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className={`absolute -inset-0.5 rounded-[20px] bg-gradient-to-r ${tone.glow}`} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70" />
      </div>
    </div>
  );
};

// Infinite strip of tiles. The loop is a CSS transform animation on a
// duplicated track: no JavaScript per frame, paused on hover and whenever
// the strip is off screen.
const Marquee = ({ items, duration, reverse = false }: { items: SkillItem[]; duration: number; reverse?: boolean }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref);
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="flex flex-wrap gap-[22px]">
        {items.map((item) => (
          <SkillTile key={`${item.category}-${item.skill}`} {...item} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-paused={!inView}
      className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div
        className="marquee-track"
        data-reverse={reverse}
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {items.map((item) => (
          <SkillTile key={`${item.category}-${item.skill}`} {...item} />
        ))}
        {items.map((item) => (
          <div key={`dup-${item.category}-${item.skill}`} aria-hidden="true">
            <SkillTile {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Same look as the draggable lists, shown until their chunk arrives.
const StaticSkillLists = () => (
  <div className="grid gap-6 sm:grid-cols-2">
    {SKILLS.map((cat) => (
      <div
        key={cat.name}
        className="relative overflow-hidden rounded-[26px] border border-white/10 bg-bg-elev-1/80 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset]"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2">{cat.name}</h3>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">{cat.skills.length}</span>
        </div>
        <ul className="space-y-3">
          {cat.skills.map((skill) => {
            const Icon = SKILL_ICONS[skill] ?? SKILL_FALLBACK_ICON;
            return (
              <li
                key={skill}
                className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-bg/70 px-3 py-2 font-mono text-sm text-text-muted"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-bg-elev-2 text-accent">
                  <Icon size={16} />
                </span>
                <span>{skill}</span>
                <span className="-mr-1 ml-auto p-2 text-text-muted/60" aria-hidden="true">
                  <GripVertical size={14} />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </div>
);

export const Skills = () => {
  const isMobile = useIsMobile();
  // The drag-to-reorder chunk is fetched when the browser goes idle after the
  // first load (or earlier if the lists come close to the screen), so it never
  // competes with first paint and is usually ready before anyone scrolls here.
  const mobileListsRef = useRef<HTMLDivElement | null>(null);
  const listsNearby = useInView(mobileListsRef, { once: true, margin: '600px 0px' });
  const [idleReady, setIdleReady] = useState(false);
  useEffect(() => {
    if (!isMobile || idleReady) return undefined;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setIdleReady(true), { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setIdleReady(true), 2500);
    return () => clearTimeout(timer);
  }, [isMobile, idleReady]);
  const loadReorder = isMobile && (listsNearby || idleReady);
  const totalSkills = useMemo(() => SKILLS.reduce((sum, cat) => sum + cat.skills.length, 0), []);
  const [rowOne, rowTwo] = useMemo(() => {
    const items = SKILLS.flatMap((cat) => cat.skills.map((skill) => ({ skill, category: cat.name })));
    return [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];
  }, []);

  return (
    <section id="skills" className={SECTION_CLASS}>
      <SectionBlob className="-top-24 left-0 h-80 w-80" color="rgb(99 102 241 / 0.16)" />
      <SectionBlob className="bottom-[-4rem] right-0 h-96 w-96" color="rgb(244 63 94 / 0.12)" />
      <m.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.15 }}
        className={CONTAINER_CLASS}
      >
        <SectionHeading index="03" title="Stack" />

        <m.div
          variants={fadeInUp}
          className="mb-10 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted"
        >
          <span className="flex items-center gap-2">
            <Terminal size={12} className="text-accent" />
            {totalSkills} tools I use
          </span>
          <span className="h-px w-8 bg-line" />
          {isMobile ? (
            <span className="flex items-center gap-2">
              <GripVertical size={12} className="text-accent-3" />
              Drag to reorder
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Layers size={12} className="text-accent-3" />
              The everyday toolkit
            </span>
          )}
        </m.div>

        {isMobile ? (
          <div ref={mobileListsRef}>
            {loadReorder ? (
              <Suspense fallback={<StaticSkillLists />}>
                <SkillReorderLists />
              </Suspense>
            ) : (
              <StaticSkillLists />
            )}
          </div>
        ) : (
          <m.div
            variants={fadeInUp}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-bg-elev-1/80 p-8 shadow-[2px_8px_40px_rgba(0,0,0,0.45)]"
          >
            <SectionBlob className="-top-20 left-[20%] h-64 w-64" color="rgb(99 102 241 / 0.16)" />
            <SectionBlob className="-bottom-16 right-[10%] h-72 w-72" color="rgb(34 211 238 / 0.12)" />
            <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-60" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">
                <span className="flex items-center gap-2 text-text-strong">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  What I work with
                </span>
                <span className="flex items-center gap-3">
                  <span>{totalSkills} total</span>
                  <span className="h-px w-8 bg-line/70" />
                  <span>Hover to pause</span>
                </span>
              </div>
              <div className="space-y-4">
                <Marquee items={rowOne} duration={40} />
                <Marquee items={rowTwo} duration={44} reverse />
              </div>
            </div>
          </m.div>
        )}
      </m.div>
    </section>
  );
};
