import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Filter } from 'lucide-react';
import { PROJECTS } from '../constants';
import { ProjectCard } from '../components/ProjectCard';
import { DURATION, EASE_OUT, fadeInUp, staggerContainer, revealLine } from '../utils/motion';

export const Work = () => {
  const [filter, setFilter] = useState<'All' | 'AI' | 'Web' | 'Sys' | 'Sec' | 'Gfx'>('All');
  
  const featured = PROJECTS.filter(p => p.featured);
  const others = PROJECTS.filter(p => !p.featured);
  
  const displayedOthers = filter === 'All' 
    ? others 
    : others.filter(p => {
        if (filter === 'AI') return p.category === 'AI';
        if (filter === 'Web') return p.category === 'Web';
        if (filter === 'Sec') return p.category === 'Security';
        if (filter === 'Gfx') return p.category === 'Graphics & Simulation';
        if (filter === 'Sys') return ['System', 'Infra', 'Software Engineering', 'DevOps & Utilities'].includes(p.category);
        return false;
    });

  return (
    <section id="work" className="py-32 px-6 max-w-[1200px] mx-auto border-x border-line/30">
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        className="mb-24"
      >
        <div className="flex items-center gap-4 mb-16">
            <motion.span variants={fadeInUp} className="font-mono text-accent text-sm">03</motion.span>
            <motion.h2 variants={fadeInUp} className="text-2xl font-display font-bold tracking-tight text-text-strong">MISSION LOG / FEATURED</motion.h2>
            <motion.div variants={revealLine} className="h-px bg-line flex-grow"></motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(p => (
            <div key={p.id} className="h-full">
                <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b border-line pb-4">
          <motion.h3 variants={fadeInUp} className="text-lg font-bold font-display text-text-strong">ARCHIVE</motion.h3>
          <motion.div variants={fadeInUp} className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0">
             <Filter size={14} className="text-text-muted" />
            {['All', 'AI', 'Web', 'Sys', 'Sec', 'Gfx'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 text-[11px] font-mono uppercase tracking-widest transition-all rounded-[2px] ${filter === f ? 'bg-accent text-bg font-bold' : 'bg-transparent text-text-muted hover:text-text-strong'}`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {displayedOthers.map(p => (
                <motion.div 
                layout
                key={p.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: DURATION.sm, ease: EASE_OUT }}
                className="bg-surface/80 backdrop-blur-sm p-6 border border-line hover:border-text-muted/30 transition-all group"
                >
                <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-base text-text-strong group-hover:text-accent transition-colors">{p.title}</h4>
                    {p.github && <a href={p.github} className="text-text-muted hover:text-accent"><ArrowUpRight size={14} /></a>}
                </div>
                <div className="text-[10px] font-mono text-accent mb-2 uppercase tracking-wider">
                  {p.role}
                </div>
                <p className="text-xs text-text-muted mb-4 leading-relaxed line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                    {p.tech.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] uppercase font-mono text-text-muted/60 border border-line px-1.5 py-0.5">
                        {t}
                    </span>
                    ))}
                </div>
                </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};