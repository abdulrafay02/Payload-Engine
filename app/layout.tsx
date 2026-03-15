import type {Metadata} from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';

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
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable} dark`} suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <div className="crt-overlay" />
        <div className="noise" />
        <div className="scanline" />
        {children}
      </body>
    </html>
  );
}
