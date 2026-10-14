import React, { useEffect, useRef } from 'react';
import { useSmoothScroll } from './components/SmoothScroll';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { GlobalBackdrop } from './components/GlobalBackdrop';
import { ViewportBlur } from './components/ViewportBlur';
import { CursorEyes } from './components/CursorEyes';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Work } from './sections/Work';
import { HTBWriteups } from './sections/HTBWriteups';
import { Experience } from './sections/Experience';
import { Contact } from './sections/Contact';

// Moves the border glow of whichever .glow-card is under the mouse. One
// listener for the whole page, one style write per frame, and only on the
// hovered card, so nothing else gets restyled.
const useGlowPointer = () => {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let frame = 0;
    let card: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--glow-x', `${(x - rect.left).toFixed(1)}px`);
      card.style.setProperty('--glow-y', `${(y - rect.top).toFixed(1)}px`);
    };

    const onMove = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest?.('.glow-card') as HTMLElement | null;
      card = target;
      if (!target) return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
};

const App = () => {
  const lenis = useSmoothScroll();
  const hasRestoredRef = useRef(false);

  useGlowPointer();

  // On reload / back-forward, snap to the start of the section the visitor was
  // reading instead of a half-scrolled position.
  useEffect(() => {
    const getSections = () => Array.from(document.querySelectorAll<HTMLElement>('main section'));

    const getCurrentSectionIndex = (sections: HTMLElement[]) => {
      let currentIndex = 0;
      for (let i = 0; i < sections.length; i += 1) {
        if (sections[i].getBoundingClientRect().top <= 1) {
          currentIndex = i;
        } else {
          break;
        }
      }
      return currentIndex;
    };

    const storeCurrentSection = () => {
      const sections = getSections();
      if (!sections.length) return;
      sessionStorage.setItem('current-section-index', String(getCurrentSectionIndex(sections)));
    };

    const restoreToSectionStart = () => {
      if (hasRestoredRef.current) return;
      const sections = getSections();
      if (!sections.length) return;

      let target: HTMLElement | null = null;
      const hash = window.location.hash;
      if (hash.length > 1) {
        target = document.getElementById(decodeURIComponent(hash.slice(1)));
      }
      if (!target) {
        const savedIndex = Number.parseInt(sessionStorage.getItem('current-section-index') ?? '', 10);
        if (!Number.isNaN(savedIndex)) target = sections[savedIndex] ?? null;
      }

      hasRestoredRef.current = true;
      if (!target) return;

      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      if (Math.abs(targetTop - window.scrollY) < 1) return;
      if (lenis) {
        lenis.scrollTo(targetTop, { immediate: true });
      } else {
        window.scrollTo({ top: targetTop, left: 0, behavior: 'instant' });
      }
    };

    if (document.readyState === 'complete') {
      requestAnimationFrame(restoreToSectionStart);
    } else {
      window.addEventListener('load', restoreToSectionStart, { once: true });
    }

    window.addEventListener('pageshow', restoreToSectionStart);
    window.addEventListener('pagehide', storeCurrentSection);

    return () => {
      window.removeEventListener('load', restoreToSectionStart);
      window.removeEventListener('pageshow', restoreToSectionStart);
      window.removeEventListener('pagehide', storeCurrentSection);
    };
  }, [lenis]);

  return (
    <div className="relative min-h-screen w-full overflow-x-clip font-body text-text selection:bg-accent selection:text-bg">
      <GlobalBackdrop />
      <ViewportBlur />
      <NavBar />
      <CursorEyes />
      <main className="relative z-10">
        <Hero />
        <About />
        <Work />
        <Skills />
        <Experience />
        <HTBWriteups />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
