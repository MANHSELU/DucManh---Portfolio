export const STAR_ID = "gioi-thieu";
export const STAR_RADIUS = 0.85;

const ORBIT_SPEED = 0.07;
const ORBIT_START = 0.6;

export const PLANETS = {
  "quy-trinh": {
    kind: "moons",
    radius: 0.42,
    orbit: 3.0,
    speed: ORBIT_SPEED,
    angle: ORBIT_START,
    color: "#123c37",
  },
  "du-an": {
    kind: "rings",
    radius: 0.6,
    orbit: 7.4,
    speed: ORBIT_SPEED,
    angle: ORBIT_START + Math.PI / 2,
    color: "#0f4a43",
  },
  "ky-nang": {
    kind: "grid",
    radius: 0.5,
    orbit: 6.0,
    speed: ORBIT_SPEED,
    angle: ORBIT_START + Math.PI,
    color: "#0b2d2a",
  },
  "lien-he": {
    kind: "signal",
    radius: 0.45,
    orbit: 4.5,
    speed: ORBIT_SPEED,
    angle: ORBIT_START + (3 * Math.PI) / 2,
    color: "#14403b",
  },
};

export const SYSTEM_TILT = 0.1;

export function overviewView(aspect) {
  if (aspect < 1) {
    return {
      position: [0, 19, 25],
      target: [0, -1, 0],
      fov: Math.min(60, 34 / aspect),
    };
  }
  return { position: [2, 9, 16], target: [-3.2, -0.6, 0], fov: 34 };
}

export const FOCUS_FOV = 34;
export const STAR_VIEW = { position: [0, 0.5, 3.6], target: [0, 0, 0] };
