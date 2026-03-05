import { memo } from 'react';
import { motion } from 'motion/react';

import flower11 from '@/assets/Group 11.svg';
import flower12 from '@/assets/Group 12.svg';
import flower13 from '@/assets/Group 13.svg';
import flower14 from '@/assets/Group 14.svg';
import flower15 from '@/assets/Group 15.svg';

interface FlowerProps {
  x: number;
  y: number;
  type: number;
  delay: number;
  rotation: number;
  size: number;
  visible: boolean;
}

const FLOWER_ASSETS = [flower11, flower12, flower13, flower14, flower15];

const FLOWER_SIZES = [60, 55, 65, 50, 45];

export const Flower = memo(function Flower({ x, y, type, delay, rotation, size: sizeScale, visible }: FlowerProps) {
  const asset = FLOWER_ASSETS[type % FLOWER_ASSETS.length];
  const baseSize = FLOWER_SIZES[type % FLOWER_SIZES.length];
  const size = baseSize * sizeScale;

  const offsetX = ((50 - x) / 100) * window.innerWidth;
  const offsetY = ((50 - y) / 100) * window.innerHeight;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        willChange: 'transform, opacity',
      }}
      initial={{
        x: offsetX,
        y: offsetY,
        scale: 0,
        rotate: rotation - 120,
        opacity: 0,
      }}
      animate={
        visible
          ? { x: 0, y: 0, scale: 1, rotate: rotation, opacity: 1 }
          : { x: offsetX, y: offsetY, scale: 0, rotate: rotation - 120, opacity: 0 }
      }
      transition={
        visible
          ? { duration: 1.4, delay, type: 'spring', stiffness: 60, damping: 12 }
          : { duration: 0.4, delay: 0 }
      }
    >
      <div style={{ transform: 'translate(-50%, -50%)' }}>
        <img
          src={asset}
          alt=""
          style={{ width: size, height: 'auto' }}
          draggable={false}
        />
      </div>
    </motion.div>
  );
});
