'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type VivaEmotion = 'idle' | 'listening' | 'shocked' | 'happy' | 'thinking';

interface VivaBuddyCharacterProps {
  emotion: VivaEmotion;
  className?: string;
  size?: number;
}

export function VivaBuddyCharacter({
  emotion = 'idle',
  className = '',
  size = 200,
}: VivaBuddyCharacterProps) {
  // Antenna light color and glow
  const antennaColors = {
    idle: { fill: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)' },
    listening: { fill: '#06B6D4', glow: 'rgba(6, 182, 212, 0.7)' },
    shocked: { fill: '#F43F5E', glow: 'rgba(244, 63, 94, 0.7)' },
    happy: { fill: '#10B981', glow: 'rgba(16, 185, 129, 0.7)' },
    thinking: { fill: '#F59E0B', glow: 'rgba(245, 158, 11, 0.6)' },
  };

  const currentAntenna = antennaColors[emotion] || antennaColors.idle;

  // Emotion-specific body physics
  const bodyVariants = {
    idle: {
      y: [-3, 3, -3],
      rotate: [-1, 1, -1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    listening: {
      y: [-2, 2, -2],
      scale: [1, 1.02, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    shocked: {
      y: [0, -20, 6, -8, 2, 0],
      rotate: [0, -7, 6, -4, 2, 0],
      scale: [1, 1.08, 0.96, 1.03, 1],
      transition: {
        duration: 0.7,
        ease: 'easeOut' as const,
      },
    },
    happy: {
      y: [0, -18, 0, -10, 0],
      scale: [1, 1.06, 0.98, 1.04, 1],
      rotate: [0, 3, -3, 2, 0],
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
    thinking: {
      y: [-2, 2, -2],
      rotate: [-4, 4, -4],
      transition: {
        duration: 2.2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Listening Soundwave Pulse Rings */}
      {emotion === 'listening' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute rounded-full border-2 border-cyan-400/40"
            initial={{ width: size * 0.7, height: size * 0.7, opacity: 0.8 }}
            animate={{ width: size * 1.3, height: size * 1.3, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute rounded-full border border-blue-400/30"
            initial={{ width: size * 0.7, height: size * 0.7, opacity: 0.6 }}
            animate={{ width: size * 1.5, height: size * 1.5, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Cheerful Star Particles on Happy */}
      {emotion === 'happy' && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[
            { x: -size * 0.35, y: -size * 0.25, delay: 0 },
            { x: size * 0.35, y: -size * 0.2, delay: 0.15 },
            { x: -size * 0.25, y: size * 0.2, delay: 0.3 },
            { x: size * 0.3, y: size * 0.25, delay: 0.2 },
          ].map((star, idx) => (
            <motion.div
              key={idx}
              className="absolute text-amber-400 text-lg font-bold"
              style={{ left: '50%', top: '50%' }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{
                x: star.x,
                y: star.y,
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0],
                rotate: [0, 90, 180],
              }}
              transition={{ duration: 1.2, delay: star.delay, repeat: Infinity, repeatDelay: 1 }}
            >
              ✦
            </motion.div>
          ))}
        </div>
      )}

      {/* Shock Exclamation Particles on Shocked */}
      {emotion === 'shocked' && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <motion.div
            className="absolute font-mono font-bold text-rose-500 text-sm px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200"
            style={{ left: '15%', top: '10%' }}
            initial={{ y: 10, opacity: 0, scale: 0.8 }}
            animate={{ y: -8, opacity: [0, 1, 0.9, 0], scale: [0.8, 1.1, 1, 0.8] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.5 }}
          >
            !?!
          </motion.div>
          <motion.div
            className="absolute font-mono font-bold text-amber-500 text-xs px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200"
            style={{ right: '15%', top: '12%' }}
            initial={{ y: 10, opacity: 0, scale: 0.8 }}
            animate={{ y: -6, opacity: [0, 1, 0.9, 0], scale: [0.8, 1.1, 1, 0.8] }}
            transition={{ duration: 1.4, delay: 0.2, repeat: Infinity, repeatDelay: 0.5 }}
          >
            ROAST
          </motion.div>
        </div>
      )}

      {/* Main Animated SVG Robot Body */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={emotion}
        variants={bodyVariants}
        className="drop-shadow-md"
      >
        <defs>
          {/* Head & Body Gradients */}
          <linearGradient id="bodyGrad" x1="40" y1="50" x2="160" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#F1F5F9" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Visor Screen Gradient */}
          <linearGradient id="visorGrad" x1="45" y1="75" x2="155" y2="145" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F172A" />
            <stop offset="1" stopColor="#1E293B" />
          </linearGradient>

          {/* Accent Royal Blue Border */}
          <linearGradient id="accentBorder" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Antenna Glow Filter */}
          <filter id="antennaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Antenna & Transmitter --- */}
        <line x1="100" y1="52" x2="100" y2="26" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <line x1="93" y1="36" x2="107" y2="36" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Antenna Bulb with Pulse */}
        <circle
          cx="100"
          cy="22"
          r="9"
          fill={currentAntenna.fill}
          filter="url(#antennaGlow)"
          style={{ transition: 'fill 0.3s ease' }}
        />
        <circle cx="97" cy="19" r="3" fill="#FFFFFF" opacity="0.7" />

        {/* --- Left Ear / Headphone Mount --- */}
        <rect x="24" y="90" width="12" height="30" rx="6" fill="#3B82F6" />
        <rect x="28" y="96" width="4" height="18" rx="2" fill="#93C5FD" />

        {/* --- Right Ear / Headphone Mount --- */}
        <rect x="164" y="90" width="12" height="30" rx="6" fill="#3B82F6" />
        <rect x="168" y="96" width="4" height="18" rx="2" fill="#93C5FD" />

        {/* --- Headphone Arch --- */}
        <path
          d="M32 94 C32 46, 168 46, 168 94"
          stroke="#CBD5E1"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* --- Robot Head Outer Shell --- */}
        <rect
          x="34"
          y="52"
          width="132"
          height="106"
          rx="28"
          fill="url(#bodyGrad)"
          stroke="#E2E8F0"
          strokeWidth="3"
        />

        {/* Top Head Highlight */}
        <path
          d="M48 64 Q100 58 152 64"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* --- Digital Visor Display Screen --- */}
        <rect
          x="44"
          y="72"
          width="112"
          height="72"
          rx="18"
          fill="url(#visorGrad)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Visor Glare/Refraction Arc */}
        <path
          d="M50 78 C75 74, 125 74, 150 78"
          stroke="#475569"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* --- Eyes & Expressions --- */}
        {emotion === 'happy' && (
          // Joyful upturned arc eyes (^ ^) + cheeks
          <g>
            <path
              d="M62 104 C62 94, 82 94, 82 104"
              stroke="#34D399"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M118 104 C118 94, 138 94, 138 104"
              stroke="#34D399"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Rosy Cheeks */}
            <circle cx="58" cy="116" r="6" fill="#F43F5E" opacity="0.4" />
            <circle cx="142" cy="116" r="6" fill="#F43F5E" opacity="0.4" />
            {/* Beaming Smile */}
            <path
              d="M90 120 Q100 130 110 120"
              stroke="#34D399"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {emotion === 'shocked' && (
          // Huge wide shocked eyes (O_O) + open gasp mouth
          <g>
            {/* Left Big Eye */}
            <circle cx="72" cy="100" r="14" fill="#FFFFFF" />
            <circle cx="72" cy="100" r="6" fill="#F43F5E" />
            <circle cx="74" cy="98" r="2.5" fill="#FFFFFF" />

            {/* Right Big Eye */}
            <circle cx="128" cy="100" r="14" fill="#FFFFFF" />
            <circle cx="128" cy="100" r="6" fill="#F43F5E" />
            <circle cx="130" cy="98" r="2.5" fill="#FFFFFF" />

            {/* Drop Jaw / Gasp Mouth */}
            <ellipse cx="100" cy="126" rx="8" ry="10" fill="#F43F5E" />
            <ellipse cx="100" cy="124" rx="5" ry="6" fill="#0F172A" />
          </g>
        )}

        {emotion === 'listening' && (
          // Audio frequency dancing meter eyes
          <g>
            {/* Left Soundwave Eye */}
            <line x1="60" y1="104" x2="60" y2="96" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            <line x1="68" y1="109" x2="68" y2="91" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="76" y1="112" x2="76" y2="88" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
            <line x1="84" y1="105" x2="84" y2="95" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />

            {/* Right Soundwave Eye */}
            <line x1="116" y1="105" x2="116" y2="95" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            <line x1="124" y1="112" x2="124" y2="88" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
            <line x1="132" y1="109" x2="132" y2="91" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="140" y1="104" x2="140" y2="96" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />

            {/* Waveform Speech Mouth */}
            <path
              d="M90 126 Q95 120 100 126 T110 126"
              stroke="#06B6D4"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {emotion === 'thinking' && (
          // Rolling/analyzing eyes + thinking wavy mouth
          <g>
            <circle cx="72" cy="98" r="11" fill="#1E293B" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="75" cy="96" r="4.5" fill="#F59E0B" />
            <circle cx="128" cy="98" r="11" fill="#1E293B" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="131" cy="96" r="4.5" fill="#F59E0B" />

            {/* Scanning radar sweep */}
            <line x1="50" y1="114" x2="150" y2="114" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

            {/* Puzzled mouth */}
            <path
              d="M93 124 Q100 121 107 124"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {emotion === 'idle' && (
          // Calm, friendly, ready-to-test eyes with cute glints
          <g>
            {/* Left Eye */}
            <circle cx="72" cy="100" r="10" fill="#3B82F6" />
            <circle cx="70" cy="98" r="3" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="128" cy="100" r="10" fill="#3B82F6" />
            <circle cx="126" cy="98" r="3" fill="#FFFFFF" />

            {/* Pleasant Confident Smile */}
            <path
              d="M92 122 Q100 128 108 122"
              stroke="#3B82F6"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* --- Collar Badge: MAKAUT / SETGOI Engineering --- */}
        <rect x="76" y="162" width="48" height="12" rx="4" fill="#2563EB" />
        <text
          x="100"
          y="171"
          fill="#FFFFFF"
          fontSize="7.5"
          fontWeight="bold"
          fontFamily="monospace"
          textAnchor="middle"
        >
          MAKAUT
        </text>
      </motion.svg>
    </div>
  );
}
