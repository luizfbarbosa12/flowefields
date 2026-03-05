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

export default function App() {
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const createFlowers = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newFlowers: FlowerData[] = [];
    
    // Create many flowers to fill the entire background
    const flowerCount = 150;
    
    for (let i = 0; i < flowerCount; i++) {
      newFlowers.push({
        id: Date.now() + i,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        type: Math.floor(Math.random() * 5), // 5 different flower types
        delay: Math.random() * 2.5, // stagger animation
      });
    }
    
    setFlowers(newFlowers);
    
    // Reset after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 4000);
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
      <div className="absolute inset-0 flex items-center justify-center">
        <StaffButton onClick={createFlowers} disabled={isAnimating} />
      </div>

      {/* Clear Button - Bottom */}
      {flowers.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={clearFlowers}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-sm"
        >
          Clear Flowers
        </motion.button>
      )}

      {/* Instruction Text */}
      {flowers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="text-slate-600 text-sm px-4">
            Tap the staff to bloom flowers
          </p>
        </motion.div>
      )}
    </div>
  );
}
