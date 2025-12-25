import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Filter, Github } from 'lucide-react';
import { PROJECTS } from '../constants';
import { DURATION, EASE_OUT, fadeInUp, staggerContainer, revealLine } from '../utils/motion';

export const Work = () => {
  const [filter, setFilter] = useState<'All' | 'AI' | 'Web' | 'Sys' | 'Sec' | 'Gfx'>('All');
  
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

  return (
    <section id="work" className="py-32 px-6 max-w-[1200px] mx-auto border-x border-line/20">
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
            <div className="flex items-center gap-4">
                <motion.span variants={fadeInUp} className="font-mono text-accent text-sm uppercase tracking-wider">03</motion.span>
                <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-strong">SELECTED WORK</motion.h2>
                <motion.div variants={revealLine} className="h-px bg-line w-12 md:w-32"></motion.div>
            </div>

            <motion.div variants={fadeInUp} className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <Filter size={14} className="text-text-muted mr-2 shrink-0" />
                {['All', 'AI', 'Web', 'Sys', 'Sec', 'Gfx'].map(f => (
                <button 
                    key={f}
                    type="button"
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 text-xs sm:text-sm font-mono uppercase tracking-wider transition-all rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${filter === f ? 'bg-accent/10 border-accent text-accent shadow-glow' : 'bg-bg-elev-1/40 border-line/60 text-text-muted hover:text-text-strong hover:bg-bg-elev-1/70'}`}
                    aria-pressed={filter === f}
                >
                    {f}
                </button>
                ))}
            </motion.div>
        </div>

        <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map(p => (
                <motion.div 
                layout
                key={p.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: DURATION.sm, ease: EASE_OUT }}
                className={`relative bg-bg-elev-1/70 backdrop-blur-sm p-6 pt-10 border transition-all group overflow-hidden flex flex-col rounded-2xl ${p.featured ? 'border-accent/40 shadow-card' : 'border-line/70 hover:border-accent/40 hover:shadow-card'}`}
                >
                {/* Hover Corner Accent */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-l-[24px] border-t-accent/80 border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Featured Badge */}
                {p.featured && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono text-accent uppercase tracking-wider">
                        Featured
                    </div>
                )}

                <div className={`flex justify-between items-start mb-4 ${p.featured ? 'mt-8' : 'mt-2'}`}>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full transition-all ${p.featured ? 'bg-accent shadow-glow' : 'bg-accent/50 group-hover:bg-accent group-hover:shadow-glow'}`}></span>
                            <h4 className="font-bold text-base text-text-strong group-hover:text-accent transition-colors">{p.title}</h4>
                        </div>
                        <div className="text-xs font-mono text-text-muted uppercase tracking-wider pl-3.5">
                           {p.role}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {p.github && (
                            <a
                              href={p.github}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${p.title} GitHub`}
                              className="text-text-muted hover:text-accent transition-colors p-2 hover:bg-accent/10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                            >
                                <Github size={16} />
                            </a>
                        )}
                        {p.link && (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${p.title} Live link`}
                              className="text-text-muted hover:text-accent transition-colors p-2 hover:bg-accent/10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                            >
                                <ArrowUpRight size={16} />
                            </a>
                        )}
                    </div>
                </div>
                
                <p className="text-sm text-text-muted/80 mb-6 leading-relaxed clamp-3 pl-3.5 border-l border-line-strong/50 ml-0.5 flex-grow">
                    {p.description}
                </p>
                
                <div className="mt-auto pl-3.5">
                    {p.impact && (
                        <div className="mb-4 pb-4 border-b border-line/50 border-dashed">
                            <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Impact</div>
                            <div className="text-xs text-text-strong font-medium">{p.impact}</div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {p.tech.slice(0, 4).map(t => (
                        <span key={t} className="text-xs uppercase font-mono text-text-muted/70 bg-bg border border-line/70 px-2 py-1 rounded-full group-hover:border-accent/30 transition-colors">
                            {t}
                        </span>
                        ))}
                        {p.tech.length > 4 && (
                            <span className="text-xs uppercase font-mono text-text-muted/40 px-1 py-1">+{p.tech.length - 4}</span>
                        )}
                    </div>
                </div>
                
                {/* ID Watermark */}
                <div className="absolute bottom-2 right-2 text-xs font-mono text-line-strong opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    ID: {p.id}
                </div>
                </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};
