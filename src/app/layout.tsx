import type { Metadata } from 'next';
import { Syne, JetBrains_Mono, Geist } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

// Display font — geometric, premium, unique for headings
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// Monospace font — for metrics, algorithm names, code
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600'],
});

// Body font — clean, readable
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SortSphere — 3D Algorithm Visualization',
  description:
    'Visualize sorting algorithms in immersive 3D. Watch Bubble, Merge, Quick Sort and more with live performance metrics.',
  keywords: ['sorting algorithms', 'algorithm visualization', '3D', 'data structures'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${syne.variable} ${jetbrainsMono.variable} ${geist.variable}`}
      >
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}