import React, { useMemo, useState } from 'react';
import { motion, Reorder, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AppWindow,
  Atom,
  Bot,
  BrainCircuit,
  Cloud,
  Code2,
  Container,
  Cpu,
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
import { DURATION, EASE_OUT, fadeInUp, staggerContainer, revealLine } from '../utils/motion';

const SKILL_ICONS: Record<string, LucideIcon> = {
  Python: Terminal,
  PyTorch: Cpu,
  LangChain: BrainCircuit,
  RAG: Network,
  'OpenAI API': Sparkles,
  HuggingFace: Bot,
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

export const Skills = () => {
  const reduceMotion = useReducedMotion();
  const [skillGroups, setSkillGroups] = useState(() =>
    SKILLS.map((cat) => ({ ...cat, skills: [...cat.skills] }))
  );
  const totalSkills = useMemo(
    () => skillGroups.reduce((sum, cat) => sum + cat.skills.length, 0),
    [skillGroups]
  );

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
        <motion.div
          initial={reduceMotion ? { x: 0 } : { x: '-20%' }}
          animate={reduceMotion ? { x: 0 } : { x: '120%' }}
          transition={reduceMotion ? { duration: 0 } : { duration: 7, repeat: Infinity, ease: 'linear' }}
          className="absolute top-16 h-px w-1/3 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-60"
        />
        <motion.div
          initial={reduceMotion ? { x: 0 } : { x: '120%' }}
          animate={reduceMotion ? { x: 0 } : { x: '-20%' }}
          transition={reduceMotion ? { duration: 0 } : { duration: 9, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 h-px w-1/2 bg-gradient-to-r from-transparent via-accent-3/40 to-transparent opacity-40"
        />
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
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-semibold text-text-strong">Technical Arsenal</motion.h2>
          <motion.div variants={revealLine} className="h-px flex-grow bg-gradient-to-r from-line via-accent-3/40 to-line" />
        </div>

        <motion.div variants={fadeInUp} className="mb-10 flex flex-wrap items-center gap-4 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
          <span className="flex items-center gap-2">
            <Sparkles size={12} className="text-accent" />
            {totalSkills} Skills Loaded
          </span>
          <span className="h-px w-8 bg-line" />
          <span className="flex items-center gap-2">
            <GripVertical size={12} className="text-accent-3" />
            Drag modules to reorder
          </span>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((cat, index) => {
            const glow = CARD_GLOWS[index % CARD_GLOWS.length];
            return (
              <motion.div
                key={cat.name}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                transition={{ duration: DURATION.sm, ease: EASE_OUT }}
                className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-bg-elev-1/70 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500 hover:border-accent/40"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute -inset-0.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br ${glow}`} />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2">{cat.name}</h3>
                    <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">{cat.skills.length} units</span>
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
      </motion.div>
    </section>
  );
};
