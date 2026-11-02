import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide } from "three";
import { useRoomStore } from "../../store/useRoomStore.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import Interactive from "../Interactive.jsx";
import { COLORS } from "../palette.js";
import { PLANETS } from "../layout.js";
import BodyLabel from "./BodyLabel.jsx";
import { registerBody } from "./bodies.js";
import { bandTexture, glowTexture } from "./textures.js";

const HOVER_SCALE = 1.18;

function Rings({ radius }) {
  return (
    <group rotation={[-1.15, 0.2, 0]}>
      <mesh>
        <ringGeometry args={[radius * 1.45, radius * 2.3, 96]} />
        <meshBasicMaterial color={COLORS.teal} transparent opacity={0.42} side={DoubleSide} toneMapped={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[radius * 2.4, radius * 2.5, 96]} />
        <meshBasicMaterial color="#bffff8" transparent opacity={0.5} side={DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Moons({ radius, reduced }) {
  const ring = useRef();
  useFrame((_, delta) => {
    if (!reduced) ring.current.rotation.y += delta * 0.6;
  });
  return (
    <group ref={ring} rotation={[0.35, 0, 0]}>
      {[0, 1, 2, 3, 4].map((step) => {
        const angle = (step / 5) * Math.PI * 2;
        return (
          <mesh key={step} position={[Math.cos(angle) * radius * 2.1, 0, Math.sin(angle) * radius * 2.1]}>
            <sphereGeometry args={[0.07 + step * 0.012, 16, 12]} />
            <meshBasicMaterial color={step === 4 ? "#bffff8" : COLORS.teal} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function Grid({ radius }) {
  return (
    <mesh scale={1.06}>
      <icosahedronGeometry args={[radius, 2]} />
      <meshBasicMaterial color={COLORS.teal} wireframe transparent opacity={0.7} toneMapped={false} />
    </mesh>
  );
}

function Signal({ radius, reduced }) {
  const waves = useRef([]);
  useFrame(({ clock }) => {
    waves.current.forEach((wave, index) => {
      if (!wave) return;
      const t = reduced ? 0.5 : (clock.elapsedTime * 0.45 + index / 3) % 1;
      const size = 1 + t * 2.4;
      wave.scale.set(size, size, size);
      wave.material.opacity = (1 - t) * 0.6;
    });
  });
  return (
    <group>
      <mesh position={[0, radius + 0.12, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
        <meshBasicMaterial color="#bffff8" toneMapped={false} />
      </mesh>
      <mesh position={[0, radius + 0.26, 0]}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} ref={(mesh) => (waves.current[index] = mesh)} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.02, radius * 1.08, 64]} />
          <meshBasicMaterial color={COLORS.teal} transparent opacity={0.5} side={DoubleSide} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

const EXTRAS = { rings: Rings, moons: Moons, grid: Grid, signal: Signal };

export default function Planet({ id }) {
  const config = PLANETS[id];
  const { radius, orbit, speed, kind, color } = config;
  const Extra = EXTRAS[kind];
  const surface = useMemo(() => bandTexture(id, color, "#2fd8c8"), [id, color]);
  const anchor = useRef();
  const body = useRef();
  const sphere = useRef();
  const angle = useRef(config.angle);
  const reduced = useReducedMotion();

  useEffect(() => {
    registerBody(id, anchor.current);
    return () => registerBody(id, null);
  }, [id]);

  useFrame((_, delta) => {
    const { focus, hovered } = useRoomStore.getState();
    if (!reduced && focus === null) angle.current += speed * delta;
    anchor.current.position.set(Math.cos(angle.current) * orbit, 0, Math.sin(angle.current) * orbit);
    if (!reduced) sphere.current.rotation.y += delta * 0.25;
    const target = hovered === id ? HOVER_SCALE : 1;
    const scale = body.current.scale.x + (target - body.current.scale.x) * 0.12;
    body.current.scale.setScalar(scale);
  });

  return (
    <group ref={anchor}>
      <group ref={body}>
        <Interactive id={id}>
          <mesh ref={sphere} castShadow receiveShadow>
            <sphereGeometry args={[radius, 48, 32]} />
            <meshStandardMaterial map={surface} roughness={0.75} metalness={0.1} emissive={color} emissiveIntensity={0.25} />
          </mesh>
          <Extra radius={radius} reduced={reduced} />
        </Interactive>
        <sprite scale={[radius * 4, radius * 4, 1]}>
          <spriteMaterial
            map={glowTexture()}
            color={COLORS.teal}
            transparent
            opacity={0.28}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      </group>
      <BodyLabel id={id} offset={[radius + 0.35, radius + 0.45, 0]} />
    </group>
  );
}
