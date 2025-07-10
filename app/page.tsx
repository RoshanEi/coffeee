'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ProductShowcase } from '@/components/ProductShowcase';
import { BrewingProcess } from '@/components/BrewingProcess';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ContactSection } from '@/components/ContactSection';
import { SmartRecommendations } from '@/components/ai/SmartRecommendations';
import { CoffeeCustomizer } from '@/components/interactive/CoffeeCustomizer';
import { VirtualTour } from '@/components/interactive/VirtualTour';
import { SteamParticleSystem } from '@/components/animations/SteamParticleSystem';
import { CoffeeStainEffect } from '@/components/animations/CoffeeStainEffect';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [showStains, setShowStains] = useState(false);
  
  // Mock user preferences for AI recommendations
  const userPreferences = {
    flavorProfile: ['citrus', 'floral', 'bright'],
    strength: 3,
    temperature: 'hot' as const,
    timeOfDay: 'morning' as const,
    previousOrders: [1, 3, 5]
  };

  useEffect(() => {
    // Initialize GSAP scroll animations
    const sections = gsap.utils.toArray('.scroll-section');
    
    sections.forEach((section: any, index) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Trigger coffee stains periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowStains(prev => !prev);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y: backgroundY }}
        className="fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-coffee-light/20 to-coffee-brown/10" />
      </motion.div>

      {/* Steam effects */}
      <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
        <SteamParticleSystem isActive={true} intensity={1.5} sourceX={20} sourceY={90} />
        <SteamParticleSystem isActive={true} intensity={1} sourceX={80} sourceY={85} />
      </div>
      
      {/* Coffee stain effects */}
      <CoffeeStainEffect trigger={showStains} maxStains={3} />

      {/* Main content */}
      <HeroSection />
      
      <section className="scroll-section">
        <AboutSection />
      </section>
      
      <section className="scroll-section">
        <ProductShowcase />
      </section>
      
      <section className="scroll-section">
        <SmartRecommendations 
          userPreferences={userPreferences}
          onProductSelect={(product) => console.log('Selected:', product)}
        />
      </section>
      
      <section className="scroll-section">
        <CoffeeCustomizer />
      </section>
      
      <section className="scroll-section">
        <BrewingProcess />
      </section>
      
      <section className="scroll-section">
        <VirtualTour />
      </section>
      
      <section className="scroll-section">
        <ContactSection />
      </section>
    </div>
  );
}