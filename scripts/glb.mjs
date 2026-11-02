import { readFileSync } from "node:fs";

const COMPONENTS = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
const READERS = {
  5121: [1, (buffer, offset) => buffer.readUInt8(offset)],
  5123: [2, (buffer, offset) => buffer.readUInt16LE(offset)],
  5125: [4, (buffer, offset) => buffer.readUInt32LE(offset)],
  5126: [4, (buffer, offset) => buffer.readFloatLE(offset)],
};

export function readGlbMesh(path) {
  const buffer = readFileSync(path);
  const jsonLength = buffer.readUInt32LE(12);
  const json = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString());
  const binaryStart = 20 + jsonLength + 8;

  const read = (accessorIndex) => {
    const accessor = json.accessors[accessorIndex];
    const view = json.bufferViews[accessor.bufferView];
    const [size, readValue] = READERS[accessor.componentType];
    const components = COMPONENTS[accessor.type];
    const stride = view.byteStride ?? size * components;
    const start = binaryStart + (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
    const out = new Float64Array(accessor.count * components);
    for (let i = 0; i < accessor.count; i += 1) {
      for (let k = 0; k < components; k += 1)
        out[i * components + k] = readValue(buffer, start + i * stride + k * size);
    }
    return out;
  };

  const primitives = json.meshes.flatMap((mesh) => mesh.primitives);
  if (primitives.length !== 1) throw new Error(`Expected one primitive in ${path}, found ${primitives.length}`);
  const [primitive] = primitives;
  return {
    positions: new Float32Array(read(primitive.attributes.POSITION)),
    indices: new Uint32Array(read(primitive.indices)),
  };
}
