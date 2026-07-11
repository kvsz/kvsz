'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Headphones, Users, Library, ListMusic, ExternalLink, 
  Calendar, TrendingUp, Star, Crown, Play, Radio, LoaderCircle, Music, X, Globe, Percent, ChartColumn, Sparkles, MicVocal, Disc3, Clock3, ChevronDown, ChevronUp, Tag, Clock, LayoutGrid, LayoutList 
} from 'lucide-react'

const USERNAME = 'l9ve'
const API_KEY = '2222055cf10f11baa9ee6d93b363659f'

const formatShort = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K'
  return num.toLocaleString()
}

const normalizeLastFmArtist = (artistName: string) => {
  if (artistName === 'The Goo Goo Dolls') {
    return 'Goo Goo Dolls'
  }

  return artistName
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

   'golden retriever|Thorne':
  'https://i.scdn.co/image/ab67616d00001e026f4e4c07e8178879bb375fd2',

  'KYS|torturedskin':
  'https://source.boomplaymusic.com/group10/M00/09/13/3de695936da6435cafd7655094b79c62H3000W3000_464_464.webp'

}

const manualRecentTrackImages: Record<string, string> = {
  'my old friend paranoia|imnotvrycreative': 'https://imgs.search.brave.com/wpprfvbmtQBJ10Dg7u75oUsIg8mXph1geqVLhUmq4a8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLXhudnpE/QXgxYlhYeW9kREct/NUw0SnBnLXQyNDB4/MjQwLmpwZw',
  'perfect, the imposter|imnotvrycreative': 'https://imgs.search.brave.com/wpprfvbmtQBJ10Dg7u75oUsIg8mXph1geqVLhUmq4a8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLXhudnpE/QXgxYlhYeW9kREct/NUw0SnBnLXQyNDB4/MjQwLmpwZw',
  'me myself and hell|imnotvrycreative': 'https://imgs.search.brave.com/wpprfvbmtQBJ10Dg7u75oUsIg8mXph1geqVLhUmq4a8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLXhudnpE/QXgxYlhYeW9kREct/NUw0SnBnLXQyNDB4/MjQwLmpwZw',
  'NOT MY MOTTO|imnotvrycreative': 'https://imgs.search.brave.com/z_3APXk4nypHy0BwQoBWRMkhkM7btsjqbWtA4l2Yofw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZ2VuaXVzLmNv/bS8wNGJhZTcxYzVm/ZWQzZTQzMWJiZmQ1/MWRlM2MwNzQ4Ni4z/MDB4MzAweDEuanBn',
  'On My Own|Brux Blank Music': 'https://cdn-images.dzcdn.net/images/artist/34eaf232cb2cf6e0cb9de194d86e21cd/500x500-000000-80-0-0.jpg',
  'Strange|Vincemp3': 'https://imgs.search.brave.com/xhth5JeoERzsXFqjjG7m2yHL6-Z61CqiMDZYS3YvjtY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnNj/ZG4uY28vaW1hZ2Uv/YWI2NzYxNmQwMDAw/MWUwMjI4YzJhN2Iw/MTBkZjcyYWMxYjli/YmY3Mg',
  'eyelids|Worm': 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3d/5d/28/3d5d2830-24e9-750c-78c8-e6217af22438/artwork.jpg/600x600cc.webp',
  'Moist.|Vincemp3': 'https://imgs.search.brave.com/mhzpE2e-Xe6kfvzwXYVYYZjOKcoX4bH3A16SzZ6jgk4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLUtjamIz/cXBnMjJndWxWZEwt/M2o3cnl3LXQxMDgw/eDEwODAuanBn',
  'influenced|Marceline': 'https://i.scdn.co/image/ab67616d00001e022bcab0a1c1049ab6fb434f19',
  '157 CAFAJESTE X FINAL FANTASY - Slowed down|prodbymiri': 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cffc64ed6edcd4e988f9168cd',
}

