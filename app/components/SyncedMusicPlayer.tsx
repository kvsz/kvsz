'use client'

import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import * as Slider from '@radix-ui/react-slider'

import {
  Wifi,
  Minimize2,
  Music,
  Pause,
  Play,
  Search,
  Volume2,
  VolumeX,
  X,
  UsersRound,
} from 'lucide-react'

import {
  AnimatePresence,
  motion,
} from 'framer-motion'

import { useSpotify } from '@/hooks/useSpotify'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'

type YouTubeResult = {
  videoId: string
  title: string
  thumbnail: string
  duration: string | null
  url: string
  channel: string | null
  verified: boolean
}

export default function SyncedMusicPlayer() {
    const [isOpen, setIsOpen] = useState(false)

    const [playerActivated, setPlayerActivated] =
  useState(false)

  const [isSyncing, setIsSyncing] =
  useState(false)

const [autoSyncEnabled, setAutoSyncEnabled] =
  useState(false)
  
  const spotify = useSpotify()

const {
  isReady,
  isPlaying,
  currentTime,
  duration,
  volume,
  loadVideo,
  play,
  pause,
  seekTo,
  setVolume,
} = useYouTubePlayer()

  const [video, setVideo] =
    useState<YouTubeResult | null>(null)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

    const [isSeeking, setIsSeeking] = useState(false)

const [seekPreview, setSeekPreview] = useState(0)

  /*
   * Sempre que a música do Spotify mudar,
   * procura o vídeo correspondente.
   */
  useEffect(() => {
  if (!spotify.song || !spotify.artist) {
    setVideo(null)
    return
  }

  const song = spotify.song
  const artist = spotify.artist

  const controller = new AbortController()

    const searchVideo = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
  `/api/youtube-search?${new URLSearchParams({
    song,
    artist,
  }).toString()}`,
  {
    signal: controller.signal,
  },
)

        if (!response.ok) {
          throw new Error(
            'Não foi possível encontrar a música.',
          )
        }

        const data: YouTubeResult =
          await response.json()

        setVideo(data)
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'Erro ao pesquisar vídeo:',
          error,
        )

        setVideo(null)
        setError(
          'Não foi possível encontrar o áudio.',
        )
      } finally {
        setLoading(false)
      }
    }

    searchVideo()

    return () => {
      controller.abort()
    }
  }, [spotify.song, spotify.artist])

  /*
   * Quando o vídeo for encontrado e o player
   * estiver pronto, apenas prepara o vídeo.
   * Ele ainda não começa a tocar.
   */
  useEffect(() => {
  if (!isReady || !video?.videoId) {
    return
  }

  /*
   * A sincronização foi ativada pelo visitante.
   */
  if (autoSyncEnabled) {
    /*
     * Você voltou a ouvir Spotify ou trocou
     * para uma nova faixa real.
     */
    if (
      spotify.isPlaying &&
      !spotify.fallback
    ) {
      const timestampStart =
        spotify.timestampStart

      const startSeconds =
        timestampStart
          ? Math.max(
              0,
              (Date.now() - timestampStart) / 1000,
            )
          : 0

      setIsSyncing(true)

      loadVideo({
        videoId: video.videoId,
        startSeconds,
        autoplay: true,
      })
    }

    /*
     * No fallback, não prepara novamente o vídeo,
     * pois a última música já pode estar tocando.
     */
    return
  }

  /*
   * Apenas buscou/abriu o painel:
   * prepara a música sem reproduzir.
   */
  loadVideo({
    videoId: video.videoId,
    startSeconds: 0,
    autoplay: false,
  })
}, [
  isReady,
  video?.videoId,
  loadVideo,
  autoSyncEnabled,
  spotify.isPlaying,
  spotify.fallback,
  spotify.timestampStart,
])

  const showNowPlayingToast = () => {
  if (!video) return

  toast.custom(
    () => (
      <div
        className="
          flex w-[356px] items-center gap-3
          rounded-xl border border-[#291f18]
          bg-[#120c07] p-4
          text-[#ede3d6] shadow-xl
        "
      >
        <img
          src={video.thumbnail ?? spotify.albumArt}
          alt={video.title ?? spotify.song}
          className="
            h-14 w-14 flex-shrink-0
            rounded-lg object-cover
          "
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            Você está ouvindo agora
          </p>

          <p className="truncate text-xs text-[#8d7d6e]">
            {video.channel ?? spotify.artist}
          </p>

          <p className="truncate text-xs text-[#8d7d6e]">
            {video.title ?? spotify.song}
          </p>
        </div>
      </div>
    ),
    {
      duration: 3500,
    },
  )
}

const handleSearch = () => {
  if (!spotify.song || !spotify.artist) {
    return
  }

  /*
   * Buscar mostra o painel completo,
   * mas não inicia sincronização automática.
   */
  setAutoSyncEnabled(false)
  setPlayerActivated(true)
}

const handleSynchronize = () => {
  if (
    !video ||
    !isReady ||
    loading ||
    isSyncing
  ) {
    return
  }

  const shouldLiveSync =
    spotify.isPlaying &&
    !spotify.fallback

  setIsSyncing(true)

  /*
   * A pessoa escolheu acompanhar seu Spotify.
   * Mesmo no fallback, continuamos aguardando
   * você voltar a ouvir uma música real.
   */
  setAutoSyncEnabled(true)

  const timestampStart =
    spotify.timestampStart

  const startSeconds =
    shouldLiveSync && timestampStart
      ? Math.max(
          0,
          (Date.now() - timestampStart) / 1000,
        )
      : 0

  const loaded = loadVideo({
    videoId: video.videoId,
    startSeconds,
    autoplay: true,
  })

  if (!loaded) {
    setIsSyncing(false)
    setAutoSyncEnabled(false)
    return
  }

  if (!shouldLiveSync) {
    setPlayerActivated(true)
    setIsSyncing(false)
    showNowPlayingToast()
  }
}

useEffect(() => {
  /*
   * Quando o YouTube realmente começar a tocar,
   * encerra o carregamento e revela o painel.
   */
  if (!isSyncing || !isPlaying) {
    return
  }

  setIsSyncing(false)
  setPlayerActivated(true)
  showNowPlayingToast()
}, [isSyncing, isPlaying])

const formatSeconds = (seconds: number) => {
  if (!Number.isFinite(seconds)) {
    return '0:00'
  }

  const minutes = Math.floor(seconds / 60)

  const remainingSeconds = Math.floor(
    seconds % 60,
  )

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
}

const safeDuration =
  Number.isFinite(duration) && duration > 0
    ? duration
    : 0

const safeCurrentTime =
  Number.isFinite(currentTime)
    ? Math.max(
        0,
        safeDuration > 0
          ? Math.min(currentTime, safeDuration)
          : currentTime,
      )
    : 0

const displayedCurrentTime = isSeeking
  ? seekPreview
  : safeCurrentTime

const displayedProgressPercent =
  safeDuration > 0
    ? Math.min(
        100,
        Math.max(
          0,
          (displayedCurrentTime / safeDuration) * 100,
        ),
      )
    : 0

const toggleMute = () => {
  setVolume(volume > 0 ? 0 : 25)
}

const handlePlayPause = () => {
  if (isPlaying) {
    pause()
    return
  }

  /*
   * Quando você estiver ouvindo Spotify,
   * retoma sincronizado com a posição atual.
   */
  if (isLiveSync) {
    handleSynchronize()
    return
  }

  /*
   * Em música fallback/salva,
   * continua do ponto em que foi pausada.
   */
  play()
}

const isLiveSync =
  spotify.isPlaying && !spotify.fallback

const canSeek =
  !isLiveSync && safeDuration > 0

  const showPlayerContent =
  playerActivated &&
  Boolean(spotify.song) &&
  Boolean(spotify.artist)

  const showActiveMinimized =
  autoSyncEnabled && isPlaying

  return (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
  key="music-player-expanded"
  initial={{
    opacity: 0,
    scale: 0,
  }}
  animate={{
    opacity: 1,
    scale: 1,
  }}
  exit={{
    opacity: 0,
    scale: 0,
  }}
  transition={{
    type: 'spring',
    stiffness: 150,
    damping: 21,
  }}
  style={{
    transformOrigin: 'bottom right',
  }}
  className="
    fixed bottom-6 right-6 z-[9999]
    w-[300px]
    max-md:bottom-24
    max-md:right-4
    max-md:w-[calc(100vw-2rem)]
  "
>
  <div
  className="
    relative w-[300px] overflow-hidden
    rounded-2xl
    border border-[#291f18]/40
    bg-[#120c07]/95
    shadow-xl backdrop-blur-xl
    max-md:w-[calc(100vw-2rem)]
  "
>
    <div className="relative p-3">
      {/* Cabeçalho */}
      <div className="mb-3 flex items-center justify-between">
  <div className="flex items-center gap-2">
  {showPlayerContent && isPlaying ? (
    <div className="flex items-end gap-0.5">
      {[0, 1, 2].map((bar) => (
        <motion.span
          key={bar}
          animate={{
            height: [3, 8, 5, 9, 3],
          }}
          transition={{
            duration: 0.7,
            delay: bar * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-0.5 rounded-full bg-[#b5825f]"
        />
      ))}
    </div>
  ) : (
    <div className="h-1.5 w-1.5 rounded-full bg-[#8d7d6e]/50" />
  )}

  <span className="text-[10px] font-medium uppercase tracking-wider text-[#8d7d6e]">
  {isLiveSync ? 'Sync' : 'Music'}
</span>
</div>

  <button
    type="button"
    onClick={() => setIsOpen(false)}
    aria-label="Minimizar player"
    className="
      flex h-6 w-6 items-center justify-center
      rounded-lg text-[#8d7d6e]
      transition-colors
      hover:bg-[#221812]/80
      hover:text-[#ede3d6]
    "
  >
    <Minimize2 className="h-3 w-3" />
  </button>
</div>

      {showPlayerContent ? (
  <div>
    {/* Música */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-shrink-0">
            <img
              src={
                video?.thumbnail ??
                spotify.albumArt
              }
              alt={`Capa de ${spotify.song}`}
              className="
                h-14 w-14 rounded-lg
                border border-[#291f18]/70
                object-cover shadow-md
              "
            />

            {isPlaying && (
              <div
                className="
                  absolute inset-0 flex
                  items-center justify-center
                  rounded-lg bg-black/40
                  backdrop-blur-[1px]
                "
              >
                <div className="flex h-3 items-end gap-0.5">
                  {[0, 1, 2].map((bar) => (
                    <motion.span
                      key={bar}
                      animate={{
                        height: [3, 8, 5, 10, 3],
                      }}
                      transition={{
                        duration: 0.7,
                        delay: bar * 0.12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="
                        w-0.5 rounded-full
                        bg-white
                      "
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="
                mb-[-2px] truncate text-xs
                font-medium text-[#ede3d6]
              "
            >
              {video?.title ?? spotify.song}
            </h3>

            <p
              className="
                mb-0 truncate text-[10px]
                text-[#8d7d6e]
              "
            >
              {video?.channel ??
                spotify.artist}
            </p>

            <div
  className="
    flex items-center gap-1
    px-1.5 py-1
    bg-emerald-500/10
    border border-emerald-500/20
    rounded
    w-fit
    leading-none
  "
>
  <Wifi className="w-2 h-2 text-emerald-500" />

  <span className="text-[9px] leading-none font-medium text-emerald-500">
    Sync
  </span>
</div>
          </div>
        </div>

        {/* Progresso */}
<div className="space-y-0">
  <div className="flex h-5 items-center pt-2">
    <Slider.Root
      min={0}
      max={Math.max(safeDuration, 1)}
      step={0.1}
      value={[
        Math.min(
          displayedCurrentTime,
          Math.max(safeDuration, 1),
        ),
      ]}
      disabled={!canSeek}
      onValueChange={(values) => {
        if (!canSeek) return

        const nextTime = values[0] ?? 0

        setIsSeeking(true)
        setSeekPreview(nextTime)
      }}
      onValueCommit={(values) => {
        if (!canSeek) return

        const nextTime = values[0] ?? 0

        seekTo(nextTime)
        setSeekPreview(nextTime)
        setIsSeeking(false)
      }}
      className="
        relative flex h-4 w-full
        touch-none select-none items-center
        data-[disabled]:cursor-default
        data-[disabled]:opacity-50
      "
      aria-label={
        canSeek
          ? 'Alterar posição da música'
          : 'Progresso sincronizado com Spotify'
      }
    >
      <Slider.Track
        className="
          relative h-1.5 w-full
          grow overflow-hidden rounded-full
          bg-[#221812]
        "
      >
        <Slider.Range
          className="
            absolute h-full
            bg-[#b5825f]
          "
        />
      </Slider.Track>

      <Slider.Thumb
        className="
          block h-4 w-4
          shrink-0 rounded-full
          border border-[#b5825f]
          bg-white shadow-sm
          transition-[box-shadow]
          hover:ring-4
          hover:ring-[#b5825f]/20
          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-[#b5825f]/25
          disabled:pointer-events-none
          disabled:opacity-50
        "
      />
    </Slider.Root>
  </div>

  <div
    className="
      flex justify-between
      font-mono text-[9px]
      text-[#8d7d6e]/70
    "
  >
    <span>
      {formatSeconds(displayedCurrentTime)}
    </span>

    <span>
      {formatSeconds(safeDuration)}
    </span>
  </div>
</div>

        {/* Controles */}
        <div className="flex items-center justify-between gap-2">
          <div
            className="
              flex max-w-[120px]
              flex-1 items-center gap-1.5
            "
          >
            <button
              type="button"
              onClick={toggleMute}
              aria-label={
                volume > 0
                  ? 'Silenciar'
                  : 'Ativar som'
              }
              className="
                flex h-6 w-6
                items-center justify-center
                rounded-lg text-[#8d7d6e]
                transition-colors
                hover:bg-[#221812]/80
                hover:text-[#ede3d6]
              "
            >
              {volume > 0 ? (
                <Volume2 className="h-3 w-3" />
              ) : (
                <VolumeX className="h-3 w-3" />
              )}
            </button>

            <div className="flex-1">
  <Slider.Root
    min={0}
    max={100}
    step={1}
    value={[volume]}
    onValueChange={(values) => {
      const nextVolume = values[0] ?? 0
      setVolume(nextVolume)
    }}
    className="
      relative flex h-4 w-full
      touch-none select-none items-center
    "
    aria-label="Volume"
  >
    <Slider.Track
      className="
        relative h-1.5 w-full
        grow overflow-hidden rounded-full
        bg-[#221812]
      "
    >
      <Slider.Range
        className="
          absolute h-full
          bg-[#b5825f]
        "
      />
    </Slider.Track>

    <Slider.Thumb
      className="
        block h-4 w-4
        shrink-0 rounded-full
        border border-[#b5825f]
        bg-white shadow-sm
        transition-[box-shadow]
        hover:ring-4
        hover:ring-[#b5825f]/20
        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-[#b5825f]/25
      "
    />
  </Slider.Root>
</div>
          </div>

          <button
            type="button"
            onClick={handlePlayPause}
            disabled={
              !isReady ||
              !video ||
              loading
            }
            aria-label={
              isPlaying
                ? 'Pausar'
                : 'Sincronizar e reproduzir'
            }
            className="
  flex h-9 w-9
  items-center justify-center
  rounded-2xl
  bg-[#b5825f]
  text-[#120c07]
  shadow-md
  transition-all
  hover:bg-[#c18d68]
  hover:scale-[1.02]
  active:scale-95
  disabled:cursor-not-allowed
  disabled:opacity-40
"
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="
                  h-4 w-4 rounded-full
                  border-2 border-[#120c07]/30
                  border-t-[#120c07]
                "
              />
            ) : isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5 translate-x-[1px]" />
            )}
          </button>

          <button
            type="button"
            onClick={handleSynchronize}
            disabled={
              !isReady ||
              !video ||
              loading
            }
            aria-label="Sincronizar novamente"
            className="
              flex h-6 w-6
              items-center justify-center
              rounded-lg text-[#8d7d6e]
              transition-colors
              hover:bg-[#221812]/80
              hover:text-[#ede3d6]
              disabled:opacity-40
            "
          >
            <Search className="h-3 w-3" />
          </button>
        </div>

        {error && (
  <p className="text-[10px] text-red-400">
    {error}
  </p>
)}
  </div>
) : (
  <div className="flex flex-col items-center py-2 text-center">
    <div
      className="
        mb-2 flex h-10 w-10
        items-center justify-center
        rounded-xl bg-[#b5825f]/10
      "
    >
      <Music className="h-5 w-5 text-[#b5825f]" />
    </div>

    <h3 className="mb-0.5 text-xs font-semibold text-[#ede3d6]">
      Nenhuma música
    </h3>

    <p className="mb-2.5 text-[10px] text-[#8d7d6e]">
      Busque ou sincronize
    </p>

    <div className="flex w-full flex-col gap-1.5">
      <button
        type="button"
        onClick={handleSynchronize}
        disabled={
  !spotify.song ||
  !spotify.artist ||
  !isReady ||
  !video ||
  loading ||
  isSyncing
}
        className="
          flex h-8 w-full
          items-center justify-center
          rounded-lg bg-[#b5825f]
          text-[10px] font-medium
          text-[#120c07]
          transition-colors
          hover:bg-[#c18d68]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        {isSyncing ? (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{
      duration: 0.7,
      repeat: Infinity,
      ease: 'linear',
    }}
    className="
      mr-1 h-3 w-3 rounded-full
      border border-[#120c07]/30
      border-t-[#120c07]
    "
  />
) : (
  <UsersRound className="mr-1 h-3 w-3" />
)}

{isSyncing
  ? 'Sincronizando...'
  : 'Sincronizar'}
      </button>

      <button
        type="button"
        onClick={handleSearch}
        disabled={
  !spotify.song ||
  !spotify.artist ||
  loading ||
  !video ||
  isSyncing
}
        className="
          flex h-8 w-full
          items-center justify-center
          rounded-lg border border-[#291f18]
          bg-transparent
          text-[10px] font-medium
          text-[#ede3d6]
          transition-colors
          hover:bg-[#221812]/50
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <Search className="mr-1 h-3 w-3" />
        Buscar
      </button>
    </div>

    {loading && (
      <p className="mt-2 text-[10px] text-[#8d7d6e]">
        Procurando música...
      </p>
    )}

    {error && (
      <p className="mt-2 text-[10px] text-red-400">
        {error}
      </p>
    )}
  </div>
)}
    </div>
  </div>
</motion.div>
      )}
    </AnimatePresence>

    {!isOpen && (
  <motion.button
    key="music-player-minimized"
    type="button"
    aria-label="Abrir player de música"
    onClick={() => setIsOpen(true)}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    transition={{
      type: 'spring',
      stiffness: 350,
      damping: 22,
    }}
    className="
      fixed bottom-6 right-6 z-[9999]
      flex h-11 w-11
      items-center justify-center
      rounded-xl bg-[#b5825f]
      text-[#120c07]
      shadow-lg
      cursor-pointer
      max-md:bottom-24
      max-md:right-4
    "
  >
    {showActiveMinimized ? (
      <>
        {/* Bolinha verde */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute -right-0.5 -top-0.5
            h-3 w-3 rounded-full
            border-2 border-[#080503]
            bg-emerald-500
          "
        />

        {/* Equalizador */}
        <div className="flex h-3 items-end gap-0.5">
          {[0, 1, 2, 3].map((bar) => (
            <motion.span
              key={bar}
              animate={{
                height: [3, 8, 5, 10, 3],
              }}
              transition={{
                duration: 0.8,
                delay: bar * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="
                w-0.5 rounded-full
                bg-[#120c07]
              "
            />
          ))}
        </div>
      </>
    ) : (
      <Music className="h-5 w-5" />
    )}
  </motion.button>
)}
  </>
)
}