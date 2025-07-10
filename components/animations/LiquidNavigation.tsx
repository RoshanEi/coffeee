'use client';

import React, { useState, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Coffee, Home, Info, Menu, Phone, MapPin } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: Info },
  { name: 'Menu', href: '#menu', icon: Menu },
  { name: 'Experience', href: '#experience', icon: MapPin },
  { name: 'Contact', href: '#contact', icon: Phone },
];

export function LiquidNavigation() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      <motion.div
        className="relative bg-gradient-to-r from-coffee-brown/90 via-coffee-dark/90 to-coffee-brown/90 backdrop-blur-lg rounded-full px-6 py-3 shadow-2xl border border-gold/20"
        onMouseMove={handleMouseMove}
        style={{
          background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.9) 0%, rgba(93, 46, 10, 0.9) 50%, rgba(139, 69, 19, 0.9) 100%)',
        }}
      >
        {/* Liquid blob that follows cursor */}
        <motion.div
          className="absolute w-12 h-12 bg-gold/30 rounded-full blur-xl"
          style={{
            x: useTransform(x, (value) => value - 24),
            y: useTransform(y, (value) => value - 24),
          }}
        />
        
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Coffee className="h-6 w-6 text-gold" />
            </motion.div>
            <span className="text-cream font-bold font-playfair">Shinmen</span>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative px-4 py-2 text-cream/80 hover:text-cream transition-colors duration-300 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Liquid background for hovered item */}
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="liquid-bg"
                    className="absolute inset-0 bg-gradient-to-r from-gold/20 to-gold/30 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  />
                )}
                
                <div className="relative flex items-center space-x-2">
                  <motion.div
                    animate={hoveredIndex === index ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="h-4 w-4" />
                  </motion.div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>

                {/* Drip effect */}
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 w-1 h-4 bg-gold/60 rounded-full"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    exit={{ scaleY: 0, opacity: 0 }}
                    style={{ originY: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Floating particles around navigation */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/40 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${10 + (i % 2) * 80}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </motion.nav>
  );
}