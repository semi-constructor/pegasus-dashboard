'use client';

import { useEffect, useRef } from 'react';
import { createTimeline, utils } from 'animejs';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Hero3DObject } from './Hero3DObject';

export const CinematicHero = () => {
  const textRef1 = useRef<HTMLHeadingElement>(null);
  const textRef2 = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300, 600], [1, 0.8, 0]);
  const y = useTransform(scrollY, [0, 600], [0, -150]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.9]);

  useEffect(() => {
    if (!textRef1.current || !textRef2.current || !subtitleRef.current) return;

    const timer = setTimeout(() => {
      const chars1 = textRef1.current!.querySelectorAll('.char');
      const chars2 = textRef2.current!.querySelectorAll('.char');

      if (chars1.length === 0 || chars2.length === 0) return;

      const tl = createTimeline({
        defaults: {
          ease: 'outExpo'
        }
      });

      tl.add(chars1, {
        translateY: [100, 0],
        opacity: [0, 1],
        rotateZ: [5, 0],
        delay: utils.stagger(40, { start: 200 })
      })
      .add(chars2, {
        translateY: [100, 0],
        opacity: [0, 1],
        rotateZ: [-5, 0],
        delay: utils.stagger(40)
      }, '-=1000')
      .add(subtitleRef.current!, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 1000
      }, '-=1000');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const splitText = (text: string, className: string) => {
    return (
      <span className={className}>
        {text.split('').map((char, i) => (
          <span 
            key={i} 
            className="char inline-block" 
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </span>
        ))}
      </span>
    );
  };

  return (
    <section className="relative h-[120vh] w-full flex flex-col justify-start pt-[20vh] items-center z-10 px-4 overflow-visible pointer-events-none">
      
      {/* 3D Background Object mapped to scroll */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <Hero3DObject />
      </div>

      <motion.div 
        style={{ opacity, y, scale }}
        className="max-w-[1200px] w-full text-center pointer-events-auto relative z-10 relative"
      >
        {/* Dark radial gradient behind text for readability */}
        <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.85)_0%,rgba(5,5,5,0)_60%)] -z-10 pointer-events-none" />
        
        <h1 
          className="text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-[0.85] mb-4 text-white drop-shadow-2xl"
          ref={textRef1}
        >
          {splitText('BEYOND', 'hero-text-1')}
        </h1>
        <h1 
          className="text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-[0.85] mb-8 text-[#B026FF] drop-shadow-2xl"
          ref={textRef2}
        >
          {splitText('AUTOMATION', 'hero-text-2')}
        </h1>
        
        <p 
          className="text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl tracking-wide opacity-0 font-mono"
          ref={subtitleRef}
        >
          An elite infrastructure layer for extreme-scale communities.
          <br className="hidden md:block" />
          Precision engineered moderation, economy, and gamification.
        </p>

        <motion.div 
          className="absolute -bottom-[20vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1 }}
        >
          <span className="text-xs tracking-widest text-neutral-500 uppercase font-mono">Scroll to explore</span>
          <motion.div 
            className="w-[1px] h-16 bg-gradient-to-b from-[#B026FF] to-transparent"
            animate={{ 
              scaleY: [0, 1, 0],
              translateY: [0, 20, 40],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ originY: 0 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