const manualArtistImages: Record<string, string> = {
  'Thorne':
    'https://i.scdn.co/image/ab67616d000048516f4e4c07e8178879bb375fd2',

  'Worm':
    'https://i.scdn.co/image/ab67616d0000e1a3a135b1675cb2d905dfb8862d',
}

const manualAlbumImages: Record<string, string> = {
  'everything repeats|Marceline':
    'https://i.scdn.co/image/ab67616d00001e022bcab0a1c1049ab6fb434f19',

  'goddess|Thorne':
    'https://i.scdn.co/image/ab67616d00001e026f4e4c07e8178879bb375fd2',
}

const manualAlbumDurations: Record<string, number> = {
  'goddess|Thorne': 9,
  'everything repeats|Marceline': 12,
}

const manualTrackDurations: Record<string, string> = {
  'goddess|Thorne|it\'s different': '1:39',
  'goddess|Thorne|golden retriever': '2:01',
  'goddess|Thorne|goddess': '1:10',

  'everything repeats|Marceline|marcymas': '1:39',
  'everything repeats|Marceline|influenced (feat. bastard)': '2:02',
  'everything repeats|Marceline|my dear': '2:13',
  'everything repeats|Marceline|ruin my world': '2:28',
}

const formatRecentTime = (track: any) => {
  if (track?.['@attr']?.nowplaying) {
    return 'Tocando agora'
  }

  const unix = Number(track?.date?.uts || 0)

  if (!unix) return 'recente'

  const diffSeconds = Math.floor(Date.now() / 1000 - unix)

  if (diffSeconds < 60) return `há ${diffSeconds}s`

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `há ${diffMinutes} min`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `há ${diffHours} horas`

  const diffDays = Math.floor(diffHours / 24)
  return `há ${diffDays} dias`
}

export default function MusicTab() {
  const [user, setUser] = useState<any>(null)
  const [topArtist, setTopArtist] = useState<any>(null)
const [topArtists, setTopArtists] = useState<any[]>([])
const [topTracks, setTopTracks] = useState<any[]>([])
const [topAlbums, setTopAlbums] = useState<any[]>([])
const [selectedAlbum, setSelectedAlbum] = useState<any>(null)
const [selectedAlbumInfo, setSelectedAlbumInfo] = useState<any>(null)
const [albumTracks, setAlbumTracks] = useState<any[]>([])
const [recentTracks, setRecentTracks] = useState<any[]>([])
const [recentView, setRecentView] = useState<'list' | 'grid'>('list')
const [showFullAlbumBio, setShowFullAlbumBio] = useState(false)
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
        const [userRes, artistsRes, albumsRes, tracksRes, recentRes] = await Promise.all([
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${USERNAME}&api_key=${API_KEY}&format=json`),
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${USERNAME}&api_key=${API_KEY}&limit=5&format=json`),
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${USERNAME}&api_key=${API_KEY}&limit=10&format=json`),
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${USERNAME}&api_key=${API_KEY}&limit=10&format=json`),
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&limit=15&format=json`)
])





const userData = await userRes.json()
const artistsData = await artistsRes.json()
const albumsData = await albumsRes.json()
setTopAlbums(albumsData.topalbums?.album || [])
const tracksData = await tracksRes.json()

const recentData = await recentRes.json()
setRecentTracks((recentData.recenttracks?.track || []).slice(0, 15))

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
    appleImage:
      manualArtistImages[artist.name] ||
      await getAppleMusicImage(artist.name)
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
  const fetchRecentTracks = async () => {
    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&limit=15&format=json`
      )

      const data = await res.json()

      setRecentTracks((data.recenttracks?.track || []).slice(0, 15))
    } catch (err) {
      console.error(err)
    }
  }

  fetchRecentTracks()

  const interval = setInterval(fetchRecentTracks, 5000)

  return () => clearInterval(interval)
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
  if (!selectedAlbum) return

  const fetchAlbumDetails = async () => {
    const artist = normalizeLastFmArtist(selectedAlbum.artist?.name || '')
    const album = selectedAlbum.name

    try {
      const [albumRes, artistRes, artistTopRes, similarArtistsRes] =
        await Promise.all([
          fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&username=${USERNAME}&format=json`),

          fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&username=${USERNAME}&format=json`),

          fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&limit=5&format=json`),

          fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&limit=5&format=json`)
        ])

      const albumData = await albumRes.json()
      const artistData = await artistRes.json()
      const artistTopData = await artistTopRes.json()
      const similarArtistsData = await similarArtistsRes.json()

      setSelectedAlbumInfo(albumData.album)
      const tracks = albumData.album?.tracks?.track

