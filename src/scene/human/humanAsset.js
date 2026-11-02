import {
  BufferAttribute,
  BufferGeometry,
  ClampToEdgeWrapping,
  DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  RGBAFormat,
  SRGBColorSpace,
  UnsignedByteType,
} from "three";
import { decodeHuman } from "./humanFormat.js";

export const HUMAN_URL = "/models/human/human.bin";

const srgbToLinear = Float32Array.from({ length: 256 }, (_, byte) => {
  const unit = byte / 255;
  return unit <= 0.04045 ? unit / 12.92 : Math.pow((unit + 0.055) / 1.055, 2.4);
});

function buildAsset(buffer) {
  const data = decodeHuman(buffer);
  const vertexCount = data.positions.length / 3;
  const { x0, x1, y0, y1 } = data.decalBounds;

  const colors = new Float32Array(data.colors.length);
  for (let i = 0; i < colors.length; i += 1) colors[i] = srgbToLinear[data.colors[i]];
  const decalUv = new Float32Array(vertexCount * 2);
  for (let i = 0; i < vertexCount; i += 1) {
    decalUv[i * 2] = (data.positions[i * 3] - x0) / (x1 - x0);
    decalUv[i * 2 + 1] = (data.positions[i * 3 + 1] - y0) / (y1 - y0);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(data.positions, 3));
  geometry.setAttribute("normal", new BufferAttribute(data.normals, 3, true));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  geometry.setAttribute("decalWeight", new BufferAttribute(data.weights, 1, true));
  geometry.setAttribute("decalUv", new BufferAttribute(decalUv, 2));
  geometry.setIndex(new BufferAttribute(data.indices, 1));
  geometry.computeBoundingSphere();

  const texture = new DataTexture(data.decal, data.decalWidth, data.decalHeight, RGBAFormat, UnsignedByteType);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return { geometry, texture, height: data.height };
}

const state = { value: null, error: null, promise: null };

export function readHumanAsset() {
  if (state.value) return state.value;
  if (state.error) throw state.error;
  if (!state.promise) {
    state.promise = fetch(HUMAN_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load ${HUMAN_URL} (${response.status})`);
        return response.arrayBuffer();
      })
      .then(buildAsset)
      .then(
        (asset) => {
          state.value = asset;
        },
        (error) => {
          state.error = error;
        },
      );
  }
  throw state.promise;
}
