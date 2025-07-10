'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoffeeStain {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
}

export function CoffeeStainEffect({ 
  trigger = false, 
  maxStains = 5 
}: { 
  trigger?: boolean; 
  maxStains?: number; 
}) {
  const [stains, setStains] = useState<CoffeeStain[]>([]);

  useEffect(() => {
    if (trigger) {
      const newStain: CoffeeStain = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 40,
        opacity: 0.1 + Math.random() * 0.2,
        rotation: Math.random() * 360,
      };

      setStains(prev => {
        const updated = [...prev, newStain];
        return updated.length > maxStains ? updated.slice(1) : updated;
      });

      // Auto-remove stain after some time
      setTimeout(() => {
        setStains(prev => prev.filter(stain => stain.id !== newStain.id));
      }, 10000 + Math.random() * 5000);
    }
  }, [trigger, maxStains]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <AnimatePresence>
        {stains.map(stain => (
          <motion.div
            key={stain.id}
            className="absolute"
            style={{
              left: `${stain.x}%`,
              top: `${stain.y}%`,
              transform: `translate(-50%, -50%) rotate(${stain.rotation}deg)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: stain.opacity,
              rotate: stain.rotation + 360 
            }}
            exit={{ 
              scale: 0, 
              opacity: 0,
              transition: { duration: 2 }
            }}
            transition={{ 
              duration: 1.5, 
              ease: 'easeOut',
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
            }}
          >
            <svg
              width={stain.size}
              height={stain.size}
              viewBox="0 0 100 100"
              className="drop-shadow-sm"
            >
              <defs>
                <radialGradient id={`stain-${stain.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8B4513" stopOpacity="0.3" />
                  <stop offset="70%" stopColor="#5D2E0A" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3D1A00" stopOpacity="0.1" />
                </radialGradient>
              </defs>
              
              {/* Main stain shape */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill={`url(#stain-${stain.id})`}
              />
              
              {/* Irregular edges */}
              <circle cx="30" cy="30" r="8" fill="#8B4513" opacity="0.1" />
              <circle cx="70" cy="35" r="6" fill="#8B4513" opacity="0.15" />
              <circle cx="25" cy="70" r="10" fill="#8B4513" opacity="0.08" />
              <circle cx="75" cy="75" r="7" fill="#8B4513" opacity="0.12" />
              
              {/* Coffee ring effect */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="#5D2E0A"
                strokeWidth="1"
                opacity="0.2"
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}