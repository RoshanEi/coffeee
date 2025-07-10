'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function LiquidCoffeeBackground() {
  const [windowHeight, setWindowHeight] = useState(1000); // Default value
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    setIsMounted(true);
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (!isMounted) return null; // Don't render anything on server-side
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #F5F5DC 0%, #CD853F 25%, #8B4513 50%, #5D2E0A 75%, #8B4513 100%)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating coffee bean shapes */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-5 bg-coffee-dark rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Flowing particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-gold rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${100 + Math.random() * 20}%`,
            }}
            animate={{
              y: [0, -windowHeight - 100],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #8B4513 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #5D2E0A 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}