import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
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
      iterations += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text, reduceMotion]);

  return <span className={className}>{display}</span>;
};

const ElegantShape = ({
  className = '',
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/10',
  reduceMotion = false,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  reduceMotion?: boolean;
}) => {
  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 1, y: 0, rotate }
          : { opacity: 0, y: -150, rotate: rotate - 15 }
      }
      animate={{ opacity: 1, y: 0, rotate }}
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 2.4,
              delay,
              ease: [0.23, 0.86, 0.39, 0.96],
              opacity: { duration: 1.2 },
            }
      }
      className={`absolute ${className}`}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 16, 0] }}
        transition={reduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border-2 border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  );
};

export const Hero = () => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (reduceMotion) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlight = useMotionTemplate`
    radial-gradient(
      700px circle at ${mouseX}px ${mouseY}px,
      color-mix(in srgb, var(--accent) 20%, transparent),
      transparent 75%
    )
  `;

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden px-6 pb-16 pt-32 lg:px-12"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 blur-3xl" />
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            reduceMotion={reduceMotion}
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-indigo-500/15"
            className="left-[-12%] top-[14%] md:left-[-6%] md:top-[18%]"
          />
          <ElegantShape
            reduceMotion={reduceMotion}
            delay={0.5}
            width={520}
            height={120}
            rotate={-14}
            gradient="from-rose-500/15"
            className="right-[-8%] top-[68%] md:right-[-2%] md:top-[72%]"
          />
          <ElegantShape
            reduceMotion={reduceMotion}
            delay={0.4}
            width={320}
            height={86}
            rotate={-8}
            gradient="from-violet-500/15"
            className="left-[6%] bottom-[6%] md:left-[12%] md:bottom-[10%]"
          />
          <ElegantShape
            reduceMotion={reduceMotion}
            delay={0.6}
            width={220}
            height={64}
            rotate={18}
            gradient="from-amber-500/15"
            className="right-[12%] top-[10%] md:right-[18%] md:top-[14%]"
          />
          <ElegantShape
            reduceMotion={reduceMotion}
            delay={0.7}
            width={160}
            height={46}
            rotate={-22}
            gradient="from-cyan-500/15"
            className="left-[22%] top-[6%] md:left-[26%] md:top-[9%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80" />
        <div className="absolute inset-y-0 right-0 hidden w-px bg-gradient-to-b from-transparent via-line to-transparent lg:block" />
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: reduceMotion ? 'none' : spotlight, opacity: reduceMotion ? 0 : 0.6 }}
      />

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
              <Sparkles size={12} className="text-accent" /> AI Systems Engineer
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
              I build resilient AI systems with a security mindset. From retrieval pipelines to production-grade
              backends, I ship research into reliable products with observable, measurable impact.
            </p>
            <div className="flex flex-wrap gap-3 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
              <span className="rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2">RAG + MLOps</span>
              <span className="rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2">Production AI</span>
              <span className="rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2">Secure Systems</span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-5">
            <ButtonGlitch href="#work" primary>
              View Selected Work
            </ButtonGlitch>
            <ButtonGlitch href={SOCIALS.resume}>Download Resume</ButtonGlitch>
          </motion.div>
        </div>

        <motion.div variants={fadeInUp} style={{ y: reduceMotion ? 0 : y, opacity: reduceMotion ? 1 : opacity }} className="grid gap-6">
          <div className="rounded-[28px] border border-white/10 bg-bg-elev-1/70 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500 hover:border-accent/40">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
              <span>Operational Focus</span>
              <span className="text-text-strong">2025 Focus</span>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-text">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-bg/60 px-4 py-3 backdrop-blur-sm transition-colors hover:border-accent/40">
                <Cpu size={16} className="mt-1 text-accent" />
                <div>
                  <div className="text-text-strong">AI infrastructure</div>
                  <div className="text-xs text-text-muted">RAG, evals, observability</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-bg/60 px-4 py-3 backdrop-blur-sm transition-colors hover:border-accent/40">
                <Shield size={16} className="mt-1 text-accent-2" />
                <div>
                  <div className="text-text-strong">Secure systems</div>
                  <div className="text-xs text-text-muted">Threat-aware architecture</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-bg/60 px-4 py-3 backdrop-blur-sm transition-colors hover:border-accent/40">
                <Sparkles size={16} className="mt-1 text-accent-3" />
                <div>
                  <div className="text-text-strong">Product delivery</div>
                  <div className="text-xs text-text-muted">Fast iteration, stable release</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-bg-elev-2/70 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur transition-all duration-500 hover:border-accent/40">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted">
              <span>Current Signal</span>
              <span className="text-text-strong">Remote / Hybrid</span>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-bg/60 px-4 py-4 text-sm text-text backdrop-blur-sm transition-colors hover:border-accent/40">
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

const ButtonGlitch = ({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
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
