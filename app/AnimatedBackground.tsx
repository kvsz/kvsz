'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const SYMBOLS = ['@', '+', '-', '=', '*', '&', '$', '€', '¥', '£', '₪', '₿', '#', '~']

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
}

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = []
    
    for (let i = 0; i < 99; i++) {
      newParticles.push({
        id: i,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 39.3382 + 20.5199, // 20.5199px a 59.8581px
        opacity: Math.random() * 0.99 + 0.24695, // 0.25 a 0.6
        duration: Math.random() * 25 + 20,
        delay: Math.random() * 5,
        initialRotation: Math.random() * 360,
        weight: Math.random() > 0.5 ? 700 : 600, // 50% bold 700, 50% semibold 600
      })
    }
    
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* CÍRCULOS */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
           style={{ backgroundColor: '#b5825f0D' }} />
      
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
           style={{ backgroundColor: '#a15d3e0D' }} />

      {/* SÍMBOLOS */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute select-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}px`,
            fontFamily: '"JetBrains Mono", "JetBrains Mono Fallback", monospace',
            fontWeight: particle.weight,
            color: '#1B130D',
            opacity: particle.opacity,
            rotate: particle.initialRotation,
            WebkitFontSmoothing: 'antialiased',
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotate: [
              particle.initialRotation, 
              particle.initialRotation + Math.random() * 180 - 90,
              particle.initialRotation
            ],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {particle.symbol}
        </motion.div>
      ))}
    </div>
  )
}