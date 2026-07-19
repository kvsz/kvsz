import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const FRIENDS_PER_PAGE = 16
const MAX_FRIENDS = 100

type ThumbnailResponse = {
  data?: Array<{
    targetId: number
    state: string
    imageUrl: string
  }>
}

async function fetchJson<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Roblox respondeu com status ${response.status}`)
  }

  return response.json()
}

async function loadFriendsPage(
  userId: string,
  page: number,
) {
  const friendsResponse = await fetchJson<any>(
    `https://friends.roblox.com/v1/users/${userId}/friends?userSort=0&limit=${MAX_FRIENDS}`,
  )

  const allFriends = friendsResponse.data || []

  const start = page * FRIENDS_PER_PAGE
  const end = start + FRIENDS_PER_PAGE

  const pageFriends = allFriends.slice(start, end)

  const pageFriendIds = pageFriends.map(
    (friend: any) => friend.id,
  )

  const friendIds = pageFriendIds.join(',')

  const [friendThumbnails, friendUsersResponse] =
    await Promise.all([
      friendIds
        ? fetchJson<ThumbnailResponse>(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${friendIds}&size=150x150&format=Png&isCircular=true`,
          )
        : Promise.resolve({ data: [] }),

      pageFriendIds.length
        ? fetchJson<{
            data?: Array<{
              id: number
              name: string
              displayName: string
            }>
          }>(
            'https://users.roblox.com/v1/users',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userIds: pageFriendIds,
                excludeBannedUsers: false,
              }),
            },
          )
        : Promise.resolve({ data: [] }),
    ])

  const friendImages = new Map<number, string>(
    (friendThumbnails.data || []).map((item) => [
      item.targetId,
      item.imageUrl,
    ]),
  )

  const friendUsers = new Map<
    number,
    {
      name: string
      displayName: string
    }
  >(
    (friendUsersResponse.data || []).map((friend) => [
      friend.id,
      {
        name: friend.name,
        displayName: friend.displayName,
      },
    ]),
  )

  return {
    page,

    friendsList: pageFriends.map((friend: any) => {
      const user = friendUsers.get(friend.id)

      return {
        id: friend.id,
        name: user?.name || '',
        displayName:
          user?.displayName ||
          user?.name ||
          '',
        avatar: friendImages.get(friend.id) || '',
      }
    }),

    totalFriendPages: Math.max(
      1,
      Math.ceil(
        allFriends.length / FRIENDS_PER_PAGE,
      ),
    ),

    totalLoadedFriends: allFriends.length,
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const friendsOnly =
    request.nextUrl.searchParams.get('friendsOnly') === '1'

  const pageParam = Number(
    request.nextUrl.searchParams.get('page') || '0',
  )

  const page =
    Number.isInteger(pageParam) && pageParam >= 0
      ? pageParam
      : 0

  if (!userId || !/^\d+$/.test(userId)) {
    return NextResponse.json(
      { error: 'ID do usuário inválido' },
      { status: 400 },
    )
  }

  try {
    /*
     * Nas páginas seguintes, carrega somente os amigos
     * e os 14 avatares daquela página.
     */
    if (friendsOnly) {
      const friendsPage = await loadFriendsPage(userId, page)

      return NextResponse.json(friendsPage)
    }

    /*
     * Ao abrir o modal, carrega o perfil completo
     * junto com somente a primeira página de amigos.
     */
    const [
  profile,
  friendsCount,
  followersCount,
  followingCount,
  groupsResponse,
  avatarResponse,
  avatarDetailsResponse,
  firstFriendsPage,
] = await Promise.all([
  fetchJson<any>(
    `https://users.roblox.com/v1/users/${userId}`,
  ),

  fetchJson<any>(
    `https://friends.roblox.com/v1/users/${userId}/friends/count`,
  ),

  fetchJson<any>(
    `https://friends.roblox.com/v1/users/${userId}/followers/count`,
  ),

  fetchJson<any>(
    `https://friends.roblox.com/v1/users/${userId}/followings/count`,
  ),

  fetchJson<any>(
    `https://groups.roblox.com/v2/users/${userId}/groups/roles`,
  ),

  fetchJson<ThumbnailResponse>(
    `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=720x720&format=Png&isCircular=false`,
  ),

  fetchJson<{
    assets?: Array<{
      id: number
      name: string
      assetType?: {
        id: number
        name: string
      }
    }>
  }>(
    `https://avatar.roblox.com/v1/users/${userId}/avatar`,
  ),

  loadFriendsPage(userId, 0),
])

    const groups = groupsResponse.data || []

const allowedWearingAssetTypeIds = new Set([
  8,  // Hat / acessório de cabeça
  11, // Camisa clássica
  12, // Calça clássica
  41, // Cabelo
  42, // Acessório de rosto
  43, // Acessório de pescoço
  44, // Acessório de ombro
  45, // Acessório frontal
  46, // Acessório traseiro
  47, // Acessório de cintura
])

const wearingAssets = (
  avatarDetailsResponse.assets || []
).filter((asset) =>
  asset.assetType?.id !== undefined &&
  allowedWearingAssetTypeIds.has(asset.assetType.id),
)

const wearingAssetIds = wearingAssets.map(
  (asset) => asset.id,
)

const wearingThumbnails = wearingAssetIds.length
  ? await fetchJson<ThumbnailResponse>(
      `https://thumbnails.roblox.com/v1/assets?assetIds=${wearingAssetIds.join(
        ',',
      )}&size=150x150&format=Png&isCircular=false`,
    )
  : { data: [] }

const wearingImages = new Map<number, string>(
  (wearingThumbnails.data || []).map((item) => [
    item.targetId,
    item.imageUrl,
  ]),
)

const groupIds = groups
  .slice(0, 20)
  .map((item: any) => item.group.id)
  .join(',')

    const groupThumbnails = groupIds
      ? await fetchJson<ThumbnailResponse>(
          `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupIds}&size=150x150&format=Png&isCircular=false`,
        )
      : { data: [] }

    const groupImages = new Map<number, string>(
      (groupThumbnails.data || []).map((item) => [
        item.targetId,
        item.imageUrl,
      ]),
    )

    return NextResponse.json({
      id: profile.id,
      name: profile.name,
      displayName: profile.displayName,
      description: profile.description || '',
      created: profile.created,
      avatar: avatarResponse.data?.[0]?.imageUrl || '',

      friends: friendsCount.count || 0,
      followers: followersCount.count || 0,
      following: followingCount.count || 0,

      wearing: wearingAssets.map((asset) => ({
  id: asset.id,
  name: asset.name,
  type: asset.assetType?.name || '',
  image: wearingImages.get(asset.id) || '',
})),

      friendsList: firstFriendsPage.friendsList,
      totalFriendPages: firstFriendsPage.totalFriendPages,

      groups: groups.slice(0, 20).map((item: any) => ({
        id: item.group.id,
        name: item.group.name,
        memberCount: item.group.memberCount,
        role: item.role?.name || 'Membro',
        icon: groupImages.get(item.group.id) || '',
      })),
    })
  } catch (error) {
    console.error('Erro na API do Roblox:', error)

    return NextResponse.json(
      { error: 'Não foi possível carregar os dados do Roblox' },
      { status: 500 },
    )
  }
}