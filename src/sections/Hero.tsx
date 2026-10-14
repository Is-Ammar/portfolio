import React, { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Cpu, Database, MapPin, Server, Terminal } from 'lucide-react';
import { SOCIALS } from '../constants';
import { NameLetters } from '../components/NameLetters';
import { DURATION, fadeInUp, staggerContainer } from '../utils/motion';

const CURRENT_PROJECT = [
  { Icon: Database, tone: 'text-accent-3', title: 'Duplicate report detection', detail: 'Vector search with pgvector' },
  { Icon: Cpu, tone: 'text-accent', title: 'Triage and severity suggestions', detail: 'Local LLMs with Ollama' },
  { Icon: Server, tone: 'text-accent-2', title: 'AI service for the platform', detail: 'Python, FastAPI, Docker' },
];

export const Hero = () => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen px-5 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-12">
      <m.div
        variants={staggerContainer}
        initial={reduceMotion ? false : 'initial'}
        animate="animate"
        className="relative z-10 mx-auto grid max-w-[1600px] items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="min-w-0">
          <m.div
            variants={fadeInUp}
            className="mb-8 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted sm:tracking-[0.3em]"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong/70 bg-bg-elev-1/80 px-4 py-2 text-text-strong">
              <span className="h-2 w-2 rounded-full bg-accent shadow-glow" />
              Available for freelance work
            </span>
            <span className="hidden h-px w-10 bg-line/70 sm:block" />
            <span className="flex items-center gap-2">
              <Terminal size={12} className="text-accent" /> AI Engineering Student
            </span>
          </m.div>

          <m.div variants={fadeInUp} className="overflow-hidden">
            <NameLetters />
          </m.div>

          <m.div variants={fadeInUp} className="mt-8 max-w-2xl space-y-6 text-lg text-text md:text-xl">
            <p className="leading-relaxed">
              I build AI services in Python with FastAPI, PostgreSQL (pgvector) and local models in Ollama, and I
              write low-level C and C++ on Linux. Outside school I play web security and DFIR in CTFs with M4SEC.
              Currently studying at 1337 (42 Network) in Rabat.
            </p>
            <div className="flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted sm:tracking-[0.3em]">
              <span className="rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2">RAG & vector search</span>
              <span className="rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2">C / C++ on Linux</span>
              <span className="rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2">Web security</span>
            </div>
          </m.div>

          <m.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4 sm:gap-5">
            <ButtonGlitch href="#work" primary>
              View projects
            </ButtonGlitch>
            <ButtonGlitch href={SOCIALS.resume} download="Ismail-Ammar-Resume.pdf">
              Download Resume
            </ButtonGlitch>
          </m.div>
        </div>

        <m.div
          variants={fadeInUp}
          style={reduceMotion ? undefined : { y, opacity }}
          className="grid min-w-0 gap-6"
        >
          <div className="glow-card rounded-[28px] border border-white/10 bg-bg-elev-1/80 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset]">
            <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted sm:tracking-[0.3em]">
              <span>Currently building</span>
              <span className="rounded-full border border-accent-3/40 bg-accent-3/10 px-3 py-1 text-[10px] text-accent-3">
                In progress
              </span>
            </div>
            <div className="mt-5">
              <div className="font-display text-xl font-semibold text-text-strong">ft_transcendence</div>
              <div className="mt-1 text-sm text-text-muted">Bug bounty platform, 1337 team project</div>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-text">
              {CURRENT_PROJECT.map(({ Icon, tone, title, detail }) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-bg/60 px-4 py-3">
                  <Icon size={16} className={`mt-1 shrink-0 ${tone}`} />
                  <div className="min-w-0">
                    <div className="text-text-strong">{title}</div>
                    <div className="text-xs text-text-muted">{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-bg-elev-2/80 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset]">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted sm:tracking-[0.3em]">
              <span>Where I work</span>
              <span className="text-text-strong">Remote friendly</span>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-bg/60 px-4 py-4 text-sm text-text">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-accent" />
                <span>Based in Morocco</span>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">UTC+1</span>
            </div>
          </div>
        </m.div>
      </m.div>

      <m.div
        initial={{ opacity: reduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 1.2, duration: reduceMotion ? 0 : DURATION.lg }}
        className="relative z-10 mx-auto mt-12 flex max-w-[1600px] flex-wrap items-center justify-between gap-6 border-t border-line/60 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted sm:tracking-[0.3em]"
      >
        <div className="flex items-center gap-4">
          <span>Scroll to explore</span>
          <span className="hidden h-px w-10 bg-line/70 sm:block" />
          <span className="hidden sm:inline">Projects, experience, writeups</span>
        </div>
        <div>Rabat, Morocco</div>
      </m.div>
    </section>
  );
};

const ButtonGlitch = ({
  children,
  href,
  primary = false,
  download,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
  download?: string;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <m.a
      href={href}
      download={download}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:tracking-[0.3em] ${
        primary
          ? 'border-accent bg-accent text-bg shadow-glow'
          : 'border-line-strong/70 bg-bg-elev-1/80 text-text-strong hover:border-accent/60'
      }`}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </span>
      <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="absolute -inset-6 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_55%)]" />
      </span>
    </m.a>
  );
};
