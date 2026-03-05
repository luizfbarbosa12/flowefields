import { motion } from 'motion/react';

interface StaffButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function StaffButton({ onClick, disabled }: StaffButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      className="relative cursor-pointer disabled:cursor-not-allowed"
      style={{ width: '120px', height: '400px' }}
    >
      <motion.svg
        width="120"
        height="400"
        viewBox="0 0 120 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={disabled ? { rotate: [0, -5, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Magical Crystal/Gem at the top */}
        <motion.g
          animate={
            disabled
              ? {
                  filter: [
                    'drop-shadow(0 0 8px rgba(147, 51, 234, 0.6))',
                    'drop-shadow(0 0 20px rgba(147, 51, 234, 0.8))',
                    'drop-shadow(0 0 8px rgba(147, 51, 234, 0.6))',
                  ],
                }
              : {}
          }
          transition={{ duration: 1, repeat: disabled ? Infinity : 0 }}
        >
          {/* Main crystal - diamond shape */}
          <path
            d="M60 10 L80 35 L75 65 L60 80 L45 65 L40 35 Z"
            fill="url(#crystalGradient)"
            stroke="#8B5CF6"
            strokeWidth="2"
          />
          
          {/* Crystal facets for depth */}
          <path
            d="M60 10 L60 80"
            stroke="#A78BFA"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M40 35 L75 65"
            stroke="#A78BFA"
            strokeWidth="1"
            opacity="0.4"
          />
          <path
            d="M80 35 L45 65"
            stroke="#C4B5FD"
            strokeWidth="1"
            opacity="0.4"
          />
          
          {/* Highlight */}
          <ellipse
            cx="55"
            cy="30"
            rx="8"
            ry="12"
            fill="white"
            opacity="0.4"
          />
        </motion.g>

        {/* Ornate top section */}
        <path
          d="M50 80 Q45 85 45 92 L45 110 Q45 115 50 115 L70 115 Q75 115 75 110 L75 92 Q75 85 70 80"
          fill="#8B6F47"
          stroke="#6B5538"
          strokeWidth="1.5"
        />
        
        {/* Decorative rings */}
        <circle cx="60" cy="95" r="12" fill="none" stroke="#D4AF37" strokeWidth="2" />
        <circle cx="60" cy="95" r="8" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />

        {/* Main staff body - wooden texture */}
        <defs>
          <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B6F47" />
            <stop offset="50%" stopColor="#A0826D" />
            <stop offset="100%" stopColor="#8B6F47" />
          </linearGradient>
          
          <linearGradient id="crystalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="30%" stopColor="#C4B5FD" />
            <stop offset="60%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* Main wooden staff */}
        <rect
          x="53"
          y="115"
          width="14"
          height="260"
          rx="7"
          fill="url(#woodGradient)"
          stroke="#6B5538"
          strokeWidth="1.5"
        />
        
        {/* Wood grain details */}
        <line x1="56" y1="130" x2="56" y2="360" stroke="#6B5538" strokeWidth="0.5" opacity="0.3" />
        <line x1="64" y1="130" x2="64" y2="360" stroke="#6B5538" strokeWidth="0.5" opacity="0.3" />
        
        {/* Decorative spirals on staff */}
        <path
          d="M67 180 Q72 185 67 190 Q62 195 67 200"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <path
          d="M53 240 Q48 245 53 250 Q58 255 53 260"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
          opacity="0.7"
        />

        {/* Bottom cap */}
        <path
          d="M50 375 L60 395 L70 375"
          fill="#6B5538"
          stroke="#4A3F2F"
          strokeWidth="1.5"
        />
        
        {/* Decorative bottom ring */}
        <ellipse
          cx="60"
          cy="375"
          rx="10"
          ry="4"
          fill="#D4AF37"
          stroke="#B8932F"
          strokeWidth="1"
        />

        {/* Magical particles when disabled (casting) */}
        {disabled && (
          <>
            <motion.circle
              cx="50"
              cy="50"
              r="2"
              fill="#DDD6FE"
              animate={{
                y: [0, -20, -40],
                opacity: [1, 0.5, 0],
                scale: [1, 1.5, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.3 }}
            />
            <motion.circle
              cx="70"
              cy="50"
              r="2"
              fill="#C4B5FD"
              animate={{
                y: [0, -25, -50],
                opacity: [1, 0.5, 0],
                scale: [1, 1.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.3,
                delay: 0.5,
              }}
            />
          </>
        )}
      </motion.svg>

      {/* Glow effect when active */}
      {disabled && (
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-purple-400/30 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
