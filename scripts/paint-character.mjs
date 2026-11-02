import { readPng } from "./png.mjs";

export const MODEL_HEIGHT = 1.9;

const REFERENCE = {
  path: new URL("./reference/character.png", import.meta.url),
  width: 497,
  centerX: 265,
  bottom: 876,
  pixelSize: 0.002169,
};
const NECK_Y = 1.39;
const WAIST_Y = 0.86;
const BACK_HEM_Y = 0.87;
const SHOE_TOP_Y = 0.13;
const BLUR = 4;
const HEAD_HALF_WIDTH = 0.17;
const HAIR = [43, 32, 30];
const SHIRT = [236, 235, 240];
const PANTS = [38, 36, 39];
const ERODE = 2;
const SEARCH = 30;
const VISIBLE_DEPTH = 0.012;

const smooth = (edge0, edge1, value) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export function normalizePositions(source) {
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 1; i < source.length; i += 3) {
    minY = Math.min(minY, source[i]);
    maxY = Math.max(maxY, source[i]);
  }
  const scale = MODEL_HEIGHT / (maxY - minY);
  const positions = new Float32Array(source.length);
  for (let i = 0; i < source.length; i += 3) {
    positions[i] = source[i] * scale;
    positions[i + 1] = (source[i + 1] - minY) * scale;
    positions[i + 2] = source[i + 2] * scale;
  }
  return positions;
}

function loadReference() {
  const png = readPng(REFERENCE.path);
  const { width } = REFERENCE;
  const { height } = png;
  const rgb = new Uint8Array(width * height * 3);
  for (let y = 0; y < height; y += 1)
    rgb.set(png.rgb.subarray(y * png.width * 3, y * png.width * 3 + width * 3), y * width * 3);

  const solid = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i += 1) {
    const [r, g, b] = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]];
    const background = Math.max(r, g, b) - Math.min(r, g, b) < 22 && b >= r && r > 95 && r < 200;
    solid[i] = background || i < width ? 0 : 1;
  }
  const core = new Uint8Array(width * height);
  for (let y = ERODE; y < height - ERODE; y += 1) {
    for (let x = ERODE; x < width - ERODE; x += 1) {
      let keep = 1;
      for (let dy = -ERODE; dy <= ERODE && keep; dy += 1) {
        for (let dx = -ERODE; dx <= ERODE && keep; dx += 1) keep = solid[(y + dy) * width + x + dx];
      }
      core[y * width + x] = keep;
    }
  }
  return {
    width,
    height,
    rgb,
    blurred: blur(rgb, core, width, height),
    solid,
    core,
  };
}

function blur(rgb, core, width, height) {
  const out = new Uint8Array(rgb);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!core[y * width + x]) continue;
      const sum = [0, 0, 0];
      let count = 0;
      for (let dy = -BLUR; dy <= BLUR; dy += 1) {
        for (let dx = -BLUR; dx <= BLUR; dx += 1) {
          const sx = x + dx;
          const sy = y + dy;
          if (sx < 0 || sy < 0 || sx >= width || sy >= height || !core[sy * width + sx]) continue;
          const index = (sy * width + sx) * 3;
          sum[0] += rgb[index];
          sum[1] += rgb[index + 1];
          sum[2] += rgb[index + 2];
          count += 1;
        }
      }
      for (let k = 0; k < 3; k += 1) out[(y * width + x) * 3 + k] = Math.round(sum[k] / count);
    }
  }
  return out;
}

function toPixel(x, y) {
  return [REFERENCE.centerX + x / REFERENCE.pixelSize, REFERENCE.bottom - y / REFERENCE.pixelSize];
}

function buildDepth(positions, indices, { width, height }) {
  const depth = new Float32Array(width * height).fill(-Infinity);
  const point = (index) => {
    const [px, py] = toPixel(positions[index * 3], positions[index * 3 + 1]);
    return [px, py, positions[index * 3 + 2]];
  };
  for (let t = 0; t < indices.length; t += 3) {
    const [a, b, c] = [point(indices[t]), point(indices[t + 1]), point(indices[t + 2])];
    const area = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
    if (Math.abs(area) < 1e-9) continue;
    const minX = Math.max(0, Math.floor(Math.min(a[0], b[0], c[0])));
    const maxX = Math.min(width - 1, Math.ceil(Math.max(a[0], b[0], c[0])));
    const minY = Math.max(0, Math.floor(Math.min(a[1], b[1], c[1])));
    const maxY = Math.min(height - 1, Math.ceil(Math.max(a[1], b[1], c[1])));
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const px = x + 0.5;
        const py = y + 0.5;
        const w1 = ((px - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (py - a[1])) / area;
        const w2 = ((b[0] - a[0]) * (py - a[1]) - (px - a[0]) * (b[1] - a[1])) / area;
        const w0 = 1 - w1 - w2;
        if (w0 < -0.01 || w1 < -0.01 || w2 < -0.01) continue;
        const z = w0 * a[2] + w1 * b[2] + w2 * c[2];
        const index = y * width + x;
        if (z > depth[index]) depth[index] = z;
      }
    }
  }
  return depth;
}

