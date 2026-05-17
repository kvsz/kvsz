'use client'

import { useEffect, useState } from 'react'
import { Eye, Star, Film, Tv, Heart, ThumbsUp, X, Sparkles, Info, Users, Camera, Clapperboard, ChevronDown, ChevronUp, ChevronRight, Search, LayoutGrid, Clock3, EyeIcon, Circle, XCircle, Trophy, ArrowUpDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'

interface TMDBItem {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  release_date?: string
  first_air_date?: string
  overview: string
  customRating?: number
  favorite?: boolean
  recommended?: boolean
  status?: string
  media_type?: string
  type?: string
  cast?: string[]
  director?: string
  creator?: string
  original_title?: string
  original_name?: string
  runtime?: number
  episode_run_time?: number[]
  genres?: {id: number; name: string }[]
  number_of_seasons?: number
  last_air_date?: string
  number_of_episodes?: number
}

export default function MoviesTab() {
  const [items, setItems] = useState<TMDBItem[]>([])
  const [selectedItem, setSelectedItem] = useState<TMDBItem | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedOverview, setExpandedOverview] = useState(false)

  useEffect(() => {
    async function fetchMovies() {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

      const favorites = [
{
    query: 'Star Wars: Episódio III - A Vingança dos Sith',
    type: 'movie',
    rating: 10,
    favorite: true,
    recommended: true,
    status: 'assistido',
  },
  {
    query: 'Dexter',
    type: 'tv',
    rating: 10,
    favorite: true,
    recommended: true,
    status: 'assistido',
  },
]

      const results = await Promise.all(
        favorites.map(async (item) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(item.query)}&language=pt-BR`
          )

          const data = await response.json()

          const match = data.results?.find((result: any) => {
            if (item.type === 'movie') return result.media_type === 'movie'
            return result.media_type === item.type
          }) || data.results?.[0]

          const creditsResponse = await fetch(
  `https://api.themoviedb.org/3/${item.type === 'movie' ? 'movie' : 'tv'}/${match.id}/credits?api_key=${apiKey}&language=pt-BR`
)

const detailsResponse = await fetch(
  `https://api.themoviedb.org/3/${item.type === 'movie' ? 'movie' : 'tv'}/${match.id}?api_key=${apiKey}&language=pt-BR`
)

const detailsData = await detailsResponse.json()

const creditsData = await creditsResponse.json()

const cast = creditsData.cast?.slice(0, 6).map((person: any) => person.name) || []

const director =
  item.type === 'movie'
    ? creditsData.crew?.find((person: any) => person.job === 'Director')?.name
    : undefined

const creator =
  item.type === 'tv'
    ? detailsData.created_by?.[0]?.name ||
      creditsData.crew?.find((person: any) => person.job === 'Creator' || person.job === 'Executive Producer')?.name
    : undefined

          return {
            ...match,
            ...detailsData,
            customRating: item.rating,
            favorite: item.favorite,
            recommended: item.recommended,
            status: item.status,
            type: item.type,
            cast,
            director,
            creator,
          }
        })
      )

      setItems(results.filter(Boolean))
    }

    fetchMovies()
  }, [])

  const averageRating =
    items.length > 0
      ? (items.reduce((acc, item) => acc + (item.customRating || 0), 0) / items.length).toFixed(1)
      : '0.0'
