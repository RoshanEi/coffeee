'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

export function SteamParticleSystem({ 
  isActive = true, 
  intensity = 1,
  sourceX = 50,
  sourceY = 80 
}: {
  isActive?: boolean;
  intensity?: number;
  sourceX?: number;
  sourceY?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const particleIdRef = useRef(0);

  useEffect(() => {
    if (!isActive) return;

    const createParticle = (): Particle => {
      return {
        id: particleIdRef.current++,
        x: sourceX + (Math.random() - 0.5) * 10,
        y: sourceY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.5 - Math.random() * 1.5,
        life: 0,
        maxLife: 2000 + Math.random() * 3000,
        size: 2 + Math.random() * 4,
        opacity: 0.6 + Math.random() * 0.4,
      };
    };

    const updateParticles = () => {
      setParticles(prevParticles => {
        let newParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx + (Math.random() - 0.5) * 0.02,
            vy: particle.vy - 0.01,
            life: particle.life + 16,
            opacity: particle.opacity * 0.998,
          }))
          .filter(particle => 
            particle.life < particle.maxLife && 
            particle.opacity > 0.01 &&
            particle.y > -10
          );

        // Add new particles based on intensity
        const particlesToAdd = Math.floor(intensity * 3);
        for (let i = 0; i < particlesToAdd; i++) {
          if (Math.random() < 0.3) {
            newParticles.push(createParticle());
          }
        }

        return newParticles;
      });

      animationRef.current = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, intensity, sourceX, sourceY]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            filter: 'blur(1px)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ))}
    </div>
  );
}