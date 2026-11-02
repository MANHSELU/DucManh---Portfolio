const MAGIC = 0x314d5548;
const VERSION = 2;
const HEADER_WORDS = 12;

const pad4 = (length) => (length + 3) & ~3;

export function encodeHuman({
  positions,
  normals,
  colors,
  weights,
  indices,
  decal,
  decalWidth,
  decalHeight,
  decalBounds,
  height,
}) {
  const sections = [positions, normals, colors, weights, indices, decal];
  const total = HEADER_WORDS * 4 + sections.reduce((sum, part) => sum + pad4(part.byteLength), 0);
  const buffer = new ArrayBuffer(total);
  const header = new DataView(buffer);
  header.setUint32(0, MAGIC, true);
  header.setUint32(4, VERSION, true);
  header.setUint32(8, positions.length / 3, true);
  header.setUint32(12, indices.length, true);
  header.setUint32(16, decalWidth, true);
  header.setUint32(20, decalHeight, true);
  header.setFloat32(24, height, true);
  header.setFloat32(28, decalBounds.x0, true);
  header.setFloat32(32, decalBounds.x1, true);
  header.setFloat32(36, decalBounds.y0, true);
  header.setFloat32(40, decalBounds.y1, true);

  let offset = HEADER_WORDS * 4;
  for (const part of sections) {
    new Uint8Array(buffer, offset, part.byteLength).set(new Uint8Array(part.buffer, part.byteOffset, part.byteLength));
    offset += pad4(part.byteLength);
  }
  return buffer;
}

export function decodeHuman(buffer) {
  const header = new DataView(buffer);
  if (header.getUint32(0, true) !== MAGIC) throw new Error("Not a human model file");
  if (header.getUint32(4, true) !== VERSION) throw new Error("Unsupported human model version");
  const vertexCount = header.getUint32(8, true);
  const indexCount = header.getUint32(12, true);
  const decalWidth = header.getUint32(16, true);
  const decalHeight = header.getUint32(20, true);
  const height = header.getFloat32(24, true);
  const decalBounds = {
    x0: header.getFloat32(28, true),
    x1: header.getFloat32(32, true),
    y0: header.getFloat32(36, true),
    y1: header.getFloat32(40, true),
  };

  let offset = HEADER_WORDS * 4;
  const take = (Type, count) => {
    const view = new Type(buffer, offset, count);
    offset += pad4(view.byteLength);
    return view;
  };
  return {
    height,
    decalWidth,
    decalHeight,
    decalBounds,
    positions: take(Float32Array, vertexCount * 3),
    normals: take(Int8Array, vertexCount * 3),
    colors: take(Uint8Array, vertexCount * 3),
    weights: take(Uint8Array, vertexCount),
    indices: take(Uint32Array, indexCount),
    decal: take(Uint8Array, decalWidth * decalHeight * 4),
  };
}
