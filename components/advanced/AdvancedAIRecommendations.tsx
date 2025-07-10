'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, User, Clock, MapPin, Thermometer, Heart, Star, Coffee, Zap } from 'lucide-react';
import { ProductCard3D } from '@/components/animations/ProductCard3D';
import { Button } from '@/components/ui/button';

interface UserProfile {
  preferences: {
    flavorProfile: string[];
    strength: number;
    temperature: 'hot' | 'cold' | 'both';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
    milkType: string;
    sweetness: number;
    caffeine: number;
  };
  behavior: {
    orderFrequency: number;
    averageSpend: number;
    favoriteTime: string;
    seasonalPreference: string;
    loyaltyScore: number;
  };
  context: {
    weather: string;
    mood: string;
    activity: string;
    location: string;
    socialSetting: string;
  };
  history: {
    recentOrders: number[];
    ratings: { [key: number]: number };
    feedback: string[];
  };
}

interface AdvancedRecommendation {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  category: string;
  confidence: number;
  reasons: string[];
  personalizedScore: number;
  contextualRelevance: number;
  noveltyScore: number;
  tags: string[];
  nutritionalInfo: {
    calories: number;
    caffeine: number;
    sugar: number;
  };
  preparationTime: number;
  availability: boolean;
}

const mockUserProfile: UserProfile = {
  preferences: {
    flavorProfile: ['citrus', 'floral', 'bright', 'fruity'],
    strength: 4,
    temperature: 'hot',
    timeOfDay: 'morning',
    milkType: 'oat',
    sweetness: 2,
    caffeine: 4
  },
  behavior: {
    orderFrequency: 5,
    averageSpend: 12.50,
    favoriteTime: '08:30',
    seasonalPreference: 'spring',
    loyaltyScore: 85
  },
  context: {
    weather: 'sunny',
    mood: 'energetic',
    activity: 'work',
    location: 'office',
    socialSetting: 'alone'
  },
  history: {
    recentOrders: [1, 3, 5, 2, 1],
    ratings: { 1: 5, 2: 4, 3: 5, 4: 3, 5: 5 },
    feedback: ['Perfect strength', 'Love the aroma', 'Too bitter', 'Amazing flavor']
  }
};

