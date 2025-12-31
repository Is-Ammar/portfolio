import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Atom,
  BrainCircuit,
  CircuitBoard,
  Code2,
  Database,
  Filter,
  GitBranch,
  Github,
  Layers,
  Network,
  Orbit,
  Paintbrush,
  Server,
  Shield,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import { DURATION, EASE_OUT, fadeInUp, staggerContainer, revealLine } from '../utils/motion';

const MAX_VISIBLE = 6;
type WorkFilter = 'All' | 'AI' | 'Web' | 'Sys' | 'Sec' | 'Gfx';
const FILTERS: WorkFilter[] = ['All', 'AI', 'Web', 'Sys', 'Sec', 'Gfx'];
const cx = (...classes: Array<string | undefined | false | null>) =>
  classes.filter(Boolean).join(' ');

type TechIconConfig = {
  Icon: LucideIcon;
  tone: string;
};

type TechIconItem = TechIconConfig & {
  name: string;
};

const TECH_ICON_FALLBACK: TechIconConfig = {
  Icon: Code2,
  tone: 'text-text-muted/80',
};

const TECH_ICON_MAP: Record<string, TechIconConfig> = {
  React: { Icon: Atom, tone: 'text-accent-3' },
  TypeScript: { Icon: Code2, tone: 'text-accent' },
  'Node.js': { Icon: Server, tone: 'text-accent-2' },
  MongoDB: { Icon: Database, tone: 'text-accent-3' },
  'D3.js': { Icon: Orbit, tone: 'text-accent-3' },
  Tailwind: { Icon: Paintbrush, tone: 'text-accent' },
  'Tailwind CSS': { Icon: Paintbrush, tone: 'text-accent' },
  'CSS Grid': { Icon: AppWindow, tone: 'text-accent-2' },
  'CSS3 Animations': { Icon: Sparkles, tone: 'text-accent-3' },
  'Styled Components': { Icon: Paintbrush, tone: 'text-accent-2' },
  'REST API': { Icon: Network, tone: 'text-accent-3' },
  'REST APIs': { Icon: Network, tone: 'text-accent-3' },
  CORS: { Icon: Shield, tone: 'text-accent-2' },
  Buffer: { Icon: Shield, tone: 'text-accent-2' },
  LocalStorage: { Icon: Database, tone: 'text-accent-3' },
  Python: { Icon: Terminal, tone: 'text-accent-3' },
  'OpenAI API': { Icon: BrainCircuit, tone: 'text-accent-3' },
  LangChain: { Icon: BrainCircuit, tone: 'text-accent-3' },
  C: { Icon: Terminal, tone: 'text-text-strong' },
  'C++': { Icon: Terminal, tone: 'text-text-strong' },
  'Unix API': { Icon: Terminal, tone: 'text-text-strong' },
  'POSIX Signals': { Icon: CircuitBoard, tone: 'text-accent-2' },
  'Process Management': { Icon: Layers, tone: 'text-accent' },
  Multithreading: { Icon: GitBranch, tone: 'text-accent' },
  pthreads: { Icon: GitBranch, tone: 'text-accent' },
  Mutexes: { Icon: GitBranch, tone: 'text-accent' },
  Synchronization: { Icon: Network, tone: 'text-accent' },
  Algorithms: { Icon: CircuitBoard, tone: 'text-accent-3' },
  'Complexity Analysis': { Icon: CircuitBoard, tone: 'text-accent-3' },
  'Data Structures': { Icon: Layers, tone: 'text-accent' },
  'Linear Algebra': { Icon: CircuitBoard, tone: 'text-accent-2' },
  'Complex Mathematics': { Icon: CircuitBoard, tone: 'text-accent-2' },
  MiniLibX: { Icon: AppWindow, tone: 'text-accent' },
  'Ray Tracing': { Icon: Orbit, tone: 'text-accent-2' },
  'Computer Graphics': { Icon: Orbit, tone: 'text-accent-2' },
  Express: { Icon: Server, tone: 'text-accent-2' },
  'CLI Testing': { Icon: Terminal, tone: 'text-accent' },
  Subprocess: { Icon: Terminal, tone: 'text-accent' },
  Randomization: { Icon: Sparkles, tone: 'text-accent-3' },
  'Minimax Algorithm': { Icon: BrainCircuit, tone: 'text-accent-3' },
  'Data Analysis': { Icon: Activity, tone: 'text-accent-3' },
  'Real-time Telemetry': { Icon: Activity, tone: 'text-accent-2' },
  'Systems Monitoring': { Icon: Activity, tone: 'text-accent-2' },
  'Navigation Software': { Icon: Network, tone: 'text-accent' },
  Compliance: { Icon: Shield, tone: 'text-accent-2' },
  'Integrated Systems': { Icon: Layers, tone: 'text-accent' },
  'Incident Response': { Icon: Shield, tone: 'text-accent-2' },
};

const TECH_ICON_WRAPPER = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
} as const;

