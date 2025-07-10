import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ScrollIndicator } from '@/components/ScrollIndicator';
import { LiquidNavigation } from '@/components/animations/LiquidNavigation';
import { Footer } from '@/components/Footer';
import { LiquidCoffeeBackground } from '@/components/backgrounds/LiquidCoffeeBackground';
import { CoffeeWaveBackground } from '@/components/animations/CoffeeWaveBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Shinmen Coffee - Premium Coffee Experience',
  description: 'Discover the finest coffee beans and brewing experiences at Shinmen Coffee. From bean to cup, we craft perfection.',
  keywords: 'coffee, premium coffee, coffee shop, specialty coffee, artisan coffee, coffee beans',
  authors: [{ name: 'Shinmen Coffee' }],
  openGraph: {
    title: 'Shinmen Coffee - Premium Coffee Experience',
    description: 'Discover the finest coffee beans and brewing experiences at Shinmen Coffee.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shinmen Coffee - Premium Coffee Experience',
    description: 'Discover the finest coffee beans and brewing experiences at Shinmen Coffee.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <LiquidCoffeeBackground />
        <CoffeeWaveBackground />
        <ScrollIndicator />
        <LiquidNavigation />
        <main id="main-content" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}