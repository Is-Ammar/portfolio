import React from 'react';
import { motion } from 'framer-motion';
import { EDUCATION } from '../constants';
import { fadeInUp, staggerContainer, revealLine } from '../utils/motion';

export const About = () => {
  return (
    <section id="about" className="section-shell px-6 py-28 lg:px-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 right-[-5%] h-64 w-64 rounded-full bg-accent-3/20 blur-[110px]" />
      </div>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 mx-auto max-w-[1600px]"
      >
        <div className="mb-12 flex flex-wrap items-center gap-4">
          <motion.span variants={fadeInUp} className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">01</motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-semibold text-text-strong">Operational Profile</motion.h2>
          <motion.div variants={revealLine} className="h-px flex-grow bg-gradient-to-r from-line via-accent-3/40 to-line" />
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={fadeInUp} className="space-y-8 text-lg text-text leading-relaxed">
            <p>
              With 4+ years in software engineering, I architect <span className="text-text-strong font-semibold">intelligent applications</span> and
              <span className="text-text-strong font-semibold"> AI infrastructure</span> that is measurable, secure, and fast to ship.
            </p>
            <p>
              I translate complex LLM workflows into production systems: retrieval pipelines, cost-aware inference, and telemetry that proves impact.
              The goal is always the same: clear outcomes, reliable delivery, and software that scales.
            </p>

            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-bg-elev-1/70 px-5 py-4 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500 hover:border-accent/40">
                <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted mb-3">Primary Focus</h4>
                <ul className="space-y-1 text-sm text-text-strong">
                  <li>AI Systems Engineering</li>
                  <li>High-Performance Web</li>
                </ul>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-bg-elev-1/70 px-5 py-4 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500 hover:border-accent/40">
                <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted mb-3">Location</h4>
                <div className="text-sm text-text-strong">Based in Morocco</div>
                <div className="text-sm text-text-muted">Available Remote</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="relative rounded-[28px] border border-white/10 bg-bg-elev-1/70 p-8 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500 hover:border-accent/40">
              <div className="absolute top-0 right-0 p-3">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                  <div className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                  <div className="h-1.5 w-1.5 rounded-full bg-text-muted" />
                </div>
              </div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2 mb-6">Education Log</h3>
              <div className="space-y-8">
                {EDUCATION.map((edu) => (
                  <div key={edu.id} className="relative pl-6 border-l border-line-strong/70">
                    <div className="absolute -left-[4px] top-2 h-2 w-2 rounded-full bg-accent" />
                    <div className="text-text-strong font-semibold mb-1">{edu.degree}</div>
                    <div className="text-[11px] font-mono text-text-muted flex justify-between uppercase tracking-[0.2em] mb-2">
                      <span>{edu.school}</span>
                      <span>{edu.year}</span>
                    </div>
                    {edu.focus && (
                      <p className="text-xs text-text-muted/80 mb-2 leading-relaxed">{edu.focus}</p>
                    )}
                    {edu.certifications && (
                      <ul className="list-disc list-inside text-xs text-text-muted/70 space-y-0.5">
                        {edu.certifications.map((cert, idx) => (
                          <li key={idx}>{cert}</li>
                        ))}
                      </ul>
                    )}
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
