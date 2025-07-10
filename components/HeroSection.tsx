'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SteamEffect } from '@/components/animations/SteamEffect';
import { TextReveal } from '@/components/animations/TextReveal';
import { MorphingButton } from '@/components/animations/MorphingButton';
import { Coffee, BookOpen } from 'lucide-react';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    // Additional GSAP animations can be added here
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e69c1a&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Steam Effect */}
      <SteamEffect isActive={true} />

      {/* Content */}
      <motion.div
        style={{ y }}
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 font-playfair"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Shinmen Coffee
        </motion.h1>
        
        <TextReveal
          text="Where Every Bean Tells a Story"
          className="text-xl md:text-2xl mb-8 text-cream"
          delay={1.5}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="space-x-4"
        >
          <MorphingButton
            icon={Coffee}
            variant="primary"
            size="lg"
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Our Menu
          </MorphingButton>
          <MorphingButton
            icon={BookOpen}
            variant="outline"
            size="lg"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Our Story
          </MorphingButton>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-cream"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="cursor-pointer"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="h-8 w-8 mx-auto" />
          <p className="text-sm mt-2">Scroll to discover</p>
        </motion.div>
      </motion.div>
    </section>
  );
}