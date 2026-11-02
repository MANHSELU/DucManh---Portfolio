import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useRoomStore } from "../store/useRoomStore.js";
import { useReducedMotion } from "../hooks/useReducedMotion.js";
import { bodies } from "./galaxy/bodies.js";
import { FOCUS_FOV, overviewView, PLANETS, STAR_ID, STAR_VIEW } from "./layout.js";

const FOLLOW = 0.05;
const INTRO_FOLLOW = 0.02;
const INTRO_SECONDS = 3.5;
const PARALLAX_X = 0.8;
const PARALLAX_Y = 0.5;
const ARRIVE_DISTANCE = 0.25;
const SPEED_FOV = 14;
const UP = new Vector3(0, 1, 0);

export default function CameraRig() {
  const reduced = useReducedMotion();
  const goalPosition = useMemo(() => new Vector3(), []);
  const goalTarget = useMemo(() => new Vector3(), []);
  const scratch = useMemo(() => ({ body: new Vector3(), outward: new Vector3(), side: new Vector3(), last: new Vector3() }), []);
  const lookAt = useRef(null);
  const kick = useRef(0);

  useFrame(({ camera, size, pointer, clock }, delta) => {
    const { focus, panel, arrived } = useRoomStore.getState();
    let baseFov;

    if (focus === STAR_ID) {
      goalPosition.fromArray(STAR_VIEW.position);
      goalTarget.fromArray(STAR_VIEW.target);
      baseFov = FOCUS_FOV;
    } else if (focus && bodies[focus]) {
      const { radius } = PLANETS[focus];
      bodies[focus].getWorldPosition(scratch.body);
      scratch.outward.set(scratch.body.x, 0, scratch.body.z).normalize();
      scratch.side.crossVectors(UP, scratch.outward);
      goalPosition
        .copy(scratch.body)
        .addScaledVector(scratch.outward, radius * 4.4)
        .addScaledVector(UP, radius * 1.6)
        .addScaledVector(scratch.side, radius * 1.4);
      goalTarget.copy(scratch.body);
      baseFov = FOCUS_FOV;
    } else {
      const view = overviewView(size.width / size.height);
      goalPosition.fromArray(view.position);
      goalTarget.fromArray(view.target);
      baseFov = view.fov;
      if (!reduced) {
        goalPosition.x += pointer.x * PARALLAX_X;
        goalPosition.y += pointer.y * PARALLAX_Y;
      }
    }

    if (lookAt.current === null) {
      lookAt.current = goalTarget.clone();
      scratch.last.copy(camera.position);
    }
    const follow = reduced ? 1 : clock.elapsedTime < INTRO_SECONDS ? INTRO_FOLLOW : FOLLOW;
    camera.position.lerp(goalPosition, follow);
    lookAt.current.lerp(goalTarget, follow);
    camera.lookAt(lookAt.current);

    const speed = delta > 0 ? camera.position.distanceTo(scratch.last) / delta : 0;
    scratch.last.copy(camera.position);
    const wanted = reduced ? 0 : Math.min(speed / 12, 1);
    kick.current += (wanted - kick.current) * 0.1;
    const fov = baseFov + kick.current * SPEED_FOV;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    if (focus && panel === null && camera.position.distanceTo(goalPosition) < ARRIVE_DISTANCE) arrived(focus);
  });

  return null;
}
