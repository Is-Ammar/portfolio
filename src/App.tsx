import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { SkillProficiency } from './sections/SkillProficiency';
import { Work } from './sections/Work';
import { HTBWriteups } from './sections/HTBWriteups';
import { Experience } from './sections/Experience';
import { Contact } from './sections/Contact';
import { ViewportBlur } from './components/ViewportBlur';
import { GlobalBackdrop } from './components/GlobalBackdrop';
import { CursorEyes } from './components/CursorEyes';

const App = () => {
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [prefersReducedMotion]);

  // On reload / back-forward, snap to the start of the section the visitor was
  // reading instead of a half-scrolled position.
  useEffect(() => {
    const getSections = () => Array.from(document.querySelectorAll<HTMLElement>('main section'));

    const getSectionTop = (section: HTMLElement) => section.getBoundingClientRect().top + window.scrollY;

    const getCurrentSectionIndex = (sections: HTMLElement[], scrollTop: number) => {
      let currentIndex = 0;
      for (let i = 0; i < sections.length; i += 1) {
        const sectionTop = sections[i].getBoundingClientRect().top + scrollTop;
        if (sectionTop <= scrollTop + 1) {
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
      const scrollTop = window.scrollY || window.pageYOffset;
      const index = getCurrentSectionIndex(sections, scrollTop);
      sessionStorage.setItem('current-section-index', String(index));
    };

    const restoreToSectionStart = () => {
      if (hasRestoredRef.current) return;
      const sections = getSections();
      if (!sections.length) return;

      let target: HTMLElement | null = null;
      const hash = window.location.hash;

      if (hash) {
        const id = decodeURIComponent(hash.slice(1));
        if (id) {
          target = document.getElementById(id);
        }
      }

      if (!target) {
        const savedIndex = sessionStorage.getItem('current-section-index');
        if (savedIndex !== null) {
          const index = Number.parseInt(savedIndex, 10);
          if (!Number.isNaN(index)) {
            target = sections[index] || null;
          }
        }
      }

      if (!target) {
        const scrollTop = window.scrollY || window.pageYOffset;
        const index = getCurrentSectionIndex(sections, scrollTop);
        target = sections[index];
      }

      if (!target) return;

      const currentScroll = window.scrollY || window.pageYOffset;
      const targetTop = getSectionTop(target);

      hasRestoredRef.current = true;
      if (Math.abs(targetTop - currentScroll) < 1) return;

      const root = document.documentElement;
      const finalBehavior = prefersReducedMotion ? 'auto' : 'smooth';
      const previousBehavior = root.style.scrollBehavior;

      root.style.scrollBehavior = 'auto';
      if (lenis) {
        lenis.scrollTo(targetTop, { immediate: true });
      } else {
        window.scrollTo({ top: targetTop, left: 0, behavior: 'auto' });
      }
      root.style.scrollBehavior = previousBehavior || finalBehavior;
    };

    const scheduleRestore = () => {
      restoreToSectionStart();
    };

    if (document.readyState === 'complete') {
      requestAnimationFrame(scheduleRestore);
    } else {
      window.addEventListener('load', scheduleRestore, { once: true });
    }

    window.addEventListener('pageshow', scheduleRestore);
    window.addEventListener('pagehide', storeCurrentSection);
    window.addEventListener('beforeunload', storeCurrentSection);

    return () => {
      window.removeEventListener('load', scheduleRestore);
      window.removeEventListener('pageshow', scheduleRestore);
      window.removeEventListener('pagehide', storeCurrentSection);
      window.removeEventListener('beforeunload', storeCurrentSection);
    };
  }, [lenis, prefersReducedMotion]);

  // Feed the pointer position to the .glow-card CSS, throttled to one
  // style write per frame.
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let lastEvent: { clientX: number; clientY: number } | null = null;

    const applyPointer = () => {
      frame = 0;
      if (!lastEvent) return;
      const { clientX, clientY } = lastEvent;
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;

      root.style.setProperty('--glow-x', clientX.toFixed(2));
      root.style.setProperty('--glow-y', clientY.toFixed(2));
      root.style.setProperty('--glow-xp', (clientX / width).toFixed(2));
      root.style.setProperty('--glow-yp', (clientY / height).toFixed(2));
    };

    const updatePointer = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(applyPointer);
    };

    lastEvent = { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 };
    applyPointer();

    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', updatePointer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full relative text-text selection:bg-accent selection:text-bg overflow-x-hidden font-body">
      <GlobalBackdrop />
      <ViewportBlur />
      <NavBar />
      <CursorEyes />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <SkillProficiency />
        <Work />
        <HTBWriteups />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
