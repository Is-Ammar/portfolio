import React, { useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { Metrics } from './sections/Metrics';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Work } from './sections/Work';
import { Experience } from './sections/Experience';
import LiquidEther from './components/LiquidEther';
import GradualBlur from './components/GradualBlur';

const App = () => {
  const prefersReducedMotion = useReducedMotion();
  const liquidColors = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const styles = getComputedStyle(document.documentElement);
    return ['--bg', '--bg-elev-1', '--accent']
      .map((token) => styles.getPropertyValue(token).trim())
      .filter(Boolean);
  }, []);

  // Smooth scroll behavior for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [prefersReducedMotion]);

  return (
    <div className="relative min-h-screen text-text selection:bg-accent selection:text-bg overflow-x-hidden font-body bg-bg">
      {/* Global Fluid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {!prefersReducedMotion && liquidColors.length === 3 && (
          <LiquidEther 
            colors={liquidColors} 
            mouseForce={6}
            cursorSize={160}
            isViscous={false}
            viscous={20}
            iterationsViscous={20}
            iterationsPoisson={20}
            dt={0.012}
            resolution={0.5}
            autoDemo={true}
            autoSpeed={0.08}
            autoIntensity={0.45}
          />
        )}
      </div>

      {/* Ambient Light Wash */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 left-[-10%] h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] rounded-full bg-accent/10 blur-[90px] sm:blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[380px] w-[380px] sm:h-[520px] sm:w-[520px] rounded-full bg-accent-2/10 blur-[100px] sm:blur-[140px]" />
      </div>
      
      {/* Cinematic Viewport Blur Effects */}
      <GradualBlur 
        target="page" 
        position="bottom" 
        height="8rem"
        responsive={true}
        mobileHeight="5rem"
        tabletHeight="6rem"
        desktopHeight="8rem"
        strength={2} 
        divCount={6} 
        zIndex={50} 
        opacity={1} 
        preset="smooth"
      />
      
      {/* Noise Overlay */}
      <div className="bg-noise"></div>
      
      <NavBar />
      <main className="relative z-10">
        <Hero />
        <Metrics />
        <About />
        <Skills />
        <Work />
        <Experience />
      </main>
      <Footer />
    </div>
  );
};

export default App;
