import React from 'react';
import { motion } from 'framer-motion';
import { EDUCATION } from '../constants';
import { fadeInUp, staggerContainer, revealLine } from '../utils/motion';

export const About = () => {
  return (
    <section id="about" className="py-32 px-6 max-w-[1200px] mx-auto border-x border-line/30">
      <motion.div
         variants={staggerContainer}
         initial="initial"
         whileInView="animate"
         viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex items-center gap-4 mb-16">
            <motion.span variants={fadeInUp} className="font-mono text-accent text-sm">01</motion.span>
            <motion.h2 variants={fadeInUp} className="text-2xl font-display font-bold tracking-tight text-text-strong">OPERATIONAL PROFILE</motion.h2>
            <motion.div variants={revealLine} className="h-px bg-line flex-grow"></motion.div>
        </div>

        <div className="grid md:grid-cols-12 gap-16">
            <motion.div variants={fadeInUp} className="md:col-span-7 space-y-8 text-lg text-text font-light leading-relaxed">
            <p>
                With over 4 years of experience in software engineering, I specialize in the architecture of <strong className="text-text-strong font-medium">Intelligent Applications</strong> and <strong className="text-text-strong font-medium">AI Infrastructure</strong>.
            </p>
            <p>
                My work focuses on leveraging Large Language Models (LLMs) and MLOps practices to solve complex business problems. From architecting scalable RAG pipelines to optimizing inference costs on the cloud, I treat AI not just as a feature, but as a critical system component requiring rigor, observability, and efficiency.
            </p>
            
            <div className="pt-8 grid grid-cols-2 gap-4">
                <div className="border-l border-line pl-4">
                    <h4 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">Primary Focus</h4>
                    <ul className="space-y-1 text-sm text-text-strong">
                    <li>AI Systems Engineering</li>
                    <li>High-Performance Web</li>
                    </ul>
                </div>
                <div className="border-l border-line pl-4">
                    <h4 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">Location</h4>
                    <div className="text-sm text-text-strong">Based in Morocco</div>
                    <div className="text-sm text-text-muted">Available Remote</div>
                </div>
            </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="md:col-span-5">
                <div className="bg-surface/80 backdrop-blur-sm border border-line p-8 relative">
                <div className="absolute top-0 right-0 p-2">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-text-muted rounded-full"></div>
                        <div className="w-1 h-1 bg-text-muted rounded-full"></div>
                        <div className="w-1 h-1 bg-text-muted rounded-full"></div>
                    </div>
                </div>
                <h3 className="font-mono uppercase text-sm font-bold text-accent mb-6">Education Log</h3>
                <div className="space-y-8">
                    {EDUCATION.map(edu => (
                    <div key={edu.id} className="relative pl-6 border-l border-line-strong">
                        <div className="absolute -left-[3px] top-1.5 w-[5px] h-[5px] bg-accent rounded-full"></div>
                        <div className="text-text-strong font-medium mb-1">{edu.degree}</div>
                        <div className="text-xs font-mono text-text-muted flex justify-between uppercase tracking-wide">
                        <span>{edu.school}</span>
                        <span>{edu.year}</span>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </motion.div>
        </div>
      </motion.div>
    </section>
  );
};