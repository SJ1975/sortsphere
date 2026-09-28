<div align="center">

<img src="public/favicon.ico" width="60" alt="SortSphere Logo" />

# SortSphere

### Sorting Algorithm Visualization Platform

**An immersive educational platform that transforms abstract sorting algorithms into interactive 3D experiences.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sortsphere--xi.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://sortsphere-xi.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-0.17x-black?style=for-the-badge&logo=three.js)](https://threejs.org)

</div>

---

## Overview

SortSphere is a full-stack educational platform built for students to **see, understand, and interact** with sorting algorithms — not just read about them.

Every algorithm includes:

- **Immersive 3D visualization** with real-time color-coded animations
- **Step-by-step plain English explanation** for every single operation
- **Live pseudocode** with the current line highlighted in real time
- **Complexity analysis** with intuitive explanations of _why_ the complexity is what it is
- **Custom array input** — students can type their own numbers and watch them sort
- **Live performance metrics** — comparisons, swaps, and progress tracked every frame

---

## Features

### 3D Visualization Engine

- Interactive WebGL scene powered by **React Three Fiber**
- Orbit controls — drag to rotate, scroll to zoom
- Smooth bar height and color lerp animations via `useFrame`
- Ambient + directional + point lighting for depth
- Subtle bloom post-processing effect
- Seamless **2D / 3D toggle** — same data, two renderers

### Sorting Algorithms

| Algorithm      | Time (Best) | Time (Average) | Time (Worst) | Space    | Stable |
| -------------- | ----------- | -------------- | ------------ | -------- | ------ |
| Bubble Sort    | O(n)        | O(n²)          | O(n²)        | O(1)     | ✅     |
| Selection Sort | O(n²)       | O(n²)          | O(n²)        | O(1)     | ❌     |
| Insertion Sort | O(n)        | O(n²)          | O(n²)        | O(1)     | ✅     |
| Merge Sort     | O(n log n)  | O(n log n)     | O(n log n)   | O(n)     | ✅     |
| Quick Sort     | O(n log n)  | O(n log n)     | O(n²)        | O(log n) | ❌     |
| Heap Sort      | O(n log n)  | O(n log n)     | O(n log n)   | O(1)     | ❌     |

### Educational Features

- **Step explainer** — plain English description of every compare, swap, and write
- **Pseudocode panel** — algorithm steps with live line highlighting
- **Complexity deep-dive** — intuitive explanation + best/worst case reasoning
- **Custom input** — type any array or choose from presets (nearly sorted, reverse, all equal)
- **Bar value labels** — each bar shows its numerical value in 2D mode
- **Index labels** — position indices shown for small arrays

### Platform Features

- **Authentication** via Clerk (sign up, sign in, session persistence)
- **Favorites system** — pin algorithms, persisted to localStorage
- **Playback controls** — play, pause, reset, speed (0.25x → 4x), scrubbing
- **Array size control** — 5 to 80 elements
- **Responsive design** — works on desktop and tablet
- **Protected routes** — dashboard and visualizer require auth

---

## Tech Stack

### Frontend

| Technology   | Version | Purpose                     |
| ------------ | ------- | --------------------------- |
| Next.js      | 16      | React framework, App Router |
| React        | 19      | UI library                  |
| TypeScript   | 5.7     | Type safety                 |
| Tailwind CSS | 4       | Utility styling             |

### 3D Graphics

| Technology                  | Version | Purpose                             |
| --------------------------- | ------- | ----------------------------------- |
| Three.js                    | 0.17x   | WebGL rendering                     |
| React Three Fiber           | 9.x     | React + Three.js                    |
| Drei                        | 10.x    | R3F helpers (OrbitControls, Camera) |
| @react-three/postprocessing | —       | Bloom effect                        |
| @react-spring/three         | —       | 3D spring animations                |

### State & Auth

| Technology   | Purpose                         |
| ------------ | ------------------------------- |
| Zustand 5    | Global state (3 focused stores) |
| Clerk        | Authentication + session        |
| localStorage | Preferences + favorites         |

### Animation

| Technology       | Purpose                              |
| ---------------- | ------------------------------------ |
| Framer Motion 12 | Page transitions + scroll animations |
| GSAP 3           | Supplementary animations             |

### Deployment

| Technology     | Purpose        |
| -------------- | -------------- |
| Vercel         | Hosting + CDN  |
| GitHub Actions | CI/CD pipeline |

---

## Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page (public)
│   ├── dashboard/                # Algorithm picker (protected)
│   └── visualize/[algo]/         # Visualization page (protected)
│
├── features/
│   └── sorting/
│       ├── algorithms/           # 6 pure TypeScript sorting algorithms
│       ├── engine/               # SortingEngine class (frame generator)
│       ├── hooks/                # useSortingEngine (connects all stores)
│       ├── renderer/
│       │   ├── components/       # Scene3D, SortBars, SortBar, Bars2D
│       │   └── config/           # Color mappings per event type
│       └── visualization/
│           ├── components/       # PlaybackControls, MetricsPanel,
│           │                     # StepExplainer, PseudoCode,
│           │                     # ComplexityExplainer, CustomInput
│           └── utils/            # stepExplainer (plain English generator)
│
├── store/
│   ├── sortingStore.ts           # Algorithm + frames state
│   ├── visualizationStore.ts     # Play/pause/speed/frame state
│   └── preferencesStore.ts       # Favorites + settings (localStorage)
│
├── lib/
│   ├── constants.ts              # Algorithm info + complexity data
│   └── pseudocode.ts             # Pseudocode + complexity explanations
│
└── types/
    └── sorting.ts                # SortEvent, SortFrame, AlgorithmKey
```

### Sorting Engine Design

The core architectural decision: **algorithms are renderer-independent.**

```
Algorithm (pure TypeScript)
        ↓ emits SortFrame[]
SortingEngine
        ↓ pre-computes all frames
Zustand Store
        ↓ currentFrameIndex advances on interval
Renderer (3D or 2D)
        ↓ reads frame, maps event type → color
Screen
```

Every algorithm emits typed events:

- `COMPARE` → yellow (examining two elements)
- `SWAP` → red (exchanging two elements)
- `OVERWRITE` → purple (writing a value)
- `MARK_SORTED` → green (confirmed final position)
- `PARTITION` → cyan (Quick Sort pivot)
- `MERGE` → violet (Merge Sort range)

Pre-computing all frames gives O(1) seek — scrubbing and speed control are trivial.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Clerk](https://clerk.com) account

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/sortsphere.git
cd sortsphere
npm install
```

### Environment Setup

Create `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy

Push to `main` — GitHub Actions automatically builds and deploys to Vercel.

```bash
git push origin main
```

---

## Key Engineering Decisions

| Decision              | Choice                             | Reasoning                                                    |
| --------------------- | ---------------------------------- | ------------------------------------------------------------ |
| Frame pre-computation | All frames computed upfront        | O(1) seek, trivial speed control, no runtime blocking        |
| Renderer architecture | Event-driven, renderer-independent | Algorithms emit events, renderer consumes — clean separation |
| State management      | 3 focused Zustand stores           | No god store, clear ownership, TS-native                     |
| Auth                  | Clerk                              | 30-min integration vs days for custom auth                   |
| 3D library            | React Three Fiber                  | Declarative React API over imperative Three.js               |
| Persistence           | localStorage only                  | Zero infrastructure for MVP-level user preferences           |
| Initial array         | Deterministic                      | Avoids SSR/client hydration mismatch                         |
| Fonts                 | Space Grotesk + JetBrains Mono     | Premium feel with clean letterforms                          |

---

## License

MIT © 2025
