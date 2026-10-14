import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const PUPIL_RANGE = 3.5;
const TOOLTIP_MS = 2000;
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

// A little pair of eyes in the corner that follow the cursor around.
// Only rendered with a mouse, since there is no cursor to follow on touch.
export const CursorEyes = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER);
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return enabled ? <Eyes /> : null;
};

const Eyes = () => {
  const reduceMotion = useReducedMotion();
  const shellRef = useRef<HTMLButtonElement | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const [showTip, setShowTip] = useState(false);
  const tipTimer = useRef<number | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pupilX = useSpring(rawX, { stiffness: 400, damping: 28 });
  const pupilY = useSpring(rawY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    if (reduceMotion) return undefined;

    // The button is fixed in the corner, so its center only changes on resize.
    const measure = () => {
      const rect = shellRef.current?.getBoundingClientRect();
      if (rect) centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };
    measure();

    let frame = 0;
    let lastX = 0;
    let lastY = 0;
    const apply = () => {
      frame = 0;
      const dx = lastX - centerRef.current.x;
      const dy = lastY - centerRef.current.y;
      const distance = Math.min(PUPIL_RANGE, Math.hypot(dx, dy) / 40);
      const angle = Math.atan2(dy, dx);
      rawX.set(Math.cos(angle) * distance);
      rawY.set(Math.sin(angle) * distance);
    };
    const handleMove = (event: PointerEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('resize', measure);
    };
  }, [rawX, rawY, reduceMotion]);

  useEffect(
    () => () => {
      if (tipTimer.current) window.clearTimeout(tipTimer.current);
    },
    []
  );

  const handleClick = () => {
    setShowTip(true);
    if (tipTimer.current) window.clearTimeout(tipTimer.current);
    tipTimer.current = window.setTimeout(() => setShowTip(false), TOOLTIP_MS);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {showTip && (
          <m.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute -top-10 right-0 whitespace-nowrap rounded-full border border-white/15 bg-bg-elev-2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-strong shadow-[0_10px_32px_rgba(0,0,0,0.45)]"
          >
            Just looking around
          </m.div>
        )}
      </AnimatePresence>

      <m.button
        ref={shellRef}
        type="button"
        onClick={handleClick}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.88 }}
        aria-label="A pair of eyes that follow your cursor"
        className="glass-panel relative flex h-11 w-[4.25rem] items-center justify-center gap-2 rounded-[22px] border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
      >
        <span className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/10 to-transparent" />
        {[0, 1].map((eye) => (
          <span
            key={eye}
            className="anim-blink relative flex h-[18px] w-[18px] items-center justify-center rounded-full"
            style={{
              background: 'radial-gradient(circle at 32% 30%, var(--focus), var(--accent) 60%, #26265e 100%)',
              boxShadow: '0 0 10px rgb(99 102 241 / 0.6)',
            }}
          >
            <m.span
              style={reduceMotion ? undefined : { x: pupilX, y: pupilY }}
              className="relative h-[7px] w-[7px] rounded-full bg-[#05050a]"
            >
              <span className="absolute left-[1px] top-[1px] h-[2px] w-[2px] rounded-full bg-white/80" />
            </m.span>
          </span>
        ))}
      </m.button>
    </div>
  );
};
