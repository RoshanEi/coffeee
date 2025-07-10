'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Hand, Zap, RotateCw, Move, ZoomIn, ZoomOut } from 'lucide-react';

interface GestureEvent {
  type: 'swipe' | 'pinch' | 'rotate' | 'tap' | 'hold';
  direction?: 'left' | 'right' | 'up' | 'down';
  intensity: number;
  position: { x: number; y: number };
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export function GestureControls({ onGesture }: { onGesture?: (gesture: GestureEvent) => void }) {
  const gestureAreaRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string>('');
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [gestureHistory, setGestureHistory] = useState<GestureEvent[]>([]);
  
  const controls = useAnimation();

  // Touch tracking
  const [initialTouches, setInitialTouches] = useState<TouchPoint[]>([]);
  const [lastTouches, setLastTouches] = useState<TouchPoint[]>([]);

  const getTouchPoints = useCallback((touches: TouchList): TouchPoint[] => {
    return Array.from(touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }));
  }, []);

  const calculateDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }, []);

  const calculateAngle = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  }, []);

  const detectSwipe = useCallback((start: TouchPoint, end: TouchPoint): GestureEvent | null => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = calculateDistance(start, end);
    
    if (distance < 50) return null; // Minimum swipe distance
    
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    let direction: 'left' | 'right' | 'up' | 'down';
    
    if (angle >= -45 && angle <= 45) direction = 'right';
    else if (angle >= 45 && angle <= 135) direction = 'down';
    else if (angle >= 135 || angle <= -135) direction = 'left';
    else direction = 'up';
    
    return {
      type: 'swipe',
      direction,
      intensity: Math.min(distance / 200, 1),
      position: { x: end.x, y: end.y }
    };
  }, [calculateDistance]);

  const detectPinch = useCallback((initialTouches: TouchPoint[], currentTouches: TouchPoint[]): GestureEvent | null => {
    if (initialTouches.length !== 2 || currentTouches.length !== 2) return null;
    
    const initialDistance = calculateDistance(initialTouches[0], initialTouches[1]);
    const currentDistance = calculateDistance(currentTouches[0], currentTouches[1]);
    
    const scale = currentDistance / initialDistance;
    
    if (Math.abs(scale - 1) < 0.1) return null; // Minimum pinch threshold
    
    const centerX = (currentTouches[0].x + currentTouches[1].x) / 2;
    const centerY = (currentTouches[0].y + currentTouches[1].y) / 2;
    
    return {
      type: 'pinch',
      intensity: Math.abs(scale - 1),
      position: { x: centerX, y: centerY }
    };
  }, [calculateDistance]);

  const detectRotation = useCallback((initialTouches: TouchPoint[], currentTouches: TouchPoint[]): GestureEvent | null => {
    if (initialTouches.length !== 2 || currentTouches.length !== 2) return null;
    
    const initialAngle = calculateAngle(initialTouches[0], initialTouches[1]);
    const currentAngle = calculateAngle(currentTouches[0], currentTouches[1]);
    
    let angleDiff = currentAngle - initialAngle;
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    
    if (Math.abs(angleDiff) < 10) return null; // Minimum rotation threshold
    
    const centerX = (currentTouches[0].x + currentTouches[1].x) / 2;
    const centerY = (currentTouches[0].y + currentTouches[1].y) / 2;
    
    return {
      type: 'rotate',
      intensity: Math.abs(angleDiff) / 180,
      position: { x: centerX, y: centerY }
    };
  }, [calculateAngle]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    setIsActive(true);
    const touches = getTouchPoints(e.touches);
    setInitialTouches(touches);
    setLastTouches(touches);
    setTouchPoints(touches);
    
    controls.start({
      scale: 1.05,
      backgroundColor: 'rgba(139, 69, 19, 0.1)',
      transition: { duration: 0.2 }
    });
  }, [getTouchPoints, controls]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touches = getTouchPoints(e.touches);
    setTouchPoints(touches);
    
    if (touches.length === 1 && initialTouches.length === 1) {
      // Single finger - detect swipe
      const swipe = detectSwipe(initialTouches[0], touches[0]);
      if (swipe) {
        setCurrentGesture(`Swipe ${swipe.direction}`);
      }
    } else if (touches.length === 2 && initialTouches.length === 2) {
      // Two fingers - detect pinch or rotation
      const pinch = detectPinch(initialTouches, touches);
      const rotation = detectRotation(initialTouches, touches);
      
      if (pinch && pinch.intensity > 0.2) {
        setCurrentGesture(pinch.intensity > 0 ? 'Pinch Out' : 'Pinch In');
      } else if (rotation && rotation.intensity > 0.1) {
        setCurrentGesture('Rotate');
      }
    }
    
    setLastTouches(touches);
  }, [getTouchPoints, initialTouches, detectSwipe, detectPinch, detectRotation]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touches = getTouchPoints(e.touches);
    
    if (touches.length === 0) {
      // All fingers lifted
      setIsActive(false);
      
      if (lastTouches.length === 1 && initialTouches.length === 1) {
        const swipe = detectSwipe(initialTouches[0], lastTouches[0]);
        if (swipe) {
          onGesture?.(swipe);
          setGestureHistory(prev => [...prev.slice(-4), swipe]);
        } else {
          // Tap gesture
          const tap: GestureEvent = {
            type: 'tap',
            intensity: 1,
            position: { x: lastTouches[0].x, y: lastTouches[0].y }
          };
          onGesture?.(tap);
          setGestureHistory(prev => [...prev.slice(-4), tap]);
        }
      } else if (lastTouches.length === 2 && initialTouches.length === 2) {
        const pinch = detectPinch(initialTouches, lastTouches);
        const rotation = detectRotation(initialTouches, lastTouches);
        
        if (pinch) {
          onGesture?.(pinch);
          setGestureHistory(prev => [...prev.slice(-4), pinch]);
        } else if (rotation) {
          onGesture?.(rotation);
          setGestureHistory(prev => [...prev.slice(-4), rotation]);
        }
      }
      
      setCurrentGesture('');
      setTouchPoints([]);
      setInitialTouches([]);
      setLastTouches([]);
      
      controls.start({
        scale: 1,
        backgroundColor: 'rgba(139, 69, 19, 0.05)',
        transition: { duration: 0.3 }
      });
    }
  }, [getTouchPoints, lastTouches, initialTouches, detectSwipe, detectPinch, detectRotation, onGesture, controls]);

  // Mouse events for desktop testing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const touch: TouchPoint = {
      id: 0,
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    };
    setInitialTouches([touch]);
    setIsActive(true);
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (initialTouches.length > 0) {
      const endTouch: TouchPoint = {
        id: 0,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      };
      
      const swipe = detectSwipe(initialTouches[0], endTouch);
      if (swipe) {
        onGesture?.(swipe);
        setGestureHistory(prev => [...prev.slice(-4), swipe]);
      } else {
        const tap: GestureEvent = {
          type: 'tap',
          intensity: 1,
          position: { x: endTouch.x, y: endTouch.y }
        };
        onGesture?.(tap);
        setGestureHistory(prev => [...prev.slice(-4), tap]);
      }
    }
    
    setIsActive(false);
    setInitialTouches([]);
  }, [initialTouches, detectSwipe, onGesture]);

  useEffect(() => {
    const element = gestureAreaRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const getGestureIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'swipe left':
      case 'swipe right':
      case 'swipe up':
      case 'swipe down':
        return <Move className="h-5 w-5" />;
      case 'pinch in':
        return <ZoomOut className="h-5 w-5" />;
      case 'pinch out':
        return <ZoomIn className="h-5 w-5" />;
      case 'rotate':
        return <RotateCw className="h-5 w-5" />;
      default:
        return <Hand className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-b from-cream to-white rounded-2xl shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-coffee-brown mb-2 font-playfair">
          Advanced Gesture Controls
        </h2>
        <p className="text-coffee-dark">
          Use touch gestures to interact with the coffee experience
        </p>
      </div>

      {/* Gesture Area */}
      <motion.div
        ref={gestureAreaRef}
        animate={controls}
        className="relative h-64 bg-gradient-to-br from-coffee-brown/5 to-gold/10 rounded-xl border-2 border-dashed border-coffee-brown/20 mb-6 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Hand className="h-12 w-12 text-coffee-brown/40 mx-auto mb-2" />
            <p className="text-coffee-brown/60 font-medium">
              {isActive ? 'Gesture Active' : 'Touch or click here to test gestures'}
            </p>
            {currentGesture && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 px-4 py-2 bg-coffee-brown text-cream rounded-full inline-flex items-center space-x-2"
              >
                {getGestureIcon(currentGesture)}
                <span>{currentGesture}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Touch Points Visualization */}
        {touchPoints.map((point, index) => (
          <motion.div
            key={point.id}
            className="absolute w-8 h-8 bg-coffee-brown/30 rounded-full border-2 border-coffee-brown/50"
            style={{
              left: point.x - 16,
              top: point.y - 16,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="absolute inset-0 bg-coffee-brown/20 rounded-full animate-ping" />
          </motion.div>
        ))}
      </motion.div>

      {/* Gesture Instructions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <Move className="h-8 w-8 text-coffee-brown mx-auto mb-2" />
          <h3 className="font-semibold text-coffee-brown">Swipe</h3>
          <p className="text-sm text-coffee-dark">Drag in any direction</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <ZoomIn className="h-8 w-8 text-coffee-brown mx-auto mb-2" />
          <h3 className="font-semibold text-coffee-brown">Pinch</h3>
          <p className="text-sm text-coffee-dark">Two fingers to zoom</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <RotateCw className="h-8 w-8 text-coffee-brown mx-auto mb-2" />
          <h3 className="font-semibold text-coffee-brown">Rotate</h3>
          <p className="text-sm text-coffee-dark">Twist with two fingers</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <Zap className="h-8 w-8 text-coffee-brown mx-auto mb-2" />
          <h3 className="font-semibold text-coffee-brown">Tap</h3>
          <p className="text-sm text-coffee-dark">Quick touch</p>
        </div>
      </div>

      {/* Gesture History */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-semibold text-coffee-brown mb-3">Recent Gestures</h3>
        <div className="flex flex-wrap gap-2">
          {gestureHistory.length === 0 ? (
            <p className="text-coffee-dark/60 italic">No gestures detected yet</p>
          ) : (
            gestureHistory.map((gesture, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 bg-coffee-brown/10 px-3 py-1 rounded-full"
              >
                {getGestureIcon(gesture.type + (gesture.direction ? ` ${gesture.direction}` : ''))}
                <span className="text-sm font-medium text-coffee-brown">
                  {gesture.type}
                  {gesture.direction && ` ${gesture.direction}`}
                </span>
                <span className="text-xs text-coffee-brown/60">
                  {Math.round(gesture.intensity * 100)}%
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}