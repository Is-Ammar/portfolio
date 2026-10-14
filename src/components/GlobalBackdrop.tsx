import React from 'react';

type Shape = {
  className: string;
  width: number;
  height: number;
  rotate: number;
  gradient: string;
  delay: number;
  drift: number;
  desktopOnly?: boolean;
};

const SHAPES: Shape[] = [
  { className: 'left-[-12%] top-[14%] md:left-[-6%] md:top-[18%]', width: 600, height: 140, rotate: 12, gradient: 'from-indigo-500/15', delay: 0.1, drift: 220 },
  { className: 'right-[-8%] top-[68%] md:right-[-2%] md:top-[72%]', width: 520, height: 120, rotate: -14, gradient: 'from-rose-500/15', delay: 0.3, drift: -180 },
  { className: 'left-[6%] bottom-[6%] md:left-[12%] md:bottom-[10%]', width: 320, height: 86, rotate: -8, gradient: 'from-violet-500/15', delay: 0.45, drift: 260 },
  { className: 'right-[12%] top-[10%] md:right-[18%] md:top-[14%]', width: 220, height: 64, rotate: 18, gradient: 'from-amber-500/15', delay: 0.6, drift: -140, desktopOnly: true },
  { className: 'left-[22%] top-[6%] md:left-[26%] md:top-[9%]', width: 160, height: 46, rotate: -22, gradient: 'from-cyan-500/15', delay: 0.75, drift: 200, desktopOnly: true },
];

// Fixed decorative background. All motion is CSS (entrance, slow float and a
// scroll-linked drift on a scroll timeline), so it never runs JavaScript per
// frame. The two smallest shapes are skipped on phones.
export const GlobalBackdrop = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{ background: 'radial-gradient(125% 125% at 50% 10%, #030303 35%, #0b0b18 100%)' }}
    />
    <div
      className="backdrop-fade absolute inset-0"
      style={{
        background:
          'linear-gradient(135deg, rgb(99 102 241 / 0.10), transparent 45%, transparent 55%, rgb(244 63 94 / 0.10))',
      }}
    />

    {SHAPES.map((shape) => (
      <div
        key={shape.gradient}
        className={`backdrop-drift absolute ${shape.className} ${shape.desktopOnly ? 'hidden md:block' : ''}`}
        style={{ '--drift': `${shape.drift}px` } as React.CSSProperties}
      >
        <div
          className="backdrop-in"
          style={{ '--r': `${shape.rotate}deg`, animationDelay: `${shape.delay}s` } as React.CSSProperties}
        >
          <div className="backdrop-float relative" style={{ width: shape.width, height: shape.height }}>
            <div
              className={`absolute inset-0 rounded-full border-2 border-white/10 bg-gradient-to-r to-transparent ${shape.gradient} shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]`}
            >
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_70%)]" />
            </div>
          </div>
        </div>
      </div>
    ))}

    <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80" />
  </div>
);
