import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { m, useInView, useReducedMotion, type Variants } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Atom,
  Boxes,
  CircuitBoard,
  Code2,
  Container,
  Cpu,
  Crown,
  Database,
  Filter,
  Flame,
  GitBranch,
  Github,
  Globe,
  Layers,
  LayoutDashboard,
  LineChart,
  Lock,
  Network,
  Orbit,
  Plug,
  Radio,
  Repeat,
  Route,
  Server,
  Sigma,
  Terminal,
  Zap,
} from 'lucide-react';
import { PROJECTS, PROJECT_CATEGORY_LABELS } from '../constants';
import type { Project, ProjectCategory } from '../types';
import { CONTAINER_CLASS, SECTION_CLASS, SectionHeading } from '../components/SectionHeading';
import { DURATION, EASE_OUT, fadeInUp, staggerContainer } from '../utils/motion';

const MAX_VISIBLE = 6;

type WorkFilter = 'all' | ProjectCategory;
const FILTERS: Array<{ id: WorkFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: PROJECT_CATEGORY_LABELS.ai },
  { id: 'systems', label: PROJECT_CATEGORY_LABELS.systems },
  { id: 'security', label: PROJECT_CATEGORY_LABELS.security },
  { id: 'web', label: PROJECT_CATEGORY_LABELS.web },
];

const cx = (...classes: Array<string | undefined | false | null>) => classes.filter(Boolean).join(' ');

type TechIconConfig = { Icon: LucideIcon; tone: string };
type TechIconItem = TechIconConfig & { name: string };

const TECH_ICON_FALLBACK: TechIconConfig = { Icon: Code2, tone: 'text-text-muted/80' };

const TECH_ICON_MAP: Record<string, TechIconConfig> = {
  Python: { Icon: Terminal, tone: 'text-accent-3' },
  FastAPI: { Icon: Zap, tone: 'text-accent' },
  PostgreSQL: { Icon: Database, tone: 'text-accent-3' },
  pgvector: { Icon: Orbit, tone: 'text-accent-2' },
  Ollama: { Icon: Cpu, tone: 'text-accent' },
  Docker: { Icon: Container, tone: 'text-accent-3' },
  'Docker Compose': { Icon: Boxes, tone: 'text-accent' },
  React: { Icon: Atom, tone: 'text-accent-3' },
  TypeScript: { Icon: Code2, tone: 'text-accent' },
  'Node.js': { Icon: Server, tone: 'text-accent-2' },
  Express: { Icon: Route, tone: 'text-accent-2' },
  MongoDB: { Icon: Database, tone: 'text-accent-3' },
  'D3.js': { Icon: LineChart, tone: 'text-accent' },
  'scikit-learn': { Icon: Sigma, tone: 'text-accent-3' },
  PyTorch: { Icon: Flame, tone: 'text-accent-2' },
  Dash: { Icon: LayoutDashboard, tone: 'text-accent' },
  'C++98': { Icon: Terminal, tone: 'text-text-strong' },
  C: { Icon: Terminal, tone: 'text-text-strong' },
  Sockets: { Icon: Plug, tone: 'text-accent' },
  'poll()': { Icon: Repeat, tone: 'text-accent-3' },
  TCP: { Icon: Network, tone: 'text-accent-2' },
  'Unix API': { Icon: Terminal, tone: 'text-accent' },
  Processes: { Icon: Layers, tone: 'text-accent-3' },
  Signals: { Icon: Radio, tone: 'text-accent-2' },
  Nginx: { Icon: Globe, tone: 'text-accent-3' },
  MariaDB: { Icon: Database, tone: 'text-accent-2' },
  pthreads: { Icon: GitBranch, tone: 'text-accent' },
  Mutexes: { Icon: Lock, tone: 'text-accent-2' },
  MiniLibX: { Icon: AppWindow, tone: 'text-accent' },
  'Linear algebra': { Icon: CircuitBoard, tone: 'text-accent-3' },
  'chess.js': { Icon: Crown, tone: 'text-accent-2' },
};

const TECH_ICON_WRAPPER = { sm: 'h-9 w-9', md: 'h-12 w-12', lg: 'h-14 w-14' } as const;
const TECH_ICON_SIZE = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' } as const;
const TECH_ICON_PATTERN: Array<keyof typeof TECH_ICON_WRAPPER> = ['sm', 'md', 'lg', 'md', 'sm'];

