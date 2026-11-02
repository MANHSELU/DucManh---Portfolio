import { Stars } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useReducedMotion } from "../hooks/useReducedMotion.js";

export default function Atmosphere() {
  const reduced = useReducedMotion();
  return (
    <>
      <Stars radius={70} depth={40} count={2200} factor={3.2} saturation={0} fade speed={reduced ? 0 : 0.4} />
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.62} luminanceSmoothing={0.25} radius={0.7} />
        <Vignette offset={0.28} darkness={0.75} />
      </EffectComposer>
    </>
  );
}
