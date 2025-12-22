import React, { useEffect } from 'react';
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
  // Smooth scroll behavior for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative min-h-screen text-text selection:bg-accent selection:text-bg overflow-x-hidden font-body bg-bg/90">
      {/* Global Fluid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LiquidEther 
          colors={['#101418', '#1f272d', '#20c20e']} 
          mouseForce={10}
          cursorSize={140}
          isViscous={false}
          viscous={20}
          iterationsViscous={20}
          iterationsPoisson={20}
          dt={0.012}
          resolution={0.45}
          autoDemo={true}
          autoSpeed={0.1}
          autoIntensity={0.8}
        />
      </div>
      
      {/* Cinematic Viewport Blur Effects */}
      <GradualBlur 
        target="page" 
        position="bottom" 
        height="8rem" 
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
