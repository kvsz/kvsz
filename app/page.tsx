  'use client'
  import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'
  import { motion, AnimatePresence, useAnimation } from 'framer-motion'
  import AnimatedBackground from './AnimatedBackground'
  import { useSpotify } from '@/hooks/useSpotify'
  import MusicTab from './components/MusicTab'
  import SyncedMusicPlayer from './components/SyncedMusicPlayer'
  import { Toaster } from 'sonner'
  import MoviesTab from './components/MoviesTab'
  import { inter } from '@/app/fonts'
  import {
    User, Info, Gamepad, Users, Calendar, Music,
    MessageCircle, Disc, Headphones, Instagram, Film, LockKeyhole, ChevronLeft, ChevronRight, Handbag, UserRoundCheck, Lock, ExternalLink, TriangleAlert
  } from 'lucide-react'

  type SpotifyData = {
    song: string
    artist: string
    album_art_url: string
    timestamps?: { start: number; end: number}
  }

  type LanyardData = {
    discord_user: {
      id: string
      username: string
      avatar: string
      global_name: string

      avatar_decoration_data?: {
        asset: string
        sku_id?: string
      }
    }

    discord_status: 'online' | 'idle' | 'dnd' | 'offline'
    activities: Array<{
      name: string
      type: number
      state?: string
      details?: string
    }>
    listening_to_spotify: boolean
    spotify?: SpotifyData
  }

  import { ReactNode } from 'react'

type InstagramData = {
  username: string
  avatar: string
  posts: number
  followers: number
  following: number
  bio: ReactNode
}

  type RobloxFriend = {
  id: number
  name: string
  displayName: string
  avatar?: string
}

type RobloxGroup = {
  id: number
  name: string
  memberCount?: number
  role: string
  icon?: string
}

type RobloxWearingItem = {
  id: number
  name: string
  image?: string
}

