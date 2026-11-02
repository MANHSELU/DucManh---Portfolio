import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BufferAttribute, BufferGeometry } from "three";
import { encodeHuman } from "../src/scene/human/humanFormat.js";
import { readGlbMesh } from "./glb.mjs";
import { MODEL_HEIGHT, normalizePositions, paintCharacter } from "./paint-character.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = resolve(root, "public/models/chibi-businessman/white_mesh.glb");
const OUTPUT = resolve(root, "public/models/human/human.bin");

const mesh = readGlbMesh(SOURCE);
const positions = normalizePositions(mesh.positions);
const geometry = new BufferGeometry();
geometry.setAttribute("position", new BufferAttribute(positions, 3));
geometry.setIndex(new BufferAttribute(mesh.indices, 1));
geometry.computeVertexNormals();
const normals = geometry.attributes.normal.array;

const painted = paintCharacter(positions, normals, mesh.indices);
const packedNormals = new Int8Array(normals.length);
for (let i = 0; i < normals.length; i += 1) packedNormals[i] = Math.round(Math.min(1, Math.max(-1, normals[i])) * 127);

const buffer = encodeHuman({
  positions,
  normals: packedNormals,
  colors: painted.colors,
  weights: painted.weights,
  indices: mesh.indices,
  decal: painted.decal,
  decalWidth: painted.decalWidth,
  decalHeight: painted.decalHeight,
  decalBounds: painted.decalBounds,
  height: MODEL_HEIGHT,
});

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, Buffer.from(buffer));
console.log(`vertices ${positions.length / 3}, triangles ${mesh.indices.length / 3}`);
console.log(`wrote ${OUTPUT} (${(statSync(OUTPUT).size / 1024 / 1024).toFixed(2)} MB)`);
