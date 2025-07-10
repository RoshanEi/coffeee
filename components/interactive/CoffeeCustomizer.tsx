'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Thermometer, Droplets, Clock, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface CoffeeCustomization {
  size: 'small' | 'medium' | 'large';
  strength: number;
  temperature: number;
  milk: 'none' | 'regular' | 'oat' | 'almond' | 'soy';
  extras: string[];
  brewTime: number;
}

export function CoffeeCustomizer() {
  const [customization, setCustomization] = useState<CoffeeCustomization>({
    size: 'medium',
    strength: 3,
    temperature: 75,
    milk: 'regular',
    extras: [],
    brewTime: 4
  });

  const [isBrewingSimulation, setIsBrewingSimulation] = useState(false);
  const [brewProgress, setBrewProgress] = useState(0);

  const sizes = [
    { id: 'small', label: 'Small', volume: '8oz', price: 0 },
    { id: 'medium', label: 'Medium', volume: '12oz', price: 0.5 },
    { id: 'large', label: 'Large', volume: '16oz', price: 1.0 }
  ];

  const milkOptions = [
    { id: 'none', label: 'No Milk', price: 0 },
    { id: 'regular', label: 'Regular Milk', price: 0 },
    { id: 'oat', label: 'Oat Milk', price: 0.6 },
    { id: 'almond', label: 'Almond Milk', price: 0.5 },
    { id: 'soy', label: 'Soy Milk', price: 0.5 }
  ];

  const extraOptions = [
    { id: 'extra-shot', label: 'Extra Shot', price: 0.75 },
    { id: 'decaf', label: 'Decaf', price: 0 },
    { id: 'vanilla', label: 'Vanilla Syrup', price: 0.5 },
    { id: 'caramel', label: 'Caramel Syrup', price: 0.5 },
    { id: 'whipped-cream', label: 'Whipped Cream', price: 0.5 }
  ];

  const calculatePrice = () => {
    const basePrice = 4.50;
    const sizePrice = sizes.find(s => s.id === customization.size)?.price || 0;
    const milkPrice = milkOptions.find(m => m.id === customization.milk)?.price || 0;
    const extrasPrice = customization.extras.reduce((total, extra) => {
      const extraOption = extraOptions.find(e => e.id === extra);
      return total + (extraOption?.price || 0);
    }, 0);
    
    return basePrice + sizePrice + milkPrice + extrasPrice;
  };

  const toggleExtra = (extraId: string) => {
    setCustomization(prev => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter(e => e !== extraId)
        : [...prev.extras, extraId]
    }));
  };

  const startBrewingSimulation = () => {
    setIsBrewingSimulation(true);
    setBrewProgress(0);
    
    const interval = setInterval(() => {
      setBrewProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBrewingSimulation(false);
          return 100;
        }
        return prev + (100 / (customization.brewTime * 10));
      });
    }, 100);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-brown mb-6 font-playfair">
            Craft Your Perfect Cup
          </h2>
          <p className="text-xl text-coffee-dark max-w-3xl mx-auto">
            Customize every aspect of your coffee experience with our interactive brewing tool
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Customization Panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Size Selection */}
            <div>
              <h3 className="text-2xl font-bold text-coffee-brown mb-4 font-playfair">
                Choose Your Size
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {sizes.map((size) => (
                  <motion.button
                    key={size.id}
                    onClick={() => setCustomization(prev => ({ ...prev, size: size.id as any }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      customization.size === size.id
                        ? 'border-coffee-brown bg-coffee-brown text-cream'
                        : 'border-coffee-brown/20 hover:border-coffee-brown/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Coffee className={`h-8 w-8 mx-auto mb-2 ${
                      size.id === 'small' ? 'scale-75' : size.id === 'large' ? 'scale-125' : ''
                    }`} />
                    <div className="font-semibold">{size.label}</div>
                    <div className="text-sm opacity-75">{size.volume}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Strength Control */}
            <div>
              <h3 className="text-2xl font-bold text-coffee-brown mb-4 font-playfair">
                Coffee Strength
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Mild</span>
                  <Slider
                    value={[customization.strength]}
                    onValueChange={(value) => setCustomization(prev => ({ ...prev, strength: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm">Strong</span>
                </div>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <motion.div
                      key={level}
                      className={`w-4 h-8 rounded ${
                        level <= customization.strength ? 'bg-coffee-brown' : 'bg-coffee-brown/20'
                      }`}
                      animate={{
                        height: level <= customization.strength ? 32 : 16,
                        backgroundColor: level <= customization.strength ? '#8B4513' : 'rgba(139, 69, 19, 0.2)'
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Temperature Control */}
            <div>
              <h3 className="text-2xl font-bold text-coffee-brown mb-4 font-playfair">
                Temperature
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Thermometer className="h-5 w-5 text-coffee-brown" />
                  <Slider
                    value={[customization.temperature]}
                    onValueChange={(value) => setCustomization(prev => ({ ...prev, temperature: value[0] }))}
                    max={85}
                    min={60}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold">{customization.temperature}°C</span>
                </div>
                <motion.div
                  className="h-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 rounded-full relative"
                >
                  <motion.div
                    className="absolute top-0 w-4 h-4 bg-white border-2 border-coffee-brown rounded-full -mt-1"
                    animate={{
                      left: `${((customization.temperature - 60) / 25) * 100}%`
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Milk Options */}
            <div>
              <h3 className="text-2xl font-bold text-coffee-brown mb-4 font-playfair">
                Milk Choice
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {milkOptions.map((milk) => (
                  <motion.button
                    key={milk.id}
                    onClick={() => setCustomization(prev => ({ ...prev, milk: milk.id as any }))}
                    className={`p-3 rounded-lg border transition-all ${
                      customization.milk === milk.id
                        ? 'border-coffee-brown bg-coffee-brown text-cream'
                        : 'border-coffee-brown/20 hover:border-coffee-brown/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Droplets className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-sm font-semibold">{milk.label}</div>
                    {milk.price > 0 && (
                      <div className="text-xs opacity-75">+${milk.price.toFixed(2)}</div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div>
              <h3 className="text-2xl font-bold text-coffee-brown mb-4 font-playfair">
                Extras
              </h3>
              <div className="space-y-2">
                {extraOptions.map((extra) => (
                  <motion.button
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                      customization.extras.includes(extra.id)
                        ? 'border-coffee-brown bg-coffee-brown/10'
                        : 'border-coffee-brown/20 hover:border-coffee-brown/50'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="font-medium">{extra.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">+${extra.price.toFixed(2)}</span>
                      {customization.extras.includes(extra.id) ? (
                        <Minus className="h-4 w-4 text-coffee-brown" />
                      ) : (
                        <Plus className="h-4 w-4 text-coffee-brown" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Preview & Brewing Simulation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Coffee Cup Preview */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-coffee-brown mb-6 font-playfair text-center">
                Your Custom Coffee
              </h3>
              
              {/* Animated Coffee Cup */}
              <div className="relative mx-auto w-48 h-48 mb-6">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-coffee-light to-coffee-brown rounded-full"
                  animate={{
                    scale: customization.size === 'small' ? 0.8 : customization.size === 'large' ? 1.2 : 1
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Coffee Level */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4 bg-coffee-dark rounded-full"
                  animate={{
                    height: `${20 + (customization.strength * 8)}%`,
                    opacity: 0.8 + (customization.strength * 0.04)
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Milk Foam */}
                {customization.milk !== 'none' && (
                  <motion.div
                    className="absolute top-4 left-4 right-4 bg-cream rounded-full"
                    initial={{ height: 0 }}
                    animate={{ height: '20%' }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                
                {/* Steam Effect */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-8 bg-white/60 rounded-full"
                      style={{ left: `${i * 8 - 8}px` }}
                      animate={{
                        y: [-10, -30, -50],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 1.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Price Display */}
              <motion.div
                className="text-center mb-6"
                key={calculatePrice()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="text-3xl font-bold text-coffee-brown">
                  ${calculatePrice().toFixed(2)}
                </div>
              </motion.div>

              {/* Brewing Simulation */}
              <AnimatePresence>
                {isBrewingSimulation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Brewing...</span>
                      <span className="text-sm">{Math.round(brewProgress)}%</span>
                    </div>
                    <div className="w-full bg-coffee-brown/20 rounded-full h-2">
                      <motion.div
                        className="bg-coffee-brown h-2 rounded-full"
                        animate={{ width: `${brewProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={startBrewingSimulation}
                  disabled={isBrewingSimulation}
                  className="w-full bg-coffee-brown hover:bg-coffee-dark text-cream"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {isBrewingSimulation ? 'Brewing...' : 'Start Brewing Simulation'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-cream"
                >
                  Add to Cart - ${calculatePrice().toFixed(2)}
                </Button>
              </div>
            </div>

            {/* Brewing Tips */}
            <motion.div
              className="bg-gradient-to-r from-coffee-brown to-coffee-dark text-cream p-6 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-bold mb-3 font-playfair">Pro Brewing Tip</h4>
              <p className="text-sm opacity-90">
                {customization.strength >= 4 
                  ? "For strong coffee, use a coarser grind and longer extraction time to avoid bitterness."
                  : customization.temperature >= 80
                  ? "High temperature brewing extracts more oils and creates a fuller body."
                  : "Your mild, cooler brew will highlight the coffee's subtle flavor notes."}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}