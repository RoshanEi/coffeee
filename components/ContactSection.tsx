'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MorphingButton } from '@/components/animations/MorphingButton';

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <section id="contact" className="py-20 bg-coffee-brown text-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-playfair">
            Get in Touch
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold mb-8 font-playfair">
              Let's Connect
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gold text-coffee-brown p-3 rounded-full">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Phone</h4>
                  <p className="opacity-80">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-gold text-coffee-brown p-3 rounded-full">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Email</h4>
                  <p className="opacity-80">hello@shinmencoffee.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-gold text-coffee-brown p-3 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Address</h4>
                  <p className="opacity-80">123 Coffee Street<br />Downtown, City 12345</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-coffee-dark p-8 rounded-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-coffee-brown border-coffee-light text-cream placeholder-cream/60"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Your Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-coffee-brown border-coffee-light text-cream placeholder-cream/60"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Your Message
                </label>
                <Textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-coffee-brown border-coffee-light text-cream placeholder-cream/60"
                  placeholder="Tell us about your coffee experience or any questions you have..."
                />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MorphingButton
                  icon={Send}
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Send Message
                </MorphingButton>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}