import { STAR_SIZES } from "./starTypes";
import { getGlowSprite } from "./starSprite";

const IGNITE_MS = 350;   // glow grows to full flare
const SETTLE_MS = 3000;  // flare shrinks down to resting size
const REST_GLOW = 0.45;  // glow brightness once resting
const TWINKLE = 0.08;    // how much resting stars flicker
const TWINKLE_SPEED = 1.3;

function easeOut(p) {
  return 1 - Math.pow(1 - p, 3);
}

// Draws one star at whatever stage of its life it is in.
// Nothing is stored between frames: the look is worked out from the
// star's age (ms since it appeared on screen).
// "now" is only used for the twinkle.
export function drawStar(ctx, star, age, now, width, height) {
  const preset = STAR_SIZES[star.size];
  const x = star.x * width;
  const y = star.y * height;

  let glowRadius;
  let glowAlpha;
  let coreRadius;
  let spikeStrength;

  if (age < IGNITE_MS) {
    // 1. Ignition: fast growth to the full flare
    const p = easeOut(age / IGNITE_MS);
    glowRadius = preset.halo + (preset.flare - preset.halo) * p;
    glowAlpha = REST_GLOW + (1 - REST_GLOW) * p;
    coreRadius = preset.core * (1 + 1.5 * p);
    spikeStrength = p;
  } else if (age < IGNITE_MS + SETTLE_MS) {
    // 2. Settling: shrinks quickly at first, then gently
    const p = easeOut((age - IGNITE_MS) / SETTLE_MS);
    glowRadius = preset.flare + (preset.halo - preset.flare) * p;
    glowAlpha = 1 + (REST_GLOW - 1) * p;
    coreRadius = preset.core * (2.5 - 1.5 * p);
    spikeStrength = 1 - p;
  } else {
    // 3. Resting: small dot, faint halo, slow twinkle
    const twinkle = Math.sin((now / 1000) * TWINKLE_SPEED + star.phase);
    glowRadius = preset.halo;
    glowAlpha = REST_GLOW + TWINKLE * twinkle;
    coreRadius = preset.core;
    spikeStrength = 0;
  }

  const sprite = getGlowSprite();
  ctx.globalAlpha = glowAlpha;
  ctx.drawImage(sprite, x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);

  if (preset.spikes && spikeStrength > 0.01) {
    drawSpikes(ctx, x, y, preset.flare * 1.8 * spikeStrength, spikeStrength);
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
  ctx.fill();
}

// Diffraction spikes: a thin cross of light that fades toward its ends.
function drawSpikes(ctx, x, y, length, strength) {
  ctx.globalAlpha = strength * 0.8;
  ctx.lineWidth = 1;

  for (const [dx, dy] of [[1, 0], [0, 1]]) {
    const x1 = x - dx * length;
    const y1 = y - dy * length;
    const x2 = x + dx * length;
    const y2 = y + dy * length;

    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
