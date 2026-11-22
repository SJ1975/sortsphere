"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface Bar3DProps {
  targetX: number;
  targetY?: number;
  targetZ?: number;
  height: number;
  width: number;
  depth: number;
  color: string;
  active?: boolean;
  label?: string;
}

export function Bar3D({
  targetX,
  targetY = 0,
  targetZ = 0,
  height,
  width,
  depth,
  color,
  active = false,
  label,
}: Bar3DProps) {
  const group = useRef<THREE.Group>(null);
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null);
  const capMat = useRef<THREE.MeshStandardMaterial>(null);

  // Animated values live in refs, so React never re-renders per frame
  const x = useRef(targetX);
  const y = useRef(targetY);
  const z = useRef(targetZ);
  const glow = useRef(0.15);
  const currentColor = useRef(new THREE.Color(color));
  const targetColor = useRef(new THREE.Color(color));

  // Stable initial values so React props never fight the animation
  const [initialPos] = useState<[number, number, number]>(() => [
    targetX,
    targetY,
    targetZ,
  ]);
  const [initialColor] = useState(color);

  useFrame((_, delta) => {
    const g = group.current;
    const body = bodyMat.current;
    const cap = capMat.current;
    if (!g || !body || !cap) return;

    const dt = Math.min(delta, 0.05);
    const dx = targetX - x.current;

    x.current = THREE.MathUtils.damp(x.current, targetX, 9, dt);
    y.current = THREE.MathUtils.damp(y.current, targetY, 10, dt);
    z.current = THREE.MathUtils.damp(z.current, targetZ, 10, dt);
    glow.current = THREE.MathUtils.damp(
      glow.current,
      active ? 1.2 : 0.15,
      12,
      dt,
    );

    // Arc: the further a bar still has to travel, the higher it hops,
    // and bars moving right pass in front while bars moving left pass behind.
    const travel = Math.abs(dx);
    const arcY = Math.min(travel * 0.45, 3);
    const arcZ = Math.sign(dx) * Math.min(travel * 0.3, 2);

    g.position.set(x.current, y.current + arcY, z.current + arcZ);

    targetColor.current.set(color);
    currentColor.current.lerp(targetColor.current, 1 - Math.exp(-16 * dt));

    body.color.copy(currentColor.current);
    body.emissive.copy(currentColor.current);
    body.emissiveIntensity = glow.current * 0.5;

    cap.color.copy(currentColor.current);
    cap.emissive.copy(currentColor.current);
    cap.emissiveIntensity = 0.6 + glow.current * 1.6;
  });

  const fontPx = Math.round(Math.min(14, Math.max(9, width * 13)));

  return (
    <group ref={group} position={initialPos}>
      {/* Body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          ref={bodyMat}
          color={initialColor}
          roughness={0.3}
          metalness={0.45}
        />
      </mesh>

      {/* Glowing cap — bloom picks this up */}
      <mesh position={[0, height + 0.06, 0]}>
        <boxGeometry args={[width * 1.04, 0.12, depth * 1.04]} />
        <meshStandardMaterial
          ref={capMat}
          color={initialColor}
          toneMapped={false}
        />
      </mesh>

      {label !== undefined && (
        <Html
          position={[0, height + 0.8, 0]}
          center
          zIndexRange={[5, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: `${fontPx}px`,
              fontWeight: active ? 700 : 500,
              color: active ? "#ffffff" : "#94a3b8",
              textShadow: "0 0 6px rgba(5,5,15,0.9)",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
