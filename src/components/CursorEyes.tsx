import React, { Suspense, lazy, useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import type { ChatMessage } from './PersonaChat';

const PersonaChat = lazy(() => import('./PersonaChat'));

const PUPIL_RANGE = 3.5;
const HINT_DELAY_MS = 2600;
const HINT_VISIBLE_MS = 4200;
const HINT_SEEN_KEY = 'chat-hint-seen';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const UNAVAILABLE = "I couldn't answer that just now. Email me and I'll reply within a day.";
const GREETING: ChatMessage = {
  id: 0,
  from: 'ismail',
  text: "Hi, I'm Ismail. Ask me about my projects, my experience or my security work.",
};

export const CursorEyes = () => {
  const reduceMotion = useReducedMotion();
  const panelId = useId();
  const shellRef = useRef<HTMLButtonElement | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const nextIdRef = useRef(1);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pupilX = useSpring(rawX, { stiffness: 400, damping: 28 });
  const pupilY = useSpring(rawY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    if (reduceMotion || !window.matchMedia(FINE_POINTER).matches) return undefined;

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

  useEffect(() => {
    if (sessionStorage.getItem(HINT_SEEN_KEY)) return undefined;
    const show = window.setTimeout(() => {
      setNudge(true);
      sessionStorage.setItem(HINT_SEEN_KEY, '1');
    }, HINT_DELAY_MS);
    const hide = window.setTimeout(() => setNudge(false), HINT_DELAY_MS + HINT_VISIBLE_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    shellRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const addMessage = useCallback((from: ChatMessage['from'], text: string) => {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    setMessages((previous) => [...previous, { id, from, text }]);
  }, []);

  const askQuestion = useCallback(
    async (question: string) => {
      addMessage('visitor', question);
      setPending(true);
      try {
        const { ask } = await import('../persona/engine');
        addMessage('ismail', await ask(question));
      } catch {
        addMessage('ismail', UNAVAILABLE);
      } finally {
        setPending(false);
      }
    },
    [addMessage],
  );

  const toggle = () => {
    setNudge(false);
    setOpen((value) => !value);
  };

  const showHint = !open && (hovered || nudge);

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      <AnimatePresence>
        {open && (
          <Suspense fallback={null}>
            <PersonaChat id={panelId} messages={messages} pending={pending} onAsk={askQuestion} onClose={close} />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHint && (
          <m.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="pointer-events-none absolute -top-10 right-0 whitespace-nowrap rounded-full border border-white/15 bg-bg-elev-2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-strong shadow-[0_10px_32px_rgba(0,0,0,0.45)]"
          >
            Ask me about my work
          </m.div>
        )}
      </AnimatePresence>

      <m.button
        ref={shellRef}
        type="button"
        onClick={toggle}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.88 }}
        aria-label={open ? 'Close chat' : 'Chat with me'}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className={`glass-panel relative flex h-11 w-[4.25rem] items-center justify-center gap-2 rounded-[22px] border shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 ${
          open ? 'border-accent/60' : 'border-white/15'
        }`}
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
