import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type DiscordUser = {
  id: string
  banner?: string | null
}

export async function GET() {
  const userId = '1314652031675531380'
  const token = process.env.DISCORD_BOT_TOKEN

  if (!token) {
  return NextResponse.json(
    {
      error: 'DISCORD_BOT_TOKEN não configurado',
    },
    {
      status: 500,
    },
  )
}

  try {
    const response = await fetch(
      `https://discord.com/api/v10/users/${userId}`,
      {
        headers: {
          Authorization: `Bot ${token}`,
        },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error(
        `Discord respondeu com ${response.status}`,
      )
    }

    const user: DiscordUser =
      await response.json()

      console.log('Discord user:', user)

if (!user.banner) {
  return NextResponse.json({
    bannerUrl: null,
    debug: {
      userId: user.id,
      banner: user.banner,
    },
  })
}

    if (!user.banner) {
      return NextResponse.json({
        bannerUrl: null,
      })
    }

    const extension =
      user.banner.startsWith('a_')
        ? 'gif'
        : 'webp'

    const bannerUrl =
      `https://cdn.discordapp.com/banners/` +
      `${user.id}/${user.banner}.${extension}?size=4096`

    return NextResponse.json({
      bannerUrl,
    })
  } catch (error) {
    console.error(
      'Erro ao buscar banner do Discord:',
      error,
    )

    return NextResponse.json({
      bannerUrl: null,
    })
  }
}