import React, { useMemo, useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AppWindow,
  Atom,
  Cloud,
  Code2,
  Container,
  Database,
  GitBranch,
  Github,
  GripVertical,
  Layers,
  Network,
  Orbit,
  Paintbrush,
  Server,
  Ship,
  Sparkles,
  Terminal,
  Braces,
  CircuitBoard,
} from 'lucide-react';
import { SKILLS } from '../constants';
import { InfiniteSlider } from '../components/InfiniteSlider';
import { DURATION, EASE_OUT, fadeInUp, staggerContainer, revealLine } from '../utils/motion';

const SKILL_ICONS: Record<string, LucideIcon> = {
  Python: Terminal,
  C: Terminal,
  'C++': Terminal,
  Networking: Network,
  FastAPI: Activity,
  Django: Braces,
  'Node.js': Server,
  NestJS: Layers,
  PostgreSQL: Database,
  Redis: CircuitBoard,
  MongoDB: Database,
  React: Atom,
  'Next.js': AppWindow,
  TypeScript: Code2,
  'React Native': Orbit,
  'Tailwind CSS': Paintbrush,
  AWS: Cloud,
  Docker: Container,
  Kubernetes: Ship,
  Linux: Terminal,
  Git: GitBranch,
  'GitHub Actions': Github,
};

const CARD_GLOWS = [
  'from-accent/25 via-transparent to-accent-2/20',
  'from-accent-2/20 via-transparent to-accent-3/20',
  'from-accent-3/20 via-transparent to-accent/20',
  'from-accent/25 via-transparent to-accent-3/15',
];

const SKILL_TONES: Record<
  string,
  { icon: string; badge: string; label: string; glow: string }
> = {
  'Security & Systems': {
    icon: 'text-accent',
    badge: 'border-accent/40 bg-accent/10',
    label: 'text-accent/80',
    glow: 'from-accent/30 via-transparent to-transparent',
  },
  'Backend & Systems': {
    icon: 'text-accent-2',
    badge: 'border-accent-2/40 bg-accent-2/10',
    label: 'text-accent-2/80',
    glow: 'from-accent-2/30 via-transparent to-transparent',
  },
  Frontend: {
    icon: 'text-accent-3',
    badge: 'border-accent-3/40 bg-accent-3/10',
    label: 'text-accent-3/80',
    glow: 'from-accent-3/30 via-transparent to-transparent',
  },
  'DevOps & Cloud': {
    icon: 'text-text-strong',
    badge: 'border-line-strong/70 bg-bg/70',
    label: 'text-text-muted',
    glow: 'from-white/15 via-transparent to-transparent',
  },
};

const DEFAULT_TONE = {
  icon: 'text-text-strong',
  badge: 'border-line-strong/70 bg-bg/70',
  label: 'text-text-muted',
  glow: 'from-white/10 via-transparent to-transparent',
};

