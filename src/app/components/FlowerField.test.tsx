import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeFlower } from '../../test/factories';
import { BLOOM_COMPLETE_MS } from '../flower-field/flowerMotion';
import { FlowerField } from './FlowerField';

const flower = makeFlower();

const context = {
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
  setTransform: vi.fn(),
  globalAlpha: 1,
} as unknown as CanvasRenderingContext2D;

let resizeCallback: ResizeObserverCallback;
const disconnect = vi.fn();

class ResizeObserverMock implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallback = callback;
  }

  observe(target: Element) {
    resizeCallback(
      [
        {
          target,
          contentRect: { width: 800, height: 600 },
        } as ResizeObserverEntry,
      ],
      this,
    );
  }

  unobserve() {}
  disconnect = disconnect;
}

let nextFrameId = 0;
let scheduledFrames = new Map<number, FrameRequestCallback>();
const requestFrame = vi.fn((callback: FrameRequestCallback) => {
  const id = ++nextFrameId;
  scheduledFrames.set(id, callback);
  return id;
});
const cancelFrame = vi.fn((id: number) => scheduledFrames.delete(id));

function runNextFrame(timestamp: number) {
  const entry = scheduledFrames.entries().next().value as
    [number, FrameRequestCallback] | undefined;
  if (!entry) throw new Error('No animation frame was scheduled');
  scheduledFrames.delete(entry[0]);
  act(() => entry[1](timestamp));
}

