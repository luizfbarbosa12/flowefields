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
}

const FLOWER_ASSETS = [flower11, flower12, flower13, flower14, flower15];

const FLOWER_SIZES = [60, 55, 65, 50, 45];

export function Flower({ x, y, type, delay }: FlowerProps) {
  const asset = FLOWER_ASSETS[type % FLOWER_ASSETS.length];
  const baseSize = FLOWER_SIZES[type % FLOWER_SIZES.length];
  const rotation = Math.random() * 360;
  const scale = 0.6 + Math.random() * 0.8;
  const size = baseSize * scale;

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{
        left: '50%',
        top: '50%',
        scale: 0,
        rotate: rotation - 120,
        opacity: 0,
      }}
      animate={{
        left: `${x}%`,
        top: `${y}%`,
        scale: 1,
        rotate: rotation,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.4 },
      }}
      transition={{
        duration: 1.4,
        delay,
        type: 'spring',
        stiffness: 60,
        damping: 12,
      }}
    >
      <div style={{ transform: 'translate(-50%, -50%)' }}>
        <img
          src={asset}
          alt=""
          style={{ width: size, height: 'auto' }}
          draggable={false}
        />
      </div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.6, delay }}
      >
        <div className="w-4 h-4 bg-white rounded-full blur-sm" />
      </motion.div>
    </motion.div>
  );
}

/*
 * ====== COMMENTED OUT: Inline SVG flower (nemophila/blue moon flower) ======
 *
 * const PETAL_ANGLES = [0, 72, 144, 216, 288];
 * const STAMEN_ANGLES = [0, 60, 120, 180, 240, 300];
 *
 * const flowerTypes = [
 *   { petalOuter: '#7BA3D1', petalMid: '#9FC0E4', petalInner: '#D6E6F5',
 *     veinColor: '#4A7AAF', stamenColor: '#2B4A73', stigmaColor: '#C9A033', size: 1 },
 *   { petalOuter: '#8BB0D8', petalMid: '#ADC8E5', petalInner: '#DDE9F7',
 *     veinColor: '#5880B5', stamenColor: '#354F75', stigmaColor: '#D4A830', size: 0.85 },
 *   { petalOuter: '#6B96C8', petalMid: '#92B5DA', petalInner: '#CFE0F2',
 *     veinColor: '#3E6EA3', stamenColor: '#233E60', stigmaColor: '#BF9A28', size: 1.15 },
 *   { petalOuter: '#90B8DC', petalMid: '#B3CEE8', petalInner: '#E2EDF8',
 *     veinColor: '#5C86B8', stamenColor: '#3A5578', stigmaColor: '#C9A540', size: 0.75 },
 *   { petalOuter: '#7DA6D0', petalMid: '#A4C1E2', petalInner: '#D9E8F5',
 *     veinColor: '#4E7CB0', stamenColor: '#2E4B6D', stigmaColor: '#D0A835', size: 0.95 },
 * ];
 *
 * Inline SVG rendered 5 wide rounded petals with blue gradients, dark blue veins,
 * navy stamens, and a golden stigma center. Each flower had an idle sway animation.
 *
 * Replaced by asset-based <img> approach for better performance.
 */
