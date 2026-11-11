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
  m,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from 'framer-motion';
import { ArrowRight, Briefcase, Download, FileText, FolderGit2, Layers, Mail, Menu, User, X } from 'lucide-react';
import { SOCIALS } from '../constants';
import { DURATION, EASE_OUT } from '../utils/motion';

const DEFAULT_MAGNIFICATION = 92;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;
const DEFAULT_BASE_SIZE = 50;
const SCROLL_SHOW_DOCK = 160;
const SCROLL_HIDE_DOCK = 80;

const DOCK_SPRING: SpringOptions = {
  mass: 0.1,
  stiffness: 200,
  damping: 16,
};

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#work' },
  { label: 'Stack', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Writeups', href: '#writeups' },
  { label: 'Contact', href: '#contact' },
];

const cn = (...classes: Array<string | undefined | false | null>) => classes.filter(Boolean).join(' ');

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

// A macOS-style dock: a fixed-height glass slab, with icons that magnify
// around the cursor and grow upward past the top edge.
function Dock({
  children,
  className,
  spring = DOCK_SPRING,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: any) {
  const mouseX = useMotionValue<number>(Infinity);

  return (
    <m.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      style={{ height: panelHeight }}
      className={cn(
        'glass-panel relative mx-auto flex w-fit items-end gap-2 rounded-[26px] border border-white/15 px-2.5 pb-[7px] shadow-[0_24px_60px_rgba(0,0,0,0.55)]',
        className
      )}
    >
      {/* glass shine: soft top-lit sheen and a bright hairline on the upper edge */}
      <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-b from-white/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[34px] opacity-50"
        style={{
          background:
            'radial-gradient(70% 90% at 15% 20%, rgb(99 102 241 / 0.25), transparent 70%), radial-gradient(70% 90% at 85% 90%, rgb(34 211 238 / 0.18), transparent 70%)',
        }}
      />

      <DockContext.Provider value={{ mouseX, spring, distance, magnification }}>{children}</DockContext.Provider>
    </m.div>
  );
}

function DockItem({ children, href, target, rel, download, ariaLabel }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseX, spring } = useDock();
  const isHoveredLocal = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val: number) => {
    if (!Number.isFinite(val)) return distance;
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - rect.x - rect.width / 2;
  });

  // macOS-style cosine falloff: full magnification under the cursor,
  // easing smoothly back to base size at the edge of the range.
  const sizeTransform = useTransform(mouseDistance, (d: number) => {
    const clamped = Math.min(Math.abs(d), distance);
    const falloff = (1 + Math.cos((Math.PI * clamped) / distance)) / 2;
    return DEFAULT_BASE_SIZE + (magnification - DEFAULT_BASE_SIZE) * falloff;
  });

  const size = useSpring(sizeTransform, spring);

  return (
    <m.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHoveredLocal.set(1)}
      onHoverEnd={() => isHoveredLocal.set(0)}
      className="group relative flex shrink-0 items-end justify-center"
    >
      <m.div className="flex h-full w-full items-end justify-center" whileTap={{ scale: 0.92 }}>
        <a
          href={href}
          target={target}
          rel={rel}
          download={download}
          aria-label={ariaLabel}
          className="relative flex h-full w-full items-center justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
        >
          {Children.map(children, (child) =>
            cloneElement(child as React.ReactElement<any>, { size, isHoveredLocal })
          )}
        </a>
      </m.div>
    </m.div>
  );
}

function DockLabel({ children, className, isHoveredLocal }: any) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => isHoveredLocal.on('change', (v: number) => setIsVisible(v === 1)), [isHoveredLocal]);

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: 0, x: '-50%', scale: 0.8 }}
          animate={{ opacity: 1, y: -14, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: 0, x: '-50%', scale: 0.8 }}
          className={cn(
            'absolute -top-9 left-1/2 w-fit whitespace-pre rounded-full border border-white/10 bg-bg-elev-2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-strong shadow-[0_10px_32px_rgba(0,0,0,0.45)]',
            className
          )}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, size }: any) {
  const radius = useTransform(size, (s: number) => s * 0.28);
  const fontSize = useTransform(size, (s: number) => s * 0.2);

  return (
    <m.div
      style={{ width: '100%', height: '100%', borderRadius: radius, fontSize }}
      className={cn('flex items-center justify-center overflow-hidden', className)}
    >
      {children}
    </m.div>
  );
}

