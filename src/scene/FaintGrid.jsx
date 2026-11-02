import { useLayoutEffect, useRef } from "react";
import { COLORS } from "./palette.js";

export default function FaintGrid({ size, divisions, opacity, y = 0.005 }) {
  const grid = useRef();

  useLayoutEffect(() => {
    grid.current.material.transparent = true;
    grid.current.material.opacity = opacity;
  }, [opacity]);

  return <gridHelper ref={grid} args={[size, divisions, COLORS.teal, COLORS.teal]} position={[0, y, 0]} />;
}