beforeEach(() => {
  nextFrameId = 0;
  scheduledFrames = new Map();
  disconnect.mockClear();
  requestFrame.mockClear();
  cancelFrame.mockClear();
  Object.values(context).forEach((value) => {
    if (typeof value === 'function' && 'mockClear' in value) value.mockClear();
  });
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  vi.stubGlobal('requestAnimationFrame', requestFrame);
  vi.stubGlobal('cancelAnimationFrame', cancelFrame);
  vi.spyOn(performance, 'now').mockReturnValue(0);
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    value: false,
  });
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
  vi.spyOn(
    HTMLCanvasElement.prototype,
    'getBoundingClientRect',
  ).mockReturnValue({
    width: 800,
    height: 600,
  } as DOMRect);
  vi.stubGlobal(
    'Image',
    class {
      naturalWidth = 249;
      naturalHeight = 174;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_source: string) {
        queueMicrotask(() => this.onload?.());
      }
    },
  );
  Object.defineProperty(window, 'devicePixelRatio', {
    configurable: true,
    value: 1,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('FlowerField', () => {
  it('sizes its backing buffer, draws through one RAF chain, and completes once', async () => {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 3,
    });
    const onBloomComplete = vi.fn();
    const { getByTestId } = render(
      <FlowerField
        flowers={[flower]}
        visible
        onBloomComplete={onBloomComplete}
      />,
    );

    const canvas = getByTestId('flower-field') as HTMLCanvasElement;
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    await waitFor(() => expect(requestFrame).toHaveBeenCalled());
    expect(canvas.width).toBe(1600);
    expect(canvas.height).toBe(1200);
    expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
    expect(scheduledFrames.size).toBe(1);

    runNextFrame(BLOOM_COMPLETE_MS);
    expect(onBloomComplete).toHaveBeenCalledOnce();
    await waitFor(() => expect(scheduledFrames.size).toBe(1));
    runNextFrame(BLOOM_COMPLETE_MS + 1000);
    expect(onBloomComplete).toHaveBeenCalledOnce();
    expect(context.setTransform).toHaveBeenCalledOnce();
  });

  it('resizes the backing buffer only when viewport dimensions change', async () => {
    const { getByTestId } = render(
      <FlowerField
        flowers={[flower]}
        visible
        onBloomComplete={() => undefined}
      />,
    );
    const canvas = getByTestId('flower-field') as HTMLCanvasElement;
    await waitFor(() => expect(requestFrame).toHaveBeenCalled());

    act(() => {
      resizeCallback(
        [
          {
            target: canvas,
            contentRect: { width: 400, height: 300 },
          } as unknown as ResizeObserverEntry,
        ],
        {} as ResizeObserver,
      );
    });

    expect(canvas.width).toBe(400);
    expect(canvas.height).toBe(300);
    expect(context.setTransform).toHaveBeenCalledTimes(2);
  });

  it('animates clearing and removes the field at the endpoint', async () => {
    const { rerender } = render(
      <FlowerField
        flowers={[flower]}
        visible
        onBloomComplete={() => undefined}
      />,
    );
    await waitFor(() => expect(requestFrame).toHaveBeenCalled());

    rerender(
      <FlowerField
        flowers={[flower]}
        visible={false}
        onBloomComplete={() => undefined}
      />,
    );
    await waitFor(() => expect(scheduledFrames.size).toBe(1));
    runNextFrame(400);

    expect(scheduledFrames.size).toBe(0);
    expect(context.clearRect).toHaveBeenLastCalledWith(0, 0, 800, 600);
  });

  it('renders a static endpoint immediately for reduced motion', async () => {
    vi.stubGlobal('matchMedia', (query: string): MediaQueryList => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }));
    const onBloomComplete = vi.fn();
    render(
      <FlowerField
        flowers={[flower]}
        visible
        onBloomComplete={onBloomComplete}
      />,
    );

    await waitFor(() => expect(requestFrame).toHaveBeenCalled());
    runNextFrame(0);
    expect(onBloomComplete).toHaveBeenCalledOnce();
    await waitFor(() => expect(scheduledFrames.size).toBe(1));
    runNextFrame(1);
    expect(scheduledFrames.size).toBe(0);
  });

  it('pauses its RAF while the document is hidden and resumes when visible', async () => {
    render(
      <FlowerField
        flowers={[flower]}
        visible
        onBloomComplete={() => undefined}
      />,
    );
    await waitFor(() => expect(scheduledFrames.size).toBe(1));
    const activeFrame = [...scheduledFrames.keys()][0];

    vi.mocked(performance.now).mockReturnValue(100);
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    act(() => document.dispatchEvent(new Event('visibilitychange')));

    expect(cancelFrame).toHaveBeenCalledWith(activeFrame);
    expect(scheduledFrames.size).toBe(0);

    vi.mocked(performance.now).mockReturnValue(500);
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    await waitFor(() => expect(scheduledFrames.size).toBe(1));
  });

  it('responds to a live reduced-motion preference change', async () => {
    let reducedMotion = false;
    let changeListener: (() => void) | undefined;
    const media = {
      get matches() {
        return reducedMotion;
      },
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: (
        _type: string,
        listener: EventListenerOrEventListenerObject,
      ) => {
        changeListener = listener as () => void;
      },
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    } satisfies MediaQueryList;
    vi.stubGlobal('matchMedia', () => media);
    const onBloomComplete = vi.fn();
    render(
      <FlowerField
        flowers={[flower]}
        visible
        onBloomComplete={onBloomComplete}
      />,
    );
    await waitFor(() => expect(scheduledFrames.size).toBe(1));

    reducedMotion = true;
    act(() => changeListener?.());
    await waitFor(() => expect(scheduledFrames.size).toBe(1));
    runNextFrame(0);

    expect(onBloomComplete).toHaveBeenCalledOnce();
    runNextFrame(1);
    expect(scheduledFrames.size).toBe(0);
  });

  it('cancels animation and observer work when unmounted', async () => {
    const { unmount } = render(
      <FlowerField
        flowers={[flower]}
        visible
        onBloomComplete={() => undefined}
      />,
    );
    await waitFor(() => expect(requestFrame).toHaveBeenCalled());
    const activeFrame = [...scheduledFrames.keys()][0];

    unmount();

    expect(cancelFrame).toHaveBeenCalledWith(activeFrame);
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
