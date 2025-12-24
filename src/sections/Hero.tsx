import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Terminal, Activity } from 'lucide-react';
import { SOCIALS } from '../constants';
import { DURATION, fadeInUp, staggerContainer, signalSweep } from '../utils/motion';

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Panel Parallax (Hero Only)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen pt-32 pb-20 px-6 flex flex-col justify-center max-w-[1200px] mx-auto border-x border-line/30 overflow-hidden">
      {/* Hero Signal Sweep */}
      <motion.div 
        variants={signalSweep}
        initial="initial"
        animate="animate"
        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-accent/10 to-transparent z-0 pointer-events-none"
      />

      {/* Background Decor - Parallax */}
      <motion.div style={{ y, opacity }} className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none hidden lg:block z-0">
        <div className="border border-text-strong w-64 h-64 rounded-full flex items-center justify-center">
            <div className="border border-text-strong w-48 h-48 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-text-strong rounded-full animate-ping"></div>
            </div>
        </div>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-4xl"
      >
        <motion.div 
          variants={fadeInUp}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px w-12 bg-accent"></div>
          <span className="font-mono text-accent text-xs uppercase tracking-[0.2em]">
            System Status: Online
          </span>
        </motion.div>

        <motion.h1 
          variants={fadeInUp}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] tracking-tight text-text-strong mb-8"
        >
          ISMAIL <span className="text-text-muted">AMMAR</span>
        </motion.h1>

        <motion.div 
          variants={fadeInUp}
          className="border-l-2 border-line pl-6 mb-12 max-w-2xl"
        >
            <p className="text-xl md:text-2xl text-text font-light leading-relaxed mb-4">
              Building intelligent <span className="text-accent font-medium">AI systems</span> that bridge the gap between research concepts and production reality.
            </p>
            <div className="flex gap-4 font-mono text-xs text-text-muted uppercase tracking-wider">
               <span className="flex items-center gap-2"><Activity size={14} /> MLOps Specialist</span>
               <span className="flex items-center gap-2"><Terminal size={14} /> Full-Stack Engineer</span>
            </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="flex flex-wrap gap-4"
        >
          {/* Magnetic Buttons */}
          <motion.a 
            href="#work"
            whileHover={{ x: 4, y: -2, boxShadow: '0 0 15px rgba(32, 194, 14, 0.4)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="px-8 py-4 bg-accent text-bg font-mono text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-[2px] flex items-center gap-3"
          >
            Access Projects <ArrowRight size={16} />
          </motion.a>
          <motion.a 
            href={SOCIALS.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4, y: -2, borderColor: 'var(--text-strong)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="px-8 py-4 bg-transparent border border-line-strong text-text font-mono text-xs font-bold uppercase tracking-widest hover:text-text-strong transition-colors rounded-[2px]"
          >
            Github Protocol
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: DURATION.lg }}
        className="absolute bottom-10 left-6 right-6 flex justify-between items-end border-b border-line pb-4 font-mono text-[10px] text-text-muted uppercase tracking-widest"
      >
         <div>Scroll to Navigate</div>
         <div>V 2.0.4</div>
      </motion.div>
    </section>
  );
};
