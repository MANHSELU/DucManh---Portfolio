import { AdditiveBlending, MeshBasicMaterial, MeshStandardMaterial } from "three";

const PROGRAM_KEY = "human-face-decal-v1";

export function createHumanMaterial(decalTexture, clippingPlanes) {
  const material = new MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.68,
    metalness: 0,
    ...(clippingPlanes && { clippingPlanes }),
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.decalMap = { value: decalTexture };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nattribute vec2 decalUv;\nattribute float decalWeight;\nvarying vec2 vDecalUv;\nvarying float vDecalWeight;",
      )
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvDecalUv = decalUv;\nvDecalWeight = decalWeight;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform sampler2D decalMap;\nvarying vec2 vDecalUv;\nvarying float vDecalWeight;",
      )
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\nvec4 decalSample = texture2D( decalMap, vDecalUv );\ndiffuseColor.rgb = mix( diffuseColor.rgb, decalSample.rgb, decalSample.a * vDecalWeight );",
      );
  };
  material.customProgramCacheKey = () => PROGRAM_KEY;
  return material;
}

export function createHologramMaterial(color, clippingPlanes) {
  return new MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.2,
    blending: AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    ...(clippingPlanes && { clippingPlanes }),
  });
}
