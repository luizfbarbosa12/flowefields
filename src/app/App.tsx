import { useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Flower } from './components/Flower';
import { StaffButton } from './components/StaffButton';

interface FlowerData {
  x: number;
  y: number;
  type: number;
  delay: number;
  rotation: number;
  size: number;
}

const FLOWER_COUNT = 400;
const MAX_DISTANCE = Math.sqrt(50 * 50 + 50 * 50);

function generateFlowers(): FlowerData[] {
  const flowers: FlowerData[] = [];
  for (let i = 0; i < FLOWER_COUNT; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dist = Math.sqrt((x - 50) ** 2 + (y - 50) ** 2);
    const normalizedDist = dist / MAX_DISTANCE;
    flowers.push({
      x,
      y,
      type: Math.floor(Math.random() * 5),
      delay: normalizedDist * 2 + Math.random() * 0.3,
      rotation: Math.random() * 360,
      size: 0.6 + Math.random() * 0.8,
    });
  }
  return flowers;
}

export default function App() {
  const [flowers, setFlowers] = useState<FlowerData[]>(() => generateFlowers());
  const [visible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<number>();

  const handleStaffClick = useCallback(() => {
    if (isAnimating) return;

    setFlowers(generateFlowers());
    setVisible(true);
    setIsAnimating(true);

    timerRef.current = window.setTimeout(() => {
      setIsAnimating(false);
    }, 5000);
  }, [isAnimating]);

  const clearFlowers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setIsAnimating(false);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-green-50 overflow-hidden">
      {flowers.map((flower, i) => (
        <Flower key={i} {...flower} visible={visible} />
      ))}

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <StaffButton onClick={handleStaffClick} disabled={isAnimating} />
      </div>

      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={clearFlowers}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-sm z-20"
        >
          Limpar flores
        </motion.button>
      )}

      {!visible && (
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
