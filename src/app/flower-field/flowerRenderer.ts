import { FLOWER_VARIANTS, type FlowerImages } from './flowerAssets';
import type { FlowerData } from './flowerModel';
import {
  sampleBloomFlower,
  sampleClearingFlower,
  sampleSettledFlower,
  type ViewportSize,
} from './flowerMotion';

export type FlowerFieldPhase = 'blooming' | 'settled' | 'clearing';

export interface RenderFlowerFieldOptions {
  context: CanvasRenderingContext2D;
  flowers: FlowerData[];
  images: FlowerImages;
  viewport: ViewportSize;
  phase: FlowerFieldPhase;
  elapsedMs: number;
  reducedMotion: boolean;
}

export function sortFlowersByDepth(flowers: FlowerData[]): FlowerData[] {
  return [...flowers].sort((first, second) => first.depth - second.depth);
}

export function renderFlowerField({
  context,
  flowers,
  images,
  viewport,
  phase,
  elapsedMs,
  reducedMotion,
}: RenderFlowerFieldOptions): void {
  context.clearRect(0, 0, viewport.width, viewport.height);

  for (const flower of flowers) {
    const image = images[flower.type % images.length];
    if (!image) continue;

    let frame;
    switch (phase) {
      case 'blooming':
        frame = sampleBloomFlower(flower, elapsedMs, viewport, reducedMotion);
        break;
      case 'clearing':
        frame = sampleClearingFlower(
          flower,
          elapsedMs,
          viewport,
          reducedMotion,
        );
        break;
      case 'settled':
        frame = sampleSettledFlower(flower, elapsedMs, viewport, reducedMotion);
        break;
    }

    if (frame.opacity <= 0 || frame.scale <= 0) continue;

    const variant = FLOWER_VARIANTS[flower.type % FLOWER_VARIANTS.length];
    const depthScale = 0.82 + flower.depth * 0.28;
    const width = variant.baseSize * flower.size * depthScale * frame.scale;
    const aspectRatio =
      image.naturalWidth > 0
        ? image.naturalHeight / image.naturalWidth
        : 174 / 249;
    const height = width * aspectRatio;

    context.save();
    context.globalAlpha = frame.opacity;
    context.translate(frame.x, frame.y);
    context.rotate((frame.rotation * Math.PI) / 180);
    context.drawImage(image, -width / 2, -height / 2, width, height);
    context.restore();
  }
}
