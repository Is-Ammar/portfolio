import React from 'react';

const LAYER_COUNT = 8;
const STRENGTH = 2;

const smoothstep = (p: number) => p * p * (3 - 2 * p);

const LAYERS = Array.from({ length: LAYER_COUNT }, (_, index) => {
  const i = index + 1;
  const step = 100 / LAYER_COUNT;
  const blur = 0.0625 * (smoothstep(i / LAYER_COUNT) * LAYER_COUNT + 1) * STRENGTH;
  const stops = [
    `transparent ${step * (i - 1)}%`,
    `black ${step * i}%`,
    step * (i + 1) <= 100 ? `black ${step * (i + 1)}%` : null,
    step * (i + 2) <= 100 ? `transparent ${step * (i + 2)}%` : null,
  ]
    .filter(Boolean)
    .join(', ');
  const mask = `linear-gradient(to bottom, ${stops})`;
  return { mask, blur: `${blur.toFixed(3)}rem` };
});

// Progressive blur along the bottom edge of the viewport, so content
// softens out instead of getting clipped by the screen edge.
export const ViewportBlur = () => (
  <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-36 sm:h-40 md:h-48">
    {LAYERS.map((layer, index) => (
      <div
        key={index}
        className="absolute inset-0"
        style={{
          maskImage: layer.mask,
          WebkitMaskImage: layer.mask,
          backdropFilter: `blur(${layer.blur})`,
          WebkitBackdropFilter: `blur(${layer.blur})`,
        }}
      />
    ))}
  </div>
);
