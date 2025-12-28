import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-line/70 bg-bg-elev-1/90 px-6 py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted md:flex-row">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-line-strong" />
            <span>© {new Date().getFullYear()} Ismail Ammar. All rights reserved.</span>
          </div>
          <div className="flex gap-8">
            <span>RABAT, MA</span>
            <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca' })} UTC+1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
