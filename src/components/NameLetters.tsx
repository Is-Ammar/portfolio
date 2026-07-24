import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Binary,
  Braces,
  Bug,
  Cpu,
  Flag,
  GitBranch,
  KeyRound,
  Network,
  Server,
  Shield,
  Terminal,
} from 'lucide-react';
import { DURATION, EASE_OUT } from '../utils/motion';

type NameLetter = { char: string; Icon: LucideIcon; tone: string };

// Every letter hides one of the tools of the trade. Hover to find them,
// or wait: the name reveals one on its own every few seconds.
const FIRST_NAME: NameLetter[] = [
  { char: 'I', Icon: Terminal, tone: 'text-accent' },
  { char: 'S', Icon: Shield, tone: 'text-accent-2' },
  { char: 'M', Icon: Network, tone: 'text-accent-3' },
  { char: 'A', Icon: Braces, tone: 'text-accent' },
  { char: 'I', Icon: Bug, tone: 'text-accent-2' },
  { char: 'L', Icon: Cpu, tone: 'text-accent-3' },
];

const LAST_NAME: NameLetter[] = [
  { char: 'A', Icon: Flag, tone: 'text-accent' },
  { char: 'M', Icon: Server, tone: 'text-accent-3' },
  { char: 'M', Icon: KeyRound, tone: 'text-accent-2' },
  { char: 'A', Icon: GitBranch, tone: 'text-accent' },
  { char: 'R', Icon: Binary, tone: 'text-accent-3' },
];

const AUTO_FLIP_EVERY_MS = 4000;
const AUTO_FLIP_HOLD_MS = 1500;

const letterVariants: Variants = {
  initial: { opacity: 0, y: '0.35em', scale: 0.92 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.md, ease: EASE_OUT },
  },
};

const ToggleLetter = ({
  letter,
  flipped,
  onEnter,
  onLeave,
}: {
  letter: NameLetter;
  flipped: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) => (
  <motion.span
    variants={letterVariants}
    className="relative inline-block cursor-default"
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
  >
    <motion.span
      className="inline-block"
      animate={flipped ? { opacity: 0, scale: 0.4, rotate: -8 } : { opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: DURATION.xs, ease: EASE_OUT }}
    >
      {letter.char}
    </motion.span>
    <motion.span
      className="absolute inset-0 flex items-center justify-center"
      initial={false}
      animate={flipped ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.3, rotate: 45 }}
      transition={{ type: 'spring', stiffness: 320, damping: 17 }}
    >
      <letter.Icon strokeWidth={1.75} className={`h-[0.62em] w-[0.62em] ${letter.tone}`} />
    </motion.span>
  </motion.span>
);

const H1_CLASS =
  'text-[clamp(3.5rem,9vw,9rem)] font-display font-semibold leading-[0.88] tracking-tight text-text-strong';

export const NameLetters = () => {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [autoFlip, setAutoFlip] = useState<string | null>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const total = FIRST_NAME.length + LAST_NAME.length;
    let holdTimer: number | undefined;

    const interval = window.setInterval(() => {
      const index = Math.floor(Math.random() * total);
      const key = index < FIRST_NAME.length ? `f-${index}` : `l-${index - FIRST_NAME.length}`;
      setAutoFlip(key);
      holdTimer = window.setTimeout(() => setAutoFlip(null), AUTO_FLIP_HOLD_MS);
    }, AUTO_FLIP_EVERY_MS);

    return () => {
      window.clearInterval(interval);
      if (holdTimer) window.clearTimeout(holdTimer);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <h1 className={H1_CLASS}>
        ISMAIL <br />
        <span className="text-text-muted">AMMAR</span>
      </h1>
    );
  }

  const renderRow = (letters: NameLetter[], prefix: string) =>
    letters.map((letter, index) => {
      const key = `${prefix}-${index}`;
      return (
        <ToggleLetter
          key={key}
          letter={letter}
          flipped={hovered === key || autoFlip === key}
          onEnter={() => setHovered(key)}
          onLeave={() => setHovered(null)}
        />
      );
    });

  return (
    <motion.h1
      aria-label="Ismail Ammar"
      variants={{ animate: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
      className={H1_CLASS}
    >
      <span aria-hidden="true" className="block">
        {renderRow(FIRST_NAME, 'f')}
      </span>
      <span aria-hidden="true" className="block text-text-muted">
        {renderRow(LAST_NAME, 'l')}
      </span>
    </motion.h1>
  );
};
