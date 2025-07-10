'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { Play, Pause, RotateCcw, Thermometer, Timer, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrewingStage {
  name: string;
  duration: number;
  temperature: number;
  description: string;
  color: string;
}

const brewingStages: BrewingStage[] = [
  { name: 'Grinding', duration: 15, temperature: 20, description: 'Grinding fresh coffee beans', color: '#8B4513' },
  { name: 'Heating', duration: 30, temperature: 95, description: 'Heating water to optimal temperature', color: '#FF6B35' },
  { name: 'Blooming', duration: 30, temperature: 93, description: 'Coffee grounds releasing CO2', color: '#D2691E' },
  { name: 'First Pour', duration: 45, temperature: 91, description: 'Initial water pour for extraction', color: '#CD853F' },
  { name: 'Brewing', duration: 120, temperature: 89, description: 'Full extraction process', color: '#A0522D' },
  { name: 'Final Pour', duration: 30, temperature: 87, description: 'Final water addition', color: '#8B4513' },
  { name: 'Complete', duration: 0, temperature: 85, description: 'Perfect coffee ready to serve', color: '#654321' }
];

export function AdvancedBrewingAnimation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [temperature, setTemperature] = useState(20);
  
  const coffeeRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  const controls = useAnimation();

  useEffect(() => {
    if (isPlaying && currentStage < brewingStages.length - 1) {
      const stage = brewingStages[currentStage];
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (stage.duration * 10));
          if (newProgress >= 100) {
            setCurrentStage(curr => curr + 1);
            return 0;
          }
          return newProgress;
        });
      }, 100);

      // Animate temperature
      gsap.to({ temp: temperature }, {
        temp: stage.temperature,
        duration: stage.duration / 10,
        onUpdate: function() {
          setTemperature(Math.round(this.targets()[0].temp));
        }
      });

      // Stage-specific animations
      animateStage(stage);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentStage, temperature]);

  const animateStage = (stage: BrewingStage) => {
    switch (stage.name) {
      case 'Grinding':
        animateGrinding();
        break;
      case 'Heating':
        animateHeating();
        break;
      case 'Blooming':
        animateBlooming();
        break;
      case 'First Pour':
      case 'Final Pour':
        animatePouring();
        break;
      case 'Brewing':
        animateBrewing();
        break;
    }
  };

  const animateGrinding = () => {
    if (coffeeRef.current) {
      gsap.to(coffeeRef.current, {
        rotation: 360,
        duration: 0.5,
        repeat: -1,
        ease: 'none'
      });
    }
    createGrindingParticles();
  };

  const animateHeating = () => {
    if (steamRef.current) {
      gsap.to(steamRef.current.children, {
        y: -50,
        opacity: 0.8,
        duration: 2,
        stagger: 0.2,
        repeat: -1,
        ease: 'power2.out'
      });
    }
  };

  const animateBlooming = () => {
    createBloomingEffect();
    if (coffeeRef.current) {
      gsap.to(coffeeRef.current, {
        scale: 1.1,
        duration: 1,
        yoyo: true,
        repeat: -1,
        ease: 'power2.inOut'
      });
    }
  };

  const animatePouring = () => {
    if (waterRef.current) {
      gsap.fromTo(waterRef.current, 
        { height: '0%', opacity: 0 },
        { height: '60%', opacity: 0.7, duration: 2, ease: 'power2.out' }
      );
    }
    createWaterDroplets();
  };

  const animateBrewing = () => {
    createBrewingBubbles();
    if (coffeeRef.current) {
      gsap.to(coffeeRef.current, {
        backgroundColor: brewingStages[currentStage].color,
        duration: 3,
        ease: 'power2.inOut'
      });
    }
  };

  const createGrindingParticles = () => {
    if (!particlesRef.current) return;
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-coffee-brown rounded-full';
      particle.style.left = `${50 + Math.random() * 20 - 10}%`;
      particle.style.top = `${50 + Math.random() * 20 - 10}%`;
      particlesRef.current.appendChild(particle);
      
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        opacity: 0,
        duration: 1 + Math.random(),
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  };

  const createBloomingEffect = () => {
    if (!particlesRef.current) return;
    
    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'absolute w-2 h-2 bg-coffee-light rounded-full opacity-60';
      bubble.style.left = `${45 + Math.random() * 10}%`;
      bubble.style.top = '60%';
      particlesRef.current.appendChild(bubble);
      
      gsap.to(bubble, {
        y: -80,
        x: (Math.random() - 0.5) * 40,
        scale: Math.random() * 0.5 + 0.5,
        opacity: 0,
        duration: 2 + Math.random(),
        ease: 'power2.out',
        onComplete: () => bubble.remove()
      });
    }
  };

  const createWaterDroplets = () => {
    if (!particlesRef.current) return;
    
    const interval = setInterval(() => {
      const droplet = document.createElement('div');
      droplet.className = 'absolute w-1 h-3 bg-blue-400 rounded-full opacity-70';
      droplet.style.left = `${48 + Math.random() * 4}%`;
      droplet.style.top = '20%';
      particlesRef.current.appendChild(droplet);
      
      gsap.to(droplet, {
        y: 200,
        duration: 1,
        ease: 'power2.in',
        onComplete: () => droplet.remove()
      });
    }, 200);
    
    setTimeout(() => clearInterval(interval), 3000);
  };

  const createBrewingBubbles = () => {
    if (!particlesRef.current) return;
    
    const interval = setInterval(() => {
      const bubble = document.createElement('div');
      bubble.className = 'absolute w-1 h-1 bg-coffee-brown rounded-full opacity-40';
      bubble.style.left = `${40 + Math.random() * 20}%`;
      bubble.style.bottom = '20%';
      particlesRef.current.appendChild(bubble);
      
      gsap.to(bubble, {
        y: -100,
        x: (Math.random() - 0.5) * 20,
        scale: Math.random() * 2 + 1,
        opacity: 0,
        duration: 3 + Math.random() * 2,
        ease: 'power2.out',
        onComplete: () => bubble.remove()
      });
    }, 300);
    
    setTimeout(() => clearInterval(interval), 10000);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStage(0);
    setProgress(0);
    setTemperature(20);
    gsap.killTweensOf('*');
    if (particlesRef.current) {
      particlesRef.current.innerHTML = '';
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-8 bg-gradient-to-b from-cream to-white rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-coffee-brown mb-4 font-playfair">
          Advanced Coffee Brewing Simulation
        </h2>
        <p className="text-coffee-dark">
          Experience the complete coffee brewing process with realistic physics and timing
        </p>
      </div>

      {/* Brewing Apparatus */}
      <div className="relative h-96 mb-8 bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl overflow-hidden">
        {/* Coffee Dripper */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-24 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-full">
          {/* Water */}
          <div 
            ref={waterRef}
            className="absolute bottom-0 left-2 right-2 bg-gradient-to-b from-blue-300 to-blue-500 rounded-b-lg opacity-0"
          />
        </div>

        {/* Coffee Grounds */}
        <div 
          ref={coffeeRef}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-coffee-brown rounded-lg"
        />

        {/* Steam */}
        <div ref={steamRef} className="absolute top-4 left-1/2 transform -translate-x-1/2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-0"
              style={{ left: `${i * 8 - 16}px`, top: `${i * 4}px` }}
            />
          ))}
        </div>

        {/* Coffee Cup */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-32 bg-gradient-to-b from-white to-gray-100 rounded-b-lg border-2 border-gray-300">
          {/* Coffee Level */}
          <motion.div
            className="absolute bottom-2 left-2 right-2 bg-gradient-to-b from-coffee-light to-coffee-brown rounded-b-lg"
            animate={{
              height: currentStage > 3 ? `${Math.min(progress * 0.8, 80)}%` : '0%'
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Particles Container */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      </div>

      {/* Stage Information */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <Timer className="h-5 w-5 text-coffee-brown mr-2" />
            <span className="font-semibold">Current Stage</span>
          </div>
          <p className="text-lg font-bold text-coffee-brown">
            {brewingStages[currentStage]?.name || 'Ready'}
          </p>
          <p className="text-sm text-coffee-dark">
            {brewingStages[currentStage]?.description || 'Ready to start brewing'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <Thermometer className="h-5 w-5 text-red-500 mr-2" />
            <span className="font-semibold">Temperature</span>
          </div>
          <p className="text-2xl font-bold text-red-500">{temperature}°C</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(temperature / 100) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <Droplets className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-semibold">Progress</span>
          </div>
          <p className="text-2xl font-bold text-blue-500">{Math.round(progress)}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <motion.div 
              className="bg-gradient-to-r from-coffee-brown to-gold h-2 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={togglePlayPause}
          className="bg-coffee-brown hover:bg-coffee-dark text-cream px-6 py-3"
        >
          {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
          {isPlaying ? 'Pause' : 'Start Brewing'}
        </Button>
        
        <Button
          onClick={resetAnimation}
          variant="outline"
          className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-cream px-6 py-3"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset
        </Button>
      </div>

      {/* Stage Timeline */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-coffee-brown mb-4 font-playfair">Brewing Timeline</h3>
        <div className="flex flex-wrap gap-2">
          {brewingStages.slice(0, -1).map((stage, index) => (
            <div
              key={stage.name}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                index === currentStage
                  ? 'bg-coffee-brown text-cream scale-105'
                  : index < currentStage
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stage.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}