function nearestCore(reference, px, py) {
  const { width, height, core } = reference;
  const cx = Math.min(width - 1, Math.max(0, Math.floor(px)));
  const cy = Math.min(height - 1, Math.max(0, Math.floor(py)));
  if (core[cy * width + cx]) return cy * width + cx;
  for (let radius = 1; radius <= SEARCH; radius += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && y >= 0 && x < width && y < height && core[y * width + x]) return y * width + x;
      }
    }
  }
  return -1;
}

const isSkin = ([r, g, b]) => r > 150 && r - b > 35 && r >= g;

function buildDecal({ width, height, rgb, solid }) {
  const filled = new Uint8Array(rgb);
  const known = new Uint8Array(solid);
  for (let pass = 0; pass < 6; pass += 1) {
    const next = new Uint8Array(known);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const index = y * width + x;
        if (known[index]) continue;
        const sum = [0, 0, 0];
        let count = 0;
        for (const neighbour of [index - 1, index + 1, index - width, index + width]) {
          if (!known[neighbour]) continue;
          for (let k = 0; k < 3; k += 1) sum[k] += filled[neighbour * 3 + k];
          count += 1;
        }
        if (!count) continue;
        for (let k = 0; k < 3; k += 1) filled[index * 3 + k] = Math.round(sum[k] / count);
        next[index] = 1;
      }
    }
    known.set(next);
  }
  const decal = new Uint8Array(width * height * 4);
  for (let row = 0; row < height; row += 1) {
    const source = height - 1 - row;
    for (let x = 0; x < width; x += 1) {
      const from = source * width + x;
      const to = (row * width + x) * 4;
      decal.set(filled.subarray(from * 3, from * 3 + 3), to);
      decal[to + 3] = solid[from] ? 255 : 0;
    }
  }
  return decal;
}

export function paintCharacter(positions, normals, indices) {
  const reference = loadReference();
  const { width, height, blurred, core } = reference;
  const depth = buildDepth(positions, indices, reference);
  const vertexCount = positions.length / 3;

  let headZ = 0;
  let headX = 0;
  let headCount = 0;
  for (let i = 0; i < vertexCount; i += 1) {
    if (positions[i * 3 + 1] < 1.5) continue;
    headX += positions[i * 3];
    headZ += positions[i * 3 + 2];
    headCount += 1;
  }
  headX /= headCount;
  headZ /= headCount;

  const colors = new Uint8Array(vertexCount * 3);
  const weights = new Uint8Array(vertexCount);
  for (let i = 0; i < vertexCount; i += 1) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    const [px, py] = toPixel(x, y);
    const pixel = Math.floor(py) * width + Math.floor(px);
    const inImage = px >= 0 && py >= 0 && px < width && py < height;
    const visible = inImage && depth[pixel] - z < VISIBLE_DEPTH;

    const nearest = nearestCore(reference, px, py);
    let color = nearest >= 0 ? [blurred[nearest * 3], blurred[nearest * 3 + 1], blurred[nearest * 3 + 2]] : SHIRT;
    if (!visible) {
      const backOfHead = y > NECK_Y && z < headZ - 0.03 && Math.abs(x - headX) < HEAD_HALF_WIDTH;
      if (backOfHead) color = HAIR;
      else if (y < BACK_HEM_Y && y > SHOE_TOP_Y) color = PANTS;
      else if (y <= NECK_Y && isSkin(color)) color = y > WAIST_Y ? SHIRT : PANTS;
    }
    colors.set(color, i * 3);

    const facing = smooth(0.15, 0.45, normals[i * 3 + 2]);
    const inside = inImage && core[pixel] ? 1 : 0;
    weights[i] = Math.round(255 * (visible ? 1 : 0) * facing * inside);
  }

  const { pixelSize, centerX, bottom } = REFERENCE;
  return {
    colors,
    weights,
    decal: buildDecal(reference),
    decalWidth: width,
    decalHeight: height,
    decalBounds: {
      x0: (0 - centerX) * pixelSize,
      x1: (width - centerX) * pixelSize,
      y0: (bottom - height) * pixelSize,
      y1: bottom * pixelSize,
    },
  };
}
