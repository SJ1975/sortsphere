export function Lighting() {
  return (
    <>
      {/* Base ambient */}
      <ambientLight intensity={0.5} />

      {/* Main key light — top right front */}
      <directionalLight position={[12, 20, 12]} intensity={1.4} castShadow />

      {/* Purple fill light — left back */}
      <directionalLight
        position={[-12, 8, -8]}
        intensity={0.5}
        color="#8b5cf6"
      />

      {/* Indigo point light — above scene center */}
      <pointLight
        position={[0, 14, 0]}
        intensity={0.8}
        color="#6366f1"
        distance={40}
      />

      {/* Subtle cyan rim — right */}
      <pointLight
        position={[20, 4, 0]}
        intensity={0.3}
        color="#22d3ee"
        distance={30}
      />
    </>
  );
}
