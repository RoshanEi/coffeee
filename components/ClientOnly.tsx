'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly component that only renders its children on the client-side
 * This completely avoids hydration mismatches by not rendering anything during SSR
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return fallback (or null) during SSR and initial client render
  if (!isClient) {
    return <>{fallback}</>;
  }

  // Return children after hydration is complete
  return <>{children}</>;
} 