const SkillTile = ({ skill, category }: { skill: string; category: string }) => {
  const Icon = SKILL_ICONS[skill] ?? Code2;
  const tone = SKILL_TONES[category] ?? DEFAULT_TONE;

  return (
    <div className="group relative flex h-16 min-w-[220px] items-center gap-3 overflow-hidden rounded-[20px] border border-white/10 bg-bg-elev-2/70 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-bg/70">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg border ${tone.badge}`}>
          <Icon size={16} className={tone.icon} />
        </span>
      </div>
      <div className="relative z-10 flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-text-strong">{skill}</span>
        <span className={`text-[10px] font-mono uppercase tracking-[0.3em] ${tone.label}`}>
          {category}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className={`absolute -inset-0.5 rounded-[20px] bg-gradient-to-r ${tone.glow}`} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70" />
      </div>
    </div>
  );
};

export const Skills = () => {
  const [skillGroups, setSkillGroups] = useState(() =>
    SKILLS.map((cat) => ({ ...cat, skills: [...cat.skills] }))
  );
  const totalSkills = useMemo(
    () => skillGroups.reduce((sum, cat) => sum + cat.skills.length, 0),
    [skillGroups]
  );
  const [rowOne, rowTwo] = useMemo(() => {
    const items = skillGroups.flatMap((cat) =>
      cat.skills.map((skill) => ({ skill, category: cat.name }))
    );
    const first: Array<{ skill: string; category: string }> = [];
    const second: Array<{ skill: string; category: string }> = [];
    items.forEach((item, index) => {
      if (index % 2 === 0) {
        first.push(item);
      } else {
        second.push(item);
      }
    });
    return [first, second];
  }, [skillGroups]);

  const handleReorder = (index: number, nextOrder: string[]) => {
    setSkillGroups((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, skills: nextOrder } : cat))
    );
  };

  return (
    <section id="skills" className="section-shell px-6 py-28 lg:px-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-10 h-64 w-64 rounded-full bg-accent/18 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent-2/18 blur-[120px]" />
      </div>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 mx-auto max-w-[1600px]"
      >
        <div className="mb-10 flex flex-wrap items-center gap-4">
          <motion.span variants={fadeInUp} className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">02</motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-semibold text-text-strong">Stack</motion.h2>
          <motion.div variants={revealLine} className="h-px flex-grow bg-gradient-to-r from-line via-accent-3/40 to-line" />
        </div>

        <motion.div variants={fadeInUp} className="mb-10 flex flex-wrap items-center gap-4 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
          <span className="flex items-center gap-2">
            <Sparkles size={12} className="text-accent" />
            {totalSkills} tools I use
          </span>
          <span className="h-px w-8 bg-line" />
          <span className="hidden md:flex items-center gap-2">
            <Layers size={12} className="text-accent-3" />
            The everyday toolkit
          </span>
          <span className="flex items-center gap-2 md:hidden">
            <GripVertical size={12} className="text-accent-3" />
            Drag to reorder
          </span>
        </motion.div>

        <div className="md:hidden grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((cat, index) => {
            const glow = CARD_GLOWS[index % CARD_GLOWS.length];
            return (
              <motion.div
                key={cat.name}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                transition={{ duration: DURATION.sm, ease: EASE_OUT }}
                className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-bg-elev-1/70 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute -inset-0.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br ${glow}`} />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2">{cat.name}</h3>
                    <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">{cat.skills.length}</span>
                  </div>
                  <Reorder.Group
                    axis="y"
                    values={cat.skills}
                    onReorder={(nextOrder) => handleReorder(index, nextOrder)}
                    className="space-y-3 list-none"
                  >
                    {cat.skills.map((skill) => {
                      const Icon = SKILL_ICONS[skill] ?? Code2;
                      return (
                        <Reorder.Item
                          key={skill}
                          value={skill}
                          whileHover={{ y: -2 }}
                          whileDrag={{ scale: 1.03, boxShadow: 'var(--glow)' }}
                          transition={{ duration: DURATION.xs, ease: EASE_OUT }}
                        className="group/skill relative flex items-center gap-3 rounded-2xl border border-white/10 bg-bg/60 px-3 py-2 text-sm font-mono text-text-muted backdrop-blur-sm cursor-grab active:cursor-grabbing transition-colors"
                      >
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-bg-elev-2/70 text-accent transition-colors group-hover/skill:border-accent/50 group-hover/skill:bg-accent group-hover/skill:text-bg">
                            <Icon size={16} />
                          </span>
                          <span className="transition-colors group-hover/skill:text-text-strong">{skill}</span>
                          <span className="ml-auto text-text-muted/60 transition-colors group-hover/skill:text-accent-3">
                            <GripVertical size={14} />
                          </span>
                          <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity group-hover/skill:opacity-100">
                            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-accent/10 to-transparent" />
                          </div>
                        </Reorder.Item>
                      );
                    })}
                  </Reorder.Group>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          variants={fadeInUp}
          className="relative hidden md:block overflow-hidden rounded-[32px] border border-white/10 bg-bg-elev-1/70 p-8 shadow-[2px_8px_40px_rgba(0,0,0,0.45)] backdrop-blur"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 left-[20%] h-56 w-56 rounded-full bg-accent/18 blur-[120px]" />
            <div className="absolute -bottom-16 right-[10%] h-64 w-64 rounded-full bg-accent-3/15 blur-[120px]" />
            <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-60" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
              <span className="flex items-center gap-2 text-text-strong">
                <span className="h-2 w-2 rounded-full bg-accent" />
                What I work with
              </span>
              <span className="flex items-center gap-3">
                <span>{totalSkills} total</span>
                <span className="h-px w-8 bg-line/70" />
                <span>Hover to slow down</span>
              </span>
            </div>

            <div className="space-y-4">
              <div className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                <InfiniteSlider gap={22} duration={36} durationOnHover={60}>
                  {rowOne.map((item) => (
                    <SkillTile key={`${item.category}-${item.skill}`} skill={item.skill} category={item.category} />
                  ))}
                </InfiniteSlider>
              </div>
              <div className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                <InfiniteSlider gap={22} duration={40} durationOnHover={60} reverse>
                  {rowTwo.map((item) => (
                    <SkillTile key={`${item.category}-${item.skill}`} skill={item.skill} category={item.category} />
                  ))}
                </InfiniteSlider>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
