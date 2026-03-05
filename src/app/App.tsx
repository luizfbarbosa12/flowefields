import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flower } from './components/Flower';
import { StaffButton } from './components/StaffButton';

interface FlowerData {
  id: number;
  x: number;
  y: number;
  type: number;
  delay: number;
}

const FLOWER_COUNT = 400;
const MAX_DISTANCE = Math.sqrt(50 * 50 + 50 * 50);

export default function App() {
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const createFlowers = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newFlowers: FlowerData[] = [];

    for (let i = 0; i < FLOWER_COUNT; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const dist = Math.sqrt((x - 50) ** 2 + (y - 50) ** 2);
      const normalizedDist = dist / MAX_DISTANCE;

      newFlowers.push({
        id: Date.now() + i,
        x,
        y,
        type: Math.floor(Math.random() * 5),
        delay: normalizedDist * 2 + Math.random() * 0.3,
      });
    }

    setFlowers(newFlowers);

    setTimeout(() => {
      setIsAnimating(false);
    }, 5000);
  };

  const clearFlowers = () => {
    setFlowers([]);
    setIsAnimating(false);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-green-50 overflow-hidden">
      {/* Flowers Layer */}
      <AnimatePresence>
        {flowers.map((flower) => (
          <Flower
            key={flower.id}
            x={flower.x}
            y={flower.y}
            type={flower.type}
            delay={flower.delay}
          />
        ))}
      </AnimatePresence>

      {/* Staff Button - Centered */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <StaffButton onClick={createFlowers} disabled={isAnimating} />
      </div>

      {/* Clear Button - Bottom */}
      {flowers.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={clearFlowers}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-sm z-20"
        >
          Limpar flores
        </motion.button>
      )}

      {/* Instruction Text */}
      {flowers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center z-20"
        >
          <p className="text-slate-600 text-sm px-4">
            Tap the staff to bloom flowers
          </p>
        </motion.div>
      )}
    </div>
  );
}
