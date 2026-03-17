import type {Metadata} from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/ThemeProvider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Payload | Omni-Input Pricing Engine',
  description: 'High-speed freight load quoting for Sprinter van operators.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <ThemeProvider>
          <svg className="hidden">
            <filter id="rugged-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" />
            </filter>
          </svg>
          <div className="crt-overlay" />
          <div className="noise" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
