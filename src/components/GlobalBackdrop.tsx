import React from 'react';
import type { MotionValue } from 'framer-motion';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

type BackdropShapeProps = {
  className?: string;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  delay?: number;
  drift: MotionValue<number>;
  reduceMotion: boolean;
};

const BackdropShape = ({
  className = '',
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/10',
  delay = 0,
  drift,
  reduceMotion,
}: BackdropShapeProps) => {
  return (
    <motion.div
      className={`absolute will-change-transform ${className}`}
      style={reduceMotion ? undefined : { y: drift }}
      initial={
        reduceMotion
          ? { opacity: 1, rotate }
          : { opacity: 0, rotate: rotate - 8, scale: 0.98 }
      }
      animate={{ opacity: 1, rotate, scale: 1 }}
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 3.6,
              delay,
              ease: [0.22, 0.8, 0.35, 1],
              opacity: { duration: 1.8 },
            }
      }
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 18, 0] }}
        transition={reduceMotion ? undefined : { duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border-2 border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  );
};

export const GlobalBackdrop = () => {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const driftA = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const driftB = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const driftC = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const driftD = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const driftE = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const fade = useTransform(scrollYProgress, [0, 0.35, 1], [1, 1, 0.75]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(125% 125% at 50% 10%, #030303 35%, #0b0b18 100%)',
        }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 blur-3xl"
        style={reduceMotion ? undefined : { opacity: fade }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <BackdropShape
          reduceMotion={reduceMotion}
          drift={driftA}
          delay={0.1}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/15"
          className="left-[-12%] top-[14%] md:left-[-6%] md:top-[18%]"
        />
        <BackdropShape
          reduceMotion={reduceMotion}
          drift={driftB}
          delay={0.3}
          width={520}
          height={120}
          rotate={-14}
          gradient="from-rose-500/15"
          className="right-[-8%] top-[68%] md:right-[-2%] md:top-[72%]"
        />
        <BackdropShape
          reduceMotion={reduceMotion}
          drift={driftC}
          delay={0.45}
          width={320}
          height={86}
          rotate={-8}
          gradient="from-violet-500/15"
          className="left-[6%] bottom-[6%] md:left-[12%] md:bottom-[10%]"
        />
        <BackdropShape
          reduceMotion={reduceMotion}
          drift={driftD}
          delay={0.6}
          width={220}
          height={64}
          rotate={18}
          gradient="from-amber-500/15"
          className="right-[12%] top-[10%] md:right-[18%] md:top-[14%]"
        />
        <BackdropShape
          reduceMotion={reduceMotion}
          drift={driftE}
          delay={0.75}
          width={160}
          height={46}
          rotate={-22}
          gradient="from-cyan-500/15"
          className="left-[22%] top-[6%] md:left-[26%] md:top-[9%]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80" />
    </div>
  );
};
