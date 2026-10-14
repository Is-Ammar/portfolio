import React, { useEffect, useState } from 'react';

const formatLocalTime = () =>
  new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Casablanca',
  });

export const Footer = () => {
  const [localTime, setLocalTime] = useState(formatLocalTime);

  useEffect(() => {
    const id = window.setInterval(() => setLocalTime(formatLocalTime()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="relative z-10 border-t border-line/70 bg-bg-elev-1/90 px-6 py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.3em] text-text-muted md:flex-row">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-line-strong" />
            <span>© {new Date().getFullYear()} Ismail Ammar</span>
          </div>
          <div className="flex gap-8">
            <span>Rabat, Morocco</span>
            <span>{localTime} local</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
