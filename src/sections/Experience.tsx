import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE } from '../constants';
import { DURATION, EASE_OUT, fadeInUp, staggerContainer } from '../utils/motion';

export const Experience = () => {
  return (
    <section className="py-32 bg-bg/80 backdrop-blur-md px-6 border-t border-line">
      <div className="max-w-[800px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.md, ease: EASE_OUT }}
          className="text-center mb-16"
        >
           <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-text-strong tracking-tight">
            CAREER TRAJECTORY
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.lg, ease: EASE_OUT }}
            className="h-1 w-20 bg-accent mx-auto origin-center"
          />
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-0 relative ml-4 md:ml-0"
        >
          {/* Vertical Data Line Draw */}
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: EASE_OUT }}
            className="absolute left-0 top-0 bottom-0 w-px bg-line origin-top md:left-auto md:right-auto md:inset-y-0"
            style={{ left: '0px' }} // Default for mobile, refined below
          />
          {/* Desktop centered line override */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-line -ml-px"></div>

          {EXPERIENCE.map((exp, i) => (
            <motion.div 
              key={exp.id} 
              variants={fadeInUp}
              className="relative pl-12 md:pl-0 pb-16 last:pb-0 group"
            >
              {/* Desktop Layout */}
              <div className="hidden md:flex justify-between items-start gap-10">
                 {/* Left: Date */}
                 <div className="w-1/3 text-right pt-1">
                    <div className="font-mono text-accent text-xs uppercase tracking-widest">{exp.period}</div>
                 </div>

                 {/* Center: Node */}
                 <div className="relative flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.2, backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' }}
                      className="w-3 h-3 bg-bg border-2 border-line rounded-full transition-colors z-10"
                    ></motion.div>
                 </div>

                 {/* Right: Content */}
                 <div className="w-2/3 pt-0">
                    <h3 className="text-xl font-bold text-text-strong mb-1">{exp.role}</h3>
                    <div className="text-sm font-medium text-text-muted mb-4">{exp.company}</div>
                    <p className="text-text text-sm leading-relaxed max-w-sm">
                      {exp.description}
                    </p>
                 </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden">
                 <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 bg-bg border-2 border-accent rounded-full z-10"></div>
                 <div className="font-mono text-accent text-xs uppercase tracking-widest mb-2">{exp.period}</div>
                 <h3 className="text-lg font-bold text-text-strong mb-1">{exp.role}</h3>
                 <div className="text-sm font-medium text-text-muted mb-3">{exp.company}</div>
                 <p className="text-text text-sm leading-relaxed">
                   {exp.description}
                 </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};