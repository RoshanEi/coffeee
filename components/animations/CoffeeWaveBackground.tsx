'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CoffeeWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(245, 245, 220, 0.1)'); // cream
      gradient.addColorStop(0.5, 'rgba(205, 133, 63, 0.05)'); // coffee-light
      gradient.addColorStop(1, 'rgba(139, 69, 19, 0.1)'); // coffee-brown

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw flowing coffee waves
      const waves = 5;
      for (let i = 0; i < waves; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(139, 69, 19, ${0.1 + i * 0.02})`;
        ctx.lineWidth = 2 + i;

        const amplitude = 50 + i * 20;
        const frequency = 0.005 + i * 0.001;
        const phase = time + i * 0.5;

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height / 2 + 
                   Math.sin(x * frequency + phase) * amplitude +
                   Math.sin(x * frequency * 2 + phase * 1.5) * (amplitude / 3) +
                   (springY.get() - canvas.height / 2) * 0.1;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw coffee particles
      for (let i = 0; i < 50; i++) {
        const x = (springX.get() + i * 50 + time * 20) % canvas.width;
        const y = (i * 30 + Math.sin(time + i) * 20) % canvas.height;
        // Ensure size is always positive with a minimum value of 1
        const size = Math.max(1, Math.abs(1 + Math.sin(time + i) * 2));
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(93, 46, 10, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [springX, springY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
}