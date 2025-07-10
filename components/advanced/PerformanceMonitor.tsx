'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, HardDrive, Wifi, Zap, AlertTriangle, CheckCircle, TrendingUp, Monitor } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  networkLatency: number;
  renderTime: number;
  jsHeapSize: number;
  domNodes: number;
  resourceCount: number;
  cacheHitRate: number;
  errorCount: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  metric: string;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    networkLatency: 0,
    renderTime: 0,
    jsHeapSize: 0,
    domNodes: 0,
    resourceCount: 0,
    cacheHitRate: 100,
    errorCount: 0
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [historicalData, setHistoricalData] = useState<PerformanceMetrics[]>([]);
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const monitoringIntervalRef = useRef<NodeJS.Timeout>();

  // FPS Monitoring
  const measureFPS = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;
    
    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      fpsHistoryRef.current.push(fps);
      
      if (fpsHistoryRef.current.length > 60) {
        fpsHistoryRef.current.shift();
      }
      
      setMetrics(prev => ({ ...prev, fps }));
      
      // Check for FPS alerts
      if (fps < 30) {
        addAlert('warning', `Low FPS detected: ${fps}`, 'fps');
      }
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
    
    if (isMonitoring) {
      requestAnimationFrame(measureFPS);
    }
  }, [isMonitoring]);

  // Memory Usage Monitoring
  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedJSHeapSize = memory.usedJSHeapSize;
      const totalJSHeapSize = memory.totalJSHeapSize;
      const jsHeapSizeLimit = memory.jsHeapSizeLimit;
      
      const memoryUsage = (usedJSHeapSize / jsHeapSizeLimit) * 100;
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.round(memoryUsage),
        jsHeapSize: Math.round(usedJSHeapSize / 1048576) // Convert to MB
      }));
      
      // Check for memory alerts
      if (memoryUsage > 80) {
        addAlert('error', `High memory usage: ${Math.round(memoryUsage)}%`, 'memory');
      } else if (memoryUsage > 60) {
        addAlert('warning', `Elevated memory usage: ${Math.round(memoryUsage)}%`, 'memory');
      }
    }
  }, []);

  // Network Latency Monitoring
  const measureNetworkLatency = useCallback(async () => {
    try {
      const start = performance.now();
      await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' });
      const latency = performance.now() - start;
      
      setMetrics(prev => ({ ...prev, networkLatency: Math.round(latency) }));
      
      if (latency > 1000) {
        addAlert('warning', `High network latency: ${Math.round(latency)}ms`, 'network');
      }
    } catch (error) {
      addAlert('error', 'Network connectivity issue detected', 'network');
    }
  }, []);

  // DOM Performance Monitoring
  const measureDOMPerformance = useCallback(() => {
    const domNodes = document.querySelectorAll('*').length;
    const resourceCount = performance.getEntriesByType('resource').length;
    
    // Measure render time
    const paintEntries = performance.getEntriesByType('paint');
    const renderTime = paintEntries.length > 0 
      ? Math.round(paintEntries[paintEntries.length - 1].startTime)
      : 0;
    
    setMetrics(prev => ({
      ...prev,
      domNodes,
      resourceCount,
      renderTime
    }));
    
    // Check for DOM alerts
    if (domNodes > 5000) {
      addAlert('warning', `High DOM node count: ${domNodes}`, 'dom');
    }
  }, []);

  // Load Time Monitoring
  const measureLoadTime = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
      setMetrics(prev => ({ ...prev, loadTime }));
      
      if (loadTime > 3000) {
        addAlert('warning', `Slow page load: ${loadTime}ms`, 'load');
      }
    }
  }, []);

  // Add Performance Alert
  const addAlert = useCallback((type: 'warning' | 'error' | 'info', message: string, metric: string) => {
    const alert: PerformanceAlert = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: Date.now(),
      metric
    };
    
    setAlerts(prev => {
      const filtered = prev.filter(a => a.metric !== metric || Date.now() - a.timestamp > 5000);
      return [alert, ...filtered].slice(0, 10);
    });
  }, []);

  // Performance Optimization Suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions = [];
    
    if (metrics.fps < 30) {
      suggestions.push('Consider reducing animation complexity or enabling hardware acceleration');
    }
    
    if (metrics.memoryUsage > 70) {
      suggestions.push('Memory usage is high - consider optimizing images and reducing DOM complexity');
    }
    
    if (metrics.domNodes > 3000) {
      suggestions.push('High DOM node count detected - consider virtualizing long lists');
    }
    
    if (metrics.networkLatency > 500) {
      suggestions.push('Network latency is high - consider using a CDN or optimizing assets');
    }
    
    if (metrics.loadTime > 2000) {
      suggestions.push('Page load time is slow - consider code splitting and lazy loading');
    }
    
    return suggestions;
  }, [metrics]);

  // Start/Stop Monitoring
  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => {
      if (!prev) {
        // Start monitoring
        requestAnimationFrame(measureFPS);
        monitoringIntervalRef.current = setInterval(() => {
          measureMemoryUsage();
          measureNetworkLatency();
          measureDOMPerformance();
          measureLoadTime();
        }, 2000);
      } else {
        // Stop monitoring
        if (monitoringIntervalRef.current) {
          clearInterval(monitoringIntervalRef.current);
        }
      }
      return !prev;
    });
  }, [measureFPS, measureMemoryUsage, measureNetworkLatency, measureDOMPerformance, measureLoadTime]);

  // Initialize monitoring
  useEffect(() => {
    if (isMonitoring) {
      requestAnimationFrame(measureFPS);
      measureLoadTime();
      
      monitoringIntervalRef.current = setInterval(() => {
        measureMemoryUsage();
        measureNetworkLatency();
        measureDOMPerformance();
      }, 2000);
    }
    
    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, [isMonitoring, measureFPS, measureMemoryUsage, measureNetworkLatency, measureDOMPerformance, measureLoadTime]);

  // Store historical data
  useEffect(() => {
    const interval = setInterval(() => {
      setHistoricalData(prev => {
        const newData = [...prev, { ...metrics }];
        return newData.slice(-30); // Keep last 30 data points
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [metrics]);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (value <= thresholds.warning) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-b from-cream to-white rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-coffee-brown font-playfair">
            Performance Monitor
          </h2>
          <p className="text-coffee-dark">
            Real-time performance metrics and optimization insights
          </p>
        </div>
        
        <motion.button
          onClick={toggleMonitoring}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            isMonitoring
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Activity className="h-5 w-5 inline mr-2" />
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </motion.button>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Monitor className="h-6 w-6 text-coffee-brown mr-2" />
              <span className="font-semibold text-coffee-brown">FPS</span>
            </div>
            {getStatusIcon(60 - metrics.fps, { good: 10, warning: 30 })}
          </div>
          <div className={`text-3xl font-bold ${getStatusColor(60 - metrics.fps, { good: 10, warning: 30 })}`}>
            {metrics.fps}
          </div>
          <div className="text-sm text-coffee-dark/60">Frames per second</div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <HardDrive className="h-6 w-6 text-coffee-brown mr-2" />
              <span className="font-semibold text-coffee-brown">Memory</span>
            </div>
            {getStatusIcon(metrics.memoryUsage, { good: 50, warning: 70 })}
          </div>
          <div className={`text-3xl font-bold ${getStatusColor(metrics.memoryUsage, { good: 50, warning: 70 })}`}>
            {metrics.memoryUsage}%
          </div>
          <div className="text-sm text-coffee-dark/60">{metrics.jsHeapSize}MB used</div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Wifi className="h-6 w-6 text-coffee-brown mr-2" />
              <span className="font-semibold text-coffee-brown">Latency</span>
            </div>
            {getStatusIcon(metrics.networkLatency, { good: 100, warning: 500 })}
          </div>
          <div className={`text-3xl font-bold ${getStatusColor(metrics.networkLatency, { good: 100, warning: 500 })}`}>
            {metrics.networkLatency}ms
          </div>
          <div className="text-sm text-coffee-dark/60">Network response</div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Zap className="h-6 w-6 text-coffee-brown mr-2" />
              <span className="font-semibold text-coffee-brown">Load Time</span>
            </div>
            {getStatusIcon(metrics.loadTime, { good: 1000, warning: 3000 })}
          </div>
          <div className={`text-3xl font-bold ${getStatusColor(metrics.loadTime, { good: 1000, warning: 3000 })}`}>
            {(metrics.loadTime / 1000).toFixed(1)}s
          </div>
          <div className="text-sm text-coffee-dark/60">Page load time</div>
        </motion.div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-coffee-brown mb-4 font-playfair">
            System Resources
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-coffee-dark">DOM Nodes</span>
              <span className={`font-bold ${getStatusColor(metrics.domNodes, { good: 1000, warning: 3000 })}`}>
                {metrics.domNodes.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-coffee-dark">Resources Loaded</span>
              <span className="font-bold text-coffee-brown">{metrics.resourceCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-coffee-dark">Render Time</span>
              <span className={`font-bold ${getStatusColor(metrics.renderTime, { good: 100, warning: 500 })}`}>
                {metrics.renderTime}ms
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-coffee-dark">Cache Hit Rate</span>
              <span className="font-bold text-green-500">{metrics.cacheHitRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-coffee-brown mb-4 font-playfair">
            Performance Trends
          </h3>
          
          {/* Simple FPS Chart */}
          <div className="h-32 bg-coffee-brown/5 rounded-lg p-4 mb-4">
            <div className="flex items-end justify-between h-full">
              {fpsHistoryRef.current.slice(-20).map((fps, index) => (
                <div
                  key={index}
                  className="bg-coffee-brown rounded-t"
                  style={{
                    height: `${(fps / 60) * 100}%`,
                    width: '4px',
                    minHeight: '2px'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="text-sm text-coffee-dark/60">
            FPS over time (last 20 measurements)
          </div>
        </div>
      </div>

      {/* Performance Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-xl shadow-lg mb-8"
          >
            <h3 className="text-xl font-bold text-coffee-brown mb-4 font-playfair">
              Performance Alerts
            </h3>
            
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center p-3 rounded-lg ${
                    alert.type === 'error'
                      ? 'bg-red-50 border border-red-200'
                      : alert.type === 'warning'
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <AlertTriangle className={`h-5 w-5 mr-3 ${
                    alert.type === 'error'
                      ? 'text-red-500'
                      : alert.type === 'warning'
                      ? 'text-yellow-500'
                      : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{alert.message}</div>
                    <div className="text-sm opacity-60">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optimization Suggestions */}
      <div className="bg-gradient-to-r from-coffee-brown to-coffee-dark text-cream p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 font-playfair flex items-center">
          <TrendingUp className="h-6 w-6 mr-2" />
          Optimization Suggestions
        </h3>
        
        <div className="space-y-2">
          {getOptimizationSuggestions().length > 0 ? (
            getOptimizationSuggestions().map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="opacity-90">{suggestion}</span>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              <span>All performance metrics are within optimal ranges!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}