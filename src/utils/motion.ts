import { Variants } from 'framer-motion';

// Global Motion Tokens
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]; // Precision ease
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]; // Dramatic ease

export const DURATION = {
  xxs: 0.12,
  xs: 0.18,
  sm: 0.26,
  md: 0.42,
  lg: 0.68,
};

// Reusable Variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: DURATION.md, 
      ease: EASE_OUT 
    } 
  },
  exit: { opacity: 0, y: 10 }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1
    }
  }
};

export const revealLine: Variants = {
  initial: { scaleX: 0, originX: 0, opacity: 0 },
  animate: { 
    scaleX: 1, 
    opacity: 1, 
    transition: { 
      duration: DURATION.lg, 
      ease: EASE_IN_OUT 
    } 
  }
};

export const magneticHover = {
  rest: { x: 0, y: 0 },
  hover: { 
    x: 2, 
    y: -2,
    transition: { type: 'spring', stiffness: 400, damping: 20 } 
  }
};

export const signalSweep: Variants = {
  initial: { top: '-10%', opacity: 0 },
  animate: { 
    top: '120%', 
    opacity: [0, 0.12, 0],
    transition: { 
      duration: 2.6, 
      ease: EASE_IN_OUT, 
      repeat: 0, 
      delay: 0.3 
    } 
  }
};