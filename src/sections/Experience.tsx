import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { EXPERIENCE } from '../constants';
import { EASE_OUT, fadeInUp, staggerContainer, revealLine } from '../utils/motion';

export const Experience = () => {
  return (
    <section id="experience" className="py-32 px-6 max-w-[1000px] mx-auto border-x border-line/20">
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        className="mb-20"
      >
        <div className="flex items-center gap-4 mb-16">
            <motion.span variants={fadeInUp} className="font-mono text-accent text-sm uppercase tracking-wider">04</motion.span>
            <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-strong">EXPERIENCE</motion.h2>
            <motion.div variants={revealLine} className="h-px bg-line flex-grow"></motion.div>
        </div>

        <div className="relative">
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: EASE_OUT }}
            className="absolute left-0 md:left-[30%] top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-line-strong/60 to-transparent origin-top"
          />

          <div className="space-y-12">
            {EXPERIENCE.map((exp, i) => (
              <motion.div 
                key={exp.id} 
                variants={fadeInUp}
                className="relative flex flex-col md:flex-row gap-8 md:gap-0 group"
              >
                <div className="md:w-[30%] md:pr-12 md:text-right flex flex-col md:items-end">
                   <div className="inline-flex items-center gap-2 font-mono text-accent text-xs uppercase tracking-wider mb-2 bg-accent/5 px-3 py-1.5 rounded-full border border-accent/20">
                      <Calendar size={12} />
                      {exp.period}
                   </div>
                   <h4 className="text-text-strong font-bold text-lg md:text-base">{exp.company}</h4>
                </div>

                <div className="absolute left-[-5px] md:left-[30%] md:-ml-[5px] top-0 md:top-1.5 z-10">
                   <motion.div 
                     className="w-2.5 h-2.5 bg-bg border border-accent rounded-full group-hover:bg-accent group-hover:shadow-glow transition-all duration-300"
                   />
                   <div className="hidden md:block absolute top-1/2 left-full w-8 h-px bg-line group-hover:bg-accent/50 transition-colors"></div>
                </div>

                <div className="md:w-[70%] md:pl-12">
                   <div className="relative bg-bg-elev-1/70 backdrop-blur-sm border border-line/70 p-6 rounded-2xl hover:border-accent/30 transition-colors group-hover:bg-bg-elev-1/80 shadow-card">
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <h3 className="text-xl font-display font-bold text-text-strong mb-2 flex items-center gap-2">
                        {exp.role}
                      </h3>
                      
                      <p className="text-text-muted text-sm leading-relaxed mb-6">
                        {exp.description}
                      </p>

                      {exp.highlights && (
                        <div className="mb-6 space-y-2">
                          {exp.highlights.map((h, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-sm text-text/90">
                               <span className="mt-1.5 w-1 h-1 bg-accent rounded-full shrink-0" />
                               <span className="leading-relaxed">{h}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {exp.tech && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-line/50 border-dashed">
                          {exp.tech.map((t) => (
                            <span key={t} className="text-xs font-mono uppercase px-2 py-1 bg-bg border border-line/70 rounded-full text-text-muted hover:text-accent hover:border-accent/30 transition-colors">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
