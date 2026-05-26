'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Headphones, Users, Library, ListMusic, ExternalLink, 
  Calendar, TrendingUp, Star, Crown, Play, Radio, LoaderCircle, Music, X, Globe, Percent, ChartColumn, Sparkles, MicVocal, Disc3, Clock3, ChevronDown, ChevronUp 
} from 'lucide-react'

const USERNAME = 'l9ve'
const API_KEY = '2222055cf10f11baa9ee6d93b363659f'

const formatShort = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K'
  return num.toLocaleString()
}

const getAppleMusicImage = async (artistName: string) => {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&media=music&entity=album&attribute=artistTerm&limit=1`
    )

    const data = await res.json()

    return data.results?.[0]?.artworkUrl100
      ?.replace('100x100bb', '400x400bb') || ''
  } catch {
    return ''
  }
}

const getTrackImage = async (
  trackName: string,
  artistName: string
) => {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        `${trackName} ${artistName}`
      )}&media=music&entity=song&limit=1`
    )

    const data = await res.json()

    return (
      data.results?.[0]?.artworkUrl100?.replace(
        '100x100bb',
        '600x600bb'
      ) || ''
    )
  } catch {
    return ''
  }
}

const manualTrackImages: Record<string, string> = {
  'Resiliência Nortista|Helry':
    'https://i.scdn.co/image/ab67616d000048515bc1d2520b9070f06de8cc96',

  'wish u would|Worm':
    'https://i.scdn.co/image/ab67616d0000e1a3bbefc520f0123f7c48a57027',

  'lovesick|whatsaheart':
    'https://i.scdn.co/image/ab67616d0000e1a34ba201462b78eecbb18a7b05',

  'home game|Worm':
   'https://i.scdn.co/image/ab67616d0000e1a3a135b1675cb2d905dfb8862d',

   'Here Is Gone|The Goo Goo Dolls':
   'https://i.scdn.co/image/ab67616d000048519923ca569ea4d53394c0146e',

} 

export default function MusicTab() {
  const [user, setUser] = useState<any>(null)
  const [topArtist, setTopArtist] = useState<any>(null)
const [topArtists, setTopArtists] = useState<any[]>([])
const [topTracks, setTopTracks] = useState<any[]>([])
const [selectedTrack, setSelectedTrack] = useState<any>(null)
const [selectedTrackInfo, setSelectedTrackInfo] = useState<any>(null)
const [similarTracks, setSimilarTracks] = useState<any[]>([])
const [artistInfo, setArtistInfo] = useState<any>(null)
const [showFullBio, setShowFullBio] = useState(false)
const [artistTopTracks, setArtistTopTracks] = useState<any[]>([])
const [similarArtists, setSimilarArtists] = useState<any[]>([])
  const [stats, setStats] = useState({ artists: 0, albums: 0, tracks: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, artistsRes, albumsRes, tracksRes] = await Promise.all([
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${USERNAME}&api_key=${API_KEY}&format=json`),
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${USERNAME}&api_key=${API_KEY}&limit=5&format=json`),
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${USERNAME}&api_key=${API_KEY}&limit=1&format=json`),
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${USERNAME}&api_key=${API_KEY}&limit=10&format=json`)
])

const userData = await userRes.json()
const artistsData = await artistsRes.json()
const albumsData = await albumsRes.json()
const tracksData = await tracksRes.json()

const tracksWithImages = await Promise.all(
  (tracksData.toptracks?.track || []).map(async (track: any) => ({
    ...track,
    appleImage:
  manualTrackImages[
    `${track.name}|${track.artist?.name || ''}`
  ] ||
  await getTrackImage(
    track.name,
    track.artist?.name || ''
  )
  }))
)

setTopTracks(tracksWithImages)

