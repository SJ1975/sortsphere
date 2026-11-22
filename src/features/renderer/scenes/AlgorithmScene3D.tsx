"use client";

import { AlgorithmKey, SortFrame } from "@/types/sorting";
import { Scene3D } from "../components/Scene";
import { BubbleScene } from "./BubbleScene";
import { InsertionScene } from "./InsertionScene";
import { SceneHud } from "./shared/SceneHud";
import { getMax3DSize } from "./config";

interface AlgorithmScene3DProps {
  algorithm: AlgorithmKey;
  frame: SortFrame | undefined;
  originalArray: number[];
  sortedIndices: Set<number>;
  autoRotate?: boolean;
}

export function AlgorithmScene3D({
  algorithm,
  frame,
  originalArray,
  sortedIndices,
  autoRotate = false,
}: AlgorithmScene3DProps) {
  const sceneProps = { frame, originalArray, sortedIndices, autoRotate };

  let scene: React.ReactNode = null;
  if (algorithm === "bubble") scene = <BubbleScene {...sceneProps} />;
  else if (algorithm === "insertion")
    scene = <InsertionScene {...sceneProps} />;

  // No custom scene yet (selection, quick, merge, heap) → previous 3D scene
  if (!scene) {
    return (
      <Scene3D
        frame={frame}
        originalArray={originalArray}
        sortedIndices={sortedIndices}
      />
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {scene}
      <SceneHud
        algorithm={algorithm}
        frame={frame}
        originalArray={originalArray}
        maxSize={getMax3DSize(algorithm)}
      />
    </div>
  );
}
