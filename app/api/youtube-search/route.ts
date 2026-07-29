import {
  NextRequest,
  NextResponse,
} from 'next/server'

import { decode } from 'he'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

type RankedVideo = {
  videoId: string
  title: string
  channel: string
  thumbnail: string
  score: number
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
  titleValue: string,
  channelValue: string,
  song: string,
  artist: string,
) {
  const title = normalizeText(titleValue)
  const channel = normalizeText(channelValue)

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

  if (channel.endsWith(' topic')) {
    score += 50
  }

  if (
    title.includes('official') ||
    title.includes('visualizer')
  ) {
    score += 15
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
      title.includes(normalizedTerm)

    const requestedHasTerm =
      normalizedSong.includes(normalizedTerm)

    if (resultHasTerm && !requestedHasTerm) {
      score -= 250
    }
  }

  if (songMatches === 0) {
    score -= 200
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

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
      {
        cache: 'no-store',
      },
    )

    const data: YouTubeSearchResponse =
      await response.json()

    if (!response.ok) {
      throw new Error(
        data.error?.message ??
          `YouTube respondeu com ${response.status}`,
      )
    }

    const rankedVideos: RankedVideo[] =
      (data.items ?? [])
        .map((item) => {
          const videoId =
            item.id?.videoId ?? ''

          const title = decode(
  item.snippet?.title ?? '',
)

          const channel =
            item.snippet?.channelTitle ?? ''

          const thumbnail =
            item.snippet?.thumbnails?.high?.url ??
            item.snippet?.thumbnails?.medium?.url ??
            item.snippet?.thumbnails?.default?.url ??
            `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

          return {
            videoId,
            title,
            channel,
            thumbnail,
            score: scoreVideo(
              title,
              channel,
              song,
              artist,
            ),
          }
        })
        .filter((item) => item.videoId)
        .sort(
          (first, second) =>
            second.score - first.score,
        )

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