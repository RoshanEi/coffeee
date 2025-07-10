'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MorphingButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MorphingButton({
  children,
  icon: Icon,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}: MorphingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #8B4513 0%, #5D2E0A 100%)',
      color: '#F5F5DC',
      border: 'none',
    },
    secondary: {
      background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
      color: '#8B4513',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      color: '#8B4513',
      border: '2px solid #8B4513',
    },
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' },
  };

  return (
    <motion.button
      className={`relative overflow-hidden rounded-full font-semibold transition-all duration-300 ${className}`}
      style={{
        ...variants[variant],
        ...sizes[size],
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Liquid morphing background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{ scale: 0, borderRadius: '50%' }}
        animate={{
          scale: isHovered ? 1.5 : 0,
          borderRadius: isHovered ? '0%' : '50%',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          background: variant === 'outline' 
            ? 'linear-gradient(135deg, #8B4513 0%, #5D2E0A 100%)'
            : 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
        }}
      />

      {/* Ripple effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        className="relative flex items-center justify-center space-x-2"
        animate={{
          y: isHovered ? -2 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {Icon && (
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        )}
        <span>{children}</span>
      </motion.div>

      {/* Floating particles */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-current rounded-full opacity-60"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              initial={{ scale: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                y: [-10, -20, -30],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
        </div>
      )}

      {/* Coffee bean shape morphing */}
      <motion.div
        className="absolute -top-1 -right-1 w-3 h-3 bg-current rounded-full opacity-30"
        animate={{
          scale: isHovered ? [1, 1.5, 1] : 1,
          rotate: isHovered ? 360 : 0,
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />
    </motion.button>
  );
}