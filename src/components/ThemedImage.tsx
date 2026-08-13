"use client";

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ThemedImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = mounted ? (resolvedTheme === 'light' ? 'light' : 'dark') : 'dark';
  
  const ext = src.substring(src.lastIndexOf('.'));
  const base = src.substring(0, src.lastIndexOf('.'));
  const themedSrc = `${base}-${theme}${ext}`;

  return (
    <Image 
      src={themedSrc} 
      alt={alt} 
      width={1920} 
      height={1080}
      className={className}
      unoptimized
    />
  );
};