const artistsWithAppleImages = await Promise.all(
  (artistsData.topartists?.artist || []).map(async (artist: any) => ({
    ...artist,
    appleImage: await getAppleMusicImage(artist.name)
  }))
)

        setUser(userData.user)
        setTopArtist(artistsWithAppleImages[0] || null)
        setTopArtists(artistsWithAppleImages)

        setStats({
  artists: parseInt(artistsData.topartists?.['@attr']?.total || '0'),
  albums: parseInt(albumsData.topalbums?.['@attr']?.total || '0'),
  tracks: parseInt(tracksData.toptracks?.['@attr']?.total || '0')
})
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])


  useEffect(() => {
  if (!selectedTrack) return

  const fetchTrackDetails = async () => {

  const lastFmArtistName =
    selectedTrack.artist?.name === 'The Goo Goo Dolls'
      ? 'Goo Goo Dolls'
      : selectedTrack.artist?.name

  const artist = lastFmArtistName
  const track = selectedTrack.name

    try {
      const [infoRes, similarRes, artistRes, artistTopRes, similarArtistsRes] = await Promise.all([
        fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&username=${USERNAME}&format=json`),

        fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getSimilar&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&limit=6&format=json`),

        fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&username=${USERNAME}&format=json`),

        fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&limit=5&format=json`),

        fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&limit=5&format=json`)
      ])

      const infoData = await infoRes.json()
      const similarData = await similarRes.json()
      const artistData = await artistRes.json()

      const artistTopData = await artistTopRes.json()
const similarArtistsData = await similarArtistsRes.json()

setArtistTopTracks(artistTopData.toptracks?.track || [])
setSimilarArtists(similarArtistsData.similarartists?.artist || [])

      setSelectedTrackInfo(infoData.track)
      setSimilarTracks(similarData.similartracks?.track || [])
      setArtistInfo(artistData.artist)

    } catch (err) {
      console.error(err)
    }
  }

  fetchTrackDetails()
}, [selectedTrack])

useEffect(() => {
  const navbar = document.querySelector('nav')

  if (selectedTrack) {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    navbar?.classList.add('hidden')
  } else {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''

    navbar?.classList.remove('hidden')
  }

  return () => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''

    navbar?.classList.remove('hidden')
  }
}, [selectedTrack])

  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-3">
      <LoaderCircle className="w-8 h-8 text-[#b5825f] animate-spin" />

      <p className="text-sm text-[#b5825f]">
        Carregando dados do Last.fm...
      </p>
    </div>
  )
}

  const totalScrobbles = parseInt(user?.playcount || '0')
  const dailyAverage = Math.round(totalScrobbles / 48) || 0
  const variety = stats.artists > 0 ? ((stats.artists / totalScrobbles) * 100).toFixed(1) : "0"

  const registeredAt = Number(user?.registered?.unixtime || 0)

const daysSinceCreation = registeredAt
  ? Math.floor((Date.now() / 1000 - registeredAt) / 86400)
  : 0

const memberSince = registeredAt
  ? new Date(registeredAt * 1000).toLocaleDateString('pt-BR')
  : '---'

  const maxValue = Math.max(
  stats.artists,
  stats.albums,
  stats.tracks
)

const artistWidth = (stats.artists / maxValue) * 100
const albumWidth = (stats.albums / maxValue) * 100
const trackWidth = (stats.tracks / maxValue) * 100

  return (
  <motion.div
  className="w-full"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
      <div 
        data-slot="card"
        className="text-card-foreground flex flex-col gap-6 rounded-xl border py-8 shadow-sm 
                   bg-gradient-to-br from-[#1a110b] via-[#150e0a] to-[#b5825f08] 
                   border-[#1e150f]/50 overflow-hidden relative w-full max-w-[1250px] mx-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#b5825f08] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a110b] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 px-6 md:px-7 lg:px-8">

          {/* Top Section */}
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/20 ring-4 ring-primary/10">
                  <img 
                    src={user?.image?.[3]?.['#text']?.replace('300x300', '174s') || 
                         'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'} 
                    alt={USERNAME}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1 flex items-center gap-2">
  {USERNAME}

  <span className="text-xs px-2 py-0.5 rounded-full bg-[#37261b] text-[#b5825f] font-medium">
    PRO
  </span>
</h2>
                <p className="text-[#8d7d6e] text-sm">@l9ve</p>
                <div className="flex items-center gap-4 text-xs text-[#8d7d6e] mt-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Desde 2026
                  </span>
                  <a href={`https://www.last.fm/user/${USERNAME}`} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1 text-[#b5825f] hover:text-white font-medium">
                    Ver Perfil <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-[#251911] to-[#1d130d] border border-[#352519] rounded-xl p-4 hover:scale-105 transition-transform">
                <Headphones className="w-6 h-6 text-[#b5825f] mb-2" />
                <p className="text-xl font-black text-white">{formatShort(totalScrobbles)}</p>
                <p className="text-xs text-[#8d7d6e]">Scrobbles</p>
              </div>
              <div className="bg-gradient-to-br from-[#241811] to-[#1c130c] border border-[#352519] rounded-xl p-4 hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-[#b5825f] mb-2" />
                <p className="text-xl font-black text-white">{formatShort(stats.artists)}</p>
                <p className="text-xs text-[#8d7d6e]">Artistas</p>
              </div>
              <div className="bg-gradient-to-br from-[#231810] to-[#1f160f] border border-[#352519] rounded-xl p-4 hover:scale-105 transition-transform">
                <Library className="w-6 h-6 text-[#b5825f] mb-2" />
                <p className="text-xl font-black text-white">{formatShort(stats.albums)}</p>
                <p className="text-xs text-[#8d7d6e]">Álbuns</p>
              </div>
              <div className="bg-gradient-to-br from-[#231810] to-[#1f160f] border border-[#352519] rounded-xl p-4 hover:scale-105 transition-transform">
                <ListMusic className="w-6 h-6 text-[#b5825f] mb-2" />
                <p className="text-xl font-black text-white">{formatShort(stats.tracks)}</p>
                <p className="text-xs text-[#8d7d6e]">Músicas</p>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#2a241f] to-transparent mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              {/* Estatísticas Detalhadas */}
<div className="space-y-4">

  <h3 className="text-sm font-bold text-[#8d7d6e] uppercase tracking-wider mb-4 flex items-center gap-2">
    <TrendingUp className="w-4 h-4" />
    ESTATÍSTICAS DETALHADAS
  </h3>

  <div className="grid grid-cols-2 gap-3">

    <div className="p-4 rounded-xl bg-[#120c07] border border-[#2a241f]/50 hover:border-[#b5825f]/50 transition-colors">
      <Headphones className="w-5 h-5 text-[#b5825f] mb-2" />

      <p className="text-2xl font-black text-white mb-1">
        {totalScrobbles.toLocaleString()}
      </p>

      <p className="text-xs text-[#8d7d6e]">
        Scrobbles totais
      </p>
    </div>

    <div className="p-4 rounded-xl bg-[#120c07] border border-[#2a241f]/50 hover:border-[#b5825f]/50 transition-colors">
      <Users className="w-5 h-5 text-[#b5825f] mb-2" />

      <p className="text-2xl font-black text-white mb-1">
        {stats.artists.toLocaleString()}
      </p>

      <p className="text-xs text-[#8d7d6e]">
        Artistas únicos
      </p>
    </div>

    <div className="p-4 rounded-xl bg-[#120c07] border border-[#2a241f]/50 hover:border-[#b5825f]/50 transition-colors">
      <Library className="w-5 h-5 text-[#b5825f] mb-2" />

      <p className="text-2xl font-black text-white mb-1">
        {stats.albums.toLocaleString()}
      </p>

      <p className="text-xs text-[#8d7d6e]">
        Álbuns diferentes
      </p>
    </div>

    <div className="p-4 rounded-xl bg-[#120c07] border border-[#2a241f]/50 hover:border-[#b5825f]/50 transition-colors">
      <ListMusic className="w-5 h-5 text-[#b5825f] mb-2" />

      <p className="text-2xl font-black text-white mb-1">
        {stats.tracks.toLocaleString()}
      </p>

      <p className="text-xs text-[#8d7d6e]">
        Músicas catalogadas
      </p>
    </div>

  </div>
</div>

              {/* Insights de Escuta */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="w-full"
>
  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1c140d]/40 via-[#1c140d]/20 to-transparent border border-[#2a241f]/50 p-5 min-h-[343px]">

    <div className="absolute top-0 right-0 w-32 h-32 bg-[#b5825f10] rounded-full blur-2xl" />

    <div className="relative z-10">

      <div className="flex items-center gap-2 mb-5">
        <Radio className="w-5 h-5 text-[#b5825f]" />

        <h4 className="text-sm font-bold text-[#8d7d6e] uppercase tracking-wider">
          INSIGHTS DE ESCUTA
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-2">

        <div>
          <p className="text-xs text-[#8d7d6e] mb-1">
            Média diária
          </p>

          <p className="text-xl font-black text-foreground">
            {dailyAverage}
          </p>

          <p className="text-[10px] text-[#8d7d6eb3]">
  scrobbles/dia
</p>
        </div>

        <div>
          <p className="text-xs text-[#8d7d6e] mb-1">
            Variedade
          </p>

          <p className="text-xl font-black text-foreground">
            {variety}%
          </p>

          <p className="text-[10px] text-[#8d7d6eb3]">
  artistas/plays
</p>
        </div>
      </div>

      <div className="mb-6">

        <p className="text-[10px] text-[#8d7d6e] uppercase tracking-wider font-semibold pb-1">
  Distribuição de Conteúdo
</p>

        <div className="space-y-2">

  {/* Artistas */}
  <div className="space-y-1">

    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground text-[12px]">
  Artistas
</span>

      <span className="text-[12px] font-semibold text-foreground">  
  {stats.artists.toLocaleString()}
</span>
    </div>

    <div className="h-1.5 bg-[#1c130e]/50 rounded-full overflow-hidden">
      <motion.div
  initial={{ width: 0 }}
  animate={{ width: `${artistWidth}%` }}
  transition={{ delay: 0.3, duration: 1 }}
  className="h-full bg-gradient-to-r from-[#b5825f] to-[#b5825fcc] rounded-full"
/>
    </div>

  </div>

  {/* Álbuns */}
  <div className="space-y-1">

    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground text-[12px]">
  Álbuns
</span>

      <span className="text-[12px] font-semibold text-foreground">
  {stats.albums.toLocaleString()}
</span>
    </div>

    <div className="h-1.5 bg-[#1c130e]/50 rounded-full overflow-hidden">
      <motion.div
  initial={{ width: 0 }}
  animate={{ width: `${albumWidth}%` }}
  transition={{ delay: 0.4, duration: 1 }}
  className="h-full bg-gradient-to-r from-[#b5825fb3] to-[#b5825f80] rounded-full"
/>
    </div>

  </div>

  {/* Músicas */}
  <div className="space-y-1">

    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground text-[12px]">
  Músicas
</span>

      <span className="text-[12px] font-semibold text-foreground">
  {stats.tracks.toLocaleString()}
</span>
    </div>

    <div className="h-1.5 bg-[#2a241f]/50 rounded-full overflow-hidden">
      <motion.div
  initial={{ width: 0 }}
  animate={{ width: `${trackWidth}%` }}
  transition={{ delay: 0.5, duration: 1 }}
  className="h-full bg-gradient-to-r from-[#b5825f80] to-[#b5825f4d] rounded-full"
/>
    </div>

  </div>

</div>
      </div>

      <div className="pt-4 border-t border-border/30 flex items-center justify-between text-xs text-[#8d7d6e]">

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Desde {memberSince}
        </div>

        <div className="font-bold text-[lab(59.0642%_17.2913_27.0713)]">
  {daysSinceCreation} dias
</div>
      </div>
    </div>
  </div>
</motion.div>
            </div>

            {/* ARTISTA FAVORITO - Versão Compacta */}
{/* COLUNA DIREITA */}
<div className="self-start space-y-6">

  {/* ARTISTA FAVORITO */}
  {topArtist && (
    <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#b5825f20] via-[#b5825f10] to-transparent border-2 border-[#b5825f40] p-6 w-full">

      <div className="absolute top-0 right-0 w-40 h-40 bg-[#b5825f10] rounded-full blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">

            <div className="w-10 h-10 rounded-full bg-[#b5825f] flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-black fill-current" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#8d7d6e] uppercase tracking-wider">
                ARTISTA FAVORITO
              </p>

              <p className="text-[10px] text-[#8d7d6e]/70">
                Mais ouvido
              </p>
            </div>
          </div>

          <motion.div
  className="px-3 py-1.5 rounded-full bg-[#503828] border border-[#845d42] backdrop-blur-sm"
  animate={{
    scale: [1, 1.05, 1],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
  <span className="text-xs font-black text-[#b5825f] uppercase tracking-wider">
    #1
  </span>
</motion.div>
        </div>

        <div className="flex items-start gap-5 mb-4">

          <div className="relative flex-shrink-0">

            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-[#b5825f40] shadow-2xl">
              <img
                src={topArtist.appleImage || topArtist.image?.[3]?.['#text'] || ''}
                alt={topArtist.name}
                className="w-full h-full object-cover"
              />
            </div>

            <motion.div
  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#b5825f] flex items-center justify-center shadow-xl"
  animate={{
    rotate: [0, 10, -10, 0],
    scale: [1, 1.1, 1],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
  <Crown className="w-5 h-5 text-black fill-current" />
</motion.div>
          </div>

          <div className="flex-1">

            <h4 className="text-2xl font-black text-white mb-2 leading-tight">
              {topArtist.name}
            </h4>

            <div className="grid grid-cols-2 gap-3">

              <div className="flex flex-col">
                <span className="text-xs text-[#8d7d6e] mb-1">
                  Reproduções
                </span>

                <span className="flex items-center gap-1 text-[#b5825f] font-bold text-lg">
                  <Play className="w-4 h-4 fill-current" />
                  {parseInt(topArtist.playcount || '0').toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-[#8d7d6e] mb-1">
                  Do total
                </span>

                <span className="text-lg font-black text-white">
                  {((parseInt(topArtist.playcount || '0') / totalScrobbles) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#b5825f20]">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2 text-xs text-[#8d7d6e]">
              <TrendingUp className="w-4 h-4 text-[#b5825f]" />
              <span>Seu artista mais ouvido</span>
            </div>

            <ExternalLink className="w-4 h-4 text-[#b5825f] hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </motion.div>
  )}

  {/* OUTROS ARTISTAS */}
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Users className="w-4 h-4" />
        Outros Artistas
      </h3>

      <span className="text-xs text-muted-foreground">
        #2 - #5
      </span>
    </div>

    <div className="space-y-2">
      {topArtists.slice(1, 5).map((artist, index) => (
        <motion.a
  key={artist.name}
  href={artist.url}
  target="_blank"
  rel="noopener noreferrer"
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.1 }}
  className="group flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border bg-secondary/20 border-transparent hover:bg-secondary/40 hover:border-border/50"
>

          <div className="relative">

            <div className="rounded-xl overflow-hidden flex-shrink-0 ring-2 transition-all shadow-md w-11 h-11 ring-transparent group-hover:ring-primary/30">

              <img
                src={
  artist.appleImage ||
  artist.image?.[3]?.['#text'] ||
  artist.image?.[2]?.['#text'] ||
  ''
}
                alt={artist.name}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shadow-lg bg-gradient-to-br from-muted to-muted/80 text-foreground">
              {index + 2}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-foreground truncate transition-colors font-semibold text-sm group-hover:text-primary">
              {artist.name}
            </p>

            <p className="text-xs font-medium text-muted-foreground">
              {parseInt(artist.playcount).toLocaleString()} reproduções
            </p>
          </div>

          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.a>
      ))}
    </div>
  </div>

</div>



          </div>
        </div>
      </div>

<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="mb-12 mt-10"
>
  <div className="mb-6">
    <h2 className="text-3xl md:text-4xl font-black mb-2">
      Ranking Completo
    </h2>

    <p className="text-muted-foreground text-sm">
      Top 10 músicas mais reproduzidas
    </p>
  </div>

  <div className="bg-card/50 border border-border/50 overflow-hidden rounded-xl">
  <div className="divide-y divide-border/50">
      {topTracks.map((track, index) => (
        <motion.div
  key={`${track.name}-${index}`}
  initial={{ opacity: 0, x: -20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.05 }}
  onClick={() => {
  setSelectedTrackInfo(null)
  setSimilarTracks([])
  setArtistInfo(null)
  setArtistTopTracks([])
  setSimilarArtists([])
  setShowFullBio(false)
  setSelectedTrack(track)
}}
  className={`flex items-center gap-4 p-4 transition-colors cursor-pointer ${
    index === 0 ? 'bg-gradient-to-r from-primary/10 to-transparent' : ''
  }`}
>
          <div
            className={`flex items-center justify-center font-black flex-shrink-0 ${
              index === 0
                ? 'w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg'
                : 'w-8 text-muted-foreground'
            }`}
          >
            {index === 0 ? (
              <Star className="w-6 h-6 fill-current" />
            ) : (
              `#${index + 1}`
            )}
          </div>

          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={
  track.appleImage ||
  track.image?.[3]?.['#text'] ||
  track.image?.[2]?.['#text'] ||
  'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
}
              alt={track.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-bold truncate mb-1 ${index === 0 ? 'text-lg' : 'text-base'}`}>
              {track.name}
            </h3>

            <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
              <Music className="w-3 h-3 flex-shrink-0" />
              {track.artist?.name}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-black text-primary mb-1">
              {track.playcount}
            </div>

            <div className="text-xs text-muted-foreground">
              plays totais
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
  <AnimatePresence>
  {selectedTrack && (
    <>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={() => setSelectedTrack(null)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed top-1/2 left-1/2 z-[10000] w-full max-w-[850px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-border/50 bg-[#120C07] shadow-lg p-0 gap-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={
                selectedTrack.appleImage ||
                'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
              }
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-card/80 to-card" />
          </div>

          <button
            onClick={() => setSelectedTrack(null)}
            className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-background/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="relative p-5 pb-3.5">
            <div className="flex gap-4 items-start">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-2xl ring-2 ring-primary/30">
                  <img
                    src={
                      selectedTrack.appleImage ||
                      'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
                    }
                    alt={selectedTrack.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black shadow-lg flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  {selectedTrack.playcount}
                </div>
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">

  <span className="inline-flex items-center gap-1 px-2 py-0 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
    <Music className="w-2 h-2" />
    Música
  </span>

  {artistInfo?.ontour === '1' && (
    <span className="inline-flex items-center gap-1 px-1.5 py-0 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
      <Radio className="w-2.5 h-2.5" />
      Em turnê
    </span>
  )}

</div>

                <h2 className="text-lg sm:text-xl font-black text-foreground leading-tight mb-1 line-clamp-2">
                  {selectedTrack.name}
                </h2>

                <div className="flex flex-col gap-1 mb-1.5">

  <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
    <MicVocal className="w-3.5 h-3.5 flex-shrink-0" />
    {selectedTrack.artist?.name}
  </p>

  <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 leading-none">
    
    <span className="inline-flex items-center gap-1">
      <Disc3 className="w-3 h-3" />
      {selectedTrack.name} - Single
    </span>

    {selectedTrackInfo?.duration && Number(selectedTrackInfo.duration) > 0 && (
      <span className="inline-flex items-center gap-1">
        <Clock3 className="w-3 h-3" />
        {Math.floor(Number(selectedTrackInfo.duration) / 1000 / 60)}:
        {Math.floor((Number(selectedTrackInfo.duration) / 1000) % 60)
          .toString()
          .padStart(2, '0')}
      </span>
    )}

  </div>
</div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[70vh] px-5 pb-5 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
  {[
    {
      label: 'Ouvintes',
      value: formatShort(Number(selectedTrackInfo?.listeners || 0)),
      title: `${Number(selectedTrackInfo?.listeners || 0).toLocaleString('pt-BR')} ouvintes únicos`,
      icon: Globe,
      active: false,
    },
    {
      label: 'Plays globais',
      value: formatShort(Number(selectedTrackInfo?.playcount || 0)),
      title: `${Number(selectedTrackInfo?.playcount || 0).toLocaleString('pt-BR')} reproduções globais`,
      icon: Headphones,
      active: false,
    },
    {
      label: 'Seus plays',
      value: selectedTrack.playcount,
      title: `${selectedTrack.playcount} seus plays`,
      icon: Play,
      active: true,
    },
    {
      label: 'Do total global',
      value: selectedTrackInfo?.playcount
        ? `${((Number(selectedTrack.playcount) / Number(selectedTrackInfo.playcount)) * 100) < 0.01
    ? '<0.01%'
    : `${((Number(selectedTrack.playcount) / Number(selectedTrackInfo.playcount)) * 100).toFixed(2)}%`
  }`
        : '0%',
      title: selectedTrackInfo?.playcount
        ? `Você contribuiu com ${((Number(selectedTrack.playcount) / Number(selectedTrackInfo.playcount)) * 100).toFixed(4)}% dos plays globais`
        : 'Você contribuiu com 0% dos plays globais',
      icon: Percent,
      active: false,
    },
  ].map((item) => {
    const Icon = item.icon

    return (
      <div
        key={item.label}
        title={item.title}
        className={`rounded-2xl border p-2 text-center transition-all hover:scale-[1.02] ${
          item.active
            ? 'bg-primary/10 border-primary/20'
            : 'bg-secondary/40 border-border/50'
        }`}
      >
        <Icon
          className={`w-4 h-4 mx-auto mb-1.5 text-primary ${
            item.label === 'Seus plays' ? 'fill-current' : ''
          }`}
        />

        <p
          className={`text-lg font-black ${
            item.active ? 'text-primary' : 'text-foreground'
          }`}
        >
          {item.value}
        </p>

        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {item.label}
        </p>
      </div>
    )
  })}
</div>

          <div className="rounded-lg bg-secondary/30 border border-border/50 p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <ChartColumn className="w-3 h-3" />
                Sua contribuição
              </span>

              <span className="text-xs font-bold text-primary">
                {selectedTrack.playcount} / {Number(selectedTrackInfo?.playcount || 0).toLocaleString()}
              </span>
            </div>

            <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                style={{
                  width: selectedTrackInfo?.playcount
                    ? `${Math.min((Number(selectedTrack.playcount) / Number(selectedTrackInfo.playcount)) * 100, 100)}%`
                    : '0%'
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Músicas similares
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                {similarTracks.map((similar) => (
                  <a
                    key={similar.name}
                    href={similar.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-secondary/20 border border-border/30 hover:bg-secondary/40 hover:border-primary/20 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                      <Music className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {similar.name}
                      </p>

                      <p className="text-[10px] text-muted-foreground truncate">
                        {similar.artist?.name}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold text-primary/70 flex-shrink-0">
                      {Math.round(Number(similar.match || 0) * 100)}%
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-secondary/40 via-secondary/20 to-transparent border border-border/50 overflow-hidden">
  <div className="p-3">
    <div className="flex items-start gap-3 mb-2">
      <div className="w-10 h-10 rounded-lg bg-secondary/40 border border-border/30 flex items-center justify-center flex-shrink-0">
        <MicVocal className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1">
  <p className="text-sm font-bold text-foreground">
    {selectedTrack.artist?.name}
  </p>

  <a
    href={artistInfo?.url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-muted-foreground hover:text-primary transition-colors"
  >
    <ExternalLink className="w-3 h-3" />
  </a>
</div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
          <span>{formatShort(Number(artistInfo?.stats?.listeners || 0))} ouvintes</span>
          <span>{formatShort(Number(artistInfo?.stats?.playcount || 0))} plays</span>
        </div>

        <div className="-ml-[52px] flex flex-wrap gap-1.5 mt-3">
          {(artistInfo?.tags?.tag || []).slice(0, 5).map((tag: any) => (
            <span
              key={tag.name}
              className="px-2 py-0.5 rounded-full bg-background/40 text-[9px] text-muted-foreground"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>

    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
      {artistInfo?.bio?.summary
        ?.replace(/<a[^>]*>.*?<\/a>/g, '')
        ?.slice(0, showFullBio ? undefined : 260) || 'Sem informações disponíveis para este artista.'}
      {!showFullBio && artistInfo?.bio?.summary?.length > 260 ? '...' : ''}
    </p>

    {artistInfo?.bio?.summary?.length > 260 && (
      <button
        onClick={() => setShowFullBio(!showFullBio)}
        className="text-[11px] text-primary mt-1 hover:text-foreground transition-colors"
      >
        <div className="flex items-center gap-1">
  {showFullBio ? (
    <>
      <ChevronUp className="w-3 h-3" />
      <span>Menos</span>
    </>
  ) : (
    <>
      <ChevronDown className="w-3 h-3" />
      <span>Mais</span>
    </>
  )}
</div>
      </button>
    )}
  </div>

  <div className="border-t border-border/30 grid divide-x divide-border/30 grid-cols-2">
    <div className="p-3">
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        Top do artista
      </p>

      <div className="space-y-0.5">
        {artistTopTracks.map((t, i) => (
          <a
            key={t.name}
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-background/40 transition-colors group"
          >
            <span className="w-3.5 text-center text-[9px] font-bold text-muted-foreground/50">
              {i + 1}
            </span>

            <p className="flex-1 text-[11px] font-medium text-foreground truncate group-hover:text-primary">
              {t.name}
            </p>

            <span className="text-[9px] text-muted-foreground/60">
              {formatShort(Number(t.playcount || 0))}
            </span>
          </a>
        ))}
      </div>
    </div>

    <div className="p-3">
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
        <Users className="w-3 h-3" />
        Similares
      </p>

      <div className="space-y-1">
        {similarArtists.map((a) => (
          <a
            key={a.name}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-background/40 transition-colors group"
          >
            <div className="w-5 h-5 rounded-full bg-secondary/40 flex items-center justify-center flex-shrink-0">
              <MicVocal className="w-2.5 h-2.5 text-muted-foreground" />
            </div>

            <span className="text-[11px] font-medium text-foreground truncate group-hover:text-primary">
              {a.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  </div>
</div>

            <a
              href={selectedTrack.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-bold transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver no Last.fm
            </a>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
</motion.div>

    </motion.div>

    
  )
}

