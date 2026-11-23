"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface Node3DProps {
  targetX: number;
  targetY: number;
  targetZ?: number;
  radius: number;
  color: string;
  active?: boolean;
  visible?: boolean;
  label?: string;
}

export function Node3D({
  targetX,
  targetY,
  targetZ = 0,
  radius,
  color,
  active = false,
  visible = true,
  label,
}: Node3DProps) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  const x = useRef(targetX);
  const y = useRef(targetY);
  const scale = useRef(visible ? 1 : 0);
  const glow = useRef(0.3);
  const currentColor = useRef(new THREE.Color(color));
  const targetColor = useRef(new THREE.Color(color));

  const [initialPos] = useState<[number, number, number]>(() => [
    targetX,
    targetY,
    targetZ,
  ]);
  const [initialColor] = useState(color);

  useFrame((_, delta) => {
    const g = group.current;
    const m = mat.current;
    if (!g || !m) return;
    const dt = Math.min(delta, 0.05);

    x.current = THREE.MathUtils.damp(x.current, targetX, 9, dt);
    y.current = THREE.MathUtils.damp(y.current, targetY, 9, dt);
    scale.current = THREE.MathUtils.damp(
      scale.current,
      visible ? 1 : 0,
      10,
      dt,
    );
    glow.current = THREE.MathUtils.damp(
      glow.current,
      active ? 1.4 : 0.3,
      12,
      dt,
    );

    g.position.set(x.current, y.current, targetZ);
    g.scale.setScalar(Math.max(scale.current, 0.0001));

    targetColor.current.set(color);
    currentColor.current.lerp(targetColor.current, 1 - Math.exp(-16 * dt));
    m.color.copy(currentColor.current);
    m.emissive.copy(currentColor.current);
    m.emissiveIntensity = glow.current;
  });

  return (
    <group ref={group} position={initialPos}>
      <mesh>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          ref={mat}
          color={initialColor}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {label !== undefined && visible && (
        <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 700,
              color: "#ffffff",
              textShadow: "0 0 5px rgba(5,5,15,0.95)",
              userSelect: "none",
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