const BASE_ICON =
  'border border-white/10 bg-bg/60 p-[24%] text-text-muted transition-colors duration-200 group-hover:border-accent/60 group-hover:bg-accent/10 group-hover:text-accent group-hover:shadow-glow';
const SPECIAL_ICON = 'border-line-strong/70 bg-bg-elev-2/80 text-text-strong';
const ACCENT_ICON = 'border-accent/60 bg-accent/20 text-accent shadow-glow';

const DOCK_ITEMS: Array<{
  label: string;
  icon: React.ReactNode;
  href: string;
  special?: boolean;
  accent?: boolean;
  target?: string;
  rel?: string;
}> = [
  { label: 'Home', icon: 'IA', href: '#', special: true },
  { label: 'About', icon: <User size="100%" />, href: '#about' },
  { label: 'Projects', icon: <FolderGit2 size="100%" />, href: '#work' },
  { label: 'Stack', icon: <Layers size="100%" />, href: '#skills' },
  { label: 'Experience', icon: <Briefcase size="100%" />, href: '#experience' },
  { label: 'Writeups', icon: <FileText size="100%" />, href: '#writeups' },
  { label: 'Contact', icon: <Mail size="100%" />, href: '#contact' },
  { label: 'Resume', icon: <Download size="100%" />, href: SOCIALS.resume, accent: true, target: '_blank', rel: 'noopener noreferrer' },
];

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
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

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {!shouldShowDock && (
          <m.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: DURATION.md, ease: EASE_OUT }}
            aria-label="Main"
            className="glass fixed left-0 top-0 z-40 w-full border-b border-line/70"
          >
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-12">
              <a
                href="#"
                className="group flex min-w-0 items-center gap-4 rounded-full px-2 py-1 font-mono text-xs uppercase tracking-widest text-text-strong transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-strong/70 bg-bg-elev-1 transition-colors group-hover:border-accent/60">
                  <img
                    src="/avatar.webp"
                    alt="Ismail Ammar"
                    width={40}
                    height={40}
                    decoding="async"
                    className="h-full w-full rounded-full object-cover"
                  />
                </span>
                <span className="flex min-w-0 flex-col whitespace-nowrap">
                  <span className="text-xs text-text-strong">Ismail Ammar</span>
                  <span className="text-[10px] text-text-muted">AI Engineer</span>
                </span>
              </a>

              <div className="hidden items-center gap-7 font-mono text-[11px] uppercase tracking-widest text-text-muted lg:flex xl:gap-10">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-2 py-1 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={SOCIALS.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong/70 bg-bg-elev-1/80 px-4 py-2 text-text-strong transition-colors hover:border-accent/60 hover:text-accent hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  Resume <ArrowRight size={14} />
                </a>
              </div>

              <button
                type="button"
                className="rounded-full p-2 text-text-strong hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg lg:hidden"
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
              >
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>

            <AnimatePresence>
              {isOpen && (
                <m.div
                  id="mobile-nav"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: DURATION.sm, ease: EASE_OUT }}
                  className="border-t border-line/70 bg-bg-elev-1 lg:hidden"
                >
                  <div className="grid gap-2 px-5 py-5 font-mono text-xs uppercase tracking-widest text-text-muted sm:px-6">
                    {NAV_LINKS.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="rounded-full px-3 py-2.5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </a>
                    ))}
                    <a
                      href={SOCIALS.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 px-4 py-2 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
                    >
                      <Download size={14} /> Download Resume
                    </a>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shouldShowDock && (
          <m.nav
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: DURATION.md, ease: EASE_OUT }}
            aria-label="Quick navigation"
            className="pointer-events-none fixed bottom-6 left-0 right-0 z-[60] flex justify-center px-4"
          >
            <div className="pointer-events-auto">
              <Dock>
                {DOCK_ITEMS.map((item) => (
                  <DockItem key={item.label} href={item.href} target={item.target} rel={item.rel} ariaLabel={item.label}>
                    <DockLabel>{item.label}</DockLabel>
                    <DockIcon className={cn(BASE_ICON, item.special && SPECIAL_ICON, item.accent && ACCENT_ICON)}>
                      {typeof item.icon === 'string' ? (
                        <span className="font-mono text-[1em] tracking-[0.2em]">{item.icon}</span>
                      ) : (
                        item.icon
                      )}
                    </DockIcon>
                  </DockItem>
                ))}
              </Dock>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </>
  );
};
