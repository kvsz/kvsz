'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

type YouTubePlayer = {
  setVolume: (volume: number) => void
  getDuration: () => number
  getCurrentTime: () => number
  getPlayerState: () => number
  loadVideoById: (options: {
    videoId: string
    startSeconds?: number
  }) => void
  cueVideoById: (options: {
    videoId: string
    startSeconds?: number
  }) => void
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (
    seconds: number,
    allowSeekAhead: boolean,
  ) => void
  destroy: () => void
}

type YouTubePlayerEvent = {
  target: YouTubePlayer
}

type YouTubeStateEvent = YouTubePlayerEvent & {
  data: number
}

type YouTubeErrorEvent = {
  data: number
}

type YouTubePlayerOptions = {
  width?: number
  height?: number

  playerVars?: {
    autoplay?: number
    controls?: number
    disablekb?: number
    enablejsapi?: number
    modestbranding?: number
    rel?: number
    playsinline?: number
    origin?: string
  }

  events?: {
    onReady?: (event: YouTubePlayerEvent) => void
    onStateChange?: (
      event: YouTubeStateEvent,
    ) => void
    onError?: (event: YouTubeErrorEvent) => void
  }
}

type YouTubeAPI = {
  Player: new (
    elementId: string,
    options: YouTubePlayerOptions,
  ) => YouTubePlayer

  PlayerState: {
    UNSTARTED: number
    ENDED: number
    PLAYING: number
    PAUSED: number
    BUFFERING: number
    CUED: number
  }
}

declare global {
  interface Window {
    YT?: YouTubeAPI
    onYouTubeIframeAPIReady?: () => void
  }
}

type LoadVideoOptions = {
  videoId: string
  startSeconds?: number
  autoplay?: boolean
}

export function useYouTubePlayer() {
  const playerRef =
    useRef<YouTubePlayer | null>(null)

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] =
    useState(false)

  const [currentTime, setCurrentTime] =
    useState(0)

  const [duration, setDuration] = useState(0)

  const [volume, setVolumeState] =
    useState(25)

  useEffect(() => {
    let cancelled = false

    let progressInterval:
      | ReturnType<typeof setInterval>
      | null = null

    const createPlayer = () => {
      if (cancelled) return
      if (playerRef.current) return
      if (!window.YT?.Player) return

      const playerElement =
        document.getElementById(
          'youtube-player',
        )

      if (!playerElement) {
        console.error(
          'Elemento #youtube-player não foi encontrado.',
        )

        return
      }

      playerRef.current = new window.YT.Player(
        'youtube-player',
        {
          width: 200,
          height: 200,

          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: window.location.origin,
          },

          events: {
            onReady: event => {
              event.target.setVolume(25)

              setVolumeState(25)
              setIsReady(true)
            },

            onStateChange: event => {
              const playerState =
                window.YT?.PlayerState

              if (!playerState) return

              const state = event.data

              setIsPlaying(
                state === playerState.PLAYING,
              )

              if (
                state === playerState.PLAYING ||
                state === playerState.PAUSED
              ) {
                setDuration(
                  event.target.getDuration(),
                )

                setCurrentTime(
                  event.target.getCurrentTime(),
                )
              }
            },

            onError: event => {
              console.error(
                'Erro no player do YouTube:',
                event.data,
              )
            },
          },
        },
      )
    }

    if (window.YT?.Player) {
      createPlayer()
    } else {
      const existingScript =
        document.querySelector<HTMLScriptElement>(
          'script[src="https://www.youtube.com/iframe_api"]',
        )

      if (!existingScript) {
        const script =
          document.createElement('script')

        script.src =
          'https://www.youtube.com/iframe_api'

        script.async = true

        document.head.appendChild(script)
      }

      const previousCallback =
        window.onYouTubeIframeAPIReady

      window.onYouTubeIframeAPIReady =
        () => {
          previousCallback?.()
          createPlayer()
        }
    }

    progressInterval = setInterval(() => {
      const player = playerRef.current

      if (!player) return

      try {
        const nextDuration =
          player.getDuration()

        const nextCurrentTime =
          player.getCurrentTime()

        if (Number.isFinite(nextDuration)) {
          setDuration(nextDuration)
        }

        if (
          Number.isFinite(nextCurrentTime)
        ) {
          setCurrentTime(nextCurrentTime)
        }
      } catch {
        // Player ainda inicializando.
      }
    }, 500)

    return () => {
      cancelled = true

      if (progressInterval) {
        clearInterval(progressInterval)
      }

      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [])

  const loadVideo = useCallback(
    ({
      videoId,
      startSeconds = 0,
      autoplay = true,
    }: LoadVideoOptions) => {
      const player = playerRef.current

      if (!player || !isReady) {
        return false
      }

      if (autoplay) {
        player.loadVideoById({
          videoId,
          startSeconds,
        })
      } else {
        player.cueVideoById({
          videoId,
          startSeconds,
        })
      }

      return true
    },
    [isReady],
  )

  const play = useCallback(() => {
    playerRef.current?.playVideo()
  }, [])

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo()
  }, [])

  const toggle = useCallback(() => {
    const player = playerRef.current
    const playerState =
      window.YT?.PlayerState

    if (!player || !playerState) return

    const state = player.getPlayerState()

    if (state === playerState.PLAYING) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }, [])

  const seekTo = useCallback(
    (seconds: number) => {
      const safeSeconds = Math.max(
        0,
        seconds,
      )

      playerRef.current?.seekTo(
        safeSeconds,
        true,
      )

      setCurrentTime(safeSeconds)
    },
    [],
  )

  const setVolume = useCallback(
    (value: number) => {
      const nextVolume = Math.max(
        0,
        Math.min(100, value),
      )

      playerRef.current?.setVolume(
        nextVolume,
      )

      setVolumeState(nextVolume)
    },
    [],
  )

  return {
    isReady,
    isPlaying,
    currentTime,
    duration,
    volume,
    loadVideo,
    play,
    pause,
    toggle,
    seekTo,
    setVolume,
  }
}