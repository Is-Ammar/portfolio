import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { METRICS } from '../constants';
import { DURATION, EASE_OUT, staggerContainer, fadeInUp } from '../utils/motion';

const Counter = ({ value, suffix }: { value: string, suffix?: string }) => {
  // Parse numeric part
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const isNumeric = !isNaN(numericValue);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  
  const springValue = useSpring(0, {
    duration: 1.5,
    bounce: 0
  });

  const displayValue = useTransform(springValue, (current) => {
    if (!isNumeric) return value;
    // Handle "<" or ">" prefixes if needed, simplifed here to just number
    return Math.round(current).toString();
  });

  useEffect(() => {
    if (isInView && isNumeric) {
      springValue.set(numericValue);
    }
  }, [isInView, isNumeric, numericValue, springValue]);

  return (
    <span ref={ref} className="flex items-baseline">
        {/* If non-numeric (like <1), just show static for simplicity/robustness in this context, 
            or handle prefix logic. For now, strictly numeric animation or fallback */}
        {isNumeric ? <motion.span>{displayValue}</motion.span> : value}
        {suffix && <span className="text-2xl text-accent font-mono ml-1">{suffix}</span>}
    </span>
  );
};

export const Metrics = () => {
  return (
    <section className="border-y border-line bg-bg-elev-1/80 backdrop-blur-md">
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-line"
      >
        {METRICS.map((m, i) => (
          <motion.div 
            key={i} 
            variants={fadeInUp}
            className="p-10 flex flex-col justify-between h-40 hover:bg-bg-elev-2/80 transition-colors cursor-crosshair group relative overflow-hidden"
          >
             {/* Hover scanline effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 -translate-y-full group-hover:translate-y-[1000%] transition-transform duration-1000"></div>
            
            <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
              0{i + 1} // {m.label}
            </div>
            <div className="text-4xl md:text-5xl font-display font-bold text-text-strong mt-2">
              <Counter value={m.value} suffix={m.suffix} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};