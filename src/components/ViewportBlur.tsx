import React from 'react';

// Two stacked backdrop-filter layers: light blur that ramps in, then a
// stronger one near the edge. The old 8-layer version blurred up to 20px over
// a 160px strip, which dropped desktop scrolling to 30fps on weaker GPUs.
const LAYERS = [
  { blur: 4, mask: 'linear-gradient(to bottom, transparent 0%, black 45%)' },
  { blur: 10, mask: 'linear-gradient(to bottom, transparent 45%, black 100%)' },
];

// Progressive blur along the bottom edge of the viewport. Touch devices get a
// plain gradient fade instead, which looks close and costs almost nothing.
export const ViewportBlur = () => (
  <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-24 md:h-28">
    <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/60 to-transparent [@media(hover:hover)_and_(pointer:fine)]:hidden" />
    <div className="absolute inset-0 hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      {LAYERS.map((layer) => (
        <div
          key={layer.blur}
          className="absolute inset-0"
          style={{
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
          }}
        />
      ))}
    </div>
  </div>
);
