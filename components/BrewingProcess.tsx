'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Coffee, Thermometer, Timer, CupSoda as Cup } from 'lucide-react';

export function BrewingProcess() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: Coffee,
      title: 'Select Your Beans',
      description: 'Choose from our premium selection of single-origin or blended coffee beans.',
      detail: 'We recommend starting with our Ethiopian Yirgacheffe for its bright, floral notes.',
    },
    {
      icon: Thermometer,
      title: 'Perfect Temperature',
      description: 'Heat water to the optimal temperature of 195-205°F (90-96°C).',
      detail: 'Temperature affects extraction - too hot burns the coffee, too cool under-extracts.',
    },
    {
      icon: Timer,
      title: 'Timing is Everything',
      description: 'Steep for 4-6 minutes depending on your preferred strength.',
      detail: 'Different brewing methods require different timing for optimal flavor extraction.',
    },
    {
      icon: Cup,
      title: 'Enjoy Your Cup',
      description: 'Savor the complex flavors and aromas of perfectly brewed coffee.',
      detail: 'Take a moment to appreciate the craftsmanship in every sip.',
    },
  ];

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section className="py-20 bg-coffee-brown text-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-playfair">
            The Perfect Brewing Process
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Master the art of coffee brewing with our step-by-step guide to creating 
            the perfect cup every time.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="flex space-x-4 bg-coffee-dark/50 p-2 rounded-full">
              {steps.map((step, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    activeStep === index
                      ? 'bg-gold text-coffee-brown'
                      : 'bg-transparent text-cream hover:bg-coffee-dark'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <step.icon className="h-6 w-6" />
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gold text-coffee-brown rounded-full mb-6">
              {React.createElement(steps[activeStep].icon, { className: "h-10 w-10" })}
            </div>
            
            <h3 className="text-3xl font-bold mb-4 font-playfair">
              Step {activeStep + 1}: {steps[activeStep].title}
            </h3>
            
            <p className="text-xl mb-6 opacity-90">
              {steps[activeStep].description}
            </p>
            
            <p className="text-lg opacity-75 max-w-2xl mx-auto">
              {steps[activeStep].detail}
            </p>
          </motion.div>

          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    index <= activeStep ? 'bg-gold' : 'bg-coffee-dark'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}