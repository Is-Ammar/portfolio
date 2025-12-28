import React from 'react';
import { motion } from 'framer-motion';
import { Download, Github, Linkedin, Mail } from 'lucide-react';
import { SOCIALS } from '../constants';
import { fadeInUp, staggerContainer, revealLine } from '../utils/motion';

export const Contact = () => {
  return (
    <section id="contact" className="section-shell px-6 py-28 lg:px-12">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-[1600px]"
      >
        <div className="mb-12 flex flex-wrap items-center gap-4">
          <motion.span variants={fadeInUp} className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">05</motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-semibold text-text-strong">Contact</motion.h2>
          <motion.div variants={revealLine} className="h-px flex-grow bg-gradient-to-r from-line via-accent/40 to-line" />
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div variants={fadeInUp}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse motion-reduce:animate-none" />
              Secure channel open
            </div>
            <h3 className="mb-6 text-4xl md:text-5xl font-display font-semibold text-text-strong leading-tight">
              Let&apos;s build intelligent systems with measurable impact
            </h3>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-text-muted">
              Available for high-impact contracts and consulting. Expect clear communication, fast delivery,
              and production-ready outcomes.
            </p>
            <a
              href={`mailto:${SOCIALS.email}`}
              className="inline-flex items-center gap-3 rounded-full border border-line-strong/70 bg-bg-elev-1/80 px-6 py-3 text-[11px] font-mono uppercase tracking-[0.3em] text-text-strong transition-all hover:border-accent/60 hover:text-accent hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Mail size={16} /> Start a conversation
            </a>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col justify-end items-start lg:items-end">
            <div className="w-full rounded-[28px] border border-line/70 bg-bg-elev-2/70 p-6 shadow-card">
              <div className="mb-6 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">Direct links</div>
              <div className="flex flex-col gap-5">
                <a
                  href={SOCIALS.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-full px-2 py-1 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <span className="group-hover:translate-x-1 transition-transform">GitHub</span> <Github size={16} />
                </a>
                <a
                  href={SOCIALS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-full px-2 py-1 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <span className="group-hover:translate-x-1 transition-transform">LinkedIn</span> <Linkedin size={16} />
                </a>
                <a
                  href={SOCIALS.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-full px-2 py-1 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Resume PDF</span> <Download size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
