import React, {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from 'framer-motion';
import { ArrowRight, Briefcase, Download, Layers, Mail, Menu, User, X } from 'lucide-react';
import { SOCIALS } from '../constants';
import { DURATION, EASE_OUT } from '../utils/motion';
import { ProgressiveBlur } from './ProgressiveBlur';

// --- Configuration ---
const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;
const DEFAULT_BASE_SIZE = 75;
const SCROLL_SHOW_DOCK = 160;
const SCROLL_HIDE_DOCK = 80;

// 60FPS Pro Physics: Low mass, high stiffness for instant response
const ULTRA_SMOOTH_SPRING: SpringOptions = {
  mass: 0.1,
  stiffness: 210,
  damping: 20,
};

const cn = (...classes: Array<string | undefined | false | null>) =>
  classes.filter(Boolean).join(' ');

// --- Types ---
type DockContextType = {
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};

const DockContext = createContext<DockContextType | undefined>(undefined);

const useDock = () => {
  const context = useContext(DockContext);
  if (!context) throw new Error('useDock must be used within a DockProvider');
  return context;
};

// --- Components ---

function Dock({
  children,
  className,
  spring = ULTRA_SMOOTH_SPRING,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: any) {
  const mouseX = useMotionValue<number>(Infinity);
  const isHovered = useMotionValue(0);

  // Height transition optimized for GPU
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, Math.max(DOCK_HEIGHT, magnification + 30)]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height, transform: 'translateZ(0)' }} // GPU Layer trigger
      className="mx-2 flex max-w-full items-end overflow-hidden no-scrollbar will-change-[height]"
    >
      <motion.div
        onMouseMove={(e) => {
          isHovered.set(1);
          mouseX.set(e.pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={cn(
          'relative mx-auto flex w-fit items-end gap-4 rounded-[28px] border border-white/10 bg-bg-elev-1/70 px-3 py-2 shadow-card shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur-xl',
          className
        )}
        style={{ height: panelHeight }}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] opacity-50 blur-2xl"
             style={{
               background:
                 'radial-gradient(120% 120% at 15% 0%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 65%), radial-gradient(120% 140% at 85% 120%, color-mix(in srgb, var(--accent-3) 30%, transparent), transparent 70%)',
             }} />
        <div className="pointer-events-none absolute inset-0 rounded-[28px]">
          <ProgressiveBlur
            className="h-full w-full rounded-[28px]"
            direction="bottom"
            blurLayers={10}
            blurIntensity={2.6}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-bg-elev-1/70" />
        
        <DockContext.Provider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockContext.Provider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className, href, target, rel, download, ariaLabel, onClick }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseX, spring } = useDock();
  const isHoveredLocal = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - rect.x - rect.width / 2;
  });

  // FPS Tweak: We animate 'flex-basis' instead of 'width' for smoother sibling shifting
  const sizeTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [DEFAULT_BASE_SIZE, magnification, DEFAULT_BASE_SIZE]
  );

  const size = useSpring(sizeTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, transform: 'translateZ(0)' }}
      onHoverStart={() => isHoveredLocal.set(1)}
      onHoverEnd={() => isHoveredLocal.set(0)}
      className="group relative flex h-full items-center justify-center will-change-[width]"
    >
      <motion.div 
        className="flex h-full w-full items-center justify-center"
        whileTap={{ scale: 0.9 }}
      >
        {href ? (
          <a
            href={href}
            target={target}
            rel={rel}
            download={download}
            aria-label={ariaLabel}
            className="relative flex h-full w-full items-center justify-center rounded-2xl focus:outline-none"
          >
            {Children.map(children, (child) => cloneElement(child as React.ReactElement, { size, isHoveredLocal }))}
          </a>
        ) : (
          <button onClick={onClick} className="relative flex h-full w-full items-center justify-center rounded-2xl focus:outline-none">
            {Children.map(children, (child) => cloneElement(child as React.ReactElement, { size, isHoveredLocal }))}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function DockLabel({ children, className, isHoveredLocal }: any) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return isHoveredLocal.on('change', (v: number) => setIsVisible(v === 1));
  }, [isHoveredLocal]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0, x: "-50%", scale: 0.8 }}
          animate={{ opacity: 1, y: -14, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: 0, x: "-50%", scale: 0.8 }}
          className={cn(
            'absolute -top-9 left-1/2 w-fit whitespace-pre rounded-full border border-white/10 bg-bg-elev-2/90 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong shadow-[0_10px_32px_rgba(0,0,0,0.45)] backdrop-blur-md',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, size }: any) {
  // Use scale for the internal icon to keep it crisp without layout recalculation
  const iconSize = useTransform(size, (s: number) => s / 1.8);

  return (
    <motion.div
      style={{ width: iconSize, height: iconSize, transform: 'translateZ(0)' }}
      className={cn('flex items-center justify-center will-change-transform', className)}
    >
      {children}
    </motion.div>
  );
}