const TECH_ICON_SIZE = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

const TECH_ICON_PATTERN: Array<keyof typeof TECH_ICON_WRAPPER> = ['sm', 'md', 'lg', 'md', 'sm'];

const getTechIcons = (tech: string[]): TechIconItem[] => {
  const seen = new Set<string>();
  return tech
    .filter((name) => {
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    })
    .map((name) => ({
      name,
      ...(TECH_ICON_MAP[name] ?? TECH_ICON_FALLBACK),
    }));
};

export const Work = () => {
  const [filter, setFilter] = useState<WorkFilter>('All');
  const [showAll, setShowAll] = useState(false);
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const pendingCollapseScroll = useRef(false);
  
  const filteredProjects = filter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => {
        if (filter === 'AI') return p.category === 'AI';
        if (filter === 'Web') return p.category === 'Web';
        if (filter === 'Sec') return p.category === 'Security';
        if (filter === 'Gfx') return p.category === 'Graphics & Simulation';
        if (filter === 'Sys') return ['System', 'Infra', 'Software Engineering', 'DevOps & Utilities'].includes(p.category);
        return false;
    });

  const handleFilterChange = useCallback((nextFilter: WorkFilter) => {
    setFilter(nextFilter);
    setShowAll(false);
    pendingCollapseScroll.current = false;
  }, []);

  const scrollToWork = useCallback(() => {
    sectionRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [reduceMotion]);

  const handleToggleShowAll = useCallback(() => {
    setShowAll((prev) => {
      pendingCollapseScroll.current = prev;
      return !prev;
    });
  }, []);

  const hasMoreProjects = filteredProjects.length > MAX_VISIBLE;
  const visibleProjects = hasMoreProjects && !showAll
    ? filteredProjects.slice(0, MAX_VISIBLE)
    : filteredProjects;
  const buttonLabel = showAll ? 'View less' : 'View more';
  const buttonHoverLabel = showAll ? 'Show less' : 'Show all';
  const progressLabel = showAll
    ? `Showing all ${filteredProjects.length}`
    : `Showing ${visibleProjects.length} of ${filteredProjects.length}`;

  return (
    <section id="work" ref={sectionRef} className="section-shell px-6 py-28 lg:px-12">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto max-w-[1600px]"
      >
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <motion.span variants={fadeInUp} className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">03</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-semibold text-text-strong">Selected Work</motion.h2>
            <motion.div variants={revealLine} className="h-px w-16 bg-gradient-to-r from-line via-accent-3/40 to-line" />
          </div>

          <motion.div variants={fadeInUp} className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Filter size={14} className="mr-2 shrink-0 text-accent-3/70" />
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleFilterChange(f)}
                className={`rounded-full border px-4 py-2 text-[11px] font-mono uppercase tracking-[0.3em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  filter === f
                    ? 'border-accent bg-accent/10 text-accent shadow-glow'
                    : 'border-line/70 bg-bg-elev-1/70 text-text-muted hover:bg-bg-elev-1/90 hover:text-text-strong'
                }`}
                aria-pressed={filter === f}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div id="work-grid" layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence
            mode="popLayout"
            onExitComplete={() => {
              if (!pendingCollapseScroll.current) return;
              pendingCollapseScroll.current = false;
              requestAnimationFrame(() => scrollToWork());
            }}
          >
            {visibleProjects.map((p) => (
              <WorkCard key={p.id} project={p} reduceMotion={reduceMotion} />
            ))}
          </AnimatePresence>
        </motion.div>

        {hasMoreProjects && (
          <motion.div variants={fadeInUp} className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
              <span className="h-px w-12 bg-line/70" />
              <span>{progressLabel}</span>
              <span className="h-px w-12 bg-line/70" />
            </div>
            <SlideToggleButton
              primaryLabel={buttonLabel}
              hoverLabel={buttonHoverLabel}
              onClick={handleToggleShowAll}
              aria-expanded={showAll}
              aria-controls="work-grid"
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

const WorkCard = ({ project, reduceMotion }: { project: Project; reduceMotion: boolean }) => {
  const techIcons = useMemo(
    () => getTechIcons(project.tech).slice(0, TECH_ICON_PATTERN.length),
    [project.tech]
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: DURATION.sm, ease: EASE_OUT }}
      className="glow-card group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-bg-elev-1/70 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-12 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_60%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 bg-bg-elev-2/70 transition-colors group-hover:border-accent/30">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.05]" />
          <div className="relative h-[15rem] md:h-[19rem] px-5 py-6 [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)] [-webkit-mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]">
            <TechOrbit items={techIcons} reduceMotion={reduceMotion} />
          </div>
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-bg/70 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {project.category}
          </div>
          {project.featured && (
            <div className="absolute right-4 top-4 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-accent">
              Featured
            </div>
          )}
        </div>

        <div className="mb-4">
          <h4 className="text-xl font-semibold text-text-strong transition-colors group-hover:text-accent">
            {project.title}
          </h4>
          <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
            {project.role}
          </div>
        </div>

        <p className="mb-6 flex-grow text-sm leading-relaxed text-text-muted/90">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-line/60 pt-4">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent-2/80">Impact</div>
            <div className="text-xs text-text-strong">{project.impact}</div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} GitHub`}
                className="rounded-full border border-white/10 bg-bg/60 p-2 text-text-muted transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <Github size={16} />
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} Live link`}
                className="rounded-full border border-white/10 bg-bg/60 p-2 text-text-muted transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TechOrbit = ({
  items,
  reduceMotion,
}: {
  items: TechIconItem[];
  reduceMotion: boolean;
}) => {
  const visibleItems = items.slice(0, TECH_ICON_PATTERN.length);

  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="relative z-10 flex items-center gap-3">
        {visibleItems.map((item, index) => {
          const sizeKey = TECH_ICON_PATTERN[index % TECH_ICON_PATTERN.length];
          return (
            <motion.div
              key={`${item.name}-${index}`}
              title={item.name}
              className={cx(
                'flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-[2px]',
                TECH_ICON_WRAPPER[sizeKey]
              )}
              animate={
                reduceMotion ? undefined : { y: [0, -4, 0], scale: [1, 1.08, 1] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 1.1,
                      repeat: Infinity,
                      repeatDelay: 1.3,
                      delay: index * 0.12,
                      ease: 'easeInOut',
                    }
              }
            >
              <item.Icon className={cx(TECH_ICON_SIZE[sizeKey], item.tone)} />
            </motion.div>
          );
        })}
      </div>
      <SparkleField reduceMotion={reduceMotion} />
    </div>
  );
};

