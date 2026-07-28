import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim()

  if (!query) {
    return NextResponse.json(
      {
        error: 'Informe uma música para buscar.',
      },
      {
        status: 400,
      },
    )
  }

  try {
    const response = await fetch(
      `https://server1.mtabrasil.com.br/search?q=${encodeURIComponent(query)}`,
      {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error(
        `Servidor de busca respondeu com ${response.status}`,
      )
    }

    const data: SearchResponse = await response.json()

    const videos = (data.items ?? []).filter((item) => {
      return (
        item.type === 'video' &&
        Boolean(item.id) &&
        !item.isLive &&
        !item.isUpcoming
      )
    })

    if (videos.length === 0) {
      return NextResponse.json(
        {
          error: 'Nenhum vídeo foi encontrado.',
        },
        {
          status: 404,
        },
      )
    }

    const selectedVideo =
      videos.find((item) => item.author?.verified) ??
      videos[0]

    return NextResponse.json({
      videoId: selectedVideo.id,
      title: selectedVideo.name,
      thumbnail: selectedVideo.thumbnail,
      duration: selectedVideo.duration ?? null,
      url: selectedVideo.url,
      channel: selectedVideo.author?.name ?? null,
      verified: selectedVideo.author?.verified ?? false,
    })
  } catch (error) {
    console.error('Erro em /api/youtube-search:', error)

    return NextResponse.json(
      {
        error: 'Não foi possível buscar a música no YouTube.',
      },
      {
        status: 502,
      },
    )
  }
}