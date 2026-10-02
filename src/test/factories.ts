import type { FlowerData } from '../app/flower-field/flowerModel';

export function makeFlower(overrides: Partial<FlowerData> = {}): FlowerData {
  return {
    x: 75,
    y: 25,
    type: 0,
    delay: 0,
    rotation: 90,
    size: 1,
    depth: 0.5,
    phase: 0,
    arc: 0,
    ...overrides,
  };
}

export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}
