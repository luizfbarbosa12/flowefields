import flower11 from '@/assets/Group 11.svg';
import flower12 from '@/assets/Group 12.svg';
import flower13 from '@/assets/Group 13.svg';
import flower14 from '@/assets/Group 14.svg';
import flower15 from '@/assets/Group 15.svg';

export const FLOWER_VARIANTS = [
  { source: flower11, baseSize: 60 },
  { source: flower12, baseSize: 55 },
  { source: flower13, baseSize: 65 },
  { source: flower14, baseSize: 50 },
  { source: flower15, baseSize: 45 },
] as const;
export const FLOWER_TYPE_COUNT = FLOWER_VARIANTS.length;

export type FlowerImages = Array<HTMLImageElement | null>;

let imagePromise: Promise<FlowerImages> | undefined;
const IMAGE_LOAD_TIMEOUT_MS = 5000;

function loadImage(source: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    const settle = (result: HTMLImageElement | null) => {
      window.clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      resolve(result);
    };
    const timeout = window.setTimeout(
      () => settle(null),
      IMAGE_LOAD_TIMEOUT_MS,
    );
    image.onload = () => settle(image);
    image.onerror = () => settle(null);
    image.src = source;
  });
}

export function preloadFlowerImages(): Promise<FlowerImages> {
  imagePromise ??= Promise.all(
    FLOWER_VARIANTS.map(({ source }) => loadImage(source)),
  ).then((images) => {
    if (images.some((image) => image === null)) imagePromise = undefined;
    return images;
  });
  return imagePromise;
}
