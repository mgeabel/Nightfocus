// Size presets. Every star uses the same drawing code;
// only these numbers change between sizes.
//   core:   radius of the solid dot (px)
//   halo:   radius of the faint glow while resting (px)
//   flare:  radius of the big glow at the peak of the flare (px)
//   weight: how often this size gets picked (out of the total)
//   spikes: draw diffraction spikes during the flare
export const STAR_SIZES = {
  small: { core: 0.7, halo: 3, flare: 16, weight: 70, spikes: false },
  medium: { core: 1.1, halo: 5, flare: 26, weight: 25, spikes: false },
  large: { core: 1.6, halo: 8, flare: 40, weight: 5, spikes: true },
};

// Weighted random pick: small 70%, medium 25%, large 5%.
export function pickSize() {
  const entries = Object.entries(STAR_SIZES);
  const total = entries.reduce((sum, [, preset]) => sum + preset.weight, 0);
  let roll = Math.random() * total;

  for (const [name, preset] of entries) {
    roll -= preset.weight;
    if (roll < 0) return name;
  }
  return entries[0][0];
}

// A star is plain data. x and y are fractions of the screen (0 to 1),
// so the same star lands in the same spot on any screen size.
export function createStar(size = pickSize()) {
  return {
    x: 0.05 + Math.random() * 0.9,
    y: 0.05 + Math.random() * 0.9,
    size,
    phase: Math.random() * Math.PI * 2, // so stars don't all twinkle in sync
  };
}
