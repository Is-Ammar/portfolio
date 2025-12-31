import React, { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Work } from './sections/Work';
import { Experience } from './sections/Experience';
import { Contact } from './sections/Contact';
import GradualBlur from './components/GradualBlur';

const App = () => {
  const prefersReducedMotion = useReducedMotion();

  // Smooth scroll behavior for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [prefersReducedMotion]);

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
      {/* Dark Horizon Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(125% 125% at 50% 10%, #030303 35%, #0b0b18 100%)'
        }}
      />
      
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
                <div
          className="max-w-[1600px] mx-auto border-t border-line/60"
          aria-hidden="true"
        />
        <Skills />
                <div
          className="max-w-[1600px] mx-auto border-t border-line/60"
          aria-hidden="true"
        />
        <Work />
        <div
          className="max-w-[1600px] mx-auto border-t border-line/60"
          aria-hidden="true"
        />
        <Experience />
                       <div
          className="max-w-[1600px] mx-auto border-t border-line/60"
          aria-hidden="true"
        />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
