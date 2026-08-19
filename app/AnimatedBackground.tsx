'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const SYMBOLS = [
  '@',
  '+',
  '-',
  '=',
  '*',
  '&',
  '$',
  '€',
  '¥',
  '£',
  '₪',
  '₿',
  '#',
  '~',
]



type Particle = {
  id: number
  symbol: string
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  initialRotation: number
  weight: number

  moveX1: number
  moveX2: number
  moveY1: number
  moveY2: number
  rotation1: number
  rotation2: number
}

type AnimatedBackgroundProps = {
  showRadials?: boolean
}

export default function AnimatedBackground({
  showRadials = true,
}: AnimatedBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = []

    for (let i = 0; i < 99; i++) {
  const initialRotation = Math.random() * 360
  const duration = Math.random() * 16 + 15

  newParticles.push({
    id: i,

    symbol:
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],

    x: Math.random() * 100,
    y: Math.random() * 100,

    size: Math.random() * 39.3382 + 20.5199,
    opacity: Math.random() * 0.99 + 0.24695,

    duration,
    delay: -Math.random() * duration,

    initialRotation,

    weight: Math.random() > 0.5 ? 700 : 600,

    moveX1: Math.random() * 90 - 45,
    moveX2: Math.random() * 90 - 45,

    moveY1: Math.random() * 90 - 45,
    moveY2: Math.random() * 90 - 45,

    rotation1:
      initialRotation + Math.random() * 80 - 40,

    rotation2:
      initialRotation + Math.random() * 80 - 40,
  })
}

    setParticles(newParticles)
  }, [])

  return (
    <div
      className="
        pointer-events-none fixed inset-0
        overflow-hidden
      "
      style={{ zIndex: 0 }}
    >
      {/* Círculos */}
{showRadials && (
  <>
    <div
      className="
        absolute left-1/4 top-1/4
        h-96 w-96 rounded-full blur-3xl
      "
      style={{
        backgroundColor: '#b5825f0D',
      }}
    />

    <div
      className="
        absolute bottom-1/4 right-1/4
        h-80 w-80 rounded-full blur-3xl
      "
      style={{
        backgroundColor: '#a15d3e0D',
      }}
    />
  </>
)}

      {/* Símbolos */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute select-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}px`,
            fontFamily:
              '"JetBrains Mono", "JetBrains Mono Fallback", monospace',
            fontWeight: particle.weight,
            color: '#1B130D',
            opacity: particle.opacity,
            rotate: particle.initialRotation,
            WebkitFontSmoothing: 'antialiased',
          }}
          animate={{
            x: [
              0,
              particle.moveX1,
              particle.moveX2,
            ],
            y: [
              0,
              particle.moveY1,
              particle.moveY2,
            ],
            rotate: [
              particle.initialRotation,
              particle.rotation1,
              particle.rotation2,
            ],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'linear',
          }}
        >
          {particle.symbol}
        </motion.div>
      ))}
    </div>
  )
}