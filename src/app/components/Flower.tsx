import { motion } from 'motion/react';

interface FlowerProps {
  x: number;
  y: number;
  type: number;
  delay: number;
}

export function Flower({ x, y, type, delay }: FlowerProps) {
  // Different flower configurations for variety
  const flowerTypes = [
    // Pink flower
    {
      petalColor: '#FFB7C5',
      petalColorLight: '#FFC9D6',
      centerColor: '#FFD700',
      petalCount: 5,
      size: 1,
    },
    // Blue flower
    {
      petalColor: '#A7C7E7',
      petalColorLight: '#C5D9ED',
      centerColor: '#FFFFFF',
      petalCount: 6,
      size: 0.8,
    },
    // Purple flower
    {
      petalColor: '#DDA0DD',
      petalColorLight: '#E6B8E6',
      centerColor: '#FFB6C1',
      petalCount: 5,
      size: 1.2,
    },
    // Yellow flower
    {
      petalColor: '#FFEB99',
      petalColorLight: '#FFF4B8',
      centerColor: '#FF8C00',
      petalCount: 7,
      size: 0.9,
    },
    // Orange flower
    {
      petalColor: '#FFCBA4',
      petalColorLight: '#FFE0C7',
      centerColor: '#FF6B6B',
      petalCount: 6,
      size: 1.1,
    },
  ];

  const flower = flowerTypes[type % flowerTypes.length];
  const rotation = Math.random() * 360;
  const scale = 0.7 + Math.random() * 0.6;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{
        scale: 0,
        rotate: rotation - 180,
        opacity: 0,
      }}
      animate={{
        scale: scale * flower.size,
        rotate: rotation,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.5 },
      }}
      transition={{
        duration: 0.8,
        delay: delay,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
    >
      <motion.svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        animate={{
          rotate: [0, 5, -5, 0],
          y: [0, -3, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <defs>
          <radialGradient id={`petalGradient-${type}-${x}-${y}`}>
            <stop offset="0%" stopColor={flower.petalColorLight} />
            <stop offset="70%" stopColor={flower.petalColor} />
            <stop offset="100%" stopColor={flower.petalColor} stopOpacity="0.8" />
          </radialGradient>
          <radialGradient id={`centerGradient-${type}-${x}-${y}`}>
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="40%" stopColor={flower.centerColor} />
            <stop offset="100%" stopColor={flower.centerColor} stopOpacity="0.9" />
          </radialGradient>
          
          {/* Soft shadow */}
          <filter id={`shadow-${type}-${x}-${y}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#shadow-${type}-${x}-${y})`}>
          {/* Petals */}
          {Array.from({ length: flower.petalCount }).map((_, i) => {
            const angle = (360 / flower.petalCount) * i;
            return (
              <g key={i} transform={`rotate(${angle} 30 30)`}>
                <ellipse
                  cx="30"
                  cy="15"
                  rx="7"
                  ry="12"
                  fill={`url(#petalGradient-${type}-${x}-${y})`}
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.95"
                />
                {/* Petal detail line */}
                <line
                  x1="30"
                  y1="12"
                  x2="30"
                  y2="18"
                  stroke={flower.petalColor}
                  strokeWidth="0.5"
                  opacity="0.4"
                  filter="brightness(0.8)"
                />
              </g>
            );
          })}

          {/* Flower center */}
          <circle
            cx="30"
            cy="30"
            r="6"
            fill={`url(#centerGradient-${type}-${x}-${y})`}
            stroke={flower.centerColor}
            strokeWidth="0.5"
            filter="brightness(1.1)"
          />
          
          {/* Center details - small dots */}
          {Array.from({ length: 8 }).map((_, i) => {
            const dotAngle = (360 / 8) * i;
            const dotX = 30 + Math.cos((dotAngle * Math.PI) / 180) * 3;
            const dotY = 30 + Math.sin((dotAngle * Math.PI) / 180) * 3;
            return (
              <circle
                key={i}
                cx={dotX}
                cy={dotY}
                r="0.8"
                fill={flower.centerColor}
                opacity="0.6"
                filter="brightness(0.8)"
              />
            );
          })}

          {/* Highlight on center */}
          <circle
            cx="28"
            cy="28"
            r="2"
            fill="white"
            opacity="0.6"
          />
        </g>

        {/* Stem (only visible for some flowers at bottom) */}
        {y > 50 && (
          <line
            x1="30"
            y1="36"
            x2="30"
            y2="55"
            stroke="#7CB342"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
        )}
      </motion.svg>

      {/* Magical sparkle effect on bloom */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.6, delay: delay }}
      >
        <div className="w-4 h-4 bg-white rounded-full blur-sm" />
      </motion.div>
    </motion.div>
  );
}
