'use client'
import { useEffect, useState } from 'react'

type SpotifyData = {
  isPlaying: boolean
  song?: string
  artist?: string
  albumArt?: string
  progress?: number
  duration?: number
  fallback?: boolean
  timestampStart?: number
  timestampEnd?: number
}

export function useSpotify() {
  const [data, setData] = useState<SpotifyData>({ isPlaying: false })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/now-playing')
        if (!res.ok) return
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error('Erro ao buscar Spotify:', e)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000) // checa a cada 3s
    return () => clearInterval(interval)
  }, [])

  return data
}