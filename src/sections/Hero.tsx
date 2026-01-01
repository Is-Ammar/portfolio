import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Cpu, MapPin, Shield, Sparkles } from 'lucide-react';
import { SOCIALS } from '../constants';
import { DURATION, fadeInUp, staggerContainer } from '../utils/motion';

const ScrambleText = ({ text, className }: { text: string; className?: string }) => {
  const [display, setDisplay] = useState(text);
  const chars = "!@#$%^&*()_+-=[]{}|;':,./<>?";
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(text);
      return;
    }
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 5;
    }, 45);
    return () => clearInterval(interval);
  }, [text, reduceMotion]);

  return <span className={className}>{display}</span>;
};

export const Hero = () => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen px-6 pb-16 pt-32 lg:px-12"
    >
      <motion.div
        variants={staggerContainer}
        initial={reduceMotion ? false : 'initial'}
        animate="animate"
        className="relative z-10 mx-auto grid max-w-[1600px] items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div>
          <motion.div variants={fadeInUp} className="mb-8 flex flex-wrap items-center gap-4 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong/70 bg-bg-elev-1/80 px-4 py-2 text-text-strong">
              <span className="h-2 w-2 rounded-full bg-accent shadow-glow" />
              Open for select engagements
            </span>
            <span className="h-px w-10 bg-line/70" />
            <span className="flex items-center gap-2">
              <Sparkles size={12} className="text-accent" /> Security & Full-Stack Engineer
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className="overflow-hidden">
            <h1 className="text-[clamp(3.5rem,9vw,9rem)] font-display font-semibold leading-[0.88] tracking-tight text-text-strong">
              <ScrambleText text="ISMAIL" /> <br />
              <span className="text-text-muted">
                <ScrambleText text="AMMAR" />
              </span>
            </h1>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8 max-w-2xl space-y-6 text-lg text-text md:text-xl">
            <p className="leading-relaxed">
              I build resilient full-stack systems with a security-first mindset. From hardened APIs to
              high-performance interfaces, I ship reliable products with observable, measurable impact.
            </p>
            <div className="flex flex-wrap gap-3 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
              <span className="rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2">AppSec + APIs</span>
              <span className="rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2">Full-Stack Delivery</span>
              <span className="rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2">Secure Systems</span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-5">
            <ButtonGlitch href="#work" primary>
              View Selected Work
            </ButtonGlitch>
            <ButtonGlitch href={SOCIALS.resume} download="Ismail-Ammar-Resume.pdf">
              Download Resume
            </ButtonGlitch>
          </motion.div>
        </div>

        <motion.div variants={fadeInUp} style={{ y: reduceMotion ? 0 : y, opacity: reduceMotion ? 1 : opacity }} className="grid gap-6">
          <div className="rounded-[28px] border border-white/10 bg-bg-elev-1/70 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
              <span>Operational Focus</span>
              <span className="text-text-strong">2025 Focus</span>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-text">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-bg/60 px-4 py-3 backdrop-blur-sm transition-colors">
                <Cpu size={16} className="mt-1 text-accent" />
                <div>
                  <div className="text-text-strong">Secure backend systems</div>
                  <div className="text-xs text-text-muted">Auth, rate limits, observability</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-bg/60 px-4 py-3 backdrop-blur-sm transition-colors">
                <Shield size={16} className="mt-1 text-accent-2" />
                <div>
                  <div className="text-text-strong">Security architecture</div>
                  <div className="text-xs text-text-muted">Threat modeling, hardening</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-bg/60 px-4 py-3 backdrop-blur-sm transition-colors">
                <Sparkles size={16} className="mt-1 text-accent-3" />
                <div>
                  <div className="text-text-strong">Full-stack delivery</div>
                  <div className="text-xs text-text-muted">Fast iteration, stable release</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-bg-elev-2/70 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
              <span>Current Signal</span>
              <span className="text-text-strong">Remote / Hybrid</span>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-bg/60 px-4 py-4 text-sm text-text backdrop-blur-sm transition-colors">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-accent" />
                <span>Based in Morocco</span>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">UTC+1</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: reduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 1.2, duration: reduceMotion ? 0 : DURATION.lg }}
        className="relative z-10 mx-auto mt-12 flex max-w-[1600px] flex-wrap items-center justify-between gap-6 border-t border-line/60 pt-6 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted"
      >
        <div className="flex items-center gap-4">
          <span>Scroll to explore</span>
          <span className="h-px w-10 bg-line/70" />
          <span>Selected work + impact</span>
        </div>
        <div>Built for scale and craft</div>
      </motion.div>
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
    <motion.a
      href={href}
      download={download}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
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
    </motion.a>
  );
};