const STARS = [
  { top: 16, left: 12, size: 2, delay: 0.2, duration: 4.4 },
  { top: 68, left: 8, size: 3, delay: 1.1, duration: 5.2 },
  { top: 24, left: 84, size: 2, delay: 0.6, duration: 4.8 },
  { top: 76, left: 78, size: 2, delay: 1.6, duration: 5.6 },
  { top: 44, left: 30, size: 2, delay: 0.9, duration: 4.2 },
  { top: 12, left: 56, size: 3, delay: 1.9, duration: 5.4 },
  { top: 82, left: 44, size: 2, delay: 0.4, duration: 4.6 },
  { top: 56, left: 92, size: 2, delay: 1.3, duration: 5.0 },
];
const STAR_TONES = ['bg-white/70', 'bg-accent/70', 'bg-accent-2/70', 'bg-accent-3/70'];

// Entrance uses transform and opacity only (no blur or clip-path), so cards
// animate on the compositor.
const PROJECT_CARD_VARIANTS: Variants = {
  initial: (index: number) => ({
    opacity: 0,
    y: 26,
    scale: 0.96,
    rotate: index % 2 === 0 ? -1.5 : 1.5,
  }),
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { duration: DURATION.md, ease: EASE_OUT },
  },
};

const getTechIcons = (tech: string[]): TechIconItem[] =>
  tech.slice(0, TECH_ICON_PATTERN.length).map((name) => ({ name, ...(TECH_ICON_MAP[name] ?? TECH_ICON_FALLBACK) }));

