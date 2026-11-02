import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AdditiveBlending, BufferAttribute, BufferGeometry } from "three";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import { COLORS } from "../palette.js";
import { glowTexture } from "./textures.js";

const NEBULAE = [
  { position: [-22, 5, -28], scale: 44, color: COLORS.teal, opacity: 0.16 },
  { position: [24, -7, -34], scale: 52, color: "#0c4a63", opacity: 0.22 },
  { position: [2, 14, -46], scale: 60, color: "#0e6b62", opacity: 0.12 },
  { position: [-8, -12, -30], scale: 36, color: "#09383f", opacity: 0.18 },
];
const DUST_COUNT = 1400;

function dustGeometry() {
  let seed = 11;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const positions = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i += 1) {
    const radius = 1.6 + Math.pow(random(), 0.7) * 13;
    const angle = random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (random() - 0.5) * 1.6 * (1 - radius / 16);
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
}

export default function Space() {
  const glow = glowTexture();
  const dust = useMemo(dustGeometry, []);
  const disc = useRef();
  const reduced = useReducedMotion();

  useFrame((_, delta) => {
    if (!reduced) disc.current.rotation.y += delta * 0.015;
  });

  return (
    <group>
      <Stars radius={80} depth={50} count={3000} factor={3.4} saturation={0} fade speed={reduced ? 0 : 0.5} />
      {NEBULAE.map((nebula) => (
        <sprite key={nebula.position.join()} position={nebula.position} scale={[nebula.scale, nebula.scale, 1]}>
          <spriteMaterial
            map={glow}
            color={nebula.color}
            transparent
            opacity={nebula.opacity}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ))}
      <points ref={disc} geometry={dust}>
        <pointsMaterial
          size={0.05}
          color="#a8fff4"
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
