import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

const CHANNELS = { 0: 1, 2: 3, 4: 2, 6: 4 };

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

export function readPng(path) {
  const file = readFileSync(path);
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const chunks = [];
  while (offset < file.length) {
    const length = file.readUInt32BE(offset);
    const type = file.toString("ascii", offset + 4, offset + 8);
    const data = file.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || data[12] !== 0) throw new Error("Only 8-bit non-interlaced PNG is supported");
      colorType = data[9];
    } else if (type === "IDAT") chunks.push(data);
    else if (type === "IEND") break;
    offset += 12 + length;
  }
  const channels = CHANNELS[colorType];
  if (!channels) throw new Error(`Unsupported PNG color type ${colorType}`);
  const raw = inflateSync(Buffer.concat(chunks));
  const stride = width * channels;
  const pixels = new Uint8Array(height * stride);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const source = y * (stride + 1) + 1;
    const row = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const left = x >= channels ? pixels[row + x - channels] : 0;
      const up = y > 0 ? pixels[row - stride + x] : 0;
      const upLeft = y > 0 && x >= channels ? pixels[row - stride + x - channels] : 0;
      const value = raw[source + x];
      let result = value;
      if (filter === 1) result = value + left;
      else if (filter === 2) result = value + up;
      else if (filter === 3) result = value + ((left + up) >> 1);
      else if (filter === 4) result = value + paeth(left, up, upLeft);
      pixels[row + x] = result & 255;
    }
  }
  const rgb = new Uint8Array(width * height * 3);
  for (let i = 0; i < width * height; i += 1) {
    if (channels >= 3) {
      rgb[i * 3] = pixels[i * channels];
      rgb[i * 3 + 1] = pixels[i * channels + 1];
      rgb[i * 3 + 2] = pixels[i * channels + 2];
    } else {
      rgb.fill(pixels[i * channels], i * 3, i * 3 + 3);
    }
  }
  return { width, height, rgb };
}
