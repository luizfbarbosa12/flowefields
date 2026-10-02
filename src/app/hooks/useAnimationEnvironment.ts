import {
  useEffect,
  useState,
  type MutableRefObject,
  type RefObject,
} from 'react';
import type { ViewportSize } from '../flower-field/flowerMotion';

const EMPTY_VIEWPORT: ViewportSize = { width: 0, height: 0 };

export function useCanvasViewport(
  canvasRef: RefObject<HTMLCanvasElement>,
): ViewportSize {
  const [viewport, setViewport] = useState<ViewportSize>(EMPTY_VIEWPORT);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = (width: number, height: number) => {
      setViewport((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );
    };
    const observer = new ResizeObserver(([entry]) => {
      updateSize(entry.contentRect.width, entry.contentRect.height);
    });

    observer.observe(canvas);
    const bounds = canvas.getBoundingClientRect();
    updateSize(bounds.width, bounds.height);
    return () => observer.disconnect();
  }, [canvasRef]);

  return viewport;
}

export function useReducedMotionPreference(): boolean {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(media.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

export function useDocumentAnimationVisibility(
  startTimeRef: MutableRefObject<number>,
): boolean {
  const [documentVisible, setDocumentVisible] = useState(
    () => !document.hidden,
  );

  useEffect(() => {
    let hiddenAt: number | null = null;
    const handleVisibilityChange = () => {
      const now = performance.now();
      if (document.hidden) {
        hiddenAt = now;
        setDocumentVisible(false);
        return;
      }

      if (hiddenAt !== null) {
        startTimeRef.current += now - hiddenAt;
        hiddenAt = null;
      }
      setDocumentVisible(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [startTimeRef]);

  return documentVisible;
}