// --- Stylings (Original Borders Kept) ---
const BASE_ICON = 'aspect-square rounded-2xl border border-white/10 bg-bg/60 p-2 text-text-muted transition-all duration-200 group-hover:border-accent/60 group-hover:bg-accent/10 group-hover:text-accent group-hover:shadow-glow';
const SPECIAL_ICON = 'border-line-strong/70 bg-bg-elev-2/80 text-text-strong';
const ACCENT_ICON = 'border-accent/60 bg-accent/20 text-accent shadow-glow';

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { scrollY } = useScroll();
  const items = [
    { label: "Home", icon: "IA", href: "#", special: true },
    { label: "About", icon: <User size="100%" />, href: "#about" },
    { label: "Work", icon: <Briefcase size="100%" />, href: "#work" },
    { label: "Stack", icon: <Layers size="100%" />, href: "#skills" },
    { label: "Contact", icon: <Mail size="100%" />, href: "#contact" },
    { label: "Resume", icon: <Download size="100%" />, href: SOCIALS.resume, accent: true, target: "_blank", rel: "noopener noreferrer" },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  const shouldShowDock = isDockVisible && isDesktop;

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsDockVisible((prev) => {
      if (!prev && latest > SCROLL_SHOW_DOCK) return true;
      if (prev && latest < SCROLL_HIDE_DOCK) return false;
      return prev;
    });
  });

  useEffect(() => {
    if (shouldShowDock && isOpen) setIsOpen(false);
  }, [shouldShowDock, isOpen]);

  return (
    <>
      <AnimatePresence>
        {!shouldShowDock && (
          <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: DURATION.md, ease: EASE_OUT }}
            className="fixed top-0 left-0 z-40 w-full border-b border-line/70 bg-bg/70 backdrop-blur-xl"
          >
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-12">
              <a
                href="#"
                className="group flex items-center gap-4 rounded-full px-2 py-1 font-mono text-xs uppercase tracking-widest text-text-strong transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-line-strong/70 bg-bg-elev-1/90 text-[10px] font-semibold tracking-[0.3em] text-text-strong transition-all group-hover:border-accent/60 group-hover:text-accent">
                  <img
                    src="/profile.jpg"
                    alt="Ismail Ammar"
                    className="h-full w-full rounded-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-text-strong">Ismail Ammar</span>
                  <span className="text-[10px] text-text-muted">Security + Full-Stack Systems</span>
                </span>
              </a>

              <div className="hidden items-center gap-10 font-mono text-[11px] uppercase tracking-widest text-text-muted md:flex">
                <a href="#about" className="rounded-full px-2 py-1 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg">About</a>
                <a href="#work" className="rounded-full px-2 py-1 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg">Work</a>
                <a href="#skills" className="rounded-full px-2 py-1 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg">Stack</a>
                <a href="#contact" className="rounded-full px-2 py-1 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg">Contact</a>
                <a
                  href={SOCIALS.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong/70 bg-bg-elev-1/80 px-4 py-2 text-text-strong transition-all hover:border-accent/60 hover:text-accent hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  Resume <ArrowRight size={14} />
                </a>
              </div>

              <button
                className="rounded-full p-2 text-text-strong hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: DURATION.sm, ease: EASE_OUT }}
                  className="border-t border-line/70 bg-bg-elev-1/90 backdrop-blur-xl md:hidden"
                >
                  <div className="grid gap-5 px-6 py-6 font-mono text-xs uppercase tracking-widest text-text-muted">
                    <a href="#about" className="rounded-full px-3 py-2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg" onClick={() => setIsOpen(false)}>About</a>
                    <a href="#work" className="rounded-full px-3 py-2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg" onClick={() => setIsOpen(false)}>Work</a>
                    <a href="#skills" className="rounded-full px-3 py-2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg" onClick={() => setIsOpen(false)}>Stack</a>
                    <a href="#contact" className="rounded-full px-3 py-2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg" onClick={() => setIsOpen(false)}>Contact</a>
                    <a
                      href={SOCIALS.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-2 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      <Download size={14} /> Download Resume
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shouldShowDock && (
          <motion.nav 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: DURATION.md, ease: EASE_OUT }}
            className="fixed bottom-6 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <Dock magnification={95} distance={180} panelHeight={72}>
                {items.map((item, i) => (
                  <DockItem key={i} href={item.href} target={item.target} rel={item.rel} download={item.download}>
                    <DockLabel>{item.label}</DockLabel>
                    <DockIcon className={cn(BASE_ICON, item.special && SPECIAL_ICON, item.accent && ACCENT_ICON)}>
                      {typeof item.icon === 'string' ? <span className="font-mono text-[10px] tracking-[0.2em]">{item.icon}</span> : item.icon}
                    </DockIcon>
                  </DockItem>
                ))}
              </Dock>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};
