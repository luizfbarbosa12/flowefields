import { motion } from 'motion/react';

export function StaffCastingParticles() {
  return (
    <motion.g data-testid="casting-particles">
      <motion.circle
        cx="42"
        cy="42"
        r="2"
        fill="#FFD700"
        animate={{ y: [0, -20, -40], opacity: [1, 0.5, 0], scale: [1, 1.5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.3 }}
      />
      <motion.circle
        cx="78"
        cy="38"
        r="1.5"
        fill="#FFD700"
        animate={{ y: [0, -25, -50], opacity: [1, 0.5, 0], scale: [1, 1.5, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 0.3,
          delay: 0.5,
        }}
      />
      <motion.circle
        cx="34"
        cy="58"
        r="1.5"
        fill="#FFF0B0"
        animate={{ y: [0, -15, -35], opacity: [1, 0.4, 0], scale: [1, 1.2, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          repeatDelay: 0.2,
          delay: 0.3,
        }}
      />
      <motion.path
        d="M 92 28 l 2 -4 2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 Z"
        fill="#FFD700"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
      />
      <motion.path
        d="M 22 62 l 1.5 -3 1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 Z"
        fill="#FFE44D"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }}
      />
    </motion.g>
  );
}

export function StaffCastingGlow() {
  return (
    <motion.div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-red-400/30 blur-3xl"
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
}
