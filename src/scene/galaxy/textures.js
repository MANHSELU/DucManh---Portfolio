import { CanvasTexture, SRGBColorSpace } from "three";

const cache = {};

function canvas(width, height) {
  const element = document.createElement("canvas");
  element.width = width;
  element.height = height;
  return [element, element.getContext("2d")];
}

export function glowTexture() {
  if (cache.glow) return cache.glow;
  const [element, g] = canvas(128, 128);
  const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.65)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.15)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gradient;
  g.fillRect(0, 0, 128, 128);
  cache.glow = new CanvasTexture(element);
  return cache.glow;
}

export function bandTexture(key, base, accent) {
  if (cache[key]) return cache[key];
  const [element, g] = canvas(256, 128);
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 128);
  let seed = key.length * 97;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let y = 0; y < 128; y += 4 + Math.floor(random() * 6)) {
    g.globalAlpha = 0.12 + random() * 0.35;
    g.fillStyle = random() > 0.7 ? accent : "#05100f";
    g.fillRect(0, y, 256, 2 + Math.floor(random() * 5));
  }
  g.globalAlpha = 1;
  const texture = new CanvasTexture(element);
  texture.colorSpace = SRGBColorSpace;
  cache[key] = texture;
  return texture;
}
