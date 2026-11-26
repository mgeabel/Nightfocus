// The glow is drawn once onto a small hidden canvas (a "sprite"),
// then stamped onto the screen at any size. Building a gradient for
// every star on every frame would be much slower.
const SPRITE_SIZE = 64;

let sprite = null;

export function getGlowSprite() {
  if (sprite) return sprite;

  const canvas = document.createElement("canvas");
  canvas.width = SPRITE_SIZE;
  canvas.height = SPRITE_SIZE;

  const ctx = canvas.getContext("2d");
  const r = SPRITE_SIZE / 2;
  const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.6)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.15)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  sprite = canvas;
  return sprite;
}
