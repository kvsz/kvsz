import {
  NextRequest,
  NextResponse,
} from 'next/server'

import { decode } from 'he'

type YouTubeSearchItem = {
  id?: {
    videoId?: string
  }
  snippet?: {
    title?: string
    channelTitle?: string
    thumbnails?: {
      high?: {
        url?: string
      }
      medium?: {
        url?: string
      }
      default?: {
        url?: string
      }
    }
  }
}

type YouTubeSearchResponse = {
  items?: YouTubeSearchItem[]
  error?: {
    message?: string
  }
}

type YouTubeVideosResponse = {
  items?: Array<{
    id?: string
    statistics?: {
      viewCount?: string
    }
    contentDetails?: {
      duration?: string
    }
  }>
}

type RankedVideo = {
  videoId: string
  title: string
  channel: string
  thumbnail: string
  score: number
  viewCount: number
  durationSeconds: number
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(
      /\b(feat|ft|featuring|official|video|audio|lyrics|lyric|visualizer|hd|4k)\b/g,
      ' ',
    )
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeForDetection(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getWords(value: string) {
  return normalizeText(value)
    .split(' ')
    .filter((word) => word.length > 1)
}

function countMatchingWords(
  source: string,
  expectedWords: string[],
) {
  const normalizedSource = normalizeText(source)

  return expectedWords.filter((word) =>
    normalizedSource.includes(word),
  ).length
}

function scoreVideo(
  titleValue: string,
  channelValue: string,
  song: string,
  artist: string,
) {
  const title = normalizeText(titleValue)
  const channel = normalizeText(channelValue)

  const descriptiveTitle = titleValue
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .toLowerCase()
  .replace(/&amp;/g, '&')
  .replace(/[^a-z0-9]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

  const normalizedSong = normalizeText(song)
  const normalizedArtist = normalizeText(artist)

  const songWords = getWords(song)
  const artistWords = getWords(artist)

  const songMatches = countMatchingWords(
    titleValue,
    songWords,
  )

  const artistMatchesInTitle =
    countMatchingWords(
      titleValue,
      artistWords,
    )

  const artistMatchesInChannel =
    countMatchingWords(
      channelValue,
      artistWords,
    )

  let score = 0

  if (title.includes(normalizedSong)) {
    score += 100
  }

  if (
    title.includes(normalizedSong) &&
    title.includes(normalizedArtist)
  ) {
    score += 100
  }

  if (
    title.startsWith(normalizedSong) ||
    title.startsWith(normalizedArtist)
  ) {
    score += 25
  }

  if (songWords.length > 0) {
    score +=
      (songMatches / songWords.length) * 70
  }

  if (artistWords.length > 0) {
    score +=
      (artistMatchesInTitle /
        artistWords.length) *
      35

    score +=
      (artistMatchesInChannel /
        artistWords.length) *
      60
  }

  if (
  channel.endsWith(' topic') ||
  channel.includes(' vevo')
) {
  score += 120
}

  if (
  descriptiveTitle.includes('official audio') ||
  descriptiveTitle.includes('official video') ||
  descriptiveTitle.includes(
    'official music video',
  )
) {
  score += 120
}

if (descriptiveTitle.includes('visualizer')) {
  score += 40
}

  const unwantedVersions = [
  'sped up',
  'speed up',
  'speedup',
  'slowed',
  'slowed down',
  'slow down',
  'reverb',
  'nightcore',
  'pitch',
  'bass boosted',
  '8d',
  'remix',
  'edit',
  'cover',
  'reaction',
  'tutorial',
  'karaoke',
  'instrumental',

  'lyrics',
  'lyric',
  'lyric video',
  'lyrics video',
  'with lyrics',

  'live',
  'ao vivo',
  'concert',
  'performance',
  'unplugged',
  'full album',
  'compilation',
  'playlist',
]

  for (const term of unwantedVersions) {
    const normalizedTerm =
      normalizeText(term)

    const resultHasTerm =
  descriptiveTitle.includes(normalizedTerm)

    const requestedHasTerm =
      normalizedSong.includes(normalizedTerm)

    if (resultHasTerm && !requestedHasTerm) {
      score -= 400
    }
  }

  if (songMatches === 0) {
    score -= 200
  }

  return score
}

function scoreManualVideo(
  titleValue: string,
  channelValue: string,
  queryValue: string,
) {
  const title = normalizeText(titleValue)
  const channel = normalizeText(channelValue)
  const query = normalizeText(queryValue)

  const detectionTitle =
    normalizeForDetection(titleValue)

  const detectionChannel =
    normalizeForDetection(channelValue)

  const detectionQuery =
    normalizeForDetection(queryValue)

  const queryWords =
    getWords(queryValue)

    const combinedSource =
  `${titleValue} ${channelValue}`

const combinedMatches =
  countMatchingWords(
    combinedSource,
    queryWords,
  )

  const matches =
    countMatchingWords(
      titleValue,
      queryWords,
    )

  let score = 0

  // Quanto mais palavras da pesquisa aparecerem
// no título OU no canal/artista, melhor.
if (queryWords.length > 0) {
  const matchRatio =
    combinedMatches / queryWords.length

  score += matchRatio * 500

  // Se TODAS as palavras aparecem entre
  // título + artista/canal, bônus enorme.
  if (combinedMatches === queryWords.length) {
    score += 500
  }

  // Se quase nada bate, derruba o resultado.
  if (matchRatio < 0.5) {
    score -= 600
  }
}

  if (title === query) {
    score += 220
  }

  if (title.includes(query)) {
    score += 140
  }

  if (title.startsWith(query)) {
    score += 40
  }

  if (queryWords.length > 0) {
    score +=
      (matches / queryWords.length) *
      100
  }

  if (channel.endsWith(' topic')) {
  score += 10
}

if (channel.includes(' vevo')) {
  score += 25
}

  const unwantedVersions = [
  // Lyrics / letras
  'lyrics',
  'lyric',
  'lyric video',
  'lyrics video',
  'with lyrics',
  'letra',
  'com letra',
  'legendado',
  'legendada',

  // Versões modificadas
  'sped up',
  'speed up',
  'speedup',
  'slowed',
  'slowed down',
  'slow down',
  'reverb',
  'slowed reverb',
  'slowed and reverb',
  'nightcore',
  'pitch',
  'pitch up',
  'pitch down',
  'bass boosted',
  '8d',

  // Versões alternativas
  'remix',
  'edit',
  'cover',
  'cover version',
  'karaoke',
  'instrumental',

  // Conteúdo que normalmente não queremos
  'reaction',
  'tutorial',

  // Ao vivo
  'live',
  'ao vivo',
  'concert',
  'performance',
  'unplugged',

  // Outros
  'full album',
  'compilation',
  'playlist',
]

  for (const term of unwantedVersions) {
  const normalizedTerm =
    normalizeForDetection(term)

  const resultHasTerm =
    detectionTitle.includes(normalizedTerm) ||
    detectionChannel.includes(normalizedTerm)

  const userRequestedTerm =
    detectionQuery.includes(normalizedTerm)

  if (
    resultHasTerm &&
    !userRequestedTerm
  ) {
    score -= 1000
  }
}

  return score
}

function parseYouTubeDuration(
  duration: string,
) {
  const match = duration.match(
    /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/,
  )

  if (!match) {
    return 0
  }

  const hours =
    Number(match[1] ?? 0)

  const minutes =
    Number(match[2] ?? 0)

  const seconds =
    Number(match[3] ?? 0)

  return (
    hours * 3600 +
    minutes * 60 +
    seconds
  )
}

export async function GET(
  request: NextRequest,
) {
const manualQuery =
  request.nextUrl.searchParams
    .get('q')
    ?.trim() ?? ''

  const song =
    request.nextUrl.searchParams
      .get('song')
      ?.trim() ?? ''

  const artist =
    request.nextUrl.searchParams
      .get('artist')
      ?.trim() ?? ''

  if (
  !manualQuery &&
  (!song || !artist)
) {
    return NextResponse.json(
  {
    error:
      'Informe uma música para pesquisar.',
  },
  {
    status: 400,
  },
)
  }

  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'A chave da YouTube Data API não foi configurada.',
      },
      {
        status: 500,
      },
    )
  }

  try {
    const query =
  manualQuery ||
  `${artist} ${song}`

    const params = new URLSearchParams({
      part: 'snippet',
      type: 'video',
      q: query,
      maxResults: '25',
      videoEmbeddable: 'true',
      safeSearch: 'none',
      regionCode: 'BR',
      key: apiKey,
    })

    if (manualQuery) {
  params.set('videoCategoryId', '10')
}

    const response = await fetch(
  `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
  {
    cache: 'force-cache',
    next: {
      revalidate: manualQuery
        ? 604800
        : 2592000,
    },
  },
)

    const data: YouTubeSearchResponse =
      await response.json()

    if (!response.ok) {
  const upstreamMessage =
    data.error?.message ??
    `YouTube respondeu com ${response.status}`

  console.error(
    'YouTube search.list falhou:',
    {
      status: response.status,
      query,
      song,
      artist,
      manualQuery,
      message: upstreamMessage,
    },
  )

  return NextResponse.json(
    {
      error:
        'A busca no YouTube falhou.',
      details: upstreamMessage,
      upstreamStatus: response.status,
    },
    {
      status: 502,
    },
  )
}

    const videoIds = (data.items ?? [])
  .map((item) => item.id?.videoId)
  .filter(
    (videoId): videoId is string =>
      Boolean(videoId),
  )

const viewsByVideoId =
  new Map<string, number>()

  

  const durationByVideoId =
  new Map<string, number>()

if (videoIds.length > 0) {
  const detailsParams =
    new URLSearchParams({
      part: 'statistics',
      id: videoIds.join(','),
      key: apiKey,
    })

  const detailsResponse = await fetch(
  `https://www.googleapis.com/youtube/v3/videos?${detailsParams.toString()}`,
  {
    cache: 'force-cache',
    next: {
      revalidate: manualQuery
        ? 604800
        : 2592000,
    },
  },
)

  if (detailsResponse.ok) {
    const detailsData: YouTubeVideosResponse =
      await detailsResponse.json()

    for (const item of detailsData.items ?? []) {
  if (!item.id) continue

  viewsByVideoId.set(
    item.id,
    Number(
      item.statistics?.viewCount ?? 0,
    ),
  )

  durationByVideoId.set(
    item.id,
    parseYouTubeDuration(
      item.contentDetails?.duration ?? '',
    ),
  )
}
  }
}

    const rankedVideos: RankedVideo[] =
      (data.items ?? [])
        .map((item, index) => {
          const videoId =
            item.id?.videoId ?? ''

          const title = decode(
  item.snippet?.title ?? '',
)

          const channel =
            item.snippet?.channelTitle ?? ''

            const durationSeconds =
  durationByVideoId.get(videoId) ?? 0

          const thumbnail =
            item.snippet?.thumbnails?.high?.url ??
            item.snippet?.thumbnails?.medium?.url ??
            item.snippet?.thumbnails?.default?.url ??
            `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

            const viewCount =
  viewsByVideoId.get(videoId) ?? 0

const popularityBonus =
  viewCount > 0
    ? Math.log10(viewCount + 1) * 6
    : 0

          return {
  videoId,
  title,
  channel,
  thumbnail,
  viewCount,
  durationSeconds,

  score: manualQuery
    ? scoreManualVideo(
        title,
        channel,
        manualQuery,
      )
    : scoreVideo(
        title,
        channel,
        song,
        artist,
      ),
}
        })
        .filter((item) => {
  if (!item.videoId) {
    return false
  }

  if (
    manualQuery &&
    item.durationSeconds > 0 &&
    item.durationSeconds < 45
  ) {
    return false
  }

  return true
})
        .sort((first, second) => {
  if (!manualQuery) {
    return second.score - first.score
  }

  const queryWords = getWords(manualQuery)

  const firstSource =
    `${first.title} ${first.channel}`

  const secondSource =
    `${second.title} ${second.channel}`

  const firstMatches =
    countMatchingWords(
      firstSource,
      queryWords,
    )

  const secondMatches =
    countMatchingWords(
      secondSource,
      queryWords,
    )

  /*
   * 1. Primeiro vence quem corresponde
   * a mais palavras da pesquisa.
   *
   * Ex:
   * "lets face it bunii"
   *
   * O bunii deve bater todas.
   */
  if (firstMatches !== secondMatches) {
    return secondMatches - firstMatches
  }

  /*
   * 2. Busca de UMA palavra é muito ambígua.
   *
   * Ex:
   * "Creep"
   *
   * Se os resultados são válidos e ambos
   * correspondem a "Creep", priorizamos
   * o mais popular.
   */
  if (queryWords.length === 1) {
    const firstIsBad =
      first.score < 0

    const secondIsBad =
      second.score < 0

    // Lyrics, slowed, karaoke etc.
    // nunca passam na frente de um normal.
    if (firstIsBad !== secondIsBad) {
      return firstIsBad ? 1 : -1
    }

    if (
      !firstIsBad &&
      first.viewCount !== second.viewCount
    ) {
      return (
        second.viewCount -
        first.viewCount
      )
    }
  }

  /*
   * 3. Em buscas específicas,
   * relevância volta a mandar.
   */
  const scoreDifference =
    second.score - first.score

  if (Math.abs(scoreDifference) > 30) {
    return scoreDifference
  }

  /*
   * 4. Popularidade só desempata
   * buscas específicas.
   */
  return (
    second.viewCount -
    first.viewCount
  )
})

    const selectedVideo =
      rankedVideos[0]

    if (!selectedVideo) {
      return NextResponse.json(
        {
          error:
            'Nenhum vídeo foi encontrado.',
        },
        {
          status: 404,
        },
      )
    }

    return NextResponse.json({
      videoId: selectedVideo.videoId,
      title: selectedVideo.title,
      thumbnail: selectedVideo.thumbnail,
      duration: null,
      url:
        `https://www.youtube.com/watch?v=${selectedVideo.videoId}`,
      channel: selectedVideo.channel,
      verified: false,
      score: selectedVideo.score,
      alternatives: rankedVideos
        .slice(0, 3)
        .map((video) => ({
          title: video.title,
          channel: video.channel,
          score: video.score,
        })),
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido'

    console.error(
      'Erro em /api/youtube-search:',
      message,
    )

    return NextResponse.json(
      {
        error:
          'Não foi possível buscar a música no YouTube.',
        details: message,
      },
      {
        status: 502,
      },
    )
  }
}