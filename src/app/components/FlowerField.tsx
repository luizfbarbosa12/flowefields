import { useEffect, useMemo, useRef, useState } from 'react';
import {
  preloadFlowerImages,
  type FlowerImages,
} from '../flower-field/flowerAssets';
import type { FlowerData } from '../flower-field/flowerModel';
import {
  BLOOM_COMPLETE_MS,
  CLEAR_DURATION_MS,
} from '../flower-field/flowerMotion';
import {
  renderFlowerField,
  sortFlowersByDepth,
  type FlowerFieldPhase,
} from '../flower-field/flowerRenderer';
import {
  useCanvasViewport,
  useDocumentAnimationVisibility,
  useReducedMotionPreference,
} from '../hooks/useAnimationEnvironment';

interface FlowerFieldProps {
  flowers: FlowerData[];
  visible: boolean;
  onBloomComplete: () => void;
}

type FieldPhase = FlowerFieldPhase | 'hidden';

export function FlowerField({
  flowers,
  visible,
  onBloomComplete,
}: FlowerFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef(0);
  const phaseRef = useRef<FieldPhase>('hidden');
  const previousVisibleRef = useRef(false);
  const completionSentRef = useRef(false);
  const onBloomCompleteRef = useRef(onBloomComplete);
  const [images, setImages] = useState<FlowerImages | null>(null);
  const viewport = useCanvasViewport(canvasRef);
  const documentVisible = useDocumentAnimationVisibility(startTimeRef);
  const reducedMotion = useReducedMotionPreference();
  const sortedFlowers = useMemo(() => sortFlowersByDepth(flowers), [flowers]);

  useEffect(() => {
    onBloomCompleteRef.current = onBloomComplete;
  }, [onBloomComplete]);

  useEffect(() => {
    let active = true;
    void preloadFlowerImages().then((loadedImages) => {
      if (active) setImages(loadedImages);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const now = performance.now();
    if (visible) {
      startTimeRef.current = now;
      completionSentRef.current = false;
      phaseRef.current = 'blooming';
    } else if (previousVisibleRef.current) {
      startTimeRef.current = now;
      phaseRef.current = 'clearing';
    } else {
      phaseRef.current = 'hidden';
    }
    previousVisibleRef.current = visible;
  }, [flowers, visible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewport.width <= 0 || viewport.height <= 0) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(viewport.width * pixelRatio);
    const height = Math.round(viewport.height * pixelRatio);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }, [viewport]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewport.width <= 0 || viewport.height <= 0) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    if (!images || !documentVisible) return;

    let animationFrame = 0;
    const draw = (timestamp: number) => {
      const elapsedMs = Math.max(0, timestamp - startTimeRef.current);
      const phase = phaseRef.current;

      if (phase === 'hidden') {
        context.clearRect(0, 0, viewport.width, viewport.height);
        return;
      }

      if (phase === 'blooming') {
        const bloomFinished = reducedMotion || elapsedMs >= BLOOM_COMPLETE_MS;
        renderFlowerField({
          context,
          flowers: sortedFlowers,
          images,
          viewport,
          phase: bloomFinished ? 'settled' : 'blooming',
          elapsedMs,
          reducedMotion,
        });
        if (bloomFinished) {
          if (!completionSentRef.current) {
            completionSentRef.current = true;
            onBloomCompleteRef.current();
          }
          phaseRef.current = 'settled';
        }
      } else if (phase === 'clearing') {
        renderFlowerField({
          context,
          flowers: sortedFlowers,
          images,
          viewport,
          phase: 'clearing',
          elapsedMs,
          reducedMotion,
        });
        if (reducedMotion || elapsedMs >= CLEAR_DURATION_MS) {
          phaseRef.current = 'hidden';
          context.clearRect(0, 0, viewport.width, viewport.height);
          return;
        }
      } else {
        renderFlowerField({
          context,
          flowers: sortedFlowers,
          images,
          viewport,
          phase: 'settled',
          elapsedMs: timestamp,
          reducedMotion,
        });
        if (reducedMotion) return;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrame);
  }, [documentVisible, images, reducedMotion, sortedFlowers, viewport]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="flower-field"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  );
}
