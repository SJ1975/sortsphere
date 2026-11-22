"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

interface GlideBoxProps {
  targetX: number;
  width: number;
  y: number;
  height: number;
  depth: number;
  color: string;
  opacity?: number;
  emissive?: number;
  edges?: boolean;
}

export function GlideBox({
  targetX,
  width,
  y,
  height,
  depth,
  color,
  opacity = 0.2,
  emissive = 0.5,
  edges = false,
}: GlideBoxProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const x = useRef(targetX);
  const w = useRef(width);

  const [initialPos] = useState<[number, number, number]>(() => [
    targetX,
    y,
    0,
  ]);
  const [initialScale] = useState<[number, number, number]>(() => [
    width,
    height,
    depth,
  ]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);

    x.current = THREE.MathUtils.damp(x.current, targetX, 14, dt);
    w.current = THREE.MathUtils.damp(w.current, width, 10, dt);

    m.position.set(x.current, y, 0);
    m.scale.set(w.current, height, depth);
  });

  return (
    <mesh ref={mesh} position={initialPos} scale={initialScale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissive}
        transparent
        opacity={opacity}
        roughness={0.15}
        depthWrite={false}
        toneMapped={false}
      />
      {edges && <Edges color={color} />}
    </mesh>
  );
}
