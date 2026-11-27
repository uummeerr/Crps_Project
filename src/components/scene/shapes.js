// The shapes the particle sculpture can take. Each function returns a
// Float32Array of x, y, z for `count` points, roughly inside a 2-unit cube
// around the origin. The same particle index is used in every shape, so the
// sculpture can blend from one to the next by moving each point.
//
// Positions come from a seeded generator, never Math.random(): the result is
// the same on every visit, and nothing here is random at render time (which
// this project's Cache Components setting forbids).

// Small, fast, repeatable random numbers in [0, 1).
function generator(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function fill(count, seed, place) {
  const random = generator(seed);
  const points = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = place(index / count, random, index);
    points[index * 3] = x;
    points[index * 3 + 1] = y;
    points[index * 3 + 2] = z;
  }
  return points;
}

// 0. Aura (hero): a wide, tilted ring of orbits, like a halo behind the portrait.
function aura(count) {
  const tilt = 1.02;
  return fill(count, 11, (_, random) => {
    const angle = random() * Math.PI * 2;
    const band = Math.floor(random() * 5);
    const radius = 0.78 + band * 0.11 + (random() - 0.5) * 0.05;
    const x = Math.cos(angle) * radius;
    const flat = Math.sin(angle) * radius;
    const lift = (random() - 0.5) * 0.05 + Math.sin(angle * 3 + band) * 0.03;
    return [x, lift * Math.cos(tilt) + flat * Math.sin(tilt) * 0.55, flat * Math.cos(tilt) - lift * Math.sin(tilt)];
  });
}

// 1. Strand (the trigger): one nerve fibre running from low left to high
//    right, with a few fine branches.
function strand(count) {
  return fill(count, 23, (_, random) => {
    const along = random();
    const branch = random() < 0.22;
    const x = -1.25 + along * 2.5;
    const y = -0.7 + along * 1.35 + Math.sin(along * 7.2) * 0.13;
    const z = Math.sin(along * 4.1) * 0.22;
    const thickness = branch ? 0 : 0.028;
    if (!branch) {
      const around = random() * Math.PI * 2;
      return [x, y + Math.cos(around) * thickness, z + Math.sin(around) * thickness];
    }
    // A branch leaves the fibre and curls away from it.
    const reach = random() * 0.42;
    const side = random() < 0.5 ? 1 : -1;
    const lean = (Math.floor(along * 9) % 3) - 1;
    return [x + reach * 0.35 * lean, y + side * reach * (0.5 + reach), z + reach * 0.5 * side];
  });
}

// 2. Storm (the signal that will not stop): a jagged, spiking burst.
function storm(count) {
  return fill(count, 37, (_, random) => {
    const polar = Math.acos(1 - 2 * random());
    const around = random() * Math.PI * 2;
    const spike = Math.pow(random(), 2.6);
    const jag = Math.abs(Math.sin(around * 9) * Math.cos(polar * 7));
    const radius = 0.34 + spike * 0.95 * (0.35 + jag);
    return [
      Math.sin(polar) * Math.cos(around) * radius * 1.15,
      Math.cos(polar) * radius,
      Math.sin(polar) * Math.sin(around) * radius,
    ];
  });
}

// 3. Brain (the diagnosis): two lobed hemispheres with folds on the surface.
function brain(count) {
  return fill(count, 53, (fraction, random, index) => {
    const polar = Math.acos(1 - (2 * (index + 0.5)) / count);
    const around = Math.PI * (1 + Math.sqrt(5)) * index;
    let x = Math.sin(polar) * Math.cos(around);
    const y = Math.cos(polar);
    const z = Math.sin(polar) * Math.sin(around);
    const folds = Math.sin(x * 11 + y * 7) * Math.sin(z * 9 - y * 5) * 0.055;
    const radius = 0.86 + folds + (random() - 0.5) * 0.012;
    // Pull the two halves slightly apart along the middle.
    x += Math.sign(x || 1) * 0.045;
    return [x * radius * 1.08, y * radius * 0.84 - Math.max(0, -y) * 0.08, z * radius * 0.96];
  });
}

// 4. Column (the plan): an ordered spinal column, vertebra by vertebra, with
//    the cord running through it.
function column(count) {
  const levels = 20;
  return fill(count, 71, (_, random) => {
    const cord = random() < 0.18;
    const level = Math.floor(random() * levels);
    const height = cord ? random() * 2.3 - 1.15 : -1.1 + (level / (levels - 1)) * 2.2 + (random() - 0.5) * 0.05;
    const sway = Math.sin(height * 1.5) * 0.11;
    if (cord) {
      const around = random() * Math.PI * 2;
      return [sway + Math.cos(around) * 0.03, height, Math.sin(around) * 0.03];
    }
    const around = random() * Math.PI * 2;
    // Mostly on the rim of each disc, some across its face.
    const radius = (random() < 0.7 ? 1 : Math.sqrt(random())) * (0.2 + Math.sin((level / levels) * Math.PI) * 0.07);
    return [sway + Math.cos(around) * radius, height, Math.sin(around) * radius * 0.82];
  });
}

// 5. Wave (after the story): a wide, calm sheet that gently ripples.
function wave(count) {
  return fill(count, 89, (_, random) => {
    const x = (random() - 0.5) * 4.4;
    const z = (random() - 0.5) * 1.3;
    return [x, Math.sin(x * 1.9 + z * 1.4) * 0.11 + Math.cos(x * 0.7 - z * 2.2) * 0.05, z];
  });
}

// How each shape is presented: where it sits across the screen (in units of
// half the visible width, positive is right), its size, how much the points
// jitter, and the point size.
export const PRESENTATION = [
  { across: 0.46, scale: 1.3, jitter: 0.03, size: 1.0 },
  { across: 0.4, scale: 0.92, jitter: 0.016, size: 1.1 },
  { across: 0.4, scale: 1.0, jitter: 0.17, size: 1.0 },
  { across: 0.4, scale: 1.02, jitter: 0.02, size: 1.05 },
  { across: 0.4, scale: 0.98, jitter: 0.012, size: 1.1 },
  { across: 0.0, scale: 1.55, jitter: 0.03, size: 0.9 },
];

export function buildShapes(count) {
  return [aura(count), strand(count), storm(count), brain(count), column(count), wave(count)];
}

// One number per particle, used to vary size and timing.
export function buildSeeds(count) {
  const random = generator(5);
  const seeds = new Float32Array(count);
  for (let index = 0; index < count; index += 1) seeds[index] = random();
  return seeds;
}