const SparkleField = ({ reduceMotion }: { reduceMotion: boolean }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: 12 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() > 0.7 ? 3 : 2,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
      })),
    []
  );
  const tones = ['bg-white/70', 'bg-accent/70', 'bg-accent-2/70', 'bg-accent-3/70'];

  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute left-1/2 top-1/2 h-32 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-accent-3/80 to-transparent"
        animate={
          reduceMotion ? undefined : { y: [-10, 10, -10], opacity: [0.4, 0.9, 0.4] }
        }
        transition={reduceMotion ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {stars.map((star, index) => (
        <motion.span
          key={`spark-${index}`}
          className={cx('absolute rounded-full', tones[index % tones.length])}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={
            reduceMotion ? undefined : { opacity: [0.2, 0.9, 0.2], scale: [1, 1.4, 1] }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                  ease: 'easeInOut',
                }
          }
        />
      ))}
    </div>
  );
};

const SlideToggleButton = ({
  primaryLabel,
  hoverLabel,
  onClick,
  ariaExpanded,
  ariaControls,
}: {
  primaryLabel: string;
  hoverLabel: string;
  onClick: () => void;
  ariaExpanded?: boolean;
  ariaControls?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isClicked) return;
    const timeout = window.setTimeout(() => setIsClicked(false), 650);
    return () => window.clearTimeout(timeout);
  }, [isClicked]);

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    onClick();
  };

  const handleHover = (next: boolean) => {
    if (reduceMotion) return;
    setIsHovered(next);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onFocus={() => handleHover(true)}
      onBlur={() => handleHover(false)}
      disabled={isClicked}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-line-strong/70 bg-bg-elev-1/80 px-7 py-3 text-[11px] font-mono uppercase tracking-[0.3em] text-text-strong transition-all duration-500 ease-out hover:border-accent/60 hover:text-accent hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-70"
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      <span className="relative z-10 flex items-center gap-3 transition-all duration-500 ease-out group-hover:-translate-x-1.5">
        <span className="relative inline-flex min-w-[10ch] items-center">
          <span
            className={`transition-all duration-500 ${
              isHovered ? 'opacity-0 -translate-y-5' : 'opacity-100 translate-y-0'
            }`}
          >
            {primaryLabel}
          </span>
          <span
            className={`absolute left-0 transition-all duration-500 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            {hoverLabel}
          </span>
        </span>
        <span className="relative ml-1 h-4 w-4">
          <ArrowRight
            className={`absolute left-0 top-0 h-4 w-4 transition-all duration-700 ${
              isHovered ? 'opacity-0 -translate-y-5' : 'opacity-100 translate-y-0'
            } ${isClicked && !reduceMotion ? 'translate-x-8 opacity-0' : ''}`}
          />
          <ArrowRight
            className={`absolute left-0 top-0 h-4 w-4 transition-all duration-700 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            } ${isClicked && !reduceMotion ? 'translate-x-8 opacity-0' : ''}`}
          />
        </span>
      </span>
      <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="absolute -inset-6 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--accent)_28%,transparent),transparent_60%)]" />
      </span>
      <span className="absolute inset-0 origin-left scale-x-0 bg-accent/10 transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent/10 transition-transform duration-500 ease-out group-hover:scale-y-100" />
    </motion.button>
  );
};
