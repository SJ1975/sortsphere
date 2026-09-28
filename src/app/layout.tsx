import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// Space Grotesk — premium display font, clean g and j
// Used by Linear, Vercel ecosystem, top SaaS products
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-syne", // Keep same CSS variable name — no other files need changing
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Monospace font — for metrics, algorithm names
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

// Body font — clean, readable
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SortSphere — 3D Algorithm Visualization",
    template: "%s | SortSphere",
  },
  description:
    "An immersive educational platform to visualize sorting algorithms in 3D. Watch Bubble Sort, Merge Sort, Quick Sort and more with live performance metrics, step-by-step explanations, and pseudocode.",
  keywords: [
    "sorting algorithms",
    "algorithm visualization",
    "3D visualization",
    "bubble sort",
    "merge sort",
    "quick sort",
    "data structures",
    "computer science",
    "educational",
    "learn algorithms",
  ],
  authors: [{ name: "SortSphere" }],
  creator: "SortSphere",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sortsphere-xi.vercel.app",
    title: "SortSphere — 3D Algorithm Visualization",
    description:
      "Visualize sorting algorithms in immersive 3D. Watch, learn, and compare with live performance metrics.",
    siteName: "SortSphere",
  },
  twitter: {
    card: "summary_large_image",
    title: "SortSphere — 3D Algorithm Visualization",
    description:
      "Visualize sorting algorithms in immersive 3D. Watch, learn, and compare with live performance metrics.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${geist.variable}`}
      >
        <body className="antialiased" suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
