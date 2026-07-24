import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const PUPIL_RANGE = 3.5;
const TOOLTIP_MS = 2000;

// A little pair of eyes in the corner that follow the cursor around.
export const CursorEyes = () => {
  const reduceMotion = useReducedMotion();
  const shellRef = useRef<HTMLButtonElement | null>(null);
  const [showTip, setShowTip] = useState(false);
  const tipTimer = useRef<number | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pupilX = useSpring(rawX, { stiffness: 400, damping: 28 });
  const pupilY = useSpring(rawY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    if (reduceMotion) return;
    let frame = 0;
    let lastEvent: PointerEvent | null = null;

    const applyPointer = () => {
      frame = 0;
      const shell = shellRef.current;
      if (!shell || !lastEvent) return;
      const rect = shell.getBoundingClientRect();
      const dx = lastEvent.clientX - (rect.left + rect.width / 2);
      const dy = lastEvent.clientY - (rect.top + rect.height / 2);
      const distance = Math.min(PUPIL_RANGE, Math.hypot(dx, dy) / 40);
      const angle = Math.atan2(dy, dx);
      rawX.set(Math.cos(angle) * distance);
      rawY.set(Math.sin(angle) * distance);
    };

    const handleMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(applyPointer);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handleMove);
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
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute -top-10 right-0 whitespace-nowrap rounded-full border border-white/15 bg-bg-elev-2/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-strong shadow-[0_10px_32px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            Just watching for now , assistant is comming soon !
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={shellRef}
        type="button"
        onClick={handleClick}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.88 }}
        aria-label="A pair of eyes that follow your cursor"
        className="relative flex h-11 w-[4.25rem] items-center justify-center gap-2 rounded-[22px] border border-white/15 bg-white/[0.06] shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl backdrop-saturate-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
      >
        <span className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/10 to-transparent" />
        {[0, 1].map((eye) => (
          <motion.span
            key={eye}
            animate={reduceMotion ? undefined : { scaleY: [1, 0.15, 1] }}
            transition={
              reduceMotion ? undefined : { duration: 0.26, repeat: Infinity, repeatDelay: 4.8 }
            }
            className="relative flex h-[18px] w-[18px] items-center justify-center rounded-full"
            style={{
              background:
                'radial-gradient(circle at 32% 30%, var(--focus), var(--accent) 60%, #26265e 100%)',
              boxShadow: '0 0 10px color-mix(in srgb, var(--accent) 60%, transparent)',
            }}
          >
            <motion.span
              style={reduceMotion ? undefined : { x: pupilX, y: pupilY }}
              className="relative h-[7px] w-[7px] rounded-full bg-[#05050a]"
            >
              <span className="absolute left-[1px] top-[1px] h-[2px] w-[2px] rounded-full bg-white/80" />
            </motion.span>
          </motion.span>
        ))}
      </motion.button>
    </div>
  );
};
