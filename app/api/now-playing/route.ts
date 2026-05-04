import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const DISCORD_ID = '1184191270248251512'

  const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, {
    cache: 'no-store'
  })

  const { data } = await res.json()

  if (!data.listening_to_spotify ||!data.spotify) {
    return NextResponse.json({ isPlaying: false })
  }

  const progress = Date.now() - data.spotify.timestamps.start
  const duration = data.spotify.timestamps.end - data.spotify.timestamps.start

  return NextResponse.json({
    isPlaying: true,
    song: data.spotify.song,
    artist: data.spotify.artist,
    albumArt: data.spotify.album_art_url,
    progress,
    duration
  })
}