'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  category: string;
}

interface ProductCard3DProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  isFavorite?: boolean;
}

export function ProductCard3D({ 
  product, 
  onAddToCart, 
  onToggleFavorite,
  isFavorite = false 
}: ProductCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Card Content */}
      <div style={{ transform: 'translateZ(75px)' }}>
        {/* Image Container */}
        <div className="relative overflow-hidden h-48">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Overlay Elements */}
          <div className="absolute top-4 left-4 bg-gold text-coffee-brown px-2 py-1 rounded-full text-sm font-semibold">
            {product.category}
          </div>
          
          <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span className="text-sm font-semibold">{product.rating}</span>
          </div>

          {/* Favorite Button */}
          <motion.button
            className={`absolute bottom-4 right-4 p-2 rounded-full ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              scale: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.2 }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-coffee-brown mb-2 font-playfair">
            {product.name}
          </h3>
          <p className="text-coffee-dark text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <motion.span
                className="text-2xl font-bold text-coffee-brown"
                key={product.price}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                ${product.price}
              </motion.span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="w-full bg-coffee-brown hover:bg-coffee-dark text-cream transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <motion.div
                className="flex items-center justify-center"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 3D Shadow */}
      <motion.div
        className="absolute inset-0 bg-black/20 rounded-xl"
        style={{
          transform: 'translateZ(-75px)',
        }}
        animate={{
          opacity: isHovered ? 0.3 : 0.1,
        }}
      />
    </motion.div>
  );
}