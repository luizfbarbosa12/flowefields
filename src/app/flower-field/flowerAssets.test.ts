import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('preloadFlowerImages', () => {
  it('loads every variant and shares a successful in-flight request', async () => {
    let imageCount = 0;
    vi.stubGlobal(
      'Image',
      class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;

        constructor() {
          imageCount += 1;
        }

        set src(_source: string) {
          queueMicrotask(() => this.onload?.());
        }
      },
    );
    const { preloadFlowerImages } = await import('./flowerAssets');

    const first = preloadFlowerImages();
    const second = preloadFlowerImages();

    expect(second).toBe(first);
    expect(await first).toHaveLength(5);
    expect(imageCount).toBe(5);
  });

  it('allows a later call to retry failed variants', async () => {
    let imageCount = 0;
    vi.stubGlobal(
      'Image',
      class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;

        constructor() {
          imageCount += 1;
        }

        set src(_source: string) {
          queueMicrotask(() => this.onerror?.());
        }
      },
    );
    const { preloadFlowerImages } = await import('./flowerAssets');

    expect(await preloadFlowerImages()).toEqual([null, null, null, null, null]);
    expect(await preloadFlowerImages()).toEqual([null, null, null, null, null]);
    expect(imageCount).toBe(10);
  });

  it('settles stalled image requests after the timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'Image',
      class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        set src(_source: string) {}
      },
    );
    const { preloadFlowerImages } = await import('./flowerAssets');
    const images = preloadFlowerImages();

    await vi.advanceTimersByTimeAsync(5000);
    expect(await images).toEqual([null, null, null, null, null]);
  });
});
