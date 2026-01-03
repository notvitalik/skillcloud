export type WeightingInput = {
  years: number;
  maxYears: number;
  minSize?: number;
  maxSize?: number;
};

const DEFAULT_MIN = 14;
const DEFAULT_MAX = 72;

export function computeWeight({ years, maxYears, minSize = DEFAULT_MIN, maxSize = DEFAULT_MAX }: WeightingInput) {
  const clampedMax = Math.max(maxYears, 0);
  const y = Math.min(Math.max(years, 0), clampedMax);
  const t = clampedMax === 0 ? 0 : y / clampedMax;
  const size = minSize + (maxSize - minSize) * Math.sqrt(t);
  const opacity = 0.55 + 0.45 * t;
  const glow = 0.2 + 0.8 * t;

  return { size, opacity, glow, t };
}
