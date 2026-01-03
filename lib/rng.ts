import seedrandom from 'seedrandom';

export function rng(seed: number) {
  return seedrandom(String(seed));
}

export function randomSeed() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
