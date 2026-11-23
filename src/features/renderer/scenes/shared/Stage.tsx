"use client";

import { ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Lightformer,
  Grid,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const FOV = 45;

function CameraRig({
  width,
  height,
  lookY,
}: {
  width: number;
  height: number;
  lookY: number;
}) {
  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(size.height, 1);
  const tanHalf = Math.tan((FOV * Math.PI) / 360);
  const fitW = (width * 0.5 * 1.25) / (tanHalf * aspect);
  const fitH = (height * 0.5 * 1.15) / tanHalf;
  const dist = Math.max(26, fitW, fitH);

  return (
    <PerspectiveCamera
      makeDefault
      fov={FOV}
      near={0.1}
      far={300}
      position={[0, lookY - 3.5 + dist * 0.28, dist]}
    />
  );
}

interface StageProps {
  children: ReactNode;
  width: number;
  height?: number; // vertical extent of the scene
  lookY?: number; // height the camera looks at
  autoRotate?: boolean;
}

export function Stage({
  children,
  width,
  height = 12,
  lookY = 3.5,
  autoRotate = false,
}: StageProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#05050f"]} />
      <fog attach="fog" args={["#05050f", 55, 120]} />

      <CameraRig width={width} height={height} lookY={lookY} />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={14}
        maxDistance={80}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={0.15}
        target={[0, lookY, 0]}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enableDamping
        dampingFactor={0.08}
      />

      <ambientLight intensity={0.35} />
      <directionalLight position={[10, 18, 12]} intensity={1.2} />
      <pointLight
        position={[-18, 6, -6]}
        intensity={60}
        color="#8b5cf6"
        distance={60}
      />
      <pointLight
        position={[18, 6, -6]}
        intensity={50}
        color="#22d3ee"
        distance={60}
      />

      <Environment frames={1} resolution={128}>
        <Lightformer
          form="rect"
          intensity={2}
          position={[0, 10, 8]}
          scale={[30, 4, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[-16, 4, 0]}
          rotation-y={Math.PI / 2}
          scale={[20, 5, 1]}
          color="#8b5cf6"
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[16, 4, 0]}
          rotation-y={-Math.PI / 2}
          scale={[20, 5, 1]}
          color="#22d3ee"
        />
      </Environment>

      <mesh rotation-x={-Math.PI / 2} position={[0, -0.34, 0]}>
        <planeGeometry args={[200, 100]} />
        <meshStandardMaterial color="#070718" roughness={0.9} metalness={0.2} />
      </mesh>
      <Grid
        position={[0, -0.33, 0]}
        args={[200, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1e1e55"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#6366f1"
        fadeDistance={60}
        fadeStrength={1.6}
      />

      {children}

      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