setAlbumTracks(
  Array.isArray(tracks)
    ? tracks
    : tracks
      ? [tracks]
      : []
)

      setArtistInfo(artistData.artist)
      setArtistTopTracks(artistTopData.toptracks?.track || [])
      setSimilarArtists(similarArtistsData.similarartists?.artist || [])
    } catch (err) {
      console.error(err)
    }
  }

  fetchAlbumDetails()
}, [selectedAlbum])

useEffect(() => {
  const navbar = document.querySelector('nav')
  const modalOpen = Boolean(selectedTrack || selectedAlbum)

  if (modalOpen) {
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
}, [selectedTrack, selectedAlbum])

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
const albumBioText =
  selectedAlbumInfo?.wiki?.content ||
  selectedAlbumInfo?.wiki?.summary ||
  ''

  const artistBioText =
  artistInfo?.bio?.content ||
  artistInfo?.bio?.summary ||
  ''

const hasAlbumBio = Boolean(albumBioText)
const albumTags = selectedAlbumInfo?.tags?.tag || []
const hasAlbumTags = albumTags.length > 0
const albumReleaseDate = selectedAlbumInfo?.wiki?.published || ''
const hasAlbumSideInfo = hasAlbumTags || hasAlbumBio

const manualAlbumDuration =
  selectedAlbum
    ? manualAlbumDurations[`${selectedAlbum.name}|${selectedAlbum.artist?.name}`]
    : undefined

const albumTotalMinutes =
  manualAlbumDuration ??
  Math.round(
    albumTracks.reduce((total, track: any) => {
      return total + Number(track.duration || 0)
    }, 0) / 60
  )

  const Equalizer = ({ grid = false }: { grid?: boolean }) => (
  <div className={`flex items-end ${grid ? 'gap-1 h-5' : 'gap-0.5 h-3'}`}>
    <motion.div
      className={`${grid ? 'w-1' : 'w-0.5'} bg-primary rounded-full`}
      animate={{ height: ['30%', '80%', '45%', '65%', '30%'] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
    />

    <motion.div
      className={`${grid ? 'w-1' : 'w-0.5'} bg-primary rounded-full`}
      animate={{ height: ['45%', '25%', '85%', '50%', '45%'] }}
      transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
    />

    <motion.div
      className={`${grid ? 'w-1' : 'w-0.5'} bg-primary rounded-full`}
      animate={{ height: ['70%', '40%', '95%', '35%', '70%'] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
)

const selectedUserPlays = selectedTrack?.fromRecent
  ? Number(selectedTrackInfo?.userplaycount || 0)
  : Number(selectedTrack?.playcount || 0)

const albumMeta = `${albumTracks.length} faixas · ${albumTotalMinutes}min`

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
        src={
          user?.image?.[3]?.['#text']?.replace('300x300', '174s') ||
          'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
        }
        alt={USERNAME}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="absolute -bottom-2 -right-2 w-10 h-8 rounded-lg overflow-hidden shadow-xl rotate-12 hover:rotate-0 transition-transform duration-300">
      <svg viewBox="0 0 900 600" className="w-full h-full">
        <rect fill="#EEEEEE" width="900" height="200" />
        <rect fill="#22408C" y="200" width="900" height="200" />
        <rect fill="#BE0027" y="400" width="900" height="200" />
      </svg>
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

            <h4 className="text-2xl font-black text-[lab(90.7505_1.8031_7.45089)] mb-2 leading-tight">
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

            <a
  href={topArtist.url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-[#b5825f] hover:text-white transition-colors"
>
  <ExternalLink className="w-4 h-4 cursor-pointer" />
</a>
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
                  {selectedUserPlays}
                </div>
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">

  <span className="inline-flex items-center gap-1 px-2 py-0 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
    <Music className="w-2 h-2" />
    Música
  </span>

  {artistInfo?.ontour === '1' && (
    <span className="m1-3 inline-flex items-center gap-1 px-1.5 py-0 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
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

        <div className="overflow-y-auto max-h-[70vh] px-5 pb-5 space-y-3 modal-scrollbar">
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
      value: selectedUserPlays,
      title: `${selectedUserPlays} seus plays`,
      icon: Play,
      active: true,
    },
    {
      label: 'Do total global',
      value: selectedTrackInfo?.playcount
        ? `${((selectedUserPlays / Number(selectedTrackInfo.playcount)) * 100) < 0.01
    ? '<0.01%'
    : `${((selectedUserPlays / Number(selectedTrackInfo.playcount)) * 100).toFixed(2)}%`
  }`
        : '0%',
      title: selectedTrackInfo?.playcount
        ? `Você contribuiu com ${((selectedUserPlays / Number(selectedTrackInfo.playcount)) * 100).toFixed(4)}% dos plays globais`
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
                {selectedUserPlays} / {Number(selectedTrackInfo?.playcount || 0).toLocaleString()}
              </span>
            </div>

            <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                style={{
                  width: selectedTrackInfo?.playcount
                    ? `${Math.min((selectedUserPlays / Number(selectedTrackInfo.playcount)) * 100, 100)}%`
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

{/* COLEÇÃO DE ÁLBUNS */}
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="mt-12"
>
  <div className="mb-8">
  <div className="flex items-center gap-3 mb-2">
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
      <Disc3 className="w-5 h-5 text-primary" />
    </div>

    <div>
      <h2 className="text-3xl md:text-4xl font-black">
        Coleção de Álbuns
      </h2>

      <p className="text-muted-foreground text-sm">
        Os discos mais tocados da minha biblioteca
      </p>
    </div>
  </div>
</div>

  {/* TOP 3 */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
    {topAlbums.slice(0, 3).map((album, index) => (
      <motion.a
  key={album.name}
  onClick={() => {
  setSelectedAlbumInfo(null)
  setAlbumTracks([])
  setArtistInfo(null)
  setArtistTopTracks([])
  setSimilarArtists([])
  setShowFullAlbumBio(false)
  setShowFullBio(false)
  setSelectedAlbum(album)
}}
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.15 }}
  className={`flex flex-col items-center ${
    index === 0 ? 'md:order-first' : ''
  }`}
>
  <div className="relative group cursor-pointer mb-4">
    <motion.div
      whileHover={{ x: 30 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div
        className={`rounded-full bg-[#1a1a1a] relative ${
          index === 0
            ? 'w-52 h-52 md:w-60 md:h-60'
            : 'w-44 h-44 md:w-52 md:h-52'
        }`}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-[8%] rounded-full border border-white/[0.04]" />
          <div className="absolute inset-[16%] rounded-full border border-white/[0.06]" />
          <div className="absolute inset-[24%] rounded-full border border-white/[0.04]" />
          <div className="absolute inset-[32%] rounded-full border border-white/[0.06]" />
          <div className="absolute inset-[38%] rounded-full border border-white/[0.04]" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[35%] h-[35%] rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-background/80 border border-border" />
          </div>
        </div>
      </div>
    </motion.div>

    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/40 ${
        index === 0
          ? 'w-52 h-52 md:w-60 md:h-60'
          : 'w-44 h-44 md:w-52 md:h-52'
      }`}
    >
      <img
        src={
          album.image?.[3]?.['#text'] ||
          album.image?.[2]?.['#text'] ||
          'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'
        }
        alt={album.name}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute top-3 left-3 z-10">
        <div
          className={`w-8 h-8 rounded-full font-black text-xs shadow-lg flex items-center justify-center ${
            index === 0
              ? 'bg-primary text-primary-foreground'
              : 'bg-black/80 text-white'
          }`}
        >
          {index + 1}
        </div>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <div className="px-2.5 py-0 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1">
          <Headphones className="w-3 h-3" />
          {Number(album.playcount).toLocaleString()}
        </div>
      </div>
    </motion.div>
  </div>

  <div className="text-center max-w-[200px]">
    <h3 className="font-bold text-sm mb-0.5 line-clamp-1">
      {album.name}
    </h3>

    <p className="text-xs text-muted-foreground line-clamp-1">
      {album.artist?.name}
    </p>
  </div>
</motion.a>
    ))}
  </div>
  {/* RESTANTE DOS ÁLBUNS */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
  {topAlbums.slice(3, 10).map((album, index) => (
    <motion.a
      key={album.name}
      onClick={() => {
  setSelectedAlbumInfo(null)
  setAlbumTracks([])
  setArtistInfo(null)
  setArtistTopTracks([])
  setSimilarArtists([])
  setShowFullAlbumBio(false)
  setShowFullBio(false)
  setSelectedAlbum(album)
}}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
    >
      <div className="bg-card/40 border border-border/50 hover:border-primary/30 transition-all overflow-hidden rounded-xl py-5">
        <div className="p-2.5">
          <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
            <img
              src={
                album.image?.[3]?.['#text'] ||
                album.image?.[2]?.['#text'] ||
                'https://i.scdn.co/image/ab67616d00001e022bcab0a1c1049ab6fb434f19'
              }
              alt={album.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 text-white text-[10px] font-medium">
                <Play className="w-3 h-3 fill-white" />
                {Number(album.playcount).toLocaleString()} plays
              </div>
            </div>

            <div className="absolute top-1.5 left-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
                {index + 4}
              </span>
            </div>
          </div>

          <h4 className="text-[11px] font-medium line-clamp-1 mb-0.5">
            {album.name}
          </h4>

          <p className="text-[10px] text-muted-foreground line-clamp-1">
            {album.artist?.name}
          </p>
        </div>
      </div>
    </motion.a>
  ))}
</div>
</motion.div>
<AnimatePresence>
  {selectedAlbum && (
    <>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedAlbum(null)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-1/2 left-1/2 z-[10000] w-full max-w-[850px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-border/50 bg-[#120C07] shadow-lg p-0 gap-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden">
            
            <img
              src={
                manualAlbumImages[
  `${selectedAlbum.name}|${selectedAlbum.artist?.name}`
] ||
selectedAlbum.manualImage ||
selectedAlbum.image?.[3]?.['#text'] ||
selectedAlbum.image?.[2]?.['#text'] ||
                'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'
              }
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-card/80 to-card" />
          </div>

          <button
            onClick={() => setSelectedAlbum(null)}
            className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-background/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="relative p-5 pb-3.5">
            <div className="flex gap-4 items-start">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-2xl ring-2 ring-purple-500/40">
                  <img
                    src={
                      manualAlbumImages[
  `${selectedAlbum.name}|${selectedAlbum.artist?.name}`
] ||
selectedAlbum.manualImage ||
selectedAlbum.image?.[3]?.['#text'] ||
selectedAlbum.image?.[2]?.['#text'] ||
                      'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'
                    }
                    alt={selectedAlbum.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0 rounded-full bg-primary text-primary-foreground text-[10px] font-black shadow-lg flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  {selectedAlbum.playcount}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1 px-2 py-0 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Disc3 className="w-2.5 h-2.5" />
                  Álbum
                </span>

                {artistInfo?.ontour === '1' && (
  <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
    <Radio className="w-2.5 h-2.5" />
    Em turnê
  </span>
)}

                <h2 className="text-xl font-black text-foreground leading-tight mt-2 mb-1">
                  {selectedAlbum.name}
                </h2>

                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <MicVocal className="w-3.5 h-3.5" />
                  {selectedAlbum.artist?.name}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-2">
                  <span className="flex items-center gap-1">
                    <ListMusic className="w-3 h-3" />
                    {albumMeta}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[70vh] px-5 pb-5 space-y-3 modal-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="rounded-2xl border p-2 text-center bg-secondary/40 border-border/50">
              <Globe className="w-4 h-4 mx-auto mb-1.5 text-primary" />
              <p className="text-lg font-black text-foreground">
                {formatShort(Number(selectedAlbumInfo?.listeners || 0))}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Ouvintes
              </p>
            </div>

            <div className="rounded-2xl border p-2 text-center bg-secondary/40 border-border/50">
              <Headphones className="w-4 h-4 mx-auto mb-1.5 text-primary" />
              <p className="text-lg font-black text-foreground">
                {formatShort(Number(selectedAlbumInfo?.playcount || 0))}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Plays globais
              </p>
            </div>

            <div className="rounded-2xl border p-2 text-center bg-purple-500/10 border-purple-500/20">
              <Play className="w-4 h-4 mx-auto mb-1.5 text-purple-400 fill-current" />
              <p className="text-lg font-black text-purple-400">
                {selectedAlbum.playcount}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Seus plays
              </p>
            </div>

            <div className="rounded-2xl border p-2 text-center bg-secondary/40 border-border/50">
              <Percent className="w-4 h-4 mx-auto mb-1.5 text-primary" />
              <p className="text-lg font-black text-foreground">
                {selectedAlbumInfo?.playcount
                  ? (Number(selectedAlbum.playcount) / Number(selectedAlbumInfo.playcount)) * 100 < 0.01
                    ? '<0.01%'
                    : `${((Number(selectedAlbum.playcount) / Number(selectedAlbumInfo.playcount)) * 100).toFixed(2)}%`
                  : '0%'}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Do total global
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-secondary/30 border border-border/50 p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <ChartColumn className="w-3 h-3" />
                Sua contribuição
              </span>

              <span className="text-xs font-bold text-primary">
                {selectedAlbum.playcount} / {Number(selectedAlbumInfo?.playcount || 0).toLocaleString()}
              </span>
            </div>

            <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                style={{
                  width: selectedAlbumInfo?.playcount
                    ? `${Math.min((Number(selectedAlbum.playcount) / Number(selectedAlbumInfo.playcount)) * 100, 100)}%`
                    : '0%',
                }}
              />
            </div>
          </div>

          <div
  className={`grid grid-cols-1 gap-3 items-start ${
    hasAlbumSideInfo ? 'md:grid-cols-[1fr_400px]' : ''
  }`}
>
            {hasAlbumSideInfo && (
  <div className="space-y-3">

    {hasAlbumTags && (
      <div>
        <div className="flex items-center gap-1.5 mb-2">
  <Tag className="w-3.5 h-3.5 text-muted-foreground" />

  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
    Tags
  </p>
</div>

        <div className="flex flex-wrap gap-1.5">
          {albumTags.slice(0, 5).map((tag: any) => (
            <a
  key={tag.name}
  href={`https://www.last.fm/tag/${encodeURIComponent(tag.name)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="px-2 py-0 rounded-full bg-secondary/60 border border-border/50 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-secondary/80 transition-all"
>
  {tag.name}
</a>
          ))}
        </div>
      </div>
    )}

    {hasAlbumBio && (
      <div className="rounded-lg bg-secondary/20 border border-border/40 p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Sobre o álbum
          </p>

          {albumReleaseDate && (
            <span className="text-[9px] text-muted-foreground/50 flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              {albumReleaseDate}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {albumBioText
            ?.replace(/<a[^>]*>.*?<\/a>/g, '')
  ?.slice(0, showFullAlbumBio ? undefined : 260)}
          {!showFullAlbumBio && albumBioText.length > 260 ? '...' : ''}
        </p>

        {albumBioText.length > 260 && (
          <button
            onClick={() => setShowFullAlbumBio(!showFullAlbumBio)}
            className="text-[11px] text-primary mt-1 hover:text-foreground transition-colors flex items-center gap-1"
          >
            {showFullAlbumBio ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Menos
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Mais
              </>
            )}
          </button>
        )}
      </div>
    )}

  </div>
)}

            

            <div className="self-start">
  <div className="flex items-center justify-between mb-2 px-1">
  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
    <ListMusic className="w-3 h-3" />
    Faixas
  </p>

  <span className="text-[10px] text-muted-foreground">
    {albumMeta}
  </span>
</div>

  <div className="rounded-lg bg-secondary/20 border border-border/50 overflow-hidden divide-y divide-border/30 max-h-[250px] overflow-y-auto modal-scrollbar">
  {albumTracks.map((track: any, index: number) => (
    <a
      key={track.name}
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-2.5 py-1 hover:bg-secondary/40 transition-colors group"
    >
      <span className="w-5 text-center text-[11px] font-bold text-muted-foreground/60 group-hover:text-primary transition-colors">
        {index + 1}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {track.name}
        </p>
      </div>

      <span className="text-[11px] text-muted-foreground/60 flex-shrink-0">
  {manualTrackDurations[
    `${selectedAlbum.name}|${selectedAlbum.artist?.name}|${track.name}`
  ] ||
    (track.duration
      ? `${Math.floor(Number(track.duration) / 60)}:${String(
          Number(track.duration) % 60
        ).padStart(2, '0')}`
      : '--:--')}
</span>
    </a>
  ))}
</div>
</div>
<div className="rounded-lg bg-gradient-to-br from-secondary/40 via-secondary/20 to-transparent border border-border/50 overflow-hidden col-span-full w-full">
  <div className="p-3">
    <div className="flex items-start gap-3 mb-2">
      <div className="w-10 h-10 rounded-lg bg-secondary/40 border border-border/30 flex items-center justify-center flex-shrink-0">
        <MicVocal className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-sm font-bold text-foreground">
            {selectedAlbum.artist?.name}
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
              className="px-2 py-0 rounded-full bg-background/40 text-[9px] text-muted-foreground"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>

    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
  {artistBioText
    ?.replace(/<a[^>]*>.*?<\/a>/g, '')
    ?.slice(0, showFullBio ? undefined : 260) ||
    'Sem informações disponíveis para este artista.'}

  {!showFullBio && artistBioText.length > 260 ? '...' : ''}
</p>

{artistBioText.length > 260 && (
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
          </div>
          

          <a
            href={`https://www.last.fm/music/${normalizeLastFmArtist(selectedAlbum.artist?.name || '').replaceAll(' ', '+')}/${selectedAlbum.name.replaceAll(' ', '+')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold transition-all bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver no Last.fm
          </a>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.4 }}
  className="mt-12 bg-card/50 border border-border/50 rounded-2xl pt-10 px-6 pb-6"
>
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Clock className="w-5 h-5 text-primary" />
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground">
          Ouvido Recentemente
        </h3>

        <p className="text-xs text-muted-foreground">
          Últimas {recentTracks.length} faixas
        </p>
      </div>
    </div>

    <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
      <button
        onClick={() => setRecentView('list')}
        className={`p-2 rounded-md transition-all ${
          recentView === 'list'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <LayoutList className="w-4 h-4" />
      </button>

      <button
        onClick={() => setRecentView('grid')}
        className={`p-2 rounded-md transition-all ${
          recentView === 'grid'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  </div>

  <AnimatePresence mode="wait">
    {recentView === 'list' ? (
      <motion.div
        key="list"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-2"
      >
        {recentTracks.map((track, index) => {
  const artistName = track.artist?.['#text'] || track.artist?.name || ''

const image =
  manualRecentTrackImages[`${track.name}|${artistName}`] ||
  track.image?.[3]?.['#text'] ||
  track.image?.[2]?.['#text'] ||
  track.image?.[1]?.['#text'] ||
  'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'

  const isNowPlaying = Boolean(track['@attr']?.nowplaying)

  return (
            <div
              key={`${track.name}-${index}`}
              onClick={() => {
  setSelectedTrackInfo(null)
  setSimilarTracks([])
  setArtistInfo(null)
  setArtistTopTracks([])
  setSimilarArtists([])
  setShowFullBio(false)

  setSelectedTrack({
    ...track,
    playcount: 0,
fromRecent: true,
    artist: {
      name: track.artist?.['#text'] || track.artist?.name || '',
    },
    appleImage:
  manualRecentTrackImages[`${track.name}|${artistName}`] ||
  track.image?.[3]?.['#text'] ||
  track.image?.[2]?.['#text'] ||
  track.image?.[1]?.['#text'] ||
  '',
  })
}}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all cursor-pointer ${
  isNowPlaying
    ? 'bg-primary/10 border border-primary/30'
    : 'bg-secondary/30 hover:bg-secondary/50'
}`}
            >
              <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={image}
                  alt={track.name}
                  className="w-full h-full object-cover"
                />
                {isNowPlaying && (
  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
    <Equalizer />
  </div>
)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-foreground truncate">
                    {track.name}
                  </p>
                  {isNowPlaying && (
  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium flex-shrink-0">
    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
    Tocando
  </span>
)}
                  
                </div>

                

                <p className="text-sm text-muted-foreground truncate">
                  {track.artist?.['#text']} • {track.album?.['#text']}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span
  className={`text-xs ${
    isNowPlaying
      ? 'text-primary font-medium'
      : 'text-muted-foreground'
  }`}
>
  {isNowPlaying ? 'Tocando agora' : formatRecentTime(track)}
</span>

                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )
        })}
      </motion.div>
    ) : (
      <motion.div
        key="grid"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5"
      >
        {recentTracks.map((track, index) => {
  const artistName = track.artist?.['#text'] || track.artist?.name || ''

const image =
  manualRecentTrackImages[`${track.name}|${artistName}`] ||
  track.image?.[3]?.['#text'] ||
  track.image?.[2]?.['#text'] ||
  track.image?.[1]?.['#text'] ||
  'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'

  const isNowPlaying = Boolean(track['@attr']?.nowplaying)

  return (
            <div
              key={`${track.name}-${index}`}
              onClick={() => {
  setSelectedTrackInfo(null)
  setSimilarTracks([])
  setArtistInfo(null)
  setArtistTopTracks([])
  setSimilarArtists([])
  setShowFullBio(false)

  setSelectedTrack({
    ...track,
    playcount: 0,
fromRecent: true,
    artist: {
      name: track.artist?.['#text'] || track.artist?.name || '',
    },
    appleImage:
  manualRecentTrackImages[
    `${track.name}|${track.artist?.['#text'] || track.artist?.name || ''}`
  ] ||
  track.image?.[3]?.['#text'] ||
  track.image?.[2]?.['#text'] ||
  track.image?.[1]?.['#text'] ||
  '',
  })
}}
              className={`group cursor-pointer rounded-lg p-3 transition-all ${
  isNowPlaying
    ? 'bg-primary/10 border border-primary/30'
    : 'bg-secondary/30 hover:bg-secondary/50'
}`}
            >
              <div className="relative aspect-square rounded-md overflow-hidden mb-3">
  <img
    src={image}
    alt={track.name}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
  />

  {isNowPlaying && (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
      <Equalizer grid />
    </div>
  )}
</div>

              <p className="text-sm font-medium text-foreground truncate">
                {track.name}
              </p>
              

              

              <p className="text-xs text-muted-foreground truncate mb-2">
  {track.artist?.['#text']}
</p>

{isNowPlaying && (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
    Tocando
  </span>
)}
            </div>
          )
        })}
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
    </motion.div>

    
  )
}

