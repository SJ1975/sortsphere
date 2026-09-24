"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SortBarProps {
  x: number;
  targetHeight: number;
  targetColor: string;
  barWidth: number;
  barDepth: number;
}

export function SortBar({
  x,
  targetHeight,
  targetColor,
  barWidth,
  barDepth,
}: SortBarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Refs hold current animated state — persists across re-renders
  const animHeight = useRef(targetHeight);
  const animColor = useRef(new THREE.Color(targetColor));
  const targetColor3 = useRef(new THREE.Color(targetColor));

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;

    // Smooth height lerp — 0.18 = snappy but not instant
    animHeight.current = THREE.MathUtils.lerp(
      animHeight.current,
      targetHeight,
      0.18,
    );
    meshRef.current.scale.y = animHeight.current;
    meshRef.current.position.y = animHeight.current / 2;

    // Smooth color lerp
    targetColor3.current.set(targetColor);
    animColor.current.lerp(targetColor3.current, 0.28);
    materialRef.current.color.copy(animColor.current);
  });

  return (
    <mesh
      ref={meshRef}
      // Initial position uses current animated value — useFrame takes over immediately
      position={[x, animHeight.current / 2, 0]}
    >
      {/* args: [width, height, depth] — height=1, we scale via scale.y */}
      <boxGeometry args={[barWidth, 1, barDepth]} />
      <meshStandardMaterial
        ref={materialRef}
        color={targetColor}
        roughness={0.28}
        metalness={0.55}
        envMapIntensity={0.8}
      />
    </mesh>
  );
}
