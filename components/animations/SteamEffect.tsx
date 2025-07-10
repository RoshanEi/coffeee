'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SteamParticle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  delay: number;
}

export function SteamEffect({ isActive = true }: { isActive?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<SteamParticle[]>([]);

  useEffect(() => {
    if (!isActive) return;

    // Initialize particles
    particlesRef.current = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: 45 + Math.random() * 10,
      y: 60,
      opacity: 0,
      scale: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 2,
    }));

    const createParticle = () => {
      if (!containerRef.current) return;

      const particle = document.createElement('div');
      particle.className = 'absolute w-3 h-3 bg-white/40 rounded-full pointer-events-none';
      particle.style.left = `${45 + Math.random() * 10}%`;
      particle.style.top = '60%';
      particle.style.transform = 'scale(0.5)';
      
      containerRef.current.appendChild(particle);

      // Animate particle
      let progress = 0;
      const animate = () => {
        progress += 0.02;
        
        if (progress <= 1) {
          const y = 60 - (progress * 80);
          const opacity = Math.sin(progress * Math.PI) * 0.6;
          const scale = 0.5 + (progress * 1.5);
          const x = 45 + Math.random() * 10 + Math.sin(progress * 4) * 2;
          
          particle.style.top = `${y}%`;
          particle.style.left = `${x}%`;
          particle.style.opacity = opacity.toString();
          particle.style.transform = `scale(${scale})`;
          
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animate);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
}