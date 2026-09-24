"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SortFrame } from "@/types/sorting";
import { SortBars } from "./SortBars";
import { Lighting } from "./Lighting";

interface Scene3DProps {
  frame: SortFrame | undefined;
  originalArray: number[];
  sortedIndices: Set<number>;
}

export function Scene3D({ frame, originalArray, sortedIndices }: Scene3DProps) {
  return (
    <Canvas
      style={{ background: "#07071a" }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
      shadows
    >
      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        position={[0, 8, 28]}
        fov={58}
        near={0.1}
        far={200}
      />

      {/* Orbit controls — limit so user can't go underground */}
      <OrbitControls
        enablePan={false}
        minDistance={12}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={0.1}
        target={[0, 4, 0]}
        makeDefault
      />

      {/* Lighting */}
      <Lighting />

      {/* Ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[80, 40]} />
        <meshStandardMaterial
          color="#060616"
          roughness={0.95}
          metalness={0.1}
        />
      </mesh>

      {/* Sort bars — main visualization */}
      <Suspense fallback={null}>
        <SortBars
          frame={frame}
          originalArray={originalArray}
          sortedIndices={sortedIndices}
        />
      </Suspense>

      {/* Subtle bloom — glow on bright/active bars */}
      <EffectComposer>
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
