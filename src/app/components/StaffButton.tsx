import { useId } from 'react';
import { motion } from 'motion/react';
import { useReducedMotionPreference } from '../hooks/useAnimationEnvironment';
import { StaffCastingGlow, StaffCastingParticles } from './StaffEffects';

interface StaffButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function StaffButton({ onClick, disabled }: StaffButtonProps) {
  const reducedMotion = useReducedMotionPreference();
  const idPrefix = `staff-${useId().replace(/:/g, '')}`;
  const casting = disabled && !reducedMotion;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Bloom flowers"
      whileTap={{ scale: disabled || reducedMotion ? 1 : 0.95 }}
      whileHover={{ scale: disabled || reducedMotion ? 1 : 1.05 }}
      className="relative cursor-pointer disabled:cursor-not-allowed"
      style={{ width: '120px', height: '400px' }}
    >
      <motion.svg
        width="120"
        height="400"
        viewBox="0 0 120 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={casting ? { rotate: [0, -5, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <defs>
          <linearGradient
            id={`${idPrefix}-metalGold`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#D4B86A" />
            <stop offset="25%" stopColor="#C9A84C" />
            <stop offset="50%" stopColor="#E8D48B" />
            <stop offset="75%" stopColor="#B89638" />
            <stop offset="100%" stopColor="#8B7535" />
          </linearGradient>

          <linearGradient
            id={`${idPrefix}-metalSheen`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#C9A84C" />
            <stop offset="40%" stopColor="#E8D48B" />
            <stop offset="60%" stopColor="#E8D48B" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>

          <radialGradient id={`${idPrefix}-gemGradient`} cx="38%" cy="35%">
            <stop offset="0%" stopColor="#FF6666" />
            <stop offset="20%" stopColor="#CC3333" />
            <stop offset="55%" stopColor="#991A1A" />
            <stop offset="100%" stopColor="#5C0A0A" />
          </radialGradient>

          <linearGradient
            id={`${idPrefix}-shaftGradient`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#5E1E1E" />
            <stop offset="25%" stopColor="#7A2E2E" />
            <stop offset="50%" stopColor="#8B3838" />
            <stop offset="75%" stopColor="#7A2E2E" />
            <stop offset="100%" stopColor="#5E1E1E" />
          </linearGradient>

          <linearGradient
            id={`${idPrefix}-ribbonGrad`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#A03030" />
            <stop offset="50%" stopColor="#8B2222" />
            <stop offset="100%" stopColor="#681818" />
          </linearGradient>

          <filter
            id={`${idPrefix}-gemGlow`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* === CRESCENT HEAD PIECE === */}
        {/* Bezel ring (visible where crescent opens) */}
        <circle
          cx="58"
          cy="50"
          r="20"
          fill={`url(#${idPrefix}-metalGold)`}
          stroke="#8B7535"
          strokeWidth="1"
        />

        {/* Crescent arc wrapping around the gem */}
        <path
          d={`
            M 79 26
            A 32 32 0 1 0 79 74
            L 71 65
            A 20 20 0 1 1 71 35
            Z
          `}
          fill={`url(#${idPrefix}-metalGold)`}
          stroke="#8B7535"
          strokeWidth="1"
        />

        {/* Crescent detail lines */}
        <path
          d={`
            M 76 30
            A 28 28 0 1 0 76 70
          `}
          fill="none"
          stroke="#E8D48B"
          strokeWidth="0.8"
          opacity="0.5"
        />

        {/* Upper horn tip */}
        <path
          d="M 79 26 C 84 18, 88 12, 85 6 C 82 10, 80 18, 79 26"
          fill={`url(#${idPrefix}-metalGold)`}
          stroke="#8B7535"
          strokeWidth="0.8"
        />

        {/* Lower horn tip */}
        <path
          d="M 79 74 C 84 82, 88 88, 85 94 C 82 90, 80 82, 79 74"
          fill={`url(#${idPrefix}-metalGold)`}
          stroke="#8B7535"
          strokeWidth="0.8"
        />

        {/* Bezel inner decorative ring */}
        <circle
          cx="58"
          cy="50"
          r="17"
          fill="none"
          stroke="#E8D48B"
          strokeWidth="0.6"
          opacity="0.5"
        />
        <circle
          cx="58"
          cy="50"
          r="15"
          fill="none"
          stroke="#8B7535"
          strokeWidth="0.5"
          opacity="0.4"
        />

        {/* === RED GEM / ORB === */}
        <motion.g
          animate={
            casting
              ? {
                  filter: [
                    'drop-shadow(0 0 6px rgba(204, 51, 51, 0.5))',
                    'drop-shadow(0 0 18px rgba(204, 51, 51, 0.9))',
                    'drop-shadow(0 0 6px rgba(204, 51, 51, 0.5))',
                  ],
                }
              : {}
          }
          transition={{ duration: 1, repeat: casting ? Infinity : 0 }}
        >
          <circle
            cx="58"
            cy="50"
            r="14"
            fill={`url(#${idPrefix}-gemGradient)`}
          />
          <ellipse cx="52" cy="44" rx="4" ry="5.5" fill="white" opacity="0.3" />
          <ellipse
            cx="64"
            cy="56"
            rx="2"
            ry="2.5"
            fill="white"
            opacity="0.12"
          />
          <circle
            cx="58"
            cy="50"
            r="14"
            fill="none"
            stroke="#3A0808"
            strokeWidth="0.8"
            opacity="0.6"
          />
        </motion.g>

        {/* === RED RIBBON / CLOTH === */}
        <path
          d={`
            M 46 76
            C 40 88, 34 102, 32 118
            C 30 128, 34 124, 36 114
            C 38 104, 42 92, 48 80
            Z
          `}
          fill={`url(#${idPrefix}-ribbonGrad)`}
          stroke="#4A1010"
          strokeWidth="0.4"
          opacity="0.9"
        />
        <path
          d={`
            M 70 76
            C 76 88, 80 104, 78 118
            C 76 126, 74 120, 72 112
            C 70 102, 68 92, 66 80
            Z
          `}
          fill={`url(#${idPrefix}-ribbonGrad)`}
          stroke="#4A1010"
          strokeWidth="0.4"
          opacity="0.85"
        />

        {/* === JUNCTION BAND === */}
        <rect
          x="48"
          y="82"
          width="24"
          height="10"
          rx="3"
          fill={`url(#${idPrefix}-metalGold)`}
          stroke="#8B7535"
          strokeWidth="1"
        />
        <line
          x1="50"
          y1="87"
          x2="70"
          y2="87"
          stroke="#E8D48B"
          strokeWidth="0.7"
          opacity="0.5"
        />

        {/* === MAIN SHAFT === */}
        <rect
          x="53"
          y="92"
          width="14"
          height="278"
          rx="7"
          fill={`url(#${idPrefix}-shaftGradient)`}
          stroke="#3A1212"
          strokeWidth="1"
        />

        {/* Shaft texture lines */}
        <line
          x1="56"
          y1="105"
          x2="56"
          y2="360"
          stroke="#3A1212"
          strokeWidth="0.4"
          opacity="0.18"
        />
        <line
          x1="64"
          y1="105"
          x2="64"
          y2="360"
          stroke="#3A1212"
          strokeWidth="0.4"
          opacity="0.18"
        />

        {/* Gold accent bands */}
        <rect
          x="51"
          y="135"
          width="18"
          height="5"
          rx="2"
          fill={`url(#${idPrefix}-metalSheen)`}
          stroke="#8B7535"
          strokeWidth="0.7"
        />
        <rect
          x="51"
          y="215"
          width="18"
          height="5"
          rx="2"
          fill={`url(#${idPrefix}-metalSheen)`}
          stroke="#8B7535"
          strokeWidth="0.7"
        />
        <rect
          x="51"
          y="295"
          width="18"
          height="5"
          rx="2"
          fill={`url(#${idPrefix}-metalSheen)`}
          stroke="#8B7535"
          strokeWidth="0.7"
        />

        {/* === BOTTOM CAP === */}
        <ellipse
          cx="60"
          cy="368"
          rx="10"
          ry="3.5"
          fill={`url(#${idPrefix}-metalSheen)`}
          stroke="#8B7535"
          strokeWidth="0.8"
        />
        <path
          d="M 54 368 L 60 385 L 66 368"
          fill={`url(#${idPrefix}-metalGold)`}
          stroke="#8B7535"
          strokeWidth="1"
        />

        {casting && <StaffCastingParticles />}
      </motion.svg>

      {casting && <StaffCastingGlow />}
    </motion.button>
  );
}
