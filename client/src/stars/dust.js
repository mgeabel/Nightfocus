// Faint background dots. They never move, so they are drawn once
// onto their own canvas and only redrawn when the window resizes.
export function createDust(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: 0.3 + Math.random() * 0.6,
    alpha: 0.1 + Math.random() * 0.3,
  }));
}

export function drawDust(ctx, dust, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff";

  for (const d of dust) {
    ctx.globalAlpha = d.alpha;
    ctx.beginPath();
    ctx.arc(d.x * width, d.y * height, d.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}
