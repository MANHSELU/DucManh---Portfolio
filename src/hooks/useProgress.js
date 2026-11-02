import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion.js";

export function useProgress(duration) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return undefined;
    }
    let frame = 0;
    const start = performance.now();
    const step = (now) => {
      const value = Math.min(1, (now - start) / duration);
      setProgress(value);
      if (value < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [duration, reduced]);

  return progress;
}
