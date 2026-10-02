import { describe, expect, it, vi } from 'vitest';
import { makeFlower } from '../../test/factories';
import { renderFlowerField, sortFlowersByDepth } from './flowerRenderer';

function createContext() {
  return {
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn(),
    globalAlpha: 1,
  } as unknown as CanvasRenderingContext2D;
}

const image = { naturalWidth: 249, naturalHeight: 174 } as HTMLImageElement;
const viewport = { width: 800, height: 400 };

describe('sortFlowersByDepth', () => {
  it('returns a far-to-near copy without mutating input', () => {
    const flowers = [makeFlower({ depth: 0.9 }), makeFlower({ depth: 0.2 })];
    const sorted = sortFlowersByDepth(flowers);

    expect(sorted.map(({ depth }) => depth)).toEqual([0.2, 0.9]);
    expect(flowers.map(({ depth }) => depth)).toEqual([0.9, 0.2]);
  });
});

describe('renderFlowerField', () => {
  it('clears once and draws a settled flower around its center', () => {
    const context = createContext();
    renderFlowerField({
      context,
      flowers: [makeFlower()],
      images: [image],
      viewport,
      phase: 'settled',
      elapsedMs: 0,
      reducedMotion: true,
    });

    expect(context.clearRect).toHaveBeenCalledOnce();
    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 800, 400);
    expect(context.translate).toHaveBeenCalledWith(600, 100);
    expect(context.rotate).toHaveBeenCalledWith(Math.PI / 2);
    expect(context.drawImage).toHaveBeenCalledOnce();
    expect(context.save).toHaveBeenCalledOnce();
    expect(context.restore).toHaveBeenCalledOnce();
  });

  it('uses the existing base size, flower scale, and image aspect ratio', () => {
    const context = createContext();
    renderFlowerField({
      context,
      flowers: [makeFlower({ size: 1.2, depth: 0.5 })],
      images: [image],
      viewport,
      phase: 'settled',
      elapsedMs: 0,
      reducedMotion: true,
    });

    const [, x, y, width, height] = vi.mocked(context.drawImage).mock.calls[0];
    expect(x).toBeCloseTo(-(60 * 1.2 * 0.96) / 2);
    expect(y).toBeCloseTo(-((60 * 1.2 * 0.96 * 174) / 249) / 2);
    expect(width).toBeCloseTo(60 * 1.2 * 0.96);
    expect(height).toBeCloseTo((60 * 1.2 * 0.96 * 174) / 249);
  });

  it('skips unavailable images without unbalancing context state', () => {
    const context = createContext();
    renderFlowerField({
      context,
      flowers: [makeFlower()],
      images: [null],
      viewport,
      phase: 'settled',
      elapsedMs: 0,
      reducedMotion: false,
    });

    expect(context.drawImage).not.toHaveBeenCalled();
    expect(context.save).not.toHaveBeenCalled();
    expect(context.restore).not.toHaveBeenCalled();
  });

  it('does not draw flowers before their bloom delay', () => {
    const context = createContext();
    renderFlowerField({
      context,
      flowers: [makeFlower({ delay: 1 })],
      images: [image],
      viewport,
      phase: 'blooming',
      elapsedMs: 500,
      reducedMotion: false,
    });

    expect(context.drawImage).not.toHaveBeenCalled();
  });
});