const filteredItems = items.filter((item: any) => {
  const matchesSearch =
    (item.title || item.name)
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    item.overview?.toLowerCase().includes(search.toLowerCase())

  const matchesType =
    typeFilter === 'all'
      ? true
      : typeFilter === 'movie'
      ? item.media_type === 'movie'
      : item.media_type === 'tv'

  const matchesStatus =
    statusFilter === 'all'
      ? true
      : item.status === statusFilter

  return matchesSearch && matchesType && matchesStatus
})

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-secondary/30 border border-border/50 p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-black text-foreground">{items.length}</p>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Assistidos
            </p>
          </div>

          <div className="rounded-xl bg-secondary/30 border border-border/50 p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{averageRating}</p>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Nota Média
            </p>
          </div>

          <div className="rounded-xl bg-secondary/30 border border-border/50 p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Film className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-foreground">
              {items.filter((item) => item.type === 'movie').length}
            </p>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Filmes
            </p>
          </div>

          <div className="rounded-xl bg-secondary/30 border border-border/50 p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Tv className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-foreground">
              {items.filter((item) => item.type === 'tv').length}
            </p>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Séries
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="mb-6"
      >
        <div className="relative bg-[#120C07] rounded-2xl border border-border/60 overflow-hidden">
          <div className="flex items-center gap-2 px-5 pt-4 pb-3">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Favoritos
            </h3>
          </div>

          <div className="grid gap-0 grid-cols-1 md:grid-cols-2">
            {items.map((item) => {
              const title = item.title || item.name
              const year = (item.release_date || item.first_air_date || '').slice(0, 4)
              const typeLabel = item.type === 'movie' ? 'Filme Favorito' : 'Série Favorita'

              return (
                <div
  key={item.id}
  onClick={() => {
    setSelectedItem(item)
    setExpandedOverview(false)
  }}
  className="group relative min-h-[250px] overflow-hidden cursor-pointer transition-all duration-500 hover:border-primary/40"
>
                  <div className="absolute inset-0">
                    <img
                      src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
                      alt=""
                      className="w-full h-full object-cover opacity-100 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-card/70 via-card/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                    
                    
                  </div>
<div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-[#b5825f] to-transparent opacity-80 z-20" />

                  <div className="absolute top-4 right-4 z-20 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
  <div className="flex items-center gap-1.5 px-3 py-0 rounded-full bg-black/40 border border-white/15 text-white text-[11px] font-bold backdrop-blur-sm">
    <Info className="w-3 h-3" />
    Detalhes
  </div>
</div>

                  <div className="relative z-10 h-full flex items-end gap-4 p-5">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={title}
                      className="w-24 h-36 rounded-xl object-cover shadow-2xl"
                    />

                    <div className="pb-1">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-sm w-fit mb-1">
  <Heart className="w-2.5 h-2.5 text-red-400 fill-red-400" />

  <span className="text-[10px] leading-none font-bold text-red-300 uppercase tracking-wider">
    {typeLabel}
  </span>
</div>

                      <h2 className="text-xl font-black text-foreground leading-tight transition-colors duration-300 group-hover:text-[#b5825f]">
                        {title}
                      </h2>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
  {item.type === 'movie' ? (
    <>
      <span>{year}</span>

      {item.genres?.slice(0, 2).map((genre, index) => (
  <span key={genre.id} className="flex items-center gap-1.5">
    {index === 0 ? (
      <span className="ml-1 w-1 h-1 rounded-full bg-white/30" />
    ) : (
      <span>·</span>
    )}

    <span>{genre.name}</span>
  </span>
))}

      {item.runtime && (
        <span>
          • {Math.floor(item.runtime / 60)}h {item.runtime % 60}m
        </span>
      )}
    </>
  ) : (
    <>
      <span>
        {(item.first_air_date || '').slice(0, 4)}
        {item.last_air_date ? `-${item.last_air_date.slice(0, 4)}` : ''}
      </span>

      {item.genres?.slice(0, 1).map((genre) => (
        <span key={genre.id}>• {genre.name}</span>
      ))}
    </>
  )}
</div>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.round((item.customRating || 0) / 2)
                                  ? 'fill-current'
                                  : 'fill-transparent opacity-40'
                              }`}
                            />
                          ))}
                        </div>

                        <span className="text-xs font-bold text-foreground">
                          {item.customRating}
                        </span>

                        {item.recommended && (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <ThumbsUp className="w-3 h-3" />
                            Recomendo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15, duration: 0.5 }}
  className="mb-6"
>
  <div className="rounded-2xl border border-[#201710]/50 bg-[rgba(28,22,12,0.32)] p-4 space-y-3">

    <div className="flex items-center gap-3">

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />

        <input
          type="text"
          placeholder="Buscar por título, gênero, diretor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-secondary/40 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
        />
      </div>

      <span className="text-xs text-muted-foreground/60 font-medium whitespace-nowrap">
        {filteredItems.length} títulos
      </span>
    </div>

    <div className="flex flex-wrap items-center gap-2">

      <div className="flex items-center gap-0.5 bg-secondary/30 rounded-lg p-0">

        <button
          onClick={() => setTypeFilter('all')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
            typeFilter === 'all'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutGrid className="w-3 h-3" />
          Todos
        </button>

        <button
          onClick={() => setTypeFilter('movie')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
            typeFilter === 'movie'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Film className="w-3 h-3" />
          Filmes
        </button>

        <button
          onClick={() => setTypeFilter('series')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
            typeFilter === 'series'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Tv className="w-3 h-3" />
          Séries
        </button>
      </div>

      <div className="w-px h-5 bg-border/50 hidden sm:block" />

      <div className="flex items-center gap-0.5 bg-secondary/30 rounded-lg p-0.5">

        <button
          onClick={() => setStatusFilter('all')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
            statusFilter === 'all'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutGrid className="w-3 h-3" />
          <span className="hidden sm:inline">Todos</span>
        </button>

        <button
          onClick={() => setStatusFilter('assistido')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
            statusFilter === 'assistido'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock3 className="w-3 h-3" />
          <span className="hidden sm:inline">Completo</span>
        </button>

        <button
          onClick={() => setStatusFilter('assistindo')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
            statusFilter === 'assistindo'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <EyeIcon className="w-3 h-3" />
          <span className="hidden sm:inline">Assistindo</span>
        </button>

        <button
          onClick={() => setStatusFilter('pretendo')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
            statusFilter === 'pretendo'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock3 className="w-3 h-3" />
          <span className="hidden sm:inline">Pretendo</span>
        </button>

        <button
          onClick={() => setStatusFilter('dropado')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
            statusFilter === 'dropado'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <XCircle className="w-3 h-3" />
          <span className="hidden sm:inline">Abandonado</span>
        </button>
      </div>
</div>

<div className="flex flex-wrap items-center gap-2 pt-1">

      <div className="flex flex-wrap items-center gap-2">

  <div className="relative">
    <button className="flex items-center gap-1.5 px-3 py-0.5 rounded-lg text-[11px] font-semibold transition-all border bg-secondary/40 text-muted-foreground border-border/50 hover:text-foreground hover:border-border">

      <LayoutGrid className="w-3 h-3" />

      Gênero

      <ChevronDown className="w-3 h-3 transition-transform" />
    </button>
  </div>

  <div className="w-px h-5 bg-border/50 hidden sm:block" />

  <div className="relative">
    <button className="flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-secondary/40 border border-border/50 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-all">

      <ArrowUpDown className="w-3 h-3" />

      Maior nota

      <ChevronDown className="w-3 h-3 transition-transform" />
    </button>
  </div>

</div>
    </div>
  </div>
</motion.div>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.5 }}
  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
>
  {filteredItems.map((item) => {
    return (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={() => {
          setSelectedItem(item)
          setExpandedOverview(false)
        }}
        className="group cursor-pointer h-full"
      >
        <div className="relative h-full bg-card rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 flex flex-col min-h-[340px]">
  <div className="relative w-full h-24 overflow-hidden">
    <img
      src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
      alt={item.title || item.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

    <div className="absolute top-2 left-2">
      <Heart className="w-5 h-5 text-red-500 fill-red-500 drop-shadow-lg" />
    </div>

    <div className="absolute top-2 right-2">
      <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold">
        {item.type === 'movie'
          ? `${Math.floor((item.runtime || 0) / 60)}h ${(item.runtime || 0) % 60}m`
          : `${item.number_of_seasons} temp`}
      </span>
    </div>
  </div>

  <div className="relative flex gap-0 flex-1">
    <div className="relative w-[110px] sm:w-[130px] flex-shrink-0 overflow-hidden self-stretch">
      <img
        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
        alt={item.title || item.name}
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
      />
    </div>

    <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
  className={`inline-flex items-center gap-1 px-2 py-[4px] rounded-md text-[9px] font-bold uppercase tracking-wider leading-none ${
              item.type === 'movie'
                ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                : 'bg-blue-500/15 text-blue-500 border border-blue-500/20'
            }`}
          >
            {item.type === 'movie' ? (
              <Film className="w-2.5 h-2.5" />
            ) : (
              <Tv className="w-2.5 h-2.5" />
            )}

            {item.type === 'movie' ? 'Filme' : 'Série'}
          </span>

          <span className="text-[11px] text-muted-foreground/60 font-medium">
            {item.type === 'movie'
              ? item.release_date?.slice(0, 4)
              : `${item.first_air_date?.slice(0, 4)}-${item.last_air_date?.slice(0, 4)}`}
          </span>
        </div>

        <h3 className="text-base font-bold leading-tight mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {item.title || item.name}
        </h3>

        <p className="text-xs text-muted-foreground/60 mb-2 line-clamp-1">
          {item.genres?.slice(0, 2).map((g) => g.name).join(' · ')}
        </p>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="relative w-11 h-11 rounded-xl flex items-center justify-center ring-2 shadow-lg bg-emerald-500 ring-emerald-500/30">
            <span className="text-white text-base font-black leading-none">
              {item.customRating}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-0.5 text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round((item.customRating || 0) / 2)
                      ? 'fill-current'
                      : 'fill-transparent opacity-40'
                  }`}
                />
              ))}
            </div>

            {item.recommended && (
              <span className="flex items-center gap-0.5 text-[10px] text-emerald-500 font-medium">
                <ThumbsUp className="w-2.5 h-2.5" />
                Recomendo
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2 mb-2">
          {item.overview}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
            <Trophy className="w-2.5 h-2.5" />
            Completo
          </span>

          <span className="text-[10px] text-muted-foreground/60 font-medium">
            {item.type === 'movie'
              ? `${Math.floor((item.runtime || 0) / 60)}h ${(item.runtime || 0) % 60}m`
              : `${item.number_of_seasons} temp`}
          </span>
        </div>
      </div>
    </div>

    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
      <div className="w-8 h-8 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20">
        <ChevronRight className="w-4 h-4 text-primary" />
      </div>
    </div>
  </div>
</div>
      </motion.div>
    )
  })}
