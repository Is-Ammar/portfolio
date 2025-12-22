import React from 'react';
import { Github, Linkedin, Mail, Download, ArrowUpRight } from 'lucide-react';
import { SOCIALS } from '../constants';

export const Footer = () => {
  return (
    <footer id="contact" className="bg-bg-elev-1/90 backdrop-blur-md border-t border-line pt-20 pb-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div>
            <div className="font-mono text-accent text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              Secure Connection Available
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-text-strong leading-tight">
              INITIATE<br />COLLABORATION
            </h2>
            <p className="text-text-muted max-w-md font-body text-lg leading-relaxed mb-10">
              Available for high-impact contracts and consulting. Open encrypted channel below.
            </p>
            <a 
              href={`mailto:${SOCIALS.email}`}
              className="inline-flex items-center gap-4 text-xl font-mono text-text-strong hover:text-accent transition-colors border-b border-line hover:border-accent pb-2"
            >
              <Mail size={20} /> {SOCIALS.email}
            </a>
          </div>
          
          <div className="flex flex-col justify-end items-start md:items-end">
             <div className="flex flex-col gap-6">
                <a href={SOCIALS.github} target="_blank" className="group flex items-center gap-4 text-sm font-mono uppercase tracking-widest text-text-muted hover:text-accent transition-colors">
                  <span className="group-hover:translate-x-1 transition-transform">GitHub Profile</span> <Github size={16} />
                </a>
                <a href={SOCIALS.linkedin} target="_blank" className="group flex items-center gap-4 text-sm font-mono uppercase tracking-widest text-text-muted hover:text-accent transition-colors">
                  <span className="group-hover:translate-x-1 transition-transform">LinkedIn Network</span> <Linkedin size={16} />
                </a>
                <a href={SOCIALS.resume} target="_blank" className="group flex items-center gap-4 text-sm font-mono uppercase tracking-widest text-text-muted hover:text-accent transition-colors">
                  <span className="group-hover:translate-x-1 transition-transform">Download Dossier</span> <Download size={16} />
                </a>
             </div>
          </div>
        </div>
      
        <div className="pt-8 border-t border-line flex flex-col md:flex-row justify-between items-center text-xs text-text-muted font-mono uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-line-strong rounded-full"></div>
            <span>© {new Date().getFullYear()} ISMAIL AMMAR. SYSTEM SECURE.</span>
          </div>
          <div className="mt-4 md:mt-0 flex gap-8">
            <span>RABAT, MA</span>
            <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca' })} UTC+1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};