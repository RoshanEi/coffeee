'use client';

import { Coffee, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="bg-coffee-dark text-cream py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-gold" />
              <span className="text-xl font-bold font-playfair">Shinmen Coffee</span>
            </div>
            <p className="text-cream/80 leading-relaxed">
              Crafting exceptional coffee experiences since 1998. 
              Where every bean tells a story of passion and perfection.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold font-playfair">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Our Menu', 'Locations', 'Contact', 'Careers'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-cream/80 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Coffee Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold font-playfair">Coffee Info</h4>
            <ul className="space-y-2">
              {['Brewing Guide', 'Coffee Origins', 'Roasting Process', 'Sustainability', 'Wholesale'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-cream/80 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold font-playfair">Stay Connected</h4>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-coffee-brown p-2 rounded-full hover:bg-gold hover:text-coffee-brown transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
            <p className="text-sm text-cream/80 mt-4">
              Subscribe to our newsletter for updates and special offers.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-coffee-brown/30 mt-8 pt-8 text-center text-cream/60"
        >
          <p>&copy; 2024 Shinmen Coffee. All rights reserved. Made with ❤️ and lots of coffee.</p>
        </motion.div>
      </div>
    </footer>
  );
}