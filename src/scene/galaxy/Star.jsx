import { useEffect, useRef } from "react";
import Interactive from "../Interactive.jsx";
import { STAR_ID } from "../layout.js";
import Human from "../human/Human.jsx";
import BodyLabel from "./BodyLabel.jsx";
import { registerBody } from "./bodies.js";

const FIGURE_HEIGHT = 1.7;
const FIGURE_BASE = -0.95;

export default function Star() {
  const anchor = useRef();

  useEffect(() => {
    registerBody(STAR_ID, anchor.current);
    return () => registerBody(STAR_ID, null);
  }, []);

  return (
    <group ref={anchor}>
      <Interactive id={STAR_ID}>
        <Human height={FIGURE_HEIGHT} position={[0, FIGURE_BASE, 0]} follow pickable />
      </Interactive>
      <BodyLabel id={STAR_ID} offset={[1.0, 1.0, 0]} />
    </group>
  );
}
