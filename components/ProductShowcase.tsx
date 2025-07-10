'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard3D } from '@/components/animations/ProductCard3D';

const products = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    price: 24.99,
    originalPrice: 29.99,
    image: 'https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Floral and citrusy with bright acidity',
    rating: 4.9,
    category: 'Single Origin',
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    price: 22.99,
    originalPrice: 26.99,
    image: 'https://images.pexels.com/photos/4226879/pexels-photo-4226879.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Full-bodied with caramel sweetness',
    rating: 4.8,
    category: 'Single Origin',
  },
  {
    id: 3,
    name: 'House Blend',
    price: 19.99,
    originalPrice: 23.99,
    image: 'https://images.pexels.com/photos/4226900/pexels-photo-4226900.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Perfectly balanced for everyday enjoyment',
    rating: 4.7,
    category: 'Blend',
  },
  {
    id: 4,
    name: 'Dark Roast Espresso',
    price: 26.99,
    originalPrice: 31.99,
    image: 'https://images.pexels.com/photos/4226885/pexels-photo-4226885.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Bold and intense with chocolate notes',
    rating: 4.9,
    category: 'Espresso',
  },
];

export function ProductShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [favorites, setFavorites] = useState<number[]>([]);

  const handleAddToCart = (product: any) => {
    console.log('Added to cart:', product);
    // Add cart logic here
  };

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-cream to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-brown mb-6 font-playfair">
            Our Premium Selection
          </h2>
          <p className="text-xl text-coffee-dark max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated collection of the world's finest coffee beans, 
            each roasted to perfection to deliver an unforgettable experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <ProductCard3D
                product={product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}