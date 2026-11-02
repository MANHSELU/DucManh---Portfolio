import { useContext } from "react";
import { COLORS } from "./palette.js";
import { HighlightContext } from "./HighlightContext.js";

export default function Outlined({
  geometry,
  position,
  rotation,
  scale,
  color = COLORS.body,
  emissive = "#000000",
  emissiveIntensity = 1,
  threshold = 20,
  edges = true,
}) {
  const lit = useContext(HighlightContext);
  const lineOpacity = lit === null ? 0.3 : lit ? 1 : 0.6;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.15}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {edges && (
        <lineSegments>
          <edgesGeometry args={[geometry, threshold]} />
          <lineBasicMaterial color={COLORS.teal} transparent opacity={lineOpacity} depthWrite={false} />
        </lineSegments>
      )}
    </group>
  );
}
