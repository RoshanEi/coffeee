'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  color: string;
  type: 'bean' | 'steam' | 'aroma';
}

interface ParticleSystemProps {
  type: 'coffee-beans' | 'steam' | 'aroma';
  count?: number;
  isActive?: boolean;
}

export function ParticleSystem({ 
  type, 
  count = 20, 
  isActive = true 
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const createParticle = (index: number): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found');

    const baseConfig = {
      id: index,
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      life: 0,
      maxLife: 3000 + Math.random() * 2000,
    };

    switch (type) {
      case 'coffee-beans':
        return {
          ...baseConfig,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.2 - Math.random() * 0.3,
          size: 4 + Math.random() * 4,
          color: '#8B4513',
          type: 'bean',
        };
      case 'steam':
        return {
          ...baseConfig,
          y: canvas.height * 0.8,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.5 - Math.random() * 0.5,
          size: 2 + Math.random() * 3,
          color: 'rgba(255, 255, 255, 0.6)',
          type: 'steam',
        };
      case 'aroma':
        return {
          ...baseConfig,
          y: canvas.height * 0.7,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.3 - Math.random() * 0.4,
          size: 1 + Math.random() * 2,
          color: '#FFD700',
          type: 'aroma',
        };
      default:
        return baseConfig as Particle;
    }
  };

  const updateParticle = (particle: Particle): Particle => {
    const newParticle = { ...particle };
    newParticle.x += newParticle.vx;
    newParticle.y += newParticle.vy;
    newParticle.life += 16; // Assuming 60fps

    // Add some turbulence
    newParticle.vx += (Math.random() - 0.5) * 0.01;
    newParticle.vy += (Math.random() - 0.5) * 0.01;

    return newParticle;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const alpha = 1 - (particle.life / particle.maxLife);
    const size = particle.size * (0.5 + alpha * 0.5);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    
    if (particle.type === 'bean') {
      // Draw coffee bean shape
      ctx.beginPath();
      ctx.ellipse(particle.x, particle.y, size, size * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Bean crack
      ctx.strokeStyle = '#5D2E0A';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y - size);
      ctx.lineTo(particle.x, particle.y + size);
      ctx.stroke();
    } else {
      // Draw circle for steam and aroma
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current
      .map(updateParticle)
      .filter(particle => 
        particle.life < particle.maxLife && 
        particle.y > -50 && 
        particle.x > -50 && 
        particle.x < canvas.width + 50
      );

    particlesRef.current.forEach(particle => {
      drawParticle(ctx, particle);
    });

    // Add new particles
    while (particlesRef.current.length < count && isActive) {
      particlesRef.current.push(createParticle(Date.now() + Math.random()));
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (isActive) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, count, type]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}