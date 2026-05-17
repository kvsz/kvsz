'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Headphones, Users, Library, ListMusic, ExternalLink, 
  Calendar, TrendingUp, Star, Crown, Play, Radio, LoaderCircle 
} from 'lucide-react'

const USERNAME = 'l9ve'
const API_KEY = '2222055cf10f11baa9ee6d93b363659f'

const formatShort = (num: number): string => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
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

export default function MusicTab() {
  const [user, setUser] = useState<any>(null)
  const [topArtist, setTopArtist] = useState<any>(null)
const [topArtists, setTopArtists] = useState<any[]>([])
  const [stats, setStats] = useState({ artists: 0, albums: 0, tracks: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, artistsRes, albumsRes, tracksRes] = await Promise.all([
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${USERNAME}&api_key=${API_KEY}&format=json`),
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${USERNAME}&api_key=${API_KEY}&limit=5&format=json`),
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${USERNAME}&api_key=${API_KEY}&limit=1&format=json`),
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${USERNAME}&api_key=${API_KEY}&limit=1&format=json`)
])

const userData = await userRes.json()
const artistsData = await artistsRes.json()
const albumsData = await albumsRes.json()
const tracksData = await tracksRes.json()

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
    </motion.div>

    
  )
}

