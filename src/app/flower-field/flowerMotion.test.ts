import { describe, expect, it } from 'vitest';
import { makeFlower, seededRandom } from '../../test/factories';
import { generateFlowers } from './flowerModel';
import {
  BLOOM_DURATION_MS,
  CLEAR_DURATION_MS,
  sampleBloomFlower,
  sampleClearingFlower,
  sampleSettledFlower,
} from './flowerMotion';

const viewport = { width: 1000, height: 600 };

const flower = makeFlower({
  x: 80,
  type: 2,
  delay: 0.5,
  rotation: 210,
  size: 1.2,
  depth: 0.7,
  phase: 0.4,
  arc: 0.6,
});

describe('generateFlowers', () => {
  it('generates repeatable flowers within every supported bound', () => {
    const first = generateFlowers(20, seededRandom(42));
    const second = generateFlowers(20, seededRandom(42));

    expect(first).toEqual(second);
    expect(first).toHaveLength(20);
    for (const generated of first) {
      expect(generated.x).toBeGreaterThanOrEqual(0);
      expect(generated.x).toBeLessThan(100);
      expect(generated.y).toBeGreaterThanOrEqual(0);
      expect(generated.y).toBeLessThan(100);
      expect(generated.type).toBeGreaterThanOrEqual(0);
      expect(generated.type).toBeLessThan(5);
      expect(generated.delay).toBeGreaterThanOrEqual(0);
      expect(generated.delay).toBeLessThan(2.3);
      expect(generated.size).toBeGreaterThanOrEqual(0.6);
      expect(generated.size).toBeLessThan(1.4);
      expect(generated.depth).toBeGreaterThanOrEqual(0.35);
      expect(generated.depth).toBeLessThan(1);
      expect(generated.arc).toBeGreaterThanOrEqual(-1);
      expect(generated.arc).toBeLessThan(1);
    }
  });

  it('delays distant flowers more when random jitter is equal', () => {
    const values = [
      0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0.99, 0.99, 0, 0, 0, 0, 0, 0,
    ];
    let index = 0;
    const [center, corner] = generateFlowers(2, () => values[index++]);

    expect(center.delay).toBe(0);
    expect(corner.delay).toBeGreaterThan(1.9);
  });
});

describe('flower motion', () => {
  it('holds at the center until its delay starts', () => {
    const frame = sampleBloomFlower(flower, flower.delay * 1000, viewport);

    expect(frame).toEqual({
      x: viewport.width / 2,
      y: viewport.height / 2,
      scale: 0,
      rotation: flower.rotation - 120,
      opacity: 0,
    });
  });

  it('lands exactly on its target after blooming', () => {
    const frame = sampleBloomFlower(
      flower,
      flower.delay * 1000 + BLOOM_DURATION_MS,
      viewport,
    );

    expect(frame).toEqual({
      x: 800,
      y: 150,
      scale: 1,
      rotation: 210,
      opacity: 1,
    });
  });

  it('keeps settled movement bounded around the target', () => {
    for (let elapsedMs = 0; elapsedMs <= 20000; elapsedMs += 250) {
      const frame = sampleSettledFlower(flower, elapsedMs, viewport);
      expect(Math.abs(frame.x - 800)).toBeLessThanOrEqual(4.5);
      expect(frame.y).toBeLessThanOrEqual(150);
      expect(frame.y).toBeGreaterThanOrEqual(145.5);
      expect(Math.abs(frame.rotation - flower.rotation)).toBeLessThanOrEqual(
        3.5,
      );
    }
  });

  it('recomputes positions from viewport-relative coordinates', () => {
    const frame = sampleBloomFlower(
      flower,
      0,
      { width: 400, height: 300 },
      true,
    );
    expect(frame.x).toBe(320);
    expect(frame.y).toBe(75);
  });

  it('clears from the target to the center', () => {
    const start = sampleClearingFlower(flower, 0, viewport);
    const end = sampleClearingFlower(flower, CLEAR_DURATION_MS, viewport);

    expect(start).toEqual({
      x: 800,
      y: 150,
      scale: 1,
      rotation: 210,
      opacity: 1,
    });
    expect(end).toEqual({ x: 500, y: 300, scale: 0, rotation: 90, opacity: 0 });
  });

  it('uses static endpoints when reduced motion is requested', () => {
    const bloom = sampleBloomFlower(flower, 0, viewport, true);
    const clear = sampleClearingFlower(flower, 0, viewport, true);

    expect(bloom).toEqual({
      x: 800,
      y: 150,
      scale: 1,
      rotation: 210,
      opacity: 1,
    });
    expect(clear).toEqual({
      x: 800,
      y: 150,
      scale: 0,
      rotation: 210,
      opacity: 0,
    });
  });

  it('always returns finite values for long-running idle motion', () => {
    const frame = sampleSettledFlower(
      flower,
      Number.MAX_SAFE_INTEGER,
      viewport,
    );
    expect(Object.values(frame).every(Number.isFinite)).toBe(true);
  });
});
