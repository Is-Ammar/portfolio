import React from 'react';
import { motion } from 'framer-motion';
import { Github, Code, Cpu, Globe, Database, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';
import { SkillTag } from './SkillTag';
import { DURATION, EASE_OUT, fadeInUp } from '../utils/motion';

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const getIcon = (cat: string) => {
    switch(cat) {
      case 'AI': return <Cpu size={14} />;
      case 'Web': return <Globe size={14} />;
      case 'Infra': return <Database size={14} />;
      default: return <Code size={14} />;
    }
  };

  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ 
        y: -6, 
        borderColor: 'var(--line-strong)', 
        boxShadow: 'var(--shadow)',
        transition: { duration: DURATION.sm, ease: EASE_OUT }
      }}
      className="group bg-bg-elev-1/70 backdrop-blur border border-white/10 flex flex-col h-full rounded-2xl relative overflow-hidden transition-all duration-500 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] hover:border-accent/40"
    >
      {/* Decorative corner accent - animated on hover */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: DURATION.xs }}
        className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-accent"
      ></motion.div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-bg-elev-1 border border-line/70 rounded-full text-xs font-mono uppercase tracking-wider text-text-muted">
            {getIcon(project.category)}
            {project.category}_OP
          </div>
          <div className="flex gap-3 z-10">
             {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} GitHub`}
                className="text-text-muted hover:text-accent transition-colors rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <Github size={18} />
              </a>
            )}
             {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} Live link`}
                className="text-text-muted hover:text-accent transition-colors rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-display font-bold mb-1 text-text-strong group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <div className="text-xs font-mono text-accent mb-3 uppercase tracking-wider">
          {project.role}
        </div>
        <p className="text-text-muted text-sm leading-relaxed mb-6 clamp-3">
          {project.description}
        </p>

        <div className="mt-auto">
          <div className="mb-4 pt-4 border-t border-line/70 border-dashed">
             <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
                <span>Impact Metric</span>
                <span className="text-accent">{project.impact}</span>
             </div>
             <div className="h-0.5 w-full bg-bg-elev-1 overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.2 }}
                  className="h-full bg-line-strong group-hover:bg-accent transition-colors duration-500" 
                />
             </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 3).map(t => <SkillTag key={t} name={t} />)}
            {project.tech.length > 3 && <span className="text-xs text-text-muted font-mono self-center">+{project.tech.length - 3}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
