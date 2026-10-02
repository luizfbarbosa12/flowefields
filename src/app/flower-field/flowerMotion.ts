import { MAX_FLOWER_DELAY_SECONDS, type FlowerData } from './flowerModel';

export interface FlowerFrame {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export const BLOOM_DURATION_MS = 1400;
export const CLEAR_DURATION_MS = 400;
export const BLOOM_COMPLETE_MS =
  MAX_FLOWER_DELAY_SECONDS * 1000 + BLOOM_DURATION_MS;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function dampedSpring(progress: number): number {
  const t = clamp01(progress);
  if (t === 0 || t === 1) return t;
  return 1 - Math.exp(-6 * t) * Math.cos(10 * t);
}

function targetPosition(flower: FlowerData, viewport: ViewportSize) {
  return {
    x: (flower.x / 100) * viewport.width,
    y: (flower.y / 100) * viewport.height,
  };
}

export function sampleSettledFlower(
  flower: FlowerData,
  elapsedMs: number,
  viewport: ViewportSize,
  reducedMotion = false,
): FlowerFrame {
  const target = targetPosition(flower, viewport);
  if (reducedMotion) {
    return { ...target, scale: 1, rotation: flower.rotation, opacity: 1 };
  }

  const elapsedSeconds = elapsedMs / 1000;
  const sway = Math.sin(elapsedSeconds * 0.8 + flower.phase);
  const lift = Math.cos(elapsedSeconds * 0.55 + flower.phase) * 0.5 + 0.5;
  const amplitude = 1.5 + flower.depth * 3;

  return {
    x: target.x + sway * amplitude,
    y: target.y - lift * amplitude,
    scale: 1,
    rotation: flower.rotation + sway * (1.5 + flower.depth * 2),
    opacity: 1,
  };
}

export function sampleBloomFlower(
  flower: FlowerData,
  elapsedMs: number,
  viewport: ViewportSize,
  reducedMotion = false,
): FlowerFrame {
  if (reducedMotion)
    return sampleSettledFlower(flower, elapsedMs, viewport, true);

  const localElapsed = elapsedMs - flower.delay * 1000;
  const progress = clamp01(localElapsed / BLOOM_DURATION_MS);
  const spring = dampedSpring(progress);
  const target = targetPosition(flower, viewport);
  const center = { x: viewport.width / 2, y: viewport.height / 2 };
  const delta = { x: target.x - center.x, y: target.y - center.y };
  const distance = Math.hypot(delta.x, delta.y) || 1;
  const arcStrength =
    Math.min(70, distance * 0.12) * flower.arc * Math.sin(Math.PI * progress);
  const perpendicular = { x: -delta.y / distance, y: delta.x / distance };

  return {
    x: center.x + delta.x * spring + perpendicular.x * arcStrength,
    y: center.y + delta.y * spring + perpendicular.y * arcStrength,
    scale: Math.max(0, spring),
    rotation: flower.rotation - 120 * (1 - spring),
    opacity: clamp01(progress * 2.5),
  };
}

export function sampleClearingFlower(
  flower: FlowerData,
  elapsedMs: number,
  viewport: ViewportSize,
  reducedMotion = false,
): FlowerFrame {
  const target = targetPosition(flower, viewport);
  if (reducedMotion)
    return { ...target, scale: 0, rotation: flower.rotation, opacity: 0 };

  const progress = clamp01(elapsedMs / CLEAR_DURATION_MS);
  const eased = 1 - (1 - progress) ** 3;
  const center = { x: viewport.width / 2, y: viewport.height / 2 };

  return {
    x: target.x + (center.x - target.x) * eased,
    y: target.y + (center.y - target.y) * eased,
    scale: 1 - eased,
    rotation: flower.rotation - 120 * eased,
    opacity: 1 - progress,
  };
}
