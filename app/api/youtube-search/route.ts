import {
  NextRequest,
  NextResponse,
} from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type SearchItem = {
  type: string
  name: string
  id: string
  url: string
  thumbnail: string
  duration?: string
  isLive?: boolean
  isUpcoming?: boolean
  author?: {
    name?: string
    verified?: boolean
  }
}

type SearchResponse = {
  query?: string
  items?: SearchItem[]
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
  item: SearchItem,
  song: string,
  artist: string,
) {
  const title = normalizeText(item.name)
  const channel = normalizeText(
  item.author?.name ?? '',
)
  const normalizedSong = normalizeText(song)
  const normalizedArtist = normalizeText(artist)

  const songWords = getWords(song)
  const artistWords = getWords(artist)

  const songMatches = countMatchingWords(
    item.name,
    songWords,
  )

  const artistMatchesInTitle = countMatchingWords(
    item.name,
    artistWords,
  )

  const artistMatchesInChannel =
    countMatchingWords(
      item.author?.name ?? '',
      artistWords,
    )

  let score = 0

  if (title.includes(normalizedSong)) {
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

  if (item.author?.verified) {
    score += 10
  }

  if (item.author?.verified) {
  score += 10
}

if (channel.endsWith(' topic')) {
  score += 35
}

  if (
    title.includes('official audio') ||
    title.includes('official video') ||
    title.includes('official music video')
  ) {
    score += 12
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
]

if (
  unwantedVersions.some((term) =>
    title.includes(term),
  )
) {
  score -= 200
}

  if (songMatches === 0) {
    score -= 150
  }

  return score
}

export async function GET(
  request: NextRequest,
) {
  const song =
    request.nextUrl.searchParams
      .get('song')
      ?.trim() ?? ''

  const artist =
    request.nextUrl.searchParams
      .get('artist')
      ?.trim() ?? ''

  if (!song || !artist) {
    return NextResponse.json(
      {
        error:
          'Informe o nome da música e o artista.',
      },
      {
        status: 400,
      },
    )
  }

  try {
    const queries = [
  `"${song}" "${artist}"`,
  `${artist} ${song}`,
  `"${song}"`,
]

const responses = await Promise.all(
  queries.map(async (query) => {
    try {
      const response = await fetch(
        `https://server1.mtabrasil.com.br/search?q=${encodeURIComponent(
          query,
        )}`,
        {
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        },
      )

      if (!response.ok) {
        console.error(
          `Busca "${query}" respondeu com ${response.status}`,
        )

        return [] as SearchItem[]
      }

      const data: SearchResponse =
        await response.json()

      return data.items ?? []
    } catch (error) {
      console.error(
        `Erro na busca "${query}":`,
        error,
      )

      return [] as SearchItem[]
    }
  }),
)

const allItems = responses.flat()

const uniqueItems = Array.from(
  new Map(
    allItems
      .filter((item) => Boolean(item.id))
      .map((item) => [item.id, item]),
  ).values(),
)

    const blockedTerms = [
  'sped up',
  'speed up',
  'speedup',
  'slowed',
  'slowed down',
  'slow down',
  'nightcore',
  'bass boosted',
  '8d',

  // Versões ao vivo
  'live',
  'ao vivo',
  'concert',
  'festival',
  'performance',
  'session',
  'acoustic session',
  'unplugged',
  'tour',
  'las vegas',
  'madison square garden',
  'lollapalooza',
  'rock in rio',
  'tiny desk',
]

const normalizedRequestedSong =
  normalizeText(song)

const videos = uniqueItems.filter((item) => {
  if (
    item.type !== 'video' ||
    !item.id ||
    item.isLive ||
    item.isUpcoming
  ) {
    return false
  }

  const normalizedTitle =
    normalizeText(item.name)

  return !blockedTerms.some((term) => {
    const resultHasTerm =
      normalizedTitle.includes(term)

    const requestedHasTerm =
      normalizedRequestedSong.includes(term)

    return resultHasTerm && !requestedHasTerm
  })
})

    if (videos.length === 0) {
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

    const rankedVideos = videos
      .map((video) => ({
        video,
        score: scoreVideo(
          video,
          song,
          artist,
        ),
      }))
      .sort(
        (first, second) =>
          second.score - first.score,
      )

    const selectedVideo =
      rankedVideos[0]?.video

    if (!selectedVideo) {
      return NextResponse.json(
        {
          error:
            'Nenhum resultado compatível foi encontrado.',
        },
        {
          status: 404,
        },
      )
    }

    return NextResponse.json({
      videoId: selectedVideo.id,
      title: selectedVideo.name,
      thumbnail:
        selectedVideo.thumbnail,
      duration:
        selectedVideo.duration ?? null,
      url: selectedVideo.url,
      channel:
        selectedVideo.author?.name ??
        null,
      verified:
        selectedVideo.author?.verified ??
        false,

      score: rankedVideos[0].score,
      alternatives: rankedVideos
        .slice(0, 3)
        .map(({ video, score }) => ({
          title: video.name,
          channel:
            video.author?.name ?? null,
          score,
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