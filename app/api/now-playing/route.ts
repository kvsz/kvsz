import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const DISCORD_ID = '1314652031675531380'

  const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, {
    cache: 'no-store'
  })

  const { data } = await res.json()

  if (data.listening_to_spotify && data.spotify) {
    const trackData = {
      isPlaying: true,
      song: data.spotify.song,
      artist: data.spotify.artist,
      albumArt: data.spotify.album_art_url,
      progress: Date.now() - data.spotify.timestamps.start,
      duration: data.spotify.timestamps.end - data.spotify.timestamps.start,
      fallback: false,
      timestampStart: data.spotify.timestamps.start,
      timestampEnd: data.spotify.timestamps.end,
    }

    await kv.set('last-track', trackData)
    return NextResponse.json(trackData)
  }

  const lastTrack = await kv.get('last-track')

  if (lastTrack) {
    return NextResponse.json({
      ...lastTrack,
      isPlaying: false,
      fallback: true,
      progress: 0,
    })
  }

  return NextResponse.json({
    isPlaying: false,
    song: 'Nenhuma música ainda',
    artist: '07',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b27333c1f5879f6d6d2ce284a906',
    fallback: true,
    progress: 0,
    duration: 0,
  })
}