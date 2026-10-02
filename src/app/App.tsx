import { useState } from 'react';
import { motion } from 'motion/react';
import { FlowerField } from './components/FlowerField';
import { StaffButton } from './components/StaffButton';
import { generateFlowers, type FlowerData } from './flower-field/flowerModel';
import { useReducedMotionPreference } from './hooks/useAnimationEnvironment';

export default function App() {
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [visible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const reducedMotion = useReducedMotionPreference();

  const handleStaffClick = () => {
    if (isAnimating) return;

    setFlowers(generateFlowers());
    setVisible(true);
    setIsAnimating(true);
  };

  const clearFlowers = () => {
    setVisible(false);
    setIsAnimating(false);
  };

  return (
    <div className="relative h-dvh min-h-dvh w-full overflow-hidden bg-gradient-to-b from-sky-100 via-blue-50 to-green-50">
      <FlowerField
        flowers={flowers}
        visible={visible}
        onBloomComplete={() => setIsAnimating(false)}
      />

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <StaffButton onClick={handleStaffClick} disabled={isAnimating} />
      </div>

      {visible && (
        <motion.button
          type="button"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={clearFlowers}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-sm z-20"
        >
          Clear flowers
        </motion.button>
      )}

      {!visible && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
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
