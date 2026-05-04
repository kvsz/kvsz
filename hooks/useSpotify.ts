'use client'
import { useEffect, useState } from 'react'

type SpotifyData = {
  isPlaying: boolean
  song?: string
  artist?: string
  albumArt?: string
  progress?: number
  duration?: number
}

export function useSpotify() {
  const [data, setData] = useState<SpotifyData>({ isPlaying: false })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/now-playing')
        if (!res.ok) return
        const json = await res.json()
        // console.log('Dados do Spotify:', json) // <- REMOVIDO
        setData(json)
      } catch (e) {
        console.error('Erro ao buscar Spotify:', e)
      }
    }

    fetchData()
    // const interval = setInterval(fetchData, 1000) // <- REMOVIDO
    // return () => clearInterval(interval) // <- REMOVIDO
  }, [])

  return data
}