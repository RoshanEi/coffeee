'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollIndicator() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Only render the component after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return an empty div during SSR to avoid hydration mismatch
    return <div className="scroll-indicator" style={{ transform: 'scaleX(0)' }} />;
  }

  return (
    <motion.div
      className="scroll-indicator"
      style={{ scaleX }}
    />
  );
}