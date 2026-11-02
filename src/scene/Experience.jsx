import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useRoomStore } from "../store/useRoomStore.js";
import CameraRig from "./CameraRig.jsx";
import Lights from "./Lights.jsx";
import Atmosphere from "./Atmosphere.jsx";
import { PLANETS, STAR_ID } from "./layout.js";
import { bodies } from "./galaxy/bodies.js";
import Orbits from "./galaxy/Orbits.jsx";
import Planet from "./galaxy/Planet.jsx";
import Space from "./galaxy/Space.jsx";
import Star from "./galaxy/Star.jsx";

export default function Experience() {
  const hovered = useRoomStore((state) => state.hovered);
  const focus = useRoomStore((state) => state.focus);

  useEffect(() => {
    document.body.style.cursor = hovered && !focus ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, focus]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 34, near: 0.1, far: 120, position: [2, 9, 16] }}
      onPointerMissed={() => useRoomStore.getState().setHovered(null)}
    >
      <color attach="background" args={["#060808"]} />
      <Lights />
      <Space />
      <Orbits />
      <Suspense fallback={null}>
        <Star />
        {Object.keys(PLANETS).map((id) => (
          <Planet key={id} id={id} />
        ))}
      </Suspense>
      <CameraRig />
      <Atmosphere />
    </Canvas>
  );
}
