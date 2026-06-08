import * as React from 'react';
import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { Providers } from '@/components/Providers';
import './globals.css';


const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Thoughts. | A minimalist space for your thoughts',
  description: 'Share what matters, without the noise.',
  manifest: '/manifest.json',
  icons: {
    icon: { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
  },
  other: {
    'theme-color': '#FFFFFF',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="antialiased min-h-screen bg-white text-black font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
