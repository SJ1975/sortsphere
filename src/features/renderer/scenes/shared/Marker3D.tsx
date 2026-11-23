"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Marker3DProps {
  targetX: number;
  targetY: number;
  color: string;
}

export function Marker3D({ targetX, targetY, color }: Marker3DProps) {
  const group = useRef<THREE.Group>(null);
  const x = useRef(targetX);
  const y = useRef(targetY);
  const [initialPos] = useState<[number, number, number]>(() => [
    targetX,
    targetY,
    0,
  ]);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);

    x.current = THREE.MathUtils.damp(x.current, targetX, 12, dt);
    y.current = THREE.MathUtils.damp(y.current, targetY, 12, dt);

    g.position.set(
      x.current,
      y.current + Math.sin(clock.elapsedTime * 3) * 0.12,
      0,
    );
  });

  return (
    <group ref={group} position={initialPos}>
      {/* Cone tip points down at the bar */}
      <mesh rotation-x={Math.PI}>
        <coneGeometry args={[0.42, 0.85, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
