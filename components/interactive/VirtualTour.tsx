'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Maximize, Volume2, VolumeX, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TourStop {
  id: string;
  title: string;
  description: string;
  image: string;
  audio?: string;
  hotspots: {
    x: number;
    y: number;
    title: string;
    description: string;
  }[];
}

const tourStops: TourStop[] = [
  {
    id: 'entrance',
    title: 'Welcome to Shinmen Coffee',
    description: 'Step into our warm, inviting space where the aroma of freshly roasted coffee greets you.',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200',
    hotspots: [
      { x: 30, y: 40, title: 'Roasting Display', description: 'Watch our master roasters at work' },
      { x: 70, y: 60, title: 'Seating Area', description: 'Comfortable seating for all occasions' }
    ]
  },
  {
    id: 'counter',
    title: 'The Coffee Counter',
    description: 'Our expertly trained baristas craft each cup with precision and passion.',
    image: 'https://images.pexels.com/photos/1833769/pexels-photo-1833769.jpeg?auto=compress&cs=tinysrgb&w=1200',
    hotspots: [
      { x: 50, y: 30, title: 'Espresso Machine', description: 'Professional-grade equipment for perfect extraction' },
      { x: 25, y: 70, title: 'Bean Selection', description: 'Choose from our premium single-origin beans' }
    ]
  },
  {
    id: 'roastery',
    title: 'The Roastery',
    description: 'Behind the scenes where the magic happens - from green beans to perfect roasts.',
    image: 'https://images.pexels.com/photos/4226883/pexels-photo-4226883.jpeg?auto=compress&cs=tinysrgb&w=1200',
    hotspots: [
      { x: 60, y: 45, title: 'Roasting Machine', description: 'Small-batch roasting for optimal flavor' },
      { x: 20, y: 65, title: 'Green Beans', description: 'Ethically sourced from around the world' }
    ]
  }
];

export function VirtualTour() {
  const [currentStop, setCurrentStop] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tourRef = useRef<HTMLDivElement>(null);

  const nextStop = () => {
    setCurrentStop((prev) => (prev + 1) % tourStops.length);
    setSelectedHotspot(null);
  };

  const prevStop = () => {
    setCurrentStop((prev) => (prev - 1 + tourStops.length) % tourStops.length);
    setSelectedHotspot(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      tourRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentTourStop = tourStops[currentStop];

  return (
    <section className="py-20 bg-coffee-dark text-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-playfair">
            Virtual Coffee Shop Tour
          </h2>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Explore our coffee shop from anywhere in the world with our immersive 360° experience
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Main Tour Interface */}
          <motion.div
            ref={tourRef}
            className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'aspect-video'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Tour Image */}
            <div className="relative w-full h-full">
              <motion.img
                key={currentStop}
                src={currentTourStop.image}
                alt={currentTourStop.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              />

              {/* Hotspots */}
              <AnimatePresence>
                {currentTourStop.hotspots.map((hotspot, index) => (
                  <motion.button
                    key={`${currentStop}-${index}`}
                    className="absolute w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => setSelectedHotspot(selectedHotspot === index ? null : index)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      boxShadow: selectedHotspot === index 
                        ? '0 0 0 4px rgba(255, 215, 0, 0.3)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-coffee-brown rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.button>
                ))}
              </AnimatePresence>

              {/* Hotspot Info Panel */}
              <AnimatePresence>
                {selectedHotspot !== null && (
                  <motion.div
                    className="absolute bottom-20 left-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <h4 className="font-bold mb-2">
                      {currentTourStop.hotspots[selectedHotspot].title}
                    </h4>
                    <p className="text-sm opacity-90">
                      {currentTourStop.hotspots[selectedHotspot].description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tour Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-black/50 hover:bg-black/70 text-white border-none"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-black/50 hover:bg-black/70 text-white border-none"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={prevStop}
                    className="bg-black/50 hover:bg-black/70 text-white border-none"
                  >
                    ←
                  </Button>
                  
                  <span className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                    {currentStop + 1} / {tourStops.length}
                  </span>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={nextStop}
                    className="bg-black/50 hover:bg-black/70 text-white border-none"
                  >
                    →
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setCurrentStop(0)}
                    className="bg-black/50 hover:bg-black/70 text-white border-none"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={toggleFullscreen}
                    className="bg-black/50 hover:bg-black/70 text-white border-none"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tour Information */}
          <motion.div
            className="mt-8 grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Current Stop Info */}
            <div className="bg-cream text-coffee-brown p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 font-playfair">
                {currentTourStop.title}
              </h3>
              <p className="mb-4 leading-relaxed">
                {currentTourStop.description}
              </p>
              <div className="flex items-center text-sm opacity-75">
                <MapPin className="h-4 w-4 mr-2" />
                Stop {currentStop + 1} of {tourStops.length}
              </div>
            </div>

            {/* Tour Navigation */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold font-playfair">Tour Stops</h4>
              {tourStops.map((stop, index) => (
                <motion.button
                  key={stop.id}
                  onClick={() => setCurrentStop(index)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    index === currentStop
                      ? 'bg-gold text-coffee-brown'
                      : 'bg-cream/20 hover:bg-cream/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{stop.title}</div>
                      <div className="text-sm opacity-75 line-clamp-1">
                        {stop.description}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      index === currentStop ? 'bg-coffee-brown' : 'bg-cream/50'
                    }`} />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-4 font-playfair">
              Ready to Visit in Person?
            </h3>
            <p className="mb-6 opacity-90">
              Experience the full Shinmen Coffee atmosphere at one of our locations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-coffee-brown"
              >
                Find Locations
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cream text-cream hover:bg-cream hover:text-coffee-brown"
              >
                Book a Table
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}