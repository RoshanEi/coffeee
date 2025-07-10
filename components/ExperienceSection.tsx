'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-white to-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-brown mb-6 font-playfair">
            The Shinmen Experience
          </h2>
          <p className="text-xl text-coffee-dark max-w-3xl mx-auto leading-relaxed">
            Step into our world where every detail is crafted to create an unforgettable 
            coffee experience that engages all your senses.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Virtual Tour */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              <img
                src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Coffee shop interior"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/90 text-coffee-brown rounded-full p-4 shadow-lg"
                >
                  <Play className="h-8 w-8" />
                </motion.button>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-coffee-brown mb-2 font-playfair">
                Virtual Coffee Shop Tour
              </h3>
              <p className="text-coffee-dark">
                Experience our atmosphere from anywhere in the world
              </p>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-coffee-brown text-cream p-3 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-coffee-brown font-playfair">
                    Prime Locations
                  </h4>
                  <p className="text-coffee-dark">
                    Find us in the heart of downtown, perfect for your daily coffee ritual
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-coffee-brown text-cream p-3 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-coffee-brown font-playfair">
                    Open Daily
                  </h4>
                  <p className="text-coffee-dark">
                    Monday - Sunday: 6:00 AM - 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-coffee-brown text-cream p-3 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-coffee-brown font-playfair">
                    Community Hub
                  </h4>
                  <p className="text-coffee-dark">
                    A gathering place for coffee lovers, remote workers, and friends
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="text-3xl font-bold text-coffee-brown mb-6 font-playfair">
            Ready to Visit Us?
          </h3>
          <div className="space-x-4">
            <Button
              size="lg"
              className="bg-coffee-brown hover:bg-coffee-dark text-cream px-8 py-3 text-lg"
            >
              Find Locations
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-cream px-8 py-3 text-lg"
            >
              Book a Table
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}