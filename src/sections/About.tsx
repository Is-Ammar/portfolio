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
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-semibold text-text-strong">About Me</motion.h2>
          <motion.div variants={revealLine} className="h-px flex-grow bg-gradient-to-r from-line via-accent-3/40 to-line" />
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={fadeInUp} className="space-y-8 text-lg text-text leading-relaxed">
            <p>
              I took an unusual road into software: before writing code full time I spent four years
              working on <span className="text-text-strong font-semibold">shipboard navigation systems</span> in
              the maritime sector, where things simply weren&apos;t allowed to fail.
            </p>
            <p>
              That habit stuck. Now I&apos;m at <span className="text-text-strong font-semibold">1337 (42 Network)</span> doing
              systems programming in C, building full-stack products on the side, and competing in CTFs
              with M4SEC — the team ranked #1 in Morocco for the 2025 season. I like software that holds
              up under pressure: sane auth, hardened APIs, and clear logs when something goes wrong.
            </p>

            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-bg-elev-1/70 px-5 py-4 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted mb-3">Focus</h3>
                <ul className="space-y-1 text-sm text-text-strong">
                  <li>Application security</li>
                  <li>Full-stack engineering</li>
                </ul>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-bg-elev-1/70 px-5 py-4 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted mb-3">Location</h3>
                <div className="text-sm text-text-strong">Rabat, Morocco</div>
                <div className="text-sm text-text-muted">Open to remote work</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="relative rounded-[28px] border border-white/10 bg-bg-elev-1/70 p-8 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2 mb-6">Education</h3>
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
