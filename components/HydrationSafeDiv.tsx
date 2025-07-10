'use client';

import React, { useEffect, useState } from 'react';

interface HydrationSafeDivProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * A component that prevents hydration errors by only rendering its children after hydration is complete
 */
export function HydrationSafeDiv({ children, ...props }: HydrationSafeDivProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // During SSR and initial client render, render a simple div
  if (!isHydrated) {
    return <div {...props}>{children}</div>;
  }

  // After hydration, render with all props
  return <div {...props}>{children}</div>;
} 