import React, { createContext, useContext, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Smooth wheel scrolling only matters with a mouse or trackpad. Lenis is
// downloaded on demand for those devices; phones never load it and keep
// their native scrolling.
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

const SmoothScrollContext = createContext<Lenis | null>(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(() => window.matchMedia(FINE_POINTER).matches);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER);
    const update = () => setFinePointer(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduceMotion || !finePointer) return undefined;
    let instance: Lenis | null = null;
    let cancelled = false;

    import('lenis').then(({ default: LenisClass }) => {
      if (cancelled) return;
      instance = new LenisClass({ lerp: 0.1, smoothWheel: true, anchors: true, autoRaf: true });
      setLenis(instance);
    });

    return () => {
      cancelled = true;
      instance?.destroy();
      setLenis(null);
    };
  }, [reduceMotion, finePointer]);

  return <SmoothScrollContext.Provider value={lenis}>{children}</SmoothScrollContext.Provider>;
}
