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
  'from-accent-2/20 via-transparent to-accent/25',
  'from-accent/20 via-transparent to-accent/20',
  'from-accent/25 via-transparent to-accent/15',
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
    <section id="skills" className="relative py-32 bg-bg-elev-1/80 backdrop-blur-md px-6 border-y border-line/60 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-10 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent-2/10 blur-3xl" />
          <div className="absolute inset-0 text-accent/20 bg-[radial-gradient(circle,_currentColor_1px,_transparent_1px)] bg-[length:36px_36px] opacity-15" />
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
          className="absolute bottom-20 h-px w-1/2 bg-gradient-to-r from-transparent via-accent-2/40 to-transparent opacity-40"
        />
      </div>
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 max-w-[1200px] mx-auto"
      >
        <div className="flex items-center gap-4 mb-16">
            <motion.span variants={fadeInUp} className="font-mono text-accent text-sm uppercase tracking-wider">02</motion.span>
            <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-strong">TECHNICAL ARSENAL</motion.h2>
            <motion.div variants={revealLine} className="h-px bg-line flex-grow"></motion.div>
        </div>

        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mb-10 text-xs sm:text-sm font-mono uppercase tracking-wider text-text-muted">
          <span className="flex items-center gap-2">
            <Sparkles size={12} className="text-accent" />
            {totalSkills} Skills Loaded
          </span>
          <span className="h-px w-8 bg-line"></span>
          <span className="flex items-center gap-2">
            <GripVertical size={12} />
            Drag modules to reorder
          </span>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((cat, index) => {
            const glow = CARD_GLOWS[index % CARD_GLOWS.length];
            return (
              <motion.div 
                key={cat.name} 
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                transition={{ duration: DURATION.sm, ease: EASE_OUT }}
                className="group relative bg-bg-elev-1/70 p-6 border border-line/70 hover:bg-surface/80 transition-colors backdrop-blur-sm overflow-hidden rounded-2xl shadow-card"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${glow}`} />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-mono text-accent text-xs uppercase tracking-wider flex items-center gap-2">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-mono uppercase tracking-wider text-text-muted">{cat.skills.length} units</span>
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
                          className="group/skill relative flex items-center gap-3 rounded-lg border border-line/70 bg-bg/40 px-3 py-2 text-sm font-mono text-text-muted backdrop-blur-sm cursor-grab active:cursor-grabbing transition-colors"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-line-strong/60 bg-bg-elev-2/70 text-accent transition-colors group-hover/skill:border-accent/50 group-hover/skill:bg-accent group-hover/skill:text-bg">
                            <Icon size={16} />
                          </span>
                          <span className="transition-colors group-hover/skill:text-text-strong">{skill}</span>
                          <span className="ml-auto text-text-muted/60 transition-colors group-hover/skill:text-accent">
                            <GripVertical size={14} />
                          </span>
                          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/skill:opacity-100 transition-opacity">
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
