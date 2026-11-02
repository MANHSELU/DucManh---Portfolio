import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Plane, Vector3 } from "three";
import { COLORS } from "./palette.js";
import Human from "./human/Human.jsx";

const FIGURE_HEIGHT = 1.7;
const SWAY = 0.5;

function Scanned({ progressRef }) {
  const planes = useMemo(
    () => ({ real: new Plane(new Vector3(0, 1, 0), 0), holo: new Plane(new Vector3(0, -1, 0), 0) }),
    [],
  );
  const realPlanes = useMemo(() => [planes.real], [planes]);
  const holoPlanes = useMemo(() => [planes.holo], [planes]);
  const scanRing = useRef();

  useFrame(() => {
    const progress = progressRef.current;
    const line = progress >= 1 ? -0.05 : FIGURE_HEIGHT * (1 - progress);
    planes.real.constant = -line;
    planes.holo.constant = line;
    scanRing.current.position.y = line;
    scanRing.current.material.opacity = progress >= 1 ? 0 : 0.85;
  });

  return (
    <>
      <Human height={FIGURE_HEIGHT} sway={SWAY} clippingPlanes={realPlanes} />
      <Human height={FIGURE_HEIGHT} sway={SWAY} hologram clippingPlanes={holoPlanes} />
      <mesh ref={scanRing} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.55, 48]} />
        <meshBasicMaterial color={COLORS.teal} transparent opacity={0.85} depthWrite={false} toneMapped={false} />
      </mesh>
    </>
  );
}

export default function ScanFigure({ progress }) {
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  return (
    <Canvas
      flat
      dpr={[1, 2]}
      camera={{ fov: 30, position: [0, 0.95, 3.7] }}
      onCreated={({ gl, camera }) => {
        gl.localClippingEnabled = true;
        camera.lookAt(0, 0.95, 0);
      }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 4, 3]} intensity={2.2} />
      <pointLight position={[-1.5, 1.5, 1.5]} color={COLORS.teal} intensity={3} decay={1.5} />
      <Suspense fallback={null}>
        <Scanned progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
