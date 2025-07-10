'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, User } from 'lucide-react';
import { ProductCard3D } from '@/components/animations/ProductCard3D';

interface UserPreferences {
  flavorProfile: string[];
  strength: number;
  temperature: 'hot' | 'cold';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  previousOrders: number[];
}

interface Recommendation {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  category: string;
  confidence: number;
  reason: string;
}

interface SmartRecommendationsProps {
  userPreferences: UserPreferences;
  onProductSelect: (product: Recommendation) => void;
}

export function SmartRecommendations({ 
  userPreferences, 
  onProductSelect 
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ai' | 'trending' | 'personal'>('ai');

  // Simulate AI recommendation generation
  useEffect(() => {
    const generateRecommendations = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRecommendations: Recommendation[] = [
        {
          id: 1,
          name: 'Ethiopian Yirgacheffe',
          price: 24.99,
          image: 'https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=500',
          description: 'Perfect for your morning routine with bright citrus notes',
          rating: 4.9,
          category: 'Single Origin',
          confidence: 95,
          reason: 'Matches your preference for bright, acidic flavors'
        },
        {
          id: 2,
          name: 'Colombian Supremo',
          price: 22.99,
          image: 'https://images.pexels.com/photos/4226879/pexels-photo-4226879.jpeg?auto=compress&cs=tinysrgb&w=500',
          description: 'Full-bodied with caramel sweetness, ideal for afternoon',
          rating: 4.8,
          category: 'Single Origin',
          confidence: 88,
          reason: 'Similar to your recent purchases'
        },
        {
          id: 3,
          name: 'Cold Brew Concentrate',
          price: 19.99,
          image: 'https://images.pexels.com/photos/4226900/pexels-photo-4226900.jpeg?auto=compress&cs=tinysrgb&w=500',
          description: 'Smooth and refreshing for hot days',
          rating: 4.7,
          category: 'Cold Brew',
          confidence: 82,
          reason: 'Weather-based recommendation for today'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    };

    generateRecommendations();
  }, [userPreferences]);

  const tabs = [
    { id: 'ai', label: 'AI Picks', icon: Brain },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'personal', label: 'For You', icon: User }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-cream to-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-gold mr-3" />
            <h2 className="text-4xl font-bold text-coffee-brown font-playfair">
              Smart Recommendations
            </h2>
          </div>
          <p className="text-xl text-coffee-dark max-w-2xl mx-auto">
            Powered by AI to match your unique taste preferences and brewing habits
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-2 shadow-lg">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-coffee-brown text-cream shadow-md'
                    : 'text-coffee-brown hover:bg-coffee-brown/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-coffee-brown/20 border-t-coffee-brown rounded-full mx-auto mb-4"
                />
                <p className="text-coffee-dark">Analyzing your preferences...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations Grid */}
        <AnimatePresence>
          {!isLoading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {recommendations.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Confidence Badge */}
                  <div className="absolute -top-2 -right-2 z-10 bg-gold text-coffee-brown px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {product.confidence}% match
                  </div>
                  
                  <ProductCard3D
                    product={product}
                    onAddToCart={onProductSelect}
                    onToggleFavorite={() => {}}
                  />
                  
                  {/* AI Reason */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="mt-4 p-3 bg-coffee-brown/5 rounded-lg"
                  >
                    <p className="text-sm text-coffee-dark italic">
                      <Brain className="h-4 w-4 inline mr-2 text-gold" />
                      {product.reason}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personalization Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center bg-gradient-to-r from-coffee-brown to-coffee-dark text-cream p-8 rounded-2xl"
        >
          <h3 className="text-2xl font-bold mb-4 font-playfair">
            Want Better Recommendations?
          </h3>
          <p className="mb-6 opacity-90">
            Complete your taste profile to get even more personalized suggestions
          </p>
          <motion.button
            className="bg-gold text-coffee-brown px-8 py-3 rounded-full font-semibold hover:bg-gold-dark transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Complete Profile
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}