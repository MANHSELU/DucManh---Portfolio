import { COLORS } from "./palette.js";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={2.4}
        color="#e6fffb"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <pointLight position={[-3, 2.5, -1.5]} color={COLORS.teal} intensity={3} distance={6} decay={1.5} />
      <pointLight position={[3, 2.5, 1.5]} color={COLORS.teal} intensity={3} distance={6} decay={1.5} />
    </>
  );
}
