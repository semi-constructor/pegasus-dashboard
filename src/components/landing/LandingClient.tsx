'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { EditorialNavBar } from '@/components/landing/EditorialNavBar';
import { CursorEffect } from '@/components/landing/CursorEffect';
import { CinematicHero } from '@/components/landing/CinematicHero';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';

import { OpenSourceSection } from '@/components/landing/OpenSourceSection';
import { Footer } from '@/components/landing/Footer';

export const LandingClient = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#050505] selection:bg-[#B026FF] selection:text-[#050505] font-sans overflow-x-hidden">
      <EditorialNavBar />
      <CursorEffect />
      
      <main className="relative z-10 w-full flex flex-col items-center">
        <CinematicHero />
        <FeatureShowcase />
        <OpenSourceSection />
      </main>

      <Footer />
    </div>
  );
};