type RobloxData = {
  id: number
  name: string
  displayName: string
  description: string
  created: string
  avatar?: string
  friends: number
  followers: number
  following: number
  wearing: RobloxWearingItem[]
  friendsList: RobloxFriend[]
  totalFriendPages: number
  groups: RobloxGroup[]
  
}

  const SpotifyIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-music2"
      style={{ color: 'lab(66.9756 -58.27 19.5419)' }}
    >
      <circle cx="8" cy="18" r="4"></circle>
      <path d="M12 18V2l7 4"></path>
    </svg>
  )

  const LazerIcon = ({ size = 16, className = "", ...props }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`lucide lucide-hand-metal ${className}`}
      {...props}
    >
      <path d="M18 12.5V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4"></path>
      <path d="M14 11V9a2 2 0 1 0-4 0v2"></path>
      <path d="M10 10.5V5a2 2 0 1 0-4 0v9"></path>
      <path d="m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5"></path>
    </svg>
  )

  // EQS 
  function Equalizer({ isPlaying }: { isPlaying: boolean }) {
    if (!isPlaying) return null

    return (
      <>
        <style jsx>{`
          @keyframes eq-bounce {
            0%, 100% { height: 3px; }
            50% { height: 9px; }
          }
          .eq-bar {
            animation: eq-bounce 0.55s ease-in-out infinite;
          }
          .eq-bar-2 {
            animation-delay: 0.18s;
          }
          .eq-bar-3 {
            animation-delay: 0.36s;
          }
        `}</style>
        <div className="absolute bottom-1 right-1 flex items-end gap-0.5">
          <div className="w-0.5 bg-emerald-500 rounded-full eq-bar" />
          <div className="w-0.5 bg-emerald-500 rounded-full eq-bar eq-bar-2" />
          <div className="w-0.5 bg-emerald-500 rounded-full eq-bar eq-bar-3" />
        </div>
      </>
    )
  }

  function InstagramModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [loading, setLoading] = useState(true)

    const igData: InstagramData = {
  username: '21scy',
  avatar: 'https://i.pinimg.com/736x/72/b5/50/72b550d2616825119ebf7ed7ee46ac63.jpg',
  posts: 0,
  followers: 21,
  following: 30,
  bio: (
  <>
    nothing less,
    {'\n'}
    nothing more{' '}
    <a
      href="https://www.instagram.com/iisgfs/"
      target="_blank"
      rel="noopener noreferrer"
      className="
  font-medium
  text-[#b5825f]
  transition-colors
  hover:text-[#b5825f]/80
  hover:underline
"
    >
      
    </a>

  </>
),
}

    useEffect(() => {
      if (!open) return
      setLoading(true)
      const timer = setTimeout(() => {
        setLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }, [open])

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={onClose}
              className="fixed inset-0 z-[60] bg-black/50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[510px]"
            >
              <div className="relative bg-[#120c07] rounded-xl border border-[#291f18] overflow-hidden shadow-lg w-">
                <div className="p-6 h-full">
                  {loading? (
                    <>
                      <div className="flex items-start gap-4 mb-5">
                        
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#221812] ring-2 ring-offset-2 ring-offset-[#120c07] ring-[#291f18] animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="h-5 w-32 rounded bg-[#221812] animate-pulse" />
                          <div className="h-4 w-24 rounded bg-[#221812] animate-pulse" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-around py-4 mb-4 bg-[#221812]/30 rounded-lg border border-[#291f18]/50">
                        {[1,2,3].map(i => (
                          <div key={i} className="text-center space-y-1">
                            <div className="h-5 w-8 mx-auto rounded bg-[#221812] animate-pulse" />
                            <div className="h-3 w-16 rounded bg-[#221812] animate-pulse" />
                            
                          </div>
                          
                        ))}
                      </div>
                      <div className="h-10 w-full rounded-md bg-[#221812] animate-pulse" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-4 mb-5">
  <div className="relative flex-shrink-0">
    <div className="w-16 h-16 rounded-full overflow-hidden bg-[#221812] ring-2 ring-offset-2 ring-offset-[#120c07] ring-[#291f18]">
      <img
        alt={igData.username}
        loading="lazy"
        width="64"
        height="64"
        decoding="async"
        className="object-cover w-full h-full"
        src={igData.avatar}
      />
    </div>

    {/* Conta privada */}
    <div
  className="
    absolute -bottom-1 -right-1
    flex h-5 w-5 items-center justify-center
    rounded-full border-2
  "
  style={{
    backgroundColor: '#221812',
    borderColor: '#120c07',
    color: '#7d6d5f',
  }}
>
  <Lock
    className="h-3 w-3"
    strokeWidth={2}
  />
</div>
  </div>

  <div className="flex-1 min-w-0">
    <h2 className="text-lg font-bold text-[#ede3d6] mb-0.5">
      {igData.username}
    </h2>

    <p className="text-sm text-[#8d7d6e] font-mono">
      @{igData.username}
    </p>
  </div>
</div>

<div className="flex items-center justify-around py-4 mb-4 bg-[#221812]/30 rounded-lg border border-[#291f18]/50">
  <div className="text-center">
    <div className="text-lg font-bold text-[#ede3d6]">
      {igData.posts}
    </div>
    <div className="text-xs text-[#8d7d6e]">Posts</div>
  </div>

  <div className="w-px h-10 bg-[#291f18]" />

  <div className="text-center">
    <div className="text-lg font-bold text-[#ede3d6]">
      {igData.followers}
    </div>
    <div className="text-xs text-[#8d7d6e]">Seguidores</div>
  </div>

  <div className="w-px h-10 bg-[#291f18]" />

  <div className="text-center">
    <div className="text-lg font-bold text-[#ede3d6]">
      {igData.following}
    </div>
    <div className="text-xs text-[#8d7d6e]">Seguindo</div>
  </div>
</div>

{/* BIO */}
<div className="mb-4 border-l-2 border-[#b5825f]/50 pl-3">
  <p className="whitespace-pre-line text-sm leading-relaxed text-[#ede3d6]/80">
    {igData.bio}
  </p>
</div>

{/* WEBSITE (opcional) */}
<a
  href="https://21scy.pw"
  target="_blank"
  rel="noopener noreferrer"
  className="
    group mb-4 inline-flex items-center gap-2
    text-sm font-medium
    text-[#b5825f]
    transition-colors duration-200
    hover:opacity-80
    
  "
>
  <ExternalLink
    className="
      h-4 w-4
      transition-transform
      group-hover:-translate-y-0.5
      group-hover:translate-x-0.5
    "
  />

  <span>21scy.pw</span>
</a>

<a
  href={`https://www.instagram.com/${igData.username}`}
  target="_blank"
  rel="noopener noreferrer"
  className="
    inline-flex items-center justify-center gap-2
    whitespace-nowrap text-sm font-medium
    transition-all
    border border-[#1c1410]
    bg-[#140e09]
    shadow-xs
    hover:bg-[#17100b]
    hover:text-[#ede3d6]
    h-10 rounded-md px-6 w-full
    text-[#8d7d6e]
  "
>
  <Instagram className="w-4 h-4" />
  Abrir Perfil
</a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  function formatMemberCount(count?: number) {
  const value = count || 0

  if (value < 1000) {
    return `${value} Members`
  }

  if (value < 1_000_000) {
    const formatted =
      value >= 10_000
        ? Math.floor(value / 1000).toString()
        : (value / 1000).toFixed(1).replace('.0', '')

    return `${formatted}K+ Members`
  }

  const formatted =
    value >= 10_000_000
      ? Math.floor(value / 1_000_000).toString()
      : (value / 1_000_000).toFixed(1).replace('.0', '')

  return `${formatted}M+ Members`
}

  function RobloxModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const ROBLOX_ID = '1075117505'

const [loading, setLoading] = useState(true)
const [data, setData] = useState<RobloxData | null>(null)

const [error, setError] = useState(false)
const [retryCount, setRetryCount] = useState(0)

const [friendsPage, setFriendsPage] = useState(0)

const [wearingPage, setWearingPage] = useState(0)
const [communitiesPage, setCommunitiesPage] = useState(0)

const [friendsPages, setFriendsPages] = useState<
  Record<number, RobloxFriend[]>
>({})

const [friendsLoading, setFriendsLoading] = useState(false)

/*
 * Carregamento inicial do modal.
 * Carrega o perfil, as comunidades e somente os 14 primeiros amigos.
 */
useEffect(() => {
  if (!open) return

  setFriendsPage(0)
  setWearingPage(0)
setCommunitiesPage(0)
  setFriendsPages({})
  setFriendsLoading(false)
  setData(null)
  setError(false)

  const fetchRobloxData = async () => {
    setLoading(true)

    

    try {
      const response = await fetch(
        `/api/roblox?userId=${ROBLOX_ID}&page=0`,
      )

      if (!response.ok) {
        throw new Error(
          'Não foi possível carregar o perfil do Roblox',
        )
      }

      const json: RobloxData = await response.json()

      setData(json)
      setError(false)

      // Salva a primeira página no cache.
      setFriendsPages({
        0: json.friendsList,
      })
    } catch (error) {
  console.error('Erro ao carregar Roblox:', error)
  setData(null)
  setError(true)
    } finally {
      setLoading(false)
    }
  }

  fetchRobloxData()
}, [open, retryCount])

const createdAt = data?.created
  ? new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
      .format(new Date(data.created))
      
  : '---'

const totalFriendPages = data?.totalFriendPages || 1

const visibleFriends = friendsPages[friendsPage] || []

const WEARING_PER_PAGE = 14
const COMMUNITIES_PER_PAGE = 4

const totalWearingPages = Math.max(
  1,
  Math.ceil((data?.wearing.length || 0) / WEARING_PER_PAGE),
)

const totalCommunityPages = Math.max(
  1,
  Math.ceil((data?.groups.length || 0) / COMMUNITIES_PER_PAGE),
)

const visibleWearingItems =
  data?.wearing.slice(
    wearingPage * WEARING_PER_PAGE,
    wearingPage * WEARING_PER_PAGE + WEARING_PER_PAGE,
  ) || []

const visibleCommunities =
  data?.groups.slice(
    communitiesPage * COMMUNITIES_PER_PAGE,
    communitiesPage * COMMUNITIES_PER_PAGE +
      COMMUNITIES_PER_PAGE,
  ) || []

/*
 * Carrega uma página de amigos.
 *
 * Se ela já estiver no cache, somente troca de página.
 * Se ainda não estiver, busca os 14 amigos na API.
 */
const loadFriendsPage = useCallback(
  async (
    targetPage: number,
    background = false,
  ) => {
    if (
      targetPage < 0 ||
      targetPage >= totalFriendPages
    ) {
      return
    }

    /*
     * A página já foi carregada.
     * Não precisa fazer uma nova requisição.
     */
    if (friendsPages[targetPage]) {
      if (!background) {
        setFriendsPage(targetPage)
      }

      return
    }

    if (!background) {
      setFriendsLoading(true)
    }

    try {
      const response = await fetch(
        `/api/roblox?userId=${ROBLOX_ID}&friendsOnly=1&page=${targetPage}`,
      )

      if (!response.ok) {
        throw new Error(
          'Não foi possível carregar esta página de amigos',
        )
      }

      const json: {
        page: number
        friendsList: RobloxFriend[]
        totalFriendPages: number
      } = await response.json()

      /*
       * Salva a nova página sem apagar as páginas anteriores.
       */
      setFriendsPages((currentPages) => ({
        ...currentPages,
        [targetPage]: json.friendsList,
      }))

      /*
       * No pré-carregamento em segundo plano,
       * não mudamos a página visível.
       */
      if (!background) {
        setFriendsPage(targetPage)
      }
    } catch (error) {
      console.error(
        'Erro ao carregar amigos:',
        error,
      )
    } finally {
      if (!background) {
        setFriendsLoading(false)
      }
    }
  },
  [
    friendsPages,
    totalFriendPages,
  ],
)

/*
 * Pré-carrega invisivelmente a próxima página.
 *
 * Exemplo:
 * enquanto a página 1 está visível,
 * a página 2 é carregada depois de 350 ms.
 */
useEffect(() => {
  if (!open || !data) return

  const nextPage = friendsPage + 1

  if (nextPage >= totalFriendPages) return
  if (friendsPages[nextPage]) return

  const prefetchTimer = window.setTimeout(() => {
    loadFriendsPage(nextPage, true)
  }, 350)

  return () => {
    window.clearTimeout(prefetchTimer)
  }
}, [
  open,
  data,
  friendsPage,
  totalFriendPages,
  friendsPages,
  loadFriendsPage,
])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mesmo fundo/fade do modal do Instagram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50"
          />

          {/* Mesma animação de abertura e fechamento do Instagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="
              fixed left-1/2 top-1/2 z-[70]
              w-[min(1180px,94vw)] h-[min(720px,90vh)]
              -translate-x-1/2 -translate-y-1/2
            "
          >
            <div
              className="
                relative w-full h-full overflow-hidden
                rounded-2xl border border-[#291f18]
                bg-[#120c07] shadow-2xl
              "
            >
              <button
                onClick={onClose}
                aria-label="Fechar modal"
                className="
                  absolute left-4 top-4 z-50
                  flex h-8 w-8 items-center justify-center
                  rounded-full bg-[#0f0a06]/90
                  text-[#8d7d6e] transition-colors
                  hover:text-[#ede3d6]
                "
              >
                <span className="text-xl leading-none">×</span>
              </button>

              {loading ? (
                <div className="grid h-full grid-cols-[330px_1fr]">
                  <div className="border-r border-[#291f18] p-6">
                    <div className="h-72 rounded-xl bg-[#221812] animate-pulse" />
                    <div className="mt-6 h-8 w-40 rounded bg-[#221812] animate-pulse" />
                    <div className="mt-3 h-4 w-28 rounded bg-[#221812] animate-pulse" />
                  </div>

                  <div className="space-y-8 p-7">
                    <div className="h-8 w-48 rounded bg-[#221812] animate-pulse" />
                    <div className="grid grid-cols-5 gap-3">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div
                          key={item}
                          className="h-36 rounded-xl bg-[#221812] animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : data ? (
                <div className="grid h-full grid-cols-[330px_minmax(0,1fr)]">
                  {/* Coluna esquerda */}
                  <aside
  className="
    flex h-full flex-col
    overflow-hidden border-r border-[#291f18]
    p-6 pt-14
  "
>
                    <div className="relative flex-shrink-0">
  <div
    className="
      flex w-full aspect-square
      items-end justify-center
      overflow-hidden rounded-lg
      bg-gradient-to-br
      from-[#221812]/50 to-[#221812]
    "
  >
    <img
      src={data.avatar}
      alt={`Avatar de ${data.displayName}`}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="
        h-full w-full
        select-none object-contain
      "
    />
  </div>
</div>

                    <div className="mt-6 space-y-3">
  <div>
    <h2 className="text-2xl font-bold text-[#ede3d6]">
      {data.displayName}
    </h2>

    <p className="mt-1 text-xs text-[#8d7d6e]">
      @{data.name}
    </p>
  </div>

  {data.description && (
    <p
      className="
        line-clamp-2 text-sm
        leading-relaxed text-[#8d7d6e]
      "
    >
      {data.description}
    </p>
  )}

  <div className="flex items-center gap-1.5 text-xs text-[#8d7d6e]">
    <Calendar className="h-3 w-3" />
    <span>{createdAt}</span>
  </div>
</div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg border border-[#291f18]/50 bg-[#221812]/40 p-3 text-center">
                        <strong className="block text-xl text-[#ede3d6]">
                          {data.friends.toLocaleString('pt-BR')}
                        </strong>
                        <span className="text-xs text-[#8d7d6e]">
                          Amigos
                        </span>
                      </div>

                      <div className="rounded-lg border border-[#291f18]/50 bg-[#221812]/40 p-3 text-center">
                        <strong className="block text-xl text-[#ede3d6]">
                          {data.followers.toLocaleString('pt-BR')}
                        </strong>
                        <span className="text-xs text-[#8d7d6e]">
                          Seguidores
                        </span>
                      </div>

                      <div className="rounded-lg border border-[#291f18]/50 bg-[#221812]/40 p-3 text-center">
                        <strong className="block text-xl text-[#ede3d6]">
                          {data.following.toLocaleString('pt-BR')}
                        </strong>
                        <span className="text-xs text-[#8d7d6e]">
                          Seguindo
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://www.roblox.com/users/${data.id}/profile`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        mt-6 inline-flex h-11 items-center justify-center
                        rounded-xl bg-[#b5825f]
                        text-sm font-medium text-[#120c07]
                        transition-transform hover:scale-[1.02]
                      "
                    >
                      Ver perfil
                    </a>
                  </aside>

                  {/* Coluna direita */}
                  <section className="h-full overflow-y-auto p-7 modal-scrollbar">

                    <div className="mb-10">
  <div className="mb-5 flex items-center justify-between">
    <h3 className="flex items-center gap-2 text-xl font-black text-[#ede3d6]">
  <Handbag
    className="h-5 w-5 text-[#8d7d6e]"
    strokeWidth={2}
  />
  Vestindo Agora
</h3>

    <div className="flex items-center gap-2">
  <button
    type="button"
    onClick={() =>
      setWearingPage((current) =>
        Math.max(0, current - 1),
      )
    }
    disabled={wearingPage === 0}
    aria-label="Página anterior dos itens"
    className="
      flex h-8 w-8 items-center justify-center
      rounded-full border border-[#291f18]
      text-[#8d7d6e] transition-all
      hover:bg-[#1a110b]
      hover:text-[#ede3d6]
      disabled:pointer-events-none
      disabled:opacity-30
    "
  >
    <ChevronLeft
      size={16}
      strokeWidth={2.2}
    />
  </button>

  <span
    className="
      min-w-[30px] text-center
      text-xs font-medium text-[#8d7d6e]
    "
  >
    {wearingPage + 1}/{totalWearingPages}
  </span>

  <button
    type="button"
    onClick={() =>
      setWearingPage((current) =>
        Math.min(
          totalWearingPages - 1,
          current + 1,
        ),
      )
    }
    disabled={
      wearingPage >= totalWearingPages - 1
    }
    aria-label="Próxima página dos itens"
    className="
      flex h-8 w-8 items-center justify-center
      rounded-full border border-[#291f18]
      text-[#8d7d6e] transition-all
      hover:bg-[#1a110b]
      hover:text-[#ede3d6]
      disabled:pointer-events-none
      disabled:opacity-30
    "
  >
    <ChevronRight
      size={16}
      strokeWidth={2.2}
    />
  </button>
</div>
  </div>

  <div className="relative min-h-[290px]">
  <AnimatePresence mode="wait">
    <motion.div
      key={wearingPage}
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      transition={{
        duration: 0.18,
      }}
      className="grid grid-cols-6 gap-3"
    >
      {visibleWearingItems.map((item) => (
        <a
  key={item.id}
  href={`https://www.roblox.com/catalog/${item.id}`}
  target="_blank"
  rel="noopener noreferrer"
  className="
    group relative rounded-lg
    border border-[#291f18]/70
    bg-[#221812]/40 p-3
    transition-all duration-200
    hover:border-[#b5825f]/50
  "
>
  <div
    className="
      relative mb-2 aspect-square
      overflow-hidden rounded-md
      bg-[#221812]/70
    "
  >
    {item.image ? (
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="
          absolute inset-0
          h-full w-full
          select-none object-cover
        "
      />
    ) : (
      <div className="h-full w-full animate-pulse bg-[#221812]" />
    )}
  </div>

  <p
    title={item.name}
    className="
      truncate text-center text-xs
      font-medium text-[#8d7d6e]
      transition-colors duration-200
      group-hover:text-[#ede3d6]
    "
  >
    {item.name}
  </p>
</a>
      ))}
    </motion.div>
  </AnimatePresence>
</div>
</div>
                    <div>
                      <div className="mb-5 flex items-center justify-between">
  <h3 className="flex items-center gap-2 text-xl font-black text-[#ede3d6]">
  <UserRoundCheck
    className="h-5 w-5 text-[#8d7d6e]"
    strokeWidth={2}
  />
  Amigos
</h3>

  <div className="flex items-center gap-2">
  <button
    type="button"
    onClick={() =>
      loadFriendsPage(friendsPage - 1)
    }
    disabled={
      friendsPage === 0 ||
      friendsLoading
    }
    aria-label="Página anterior"
    className="
      flex h-8 w-8 items-center justify-center
      rounded-full border border-[#291f18]
      text-[#8d7d6e]
      transition-all
      hover:bg-[#1a110b]
      hover:text-[#ede3d6]
      disabled:pointer-events-none
      disabled:opacity-30
    "
  >
    <ChevronLeft
      size={16}
      strokeWidth={2.2}
    />
  </button>

  <span
    className="
      min-w-[30px] text-center
      text-xs font-medium text-[#8d7d6e]
    "
  >
    {friendsPage + 1}/{totalFriendPages}
  </span>

  <button
    type="button"
    onClick={() =>
      loadFriendsPage(friendsPage + 1)
    }
    disabled={
      friendsPage >= totalFriendPages - 1 ||
      friendsLoading
    }
    aria-label="Próxima página"
    className="
      flex h-8 w-8 items-center justify-center
      rounded-full border border-[#291f18]
      text-[#8d7d6e]
      transition-all
      hover:bg-[#1a110b]
      hover:text-[#ede3d6]
      disabled:pointer-events-none
      disabled:opacity-30
    "
  >
    <ChevronRight
      size={16}
      strokeWidth={2.2}
    />
  </button>
</div>
</div>

<div className="relative min-h-[214px]">
  <AnimatePresence mode="wait">
    <motion.div
      key={friendsPage}
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: friendsLoading ? 0.35 : 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      transition={{
        duration: 0.18,
      }}
      className="
  grid grid-cols-[repeat(8,80px)]
  gap-x-5 gap-y-5
"
    >
      {visibleFriends.map((friend) => (
        <a
          key={friend.id}
          href={`https://www.roblox.com/users/${friend.id}/profile`}
          target="_blank"
          rel="noopener noreferrer"
          className="group min-w-0 text-center"
        >
          <div
            className="
              mx-auto h-20 w-20 overflow-hidden
              rounded-full
              border border-[#35271e]
              bg-[#1a110b]
              transition-transform
              group-hover:scale-105
            "
          >
            {friend.avatar ? (
              <img
                src={friend.avatar}
                alt={friend.displayName}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="
                  h-full w-full
                  animate-pulse bg-[#221812]
                "
              />
            )}
          </div>

          <p
  title={friend.displayName || friend.name}
  className="
    mt-2 block w-20 truncate text-center
    text-xs font-medium leading-4 text-[#ede3d6]
  "
>
  {friend.displayName || friend.name}
</p>
        </a>
      ))}
    </motion.div>
  </AnimatePresence>

  {friendsLoading && (
    <div
      className="
        absolute inset-0
        flex items-center justify-center
      "
    >
      <div
        className="
          h-7 w-7 animate-spin rounded-full
          border-2 border-[#291f18]
          border-t-[#b5825f]
        "
      />
    </div>
  )}
</div>
                    </div>

                    <div className="mt-10">
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-xl font-black text-[#ede3d6]">
  <Users
    className="h-5 w-5 text-[#8d7d6e]"
    strokeWidth={2}
  />
  Comunidades
</h3>

                        <div className="flex items-center gap-2">
  <button
    type="button"
    onClick={() =>
      setCommunitiesPage((current) =>
        Math.max(0, current - 1),
      )
    }
    disabled={communitiesPage === 0}
    aria-label="Página anterior das comunidades"
    className="
      flex h-8 w-8 items-center justify-center
      rounded-full border border-[#291f18]
      text-[#8d7d6e] transition-all
      hover:bg-[#1a110b]
      hover:text-[#ede3d6]
      disabled:pointer-events-none
      disabled:opacity-30
    "
  >
    <ChevronLeft
      size={16}
      strokeWidth={2.2}
    />
  </button>

  <span
    className="
      min-w-[30px] text-center
      text-xs font-medium text-[#8d7d6e]
    "
  >
    {communitiesPage + 1}/{totalCommunityPages}
  </span>

  <button
    type="button"
    onClick={() =>
      setCommunitiesPage((current) =>
        Math.min(
          totalCommunityPages - 1,
          current + 1,
        ),
      )
    }
    disabled={
      communitiesPage >= totalCommunityPages - 1
    }
    aria-label="Próxima página das comunidades"
    className="
      flex h-8 w-8 items-center justify-center
      rounded-full border border-[#291f18]
      text-[#8d7d6e] transition-all
      hover:bg-[#1a110b]
      hover:text-[#ede3d6]
      disabled:pointer-events-none
      disabled:opacity-30
    "
  >
    <ChevronRight
      size={16}
      strokeWidth={2.2}
    />
  </button>
</div>
                      </div>

                      <div className="grid grid-cols-[repeat(4,184px)] gap-4">
                        {visibleCommunities.map((group) => (
                          <a
                            key={group.id}
                            href={`https://www.roblox.com/communities/${group.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              group overflow-hidden rounded-xl
                              border border-[#291f18] bg-[#1a110b]
                              transition-all hover:-translate-y-1
                              hover:border-[#b5825f]/50
                            "
                          >
                            <div className="h-[168px] overflow-hidden bg-[#221812]">
                              {group.icon ? (
                                <img
                                  src={group.icon}
                                  alt={group.name}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Users className="h-8 w-8 text-[#574b40]" />
                                </div>
                              )}
                            </div>

                            <div className="p-3">
                              <p className="truncate text-sm font-bold text-[#ede3d6]">
                                {group.name}
                              </p>

                              <p className="mt-1 truncate text-xs text-[#8d7d6e]">
  {formatMemberCount(group.memberCount)}
</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              ) : error ? (
  <div
    className="
      flex h-full flex-col
      items-center justify-center
      px-6 text-center
    "
  >
    {/* Ícone de erro */}
    <div
      className="
        mb-5 flex h-14 w-14
        items-center justify-center
        rounded-full
        bg-red-500/10
      "
    >
      <TriangleAlert
        className="h-7 w-7 text-red-500"
        strokeWidth={2}
      />
    </div>

    {/* Título */}
    <h2
      className="
        text-lg font-bold
        text-[#ede3d6]
      "
    >
      Erro ao carregar perfil
    </h2>

    {/* Descrição */}
    <p
      className="
        mt-2 max-w-[430px]
        text-sm leading-relaxed
        text-[#8d7d6e]
      "
    >
      Não foi possível conectar à API do Roblox. Verifique sua
      conexão ou tente novamente mais tarde.
    </p>

    {/* Botão */}
    <button
      type="button"
      onClick={() => setRetryCount((current) => current + 1)}
      className="
        mt-5 inline-flex h-10
        items-center justify-center
        rounded-lg
        bg-[#b5825f]
        px-5 text-sm font-medium
        text-[#120c07]
        transition-all duration-200
        hover:bg-[#c28e69]
        active:scale-[0.97]
      "
    >
      Tentar novamente
    </button>
  </div>
) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

  function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const NITRO_SINCE = new Date(2026, 2, 28, 4, 44, 0)

type NitroLevel = {
  name: string
  image: string
  unlockDays: number
}

const NITRO_LEVELS: NitroLevel[] = [
  {
    name: 'Bronze',
    image: 'https://ik.imagekit.io/xys3wb0qo/badges/bronze.png',
    unlockDays: 0,
  },
  {
    name: 'Prata',
    image: 'https://ik.imagekit.io/xys3wb0qo/badges/silver.png',
    unlockDays: 0,
  },
  {
    name: 'Ouro',
    image: 'https://ik.imagekit.io/xys3wb0qo/badges/gold.png',
    unlockDays: 365,
  },
  {
    name: 'Platina',
    image: 'https://ik.imagekit.io/xys3wb0qo/badges/platinum.png',
    unlockDays: 730,
  },
  {
    name: 'Diamante',
    image: 'https://ik.imagekit.io/xys3wb0qo/badges/diamond.png',
    unlockDays: 1095,
  },
  {
    name: 'Esmeralda',
    image: 'https://ik.imagekit.io/xys3wb0qo/badges/emerald.png',
    unlockDays: 1460,
  },
  {
    name: 'Rubi',
    image: 'https://ik.imagekit.io/xys3wb0qo/badges/ruby.png',
    unlockDays: 1825,
  },
  {
    name: 'Opala',
    image: 'https://ik.imagekit.io/xys3wb0qo/badges/opal.png',
    unlockDays: 2190,
  },
]

const DAY_IN_MS = 1000 * 60 * 60 * 24

function getNitroElapsedDays(now = new Date()) {
  return Math.max(
    0,
    Math.floor(
      (now.getTime() - NITRO_SINCE.getTime()) /
        DAY_IN_MS,
    ),
  )
}

function getNitroLevel(now = new Date()) {
  const elapsedDays = getNitroElapsedDays(now)

  let currentIndex = 0

  NITRO_LEVELS.forEach((level, index) => {
    if (elapsedDays >= level.unlockDays) {
      currentIndex = index
    }
  })

  const current = NITRO_LEVELS[currentIndex]
  const next = NITRO_LEVELS[currentIndex + 1] || null

  const currentStart = current.unlockDays
  const nextStart = next?.unlockDays ?? currentStart

  const levelDuration = Math.max(
    1,
    nextStart - currentStart,
  )

  const daysInCurrentLevel = Math.max(
    0,
    elapsedDays - currentStart,
  )

  const levelProgress = next
    ? Math.min(
        100,
        Math.max(
          0,
          (daysInCurrentLevel / levelDuration) * 100,
        ),
      )
    : 100

  const daysRemaining = next
    ? Math.max(0, nextStart - elapsedDays)
    : 0

  const totalProgress =
    ((currentIndex + 1) / NITRO_LEVELS.length) * 100

  return {
    current,
    next,
    currentIndex,
    elapsedDays,
    levelProgress,
    daysRemaining,
    totalProgress,
  }
}

function formatNitroStartDate() {
  const date = NITRO_SINCE.toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )

  const time = NITRO_SINCE.toLocaleTimeString(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )

  return `${date} às ${time}`
}

function getDetailedElapsedTime(
  start: Date,
  end = new Date(),
) {
  if (end.getTime() < start.getTime()) {
    return 'ainda não iniciado'
  }

  let cursor = new Date(start)

  let years = 0
  let months = 0
  let days = 0

  while (true) {
    const next = new Date(cursor)
    next.setFullYear(next.getFullYear() + 1)

    if (next <= end) {
      cursor = next
      years++
    } else {
      break
    }
  }

  while (true) {
    const next = new Date(cursor)
    next.setMonth(next.getMonth() + 1)

    if (next <= end) {
      cursor = next
      months++
    } else {
      break
    }
  }

  while (true) {
    const next = new Date(cursor)
    next.setDate(next.getDate() + 1)

    if (next <= end) {
      cursor = next
      days++
    } else {
      break
    }
  }

  const remainingMs =
    end.getTime() - cursor.getTime()

  const hours = Math.floor(
    remainingMs / (1000 * 60 * 60),
  )

  const minutes = Math.floor(
    (remainingMs % (1000 * 60 * 60)) /
      (1000 * 60),
  )

  const parts: string[] = []

  if (years) {
    parts.push(
      `${years} ${years === 1 ? 'ano' : 'anos'}`,
    )
  }

  if (months) {
    parts.push(
      `${months} ${months === 1 ? 'mês' : 'meses'}`,
    )
  }

  if (days) {
    parts.push(
      `${days} ${days === 1 ? 'dia' : 'dias'}`,
    )
  }

  parts.push(
    `${hours} ${hours === 1 ? 'hora' : 'horas'}`,
  )

  parts.push(
    `${minutes} ${
      minutes === 1 ? 'minuto' : 'minutos'
    }`,
  )

  return parts.join(', ')
}

function NitroModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const nitro = getNitroLevel()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/60"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 15,
            }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
            className="
              fixed left-1/2 top-1/2 z-[90]
              w-[min(540px,94vw)]
              -translate-x-1/2
              -translate-y-1/2
            "
          >
            <div
              className="
                relative max-h-[90vh] overflow-y-auto
                rounded-xl border border-[#291f18]
                bg-[#120c07]/95 p-6
                shadow-2xl backdrop-blur-2xl
                modal-scrollbar
              "
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar progresso Nitro"
                className="
                  absolute right-4 top-4 z-20
                  flex h-8 w-8 items-center
                  justify-center rounded-full
                  bg-[#221812]/70
                  text-xl text-[#8d7d6e]
                  transition-colors
                  hover:text-[#ede3d6]
                "
              >
                ×
              </button>

              <div className="mb-6 text-center">
                <h3
                  className="
                    mb-1 text-2xl font-black
                    text-[#ede3d6]
                  "
                >
                  ✨ Nitro Progress
                </h3>

                <p className="text-sm text-[#8d7d6e]">
                  {nitro.currentIndex + 1} de{' '}
                  {NITRO_LEVELS.length} níveis
                  desbloqueados
                </p>

                <p className="mt-1 text-xs text-[#574b40]">
                  Assinante desde{' '}
                  {formatNitroStartDate()}
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                {/* Nível atual */}
                <motion.div
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{ delay: 0.08 }}
                  className="
                    relative rounded-2xl border-2
                    border-[#b5825f]/40
                    bg-gradient-to-br
                    from-[#b5825f]/20
                    to-[#b5825f]/5
                    p-4
                  "
                >
                  <span
                    className="
                      absolute right-2 top-2
                      rounded-full bg-[#b5825f]
                      px-2 py-0 text-[10px]
                      font-bold text-[#120c07]
                    "
                  >
                    ATUAL
                  </span>

                  <div
                    className="
                      flex flex-col items-center
                      gap-3 pt-4
                    "
                  >
                    <div className="relative">
                      <motion.img
                        src={nitro.current.image}
                        alt={nitro.current.name}
                        width={80}
                        height={80}
                        animate={{
                          rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                        className="
                          relative z-10 h-20 w-20
                          object-contain drop-shadow-xl
                        "
                      />

                      <motion.div
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="
                          absolute -inset-2 -z-0
                          rounded-full bg-[#b5825f]/20
                          blur-xl
                        "
                      />
                    </div>

                    <div className="text-center">
                      <p
                        className="
                          text-lg font-bold
                          text-[#ede3d6]
                        "
                      >
                        {nitro.current.name}
                      </p>

                      <p className="text-xs text-[#8d7d6e]">
                        Nível {nitro.currentIndex + 1}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Próximo nível */}
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{ delay: 0.12 }}
                  className="
                    relative rounded-2xl
                    border-2 border-dashed
                    border-[#291f18]
                    bg-[#221812]/50 p-4
                  "
                >
                  <span
                    className="
                      absolute right-2 top-2
                      rounded-full border
                      border-[#291f18]
                      bg-[#221812]
                      px-2 py-0 text-[10px]
                      font-bold text-[#ede3d6]
                    "
                  >
                    PRÓXIMO
                  </span>

                  <div
                    className="
                      flex flex-col items-center
                      gap-3 pt-4
                    "
                  >
                    {nitro.next ? (
                      <>
                        <img
                          src={nitro.next.image}
                          alt={nitro.next.name}
                          width={80}
                          height={80}
                          className="
                            h-20 w-20 object-contain
                            opacity-80
                          "
                        />

                        <div className="text-center">
                          <p
                            className="
                              text-lg font-bold
                              text-[#ede3d6]
                            "
                          >
                            {nitro.next.name}
                          </p>

                          <p className="text-xs text-[#8d7d6e]">
                            Nível{' '}
                            {nitro.currentIndex + 2}
                          </p>
                        </div>

                        <div
                          className="
                            mt-1 w-full border-t
                            border-[#291f18] pt-3
                          "
                        >
                          <div className="mb-2 text-center">
                            <strong
                              className="
                                text-2xl font-black
                                text-[#b5825f]
                              "
                            >
                              {nitro.daysRemaining}
                            </strong>

                            <span className="ml-1 text-xs text-[#8d7d6e]">
                              dias
                            </span>
                          </div>

                          <div
                            className="
                              h-1.5 overflow-hidden
                              rounded-full bg-[#221812]
                            "
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${nitro.levelProgress}%`,
                              }}
                              transition={{
                                duration: 1.5,
                                ease: 'easeOut',
                              }}
                              className="
                                h-full rounded-full
                                bg-[#b5825f]
                              "
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div
                        className="
                          flex h-full flex-col
                          items-center justify-center
                          text-center
                        "
                      >
                        <p className="font-bold text-[#ede3d6]">
                          Nível máximo
                        </p>

                        <p className="mt-1 text-xs text-[#8d7d6e]">
                          Todos os níveis foram
                          desbloqueados.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Progresso total */}
              <div className="mb-6">
                <div
                  className="
                    mb-2 flex items-center
                    justify-between text-sm
                  "
                >
                  <span className="font-medium text-[#8d7d6e]">
                    Progresso Total
                  </span>

                  <span
                    className="
                      text-lg font-black
                      text-[#b5825f]
                    "
                  >
                    {Math.round(nitro.totalProgress)}%
                  </span>
                </div>

                <div
                  className="
                    relative h-3 overflow-hidden
                    rounded-full bg-[#221812]
                  "
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${nitro.totalProgress}%`,
                    }}
                    transition={{
                      duration: 2,
                      ease: 'easeOut',
                    }}
                    className="
                      absolute inset-y-0 left-0
                      rounded-full
                      bg-gradient-to-r
                      from-[#9d6b4b]
                      via-[#b5825f]
                      to-[#c99a78]
                    "
                  />
                </div>
              </div>

              {/* Todos os níveis */}
              <div
                className="
                  rounded-xl border
                  border-[#291f18]/50
                  bg-[#221812]/30 p-4
                "
              >
                <p
                  className="
                    mb-3 text-xs font-medium
                    text-[#8d7d6e]
                  "
                >
                  Todos os Níveis
                </p>

                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {NITRO_LEVELS.map(
                    (level, index) => {
                      const isUnlocked =
                        index <= nitro.currentIndex

                      const isCurrent =
                        index === nitro.currentIndex

                      return (
                        <motion.div
                          key={level.name}
                          initial={{
                            opacity: 0,
                            scale: 0,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          transition={{
                            delay: index * 0.05,
                            type: 'spring',
                          }}
                          className="group relative"
                        >
                          <div
                            className={`
                              relative aspect-square
                              rounded-lg border-2 p-1.5
                              transition-all
                              ${
                                isCurrent
                                  ? `
                                    border-[#b5825f]
                                    bg-[#b5825f]/20
                                    shadow-lg
                                    shadow-[#b5825f]/20
                                  `
                                  : isUnlocked
                                    ? `
                                      border-emerald-500/50
                                      bg-emerald-500/10
                                    `
                                    : `
                                      border-[#291f18]/30
                                      bg-[#120c07]/50
                                    `
                              }
                            `}
                          >
                            <img
                              src={level.image}
                              alt={level.name}
                              className={`
                                h-full w-full
                                object-contain
                                ${
                                  isUnlocked
                                    ? ''
                                    : 'opacity-30 blur-[1px]'
                                }
                              `}
                            />

                            {isCurrent && (
                              <motion.div
                                animate={{
                                  scale: [1, 1.3, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                                className="
                                  absolute -right-1 -top-1
                                  h-3 w-3 rounded-full
                                  border-2 border-[#120c07]
                                  bg-[#b5825f]
                                "
                              />
                            )}

                            {isUnlocked && !isCurrent && (
                              <div
                                className="
                                  absolute -right-1 -top-1
                                  h-3 w-3 rounded-full
                                  border-2 border-[#120c07]
                                  bg-emerald-500
                                "
                              />
                            )}
                          </div>

                          <div
                            className="
                              pointer-events-none
                              absolute -top-9 left-1/2
                              z-20 -translate-x-1/2
                              whitespace-nowrap rounded-lg
                              border border-[#291f18]
                              bg-[#120c07] px-2 py-1
                              text-[10px] font-medium
                              text-[#ede3d6] opacity-0
                              shadow-xl transition-opacity
                              group-hover:opacity-100
                            "
                          >
                            {level.name}
                          </div>
                        </motion.div>
                      )
                    },
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

  function HomeContent({
  cardRef,
  handleMouseMove,
  handleMouseLeave,
  isHovering,
  rotate,
  discordData,
  avatarUrl,
  avatarDecoration,
  getStatusColor,
  setIgModalOpen,
  setRobloxModalOpen,
}: any) {
    const spotify = useSpotify() // <- USA O HOOK AGORA
    const [profileModalOpen, setProfileModalOpen] = useState(false)

    const [nitroModalOpen, setNitroModalOpen] =
  useState(false)

const [nitroTooltipOpen, setNitroTooltipOpen] =
  useState(false)
    
    const isPlaying = spotify.isPlaying
    const [currentProgress, setCurrentProgress] = useState(0)
    
    useEffect(() => {
      if (!isPlaying || !spotify.timestampStart) {
        setCurrentProgress(0)
        return
      }
      
      const { timestampStart, timestampEnd } = spotify
      setCurrentProgress(Date.now() - timestampStart)
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - timestampStart
        const duration = spotify.duration || 0
        setCurrentProgress(Math.min(elapsed, duration))
      }, 1000)
      
      return () => clearInterval(interval)
    }, [spotify.song, spotify.timestampStart, isPlaying])
    
    const duration = spotify.duration || 0
    const progressPercent = duration ? (currentProgress / duration) * 100 : 0
    
    return (
      <div className="flex flex-col items-center">
        
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-2xl sm:text-4xl md:text- font-bold text-foreground mb-4 md:mb-13 text-balance text-center"
          style={{
            fontFamily: '"Inter", "Inter Fallback", sans-serif',
            fontSize: '48px',
            fontWeight: 700,
            WebkitFontSmoothing: 'antialiased',
            lineHeight: '48px',
            transform: 'translateY(1px)',
            color: '#ede3d6'
          }}
        >
          07, can you do somethin' for me?
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto px-4"
          style={{ perspective: 2000 }}
        >
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
              rotateX: isHovering ? rotate.x : 0,
              rotateY: isHovering ? rotate.y : 0,
              scale: isHovering ? 1.05 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 21
            }}
            className="relative rounded-2xl border overflow-visible"
            style={{
              width: '640px',
              maxWidth: 'none',
              minHeight: '444px',
              transformStyle: "preserve-3d",
              backgroundColor: '#120c07',
              borderColor: '#291f18',
              boxShadow: isHovering
          ? 'rgba(0, 0, 0, 0.2) 4px 1.84px 20px 0px, rgba(188, 158, 123, 0.12) 0px 0px 80px 0px, rgba(167, 138, 98, 0.08) 0px 0px 140px'
                : 'rgba(0, 0, 0, 0.15) 0px 20px 40px',
              willChange: 'transform',
            }}
          >
            <div className="relative h-28 overflow-hidden rounded-t-2xl">
              <div className="h-full bg-gradient-to-br from-[#b5825f66] via-[#a15d3e4D] to-[#221812]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]"></div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-12 mb-4">
                <motion.div
    className="relative"
    style={{
      transform: 'translateZ(0px)',
      transition: 'transform 0.3s ease-out',
    }}
  >
    <motion.div
      className="w-24 h-24 rounded-full border-4 overflow-hidden bg-[#221812] cursor-pointer"
      style={{ borderColor: '#120c07' }}
      onClick={() => setProfileModalOpen(true)}
      whileHover={{
        scale: 1.15,
        rotate: 5,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      <motion.img
        alt={discordData?.discord_user.global_name || '07'}
        loading="lazy"
        width="96"
        height="96"
        decoding="async"
        className="object-cover w-full h-full"
        src={avatarUrl}
        whileHover={{
          scale: 1.4,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}

        
        
      />
    </motion.div>

    {avatarDecoration && (
      <img
        src={avatarDecoration}
        alt=""
        className="absolute inset-0 w-24 h-24 scale-[1.12] pointer-events-none select-none z-10"
        draggable={false}
      />
    )}

    <div
      className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 z-20"
      style={{
        backgroundColor: getStatusColor(discordData?.discord_status || 'offline'),
        borderColor: '#120c07',
      }}
    />
  </motion.div>
                
                <div
  className="
    relative z-50
    flex items-center gap-1.5
    rounded-lg bg-[#221812]/80
    px-3 py-2
  "
  style={{
    transform: 'translateZ(0px)',
    transition: 'transform 0.3s ease-out',
  }}
>
  <motion.button
    type="button"
    aria-label="Abrir progresso do Nitro"
    initial={{
      scale: 0,
    }}
    animate={{
      scale: 1,
    }}
    transition={{
      type: 'spring',
      stiffness: 300,
      damping: 18,
    }}
    whileHover={{
      rotate: 360,
      scale: 1.3,
      transition: {
        duration: 0.3,
      },
    }}
    whileTap={{
      scale: 0.9,
    }}
    onMouseEnter={() =>
      setNitroTooltipOpen(true)
    }
    onMouseLeave={() =>
      setNitroTooltipOpen(false)
    }
    onFocus={() =>
      setNitroTooltipOpen(true)
    }
    onBlur={() =>
      setNitroTooltipOpen(false)
    }
    onClick={() => {
      setNitroTooltipOpen(false)
      setNitroModalOpen(true)
    }}
    className="
      group relative flex-shrink-0
      cursor-pointer border-0
      bg-transparent p-0
    "
  >
    <div
      className="
        absolute inset-0 rounded-full
        bg-[#b5825f]/20 blur-md
        opacity-0 transition-opacity
        group-hover:opacity-100
      "
    />

    <img
      src="https://ik.imagekit.io/xys3wb0qo/badges/silver.png"
      alt="Nitro Prata"
      width={20}
      height={20}
      draggable={false}
      className="
        relative z-10 h-5 w-5
        select-none object-contain
      "
    />
  </motion.button>

  <AnimatePresence>
    {nitroTooltipOpen && (
      <motion.div
        initial={{
          opacity: 0,
          y: 5,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 5,
          scale: 0.96,
        }}
        transition={{
          duration: 0.15,
        }}
        className="
          pointer-events-none
          absolute bottom-full left-1/2
          z-[100] mb-3
          -translate-x-1/2
          whitespace-nowrap
          rounded-xl border
          border-[#291f18]
          bg-[#120c07]
          px-3 py-2
          text-center shadow-2xl
        "
      >
        <p
          className="
            text-xs font-semibold
            text-[#ede3d6]
          "
        >
          {formatNitroStartDate()}
        </p>

        <p
          className="
            mt-0.5 text-[11px]
            text-[#8d7d6e]
          "
        >
          Há{' '}
          {getDetailedElapsedTime(
            NITRO_SINCE,
          )}
        </p>

        <div
          className="
            absolute left-1/2 top-full
            -translate-x-1/2
            border-x-[6px]
            border-t-[6px]
            border-x-transparent
            border-t-[#291f18]
          "
        />
      </motion.div>
    )}
  </AnimatePresence>
  
</div>
              </div>
              

              <div className="mb-4">
                <h1 className="text-2xl font-bold" style={{ color: '#ede3d6' }}>
                  {discordData?.discord_user.global_name || '07'}
                </h1>
                <p className="text-sm font-mono" style={{ color: '#8d7d6e' }}>
                  @{discordData?.discord_user.username || 'krov'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: '#22181299',
                      color: 'lab(53.5643 4.57534 10.6701)'
                    }}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>06 de dezembro de 2024</span>
                </div>
              </div>

                          {/* === SEÇÃO DE ATIVIDADE / SPOTIFY === */}
              <div className={`rounded-xl px-4 pt-4 border transition-all ${isPlaying && discordData?.discord_status !== 'offline' ? 'pb-2' : 'pb-4'}`}
                style={{
                  backgroundColor: '#22181280',
                  borderColor: '#291f1880',
                }}
              >
                  {discordData?.discord_status === 'offline' ? (
                  /* ==================== MODO OFFLINE ==================== */
                  <div className="space-y-3">
                    {/* Linha OFFLINE com relógio */}
                    <div className="flex items-center gap-1.5">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2                                    " 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="text-[#8d7d6e]"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span className="text-xs uppercase tracking-wider text-[#8d7d6e] font-medium">
                        Offline
                      </span>
                    </div>

                    {/* Caixa de Nada acontecendo */}
                    <div className="rounded-xl bg-[#1A120C] p-4 flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <span className="text-2xl opacity-40">💤</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#ede3d6' }}>
                          Nada acontecendo
                        </p>
                        <p className="text-xs" style={{ color: '#8d7d6e' }}>
                          AFK nesse momento
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ==================== MODO NORMAL (Spotify ou última música) ==================== */
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <SpotifyIcon />
                        <span className="text-xs uppercase tracking-wider font-medium"
                              style={{ color: '#8d7d6e' }}>
                          {isPlaying ? 'Ouvindo no Spotify' : 'Última atividade'}
                        </span>
                      </div>

                      {isPlaying && (
                        <div className="inline-flex items-center gap-2.5 rounded-full border px-2 py-0.5 text-xs border-emerald-500/30 text-emerald-400">
                          <div className="relative flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping absolute" />
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          </div>
                          Spotify
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          alt={spotify.song || 'Nenhuma música'}
                          loading="lazy"
                          decoding="async"
                          className="object-cover"
                          src={spotify.albumArt || ''}
                          style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px' }}
                        />
                        <Equalizer isPlaying={isPlaying} />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3
                          className="truncate text-sm"
                          style={{ color: '#E0D6C9', fontWeight: 500 }}
                        >
                          {spotify.song || 'Nada tocando'}
                        </h3>
                        <p className="text-sm truncate" style={{ color: '#8d7d6e' }}>
                          {spotify.artist || '...'}
                        </p>

                        {isPlaying && duration > 0 ? (
                          <div className="mt-2 space-y-1">
  {/* Barra de progresso */}
  <div
    className="
      relative h-1 overflow-hidden rounded-full
      border border-[#291f18]/30
      bg-[#221812]/50
    "
  >
    <div
      className="
        h-full rounded-full
        bg-gradient-to-r
        from-emerald-500
        to-emerald-400
      "
      style={{
        width: `${progressPercent}%`,
        transition: 'width 1000ms linear',
      }}
    />
  </div>

  {/* Tempo atual e duração */}
  <div
    className="
      flex items-center justify-between
      font-mono text-[10px]
      text-[#8d7d6e]
    "
  >
    <span>{formatTime(currentProgress)}</span>
    <span>{formatTime(duration)}</span>
  </div>
</div>
                        ) : (
                          <p className="text-xs mt-1" style={{ color: '#8d7d6e' }}>
                            {spotify.fallback ? 'Última música ouvida' : 'Tocando agora'}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3 mt-10"
        >
          <button
            onClick={() => setIgModalOpen(true)}
            className="w-9 h-9 md:w-11 md:h-11 rounded-xl border border-[#291f18] flex items-center justify-center bg-[#22181280] text-[#8d7d6e] hover:bg-[#221812] hover:text-[#ede3d6] hover:-translate-y-0.5 hover:scale-110 transition-all duration-150"
            style={{
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px'
            }}
          >
            <Instagram className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <a
            href="https://open.spotify.com/user/31b7ubmbc3l7ucagz4txamv5yjpy?si=2602be9e20df46f6"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 md:w-11 md:h-11 rounded-xl border border-[#291f18] flex items-center justify-center bg-[#22181280] text-[#8d7d6e] hover:bg-[#221812] hover:text-[#ede3d6] hover:-translate-y-0.5 hover:scale-110 transition-all duration-150"
            style={{
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px'
            }}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 48 48" fill="currentColor">
              <path d="M23.9266 0C10.7126 0 0 10.7123 0 23.9263C0 37.1409 10.7126 47.8523 23.9266 47.8523C37.142 47.8523 47.8534 37.1409 47.8534 23.9263C47.8534 10.7131 37.142 0.00114285 23.9263 0.00114285L23.9266 0ZM34.8991 34.5086C34.4706 35.2114 33.5506 35.4343 32.8477 35.0029C27.23 31.5714 20.158 30.7943 11.8294 32.6971C11.0269 32.88 10.2269 32.3771 10.044 31.5743C9.86029 30.7714 10.3611 29.9714 11.1657 29.7886C20.28 27.7054 28.098 28.6029 34.4049 32.4571C35.1077 32.8886 35.3306 33.8057 34.8991 34.5086ZM37.8277 27.9929C37.2877 28.8714 36.1391 29.1486 35.262 28.6086C28.8306 24.6546 19.0269 23.5097 11.4197 25.8189C10.4331 26.1169 9.39114 25.5609 9.09171 24.576C8.79457 23.5894 9.35086 22.5494 10.3357 22.2494C19.0251 19.6129 29.8277 20.89 37.2134 25.4286C38.0906 25.9686 38.3677 27.1169 37.8277 27.9929ZM38.0791 21.2089C30.3677 16.6286 17.6449 16.2074 10.2823 18.442C9.1 18.8006 7.84971 18.1331 7.49143 16.9509C7.13314 15.768 7.8 14.5186 8.98314 14.1591C17.4349 11.5934 31.4849 12.0891 40.3631 17.3597C41.4289 17.9909 41.7774 19.3643 41.146 20.4263C40.5174 21.4897 39.1403 21.8403 38.0803 21.2089H38.0791Z"></path>
            </svg>
          </a>

          <a
            href="https://last.fm/user/l9ve"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 md:w-11 md:h-11 rounded-xl border border-[#291f18] flex items-center justify-center bg-[#22181280] text-[#8d7d6e] hover:bg-[#221812] hover:text-[#ede3d6] hover:-translate-y-0.5 hover:scale-110 transition-all duration-150"
            style={{
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
            }}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 487 487" fill="currentColor">
              <path d="M412.238 217.438C408.053 216.106 403.868 214.775 399.873 213.443C369.625 203.931 351.363 198.224 351.363 174.635C351.363 155.421 366.201 141.534 386.556 141.534C402.155 141.534 413.76 148.002 424.223 162.65C425.174 163.982 427.076 164.553 428.598 163.792L458.845 148.002C459.606 147.622 460.367 146.861 460.557 145.91C460.748 144.959 460.748 144.007 460.177 143.246C443.817 114.141 420.228 100.063 387.888 100.063C338.807 100.063 307.229 129.74 307.229 175.586C307.229 222.574 337.856 241.598 394.356 260.05C427.076 270.894 441.534 276.791 441.534 300C441.534 326.252 417.945 345.085 385.605 343.944C351.743 342.802 341.471 324.92 328.725 295.624C306.848 245.973 282.118 187.952 281.927 187.381C257.007 129.93 207.736 97.0195 146.48 97.0195C65.6309 97.0195 0 162.65 0 243.5C0 324.35 65.6309 389.98 146.48 389.98C190.615 389.98 231.896 370.386 259.67 336.334C260.431 335.383 260.621 334.052 260.241 332.91L241.788 290.298C241.217 289.156 240.076 288.395 238.744 288.205C237.413 288.205 236.271 288.966 235.51 290.107C218.009 323.398 183.957 344.134 146.29 344.134C90.932 344.134 45.8465 299.048 45.8465 243.5C45.8465 188.142 90.932 142.866 146.29 142.866C186.62 142.866 223.525 166.836 238.364 202.6L284.02 306.848L289.347 318.643C310.082 366.772 340.329 388.268 387.888 388.459C444.388 388.459 487 350.982 487 301.331C487.38 251.68 459.797 232.847 412.238 217.438Z"></path>
            </svg>
          </a>

          <button
  type="button"
  onClick={() => setRobloxModalOpen(true)}
  aria-label="Abrir perfil do Roblox"
  className="w-9 h-9 md:w-11 md:h-11 rounded-xl border border-[#291f18] flex items-center justify-center bg-[#22181280] text-[#8d7d6e] hover:bg-[#221812] hover:text-[#ede3d6] hover:-translate-y-0.5 hover:scale-110 transition-all duration-150"
  style={{
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
  }}
>
  <svg
    className="w-4 h-4 md:w-5 md:h-5"
    viewBox="0 0 48 48"
    fill="currentColor"
  >
    <path d="M10.328 0L0.32 37.856L37.672 48L47.68 10.144L10.328 0ZM26.382 30.328L17.504 27.988L19.852 19.102L28.73 21.442L26.382 30.328Z" />
  </svg>
</button>

          <div className="w-px h-6 mx-2" style={{ backgroundColor: '#291f18' }}></div>

          <a href="#" className="text-sm flex items-center gap-1 group hover:text-[#ede3d6] transition-colors duration-150" style={{ color: '#8d7d6e' }}>
            Conhecer mais
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4 group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </motion.div>

        <AnimatePresence>
    {profileModalOpen && (
      <>
        <motion.div
          className="fixed inset-0 z-[80] bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setProfileModalOpen(false)}
        />

        <motion.div
          className="fixed top-1/2 left-1/2 z-[90] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#291f18] bg-[#120c07] p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 24,
            duration: 0.35,
          }}
        >
          <button
            onClick={() => setProfileModalOpen(false)}
            className="absolute top-4 right-4 z-20 text-[#8d7d6e] hover:text-[#ede3d6] transition-opacity"
          >
            ✕
          </button>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#b5825f20] via-[#a15d3e20] to-[#22181220] blur-xl" />

            <div className="relative bg-[#120c07]/50 rounded-2xl p-8 border border-[#291f18]">
              <div className="relative mx-auto w-64 h-64 mb-6">
                <div className="relative w-full h-full">
                  <motion.div
    className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#b5825f] via-[#a15d3e] to-[#221812]"
    animate={{
      scale: [1, 1.007, 1],
      opacity: [0.85, 1, 0.85],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />

                  <div className="absolute inset-1 bg-[#120c07] rounded-full overflow-hidden">
    <img
      src={avatarUrl.replace('size=4096', 'size=512')}
      alt={discordData?.discord_user.global_name || '07'}
      className="object-cover w-full h-full"
      loading="eager"
    />
  </div>

  {avatarDecoration && (
    <img
      src={avatarDecoration}
      alt=""
      className="absolute inset-0 w-full h-full scale-[1.20] pointer-events-none select-none z-10"
      draggable={false}
    />
  )}
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {discordData?.discord_user.global_name || '07'}
                </h2>

                <p
    className="font-mono"
    style={{ color: 'lab(53.5643 4.57534 10.6701)' }}
  >
                  @{discordData?.discord_user.username || 'krov'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
  <NitroModal
  open={nitroModalOpen}
  onClose={() => setNitroModalOpen(false)}
/>
      </div>
    )
  }

  export default function Home() {

    const [entrou, setEntrou] = useState(false)
    
    
    const [discordData, setDiscordData] = useState<LanyardData | null>(null)
    const [ultimaMusica, setUltimaMusica] = useState<SpotifyData | null>(null)
    const [igModalOpen, setIgModalOpen] = useState(false)
    const [robloxModalOpen, setRobloxModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'home' | 'sobre' | 'lazer' | 'amigos'>('home')
    const [lazerTab, setLazerTab] = useState<'musica' | 'filmes'>('musica')
    const DISCORD_ID = '1314652031675531380'
    const controls = useAnimation()
    const isFirstRender = useRef(true)
    

    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [revealing, setRevealing] = useState(false)
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false
        return
      }
      controls.start({
        y: [-100, 0],
        opacity: [0, 1],
        transition: { duration: 0.6, ease: "easeOut" }
      })
    }, [activeTab, controls])

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        setRotate({ x: rotateX, y: rotateY });
        setIsHovering(true);
      });
    }

    function handleMouseLeave() {
      setRotate({ x: 0, y: 0 });
      setIsHovering(false);
    }

    useEffect(() => {
      const musicaSalva = localStorage.getItem('ultimaMusica')
      if (musicaSalva) setUltimaMusica(JSON.parse(musicaSalva))

      let ws: WebSocket
      let reconnectTimeout: NodeJS.Timeout

      const connect = () => {
        ws = new WebSocket('wss://api.lanyard.rest/socket')

        ws.onopen = () => {
          ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: DISCORD_ID }
          }))
        }

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)

          if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
            const presence = data.d
            setDiscordData(presence)

            if (presence.listening_to_spotify && presence.spotify) {
              setUltimaMusica(presence.spotify)
              localStorage.setItem('ultimaMusica', JSON.stringify(presence.spotify))
            }
          }
        }

        ws.onclose = () => {
          reconnectTimeout = setTimeout(connect, 3000)
        }
      }

      connect()

      fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
    .then(res => res.json())
    .then(json => {
          if (json.success) {
            setDiscordData(json.data)
            if (json.data.listening_to_spotify && json.data.spotify) {
              setUltimaMusica(json.data.spotify)
              localStorage.setItem('ultimaMusica', JSON.stringify(json.data.spotify))
            }
          }
        })
    .catch(e => console.error('Erro Lanyard:', e))

      return () => {
        ws?.close()
        clearTimeout(reconnectTimeout)
      }
    }, [])

    const getStatusColor = (status: string) => {
      switch(status) {
        case 'online': return '#00BC7D'
        case 'idle': return '#FE9A00'
        case 'dnd': return '#FF2056'
        default: return '#71717B'
      }
    }

    const avatarHash = discordData?.discord_user.avatar

  const avatarExt = avatarHash?.startsWith('a_') ? 'gif' : 'png'

  const avatarUrl = avatarHash
    ? `https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${avatarHash}.${avatarExt}?size=4096`
    : 'https://cdn.discordapp.com/embed/avatars/0.png'

    const avatarDecoration =
    discordData?.discord_user.avatar_decoration_data?.asset
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${discordData.discord_user.avatar_decoration_data.asset}.png?size=2048`
      : null

    const musicaAtual = discordData?.listening_to_spotify? discordData.spotify : ultimaMusica

    return (
      
      <main className="min-h-screen overflow-x-hidden antialiased"
            style={{
              backgroundColor: '#080503',
              color: '#ede3d6',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '24px'
            }}>

        <AnimatedBackground />

        <AnimatePresence mode="wait">
    {!entrou && (
      <motion.div
      key="reveal-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => {
    setRevealing(true)
    setTimeout(() => setEntrou(true), 650)
  }}
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-background cursor-pointer"
      >
        <motion.div
    initial={{ opacity: 0, scale: 1 }}
    animate={
      revealing
        ? { opacity: [1, 1, 0], scale: [1, 1.12, 0.35] }
        : { opacity: 1, scale: 1 }
    }
    transition={{
      duration: revealing ? 0.65 : 0.3,
      ease: 'easeInOut',
      delay: revealing ? 0 : 0.3,
    }}
    className="relative"
  >
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.4, 1] }}
            transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
            className="absolute inset-0 rounded-full blur-3xl bg-primary/20"
          />

          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.2, 1, 1.2] }}
            transition={{ delay: 0.3, duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
            className="absolute inset-0 rounded-full blur-2xl bg-primary/15"
          />

          <motion.p
  animate={
    revealing
      ? { opacity: 0 }
      : { opacity: [0.82, 1, 0.82] }
  }
  transition={{
    duration: 2.5,
    ease: 'easeInOut',
    repeat: Infinity,
  }}
  className={`
    ${inter.className}
    relative select-none
    text-2xl font-thin
    uppercase tracking-[0.3em]
    text-[#aca298]
  `}
>
  clique para revelar
</motion.p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

        {entrou && (
          <>
            <InstagramModal open={igModalOpen} onClose={() => setIgModalOpen(false)} />

              <RobloxModal
  open={robloxModalOpen}
  onClose={() => setRobloxModalOpen(false)}
/>

            <motion.div
    initial={{ y: 0, opacity: 1 }}
    animate={controls}
    className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-2 py-2 rounded-2xl bg-[#0F0B06] shadow-lg backdrop-blur-md"
  >
    <nav>
      <div className="flex items-center gap-1 relative">
        {[
          { id: 'home', label: 'Home', icon: User },
          { id: 'sobre', label: 'Sobre', icon: Info },
          { id: 'lazer', label: 'Lazer', icon: LazerIcon },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 z-10 cursor-pointer"
              style={{
                color: isActive ? '#0F0B06' : '#8d7d6e',
                fontFamily: 'Inter, "Inter Fallback"',
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#B5825F] rounded-full"
                  transition={{ duration: 0 }}
                />
              )}
              <Icon size={16} strokeWidth={2} className="relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  </motion.div>

            <>
    {activeTab === 'home' && (
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }} // zero duration = some/aparece na hora
        className="relative z-10 h-screen md:min-h-screen flex flex-col items-center justify-center px-14 pt-20 md:pt-22 pb-20 md:pb-32"
      >
        <HomeContent
        
          cardRef={cardRef}
          handleMouseMove={handleMouseMove}
          handleMouseLeave={handleMouseLeave}
          isHovering={isHovering}
          rotate={rotate}
          discordData={discordData}
          avatarUrl={avatarUrl}
          avatarDecoration={avatarDecoration}
          getStatusColor={getStatusColor}
          musicaAtual={musicaAtual}
          setIgModalOpen={setIgModalOpen}
          setRobloxModalOpen={setRobloxModalOpen}
        />
      </motion.div>
    )}

    {activeTab === 'sobre' && (
      <motion.div
        key="sobre"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        className="relative z-10 min-h-screen px-6 pt-32 pb-20 max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-6" style={{ color: '#ede3d6' }}>Sobre Mim</h1>
        <div className="space-y-4" style={{ color: '#8d7d6e' }}>
          <p>Reforming...</p>
        </div>
      </motion.div>
    )}

              {activeTab === 'lazer' && (
    <motion.div
      key="lazer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative z-10 min-h-screen px-6 pt-32 pb-20 max-w-[1300px] mx-auto"  
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-1">
          Lazer
        </h1>

        <p className="text-muted-foreground flex items-center gap-2">
          O que eu ando curtindo
        </p>

        <div className="mt-4 flex items-center gap-1 p-1 rounded-[calc(var(--radius)+4px)] bg-secondary/40 border border-border/50 w-fit">
          <button
    onClick={() => setLazerTab('musica')}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      lazerTab === 'musica'
        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
    }`}
  >
    <Music className="w-4 h-4" />
    Música
  </button>

          <button
    onClick={() => setLazerTab('filmes')}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      lazerTab === 'filmes'
        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
    }`}
  >
    <Film className="w-4 h-4" />
    Filmes & Séries
  </button>
        </div>
      </motion.div>

      <div className={lazerTab === 'musica' ? 'block' : 'hidden'}>
  <MusicTab />
</div>

  <div className={lazerTab === 'filmes' ? 'block' : 'hidden'}>
    <MoviesTab />
  </div>
    </motion.div>
  )}

                            {activeTab === 'amigos' && (
                <motion.div
                  key="amigos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 min-h-screen px-6 pt-32 pb-20 max-w-[1300px] mx-auto"
                >
                  <h1
                    className="text-4xl font-bold mb-6"
                    style={{ color: '#ede3d6' }}
                  >
                    Meus Amigos
                  </h1>

                  <div
                    className="space-y-4"
                    style={{ color: '#8d7d6e' }}
                  >
                    <p>Reforming...</p>
                  </div>
                </motion.div>
              )}
            </>
          </>
        )}
        <Toaster
  position="top-right"
  richColors={false}
  closeButton={false}
  toastOptions={{
    className:
      '!bg-[#120c07] !border-[#291f18] !text-[#ede3d6] !shadow-xl',
  }}
/>

        <SyncedMusicPlayer />

<div
  aria-hidden="true"
  className="fixed -left-[9999px] top-0 h-[200px] w-[200px]"
>
  <div id="youtube-player" />
</div>
      </main>
    )
  }