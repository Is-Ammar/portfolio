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
      className="group bg-surface/80 backdrop-blur-sm border border-line flex flex-col h-full rounded-[2px] relative overflow-hidden transition-colors"
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
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-bg-elev-1 border border-line rounded-[2px] text-[10px] font-mono uppercase tracking-widest text-text-muted">
            {getIcon(project.category)}
            {project.category}_OP
          </div>
          <div className="flex gap-3 z-10">
             {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent transition-colors">
                <Github size={18} />
              </a>
            )}
             {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent transition-colors">
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-display font-bold mb-3 text-text-strong group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-3">
          {project.description}
        </p>

        <div className="mt-auto">
          <div className="mb-4 pt-4 border-t border-line border-dashed">
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
            {project.tech.length > 3 && <span className="text-[10px] text-text-muted font-mono self-center">+{project.tech.length - 3}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};