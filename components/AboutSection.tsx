'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Coffee, Heart, Leaf, Award } from 'lucide-react';

const features = [
  {
    icon: Coffee,
    title: 'Artisan Roasting',
    description: 'Our master roasters craft each batch with precision and passion, bringing out the unique characteristics of every bean.',
  },
  {
    icon: Heart,
    title: 'Ethical Sourcing',
    description: 'We partner directly with farmers, ensuring fair trade practices and sustainable growing methods.',
  },
  {
    icon: Leaf,
    title: 'Organic Quality',
    description: 'All our beans are certified organic, grown without pesticides or artificial fertilizers.',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized globally for our exceptional quality and innovative brewing techniques.',
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" className="py-20 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-brown mb-6 font-playfair">
            Our Story
          </h2>
          <p className="text-xl text-coffee-dark max-w-3xl mx-auto leading-relaxed">
            Founded in the heart of the mountains, Shinmen Coffee began as a dream to bring the 
            world's finest coffee experiences to every cup. Our journey spans decades of 
            relationships with coffee farmers, perfecting our craft, and creating moments 
            that connect people through the universal language of great coffee.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-coffee-brown rounded-full mb-4 group-hover:bg-gold transition-colors duration-300"
              >
                <feature.icon className="h-8 w-8 text-cream" />
              </motion.div>
              <h3 className="text-xl font-semibold text-coffee-brown mb-2 font-playfair">
                {feature.title}
              </h3>
              <p className="text-coffee-dark leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-coffee-brown text-cream px-8 py-4 rounded-lg">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold font-playfair">25+</div>
                <div className="text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-playfair">50+</div>
                <div className="text-sm">Coffee Origins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-playfair">100K+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}