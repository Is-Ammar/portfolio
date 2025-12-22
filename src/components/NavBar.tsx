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
      className="fixed top-0 left-0 w-full z-40 bg-bg/90 backdrop-blur-sm border-b border-line"
    >
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider hover:text-accent transition-colors text-text-strong group">
          <Terminal size={16} className="text-accent group-hover:animate-pulse" />
          ISMAIL.AMMAR
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-mono text-xs font-medium uppercase tracking-widest text-text-muted">
          <a href="#about" className="hover:text-accent transition-colors">About</a>
          <a href="#work" className="hover:text-accent transition-colors">Work</a>
          <a href="#skills" className="hover:text-accent transition-colors">Stack</a>
          <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          <a 
            href={SOCIALS.resume} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-line-strong text-text-strong px-4 py-2 hover:border-accent hover:text-accent transition-all rounded-[1px]"
          >
            <Download size={14} /> <span className="hidden lg:inline">RESUME_V1.PDF</span><span className="lg:hidden">RESUME</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-text-strong hover:text-accent" onClick={() => setIsOpen(!isOpen)}>
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
            className="md:hidden bg-bg-elev-1 border-b border-line overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6 font-mono uppercase text-sm tracking-widest text-text-muted">
              <a href="#about" className="hover:text-accent" onClick={() => setIsOpen(false)}>About</a>
              <a href="#work" className="hover:text-accent" onClick={() => setIsOpen(false)}>Work</a>
              <a href="#skills" className="hover:text-accent" onClick={() => setIsOpen(false)}>Stack</a>
              <a href="#contact" className="hover:text-accent" onClick={() => setIsOpen(false)}>Contact</a>
              <a href={SOCIALS.resume} target="_blank" className="text-accent flex items-center gap-2">
                 <Download size={14} /> Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};