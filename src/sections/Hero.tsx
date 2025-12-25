import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate, useReducedMotion } from 'framer-motion';
import { ArrowRight, Terminal, Activity, Cpu, Wifi } from 'lucide-react';
import { SOCIALS } from '../constants';
import { DURATION, fadeInUp, staggerContainer } from '../utils/motion';

// --- 1. UTILITY: Scramble/Decryption Text Effect ---
const ScrambleText = ({ text, className }: { text: string, className?: string }) => {
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

export const Hero = () => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  
  // --- 2. LOGIC: Mouse Spotlight & Parallax ---
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const parallaxY = reduceMotion ? 0 : y;
  const parallaxOpacity = reduceMotion ? 1 : opacity;
  
  // Mouse coordinates for spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (reduceMotion) return;
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlight = useMotionTemplate`
    radial-gradient(
      650px circle at ${mouseX}px ${mouseY}px,
      color-mix(in srgb, var(--accent) 18%, transparent),
      transparent 80%
    )
  `;

  return (
    <section 
      ref={ref} 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-36 pb-24 px-6 flex flex-col justify-center max-w-[1200px] mx-auto border-x border-line/20 overflow-hidden group"
    >
      {/* --- 3. BACKGROUND: Dynamic Grid & Spotlight --- */}
      
      {/* The Grid Pattern (SVG) */}
      <div className="absolute inset-0 z-[-1] opacity-15 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--text-muted) 1px, transparent 0)', backgroundSize: '48px 48px' }}>
      </div>

      {/* The Spotlight (Reveals content/grid around mouse) */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: reduceMotion ? 'none' : spotlight,
        }}
      />

      {/* --- 4. DECOR: Rotating Radar & Data Lines --- */}
      <motion.div style={{ y: parallaxY, opacity: parallaxOpacity }} className="absolute top-10 right-0 lg:right-6 pointer-events-none hidden lg:block z-0 opacity-80">
        <div className="relative w-96 h-96">
            {/* Spinning Rings */}
            <motion.div 
                animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-line/25 rounded-full border-dashed"
            />
            <motion.div 
                animate={reduceMotion ? { rotate: 0 } : { rotate: -360 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-line/15 rounded-full"
            />
             {/* The "Scanner" */}
            <motion.div 
                animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-accent/25 w-full h-full"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 50% 50%)' }}
            />
            {/* Central Core */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-accent/10 backdrop-blur-sm border border-accent/30 rounded-full flex items-center justify-center shadow-glow">
                    <Cpu className="text-accent animate-pulse motion-reduce:animate-none" size={32} />
                </div>
            </div>
        </div>
      </motion.div>

      {/* --- 5. CONTENT: Main Hero Data --- */}
      <motion.div 
        variants={staggerContainer}
        initial={reduceMotion ? false : "initial"}
        animate="animate"
        className="relative z-10 max-w-5xl"
      >
        {/* Status Line */}
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mb-10 text-xs sm:text-sm font-mono uppercase tracking-wider text-text-muted">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong/70 bg-bg-elev-1/60 px-4 py-2 text-text-strong">
            <span className="h-2 w-2 rounded-full bg-accent shadow-glow" />
            Open for select engagements
          </span>
          <span className="h-px w-10 bg-line/70"></span>
          <span className="flex items-center gap-2">
            <Wifi size={12} className="text-accent" /> AI Systems Engineer
          </span>
        </motion.div>

        {/* The Name (Decryption Effect) */}
        <motion.div variants={fadeInUp} className="overflow-hidden">
          <h1 className="text-[clamp(3rem,8vw,7.5rem)] font-display font-black leading-[0.92] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-text-strong via-text to-text-muted mb-6">
            <ScrambleText text="ISMAIL" /> <br />
            <span className="text-line-strong opacity-60"><ScrambleText text="AMMAR" /></span>
          </h1>
        </motion.div>

        {/* The Pitch */}
        <motion.div variants={fadeInUp} className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-end mb-14">
          <div className="space-y-6">
            <div className="max-w-xl border-l-2 border-accent/50 pl-6 relative">
              <motion.div 
                initial={{ height: 0 }} 
                animate={{ height: "100%" }} 
                transition={{ duration: 1, delay: 1 }}
                className="absolute left-[-2px] top-0 w-[2px] bg-accent" 
              />
              <p className="text-xl md:text-2xl text-text font-light leading-relaxed">
                I design and ship <span className="text-text-strong font-medium relative inline-block">
                  AI systems
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent opacity-40"></span>
                </span> that scale. From RAG pipelines to resilient backends, I turn research into reliable products.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs sm:text-sm font-mono uppercase tracking-wider text-text-muted">
              <span className="rounded-full border border-line/70 bg-bg-elev-1/60 px-4 py-2">RAG + MLOps</span>
              <span className="rounded-full border border-line/70 bg-bg-elev-1/60 px-4 py-2">Production AI</span>
              <span className="rounded-full border border-line/70 bg-bg-elev-1/60 px-4 py-2">Secure Systems</span>
            </div>
          </div>
          
          {/* Stats / Focus Grid */}
          <div className="grid grid-cols-2 gap-4 font-mono text-xs sm:text-sm uppercase tracking-wider text-text-muted">
            <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-bg-elev-1/60 px-4 py-4">
              <Activity className="text-accent" size={16} />
              <span>MLOps + LLMs</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-bg-elev-1/60 px-4 py-4">
              <Terminal className="text-accent" size={16} />
              <span>Full-Stack Eng</span>
            </div>
            <div className="col-span-2 flex items-center justify-between rounded-xl border border-line/70 bg-bg-elev-1/60 px-4 py-4 text-xs">
              <span className="text-text-muted">Based in Morocco</span>
              <span className="text-text-strong">Remote / Hybrid</span>
            </div>
          </div>
        </motion.div>

        {/* --- 6. ACTIONS: Magnetic & Glitch Buttons --- */}
        <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
          <ButtonGlitch href="#work" primary>
            View Selected Work
          </ButtonGlitch>
          
          <ButtonGlitch href={SOCIALS.resume}>
            Download Resume
          </ButtonGlitch>
        </motion.div>
      </motion.div>

      {/* Footer Decor */}
      <motion.div 
        initial={{ opacity: reduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 1.5, duration: reduceMotion ? 0 : DURATION.lg }}
        className="absolute bottom-10 left-6 right-6 flex flex-wrap justify-between items-end gap-6 border-t border-line/30 pt-6"
      >
         <div className="font-mono text-xs text-text-muted uppercase tracking-wider flex items-center gap-4">
            <span>Scroll to explore</span>
            <span className="h-px w-10 bg-line/70"></span>
            <span>Selected work + impact</span>
         </div>
         <div className="font-mono text-xs text-text-muted uppercase tracking-wider">Based in Morocco</div>
      </motion.div>
    </section>
  );
};

// --- Sub-Component: Glitch/Magnetic Button ---
const ButtonGlitch = ({ children, href, primary = false }: { children: React.ReactNode, href: string, primary?: boolean }) => {
    const reduceMotion = useReducedMotion();

    return (
        <motion.a 
            href={href}
            className={`relative inline-flex items-center gap-3 rounded-full border px-6 py-3 font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider overflow-hidden group transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                primary
                  ? 'bg-accent text-bg border-accent shadow-glow hover:shadow-glow'
                  : 'bg-bg-elev-1/60 text-text border-line-strong/70 hover:border-accent/60 hover:text-text-strong'
            }`}
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
            <div className="relative z-10 flex items-center gap-2">
                {children} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
            
            {/* Subtle sheen */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-text-strong/40">
              <div className="absolute -inset-8 bg-[radial-gradient(circle_at_30%_20%,_currentColor_0%,_transparent_45%)]" />
            </div>
        </motion.a>
    );
};
