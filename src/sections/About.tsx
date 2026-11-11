import React from 'react';
import { m } from 'framer-motion';
import { EDUCATION } from '../constants';
import { CONTAINER_CLASS, SECTION_CLASS, SectionHeading } from '../components/SectionHeading';
import { SectionBlob } from '../components/SectionBlob';
import { fadeInUp, staggerContainer } from '../utils/motion';

const FOCUS = ['AI services, RAG and vector search', 'Systems programming in C and C++', 'Offensive security and CTFs'];

export const About = () => (
  <section id="about" className={SECTION_CLASS}>
    <SectionBlob className="-top-16 right-[-5%] h-80 w-80" color="rgb(34 211 238 / 0.14)" />
    <m.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.15 }}
      className={CONTAINER_CLASS}
    >
      <SectionHeading index="01" title="About Me" />

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <m.div variants={fadeInUp} className="space-y-6 text-base leading-relaxed text-text md:text-lg">
          <p>
            I&apos;m an AI engineer. I build the service layer around language models:{' '}
            <span className="font-semibold text-text-strong">embeddings, vector search and local LLM inference</span>,
            exposed as APIs in Python with FastAPI and PostgreSQL. Right now I&apos;m the product owner of
            ShieldCore, the bug bounty platform my team of five is building at 1337, and I build its AI service: it
            detects duplicate vulnerability reports and suggests triage and severity.
          </p>
          <p>
            That work sits on a systems background. At{' '}
            <span className="font-semibold text-text-strong">1337 (42 Network)</span> in Rabat I wrote a Unix shell,
            a ray tracer and a multithreaded simulation in C, and an IRC server in C++98 on non-blocking sockets.
            Before software, I spent four years in the Royal Moroccan Navy working on shipboard navigation systems
            and their real-time telemetry.
          </p>
          <p>
            I also come from offensive security. I sit on the board of M4SEC, the CTF team ranked
            #1 in Morocco for the 2025 season, where I compete in web security and DFIR, and I review application
            security for freelance clients. Some of my Hack The Box writeups are further down this page.
          </p>

          <div className="grid gap-4 pt-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-bg-elev-1/80 px-5 py-4 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset]">
              <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">Focus</h3>
              <ul className="space-y-1 text-sm text-text-strong">
                {FOCUS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-bg-elev-1/80 px-5 py-4 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset]">
              <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">Location</h3>
              <div className="text-sm text-text-strong">Rabat, Morocco</div>
              <div className="text-sm text-text-muted">Open to remote work</div>
            </div>
          </div>
        </m.div>

        <m.div variants={fadeInUp}>
          <div className="relative rounded-[28px] border border-white/10 bg-bg-elev-1/80 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] sm:p-8">
            <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2">Education</h3>
            <div className="space-y-8">
              {EDUCATION.map((edu) => (
                <div key={edu.id} className="relative border-l border-line-strong/70 pl-6">
                  <div className="absolute -left-[4px] top-2 h-2 w-2 rounded-full bg-accent" />
                  <div className="mb-1 font-semibold text-text-strong">{edu.degree}</div>
                  <div className="mb-2 flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                    <span>{edu.school}</span>
                    <span>{edu.year}</span>
                  </div>
                  {edu.focus && <p className="mb-2 text-xs leading-relaxed text-text-muted/80">{edu.focus}</p>}
                  {edu.certifications && (
                    <ul className="list-inside list-disc space-y-0.5 text-xs text-text-muted/70">
                      {edu.certifications.map((cert) => (
                        <li key={cert}>{cert}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </m.div>
  </section>
);
