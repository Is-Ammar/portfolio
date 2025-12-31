import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Work } from './sections/Work';
import { Experience } from './sections/Experience';
import { Contact } from './sections/Contact';
import GradualBlur from './components/GradualBlur';
import { GlobalBackdrop } from './components/GlobalBackdrop';

const App = () => {
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const hasRestoredRef = useRef(false);

  // Smooth scroll behavior for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [prefersReducedMotion]);

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

  useEffect(() => {
    const root = document.documentElement;

    const updatePointer = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;

      root.style.setProperty('--glow-x', clientX.toFixed(2));
      root.style.setProperty('--glow-y', clientY.toFixed(2));
      root.style.setProperty('--glow-xp', (clientX / width).toFixed(2));
      root.style.setProperty('--glow-yp', (clientY / height).toFixed(2));
    };

    updatePointer({
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2,
    } as PointerEvent);

    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => window.removeEventListener('pointermove', updatePointer);
  }, []);

  return (
    <div className="min-h-screen w-full relative text-text selection:bg-accent selection:text-bg overflow-x-hidden font-body">
      <GlobalBackdrop />
      
      {/* Cinematic Viewport Blur Effects */}
      <GradualBlur 
        target="page" 
        position="bottom" 
        height="12rem"
        responsive={true}
        mobileHeight="9rem"
        tabletHeight="10rem"
        desktopHeight="12rem"
        strength={2} 
        divCount={8} 
        zIndex={50} 
        opacity={1} 
        preset="smooth"
      />
      
      <NavBar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
