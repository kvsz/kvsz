export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=Interstellar`
  )

  const data = await response.json()

  return Response.json(data)
}