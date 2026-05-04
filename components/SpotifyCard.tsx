'use client'
import { useSpotify } from '../hooks/useSpotify'
import { useEffect, useState } from 'react'

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function SpotifyCard() {
  const { isPlaying, song, artist, albumArt, progress, duration } = useSpotify()
  const [currentProgress, setCurrentProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying ||!progress ||!duration) return
    setCurrentProgress(progress)

    const interval = setInterval(() => {
      setCurrentProgress(prev => {
        if (prev + 100 >= duration) return duration
        return prev + 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [progress, isPlaying, duration, song])

  if (!isPlaying) return null

  const progressPercent = duration? (currentProgress / duration) * 100 : 0

  return (
    <div className="w-80 bg-neutral-900/90 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-white">
      {/* Badge verde com bolinha pulsando + SPOTIFY */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute" />
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        </div>
        <span className="text-xs font-bold text-green-500">SPOTIFY</span>
      </div>

      {/* Capa + Info + EQs no canto inferior direito da capa */}
      <div className="flex gap-3 mb-3">
        <div className="relative">
          <img src={albumArt} alt="" className="w-16 h-16 rounded-lg" />
          <div className="absolute bottom-1 right-1 flex gap-0.5 h-4 items-end">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-white rounded-full"
                style={{
                  animation: `eq ${0.4 + i * 0.1}s ease-in-out infinite alternate`
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{song}</p>
          <p className="text-neutral-400 text-xs truncate">{artist}</p>
        </div>
      </div>

      {/* Barra de progressão SINCRONIZADA */}
      <div className="space-y-1">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full"
            style={{
              width: `${progressPercent}%`,
              transition: 'width 100ms linear'
            }}
          />
        </div>
        {/* Timestamps sincronizadas */}
        <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
          <span>{formatTime(currentProgress)}</span>
          <span>{formatTime(duration || 0)}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes eq {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  )
}