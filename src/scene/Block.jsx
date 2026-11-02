import { useContext, useMemo } from "react";
import { BoxGeometry } from "three";
import { COLORS } from "./palette.js";
import { HighlightContext } from "./HighlightContext.js";

export default function Block({
  size,
  position,
  rotation = [0, 0, 0],
  color = COLORS.body,
  emissive = "#000000",
  emissiveIntensity = 1,
  edges = true,
  cast = true,
}) {
  const [width, height, depth] = size;
  const geometry = useMemo(() => new BoxGeometry(width, height, depth), [width, height, depth]);
  const lit = useContext(HighlightContext);
  const lineOpacity = lit === null ? 0.22 : lit ? 1 : 0.5;

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry} castShadow={cast} receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          metalness={0.05}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {edges && (
        <lineSegments>
          <edgesGeometry args={[geometry]} />
          <lineBasicMaterial color={COLORS.teal} transparent opacity={lineOpacity} depthWrite={false} />
        </lineSegments>
      )}
    </group>
  );
}
