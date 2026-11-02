import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import { COLORS } from "../palette.js";
import { readHumanAsset } from "./humanAsset.js";
import { createHologramMaterial, createHumanMaterial } from "./humanMaterial.js";

const FOLLOW_RANGE = 0.5;
const FOLLOW_SPEED = 0.07;
const BREATH_SPEED = 1.8;
const BREATH_SIZE = 0.006;
const PROXY_RADIUS = 0.4;
const noRaycast = () => null;

export default function Human({
  height = 1.7,
  position = [0, 0, 0],
  follow = false,
  sway = 0,
  hologram = false,
  clippingPlanes,
  castShadow = false,
  pickable = false,
}) {
  const { geometry, texture, height: sourceHeight } = readHumanAsset();
  const reduced = useReducedMotion();
  const turner = useRef();
  const breather = useRef();
  const yaw = useRef(0);

  const material = useMemo(
    () => (hologram ? createHologramMaterial(COLORS.teal, clippingPlanes) : createHumanMaterial(texture, clippingPlanes)),
    [hologram, texture, clippingPlanes],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ pointer, clock }) => {
    if (reduced) return;
    const time = clock.elapsedTime;
    const goal = follow ? pointer.x * FOLLOW_RANGE : Math.sin(time * 0.6) * sway;
    yaw.current += (goal - yaw.current) * FOLLOW_SPEED;
    turner.current.rotation.y = yaw.current;
    breather.current.scale.y = 1 + Math.sin(time * BREATH_SPEED) * BREATH_SIZE;
  });

  const scale = height / sourceHeight;
  return (
    <group position={position} scale={scale}>
      <group ref={turner}>
        <group ref={breather}>
          <mesh geometry={geometry} material={material} castShadow={castShadow} raycast={noRaycast} frustumCulled={false} />
        </group>
        {pickable && (
          <mesh position={[0, sourceHeight / 2, 0]}>
            <cylinderGeometry args={[PROXY_RADIUS, PROXY_RADIUS, sourceHeight, 12]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        )}
      </group>
    </group>
  );
}
