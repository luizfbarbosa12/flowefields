import { FLOWER_TYPE_COUNT } from './flowerAssets';

export interface FlowerData {
  x: number;
  y: number;
  type: number;
  delay: number;
  rotation: number;
  size: number;
  depth: number;
  phase: number;
  arc: number;
}

export const FLOWER_COUNT = 400;
export const MAX_FLOWER_DELAY_SECONDS = 2.3;

const MAX_DISTANCE = Math.sqrt(50 ** 2 + 50 ** 2);

export function generateFlowers(
  count = FLOWER_COUNT,
  random: () => number = Math.random,
): FlowerData[] {
  return Array.from({ length: count }, () => {
    const x = random() * 100;
    const y = random() * 100;
    const distance = Math.sqrt((x - 50) ** 2 + (y - 50) ** 2);

    return {
      x,
      y,
      type: Math.floor(random() * FLOWER_TYPE_COUNT),
      delay: (distance / MAX_DISTANCE) * 2 + random() * 0.3,
      rotation: random() * 360,
      size: 0.6 + random() * 0.8,
      depth: 0.35 + random() * 0.65,
      phase: random() * Math.PI * 2,
      arc: random() * 2 - 1,
    };
  });
}
