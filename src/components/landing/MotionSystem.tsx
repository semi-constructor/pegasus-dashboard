'use client';

import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ReactNode } from 'react';

export function MotionSystem({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#5E5CE6] origin-left z-50 mix-blend-screen opacity-50"
        style={{ scaleX }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export function FadeInStagger({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40, filter: 'blur(8px)', scale: 0.98 },
        visible: { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)', 
          scale: 1,
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
        }
      }}
    >
      {children}
    </motion.div>
  );
}
