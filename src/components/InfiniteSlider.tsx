import React, { Children, cloneElement, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

const cn = (...classes: Array<string | undefined | false | null>) =>
  classes.filter(Boolean).join(' ');

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      setBounds({ width: rect.width, height: rect.height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, bounds] as const;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const reduceMotion = useReducedMotion();
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      translation.set(0);
      return;
    }

    const size = direction === 'horizontal' ? width : height;
    if (!size) return;

    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    let controls;
    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: currentDuration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return controls?.stop;
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
    reduceMotion,
  ]);

  const hoverProps =
    durationOnHover && !reduceMotion
      ? {
          onHoverStart: () => {
            setIsTransitioning(true);
            setCurrentDuration(durationOnHover);
          },
          onHoverEnd: () => {
            setIsTransitioning(true);
            setCurrentDuration(duration);
          },
        }
      : {};

  const items = Children.toArray(children);

  // With reduced motion the strip never scrolls, so wrap items instead of
  // clipping everything past the first row.
  if (reduceMotion) {
    return (
      <div className={cn('flex flex-wrap', className)} style={{ gap: `${gap}px` }}>
        {items}
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref}
        {...hoverProps}
      >
        {items}
        {items.map((child, index) =>
          cloneElement(child as React.ReactElement, {
            key: `duplicate-${(child as React.ReactElement).key ?? index}`,
          })
        )}
      </motion.div>
    </div>
  );
}
