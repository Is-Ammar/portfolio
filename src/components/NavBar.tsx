import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Menu, X, Terminal } from 'lucide-react';
import { SOCIALS } from '../constants';
import { DURATION, EASE_OUT } from '../utils/motion';

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: DURATION.md, ease: EASE_OUT }}
      className="fixed top-0 left-0 w-full z-40 bg-bg/70 backdrop-blur-xl border-b border-line/60"
    >
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider hover:text-accent transition-colors text-text-strong group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-2 py-1">
          <Terminal size={16} className="text-accent group-hover:animate-pulse motion-reduce:group-hover:animate-none" />
          Ismail Ammar
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-mono text-xs font-medium uppercase tracking-wider text-text-muted">
          <a href="#about" className="hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-2 py-1">About</a>
          <a href="#work" className="hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-2 py-1">Work</a>
          <a href="#skills" className="hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-2 py-1">Stack</a>
          <a href="#contact" className="hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-2 py-1">Contact</a>
          <a 
            href={SOCIALS.resume} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-line-strong/70 bg-bg-elev-1/60 text-text-strong px-4 py-2 hover:border-accent/60 hover:text-accent hover:shadow-glow transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Download size={14} /> <span className="hidden lg:inline">RESUME_V1.PDF</span><span className="lg:hidden">RESUME</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-text-strong hover:text-accent rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DURATION.sm, ease: EASE_OUT }}
            className="md:hidden bg-bg-elev-1/90 border-b border-line/60 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6 font-mono uppercase text-sm tracking-wider text-text-muted">
              <a href="#about" className="hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-3 py-2" onClick={() => setIsOpen(false)}>About</a>
              <a href="#work" className="hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-3 py-2" onClick={() => setIsOpen(false)}>Work</a>
              <a href="#skills" className="hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-3 py-2" onClick={() => setIsOpen(false)}>Stack</a>
              <a href="#contact" className="hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-3 py-2" onClick={() => setIsOpen(false)}>Contact</a>
              <a href={SOCIALS.resume} target="_blank" className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-4 py-2 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
                 <Download size={14} /> Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
