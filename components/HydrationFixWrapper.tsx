'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

// Use a safe version of useLayoutEffect that falls back to useEffect during SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * A component that wraps the app and fixes hydration issues caused by browser extensions
 */
export function HydrationFixWrapper({ children }: { children: React.ReactNode }) {
  const isInitialRender = useRef(true);

  // Use useLayoutEffect to run before browser paint
  useIsomorphicLayoutEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Clean up extension attributes aggressively
    const cleanupExtensionAttributes = () => {
      try {
        // Get all elements in the DOM
        const allElements = document.querySelectorAll('*');
        
        // Clean up attributes from all elements
        allElements.forEach((el) => {
          // Skip non-element nodes
          if (!(el instanceof Element)) return;
          
          const attributes = Array.from(el.attributes);
          attributes.forEach((attr) => {
            // Remove BitDefender and other extension attributes
            if (
              attr.name.startsWith('bis_') || 
              attr.name.includes('__processed') ||
              attr.name === 'bis_register' ||
              attr.name.includes('bis_skin_checked')
            ) {
              el.removeAttribute(attr.name);
            }
          });
        });
      } catch (e) {
        console.error('Error cleaning up extension attributes:', e);
      }
    };
    
    // Run cleanup immediately on first render
    if (isInitialRender.current) {
      cleanupExtensionAttributes();
      isInitialRender.current = false;
    }
    
    // Set up a MutationObserver to handle future injections
    const observer = new MutationObserver((mutations) => {
      let shouldCleanup = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName || '';
          if (
            attrName.startsWith('bis_') || 
            attrName.includes('__processed') ||
            attrName === 'bis_register'
          ) {
            const el = mutation.target as Element;
            el.removeAttribute(attrName);
            shouldCleanup = true;
          }
        }
      });
      
      // If we detected extension attributes, do a full cleanup
      if (shouldCleanup) {
        cleanupExtensionAttributes();
      }
    });
    
    // Observe the entire document for attribute changes
    observer.observe(document.documentElement, { 
      attributes: true,
      subtree: true,
      childList: true,
      attributeFilter: ['bis_skin_checked', 'bis_register', '__processed']
    });
    
    // Also run cleanup on any DOM changes
    const domObserver = new MutationObserver(() => {
      cleanupExtensionAttributes();
    });
    
    domObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Run cleanup on a timer as a fallback
    const intervalId = setInterval(cleanupExtensionAttributes, 1000);
    
    // Cleanup on unmount
    return () => {
      observer.disconnect();
      domObserver.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  return <div suppressHydrationWarning>{children}</div>;
} 