export function AdvancedAIRecommendations() {
  const [recommendations, setRecommendations] = useState<AdvancedRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [activeAlgorithm, setActiveAlgorithm] = useState<'neural' | 'collaborative' | 'hybrid'>('hybrid');
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);

  // Advanced AI algorithms
  const neuralNetworkRecommendation = useCallback((profile: UserProfile): AdvancedRecommendation[] => {
    // Simulate neural network processing
    const weights = {
      flavor: 0.35,
      strength: 0.25,
      context: 0.20,
      history: 0.15,
      novelty: 0.05
    };

    const products: AdvancedRecommendation[] = [
      {
        id: 1,
        name: 'Ethiopian Yirgacheffe Supreme',
        price: 26.99,
        image: 'https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Bright citrus notes with floral undertones, perfect for your morning routine',
        rating: 4.9,
        category: 'Single Origin',
        confidence: 0,
        reasons: [],
        personalizedScore: 0,
        contextualRelevance: 0,
        noveltyScore: 0,
        tags: ['citrus', 'floral', 'bright', 'premium'],
        nutritionalInfo: { calories: 5, caffeine: 180, sugar: 0 },
        preparationTime: 4,
        availability: true
      },
      {
        id: 2,
        name: 'Colombian Geisha Microlot',
        price: 34.99,
        image: 'https://images.pexels.com/photos/4226879/pexels-photo-4226879.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Exotic floral complexity with tea-like body and jasmine finish',
        rating: 4.8,
        category: 'Specialty',
        confidence: 0,
        reasons: [],
        personalizedScore: 0,
        contextualRelevance: 0,
        noveltyScore: 0,
        tags: ['floral', 'exotic', 'complex', 'rare'],
        nutritionalInfo: { calories: 5, caffeine: 160, sugar: 0 },
        preparationTime: 5,
        availability: true
      },
      {
        id: 3,
        name: 'Kenya AA Nyeri',
        price: 28.99,
        image: 'https://images.pexels.com/photos/4226900/pexels-photo-4226900.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Wine-like acidity with blackcurrant notes and full body',
        rating: 4.7,
        category: 'Single Origin',
        confidence: 0,
        reasons: [],
        personalizedScore: 0,
        contextualRelevance: 0,
        noveltyScore: 0,
        tags: ['wine-like', 'fruity', 'full-body', 'acidic'],
        nutritionalInfo: { calories: 5, caffeine: 200, sugar: 0 },
        preparationTime: 4,
        availability: true
      }
    ];

    // Calculate scores using neural network simulation
    return products.map(product => {
      // Flavor matching
      const flavorMatch = product.tags.filter(tag => 
        profile.preferences.flavorProfile.includes(tag)
      ).length / profile.preferences.flavorProfile.length;

      // Strength matching
      const strengthMatch = 1 - Math.abs(product.nutritionalInfo.caffeine / 200 - profile.preferences.strength / 5);

      // Context relevance
      const contextScore = profile.context.mood === 'energetic' && product.nutritionalInfo.caffeine > 150 ? 1 : 0.7;

      // History analysis
      const historyScore = profile.history.recentOrders.includes(product.id) ? 0.3 : 0.8;

      // Novelty factor
      const noveltyScore = profile.history.recentOrders.includes(product.id) ? 0.2 : 0.9;

      // Calculate weighted score
      const personalizedScore = (
        flavorMatch * weights.flavor +
        strengthMatch * weights.strength +
        contextScore * weights.context +
        historyScore * weights.history +
        noveltyScore * weights.novelty
      );

      // Generate reasons
      const reasons = [];
      if (flavorMatch > 0.5) reasons.push(`Matches your ${profile.preferences.flavorProfile.join(', ')} preferences`);
      if (strengthMatch > 0.7) reasons.push('Perfect caffeine level for your taste');
      if (contextScore > 0.8) reasons.push(`Ideal for your current ${profile.context.mood} mood`);
      if (noveltyScore > 0.7) reasons.push('New discovery based on your taste profile');

      return {
        ...product,
        confidence: Math.round(personalizedScore * 100),
        personalizedScore,
        contextualRelevance: contextScore,
        noveltyScore,
        reasons
      };
    }).sort((a, b) => b.personalizedScore - a.personalizedScore);
  }, []);

  const collaborativeFiltering = useCallback((profile: UserProfile): AdvancedRecommendation[] => {
    // Simulate collaborative filtering
    const similarUsers = [
      { similarity: 0.89, preferences: ['citrus', 'bright', 'floral'] },
      { similarity: 0.76, preferences: ['fruity', 'wine-like', 'complex'] },
      { similarity: 0.82, preferences: ['floral', 'exotic', 'premium'] }
    ];

    // This would normally query a database of similar users
    return neuralNetworkRecommendation(profile).map(rec => ({
      ...rec,
      confidence: Math.min(rec.confidence + 10, 100),
      reasons: [...rec.reasons, 'Loved by users with similar taste profiles']
    }));
  }, [neuralNetworkRecommendation]);

  const hybridRecommendation = useCallback((profile: UserProfile): AdvancedRecommendation[] => {
    const neuralRecs = neuralNetworkRecommendation(profile);
    const collabRecs = collaborativeFiltering(profile);
    
    // Combine and weight both approaches
    return neuralRecs.map((neural, index) => {
      const collab = collabRecs[index];
      return {
        ...neural,
        confidence: Math.round((neural.confidence * 0.7 + collab.confidence * 0.3)),
        reasons: [...new Set([...neural.reasons, ...collab.reasons])].slice(0, 3)
      };
    });
  }, [neuralNetworkRecommendation, collaborativeFiltering]);

  const generateInsights = useCallback((profile: UserProfile, recommendations: AdvancedRecommendation[]) => {
    const insights = [];
    
    // Analyze patterns
    if (profile.preferences.flavorProfile.includes('citrus')) {
      insights.push('You have a preference for bright, acidic coffees');
    }
    
    if (profile.behavior.orderFrequency > 4) {
      insights.push('You\'re a frequent coffee drinker - consider our subscription service');
    }
    
    if (recommendations[0]?.confidence > 90) {
      insights.push('We found a perfect match for your taste profile!');
    }
    
    if (profile.context.weather === 'sunny') {
      insights.push('Sunny weather detected - lighter roasts might be perfect today');
    }
    
    return insights;
  }, []);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate AI processing steps
    const steps = [
      'Analyzing taste preferences...',
      'Processing behavioral patterns...',
      'Evaluating contextual factors...',
      'Running neural network...',
      'Applying collaborative filtering...',
      'Generating personalized scores...',
      'Finalizing recommendations...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnalysisProgress((i + 1) / steps.length * 100);
    }
    
    let recs: AdvancedRecommendation[];
    switch (activeAlgorithm) {
      case 'neural':
        recs = neuralNetworkRecommendation(userProfile);
        break;
      case 'collaborative':
        recs = collaborativeFiltering(userProfile);
        break;
      case 'hybrid':
      default:
        recs = hybridRecommendation(userProfile);
        break;
    }
    
    setRecommendations(recs);
    setInsights(generateInsights(userProfile, recs));
    setIsAnalyzing(false);
  }, [activeAlgorithm, userProfile, neuralNetworkRecommendation, collaborativeFiltering, hybridRecommendation, generateInsights]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const handleProductSelect = (product: AdvancedRecommendation) => {
    console.log('Selected product:', product);
    // Update user history
    setUserProfile(prev => ({
      ...prev,
      history: {
        ...prev.history,
        recentOrders: [product.id, ...prev.history.recentOrders.slice(0, 4)]
      }
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-b from-cream to-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Brain className="h-10 w-10 text-gold mr-3" />
          <h2 className="text-4xl font-bold text-coffee-brown font-playfair">
            Advanced AI Coffee Recommendations
          </h2>
        </div>
        <p className="text-xl text-coffee-dark max-w-3xl mx-auto">
          Powered by machine learning, behavioral analysis, and contextual intelligence
        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full p-2 shadow-lg">
          {[
            { id: 'neural', label: 'Neural Network', icon: Brain },
            { id: 'collaborative', label: 'Collaborative', icon: User },
            { id: 'hybrid', label: 'Hybrid AI', icon: Sparkles }
          ].map((algo) => (
            <motion.button
              key={algo.id}
              onClick={() => setActiveAlgorithm(algo.id as any)}
              className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                activeAlgorithm === algo.id
                  ? 'bg-coffee-brown text-cream shadow-md'
                  : 'text-coffee-brown hover:bg-coffee-brown/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <algo.icon className="h-5 w-5 mr-2" />
              {algo.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Analysis Progress */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-coffee-brown font-semibold">AI Analysis in Progress</span>
              <span className="text-coffee-brown">{Math.round(analysisProgress)}%</span>
            </div>
            <div className="w-full bg-coffee-brown/20 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-coffee-brown to-gold h-3 rounded-full"
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mt-4 flex items-center">
              <Zap className="h-5 w-5 text-gold mr-2 animate-pulse" />
              <span className="text-coffee-dark">Processing your unique taste profile...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Insights */}
      {!isAnalyzing && insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-coffee-brown to-coffee-dark text-cream p-6 rounded-xl"
        >
          <h3 className="text-xl font-bold mb-4 font-playfair flex items-center">
            <Sparkles className="h-6 w-6 mr-2" />
            AI Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <Star className="h-4 w-4 mr-2 text-gold" />
                <span>{insight}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations Grid */}
      <AnimatePresence>
        {!isAnalyzing && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
          >
            {recommendations.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* AI Confidence Badge */}
                <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-gold to-gold-dark text-coffee-brown px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  <Brain className="h-3 w-3 inline mr-1" />
                  {product.confidence}%
                </div>
                
                <ProductCard3D
                  product={product}
                  onAddToCart={handleProductSelect}
                  onToggleFavorite={() => {}}
                />
                
                {/* AI Analysis Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="mt-4 p-4 bg-white rounded-lg shadow-md"
                >
                  <h4 className="font-semibold text-coffee-brown mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-gold" />
                    AI Analysis
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    {product.reasons.map((reason, reasonIndex) => (
                      <div key={reasonIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-coffee-brown rounded-full mt-1.5 mr-2 flex-shrink-0" />
                        <span className="text-coffee-dark">{reason}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-coffee-dark/60">
                    <span>Personalized: {Math.round(product.personalizedScore * 100)}%</span>
                    <span>Novelty: {Math.round(product.noveltyScore * 100)}%</span>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-coffee-brown/10 text-coffee-brown text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Summary */}
      {!isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-bold text-coffee-brown mb-4 font-playfair">
            Your Coffee Profile
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Coffee className="h-8 w-8 text-coffee-brown mx-auto mb-2" />
              <div className="text-2xl font-bold text-coffee-brown">{userProfile.preferences.strength}/5</div>
              <div className="text-sm text-coffee-dark">Strength Preference</div>
            </div>
            
            <div className="text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-500">{userProfile.behavior.loyaltyScore}%</div>
              <div className="text-sm text-coffee-dark">Loyalty Score</div>
            </div>
            
            <div className="text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-500">{userProfile.behavior.orderFrequency}</div>
              <div className="text-sm text-coffee-dark">Orders/Week</div>
            </div>
            
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">${userProfile.behavior.averageSpend}</div>
              <div className="text-sm text-coffee-dark">Avg. Spend</div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-sm text-coffee-dark">Flavor Profile:</span>
            {userProfile.preferences.flavorProfile.map((flavor, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-coffee-brown text-cream text-sm rounded-full"
              >
                {flavor}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Refresh Button */}
      <div className="text-center mt-8">
        <Button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="bg-coffee-brown hover:bg-coffee-dark text-cream px-8 py-3"
        >
          <Brain className="h-5 w-5 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Refresh Recommendations'}
        </Button>
      </div>
    </div>
  );
}