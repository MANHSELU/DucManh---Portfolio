import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useReducedMotion } from "../hooks/useReducedMotion.js";
import Block from "./Block.jsx";
import FaintGrid from "./FaintGrid.jsx";
import Human from "./human/Human.jsx";
import { COLORS } from "./palette.js";

const CRATES = [
  [1.7, 0, -0.7, -0.3],
  [1.75, 0.58, -0.7, -0.18],
  [2.5, 0, 0.5, 0.25],
  [-1.9, 0, -0.9, 0.35],
];
const TARGET = new Vector3(0.2, 0.85, 0);
const HOME = [0.6, 2.4, 6.4];

function Crate({ x, y, z, turn }) {
  return (
    <group>
      <Block size={[0.9, 0.5, 0.64]} position={[x, y + 0.25, z]} rotation={[0, turn, 0]} color="#152120" />
      <Block size={[0.95, 0.08, 0.69]} position={[x, y + 0.54, z]} rotation={[0, turn, 0]} color="#1b2928" />
      <Block
        size={[0.3, 0.1, 0.01]}
        position={[x + Math.sin(turn) * 0.33, y + 0.3, z + Math.cos(turn) * 0.33]}
        rotation={[0, turn, 0]}
        color={COLORS.teal}
        emissive={COLORS.teal}
        emissiveIntensity={0.5}
        edges={false}
      />
    </group>
  );
}

function scatterPapers() {
  let seed = 3;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const papers = [];
  for (let i = 0; i < 9; i += 1) {
    const x = (random() - 0.5) * 5;
    const z = (random() - 0.2) * 2.6;
    const turn = random() * Math.PI;
    if (Math.abs(x) >= 0.6 || Math.abs(z) >= 0.6) papers.push({ x, z, turn });
  }
  return papers;
}

function Waiting() {
  const reduced = useReducedMotion();
  const papers = useMemo(scatterPapers, []);
  const goal = useMemo(() => new Vector3(), []);

  useFrame(({ camera, pointer }) => {
    goal.set(HOME[0] + (reduced ? 0 : pointer.x * 0.6), HOME[1] + (reduced ? 0 : pointer.y * 0.4), HOME[2]);
    camera.position.lerp(goal, reduced ? 1 : 0.06);
    camera.lookAt(TARGET);
  });

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 7, 4]} intensity={2.4} color="#e6fffb" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-1.5, 2.5, 1.5]} color={COLORS.teal} intensity={2.5} distance={6} decay={1.5} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <shadowMaterial opacity={0.45} />
      </mesh>
      <FaintGrid size={10} divisions={20} opacity={0.06} y={0} />
      {CRATES.map(([x, y, z, turn]) => (
        <Crate key={`${x}${y}`} x={x} y={y} z={z} turn={turn} />
      ))}
      {papers.map((paper, index) => (
        <Block
          key={index}
          size={[0.38, 0.006, 0.26]}
          position={[paper.x, 0.004, paper.z]}
          rotation={[0, paper.turn, 0]}
          color={COLORS.paper}
          edges={false}
          cast={false}
        />
      ))}
      <Suspense fallback={null}>
        <Human height={1.7} follow castShadow />
      </Suspense>
    </>
  );
}

export default function ContactScene() {
  return (
    <Canvas shadows flat dpr={[1, 2]} camera={{ fov: 34, position: HOME }}>
      <Waiting />
    </Canvas>
  );
}