export const Work = () => {
  const [filter, setFilter] = useState<WorkFilter>('all');
  const [showAll, setShowAll] = useState(false);
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  const filteredProjects = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.categories.includes(filter))),
    [filter]
  );

  const handleFilterChange = useCallback((next: WorkFilter) => {
    setFilter(next);
    setShowAll(false);
  }, []);

  const handleToggleShowAll = useCallback(() => {
    setShowAll((prev) => {
      if (prev) {
        requestAnimationFrame(() =>
          sectionRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        );
      }
      return !prev;
    });
  }, [reduceMotion]);

  const hasMoreProjects = filteredProjects.length > MAX_VISIBLE;
  const visibleProjects = hasMoreProjects && !showAll ? filteredProjects.slice(0, MAX_VISIBLE) : filteredProjects;
  const progressLabel = showAll
    ? `Showing all ${filteredProjects.length}`
    : `Showing ${visibleProjects.length} of ${filteredProjects.length}`;

  return (
    <section id="work" ref={sectionRef} className={SECTION_CLASS}>
      <m.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.05 }}
        className={CONTAINER_CLASS}
      >
        <SectionHeading index="02" title="Selected Work">
          <m.div variants={fadeInUp} className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects">
            <Filter size={14} className="mr-1 shrink-0 text-accent-3/70" />
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFilterChange(f.id)}
                aria-pressed={filter === f.id}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  filter === f.id
                    ? 'border-accent bg-accent/10 text-accent shadow-glow'
                    : 'border-line/70 bg-bg-elev-1/70 text-text-muted hover:bg-bg-elev-1 hover:text-text-strong'
                }`}
              >
                {f.label}
              </button>
            ))}
          </m.div>
        </SectionHeading>

        <m.div
          key={filter}
          id="work-grid"
          variants={staggerContainer}
          initial={reduceMotion ? false : 'initial'}
          whileInView="animate"
          viewport={{ once: true, amount: 0.02 }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {visibleProjects.map((project, index) => (
            <WorkCard key={project.id} project={project} index={index} reduceMotion={!!reduceMotion} />
          ))}
        </m.div>

        {hasMoreProjects && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">
              <span className="h-px w-12 bg-line/70" />
              <span>{progressLabel}</span>
              <span className="h-px w-12 bg-line/70" />
            </div>
            <SlideToggleButton
              primaryLabel={showAll ? 'View less' : 'View more'}
              hoverLabel={showAll ? 'Show less' : 'Show all'}
              onClick={handleToggleShowAll}
              ariaExpanded={showAll}
              ariaControls="work-grid"
            />
          </div>
        )}
      </m.div>
    </section>
  );
};

const WorkCard = ({ project, index, reduceMotion }: { project: Project; index: number; reduceMotion: boolean }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, { amount: 0.2 });
  const techIcons = useMemo(() => getTechIcons(project.tech), [project.tech]);
  const badge = project.status ?? (project.featured ? 'Featured' : null);

  return (
    <m.div
      ref={cardRef}
      variants={reduceMotion ? fadeInUp : PROJECT_CARD_VARIANTS}
      custom={index}
      className="glow-card group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-bg-elev-1/80 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] transition-colors duration-500 hover:border-accent/30"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-12 bg-[radial-gradient(circle_at_20%_20%,rgb(99_102_241/0.22),transparent_60%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div
          data-paused={!isInView}
          className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 bg-bg-elev-2/70 transition-colors group-hover:border-accent/30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.05]" />
          <div className="relative h-44 px-5 py-6 [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)] [-webkit-mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)] md:h-52">
            <TechOrbit items={techIcons} />
          </div>
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-bg/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {PROJECT_CATEGORY_LABELS[project.categories[0]]}
          </div>
          {badge && (
            <div
              className={`absolute right-4 top-4 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] ${
                project.status
                  ? 'border-accent-3/40 bg-accent-3/15 text-accent-3'
                  : 'border-accent/40 bg-accent/15 text-accent'
              }`}
            >
              {badge}
            </div>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold text-text-strong transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          {project.context && (
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-muted">{project.context}</div>
          )}
        </div>

        <p className="mb-6 flex-grow text-sm leading-relaxed text-text-muted">{project.description}</p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line/60 pt-4">
          <ul className="flex min-w-0 flex-wrap gap-1.5" aria-label="Built with">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-white/10 bg-bg/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 items-center gap-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                title={link.label}
                aria-label={`${project.title} (${link.label})`}
                className="rounded-full border border-white/10 bg-bg/60 p-2 text-text-muted transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {link.label === 'Live' ? <ArrowUpRight size={16} /> : <Github size={16} />}
              </a>
            ))}
          </div>
        </div>
      </div>
    </m.div>
  );
};

// Floating tech icons and twinkling dots. Both are CSS animations that pause
// when the card leaves the viewport (data-paused on the wrapper).
const TechOrbit = ({ items }: { items: TechIconItem[] }) => (
  <div className="relative flex h-full items-center justify-center">
    <div className="relative z-10 flex items-center gap-3">
      {items.map((item, index) => {
        const sizeKey = TECH_ICON_PATTERN[index % TECH_ICON_PATTERN.length];
        return (
          <div
            key={item.name}
            title={item.name}
            className={cx(
              'anim-float flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] shadow-[0_8px_24px_rgba(0,0,0,0.35)]',
              TECH_ICON_WRAPPER[sizeKey]
            )}
            style={{ animationDelay: `${index * 0.35}s` }}
          >
            <item.Icon className={cx(TECH_ICON_SIZE[sizeKey], item.tone)} />
          </div>
        );
      })}
    </div>
    <div className="pointer-events-none absolute inset-0">
      {STARS.map((star, index) => (
        <span
          key={`spark-${index}`}
          className={cx('anim-twinkle absolute rounded-full', STAR_TONES[index % STAR_TONES.length])}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  </div>
);

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
    if (!isClicked) return undefined;
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
    <m.button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onFocus={() => handleHover(true)}
      onBlur={() => handleHover(false)}
      disabled={isClicked}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-line-strong/70 bg-bg-elev-1/80 px-7 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-text-strong transition-colors duration-500 ease-out hover:border-accent/60 hover:text-accent hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-70"
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      <span className="relative z-10 flex items-center gap-3 transition-transform duration-500 ease-out group-hover:-translate-x-1.5">
        <span className="relative inline-flex min-w-[10ch] items-center">
          <span className={`transition-all duration-500 ${isHovered ? '-translate-y-5 opacity-0' : 'translate-y-0 opacity-100'}`}>
            {primaryLabel}
          </span>
          <span
            className={`absolute left-0 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
          >
            {hoverLabel}
          </span>
        </span>
        <span className="relative ml-1 h-4 w-4">
          <ArrowRight
            className={`absolute left-0 top-0 h-4 w-4 transition-all duration-700 ${
              isHovered ? '-translate-y-5 opacity-0' : 'translate-y-0 opacity-100'
            } ${isClicked && !reduceMotion ? 'translate-x-8 opacity-0' : ''}`}
          />
          <ArrowRight
            className={`absolute left-0 top-0 h-4 w-4 transition-all duration-700 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            } ${isClicked && !reduceMotion ? 'translate-x-8 opacity-0' : ''}`}
          />
        </span>
      </span>
      <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="absolute -inset-6 bg-[radial-gradient(circle_at_20%_20%,rgb(99_102_241/0.28),transparent_60%)]" />
      </span>
      <span className="absolute inset-0 origin-left scale-x-0 bg-accent/10 transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent/10 transition-transform duration-500 ease-out group-hover:scale-y-100" />
    </m.button>
  );
};