</motion.div>

      {selectedItem && createPortal((
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setSelectedItem(null)}
    className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-2 sm:p-4"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 40 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-3xl h-[95vh] bg-background border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      <div className="relative h-48 sm:h-64 overflow-hidden flex-shrink-0">
        <img
          src={`https://image.tmdb.org/t/p/w1280${selectedItem.backdrop_path}`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

        <button
          onClick={() => setSelectedItem(null)}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white flex items-center justify-center transition-all hover:scale-110 border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
          <div className="flex gap-4 sm:gap-5 items-end">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1.5 bg-gradient-to-br rounded-xl blur-md opacity-40 from-emerald-500/30 to-emerald-500/5" />

              <div className="relative w-20 h-28 sm:w-24 sm:h-36 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-2 -right-2 w-11 h-11 rounded-xl flex items-center justify-center border-2 border-background z-10 ring-2 shadow-lg bg-emerald-500 ring-emerald-500/30">
                <span className="text-white text-sm font-black">
                  {selectedItem.customRating}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
    selectedItem.type === 'movie'
      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
  }`}
>
  {selectedItem.type === 'movie' ? (
    <Film className="w-2.5 h-2.5" />
  ) : (
    <Tv className="w-2.5 h-2.5" />
  )}

  {selectedItem.type === 'movie' ? 'Filme' : 'Série'}
</span>

                <span className="text-[11px] text-white/50 font-medium">
  {selectedItem.type === 'movie'
    ? (selectedItem.release_date || '').slice(0, 4)
    : `${(selectedItem.first_air_date || '').slice(0, 4)}-${(selectedItem.last_air_date || '').slice(0, 4)}`}
</span>

                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight line-clamp-2 tracking-tight">
                {selectedItem.title || selectedItem.name}
              </h2>

              <p className="text-[11px] text-white/30 italic">
  {selectedItem.original_title || selectedItem.original_name}
</p>

<div className="flex flex-wrap items-center gap-2 text-white/50 text-xs">
  <span className="font-medium">
  {selectedItem.genres
    ?.slice(0, 2)
    .map((genre) => genre.name)
    .join(' · ')}
</span>

  {selectedItem.genres && selectedItem.genres.length > 0 && (
    <span className="w-1 h-1 rounded-full bg-white/20" />
  )}

  {selectedItem.type === 'movie' && selectedItem.runtime && (
    <span>
      {Math.floor(selectedItem.runtime / 60)}h {selectedItem.runtime % 60}m
    </span>
  )}

  {selectedItem.type === 'tv' && selectedItem.number_of_seasons && (
  <span>
    {selectedItem.number_of_seasons} Temporada
    {selectedItem.number_of_seasons > 1 ? 's' : ''}
  </span>
)}
</div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round((selectedItem.customRating || 0) / 2)
                          ? 'fill-current'
                          : 'fill-transparent opacity-40'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-[10px] text-white/40 font-medium ml-1">
                  TMDb {selectedItem.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-5 sm:p-7 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-emerald-500">
              🏆 Concluído
            </span>

            <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />

            <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
              <ThumbsUp className="w-3 h-3" />
              Recomendo
            </span>
          </div>

          <div className="relative">
            <div className="absolute -left-1 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary to-primary/20" />

            <div className="pl-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />

                <h4 className="text-sm font-medium text-foreground">
                  Minha Review
                </h4>

                <span className="ml-auto text-primary font-black text-lg">
                  {selectedItem.customRating}
                  <span className="text-xs text-muted-foreground font-normal">/10</span>
                </span>
              </div>
            </div>
          </div>

          <div>
            <div>
              </div>
  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
    <Info className="w-3.5 h-3.5 text-muted-foreground" />
    Sinopse
  </h4>

  <p
    className={`text-sm text-muted-foreground leading-relaxed ${
      expandedOverview ? '' : 'line-clamp-4'
    }`}
  >
    {selectedItem.overview}
  </p>

  {selectedItem.overview.length > 220 && (
    <button
  onClick={() => setExpandedOverview(!expandedOverview)}
  className="mt-2 flex items-center gap-1 text-xs text-primary font-medium hover:text-primary/80 transition-colors"
>
  {expandedOverview ? (
    <>
      <ChevronUp className="w-3 h-3" />
      Ler menos
    </>
  ) : (
    <>
      <ChevronDown className="w-3 h-3" />
      Ler mais
    </>
  )}
</button>
  )}
</div>

{selectedItem.cast && selectedItem.cast.length > 0 && (
  <div>
    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
      <Users className="w-3.5 h-3.5 text-muted-foreground" />
      Elenco
    </h4>

    <div className="flex gap-4 overflow-x-auto pb-2">
      {selectedItem.cast.map((name, index) => {
        const initials = name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)

        return (
          <div
            key={index}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-border/40 shadow-sm">
              <span className="text-xs font-bold text-primary/60">
                {initials}
              </span>
            </div>

            <p className="text-[9px] font-semibold text-center line-clamp-2">
              {name}
            </p>
          </div>
        )
      })}
    </div>
  </div>
)}

{(selectedItem.director || selectedItem.creator) && (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div className="rounded-xl bg-secondary/30 border border-border/50 p-3">
      <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
        {selectedItem.type === 'movie' ? (
  <Camera className="w-3 h-3" />
) : (
  <Clapperboard className="w-3 h-3 text-primary/60" />
)}
        {selectedItem.type === 'movie' ? 'Direção' : 'Criação'}
      </p>

      <p className="text-sm font-medium text-foreground mt-1">
        {selectedItem.director || selectedItem.creator}
      </p>
    </div>
  </div>
)}

          <div
  className={`grid gap-3 ${
    selectedItem.type === 'movie'
      ? 'grid-cols-2 sm:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-3'
  }`}
>
  <div className="rounded-xl bg-secondary/30 border border-border/50 p-3">
    <p className="text-[10px] text-muted-foreground uppercase font-bold">
      Ano
    </p>

    <p className="text-sm font-black text-foreground">
      {selectedItem.type === 'movie'
        ? (selectedItem.release_date || '').slice(0, 4)
        : `${(selectedItem.first_air_date || '').slice(0, 4)}-${(selectedItem.last_air_date || '').slice(0, 4)}`}
    </p>
  </div>

  {selectedItem.type === 'movie' && selectedItem.runtime && (
    <div className="rounded-xl bg-secondary/30 border border-border/50 p-3">
      <p className="text-[10px] text-muted-foreground uppercase font-bold">
        Duração
      </p>

      <p className="text-sm font-black text-foreground">
        {Math.floor(selectedItem.runtime / 60)}h{' '}
        {selectedItem.runtime % 60}m
      </p>
    </div>
  )}

  {selectedItem.type === 'tv' && (
    <>
      <div className="rounded-xl bg-secondary/30 border border-border/50 p-3">
        <p className="text-[10px] text-muted-foreground uppercase font-bold">
          Temporadas
        </p>

        <p className="text-sm font-black text-foreground">
          {selectedItem.number_of_seasons}
        </p>
      </div>

      <div className="rounded-xl bg-secondary/30 border border-border/50 p-3">
        <p className="text-[10px] text-muted-foreground uppercase font-bold">
          Episódios
        </p>

        <p className="text-sm font-black text-foreground">
          {selectedItem.number_of_episodes}
        </p>
      </div>
    </>
  )}

  <div className="rounded-xl bg-secondary/30 border border-border/50 p-3">
    <p className="text-[10px] text-muted-foreground uppercase font-bold">
      TMDb
    </p>

    <p className="text-sm font-black text-foreground">
      {selectedItem.vote_average.toFixed(1)}
    </p>
  </div>
</div>
        </div>
      </div>
    </motion.div>
  </motion.div>
), document.body)}
    </div>
  )
}