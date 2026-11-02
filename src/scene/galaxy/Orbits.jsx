import { DoubleSide } from "three";
import { COLORS } from "../palette.js";
import { PLANETS } from "../layout.js";

export default function Orbits() {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {Object.entries(PLANETS).map(([id, planet]) => (
        <mesh key={id}>
          <ringGeometry args={[planet.orbit - 0.012, planet.orbit + 0.012, 160]} />
          <meshBasicMaterial color={COLORS.teal} transparent opacity={0.22} side={DoubleSide} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
