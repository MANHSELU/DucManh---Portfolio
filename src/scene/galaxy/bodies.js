export const bodies = {};

export function registerBody(id, object) {
  if (object) bodies[id] = object;
  else delete bodies[id];
}
